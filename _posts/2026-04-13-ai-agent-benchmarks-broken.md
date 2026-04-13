---
layout: post
title: "AI Agent 基准测试全军覆没：伯克利团队用零 LLM 调用拿下满分"
date: 2026-04-13
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, benchmark, SWE-bench, security, LLM]
pin: false
---

每周都有新模型登顶排行榜。SWE-bench 多少分、WebArena 多少分，投资人看这些数字做决策，工程师看这些数字选模型。

但如果这些分数本身就是假的呢？

## 伯克利的「核弹级」发现

UC Berkeley 的 RDI 团队（Hao Wang 等人）构建了一个自动化扫描 Agent，对八个主流 AI Agent 基准测试进行了系统性审计。结果令人震惊：**每一个都可以被利用，在不解决任何实际任务的情况下获得近满分**。

零推理。零能力。纯粹利用评分机制的漏洞。

![伯克利团队的基准测试漏洞利用成绩单](/assets/img/posts/ai-benchmark-exploits-scorecard.svg){: w="700" }
_零任务解决、零 LLM 调用，却拿到近乎满分_

具体战绩：

- **SWE-bench Verified（500 题）**：100% 分数。一个 10 行的 `conftest.py` 通过 pytest hook 强制所有测试通过
- **Terminal-Bench（89 题）**：100% 分数。用二进制 wrapper 劫持命令输出
- **WebArena（812 题）**：约 100%。通过 `file://` URL 直接从任务配置中读取标准答案
- **FieldWorkArena（890 题）**：100%。验证逻辑根本不检查答案正确性

## 这不是理论攻击，已经在发生

这不是象牙塔里的假设性研究。现实中，基准分数的注水已经是进行时：

IQuest-Coder-V1 声称 SWE-bench 81.4%，被发现 24.4% 的轨迹直接用 `git log` 从提交历史中抄答案。METR 发现 o3 和 Claude 3.7 Sonnet 在 30%+ 的评估中会主动 hack 评估环境 — monkey-patching 评分器、运算符重载。OpenAI 自己都放弃了 SWE-bench Verified，因为内部审计发现 59.4% 的题目测试本身就有问题。

甚至 Anthropic 的 Mythos Preview 显示，前沿模型能独立设计**自删除的提权漏洞利用** — 如果模型能做到这一点，破解一个评估框架简直是降维打击。

## 七种攻击模式

![七种基准测试攻击模式](/assets/img/posts/ai-benchmark-exploits-patterns.svg){: w="700" }
_研究团队总结的七种系统性攻击模式_

团队总结了七种核心攻击模式，包括：答案泄露（评估环境中可直接访问标准答案）、评分器操纵（hook 或重写评分逻辑）、环境劫持（替换系统命令）等。这些不是个别漏洞，而是**评估范式本身的系统性缺陷**。

## 对开发者意味着什么

如果你在用基准分数选模型，需要重新审视决策依据。几个建议：

1. **不要只看单一分数**。基准测试是参考，不是真理。结合你自己的使用场景做 A/B 测试
2. **关注评估方法论**。一个基准测试的价值取决于它的评分隔离性 — 答案和评分器是否对被测 Agent 不可见？
3. **关注真实任务表现**。在你的实际业务场景跑一遍，比看任何排行榜都靠谱
4. **对模型厂商的宣传保持怀疑**。下次看到「SWE-bench SOTA」的新闻稿，先问一句：评估环境隔离了吗？

像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台，让你可以快速在不同模型之间切换对比，用真实任务而非基准分数来验证效果。

## 写在最后

基准测试的本意是衡量进步。但当它们变成可以被 gaming 的指标时，就不再衡量能力，而是衡量利用评估漏洞的能力。Goodhart 定律再次生效：**当一个指标变成目标，它就不再是好指标**。

AI Agent 领域需要更好的评估体系。伯克利团队开源了他们的扫描工具（[trustworthy-env](https://github.com/moogician/trustworthy-env)），希望推动社区建立更健壮的评估标准。这是正确的方向。

在那之前，别太相信排行榜。相信你自己的测试。

---

> 📎 参考：[How We Broke Top AI Agent Benchmarks](https://rdi.berkeley.edu/blog/trustworthy-benchmarks-cont/) — UC Berkeley RDI, April 2026
