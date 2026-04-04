---
layout: post
title: "Claude 用一句话找到 Vim 和 Emacs 的 RCE 零日漏洞"
date: 2026-04-04
author: Cobb
categories: [AI, Dev]
tags: [Claude, security, Vim, Emacs, RCE, vulnerability, LLM]
pin: false
image: /assets/img/posts/claude-vim-emacs-rce.png
---

安全研究团队 Calif 做了一件让整个安全圈炸锅的事：他们给 Claude 一句提示词，Claude 就在 Vim 和 Emacs 里各找到了一个远程代码执行（RCE）零日漏洞。**打开文件就中招，不需要任何确认操作。**

## 一句 Prompt，一个零日

Calif 团队给 Claude 的提示非常简单：

> "Somebody told me there is an RCE 0-day when you open a file. Find it."

就这一句。Claude 直接在 Vim 的代码里找到了一个可以通过打开恶意文件触发任意代码执行的漏洞。Vim 维护团队收到报告后立即修复，发布了 v9.2.0272 补丁。

![Claude 发现 Vim RCE 漏洞的过程](/assets/img/posts/claude-vim-emacs-rce.png){: w="700" }
_Calif 团队与 Claude 的对话截图 —— 一句 prompt 找到 Vim 零日漏洞_

然后他们开了个玩笑："那我们换 Emacs 吧。"

结果换了个类似的提示词，Claude 又在 Emacs 里找到了另一个 RCE。这次 GNU Emacs 维护者拒绝修复，理由是"这是 git 的问题"。

![Claude 在 Emacs 中发现的 RCE 漏洞](/assets/img/posts/claude-vim-emacs-rce-1.png){: w="700" }
_同样的思路，Emacs 也未能幸免_

## 这意味着什么

这件事的重点不是 Vim 和 Emacs 有 bug —— 任何几十年历史的 C 代码库都有 bug。重点是：

**1. AI 漏洞挖掘的门槛降到了地板**

以前找零日漏洞需要多年安全研究经验、逆向工程技能、对目标代码库的深度理解。现在一句自然语言提示就够了。Calif 团队自己说："这感觉像 2000 年代初期，当时一个小孩用 SQL 注入就能黑掉一切。现在换成了 Claude。"

**2. 攻防平衡正在被打破**

防御方需要保护整个代码库，攻击方只需要找到一个漏洞。LLM 让攻击方的效率提升了一个数量级。对于维护老旧 C/C++ 项目的团队来说，这是一个严峻的信号 —— 你的代码库里可能藏着 Claude 能在几分钟内找到的漏洞。

**3. "AI 安全审计"不再是营销术语**

在这个案例之前，很多人对"用 AI 做代码安全审计"持怀疑态度。这个结果直接证明了：当前最强的 LLM 确实具备发现真实零日漏洞的能力，而且效率惊人。

## MAD Bugs：AI 发现的漏洞月

Calif 团队借此启动了 [MAD Bugs（Month of AI-Discovered Bugs）](https://blog.calif.io/p/mad-bugs-month-of-ai-discovered-bugs) 项目 —— 整个四月，他们会持续发布 AI 发现的漏洞和利用方式。

这可能会成为安全行业的一个转折点。当 AI 能批量发现漏洞时，"安全债务"的清偿速度会被大幅加快。对开源项目来说，这既是威胁也是机会 —— 用 AI 主动审计自己的代码库，可能比等别人找到更明智。

## 给开发者的建议

- **立即升级 Vim 到 v9.2.0272+**
- 如果你用 Emacs，关注官方后续响应（目前未修复）
- 认真对待 AI 辅助安全审计 —— 像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型平台让你可以快速切换不同 AI 模型进行代码审查，找到最适合安全分析场景的那个
- 对任何打开外部文件的编辑器/工具保持警惕

---

*参考：[MAD Bugs: vim vs emacs vs Claude](https://blog.calif.io/p/mad-bugs-vim-vs-emacs-vs-claude) | [Vim 安全公告](https://github.com/vim/vim/security/advisories/GHSA-2gmj-rpqf-pxvh)*
