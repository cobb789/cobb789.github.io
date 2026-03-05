---
layout: post
title: "为 AI Agent 重写你的 CLI：被忽视的接口革命"
date: 2026-03-05
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, CLI, developer-tools, LLM]
pin: false
---

今天 Hacker News 上一篇文章引起了不少讨论：「You Need to Rewrite Your CLI for AI Agents」。标题很直接，观点也很尖锐——我们花了大量精力构建面向人类的 CLI，但 AI Agent 正在成为 CLI 的主要消费者，而现有的 CLI 设计对它们来说几乎是灾难。

## 问题出在哪

传统 CLI 的设计哲学是「面向人类的可读输出」。彩色文字、进度条、表格对齐、交互式提示——这些对人类友好的特性，对 AI Agent 来说全是噪声。

想想一个典型场景：AI Agent 需要调用 `kubectl get pods` 获取 Pod 状态。它拿到的是一个精心对齐的 ASCII 表格，然后不得不用正则或字符串分割去解析这个为人类眼睛优化的格式。这不是在用工具，这是在逆向工程一个显示层。

更棘手的问题：

- **交互式提示**会让 Agent 直接卡死（"Are you sure? [y/N]"）
- **非结构化错误信息**让 Agent 无法判断失败原因和重试策略
- **隐式状态依赖**（环境变量、配置文件、登录态）让 Agent 的行为变得不可预测
- **退出码语义不够丰富**，一个非零退出码无法区分"参数错误"和"网络超时"

## AI-Native CLI 该怎么设计

核心原则其实很简单：**把 CLI 当 API 来设计**。

**1. 结构化输出是必须的**

```bash
# 人类模式（默认）
$ myctl list services
NAME        STATUS    REPLICAS
web-api     Running   3/3
worker      Failed    0/2

# Agent 模式
$ myctl list services --output json
{"services":[{"name":"web-api","status":"running","replicas":{"ready":3,"desired":3}},{"name":"worker","status":"failed","replicas":{"ready":0,"desired":2}}]}
```

`--output json` 不是新概念——kubectl、gh、docker 都支持。但问题是，很多工具的 JSON 输出只是把表格换了个格式，schema 不稳定、缺少类型信息。AI Agent 需要的是**契约化的结构化输出**，有明确的 schema 版本和字段语义。

**2. 消灭交互式提示**

所有确认操作必须支持 `--yes` 或 `--force`。所有输入参数必须支持通过 flag 传入，而不是只能通过交互式问答。对 Agent 来说，一个需要交互的 CLI 等于一个不可用的 CLI。

**3. 错误信息也要结构化**

```json
{"error":{"code":"AUTH_EXPIRED","message":"Token expired","retryable":true,"suggestion":"Run 'myctl auth refresh'"}}
```

Agent 需要知道：这个错误是什么类型？可以重试吗？怎么修复？自然语言的错误提示对 Agent 来说毫无价值。

**4. 提供机器可读的能力描述**

```bash
$ myctl --capabilities
{"commands":[{"name":"list","subcommands":["services","pods"],"flags":["--output","--namespace"]}]}
```

这本质上是在做 CLI 层面的 tool description。MCP 和 function calling 在做的事情，CLI 也需要做。

## 为什么现在是关键时刻

AI Agent 的工作方式正在从「调 API」向「用工具」转变。Claude 的 computer use、GPT 的 function calling、各种 Agent 框架的 tool 抽象——它们越来越多地直接调用 CLI 命令。

但大部分 CLI 工具还活在「只有人类会用我」的假设里。这个 gap 正在被以下方式填补：

- **包装层**：在原有 CLI 外面套一层 JSON 解析（丑陋但有效）
- **MCP Server**：为 CLI 工具提供结构化的 Agent 接口（正确方向但成本高）
- **重写**：从头设计 AI-first 的 CLI（最彻底但最慢）

现实是，像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台在接入不同模型时，也面临类似的接口标准化问题——每个模型的 API 格式不同，就像每个 CLI 的输出格式不同一样。统一接口层的价值，在 CLI 和 API 层面是相通的。

## 我的判断

这不是一个「nice to have」的优化，而是一个正在发生的范式转变。CLI 工具的用户画像正在从「100% 人类」变成「50% 人类 + 50% Agent」，而且 Agent 的比例只会越来越高。

对工具开发者来说，最务实的起步方式：

1. **加 `--output json`**——今天就可以做
2. **加 `--yes` flag**——消灭所有交互式确认
3. **丰富退出码**——不同错误类型用不同退出码
4. **写一个 tool description**——无论是 MCP 格式还是 OpenAPI 格式

不需要重写整个 CLI。但如果你今天还在设计新工具时只考虑人类用户，那你可能正在构建一个半成品。

---

*Agent 时代的基础设施，从一个 `--output json` 开始。*
