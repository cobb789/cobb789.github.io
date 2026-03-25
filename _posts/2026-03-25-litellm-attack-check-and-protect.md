---
layout: post
title: "LiteLLM 供应链投毒全解析：自查手册 + 防护指南"
date: 2026-03-25 16:00:00 +0800
author: Cobb
categories: [AI, Dev]
tags: [AI, security, supply-chain, LiteLLM, PyPI, DevSecOps]
pin: true
---

> 2026 年 3 月 24 日，litellm 被植入后门。如果你的项目直接或间接依赖 litellm，这篇文章会帮你判断是否受影响，以及如何保护自己。

---

## 事件概述

**litellm** 是一个被广泛使用的 Python 包，提供统一的 LLM API 调用接口——OpenAI、Anthropic、Google、AWS Bedrock 等几十个模型供应商，用一套代码调用。几乎所有主流 AI Agent 框架、MCP server、LLM 编排工具都直接或间接依赖它。

3 月 24 日，攻击组织 **TeamPCP** 通过入侵 LiteLLM CI/CD 流水线中的安全扫描工具 Trivy，窃取了 PyPI 发布凭证，推送了两个恶意版本：

| 版本 | 攻击方式 | 危险程度 |
|------|---------|---------|
| **1.82.7** | 恶意代码嵌入 `proxy_server.py`，import 时触发 | ⚠️ 高 |
| **1.82.8** | 增加 `litellm_init.pth`，Python 启动即执行，无需 import | 🔴 极高 |

这两个版本已从 PyPI 下架。但如果你在 **3 月 24 日 10:39-16:00 UTC** 期间安装或升级过 litellm，你的环境可能已经被入侵。

## 攻击做了什么

恶意 payload 分三个阶段：

### 阶段一：凭证收割

扫描并窃取系统中所有敏感信息：

```
~/.ssh/*                    # SSH 密钥
~/.aws/credentials          # AWS 凭证
~/.config/gcloud/*          # GCP 凭证  
~/.azure/*                  # Azure 凭证
~/.kube/config              # Kubernetes 配置
~/.env, .env                # 环境变量文件
$ENV(所有环境变量)            # 包括 API KEY、数据库密码等
```

所有数据打包加密成 `tpcp.tar.gz`，通过 HTTPS POST 发送到 `models.litellm[.]cloud`（这不是 LiteLLM 的官方域名）。

### 阶段二：Kubernetes 横向移动

如果检测到 Kubernetes 环境：

1. 利用 service account token 枚举集群所有节点
2. 在每个节点部署特权 Pod
3. 通过 chroot 进入宿主机文件系统
4. 获取宿主机完整控制权

### 阶段三：持久化

安装 systemd 服务 `sysmon.service`，每 50 分钟轮询攻击者服务器获取新指令。即使你后来卸载了 litellm，后门仍然存在。

## 第一步：判断是否受影响

### 快速判断

回答以下问题：

**Q1：你的项目用了 litellm 吗？**

```bash
# 检查直接依赖
pip show litellm 2>/dev/null && echo "⚠️ 已安装 litellm" || echo "✅ 未安装 litellm"

# 检查间接依赖（很多 AI 框架会间接依赖）
pip list 2>/dev/null | grep -i litellm
```

**Q2：版本是多少？**

```bash
pip show litellm | grep Version
# 如果显示 1.82.7 或 1.82.8 → 🔴 确认受影响
# 如果显示 ≤ 1.82.6 → 需要进一步确认（见 Q3）
```

**Q3：3 月 24 日有没有做过 pip install？**

```bash
# 检查 pip 安装日志
pip cache info
# 检查最近的 pip 操作
cat ~/.pip/pip.log 2>/dev/null | grep "litellm" | tail -20

# 检查包的安装时间
python3 -c "
import importlib.metadata, os, datetime
try:
    dist = importlib.metadata.distribution('litellm')
    loc = dist._path
    mtime = os.path.getmtime(loc)
    print(f'安装位置: {loc}')
    print(f'修改时间: {datetime.datetime.fromtimestamp(mtime)}')
except Exception as e:
    print(f'未安装或无法检测: {e}')
"
```

### 判断流程图

```
你的环境有 litellm 吗？
├── 没有 → ✅ 不受影响
└── 有
    ├── 版本是 1.82.7 或 1.82.8 → 🔴 确认受影响，立即处置
    ├── 版本 ≤ 1.82.6
    │   ├── 3月24日没做过 pip install → ✅ 不受影响
    │   └── 3月24日做过 pip install → ⚠️ 可能短暂安装过恶意版本后被覆盖
    └── 使用官方 Docker 镜像 ghcr.io/berriai/litellm → ✅ 不受影响
```

## 第二步：深度自查（IoC 检测）

即使你认为自己不受影响，也建议跑一遍以下检查：

### 检查 1：.pth 文件

```bash
# 这是 v1.82.8 最危险的攻击向量
# .pth 文件会在任何 Python 进程启动时自动执行

find / -name "litellm_init.pth" 2>/dev/null
# 如果找到 → 🔴 确认被入侵

# 也检查其他可疑的 .pth 文件
find /usr/lib/python*/site-packages/ /usr/local/lib/python*/site-packages/ \
     ~/.local/lib/python*/site-packages/ \
     -name "*.pth" -newer /tmp -mtime -7 2>/dev/null
```

### 检查 2：可疑网络连接

```bash
# 检查是否有到攻击者域名的连接
# models.litellm[.]cloud — 数据外泄目标
# checkmarx[.]zone — 后门 C2 服务器

# 检查 DNS 解析记录
grep -r "models.litellm" /var/log/ 2>/dev/null
grep -r "checkmarx.zone" /var/log/ 2>/dev/null

# 检查当前网络连接
netstat -an 2>/dev/null | grep -E "443|80" | head -20
ss -tunp 2>/dev/null | grep python

# 如果有防火墙日志
grep -E "litellm\.cloud|checkmarx\.zone" /var/log/firewall* 2>/dev/null
```

### 检查 3：持久化后门

```bash
# 检查 systemd 服务（攻击者安装的后门名为 sysmon.service）
systemctl list-units --type=service 2>/dev/null | grep sysmon
ls -la ~/.config/systemd/user/sysmon.service 2>/dev/null
ls -la ~/.config/sysmon/sysmon.py 2>/dev/null

# 检查 crontab
crontab -l 2>/dev/null | grep -v "^#"

# 检查可疑进程
ps aux | grep -E "sysmon|checkmarx|litellm" | grep -v grep
```

### 检查 4：Kubernetes 环境（如适用）

```bash
# 检查是否有异常的特权 Pod
kubectl get pods --all-namespaces -o json | \
  python3 -c "
import json, sys
data = json.load(sys.stdin)
for item in data.get('items', []):
    spec = item.get('spec', {})
    for container in spec.get('containers', []):
        sc = container.get('securityContext', {})
        if sc.get('privileged'):
            name = item['metadata']['name']
            ns = item['metadata']['namespace']
            print(f'🔴 特权 Pod: {ns}/{name}')
"

# 检查最近创建的 Pod
kubectl get pods --all-namespaces --sort-by='.metadata.creationTimestamp' | tail -20
```

### 一键自查脚本

把上面的检查整合成一个脚本，方便快速执行：

```bash
#!/bin/bash
# litellm-check.sh — LiteLLM 供应链攻击自查脚本
# 使用方法: bash litellm-check.sh

echo "🔍 LiteLLM 供应链攻击自查"
echo "========================="
echo ""

# 1. 检查是否安装
echo "📦 检查 litellm 安装状态..."
if pip show litellm &>/dev/null; then
    VERSION=$(pip show litellm | grep Version | awk '{print $2}')
    echo "  ⚠️  已安装 litellm，版本: $VERSION"
    if [[ "$VERSION" == "1.82.7" || "$VERSION" == "1.82.8" ]]; then
        echo "  🔴 危险！你安装的是已知恶意版本！"
    fi
else
    echo "  ✅ 未安装 litellm"
fi
echo ""

# 2. 检查 .pth 文件
echo "📄 检查恶意 .pth 文件..."
PTH=$(find / -name "litellm_init.pth" 2>/dev/null)
if [ -n "$PTH" ]; then
    echo "  🔴 发现恶意文件: $PTH"
else
    echo "  ✅ 未发现 litellm_init.pth"
fi
echo ""

# 3. 检查持久化后门
echo "🔧 检查持久化后门..."
if [ -f "$HOME/.config/sysmon/sysmon.py" ]; then
    echo "  🔴 发现后门脚本: ~/.config/sysmon/sysmon.py"
elif [ -f "$HOME/.config/systemd/user/sysmon.service" ]; then
    echo "  🔴 发现后门服务: sysmon.service"
else
    echo "  ✅ 未发现已知持久化后门"
fi
echo ""

# 4. 检查可疑进程
echo "🔎 检查可疑进程..."
PROCS=$(ps aux 2>/dev/null | grep -E "sysmon|checkmarx" | grep -v grep)
if [ -n "$PROCS" ]; then
    echo "  🔴 发现可疑进程:"
    echo "$PROCS"
else
    echo "  ✅ 未发现可疑进程"
fi
echo ""

# 5. 检查网络连接
echo "🌐 检查可疑网络连接..."
CONNS=$(ss -tunp 2>/dev/null | grep python || netstat -an 2>/dev/null | grep python)
if [ -n "$CONNS" ]; then
    echo "  ℹ️  Python 网络连接（请人工核实）:"
    echo "$CONNS" | head -10
else
    echo "  ✅ 未发现 Python 网络连接"
fi
echo ""

echo "========================="
echo "✅ 自查完成"
echo ""
echo "即使所有检查通过，如果你在 3月24日 10:39-16:00 UTC"
echo "期间执行过 pip install litellm（未锁定版本），"
echo "仍建议轮换所有凭证作为预防措施。"
```

## 第三步：应急处置

如果确认受影响，按以下优先级处置：

### 🔴 紧急（立即执行）

```bash
# 1. 隔离受影响主机（断网或限制出站）
# 2. 删除恶意文件
pip uninstall litellm -y
find / -name "litellm_init.pth" -delete 2>/dev/null
rm -rf ~/.config/sysmon/

# 3. 停止后门服务
systemctl --user stop sysmon.service 2>/dev/null
systemctl --user disable sysmon.service 2>/dev/null
rm -f ~/.config/systemd/user/sysmon.service

# 4. 安装安全版本
pip install litellm==1.82.6
```

### 🟠 重要（24 小时内完成）

**轮换所有凭证：**

| 类型 | 操作 |
|------|------|
| AWS 凭证 | 在 IAM 控制台轮换 Access Key |
| GCP 凭证 | 重新生成 Service Account Key |
| Azure 凭证 | 在 Azure AD 重置 |
| SSH 密钥 | 重新生成密钥对，更新 authorized_keys |
| K8s Token | 删除并重建 Service Account |
| API Key | 在各平台（OpenAI/Anthropic/等）重新生成 |
| 数据库密码 | 重置并更新配置 |
| .env 中的所有变量 | 全部重新生成 |

### 🟡 后续（一周内完成）

- 审计 CI/CD 流水线中所有依赖的版本锁定情况
- 检查 Docker 构建日志，确认没有拉取过恶意版本
- 审查网络日志，评估数据泄露范围
- 如果是 K8s 环境，检查所有节点是否有异常 Pod

## 第四步：长期防护

这次事件暴露的不是某个工具的漏洞，而是整个供应链信任模型的脆弱性。以下是从根本上降低风险的措施：

### 1. 锁定依赖版本

```
# ❌ 危险写法
pip install litellm
pip install litellm>=1.80

# ✅ 安全写法  
pip install litellm==1.82.6
```

**所有项目都应该使用 lock 文件：**

```bash
# pip: 使用 pip-compile (pip-tools)
pip-compile requirements.in --generate-hashes

# poetry
poetry lock

# uv (推荐)
uv lock
```

生成的 lock 文件会包含每个包的精确版本和 hash 值。即使 PyPI 上的包被替换，hash 不匹配也会安装失败。

### 2. CI/CD 安全加固

```yaml
# ❌ 危险：CI 中直接 pip install
- run: pip install litellm

# ✅ 安全：使用 lock 文件 + hash 校验
- run: pip install --require-hashes -r requirements.txt

# ✅ 更安全：使用固定版本的 Docker 基础镜像
FROM python:3.12-slim@sha256:abc123...  # 用 digest 而非 tag
```

**CI/CD 中的 secret 管理：**

- PyPI 发布凭证使用 Trusted Publisher（OIDC），不要存 token
- 每个 CI job 只给它需要的最小权限
- 定期审计哪些 job 能访问哪些 secret

### 3. 运行时监控

```bash
# 监控 Python 环境的出站连接
# 正常的 Python 应用不应该往未知域名发 POST

# 使用 auditd 监控文件访问
auditctl -w /etc/ssh/ -p r -k ssh_access
auditctl -w ~/.aws/ -p r -k aws_access

# 使用 falco 监控容器行为（K8s 环境）
# falco 可以检测特权容器创建、异常网络连接等
```

### 4. 依赖审计

```bash
# 定期检查依赖的安全状况
pip-audit                    # 检查已知漏洞
safety check                 # 另一个漏洞检查工具

# 检查依赖树，了解间接依赖
pipdeptree | grep litellm    # 看谁引入了 litellm
```

### 5. 供应链验证

```bash
# 检查包的发布者和签名
pip download litellm==1.82.6 --no-deps
# 检查 .whl 文件的 RECORD 和签名

# 使用 Sigstore 验证（如果包支持）
python -m pip install --require-hashes --verify ...
```

## 事件时间线

| 时间 (UTC) | 事件 |
|-----------|------|
| 3月20日前 | TeamPCP 入侵 Trivy GitHub Action，窃取多个项目的 CI/CD 凭证 |
| 3月24日 10:39 | litellm 1.82.7 被推送到 PyPI（恶意代码在 proxy_server.py） |
| 3月24日 ~12:00 | litellm 1.82.8 被推送（增加 .pth 自动执行机制） |
| 3月24日 ~14:00 | 安全研究人员发现异常，开始分析 |
| 3月24日 16:00 | 恶意版本从 PyPI 下架 |
| 3月24日 14:00 ET | LiteLLM 官方发布安全公告 |
| 3月24日晚 | Endor Labs、JFrog、Wiz、Snyk 发布详细分析报告 |

## 更大的图景

TeamPCP 不只是针对 litellm。他们的攻击链已经横跨五个生态系统：

```
GitHub Actions → Trivy/KICS 被入侵
    ↓ 窃取 CI/CD 凭证
Docker Hub → 恶意镜像
npm → 恶意包
Open VSX → 恶意 VS Code 插件
PyPI → litellm 被投毒 ← 我们在这里
    ↓ 窃取云凭证
    → 下一个目标...（雪球效应）
```

Wiz 指出 TeamPCP 正在与勒索组织 LAPSUS$ 合作。这意味着被窃取的凭证可能被用于勒索攻击。

**这不是一个孤立事件，而是一场持续的、有组织的供应链攻击战役。**

## 总结

| 问题 | 答案 |
|------|------|
| **我需要担心吗？** | 如果你的项目用了 litellm（直接或间接），需要检查 |
| **最快的自查方法？** | `pip show litellm` 看版本 + `find / -name "litellm_init.pth"` |
| **如果中招了怎么办？** | 隔离 → 删除恶意文件 → 轮换所有凭证 → 安装安全版本 |
| **怎么防止以后再发生？** | 锁定版本 + hash 校验 + 最小权限 + 运行时监控 |
| **使用 Docker 镜像安全吗？** | 官方镜像 `ghcr.io/berriai/litellm` 不受影响 |

供应链安全不是装个扫描工具就能解决的——当扫描工具本身都不可信的时候，你需要的是纵深防御：锁定版本、校验 hash、最小权限、监控异常。没有银弹，只有层层设防。

---

> **自查脚本：** 复制上面的 `litellm-check.sh` 即可使用
> **LiteLLM 官方公告：** [docs.litellm.ai/blog/security-update-march-2026](https://docs.litellm.ai/blog/security-update-march-2026)
> **The Hacker News 报道：** [thehackernews.com](https://thehackernews.com/2026/03/teampcp-backdoors-litellm-versions.html)
> **Wiz 分析：** [wiz.io/blog](https://www.wiz.io/blog/threes-a-crowd-teampcp-trojanizes-litellm-in-continuation-of-campaign)
> **Snyk 分析：** [snyk.io](https://snyk.io/articles/poisoned-security-scanner-backdooring-litellm/)
> **博客：** [cobb789.ofox.ai](https://cobb789.ofox.ai)
