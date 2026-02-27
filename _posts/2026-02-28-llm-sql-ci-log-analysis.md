---
layout: post
title: "把 TB 级 CI 日志丢给 LLM：为什么 SQL 是 AI Agent 最好的工具接口"
date: 2026-02-28
author: Cobb
categories: [AI, DevOps]
tags: [LLM, SQL, CI/CD, Agent, 可观测性]
pin: false
---

昨天 Hacker News 上一篇文章引起了广泛讨论：Mendral 团队把数十亿行 CI 日志灌进 ClickHouse，然后让 LLM Agent 自己写 SQL 去查询和分析。结果出乎意料地好——Agent 在几秒内就追溯到一个 flaky test 的根因，而这个 bug 是三周前一次依赖升级引入的。

这篇文章让我重新思考了一个问题：**我们给 AI Agent 设计工具接口时，是不是想太多了？**

## 预定义 API vs 自由 SQL

大多数 Agent 框架的做法是：提前定义好一组 function，比如 `get_failure_rate(workflow, days)`、`get_slow_jobs(threshold)`，Agent 只能在这些函数里选择调用。

Mendral 的做法完全不同——直接给 Agent 一个 SQL 接口，让它自己写查询。没有预定义的查询模板，没有固定的工具列表。

听起来很冒险，但数据说话：**8,534 次调查会话，52,312 条 SQL 查询，平均每次调查 Agent 会自己写 4.4 条查询**。它会先写一条宽泛的查询扫描全局，再逐步缩小范围钻到具体日志行——这个调查模式几乎和资深 SRE 工程师的排查思路一模一样。

## 为什么 LLM 天然适合写 SQL

这不是偶然的。SQL 在 LLM 的训练数据中占比极高，而且 SQL 的语法结构和自然语言有很好的映射关系：

- "最近一周哪个 job 失败率最高" → `SELECT job_name, COUNT(*) ... WHERE status='failed' AND created_at > now() - interval 7 day GROUP BY ... ORDER BY ...`
- "这个错误第一次出现是什么时候" → `SELECT MIN(timestamp) FROM logs WHERE message LIKE '%...' `

Mendral 的统计显示，Agent 63% 的查询针对 job 元数据（成功率、耗时趋势），37% 针对原始日志行（错误信息、日志模式匹配）。这个比例分布很合理——先看全局指标定位方向，再钻到原始日志确认细节。

## 这对 Agent 工具设计的启示

我认为这个案例揭示了一个更深层的设计原则：**好的 Agent 工具不是给它一堆预定义的积木，而是给它一门语言**。

预定义 API 的问题是，你只能回答你预见到的问题。但 debug 这件事的本质就是面对意料之外的情况。一个 `get_failure_rate` 函数永远不会告诉你"这个 flaky test 只在周三下午的 arm64 runner 上失败"——因为设计 API 的人根本没想到这个维度。

SQL 给了 Agent 探索的自由度，而 ClickHouse 的性能保证了这种自由度不会变成灾难——中位数查询扫描 33.5 万行，P95 也就 9.4 亿行，都是毫秒级返回。

这个思路可以推广：
- **日志分析** → SQL over ClickHouse（已验证）
- **代码分析** → 让 Agent 直接用 AST 查询语言（比如 tree-sitter query）
- **文档检索** → 与其做一堆 search API，不如给 Agent 向量数据库的查询接口

核心逻辑不变：**给 Agent 表达能力，而不是给它选项列表**。

## 落地时需要注意什么

当然，"让 Agent 自由写 SQL"不是没有风险：

1. **权限隔离是前提**。Mendral 的 Agent 只能查询当前组织的数据，这个 scope 限制至关重要
2. **成本控制**。P95 查询扫描近 10 亿行，如果没有 ClickHouse 这种列式存储的压缩和性能，账单会很可怕
3. **查询审计**。Agent 写的每条 SQL 都应该被记录，方便事后分析 Agent 的推理路径是否合理
4. **防止死循环**。需要设置查询次数和总扫描量的上限，避免 Agent 陷入无效的查询循环

## 写在最后

CI 日志分析只是一个起点。当我们开始认真思考"怎么给 Agent 最大的工具表达力"时，很多传统的系统设计假设都需要重新审视。数据库不再只是存储层，它正在变成 AI Agent 的思考工具。

如果你也在探索不同 AI 模型在实际任务中的表现差异，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）——一个账号即可使用 Claude、GPT、Gemini 等主流模型，方便快速对比哪个模型更适合你的场景。
