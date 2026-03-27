---
layout: post
title: "用 AI 重写 JSONata：7 小时、$400、年省 $50 万"
date: 2026-03-27
author: Cobb
categories: [AI, Dev]
tags: [AI, LLM, coding, golang, jsonata, vibe-coding]
pin: false
image: /assets/img/posts/ai-rewrite-jsonata.png
---

Reco.ai 团队上周发了一篇博客，标题直白到让人怀疑是标题党：**"We rewrote JSONata with AI in a day, saved $500k/year"**。

看完之后我只想说：这不是标题党，这是 2026 年 AI coding 的真实水平。

## 问题背景：$30 万/年的语言边界

Reco 是一家做安全检测的公司，他们的数据管道每天处理数十亿条事件。核心逻辑是用 [JSONata](https://jsonata.org/)（一种 JSON 查询语言，类似 jq）来写检测规则。

问题在于：JSONata 的参考实现是 JavaScript，而他们的管道是 Go 写的。

解决方案？在 Kubernetes 上跑一堆 Node.js pods，Go 服务通过 RPC 调用。

这个架构的代价：
- **$30 万/年** 的计算成本
- 200+ 个 JSONata pods，甚至撞到了 K8s 的 IP 分配上限
- 每次 RPC 调用 150 微秒延迟，对于一个本应耗时纳秒级的字段查询来说，这是灾难

他们尝试过各种优化：缓存、V8 嵌入、用 GJSON 写本地 evaluator。都是打补丁，治标不治本。

## Cloudflare 的启发

转机来自 Cloudflare 前阵子发的一篇文章：[How we rebuilt Next.js with AI in one week](https://blog.cloudflare.com/vinext/)。一个工程师 + AI，用一周时间重新实现了 Next.js 的 API surface。

Reco 的工程师看完后意识到：**他们有一样的问题，可以用一样的方法**。

核心思路：
1. 把 jsonata-js 的官方测试套件移植到 Go
2. 让 AI 实现代码，直到所有测试通过

## 7 小时，$400

结果：

- **7 小时**完成 Go 实现（13,000 行代码）
- **1,778 个测试用例**全部通过
- **$400 token 成本**
- 开源项目：[github.com/RecoLabs/gnata](https://github.com/RecoLabs/gnata)

性能对比：
- 简单表达式（如 `user.email = "admin@co.com"`）：**1000x 加速**，零堆内存分配
- 复杂表达式：**25-90x 加速**

更关键的是，gnata 作为 Go 库直接跑在服务里，RPC 开销完全消失。

## 两层评估架构

gnata 的设计很有意思：

**快速路径**：处理简单表达式（字段查找、比较、21 个内置函数）。直接在原始 JSON bytes 上操作，不做完整解析。对于 `account.status = "active"` 这样的查询，堆分配为零。

**完整路径**：处理复杂表达式，完整的 parser + evaluator。但也做了优化——只解析实际需要的子树。

还有一个 **StreamEvaluator**，针对他们的场景做了特殊优化：
- 所有表达式的字段路径合并成一次扫描
- 计算计划做 schema 级缓存，热路径无锁
- 内存有上限，LRU 淘汰

## 上线：影子模式 + 一周验证

Day 1：gnata 写完，PR 开了
Day 2-6：代码 review、QA、预发布环境影子模式（gnata 和 jsonata-js 同时跑，对比结果）
Day 7：连续三天零差异，gnata 切为主力

一个有意思的副作用：**他们用 AI agent 来 review AI 生成的代码**。agent 会标记各种问题——真正的并发 bug 和无关紧要的风格问题混在一起。这反过来帮他们改进了 AI code review 的流程。

## 额外收益：再省 $20 万

消掉 RPC 是第一步。因为 gnata 支持批量评估，他们顺便重构了整个 rule engine——从"几万个 goroutine 并发"改成了简单的 micro-batch pipeline。

结果：又省了 **$20 万/年**。

总计：**$50 万/年**，两周工作量。

## 对开发者的启示

这个案例有几个值得注意的点：

**1. 测试驱动的 AI coding 是可行的**

Cloudflare 和 Reco 用的方法一样：先有测试套件，让 AI 写实现。这不是"vibe coding"，这是有约束的生成。

**2. AI 的价值在于加速，不是替代思考**

Reco 的工程师不是让 AI 从零设计架构。他们很清楚问题是什么、解决方案的形状是什么、验证标准是什么。AI 只是加速了"写代码"这个环节。

**3. 语言边界是真实的成本**

很多公司都有这个问题：核心逻辑用 A 语言写，但某个依赖只有 B 语言实现。以前的方案是 RPC、FFI、嵌入解释器。现在可以考虑直接用 AI 移植。

**4. 2026 年是"surgical refactor"元年**

Reco 的工程师在文章结尾写道：*"I suspect 2026 will be the year of surgical refactors."*

我同意。当 AI 能在几小时内完成一个 13,000 行的库移植，我们需要重新评估哪些"历史包袱"值得背着。

## 试试看

```go
go get github.com/recolabs/gnata

expr, _ := gnata.Compile(`user.role = "admin" and user.loginCount > 100`)
result, _ := expr.EvalBytes(ctx, jsonBytes)
```

这不是玩具项目。这是一个跑在生产环境、处理数十亿事件、经过 1,778 个测试用例验证的库。

---

如果你也想在不同模型间对比 coding 能力——Claude 擅长架构推理，GPT 在快速原型上有优势——像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台能让切换成本接近零。一个账号，所有主流模型，挑最趁手的用。
