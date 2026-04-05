---
layout: post
title: "Apfel：你的 Mac 里藏着一个免费的 AI，Apple 不告诉你"
date: 2026-04-05
author: Cobb
categories: [AI, Tools]
tags: [AI, Apple, LLM, on-device, macOS, open-source]
pin: false
image: /assets/img/posts/apfel-free-ai-mac.png
---

从 macOS Tahoe（macOS 26）开始，每台 Apple Silicon Mac 都内置了一个约 3B 参数的语言模型。Apple 把它锁在 Siri 和 Apple Intelligence 的围墙里，普通开发者碰不到。

一个叫 [Apfel](https://github.com/Arthur-Ficial/apfel) 的开源项目把它放了出来。

## 你的 Mac 里有什么

Apple 通过 FoundationModels 框架在 macOS 26 中集成了一个本地 LLM —— 大约 3B 参数，混合 2/4-bit 量化，运行在 Neural Engine 上。4096 token 上下文窗口，支持中英日韩等多语言。

这不是什么实验性功能，而是 Apple Intelligence 的底层引擎。只是 Apple 把入口藏在了 Swift API 后面，普通用户和非 Swift 开发者根本没法直接用。

Apfel 做的事情很简单：把这个模型暴露为三个接口 —— CLI 工具、OpenAI 兼容的 HTTP 服务、交互式聊天。

```bash
brew install Arthur-Ficial/tap/apfel

# 命令行直接用
apfel "What is the capital of Austria?"

# 启动 OpenAI 兼容服务
apfel --serve
# 然后用任何 OpenAI SDK 连 localhost:11434
```

## 为什么这件事有意思

**零成本推理。** 不需要 API key，不需要订阅，不需要按 token 付费。模型已经在你的硬件上了，用就是了。

**完全本地。** 所有推理在设备上完成，没有任何数据离开你的机器。对隐私敏感的场景 —— 处理内部文档、分析私有代码、本地自动化 —— 这一点非常关键。

**OpenAI 兼容。** 这意味着现有的工具链可以直接对接。Cursor、Continue、任何用 OpenAI SDK 的应用，改个 endpoint 就能用。

**MCP 支持。** Apfel 从 v0.7 开始支持 Model Context Protocol，可以挂载外部工具服务器。这让一个 3B 的小模型也能调用计算器、查数据库、访问 API。

```bash
apfel --mcp ./mcp/calculator/server.py "What is 15 times 27?"
# tool: multiply({"a": 15, "b": 27}) = 405
# 15 times 27 is 405.
```

## 3B 模型能干什么

说实话，3B 参数、4096 上下文，这不是拿来替代 Claude 或 GPT 的。它的定位更像是：

- **快速单轮问答**：翻译、格式转换、简单计算
- **本地自动化脚本**：结合 shell pipeline 做文本处理
- **开发时的快速原型**：测试 prompt 结构，不想等 API 响应的时候
- **离线场景**：飞机上、没网的时候

4096 的上下文窗口是硬伤，做不了长文档分析。但对于 pipe-friendly 的单轮任务，响应速度和零成本的优势很明显。

## 更大的趋势

Apfel 本身是个小工具，但它指向一个重要趋势：**端侧 AI 正在从概念变成基础设施**。

Apple 在 macOS 里预装了 LLM，Google 在 Chrome 里塞了 Gemini Nano，高通和联发科在芯片层面集成 NPU。当推理能力变成操作系统的一部分，AI 应用的架构会发生根本性的变化 —— 不是所有任务都需要打一个 API call 到云端。

未来的 AI 应用大概率是混合架构：简单任务本地处理，复杂任务上云。像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台配合本地端侧推理，可能就是开发者最终的工作流 —— 轻量任务走本地零成本，重度推理走云端按需切换。

Apfel 目前 GitHub 1800+ star，MIT 协议。如果你有 Apple Silicon Mac 且升级了 macOS Tahoe，值得花 5 分钟装一个试试。

---

> 项目地址：[github.com/Arthur-Ficial/apfel](https://github.com/Arthur-Ficial/apfel)
