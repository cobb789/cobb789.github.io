---
layout: post
title: "AI 用 4 天把 SimCity 移植到 TypeScript：Vibe Coding 的真正含义"
date: 2026-02-11
author: Cobb
categories: [AI, Dev]
tags: [AI, coding agent, vibe coding, OpenAI, codex, TypeScript, legacy code]
pin: false
---

## 一个开发者、一个 Agent、四天

开发者 Christopher Ehrlich 做了一件事：他把 1989 年的 SimCity 整个 C 代码库，用 OpenAI 的 Codex agent 移植到了 TypeScript。**四天。没有读过一行原始代码。**

这不是 demo，不是概念验证。游戏跑在浏览器里，能玩。

这个项目在 HN 上引发了热烈讨论，也在 X 上病毒式传播。但比"AI 好厉害"更值得关注的是——他到底怎么做到的，以及这意味着什么。

## 原始代码有多恐怖

SimCity 的原始代码库来自 [Micropolis](https://github.com/stargo/micropolis)，是 Will Wright 最初在 Commodore 64 上用汇编写的版本，后来为 OLPC（One Laptop Per Child）项目翻译成了 C。

Ehrlich 自己的描述是："介于 C 代码和反编译结果之间"——满眼的位移运算，没有可读性可言，那种让资深工程师看了会流泪的代码。

换句话说，这不是一个"把现代 Python 转成 TypeScript"的简单任务。这是要理解一个 37 年前的、几乎不可读的代码库的**行为**，然后在另一个语言里精确复现。

## 关键方法：Specification + Verification

Ehrlich 的方法论才是这个故事的核心。他没有让 AI 盲目翻译，然后祈祷结果正确。

他的做法：

1. **写了一个 C-TypeScript 桥接层**，可以同时调用原始 C 代码和新的 TypeScript 代码
2. **用 Property-based Testing 做验证**——对同样的输入，C 版本和 TypeScript 版本必须产生完全相同的输出
3. **让 Agent 迭代**——AI 生成代码 → 测试验证 → 失败 → AI 修复 → 再验证 → 循环

这不是"Vibe Coding"那种"让 AI 写代码然后看看能不能跑"的路子。这是**工程方法**：用自动化测试把 AI 的输出约束在正确范围内。

成本？一个月 200 美元的 ChatGPT 订阅。四天没有遇到速率限制。

## "Vibe Coding" 的真正含义

Andrej Karpathy 创造了"Vibe Coding"这个词，但它正在被严重误用。很多人以为 Vibe Coding 就是"让 AI 写代码，自己不看"。

SimCity 移植展示了 Vibe Coding 真正应该是什么样：

- **人类定义 What**（规格、测试、验收标准）
- **AI 执行 How**（代码生成、迭代修复）
- **自动化验证 Whether**（Property-based Testing、回归测试）

正如 @johnloeber 在 X 上评论的：**瓶颈不再是 AI 的编码能力，而是人类正确描述需求的能力。**

这是一个范式转移。工程师的核心技能从"写代码"变成了"写规格 + 写测试"。代码本身变成了 AI 的事。

## 对遗留代码的意义

这个案例的暗示很震撼：

- **银行里跑了几十年的 COBOL 系统**——理论上可以用同样的方法移植
- **政府机构里无人维护的老系统**——只要能定义预期行为，就能让 AI 重写
- **被平台锁死的经典软件**——从 C 到浏览器，平台不再是限制

关键前提只有一个：**你能定义"正确"是什么样的。** 有了清晰的规格和可验证的测试，AI 可以处理你根本不理解的代码。

Ehrlich 的下一步计划也很有趣——他想给 SimCity 加多人模式，让 AI Agent 来玩 SimCity。当移植一个复杂游戏从"一年"变成"一周"，创造性项目的可能性爆炸了。

## 实用建议

如果你想复现类似的工作流：

1. **先写测试，不是代码**。Property-based Testing 是关键——定义输入输出关系，让 AI 去实现
2. **建立验证管道**。不要依赖 AI 的"自信"，依赖自动化测试的结果
3. **用桥接层做增量迁移**。不要试图一次性重写，让新旧代码并行运行、逐模块替换
4. **接受你不需要读原始代码**。这在心理上很难，但如果测试覆盖足够，你确实不需要
5. **Codex / Claude Code 这类 Agent 工具是目前最适合这个工作流的**——它们能在循环中自主迭代

## 我的看法

坦率说，这个案例让我重新思考了一些东西。

作为工程师，我们被训练成"理解代码"是核心能力。但如果 AI 能在不理解代码的情况下精确移植它——只通过行为等价性测试——那"理解"这件事的价值在哪里？

我的回答是：**理解依然重要，但它的位置变了。** 你不需要理解实现细节，但你必须深刻理解**系统应该做什么**。规格的质量决定了 AI 输出的质量。

未来的工程师不是不写代码的人。而是写出最好的规格和最严格的测试的人。

SimCity 在浏览器里跑起来了。37 年前的代码，四天完成移植，零行人工阅读。

这不是 AGI。但这确实是一个信号：软件工程的定义正在改变。

---

*参考来源：[Garry's List](https://garryslist.org/posts/ai-just-ported-simcity-in-4-days-without-reading-the-code) | [Christopher Ehrlich on X](https://x.com/ccccjjjjeeee) | [HN Discussion](https://news.ycombinator.com/)*
