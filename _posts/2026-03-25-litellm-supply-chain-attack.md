---
layout: post
title: "LiteLLM 被投毒：一场波及 36% 云环境的供应链攻击"
date: 2026-03-25
author: Cobb
categories: [AI, Dev]
tags: [AI, security, supply-chain, LiteLLM, PyPI]
pin: false
---

> **信息来源：** [The Hacker News](https://thehackernews.com/2026/03/teampcp-backdoors-litellm-versions.html)、[LiteLLM 官方安全公告](https://docs.litellm.ai/blog/security-update-march-2026)、[Wiz Blog](https://www.wiz.io/blog/threes-a-crowd-teampcp-trojanizes-litellm-in-continuation-of-campaign)、[Snyk](https://snyk.io/articles/poisoned-security-scanner-backdooring-litellm/)

---

2026 年 3 月 24 日，litellm——几乎所有主流 AI Agent 框架都在用的 Python 包——被植入了后门。

攻击者 **TeamPCP** 通过入侵 LiteLLM CI/CD 流水线中的 Trivy 安全扫描依赖，窃取了 PyPI 发布凭证，推送了两个恶意版本：**1.82.7** 和 **1.82.8**。这两个版本已从 PyPI 下架，但如果你在 3 月 24 日 10:39-16:00 UTC 期间装过 litellm，你的环境可能已经被入侵。

## 攻击链：三阶段 payload

这不是随便往包里塞个挖矿脚本的小打小闹。TeamPCP 的 payload 是一个精心设计的三阶段攻击：

### 第一阶段：凭证收割

恶意代码会扫描并窃取：

- SSH 密钥
- 云服务凭证（AWS、GCP、Azure）
- Kubernetes secrets 和 service account token
- 加密货币钱包
- `.env` 文件中的所有环境变量
- 数据库密码

所有数据打包加密成 `tpcp.tar.gz`，通过 HTTPS POST 发送到攻击者控制的域名 `models.litellm[.]cloud`。

### 第二阶段：Kubernetes 横向移动

如果检测到 Kubernetes 环境，恶意代码会：

1. 利用 service account token 枚举集群中所有节点
2. 在每个节点上部署一个**特权 Pod**
3. 通过 chroot 进入宿主机文件系统

### 第三阶段：持久化后门

在每个被入侵的节点上安装一个 systemd 服务（`sysmon.service`），每 50 分钟轮询 `checkmarx[.]zone/raw` 获取下一阶段的 payload。有意思的是，如果返回的 URL 包含 `youtube[.]com`，脚本会中止执行——这是一个 kill switch。

## 两个版本的区别

**v1.82.7：** 恶意代码嵌入 `litellm/proxy/proxy_server.py`，在 `import litellm.proxy.proxy_server` 时触发。

**v1.82.8（更危险）：** 增加了 `litellm_init.pth` 文件。Python 的 `.pth` 文件会在解释器启动时被 `site.py` 自动处理——意味着**只要启动 Python，不需要 import litellm，payload 就会执行**。而且通过 `subprocess.Popen` 在后台进程中运行，更隐蔽。

## 影响范围

Wiz 的数据显示，litellm 存在于 **36% 的云环境**中。这不仅仅是直接安装 litellm 的项目——很多 AI Agent 框架、MCP server、LLM 编排工具都把 litellm 作为间接依赖。

**你可能受影响，如果：**
- 3 月 24 日 10:39-16:00 UTC 期间 `pip install litellm` 且未锁定版本
- CI/CD 流水线中有 `pip install litellm` 且未 pin 版本
- 项目的间接依赖拉取了 litellm

**你不受影响，如果：**
- 使用 LiteLLM 官方 Docker 镜像（`ghcr.io/berriai/litellm`，依赖版本锁定）
- 使用 LiteLLM Cloud
- 版本 ≤ 1.82.6 且未在受影响时间窗口升级
- 从 GitHub 源码安装（源码未被篡改）

## 攻击源头：Trivy 被入侵

这次攻击的起点不是 LiteLLM 自身，而是它 CI/CD 流水线中使用的安全扫描工具 **Trivy**。TeamPCP 先入侵了 Trivy 的 GitHub Action，窃取了 LiteLLM 的 PyPI 发布凭证，然后用这些凭证直接往 PyPI 推送了恶意包。

讽刺的是：**用来保护供应链安全的工具，反而成了供应链攻击的入口。**

## TeamPCP 是谁

TeamPCP 是一个近期非常活跃的供应链攻击组织，已经跨越了五个生态系统：

- GitHub Actions
- Docker Hub
- npm
- Open VSX（VS Code 插件市场）
- PyPI

他们在 Telegram 上发了一条嚣张的声明：

> "这些公司的业务就是保护你的供应链，但他们连自己的供应链都保护不了。现代安全研究就是个笑话。"

更令人担忧的是，Wiz 指出 TeamPCP 正在与臭名昭著的勒索组织 **LAPSUS$** 合作，形成了供应链攻击者 + 勒索集团的组合。

## 应对措施

如果你的环境可能受影响，立即执行：

1. **检查版本：** `pip show litellm`，确认不是 1.82.7 或 1.82.8
2. **检查 .pth 文件：** `find /usr -name "litellm_init.pth"` ——有就删
3. **检查网络日志：** 是否有到 `models.litellm[.]cloud` 或 `checkmarx[.]zone` 的出站流量
4. **Kubernetes 环境：** 检查是否有异常的特权 Pod
5. **轮换所有凭证：** API key、云凭证、SSH 密钥、数据库密码——全部轮换
6. **锁定版本：** pin 到 1.82.6 或更早的已知安全版本

## 我的看法

这次事件暴露了 AI 基础设施的一个系统性问题：**依赖链太长，信任链太脆弱。**

litellm 之所以被盯上，不是因为它有技术漏洞，而是因为它是 AI 生态的"交通枢纽"——几乎所有需要调用多个 LLM 的项目都会用到它。攻击者打一个点，就能辐射到 36% 的云环境。

更深层的问题是 Wiz 说的那个"雪球效应"：

> Trivy 被入侵 → LiteLLM 被入侵 → 数万环境的凭证落入攻击者手中 → 这些凭证又指向下一个目标。

供应链安全不是"装个 Trivy 扫一扫"就能解决的——当扫描工具本身都不可信的时候，整个安全模型就需要重新思考了。

对开发者来说，最实际的教训是：

- **锁定依赖版本。** `pip install litellm` 不 pin 版本就是在裸奔
- **最小权限原则。** CI/CD 流水线中的 secret 不应该能访问 PyPI 发布凭证
- **监控出站流量。** 你的 Python 环境不应该往奇怪的域名发 POST 请求
- **定期审计间接依赖。** 你可能没直接装 litellm，但你的 AI 框架可能偷偷拉了它

---

> **LiteLLM 官方安全公告：** [docs.litellm.ai/blog/security-update-march-2026](https://docs.litellm.ai/blog/security-update-march-2026)
> **The Hacker News 详细报道：** [thehackernews.com](https://thehackernews.com/2026/03/teampcp-backdoors-litellm-versions.html)
> **Wiz 分析：** [wiz.io/blog](https://www.wiz.io/blog/threes-a-crowd-teampcp-trojanizes-litellm-in-continuation-of-campaign)
