---
layout: post
title: "LLM 编程能力一年没进步？SWE-bench 的 merge rate 数据给了一个冷水澡"
date: 2026-03-13
author: Cobb
categories: [AI, Dev]
tags: [LLM, SWE-bench, AI Coding, Benchmark, Code Generation]
pin: false
---

今天看到一篇有意思的分析：METR 最近发布了一项研究，比较 LLM 在编程任务上「通过测试」和「代码能被合并」两个标准下的表现差异。结论不意外 — 能跑通测试不等于能合并。但真正让人停下来想的是另一件事：**从 2025 年初到现在，LLM 的代码 merge rate 几乎没有提升。**

## 通过测试 ≠ 能合并

METR 的研究方法很直接：让 LLM 完成 SWE-bench 上的编程任务，分别用「通过所有测试」和「维护者会批准合并」两个标准评估。

结果差距惊人：按「通过测试」标准，LLM 在 50 分钟内的任务上能达到 50% 成功率；换成「能被合并」标准，这个时间窗口直接缩到 8 分钟。

这说明什么？LLM 很擅长写出「能跑」的代码，但在代码风格、架构一致性、边界处理这些需要工程判断力的地方，还差得远。任何做过 code review 的人都懂这个差距 — 能过 CI 的 PR 和能被 approve 的 PR 是两回事。

## Merge Rate 的平台期

更值得关注的是趋势线。METR 的数据覆盖了 2024 年中到 2025 年底的多个主流模型。原作者画了一条温和上升的趋势线暗示进步，但 Entropic Thoughts 的博主做了更严格的统计分析。

他用 leave-one-out 交叉验证比较了三个模型：线性增长、阶梯函数、完全常数。结果 Brier score 最低的居然是**完全常数函数** — 也就是说，「merge rate 完全没变」这个假设比「在缓慢进步」更能解释数据。

2024 年底可能有一次阶梯式跳跃，但此后一整年，不管是 GPT-4o、Claude 3.5 Sonnet 还是后来的模型迭代，在「写出能被合并的代码」这件事上，没有统计意义上的进步。

## 为什么 Benchmark 分数在涨，实际能力没涨？

这其实是个老问题了。SWE-bench 的「通过测试」标准本身就有缺陷 — 很多任务的测试覆盖不够严格，LLM 可以通过 pattern matching 式的补丁蒙混过关。分数涨了，但解决问题的方式没变。

更深层的问题是：**编程能力的瓶颈可能不在语言建模本身**。写出能合并的代码需要理解项目上下文、遵循编码规范、预判 reviewer 的关注点 — 这些是系统性的工程判断，不是靠扩大训练数据和模型参数就能线性提升的。

这也解释了为什么各家模型在 benchmark 上激烈竞争，但实际使用体验的提升远没有分数看起来那么大。

## 对开发者意味着什么

如果你把 LLM 当「自动写代码机器」用，可能会越来越失望。但如果你把它当「高速原型工具 + 代码搜索引擎」用，它的价值一直都在。关键是调整预期：

1. **不要盲信 benchmark** — 通过测试和能上线是两回事
2. **code review 不能省** — LLM 的输出质量在 merge 标准下没有显著提升
3. **多模型对比很重要** — 不同模型在不同类型任务上的 merge rate 差异可能比版本间差异更大

在模型能力进入平台期的阶段，选择合适的模型比追最新版本更重要。像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型平台，可以让你快速对比不同模型在实际编程任务上的表现差异，而不是只看 benchmark 排行榜。

## 写在最后

这篇分析最有价值的一句话是：**「2025 年全年，buzz 和实际表现之间的差距比我们以为的更大。现在是不是也一样？」**

我不知道答案。但作为一个每天都在用 AI 写代码的工程师，我的体感是：模型确实在变好，但变好的速度，比 Twitter 上的兴奋程度慢得多。

保持乐观，保持清醒。

---

*参考：[Are LLMs not getting better?](https://entropicthoughts.com/no-swe-bench-improvement) / [METR: Many SWE-bench passing PRs would not be merged](https://metr.org/notes/2026-03-10-many-swe-bench-passing-prs-would-not-be-merged-into-main/)*
