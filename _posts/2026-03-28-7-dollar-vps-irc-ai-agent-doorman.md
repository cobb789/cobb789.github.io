---
layout: post
title: "7 美元 VPS + IRC：一个极简 AI Agent 架构的启示"
date: 2026-03-28
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, IRC, VPS, architecture, self-hosting]
pin: false
---

一个开发者把 AI Agent 部署在 $7/月的 VPS 上，用 IRC 作为通信层，让访客直接和他的代码仓库对话。这个项目叫 nullclaw，架构简单到令人不安——但恰恰因此值得认真看一看。

## 问题：又一个「问我简历」的聊天框？

几乎所有个人站点的 AI 聊天功能都在做同一件事：把简历喂给模型，让访客换个方式读简历。这是个 parlor trick。模型说不出简历以外的任何东西。

nullclaw 的作者想要的是：当招聘经理问「George 怎么处理测试覆盖率」时，agent 应该去 clone 仓库、数测试文件、读 CI 配置，然后用真实代码回答——而不是输出一句「George 重视全面测试」。

## 架构：两个 Agent，两个安全边界

整体架构极其克制：

- **nullclaw（公开层）**：一个 678KB 的 Zig 二进制文件，占用约 1MB 内存。跑在公网 VPS 上，处理访客问候和项目问答，能 clone 公开仓库来佐证回答
- **ironclaw（私有层）**：跑在独立机器上，通过 Tailscale 连接，有权访问邮件和日历等私人数据
- **通信层**：IRC。没错，一个 30 年历史的协议

两个 agent 通过 IRC 频道通信：公开的 `#lobby` 和私有的 `#backoffice`。公开 agent 没有任何私人数据访问权限。这个安全边界不是技术炫耀，是设计约束。

## 为什么是 IRC？

作者给了三个理由，我认为第三个最关键：

1. **美学匹配** —— 终端风格站点配 IRC，浑然一体
2. **全栈自有** —— Ergo IRC 服务器 + gamja 客户端 + agent，全部自托管，没有第三方 API 依赖
3. **30 年的协议稳定性** —— 零供应商锁定。同一个 agent 可以通过 Web 客户端服务访客，也可以通过 irssi 在终端里和开发者对话

在所有人都在追 WebSocket、gRPC、自定义协议的时候，用 IRC 作为 agent 通信层反而是一种清醒。协议越简单，出故障的表面积越小。

## 模型分层：该省的地方省

这是我最欣赏的设计决策：

- **对话层用 Haiku 4.5** —— 打招呼、分诊、简单问答。亚秒级响应，几乎不花钱
- **工具层用 Sonnet 4.6** —— 需要 clone 仓库、读代码、跨文件分析时才启用
- **成本硬上限 $2/天**

用 Opus 来做门卫？那恰恰说明你不理解模型选择。热路径用便宜模型，重活用强模型——这才是生产级的推理分层策略。

## 安全：把公网 agent 当堡垒机对待

- SSH key-only + 非标准端口
- UFW 只开三个端口
- Cloudflare 做前置代理和 TLS 终结
- Agent 沙箱化：只读工具白名单，每小时最多 10 次操作
- $2/天 + $30/月 硬性成本上限

这套安全姿态不是过度防御。任何公网暴露的 AI agent 如果没有这些约束，迟早会被人当免费推理代理用。

## 我的观点

这个项目的价值不在于它有多复杂，在于它有多**克制**。

2026 年的 AI 开发有一种集体焦虑：不用最大的模型、不搭最复杂的 pipeline、不上 Kubernetes 编排，好像就不够「AI native」。nullclaw 证明了相反的道理——一个 678KB 的二进制 + 一个 30 年历史的协议 + 分层推理策略，就能搭出一个实用、安全、成本可控的 agent 系统。

对于想让多个模型协同工作的开发者来说，像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台让分层推理的实现成本更低——一个账号切换 Haiku、Sonnet、Opus，不用分别管理多套 API key。

有时候，最好的架构决策不是加什么，而是拒绝加什么。

---

**参考链接：** [Building a Digital Doorman](https://georgelarson.me/writing/2026-03-23-nullclaw-doorman/) | [HN 讨论](https://news.ycombinator.com/item?id=43507123)
