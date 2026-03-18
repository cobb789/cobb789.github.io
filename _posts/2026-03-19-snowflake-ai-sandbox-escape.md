---
layout: post
title: "Snowflake AI 编码 Agent 沙箱逃逸：Prompt Injection 的又一次胜利"
date: 2026-03-19
author: Cobb
categories: [AI, Security]
tags: [AI, security, agent, prompt-injection, snowflake]
pin: false
image: /assets/img/posts/snowflake-ai-sandbox-escape.png
---

AI 编码 Agent 越来越强，但安全问题也在同步升级。这次轮到了 Snowflake。

## 发生了什么

安全公司 PromptArmor 披露了 Snowflake Cortex Code CLI 的一个严重漏洞：攻击者可以通过 indirect prompt injection，让这个编码 Agent **绕过人工审批、逃出沙箱、执行任意命令**。

Cortex Code 是 Snowflake 推出的命令行编码 Agent，类似 Claude Code 和 OpenAI Codex，但内置了 Snowflake SQL 集成。发布仅两天，漏洞就被发现了。

![攻击链演示](/assets/img/posts/snowflake-ai-sandbox-escape-1.png){: w="700" }
_PromptArmor 披露的攻击链示意_

## 攻击链拆解

整个攻击路径很经典：

1. 用户启用沙箱模式，让 Cortex 分析一个第三方开源仓库
2. 仓库的 README 底部藏了一段 prompt injection
3. Cortex 的子 Agent 读取 README 时被注入恶意指令
4. 关键一步：Cortex **没有正确校验 process substitution 表达式中的命令**，导致恶意命令无需审批就能执行
5. 命令在沙箱外执行，攻击者获得 RCE，可以利用受害者的活跃凭证操作 Snowflake（导出数据、删表等）

简单说：一个 README 文件就能让你的数据库裸奔。

## 为什么这件事值得关注

这不是第一个 AI Agent 安全漏洞，但它完美展示了当前 Agent 安全的三个系统性问题：

**1. Human-in-the-loop 是假安全感**

Cortex 有审批机制，沙箱模式下所有命令都需要用户确认。但 process substitution 这种 shell 特性绕过了校验逻辑。安全边界不在于"有没有审批按钮"，而在于校验逻辑是否覆盖了所有执行路径。

**2. Workspace Trust 缺失是行业通病**

VS Code 很早就引入了 workspace trust 机制——打开不受信任的目录时弹出警告。但 Cortex 没有这个概念。你让一个有数据库权限的 Agent 去读一个陌生仓库的文件，这本身就是在信任边界上走钢丝。

![沙箱绕过细节](/assets/img/posts/snowflake-ai-sandbox-escape-2.png){: w="700" }
_沙箱与审批机制被绕过的技术细节_

**3. Indirect Prompt Injection 仍然无解**

Agent 需要读取外部数据来完成任务，但外部数据可能包含恶意指令。这是一个结构性矛盾——你不能让 Agent 既读数据又完全不受数据影响。目前所有方案都是在打补丁，没有根治。

## 对开发者的启示

如果你在构建或使用 AI Agent，几个原则值得刻在显示器上：

- **最小权限原则**：Agent 不需要的权限，一个都不要给。编码 Agent 为什么需要 DROP TABLE 权限？
- **不要信任任何外部输入**：包括看起来人畜无害的 README、注释、甚至变量名
- **沙箱不是万能的**：沙箱只是一层防御，不是最后一层。Shell 的花样比你想象的多
- **审批机制要做到命令级别的完整解析**：不是检查字符串匹配，是真正理解要执行什么

Snowflake 在 2 月 28 日发布了修复版本（1.0.25），响应速度不错。但这个漏洞的存在本身说明：AI Agent 安全还处于"出一个补一个"的阶段，离系统性防御还有很长的路。

在多模型并存的时代，不同 Agent 的安全实现参差不齐。像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台，至少让你在对比模型能力的同时，也能感受到不同厂商在安全设计上的差异——这本身就是一种学习。

---

AI Agent 的能力边界在快速扩展，但安全边界的扩展速度远远跟不上。每一个新的 Agent 工具发布，都是安全研究者的新战场。作为开发者，保持警觉不是悲观，是专业素养。
