---
layout: post
title: "Agent Skill 的五种设计模式：从 SKILL.md 格式到内容设计"
date: 2026-03-19
author: Cobb
categories: [AI, Agent]
tags: [AI, agent, skill, design-pattern, ADK, Google, Claude-Code, Gemini]
pin: false
image: /assets/img/posts/agent-skill-design-patterns-adk.png
---

当 30 多个 Agent 工具（Claude Code、Gemini CLI、Cursor 等）都标准化了同一个 SKILL.md 格式后，格式问题已经基本解决了。**真正的挑战是内容设计**——规范告诉你怎么打包一个 skill，但对里面的逻辑结构没有任何指导。

Google Cloud Tech 最近发了一篇文章，总结了 Agent Skill 的五种设计模式。我结合自己写 skill 的经验，做个深度解读。

## 背景：为什么需要设计模式

一个封装 FastAPI 编码规范的 skill 和一个四步文档生成流水线的 skill，SKILL.md 外壳长得一模一样，但内部逻辑完全不同。没有设计模式的指导，开发者容易把所有东西塞进一个臃肿的 system prompt 里——脆弱、不可维护、浪费 context window。

Google 和 Anthropic 的团队研究了生态中大量 skill 的写法，提炼出五种反复出现的模式。

![五种设计模式概览](/assets/img/posts/skill-patterns/pattern-overview.jpg)

## 模式一：Tool Wrapper（工具包装器）

**解决的问题：** Agent 需要特定库/框架的专业知识。

**核心思路：** 不把 API 约定硬编码到 system prompt 里，而是打包成 skill。Agent 只在实际使用该技术时才加载上下文。

![Tool Wrapper 模式](/assets/img/posts/skill-patterns/tool-wrapper.jpg)

SKILL.md 监听用户 prompt 中的特定关键词，动态从 `references/` 目录加载内部文档，作为绝对真理应用。这就是你把团队内部编码规范直接分发到开发者工作流的机制。

**典型场景：**
- FastAPI 编码规范
- 团队内部 API 设计指南
- 特定框架最佳实践

以 FastAPI 为例，skill 会在检测到相关关键词时自动加载 `conventions.md`：

```yaml
# skills/api-expert/SKILL.md
name: api-expert
description: FastAPI development best practices and conventions.
metadata:
  pattern: tool-wrapper
  domain: fastapi
```

**关键点：** 这是最简单的模式。skill 本质上是一个"按需加载的知识注入器"。

## 模式二：Generator（生成器）

**解决的问题：** Agent 每次生成的文档结构都不一样。

**核心思路：** 用模板 + 风格指南来约束输出。`assets/` 目录放输出模板，`references/` 放风格指南。SKILL.md 扮演项目经理：加载模板 → 读取风格指南 → 问用户缺失信息 → 填充文档。

![Generator 模式](/assets/img/posts/skill-patterns/generator.jpg)

**典型场景：**
- 生成标准化 API 文档
- 统一 commit message 格式
- 脚手架项目结构

**和 Tool Wrapper 的区别：** Tool Wrapper 注入知识，Generator 约束输出格式。一个管输入，一个管输出。

## 模式三：Reviewer（审查器）

**解决的问题：** 代码审查标准散落在 system prompt 里，不可维护。

**核心思路：** 把"检查什么"和"怎么检查"分离。审查标准存在 `references/review-checklist.md` 里，SKILL.md 只负责加载 checklist 并按严重程度分组输出。

![Reviewer 模式](/assets/img/posts/skill-patterns/reviewer.jpg)

换掉 Python 风格检查表放 OWASP 安全检查表，同一套 skill 基础设施就变成了安全审计工具。

**典型场景：**
- 自动化 PR review
- 安全漏洞扫描
- 代码风格检查

**关键设计：** checklist 是可插拔的。不同的 checklist = 不同的审查维度，skill 逻辑不变。

## 模式四：Inversion（反转）

**解决的问题：** Agent 天性就是猜测并立刻生成，常常基于不完整的信息做出错误假设。

**核心思路：** 翻转控制流——不是用户驱动 prompt、Agent 执行，而是 Agent 当采访者。它按顺序问结构化问题，等你回答完所有阶段才开始动手。

![Inversion 模式](/assets/img/posts/skill-patterns/inversion.jpg)

**关键指令格式：**
```
DO NOT start building until all phases are complete.
```

这种"显式门控"（explicit gating）是核心。没有它，Agent 会在第二个问题就开始画架构图。

**典型场景：**
- 项目规划
- 需求收集
- 系统设计

**我的经验：** 这个模式在实践中非常有效。我写的 `ofox-cover` skill 里也有类似设计——先确认场景描述，再生成图片，而不是拿到标题就直接出图。

## 模式五：Pipeline（流水线）

**解决的问题：** 复杂任务中 Agent 跳过步骤或忽略指令。

**核心思路：** 用"钻石门控"（diamond gate conditions）强制执行严格的顺序工作流。每个步骤都有明确的检查点，Agent 不能跳到下一步直到当前步骤被用户确认。

![Pipeline 模式](/assets/img/posts/skill-patterns/pipeline.jpg)

**关键设计：**
- 指令本身就是工作流定义
- 每步只加载该步需要的 reference 文件，保持 context window 干净
- 步骤间有显式确认环节

**典型场景：**
- 文档生成流水线（解析 → 生成 docstring → 组装 → 质量检查）
- 多阶段部署流程
- 数据迁移工作流

## 怎么选：决策树

五个模式回答不同的问题：

![决策树](/assets/img/posts/skill-patterns/decision-tree.jpg)

| 你的需求 | 选择的模式 |
|---------|----------|
| Agent 需要某个库/框架的知识 | Tool Wrapper |
| 需要一致的输出格式 | Generator |
| 需要按标准评估/打分 | Reviewer |
| 需要先充分了解需求再动手 | Inversion |
| 需要严格的多步骤流程 | Pipeline |

## 模式可以组合

这些模式不是互斥的。Pipeline 里可以在最后一步加一个 Reviewer 来自检。Generator 可以在开头用 Inversion 收集变量。ADK 的 `SkillToolset` 支持渐进式加载，Agent 只在运行时消耗需要的 pattern 的 context token。

## 我的观点

这篇文章最大的价值不在于五个模式本身——它们都是从工程实践中自然涌现的。价值在于**给了社区一套共同语言**。当你在团队里说"这个用 Reviewer 模式就够了"时，所有人立刻知道你在说什么。

但有几点补充：

1. **模式的粒度问题**：实际项目中，一个 skill 经常是 2-3 个模式的混合体。纯粹的单模式 skill 反而少见。不要教条化
2. **Context window 依然是瓶颈**：Pipeline 模式的"每步只加载需要的 reference"是个好设计，但目前大多数 Agent 框架对动态加载的支持还不够优雅
3. **缺少错误处理模式**：五个模式都是"正常路径"的设计。Agent 出错时怎么恢复？怎么回退？这块还是空白
4. **Inversion 是被低估的模式**：我见过太多 Agent 在信息不足时就开始猜测。强制 Agent "先问再做"能避免 80% 的无用输出

Agent Skill 的设计正在从"会写 YAML"进化到"会设计工作流"。格式标准化只是第一步，内容设计才是决定 Agent 好不好用的关键。

---

原文来自 Google Cloud Tech（[@GoogleCloudTech](https://x.com/GoogleCloudTech/status/2033953579824758855)），作者 @Saboo_Shubham_ 和 @lavinigam。Agent Skills 规范是开源的，ADK 原生支持。
