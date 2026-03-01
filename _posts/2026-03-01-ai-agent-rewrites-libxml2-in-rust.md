---
layout: post
title: "AI Agent 用 Rust 重写了 libxml2，而且通过了全部合规测试"
date: 2026-03-01
author: Cobb
categories: [AI, 开源]
tags: [AI Agent, Rust, XML, 开源]
pin: false
---

今天在 Hacker News 上看到一个让我停下来仔细看的项目：[xmloxide](https://github.com/jonwiggins/xmloxide)——一个纯 Rust 实现的 libxml2 替代品。它的特别之处不在于又一个 Rust 重写，而在于这个项目是由 AI Agent 主导完成的。

## libxml2 的困境

libxml2 是开源世界事实上的 XML/HTML 解析标准库，几乎无处不在。但在 2025 年 12 月，它被官方标记为不再维护，而且存在已知安全问题。这意味着无数依赖它的项目面临一个尴尬局面：继续用一个有安全隐患的库，还是自己想办法？

## Agent 交出的成绩单

xmloxide 的完成度让我意外：

- **W3C XML 合规测试 100% 通过**（1727/1727 applicable tests）
- 完整的 DOM tree、SAX2 streaming、XmlReader pull、push/incremental 四种解析 API
- XPath 1.0 完整实现
- DTD、RelaxNG、XML Schema 验证
- HTML 4.01 容错解析
- C/C++ FFI 接口，可以直接替换原有 C 项目中的 libxml2
- 零 unsafe 的公共 API，arena-based 内存管理

这不是一个玩具项目，也不是"AI 写了个 demo"。这是一个功能完备、可以投入生产的库。

## 这意味着什么

我觉得这个项目值得关注的点不在于"AI 能写代码"——这已经不是新闻了。关键在于**规模和完整性**。

libxml2 是一个经过二十多年发展的复杂库，涉及大量边界情况和规范细节。让 AI Agent 完成这样的重写，需要的不仅是代码生成能力，更需要：

1. **对规范的理解**：XML 规范本身就很复杂，W3C 合规测试覆盖了大量边界情况
2. **架构设计能力**：选择 arena-based 内存管理、零 unsafe 公共 API，这些是需要全局考量的设计决策
3. **工程完整性**：从解析到序列化、从验证到 XPath、从 Rust API 到 C FFI，每一层都要做好

这让我重新思考 AI Agent 在软件工程中的定位。它不再只是"帮你写函数"的工具，而是有可能承担**完整模块甚至完整库**的开发任务。

## 冷静看待

当然也要保持清醒。通过合规测试不等于生产就绪——性能基准、边界情况的长期验证、社区反馈下的迭代，这些都需要时间。而且我们也不清楚 Agent 在整个过程中需要多少人工引导和修正。

但方向是清晰的：AI Agent 正在从"写代码片段"走向"交付完整软件组件"。对于开发者来说，学会如何有效地指导和审查 Agent 的输出，可能比学会自己写每一行代码更重要。

## 写在最后

2025 年底 libxml2 停止维护，2026 年初就有 AI 生成的替代品通过全部合规测试。这个速度本身就说明了一些问题。

如果你也在关注 AI 编程的能力边界，想亲自体验不同模型在代码任务上的表现差异，可以试试 [OfoxAI](https://ofox.ai)（ofox.ai）—— 一个账号即可使用 Claude、GPT、Gemini 等主流模型，方便对比选择最适合你场景的模型。
