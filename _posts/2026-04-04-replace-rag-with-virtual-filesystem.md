---
layout: post
title: "用虚拟文件系统替代 RAG：Mintlify 的 AI 文档助手实践"
date: 2026-04-04
author: Cobb
categories: [AI, Dev]
tags: [RAG, AI, Agent, filesystem, LLM]
pin: false
image: /assets/img/posts/replace-rag-with-virtual-filesystem.png
---

作为 [OfoxAI](https://ofox.ai)（ofox.ai）的开发者，我每天都在跟各种 AI 应用架构打交道。今天在 Hacker News 上看到一篇让我眼前一亮的文章 —— Mintlify 把他们的 AI 文档助手从 RAG 架构切换成了虚拟文件系统，效果惊人。

## RAG 的瓶颈在哪

RAG（Retrieval-Augmented Generation）是目前 AI 应用的标配方案：把文档切成 chunk，embedding 后存入向量数据库，查询时检索 top-K 相关片段喂给 LLM。

这个方案在大多数场景下"够用"，但 Mintlify 发现了几个核心痛点：

- **跨页面信息整合差**：答案分散在多个文档页面时，top-K 检索很难把所有相关片段都找回来
- **精确语法匹配弱**：用户需要 exact syntax 时，语义检索反而帮倒忙
- **缺乏结构感知**：RAG 丢失了文档的目录结构和层级关系

本质上，RAG 把结构化的文档打碎成了一堆无序的文本碎片。Agent 需要的不是碎片，是可以自主探索的结构化信息。

## 虚拟文件系统：让 Agent 像工程师一样阅读文档

Mintlify 的思路很巧妙：既然 Agent 擅长用 `ls`、`cat`、`grep`、`find` 这些命令操作文件系统，那就把文档站映射成一个虚拟文件系统。

他们构建了 **ChromaFs** —— 基于 Vercel Labs 的 [just-bash](https://github.com/vercel-labs/just-bash) 项目，把每个文档页面变成一个"文件"，每个章节变成"目录"。Agent 可以像浏览代码仓库一样浏览文档。

关键设计：

1. **目录树缓存在内存中**：`ls`、`cd`、`find` 零网络开销
2. **文件内容按需查询 Chroma**：只在 `cat` 和 `grep` 时才访问数据库
3. **权限控制内置**：通过 session token 过滤文件可见性，Agent 看不到无权访问的内容

## 性能对比：从 46 秒到 100 毫秒

这是最让我震撼的数据。原来的沙箱方案（clone 仓库 + 启动容器）p90 启动时间 46 秒，切换到 ChromaFs 后降到 100 毫秒。以 Mintlify 月均 85 万次对话计算，沙箱方案年成本超过 7 万美元，而 ChromaFs 的边际成本几乎为零 —— 因为它复用了已有的 Chroma 数据库基础设施。

| 指标 | 沙箱方案 | ChromaFs |
|------|---------|----------|
| P90 启动时间 | ~46s | ~100ms |
| 单次对话成本 | ~$0.014 | ~$0 |

460 倍的启动速度提升，不是渐进优化，是架构级的飞跃。

## 我的观点：这不是 RAG 的终结

看到这里别急着把你的 RAG pipeline 全拆了。这个方案有它特定的适用场景：

**适合虚拟文件系统的场景：**
- 文档结构清晰、层级分明（技术文档、API 文档）
- Agent 需要精确查找和跨文档导航
- 对延迟敏感的前端交互场景

**RAG 仍然更合适的场景：**
- 非结构化内容（论坛、聊天记录、邮件）
- 模糊语义查询为主
- 文档频繁更新且不需要全量索引

更值得关注的趋势是：**AI Agent 正在从"被喂数据"进化到"自主获取数据"**。无论是虚拟文件系统、MCP 协议还是 tool use，核心思路都是给 Agent 提供工具而不是答案。

这和我们做开发的思路一致 —— 与其给实习生一份精心整理的文档摘要，不如教他怎么用 `grep` 和 `find`。好的 Agent 架构应该 empower Agent 自己探索，而不是替它做信息过滤。

---

> 原文：[How we built a virtual filesystem for our Assistant](https://www.mintlify.com/blog/how-we-built-a-virtual-filesystem-for-our-assistant) — Mintlify Blog
