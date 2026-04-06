---
layout: post
title: "Karpathy 的 LLM Wiki：用 Agent 把 RAG 写成一份会长大的笔记"
date: 2026-04-06
author: Cobb
categories: [AI, Dev]
tags: [LLM, Agent, RAG, Karpathy, KnowledgeBase, Obsidian]
pin: false
image: /assets/img/posts/karpathy-llm-wiki.png
---

Karpathy 昨天在 GitHub Gist 上扔了一份"idea file"——[LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)，HN 顶到 275 分。文件本身只有几百字，但它戳到了我最近一直在想的事：**RAG 这条路，可能从一开始就走偏了。**

## RAG 的根本问题：每次都从零开始

主流 RAG 的工作方式很统一：把文档切片、embedding、塞进向量库，查询的时候捞回来几段拼到 prompt 里。NotebookLM、ChatGPT 的文件上传、几乎所有"和你的文档对话"产品都是这套。

Karpathy 一句话点破了它的病灶：

> 模型在每一次提问时都在从头重新发现知识。没有任何积累。

你问一个需要综合五份文档的微妙问题，模型要重新去找碎片、重新拼接、重新推理。下次你换个角度问同一件事，整个过程再来一遍。RAG 系统**没有记忆，也没有沉淀**——它只是一个带搜索的复读机。

这跟人类学习的方式完全是反的。你读一本书不会把它切成 512 token 的块塞到脑子里再"按需召回"。你会做笔记、画思维导图、把新读到的东西和已有的认知挂钩、发现矛盾、修正旧观点。**知识是被"编译"过的**，不是每次都从源代码重新跑一遍。

## LLM Wiki：让 Agent 帮你写一份活的笔记

Karpathy 的方案非常简单，简单到让人怀疑为什么之前没人这么做：

> 让 LLM 增量地构建并维护一份持久化的 wiki —— 一组结构化、互相链接的 markdown 文件，坐在你和原始资料之间。

核心动作有四个：

1. **不只是索引**——加入新资料时，Agent 读它、抽出关键信息，**整合进已有的 wiki**
2. **更新实体页**——人物、概念、项目各有自己的页面，新资料触发对相关页面的修订
3. **标注矛盾**——新数据和旧结论冲突时，明确记下来，而不是覆盖
4. **持续综合**——topic summary 跟着证据演化，不是一次性产物

你（人）只负责三件事：找资料、提问、探索。**写 wiki 的活全归 Agent**。Karpathy 描述的工作流是：左边开 Agent，右边开 Obsidian，Agent 一边改一边他在另一边浏览图谱视图、跟着链接看更新后的页面。

> Obsidian is the IDE; the LLM is the programmer; the wiki is the codebase.

这个类比我太喜欢了。它把"知识管理"重新定义成了一种**软件工程问题**——有版本、有重构、有 lint、有测试（你可以让 Agent 周期性自检矛盾）。

## 为什么这是一次范式转移

RAG 是检索范式，LLM Wiki 是**编译范式**。两者的差别不是技巧，是哲学：

| 维度 | 传统 RAG | LLM Wiki |
|------|---------|----------|
| 知识形态 | 原始文档 + 向量索引 | 结构化 markdown + 互链 |
| 计算时机 | 查询时（lazy） | 写入时（eager） |
| 复杂查询 | 实时拼接，容易丢上下文 | 一次推理多次复用 |
| 矛盾处理 | 无 | 显式标注 |
| 增量价值 | 文档越多越慢 | 资料越多越聪明 |
| 可读性 | 只对模型友好 | 人也能直接读 |

最关键的是最后一点：**人能读懂的知识库**。RAG 的中间产物是向量，对人类完全是黑盒；LLM Wiki 的中间产物是 markdown，你可以打开 Obsidian 自己看，可以手动修，可以分享给同事。它不是一个"AI 系统的内部状态"，它就是**你的知识本身**，只是 AI 帮你写。

## 落地的几个现实问题

当然，这不是没坑。我读完 Karpathy 的 idea file 后第一反应是几个工程问题：

**1. 谁来防止 wiki 退化？** Agent 可能写出冗余、自相矛盾、越改越乱的页面。需要定期 GC——让 Agent 用另一个 prompt 自检整个 wiki 的一致性，合并重复条目。

**2. 上下文窗口**怎么塞得下整个 wiki？答案是：不需要塞下。Agent 应该像人一样"按需翻页"，用文件系统而不是 context window 当存储。Claude Code、OpenAI Codex 这种带文件读写工具的 Agent 天然适合这个场景。

**3. 触发更新的成本**。每加入一篇新资料就要让 Agent 跑一遍"读—对比—改"的流程，token 消耗不低。但和 RAG 在每次查询时重算的成本相比，**写一次读多次的均摊成本反而更低**。

## 这件事可能在告诉我们什么

LLM Wiki 不是一个产品，是一个**信号**。它在说：当 Agent 足够便宜、足够可靠的时候，过去那些为了绕开"模型不够聪明"而设计的中间层（向量库、re-ranker、复杂的 retrieval pipeline）会被一层一层剥掉，最后剩下的是**人能读的文件 + 会用工具的 Agent**。

这其实是一个更大的趋势：**用文件系统替代特殊数据结构**。前几天我也写过 [虚拟文件系统替代 RAG](https://cobb789.github.io/posts/replace-rag-with-virtual-filesystem/) 那篇文章，说的是同一件事的另一面——Anthropic 的 Skills 也是这个思路：把"知识"放进文件系统，让 Agent 自己决定读什么。

Karpathy 这次只是把这个思路推到了它该去的地方：**不止用文件系统读，也用文件系统写**。你的 Agent 不只是消费者，也是作者。

---

在多个模型之间切换写这种 Agent 的时候，模型选择特别重要——Claude Opus 4 适合做长文档综合和矛盾检测，GPT 适合做结构化抽取，Gemini 上下文窗口大适合一次吞整篇论文。如果你也在折腾这类场景，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）—— 一个账号搞定 Claude、GPT、Gemini 等主流模型，切换成本几乎为零。

我已经准备开一个仓库照着这个 idea 实现一遍，作为我 OfoxAI 内部知识库的底层。下一篇可能会带点真实的代码和踩坑笔记。
