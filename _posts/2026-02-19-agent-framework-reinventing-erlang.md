---
layout: post
title: "你的 AI Agent 框架，不过是在重新发明 Erlang"
date: 2026-02-19
author: Cobb
categories: [AI, 架构]
tags: [Agent, Elixir, Erlang, 并发, 架构设计]
pin: false
---

今天在 Hacker News 上看到一篇很有意思的文章：《Your Agent Framework Is Just a Bad Clone of Elixir》。作者 George Guimarães 指出，2026 年 Python AI 生态里疯狂造轮子的那些 Agent 框架，核心模式（隔离状态、消息传递、监督层级、故障恢复）在 Erlang/BEAM 虚拟机上已经跑了 40 年。

这个观点很犀利，也很值得展开聊聊。

## 30 秒请求问题

传统 Web 框架为毫秒级请求设计——用户点击，服务器查库，返回 HTML，100ms 内搞定。Rails、Django、Laravel 都是这个模式。

AI Agent 打破了这个模型。一个用户提问，Agent 可能要调用 LLM 等 5-30 秒，中间还要调工具、再调 LLM、再流式输出。一个"请求"可能包含三轮 LLM 调用、两次数据库查询、一次网页搜索。而且连接全程保持。

一万个并发用户，每个连接保持 15 秒以上。传统的 thread-per-request 架构直接窒息。

而 BEAM 虚拟机天生就是干这个的。Ericsson 在 1986 年设计它来处理电话通话——最原始的长连接场景。每个通话保持状态，持续数分钟，系统需要同时处理数百万个。BEAM 的轻量进程只有 ~2KB，可以 spawn 数百万个，每个有独立堆和 GC，还有抢占式调度。

## Actor Model = Agent Model？

这是全文最核心的洞察：**Erlang 的 Actor 模型和 AI Agent 模型在架构上是同构的。**

| Actor Model (1986) | Agent Model (2026) |
|---|---|
| 轻量进程，隔离状态 | 独立 Agent，隔离上下文 |
| 消息传递通信 | Agent 间 message passing |
| Supervisor 监督树 | Orchestrator 编排层 |
| Let it crash + 自动重启 | Agent 失败重试/降级 |
| 热代码替换 | Agent 动态更新 |

对比一下就会发现，LangGraph 的状态图、CrewAI 的角色编排、AutoGen 的多 Agent 对话……这些框架在做的事情，本质上都是在 Python 里重新实现一个蹩脚版的 OTP（Erlang 的标准库框架）。

## 为什么大家不用 Erlang/Elixir？

答案很现实：**生态**。

Python 拥有 AI 领域绝对统治性的生态——PyTorch、HuggingFace、LangChain、各家 LLM SDK 全是 Python first。选技术栈不是选最优雅的语言，而是选最低摩擦的路径。

而且说实话，大部分 Agent 应用的并发需求没到需要 BEAM 级别。几十个并发 Agent？Python async 完全够用。几万个？上 Kubernetes 横向扩展也能撑住。

但这不意味着 Erlang/Elixir 的思想没有价值。恰恰相反，**理解 Actor 模型能帮你设计更好的 Agent 架构**，无论你用什么语言实现。

## 真正值得学的教训

从 Erlang 40 年的工程实践中，Agent 开发者应该带走这几点：

**1. "Let it crash" 哲学。** 别试图在 Agent 内部处理所有异常。让 Agent 崩溃，让上层 Supervisor 决定重启还是降级。大部分 Agent 框架的错误处理太脆弱——要么忽略异常，要么整个 pipeline 挂掉。

**2. 状态隔离是第一原则。** 共享状态是并发系统的万恶之源。每个 Agent 应该拥有自己的独立状态，通过明确的消息协议通信。别用全局变量或共享内存在 Agent 之间传数据。

**3. 监督树，而非扁平编排。** 多 Agent 系统需要层级化的监督结构——谁监督谁，失败了谁负责重启，哪些 Agent 可以独立失败而不影响全局。

**4. 背压和流控。** 当下游 LLM API 变慢时，上游的请求队列会无限膨胀。Erlang 社区在背压处理上积累了大量经验（GenStage、Broadway），而大部分 Agent 框架对此完全没有设计。

## 写在最后

技术领域最常见的误区就是认为"这次不一样"。AI Agent 的核心挑战——并发、状态管理、故障恢复、系统韧性——都是分布式系统的经典问题。Erlang 在 40 年前就给出了优雅的解答。

与其从零造轮子，不如先看看前人走过的路。

如果你也在关注 Agent 架构演进，想亲自对比不同模型在 Agent 场景下的表现，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号聚合 Claude、GPT、Gemini 等主流模型，方便快速验证想法。
