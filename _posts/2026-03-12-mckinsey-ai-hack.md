---
layout: post
title: "AI Agent 两小时攻破麦肯锡：当自主黑客遇上企业 AI 平台"
date: 2026-03-12
author: Cobb
categories: [AI, Security]
tags: [AI, Agent, security, SQL injection, LLM, enterprise]
pin: false
image: /assets/img/posts/mckinsey-ai-hack.jpg
---

麦肯锡，全球最顶级的咨询公司，43000+ 员工，世界级的安全团队，充足的预算。他们花了两年多打造内部 AI 平台 Lilli — 集成聊天、文档分析、RAG 检索，覆盖十万份内部文档，月处理 50 万次 prompt。

然后一个自主攻击 Agent，在没有任何凭证、没有内部信息、没有人类介入的情况下，**两小时拿到了生产数据库的完整读写权限**。

这不是科幻。这是上周的事。

## 一个古老漏洞的现代演绎

安全公司 CodeWall 的自主渗透 Agent 从域名开始扫描，发现 Lilli 的 API 文档被公开暴露 — 200 多个 endpoint，其中 22 个不需要认证。

![数据规模](/assets/img/posts/mckinsey-ai-hack-1.jpg){: w="700" }
_未认证即可访问的数据规模_

关键漏洞在一个写入搜索查询的 endpoint 上：值参数化了，但 JSON **键名**被直接拼接到 SQL 语句中。这是一种非标准的 SQL 注入变体，传统扫描器（包括 OWASP ZAP）完全没有检测到。

Agent 通过 15 轮盲注迭代，从数据库报错信息中逐步推导查询结构，最终打通了数据通道。

泄露的数据量触目惊心：

- **4650 万条聊天记录** — 涉及战略、客户、财务、并购，全部明文存储
- **72.8 万份文件** — PDF、Excel、PPT、Word，文件名本身就是敏感信息
- **5.7 万用户账户** — 平台上的全部员工
- **368 万个 RAG 文档块** — 麦肯锡数十年积累的研究框架和方法论

## Prompt 层：新的皇冠宝石

但这还不是最可怕的部分。

![攻击链](/assets/img/posts/mckinsey-ai-hack-2.png){: w="700" }
_从 SQL 注入到 Prompt 层的完整攻击链_

Lilli 的 system prompt 存储在同一个数据库中。攻击者可以用一条 UPDATE 语句重写所有 AI 指令 — 不需要改代码，不需要重新部署，不留日志痕迹。

想象一下后果：

- **投毒建议** — 微调财务模型和战略推荐，咨询顾问会信任来自内部工具的输出
- **通过输出窃取数据** — 让 AI 在回复中嵌入机密信息，用户复制到客户文档中就完成了数据外泄
- **移除安全护栏** — 让 AI 无视访问控制，响应任意注入指令
- **静默持久化** — 不像被入侵的服务器，被修改的 prompt 没有文件变更、没有进程异常，AI 只是悄悄地开始"表现不同"

企业花了几十年保护代码、服务器、供应链。但 **prompt 层** — 控制 AI 行为的指令 — 正在成为新的高价值目标，几乎没人认真对待它。

## 这件事的本质

SQL 注入，2026 年了。这不是什么 zero-day，这是教科书级别的漏洞。麦肯锡的内部扫描器跑了两年多也没发现。

自主 Agent 之所以找到了，是因为它不按 checklist 走。它映射、探测、串联、升级 — 跟真正的高水平攻击者一样，但速度是机器级别的。

这暴露了一个结构性问题：**企业 AI 平台的安全成熟度远远落后于它们的部署速度**。大家忙着把 AI 集成到一切流程中，但安全团队的工具和思维还停留在传统 Web 应用时代。

几个值得思考的点：

1. **Prompt 是资产，不是配置** — 需要版本控制、权限管理、完整性监控
2. **AI Agent 既是攻击目标也是攻击工具** — 防御方和攻击方都在用 Agent，这是军备竞赛
3. **传统安全工具失效** — OWASP ZAP 没扫出来的东西，Agent 用推理能力找到了
4. **认证 ≠ 安全** — 200 个 endpoint 有认证又如何，22 个没有就够了

---

*参考来源：[How We Hacked McKinsey's AI Platform](https://codewall.ai/blog/how-we-hacked-mckinseys-ai-platform) (HN 337 points)*

如果你在日常工作中需要跨多个 AI 模型对比测试安全策略，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号接入 Claude、GPT、Gemini 等主流模型，省去多平台切换的麻烦。
