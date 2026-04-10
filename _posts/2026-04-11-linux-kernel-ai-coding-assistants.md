---
layout: post
title: "Linux 内核正式拥抱 AI 编码助手：规则、归属与底线"
date: 2026-04-11
author: Cobb
categories: [AI, Dev]
tags: [AI, linux, kernel, coding-assistant, open-source]
pin: false
image: /assets/img/posts/linux-kernel-ai-coding-assistants.png
---

Linux 内核项目在 `Documentation/process/` 下新增了一份 `coding-assistants.rst`，正式为 AI 编码助手参与内核开发制定了规则。这不是一个临时的邮件列表讨论，而是写进了官方文档树——和 `coding-style.rst`、`submitting-patches.rst` 并列。

这件事值得认真聊聊。

## 三条核心规则

整份文档的核心可以浓缩为三条：

**1. AI 不能签署 DCO（Developer Certificate of Origin）**

`Signed-off-by` 标签只有人类可以添加。AI 生成的代码，最终由提交者承担全部法律责任——包括 GPL-2.0 合规性、许可证兼容性、以及代码本身的正确性。

这一条划了一个清晰的底线：**AI 是工具，不是作者。**

**2. 必须用 `Assisted-by` 标签标注 AI 参与**

格式很精确：

```
Assisted-by: Claude:claude-3-opus coccinelle sparse
```

工具名、模型版本、辅助分析工具，全部要列出来。但基础开发工具（git、gcc、make）不需要。

这意味着内核社区不排斥 AI，但要求**完全透明**。每一个 AI 参与的补丁都会在 git log 里留下痕迹。

**3. AI 必须遵守现有的开发流程**

没有特殊通道。AI 辅助的代码和人写的代码走同样的审查流程、遵守同样的编码规范、通过同样的测试。

## 为什么这件事重要

Linux 内核是世界上最大的开源协作项目之一。它的态度往往定义了整个开源社区的基调。

过去两年，AI 编码助手在开源社区引发了大量争议。有的项目直接禁止 AI 生成的贡献（怕法律风险），有的完全放任（质量参差不齐），更多的项目在观望。

Linux 内核选择了第三条路：**不禁止，但立规矩。**

这个立场非常务实：

- AI 生成的代码已经大量存在于各种提交中，禁止不现实
- 不标注就无法追踪，出了问题找不到根因
- 法律责任必须落在人头上，不能模糊

## `Assisted-by` 的设计细节值得玩味

注意他们没有用 `Generated-by` 或 `Co-authored-by`。选择 `Assisted-by` 这个词是有意的——AI 是**辅助**，不是**生成**，更不是**共同作者**。

而且格式里包含了模型版本。这意味着未来可以做数据分析：哪些模型辅助的补丁被接受率更高？哪些模型容易引入特定类型的 bug？这些数据对整个行业都有价值。

## 对开发者的实际影响

如果你在用 AI 辅助写代码（2026 年了，谁不是呢），这份文档提供了一个很好的参考框架：

1. **审查一切**：不管 AI 生成的代码看起来多正确，你签了名就是你的责任
2. **标注参与**：透明不丢人，隐瞒才丢人
3. **工具链组合**：`Assisted-by` 格式鼓励把 AI 和静态分析工具（coccinelle、sparse、smatch）组合使用，这比单独依赖 AI 靠谱得多

## 写在最后

Linus Torvalds 一直以务实著称。这份文档延续了这个风格——不搞意识形态之争，不禁止也不鼓吹，而是用工程师的方式解决问题：定义接口、明确责任、保持透明。

AI 编码助手正在成为开发者工作流的一部分，这已经是事实。问题不是"要不要用"，而是"怎么用才对"。Linux 内核给出了一个成熟的答案。

如果你在多个 AI 模型之间频繁切换做开发辅助，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号搞定 Claude、GPT、Gemini 等主流模型，省去来回登录的麻烦。

---

*参考：[Linux Kernel Documentation - AI Coding Assistants](https://github.com/torvalds/linux/blob/master/Documentation/process/coding-assistants.rst)*
