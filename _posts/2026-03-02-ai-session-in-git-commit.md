---
layout: post
title: "AI 写的代码，Session 该不该跟着进 Commit？"
date: 2026-03-02
author: Cobb
categories: [AI, 开发工具]
tags: [AI编程, Git, 开发者工具, 代码审计]
pin: false
image: /assets/img/posts/ai-session-in-git-commit.jpg
---

做 [ofox.ai](https://ofox.ai)（多模型聚合平台）的过程中，我每天大量使用 AI 辅助编码。最近在 Hacker News 上看到一个项目，让我重新思考了一个问题：**AI 帮你写的代码，那段对话该不该成为代码历史的一部分？**

## git-memento：把 AI 对话钉在 Commit 上

[git-memento](https://github.com/mandel-macaque/memento) 是一个 Git 扩展工具，核心思路很简单——每次你用 AI（Codex、Claude 等）辅助完成代码后提交 commit，它会把对应的 AI 会话记录作为 Git Note 附加到这个 commit 上。

```bash
git memento commit <session-id> -m "实现用户认证模块"
```

这条命令做了两件事：正常的 git commit，加上把 AI 对话的 markdown 版本存到 git notes 里。团队成员可以通过 `git memento share-notes` 同步这些记录。

## 为什么这件事值得认真对待

### 1. 代码审查的上下文缺失

现在的 Code Review 流程有一个越来越明显的盲区：**你看到的是结果，但不知道过程**。同样一段看起来合理的代码，可能是开发者深思熟虑写出来的，也可能是 AI 生成后开发者没仔细检查就提交的。

当 AI 生成的代码比例越来越高，reviewer 需要知道哪些代码来自 AI，才能调整审查的侧重点。AI 生成的代码往往在边界条件、错误处理上存在微妙的问题，这些恰恰是需要重点关注的。

### 2. Debug 时的「考古」需求

三个月后出了 bug，你 `git blame` 找到那行代码，发现 commit message 写的是「实现缓存逻辑」。但当时 AI 的 prompt 是什么？你给了什么约束条件？AI 是否提醒过某个潜在风险但你忽略了？

这些信息如果在 git notes 里，排查效率会完全不同。

### 3. 合规与审计的现实需求

在金融、医疗等受监管行业，代码审计正在把 AI 辅助编码纳入考量范围。「这段关键逻辑是谁写的」不再是一个简单的问题——如果是 AI 生成的，审计方可能要求额外的验证流程。

## 现实中的顾虑

当然，这个方案并非没有问题：

**隐私与信息泄露**。AI 对话中可能包含业务逻辑的详细讨论、系统架构信息，甚至偶尔粘贴进去的敏感数据。把这些永久记录在 git 历史中，需要仔细的脱敏处理。

**噪音问题**。不是每次 AI 交互都有记录价值。有时候你只是让 AI 帮你格式化一段 JSON，这种对话存进 commit 历史纯属噪音。git-memento 目前需要手动指定 session-id，这是一个合理的设计——由开发者判断哪些对话值得保留。

**存储开销**。Git notes 虽然不影响代码仓库本身的大小，但大量的对话记录累积起来也不可忽视。

## 我的判断

AI 辅助编码的透明度问题，迟早会从「最佳实践」变成「行业要求」。git-memento 的方向是对的——利用 Git 已有的 notes 机制，不侵入现有工作流，让开发者按需记录。

更务实的做法可能是：不需要记录每一次 AI 交互，但对于核心业务逻辑、安全相关代码，记录 AI 参与的上下文应该成为团队规范的一部分。

AI 编程工具在飞速进化，围绕它的工程实践也该跟上了。
