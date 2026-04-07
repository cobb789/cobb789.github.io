---
layout: post
title: "Project Glasswing：Anthropic 联合 12 家科技巨头，用 AI 修 AI 时代的安全漏洞"
date: 2026-04-08
author: Cobb
categories: [AI, Dev]
tags: [Anthropic, Claude, Cybersecurity, AI Safety, Glasswing]
pin: false
image: /assets/img/posts/project-glasswing.jpg
---

作为 [OfoxAI](https://ofox.ai)（ofox.ai）的开发者，我每天都在和不同的 AI 模型打交道。但昨天 Anthropic 发布的这条消息，让我停下来认真读了三遍 —— 这可能是 2026 年目前为止最重要的 AI 安全事件。

**Project Glasswing**：Anthropic 联合 AWS、Apple、Google、Microsoft、NVIDIA 等 12 家科技巨头，发起了一个旨在保护全球关键软件安全的倡议。HN 热榜 507 分，而这只是冰山一角。

## 一个令人不安的事实

先说结论：**AI 模型在发现和利用软件漏洞方面，已经超越了绝大多数人类安全专家。**

Anthropic 公布了一个未发布的前沿模型 Claude Mythos Preview。这个模型已经在所有主流操作系统和浏览器中发现了数千个高危零日漏洞。几个例子：

- **OpenBSD**：一个 27 年的漏洞。OpenBSD 号称全球最安全的操作系统之一，被用于防火墙和关键基础设施。这个漏洞允许攻击者远程崩溃任何运行该系统的机器 —— 只需要连接上去就行。
- **FFmpeg**：一个 16 年的漏洞。FFmpeg 是几乎所有视频软件的底层依赖。这行代码被自动化测试工具命中了**五百万次**，从来没被发现有问题。
- **Linux 内核**：Mythos Preview 自主找到并串联了多个漏洞，实现了从普通用户权限到完全控制机器的提权攻击。

这不是精心挑选的 demo。这是一个通用模型，在几乎没有人类引导的情况下，自主完成的漏洞发现和利用链。

## 为什么现在是临界点

网络安全一直是猫鼠游戏。但游戏规则正在被重写。

过去，发现和利用漏洞需要顶尖专家花费数周甚至数月。这种稀缺性本身就是一种保护 —— 能做这件事的人太少了。

现在，AI 模型把这个门槛彻底拉低。Mythos Preview 在 CyberGym 基准测试上的漏洞复现率达到 83.1%，比 Claude Opus 4.6 的 66.6% 高出一截。而这只是开始 —— 按照 AI 能力的增长曲线，几个月后会更强。

问题是：**防御者和攻击者同时获得了这种能力**。但防御者需要保护的是整个攻击面，攻击者只需要找到一个入口。这是一场不对称的战争。

## Glasswing 在做什么

Anthropic 的策略很直接：与其等着这些能力扩散到恶意行为者手里，不如先把它用在防御上。

**12 家发起方：** AWS、Anthropic、Apple、Broadcom、Cisco、CrowdStrike、Google、JPMorganChase、Linux Foundation、Microsoft、NVIDIA、Palo Alto Networks。

**40+ 扩展方：** 构建或维护关键软件基础设施的组织，可以使用 Mythos Preview 扫描一方和开源系统。

**投入：** Anthropic 承诺提供高达 1 亿美元的 Mythos Preview 使用额度，以及 400 万美元直接捐赠给开源安全组织。

从合作方的反馈来看，效果是显著的。Microsoft 的 MSRC 团队说，在他们的 CTI-REALM 安全基准测试上，Mythos Preview 相比之前的模型有「实质性提升」。AWS 已经在用它检查关键代码库。

## 几点思考

**1. AI 安全的悖论**

我们用 AI 来发现 AI 时代的安全问题。这本身就是一个奇怪的循环。但现实是，没有更好的选择 —— 传统的代码审计和自动化测试显然不够用了。FFmpeg 那行代码被测试了五百万次都没出事，直到 Mythos Preview 看了一眼。

**2. 开源软件的脆弱性**

Linux 内核、FFmpeg、OpenBSD —— 这些是全球数字基础设施的底座。它们大多由志愿者维护，资源有限。Glasswing 的 400 万美元捐赠和免费使用额度是一个开始，但长期来看，开源安全的资金和人力问题需要更系统的解决方案。

**3. 能力扩散是不可避免的**

Anthropic 没有公开发布 Mythos Preview，但这种能力迟早会出现在其他模型上。开源模型在追赶，国家级行为者在自研。Glasswing 的窗口期可能只有几个月到一两年。在这段时间内能修掉多少漏洞，决定了防御者能领先多少。

**4. 这对开发者意味着什么**

如果你在写代码，尤其是涉及安全敏感场景的代码 —— 现在是时候重新审视你的代码审计流程了。人类 review + 传统 SAST 工具可能不够用了。AI 辅助的安全扫描会成为标配。

## 写在最后

Project Glasswing 不是一个产品发布，而是一个信号：AI 能力已经到达了一个临界点，我们需要重新思考整个网络安全的范式。

防御者和攻击者的军备竞赛已经进入 AI 时代。好消息是，至少现在，防御者先动手了。

---

**参考链接：**
- [Project Glasswing 官方公告](https://www.anthropic.com/glasswing)
- [Anthropic Frontier Red Team 技术细节](https://red.anthropic.com/2026/mythos-preview)
