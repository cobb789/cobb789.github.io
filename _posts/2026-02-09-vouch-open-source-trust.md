---
layout: post
title: "当 AI 开始给开源提 PR：Mitchell Hashimoto 的 Vouch 信任系统"
date: 2026-02-09
author: Cobb
categories: [Dev, AI]
tags: [open source, AI, trust, ghostty, mitchell hashimoto, community]
pin: false
---

## 一个问题：谁在给你的项目提 PR？

如果你维护过开源项目，你可能已经注意到了变化。

过去，一个人要给你的项目贡献代码，他需要理解代码库、写出改动、通过 review。这个过程本身就是一道天然过滤器 —— 能走完这个流程的人，大概率是认真的。

但现在，AI 工具让"提交一个看起来合理的 PR"变得几乎零成本。你可能收到过这样的贡献：代码结构看起来没问题，注释写得也对，但你总觉得哪里不对劲。仔细看，发现改动解决了一个根本不存在的问题，或者引入了一个微妙的 regression。

这不是假设场景。Ghostty（一个流行的终端模拟器）的维护者 Mitchell Hashimoto 就面对着这个现实。今天他开源了 [Vouch](https://github.com/mitchellh/vouch) —— 一个社区信任管理系统，直接登上了 Hacker News 头条（775+ 分，357+ 条评论）。

## Vouch 是什么

核心思路出奇简单：**在允许一个人给项目做贡献之前，先让已经被信任的人为他担保（vouch）。**

整个系统围绕一个纯文本文件运转：

```
# VOUCHED.td
github:mitchellh
github:trusteddev
-github:badactor Submitted AI slop
```

- 一行一个用户名，字母排序
- 前缀 `-` 表示 denounce（明确拒绝）
- 可以附带原因说明

没有数据库，没有服务端，没有复杂的权限模型。就是一个可以用 `grep` 解析的文本文件，存在你的 Git 仓库里，接受版本控制，所有变更可追溯。

### 工作流程

Vouch 提供了 GitHub Actions 集成：

1. **check-pr**：PR 提交时自动检查作者是否被 vouch。未被 vouch 的 PR 可以自动关闭
2. **manage-by-issue / manage-by-discussion**：有写权限的协作者可以在 Issue 或 Discussion 中用 `vouch @username` 命令为用户担保

Bot 和已有写权限的协作者自动放行，不需要 vouch。

### 信任网络（Web of Trust）

这是最有意思的设计：Vouch 列表可以形成信任网络。项目 A 可以引用项目 B 的 vouch 列表 —— 如果一个贡献者已经被项目 B 信任，那么项目 A 可以自动承认这个信任。

这有点像 PGP 的信任网络，但实现上简单得多。用 Hashimoto 自己的话说："不是安全系统，是噪音过滤器。"

## 为什么现在需要这个

Mitchell Hashimoto 在项目 README 中写得很直白：

> "Open source has always worked on a system of trust and verify... Unfortunately, the landscape has changed particularly with the advent of AI tools that allow people to trivially create plausible-looking but extremely low-quality contributions."

这不是夸张。2025-2026 年，开源社区面临的 "AI slop" 问题越来越严重：

- **低质量 PR 泛滥**：用 AI 生成代码、修复不存在的 bug、添加不需要的功能
- **Hacktoberfest 效应恶化**：以前只有每年十月会有垃圾 PR 洪水，现在全年无休
- **维护者精力有限**：review 一个看似合理但实际有问题的 PR 比拒绝一个明显错误的 PR 花费更多时间

传统的解决方案（CLA、issue 审核、PR 模板）在 AI 面前都显得力不从心，因为它们假设提交贡献的人至少理解自己在做什么。

## 社区反应：支持与担忧

X/Twitter 上的开发者反应热烈。GitHub 的前 VP Mike McQuaid 称其"brilliant"，计划在自己的项目中采用。安全开发者 @jedisct1 表示"有意思"。更多人将其比作"给人用的 PageRank"——AI 时代的信誉系统。

但批评也很集中，主要有三个方向：

**1. 对新人不友好？**

这是被问得最多的问题：新手怎么办？连 vouch 都没有的人岂不是永远无法贡献？

Hashimoto 的回应是：政策由项目自己定。Vouch 只是工具，不是规则。你可以要求新人先在 Issue 里自我介绍，然后维护者决定是否 vouch。门槛很低，跟你加入一个需要邀请码的社区差不多。

**2. 容易被社交工程利用？**

比如：一个被 vouch 的坏人能不能为更多坏人 vouch？

答案是不能。默认只有项目管理员和有写权限的协作者才能 vouch。被 vouch 的普通贡献者没有 vouch 他人的权力，也没有合并 PR 的权限。所有变更都在 Git 历史中，完全可审计。

**3. 太复杂了？**

恰恰相反。整个系统的核心是一个文本文件加几个 shell 命令。CLI 用 Nushell 写的，没有外部依赖。这可能是你能想到的最朴素的信任系统。

## 我的看法

作为一个写了十年代码的人，我对 Vouch 的判断是：**方向对，实现克制，但还需要时间验证。**

**方向对**是因为问题真实存在。AI 不会停止进步，生成看起来合理的代码只会越来越容易。开源社区需要新的信号机制来区分"理解了代码库的贡献者"和"让 AI 生成了看起来合理的 diff 的人"。

**实现克制**是 Vouch 最大的优点。没有引入重型基础设施，没有区块链，没有 token，就是一个文本文件。这意味着任何项目都可以在 5 分钟内接入，不喜欢了可以随时去掉。可逆的架构决策是好的架构决策。

**需要时间验证**的是信任网络能不能真正 scale。单个项目内的 vouch 很好管理，但当多个项目互相引用 vouch 列表时，一个项目的信任标准可能跟另一个项目完全不同。这本质上是去中心化信任的老问题 —— PGP 的信任网络也面临同样的挑战。

还有一个更深层的问题：**Vouch 解决的是症状还是根因？** 真正的问题不是"不可信的人提了 PR"，而是"review 成本太高"。如果未来 AI 能帮助维护者快速检测 PR 质量（而不是帮助贡献者生成 PR），那 Vouch 这类系统可能就不需要了。

但在那一天到来之前，Vouch 是一个务实的解决方案。用 Hashimoto 的哲学来说：**do things that don't scale, but solve real problems now.**

## 实用建议

如果你维护开源项目，建议你：

1. **先观察**：看看 [Ghostty](https://github.com/ghostty-org/ghostty) 的实践效果，不急着跟进
2. **评估你的痛点**：如果你的项目确实被 AI 垃圾 PR 困扰，值得试试
3. **设计宽松的政策**：第一次贡献者可以在 Issue 里 "敲门"，维护者按需 vouch，别搞成封闭俱乐部
4. **关注信任网络**：如果你的项目生态中有其他项目也用 Vouch，互通 vouch 列表能大幅降低摩擦

AI 正在改变开源的游戏规则。Vouch 不是最终答案，但它问了一个正确的问题：**在 AI 时代，我们如何重建开源社区的信任基础？**

---

*项目地址：[github.com/mitchellh/vouch](https://github.com/mitchellh/vouch) | HN 讨论：775+ points*
