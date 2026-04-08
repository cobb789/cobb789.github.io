---
layout: post
title: "Google 开源 Scion：多 Agent 编排终于有了像样的基础设施"
date: 2026-04-08
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, Google, LLM, 开源]
pin: false
image: /assets/img/posts/google-scion-athenaeum.png
---

多 Agent 协作是 2026 年 AI 工程领域最火热的话题之一。但如果你真的动手做过，就知道这里面有多少坑：Agent 之间的状态隔离、并发冲突、凭证管理、远程执行……每一个都是工程上的硬骨头。

3 月底，Google Cloud Platform 在 GitHub 上低调开源了一个项目：**Scion**。名字取自「嫁接用的嫩枝」，定位是**实验性的多 Agent 编排测试平台**。它不是要解决所有问题，而是提供一个足够灵活的「试验田」。

## 核心思路：把 Agent 当容器管理

Scion 的设计哲学很直接：每个 Agent 都是一个独立的容器化进程，有自己的：

- **独立容器**：完全隔离的运行环境
- **独立 git worktree**：各自的代码分支，不会互相冲突
- **独立凭证**：API key、SSH 密钥等敏感信息分离

![Scion 多 Agent 可视化](/assets/img/posts/google-scion-visualization.png){: w="700" }
_Scion 运行时的 Agent 协作可视化，展示消息传递和文件访问的实际遥测数据_

这解决了多 Agent 最头疼的问题：**隔离**。当你让三个 Agent 同时改同一个项目的不同模块时，不用担心它们踩到彼此的脚。

## Harness 无关：用你熟悉的 Agent

Scion 支持主流的「深度 Agent」harness：

- Claude Code
- Gemini CLI
- Codex (OpenAI)
- OpenCode
- 任何能跑在容器里的 Agent

这不是又一个从零开始的 Agent 框架，而是一个**基础设施层**。你继续用你熟悉的 coding agent，Scion 只负责编排和隔离。

## 极简协调：让模型自己决定

有意思的是，Scion 没有设计复杂的协调协议。它的做法是：给每个 Agent 一个 CLI 工具，让模型通过自然语言 prompting 来决定如何分工协作。

这是一个很「Less is more」的设计选择。与其规定死 Agent 之间必须用某种消息格式通信，不如让 LLM 自己学习怎么用工具协调。Google 团队甚至做了一个叫 [Relics of Athenaeum](https://github.com/ptone/scion-athenaeum) 的「Agent 游戏」来验证这个思路——一组 Agent 通过群聊和私信协作解谜，整个协调逻辑完全用 Markdown 定义。

## 多运行时支持

Scion 支持多种容器运行时：

| 运行时 | 平台 |
|--------|------|
| Docker | Linux/Windows |
| Podman | Linux |
| Apple Container | macOS |
| Kubernetes | 集群部署 |

本地开发时用 Docker，团队协作时可以切到 K8s 集群，体验一致。

## 现阶段的局限

必须说清楚：Scion 还在**早期实验阶段**。官方文档明确写了：

- 本地模式相对稳定
- Hub 多机编排约 80% 可用
- Kubernetes 支持还有很多毛边

而且没有预编译的二进制和镜像，需要自己 `go install` + 构建容器镜像。这不是开箱即用的产品，是给愿意踩坑的开发者准备的试验台。

## 为什么这个方向值得关注

我对 Scion 感兴趣的原因不是它现在有多完善，而是它代表的**设计方向**：

1. **基础设施思维**：不发明新 Agent，而是让现有 Agent 更好地协作
2. **隔离优先**：用容器化解决状态和凭证隔离，而不是在应用层做 hacky 的隔离
3. **实验友好**：明确定位为 testbed，鼓励探索各种协调模式

过去一年，我们见过太多「全栈 Agent 框架」，每一个都想从头到尾定义 Agent 应该怎么构建。Scion 反其道而行之：承认这个领域还没有定论，先把基础设施做对，让大家可以快速试错。

## 快速上手

如果你想试试，最简单的流程：

```bash
# 安装（需要 Go）
go install github.com/GoogleCloudPlatform/scion/cmd/scion@latest

# 初始化机器和项目
scion init --machine
cd your-project
scion init

# 启动一个 Agent
scion start debug "帮我调试这个错误" --attach
```

常用命令：

- `scion list` - 列出活跃 Agent
- `scion attach <name>` - 连接到 Agent 的 tmux session
- `scion message <name> "..."` - 给 Agent 发消息
- `scion stop <name>` - 停止 Agent

更多细节看 [官方文档](https://googlecloudplatform.github.io/scion/)。

---

如果你在多个 AI 模型之间频繁切换做对比测试，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号搞定 Claude、GPT、Gemini 等主流模型，省掉管理多个 API key 的麻烦。

**相关链接：**
- [GitHub: GoogleCloudPlatform/scion](https://github.com/GoogleCloudPlatform/scion)
- [官方文档](https://googlecloudplatform.github.io/scion/)
- [Relics of Athenaeum (Agent Game)](https://github.com/ptone/scion-athenaeum)
