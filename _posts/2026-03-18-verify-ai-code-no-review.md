---
layout: post
title: "AI 生成的代码不用看？用自动化验证替代人工 Review"
date: 2026-03-18
author: Cobb
categories: [AI, Dev]
tags: [AI, coding-agent, code-review, testing, property-based-testing, mutation-testing]
pin: false
image: /assets/img/posts/verify-ai-code-no-review.jpg
---

今天早上刚写了 Cursor AI 的代码质量问题，下午就在 HN 上看到一篇切入角度完全不同的文章：**Toward automated verification of unreviewed AI-generated code**。83 points，讨论热度不低。

作者 Peter Lavigne 的核心问题很直接：**如果我不逐行 review AI 生成的代码，需要什么条件才能信任它？**

这个问题问得好。因为现实是 —— 随着 AI Agent 越来越多地直接写代码、提 PR、甚至自动部署，人工逐行 review 正在变成瓶颈。

## 从 Review 到 Verify

作者做了一个实验：让 coding agent 解一个 FizzBuzz 变种问题，然后用一组**机器可执行的约束**来验证输出，而不是人工阅读代码。

这组约束包括四层：

1. **Property-based testing** —— 不是测几个固定用例，而是用 Hypothesis 框架生成大量半随机输入，验证代码的「属性」是否成立。比如"所有 3 和 5 的公倍数都返回 FizzBuzz"，跑 100 个随机值
2. **Mutation testing** —— 用 mutmut 对代码做微小变异（交换运算符、改常量），如果测试仍然通过，说明测试覆盖不够。反过来，如果所有变异都被杀掉，说明代码的每一部分都有测试守护
3. **无副作用约束** —— 确保函数是纯函数，没有隐藏的 IO 操作
4. **类型检查 + Lint** —— 静态分析兜底

这四层叠加起来，把「合法但错误」的代码空间压缩到极小。

## 关键洞察：把 AI 代码当编译产物

文章里最有意思的一句话：

> I'm starting to think that maintainability and readability aren't relevant in this context. We should treat the output like compiled code.

**把 AI 生成的代码当成编译产物**。你不会去 review `.o` 文件的可读性，你只关心它的行为是否正确。

这个思路转变很重要。当我们执着于「AI 写的代码要像人写的一样规范」时，可能问错了问题。真正该问的是：**它的行为是否可验证？**

## 现实差距

当然，作者也很诚实 —— 目前搭建这套验证框架的成本比直接读代码还高。FizzBuzz 是个简化的例子，真实项目的状态管理、IO 操作、并发逻辑远比这复杂。

但方向是对的。随着 AI Agent 越来越多地自主写代码，我们需要的不是更多 reviewer，而是更强的**自动化验证基础设施**。Property-based testing + mutation testing 的组合，在函数式编程社区已经成熟多年，现在终于在 AI 编程的语境下找到了新的应用场景。

## 和今天早上那篇的关系

早上写的 Cursor 研究表明 AI 编程会导致代码复杂度上升、code smell 增加。这篇文章给出了一个可能的应对方向：**不要试图让 AI 写出完美的代码，而是建立足够强的验证机制来约束它的输出**。

两篇放在一起看，AI 编程的全景更清晰了：

- **问题**：AI 写代码快，但质量有隐患
- **方向**：从人工 review 转向自动化验证
- **挑战**：验证基础设施的搭建成本还太高

我的判断是，接下来 1-2 年，围绕 AI 代码的验证工具链会成为一个重要赛道。谁先把 property-based testing、mutation testing、形式化验证整合成开箱即用的工具，谁就能真正释放 AI 编程的生产力。

---

如果你在用不同 AI 模型对比编码能力，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号搞定 Claude、GPT、Gemini 等主流模型。
