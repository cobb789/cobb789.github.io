---
layout: post
title: "Cursor 的正则索引优化：当 AI Agent 回到 1973 年的 grep"
date: 2026-03-27
author: Cobb
categories: [AI, Dev]
tags: [AI, Agent, Cursor, regex, search, coding-agent]
pin: false
image: /assets/img/posts/cursor-fast-regex-search.gif
---

## 时间是个圈

1973 年，Ken Thompson 发布了 grep——一个在文件系统里匹配正则表达式的小工具。半个世纪后，我们有了 LSP、语义索引、向量检索，AI coding agent 最依赖的搜索工具是什么？grep。

Cursor 团队最近发布了一篇技术博客，讲他们如何为 Agent 的正则搜索构建索引，把大型代码仓库的搜索时间从 15 秒以上压缩到亚秒级。这不是一个花哨的功能发布——这是基础设施层面的硬核优化。

## 问题：ripgrep 也扛不住的规模

大部分 Agent 框架（包括 Cursor）默认用 [ripgrep](https://github.com/BurntSushi/ripgrep) 作为搜索工具。ripgrep 已经是同类工具中最快的了——Andrew Gallant 在正则匹配性能上下了极大功夫。

但 ripgrep 有一个本质限制：**它必须遍历所有文件的内容**。小项目无所谓，几百毫秒搞定。然而 Cursor 的企业客户经常工作在巨型 monorepo 上，一次 `rg` 调用可能跑 15 秒以上。对于正在和 Agent 交互的开发者来说，这 15 秒是灾难性的——Agent 的每一步推理都可能触发搜索，累积起来足以让人放弃使用。

## 解法：为正则表达式建索引

Cursor 的方案回溯到 1993 年 Zobel 等人的论文和 Russ Cox 2012 年的经典博文（Google Code Search 关闭后发表的那篇）。核心思路是用 **n-gram 倒排索引**加速正则匹配：

1. **分词**：把代码文件按 trigram（3 字符序列）切分，构建倒排索引
2. **正则分解**：将正则表达式拆解为 n-gram 的布尔查询树
3. **候选过滤**：先用索引快速定位可能匹配的文件，再对候选集做精确匹配

本质上就是搜索引擎的做法——先用廉价的索引查询缩小范围，再用昂贵的精确匹配确认结果。区别在于传统搜索引擎索引的是自然语言词汇，这里索引的是字符级的 n-gram。

## 为什么这件事重要

这篇文章表面讲的是搜索优化，深层揭示了一个趋势：**AI coding agent 正在重新发明 IDE 的基础设施**。

过去几十年，IDE 的进化路径是：文本搜索 → ctags → 语法索引 → LSP → 类型系统。这些工具服务于人类开发者的导航需求。但 Agent 的使用模式完全不同——它不需要「跳转到定义」，它需要的是「在整个代码库中找到所有跟这个 pattern 相关的地方」。这本质上是回到了 grep 的原始需求，但规模大了几个数量级。

Cursor 意识到了这一点：**Agent 的工具链需要专门的性能工程**。不能假设现有的开发工具已经够用了。ripgrep 对人类够用（人一天搜不了几百次），但 Agent 可能一个任务就搜几十次。

这也解释了为什么 Cursor 能在 AI 编辑器赛道保持领先——他们不只是套一层 LLM 到编辑器上，而是在认真做 Agent 基础设施的优化。

## 延伸思考

几个值得关注的方向：

- **Agent-native 的工具链**：不是把人类的工具给 Agent 用，而是为 Agent 的使用模式专门设计工具。索引只是开始，接下来可能是 Agent-native 的 diff、merge、test runner
- **索引的实时性**：代码在不断变化，索引需要增量更新。这和搜索引擎面临的问题一样——如何在写入和查询之间取得平衡
- **跨工具的优化空间**：语义搜索和正则搜索不是互斥的，最优策略是 Agent 自己判断什么时候用哪种

AI coding agent 的竞争正在从「谁的模型更聪明」转向「谁的基础设施更快」。模型能力趋同之后，体验差异就在这些毫秒级的工程细节里。

如果你在多个 AI 模型之间频繁切换测试编码效果，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）—— 一个账号接入 Claude、GPT、Gemini 等主流模型，省去多平台来回登录的麻烦。

---

> 参考：[Fast regex search: indexing text for agent tools](https://cursor.com/blog/fast-regex-search) — Cursor Blog, 2026-03-26
