---
layout: post
title: "LiteLLM 供应链投毒全解析：自查手册 + 防护指南"
date: 2026-03-25 16:00:00 +0800
author: Cobb
categories: [AI, Dev]
tags: [AI, security, supply-chain, LiteLLM, PyPI, DevSecOps]
pin: true
---

> 2026 年 3 月 24 日，litellm 被植入后门。如果你的项目直接或间接依赖它，这篇文章帮你判断是否受影响，以及怎么保护自己。

---

## 事件概述

**litellm** 是 Python 生态中最流行的 LLM 统一调用库——OpenAI、Anthropic、Google、AWS Bedrock 等几十个模型供应商，一套代码调用。几乎所有主流 AI Agent 框架都直接或间接依赖它。据 Wiz 数据，litellm 存在于 **36% 的云环境**中。

3 月 24 日，攻击组织 **TeamPCP** 通过入侵 LiteLLM CI/CD 中的安全扫描工具 Trivy，窃取了 PyPI 发布凭证，推送了两个恶意版本：

- **1.82.7**：恶意代码在 `proxy_server.py` 中，import 时触发
- **1.82.8**（更危险）：增加了 `.pth` 文件，**只要启动 Python 就会执行，不需要 import litellm**

两个版本已从 PyPI 下架。**受影响时间窗口：3 月 24 日 10:39-16:00 UTC。**

## 攻击做了什么

三个阶段，层层递进：

**第一阶段——凭证收割：** 扫描系统中所有敏感文件——SSH 密钥、AWS/GCP/Azure 凭证、Kubernetes 配置、`.env` 文件、所有环境变量。打包加密后发送到攻击者服务器。

**第二阶段——Kubernetes 横向移动：** 如果在 K8s 环境中，利用 service account 枚举所有节点，在每个节点部署特权 Pod，通过 chroot 获取宿主机控制权。

**第三阶段——持久化后门：** 安装 systemd 服务，每 50 分钟轮询攻击者服务器获取新指令。**即使你卸载了 litellm，后门仍然存在。**

## 你受影响了吗？

### 快速判断

先回答一个问题：**你用 litellm 吗？**

终端里执行 `pip show litellm`：

- **没安装** → ✅ 基本安全（但建议检查间接依赖，很多 AI 框架会偷偷拉它）
- **版本 ≤ 1.82.6 且 3 月 24 日没做过 pip install** → ✅ 不受影响
- **版本是 1.82.7 或 1.82.8** → 🔴 确认中招，立即处置
- **使用官方 Docker 镜像** `ghcr.io/berriai/litellm` → ✅ 不受影响（依赖版本锁定）
- **使用 LiteLLM Cloud** → ✅ 不受影响

### 深度自查（4 项检查）

即使你认为自己没中招，也建议跑一遍：

**① 检查 .pth 文件（最关键）**

在终端搜索 `litellm_init.pth`。这是 v1.82.8 的攻击向量——Python 启动就自动执行。找到就说明确认被入侵。

**② 检查持久化后门**

看看 `~/.config/sysmon/` 目录是否存在，以及是否有名为 `sysmon.service` 的 systemd 服务。这是攻击者安装的持久化后门。

**③ 检查可疑网络连接**

在网络日志或防火墙日志中搜索两个域名：
- `models.litellm[.]cloud` — 数据外泄目标（不是 LiteLLM 官方域名）
- `checkmarx[.]zone` — 后门 C2 服务器

**④ Kubernetes 环境**

检查是否有最近创建的异常特权 Pod。攻击者会在每个节点上部署特权容器。

### 一键自查脚本

我写了一个自查脚本，把上面四项检查整合在一起。复制到终端直接跑：

```bash
#!/bin/bash
echo "🔍 LiteLLM 供应链攻击自查"
echo "========================="

echo ""; echo "📦 检查 litellm 安装状态..."
if pip show litellm &>/dev/null; then
    VERSION=$(pip show litellm | grep Version | awk '{print $2}')
    echo "  ⚠️  已安装，版本: $VERSION"
    [[ "$VERSION" == "1.82.7" || "$VERSION" == "1.82.8" ]] && \
        echo "  🔴 危险！已知恶意版本！"
else
    echo "  ✅ 未安装"
fi

echo ""; echo "📄 检查恶意 .pth 文件..."
PTH=$(find / -name "litellm_init.pth" 2>/dev/null)
[ -n "$PTH" ] && echo "  🔴 发现: $PTH" || echo "  ✅ 未发现"

echo ""; echo "🔧 检查持久化后门..."
if [ -f "$HOME/.config/sysmon/sysmon.py" ] || \
   [ -f "$HOME/.config/systemd/user/sysmon.service" ]; then
    echo "  🔴 发现后门！"
else
    echo "  ✅ 未发现"
fi

echo ""; echo "🔎 检查可疑进程..."
PROCS=$(ps aux 2>/dev/null | grep -E "sysmon|checkmarx" | grep -v grep)
[ -n "$PROCS" ] && echo "  🔴 $PROCS" || echo "  ✅ 未发现"

echo ""; echo "========================="
echo "即使全部通过，如果 3月24日 10:39-16:00 UTC"
echo "期间执行过未锁定版本的 pip install litellm，"
echo "仍建议轮换所有凭证。"
```

## 中招了怎么办

按优先级处置：

### 🔴 立即执行

1. **隔离主机**——断网或限制出站流量
2. **删除恶意文件**——卸载 litellm，删除 `litellm_init.pth`，删除 `~/.config/sysmon/` 目录
3. **停止后门服务**——停止并删除 `sysmon.service`
4. **重装安全版本**——`pip install litellm==1.82.6`

### 🟠 24 小时内完成

**轮换所有凭证**——这是最重要的一步：

- AWS/GCP/Azure 凭证 → 在各云控制台重新生成
- SSH 密钥 → 重新生成密钥对
- Kubernetes Token → 删除并重建 Service Account
- API Key（OpenAI/Anthropic 等）→ 在平台重新生成
- 数据库密码 → 重置
- `.env` 中的所有变量 → 全部重新生成

**为什么必须轮换？** 因为攻击的第一阶段就是把所有凭证打包发给攻击者了。即使你删了恶意代码，凭证已经泄露。

### 🟡 一周内完成

- 审计 CI/CD 流水线中所有依赖的版本锁定情况
- 检查 Docker 构建日志
- 审查网络日志，评估数据泄露范围
- K8s 环境检查所有节点是否有异常 Pod

## OfoxAI 为什么不受影响

看到这里你可能会问：你们 [OfoxAI](https://ofox.ai/zh) 用不用 litellm？

答案是：**我们不依赖 litellm，也不依赖任何第三方 LLM 代理层。**

OfoxAI 从架构设计上就选择了直接对接各模型供应商的官方 SDK，而不是通过中间层转发。原因很简单——每多一层依赖，就多一个攻击面。litellm 的便利性毋庸置疑，但当一个包成为 36% 云环境的"交通枢纽"时，它同时也成了攻击者眼中最肥的目标。

我们的安全策略：

- **零第三方 LLM 代理层**——直接对接官方 API，减少供应链攻击面
- **所有依赖版本锁定 + hash 校验**——lock 文件是强制的，不是可选的
- **CI/CD 最小权限**——发布凭证隔离，不存在"一个 token 泄露全盘崩溃"的风险
- **API Key 定期轮换 + 运行时监控**——异常出站流量会触发告警

这次事件再次验证了一个原则：**在安全上，少即是多。依赖越少，攻击面越小。**

> 如果你在选择 AI 开发平台，安全性应该是核心考量之一。了解更多：[ofox.ai](https://ofox.ai/zh?utm_source=blog&utm_medium=post&utm_campaign=litellm_security)

## 怎么防止下次再发生

这次事件的讽刺之处在于：**用来保护供应链安全的工具（Trivy），反而成了供应链攻击的入口。** 这说明安全不能靠单点防御，需要纵深布局。

### 1. 锁定依赖版本（最重要）

`pip install litellm` 不 pin 版本就是在裸奔。正确做法：

- 使用 lock 文件（`uv lock`、`poetry lock`、`pip-compile --generate-hashes`）
- Lock 文件会包含每个包的精确版本 + hash 值
- 即使 PyPI 上的包被替换，hash 不匹配也会安装失败

### 2. CI/CD 安全加固

- 使用 `--require-hashes` 安装依赖，强制校验完整性
- PyPI 发布使用 Trusted Publisher（OIDC），不要存 token
- 每个 CI job 只给最小权限
- Docker 基础镜像用 digest（`@sha256:...`）而非 tag

### 3. 运行时监控

- 你的 Python 环境不应该往未知域名发 POST 请求
- 监控 `.pth` 文件变更——正常开发中很少会动它们
- K8s 环境用 Falco 监控异常容器行为

### 4. 定期审计间接依赖

你可能没直接装 litellm，但你的 AI 框架可能偷偷拉了它。用 `pipdeptree` 看依赖树，用 `pip-audit` 检查已知漏洞。

## 更大的图景

TeamPCP 不只针对 litellm。他们的攻击已经横跨五个生态系统：

**GitHub Actions → Docker Hub → npm → Open VSX → PyPI**

每入侵一个环境，窃取的凭证就指向下一个目标。Wiz 称之为"雪球效应"：

> Trivy 被入侵 → LiteLLM 被入侵 → 数万环境的凭证泄露 → 这些凭证又指向下一个目标。我们被困在了一个循环里。

更令人担忧的是，TeamPCP 正在与勒索组织 LAPSUS$ 合作。被窃取的凭证可能被用于勒索攻击。

**这不是孤立事件，是一场持续的供应链攻击战役。**

## 事件时间线

| 时间 | 事件 |
|------|------|
| 3月20日前 | TeamPCP 入侵 Trivy GitHub Action |
| 3月24日 10:39 UTC | litellm 1.82.7 推送到 PyPI |
| 3月24日 ~12:00 UTC | litellm 1.82.8 推送（增加 .pth 自动执行） |
| 3月24日 ~14:00 UTC | 安全研究人员发现异常 |
| 3月24日 16:00 UTC | 恶意版本从 PyPI 下架 |
| 3月24日晚 | 多家安全厂商发布分析报告 |

## 一句话总结

**锁定版本、校验 hash、最小权限、监控异常。没有银弹，只有层层设防。**

---

> **信息来源：**
> - [LiteLLM 官方安全公告](https://docs.litellm.ai/blog/security-update-march-2026)
> - [The Hacker News 详细报道](https://thehackernews.com/2026/03/teampcp-backdoors-litellm-versions.html)
> - [Wiz 分析](https://www.wiz.io/blog/threes-a-crowd-teampcp-trojanizes-litellm-in-continuation-of-campaign)
> - [Snyk 分析](https://snyk.io/articles/poisoned-security-scanner-backdooring-litellm/)
>
> **博客：** [cobb789.ofox.ai](https://cobb789.ofox.ai)
