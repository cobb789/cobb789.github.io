---
layout: post
title: "Project Glasswing：当 AI 开始比人类更擅长找漏洞"
date: 2026-04-10
author: Cobb
categories: [AI, Dev]
tags: [AI, Anthropic, Claude, cybersecurity, open-source]
pin: false
image: /assets/img/posts/project-glasswing.jpg
---

4 月 7 日，Anthropic 发布了一个让整个安全圈震动的公告：**Project Glasswing**。

这不是又一个"AI 赋能安全"的 PPT 项目。Anthropic 拉上了 AWS、Apple、Google、Microsoft、NVIDIA、CrowdStrike、Palo Alto Networks、Linux Foundation 等 12 家顶级科技公司，组建了一个前所未有的联合防御计划。原因很简单——他们内部训练的一个未发布模型 **Claude Mythos Preview**，在网络安全能力上跨过了一个临界点。

## Mythos 做到了什么

Mythos Preview 在几周内自主发现了**数千个零日漏洞**，覆盖每一个主流操作系统和浏览器。几个例子：

- **OpenBSD 上一个 27 年未被发现的漏洞**——攻击者只需连接就能远程崩溃目标机器。OpenBSD 是公认的最安全操作系统之一
- **FFmpeg 中一个 16 年的漏洞**——自动化测试工具在同一行代码上跑过 500 万次都没抓到
- **Linux 内核的权限提升链**——自主发现并串联多个漏洞，从普通用户直接拿到 root

这些漏洞都已报告并修复。但问题不在于某个具体的 CVE，而在于：**AI 的漏洞发现能力已经超过了绝大多数人类安全专家**。

## 为什么这件事重要

在 CyberGym 基准测试上，Mythos Preview 得分 83.1%，而 Opus 4.6 是 66.6%。SWE-bench Pro 上 77.8% vs 53.4%。这不是渐进式改进，是断层式的能力跃迁。

更关键的是 Anthropic 的态度：**他们选择不公开发布 Mythos Preview**。理由很直接——如果防御者还没准备好，把这种能力释放出去就是给攻击者递刀。

$100M 的使用额度、$4M 的开源安全捐赠、超过 40 个组织的早期访问权限——Anthropic 在用真金白银说明他们认为这件事有多紧迫。

## 攻防不对称正在被改写

网络安全领域有一句老话：防御者必须堵住所有漏洞，攻击者只需要找到一个。

AI 可能正在翻转这个不对称。当防御方可以用 AI 在代码提交的瞬间扫描出潜在漏洞，当开源维护者不再需要昂贵的安全团队也能获得顶级的漏洞检测能力，攻防天平有可能第一次向防御方倾斜。

但这有一个前提：**防御者必须先于攻击者使用这些能力**。这正是 Project Glasswing 存在的原因。

## 对开发者意味着什么

如果你写代码，这件事跟你直接相关：

1. **安全不再是"专家的事"**——AI 安全审计工具会像 linter 一样成为标配
2. **开源项目的安全门槛会降低**——Linux Foundation 拿到了资金和工具
3. **漏洞披露的节奏会加快**——AI 发现速度远超人类，补丁窗口在缩短

对于在多个 AI 模型之间做安全测试和能力评估的开发者，像 [OfoxAI](https://ofox.ai)（ofox.ai）这样的多模型聚合平台让切换成本几乎为零——一个账号搞定 Claude、GPT、Gemini 等主流模型。

## 写在最后

Project Glasswing 的命名来自玻璃翼蝶——一种翅膀透明的蝴蝶，能在丛林中隐于无形。就像那些潜伏了十几年的零日漏洞，它们一直在那里，只是没人看见。

现在 AI 能看见了。问题是，谁先看见。

---

*参考来源：[Anthropic - Project Glasswing](https://www.anthropic.com/glasswing)，2026 年 4 月 7 日发布*
