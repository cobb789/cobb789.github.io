---
layout: post
title: "Cloudflare 用 AI 一周重写了 Next.js，这意味着什么？"
date: 2026-02-25
author: Cobb
categories: [AI, 前端]
tags: [Cloudflare, Next.js, Vite, AI编程, vinext]
pin: false
---

昨天 Cloudflare 发了一篇博客，标题很炸裂：**一个工程师用 AI 在一周内重写了 Next.js**。产物叫 [vinext](https://github.com/cloudflare/vinext)，基于 Vite 构建，号称是 Next.js 的 drop-in 替代品，构建速度快 4 倍，客户端产物体积小 57%，而且已经有客户在生产环境跑了。

整个项目的 token 成本：**$1,100**。

## Next.js 的部署困局

Next.js 是最流行的 React 框架，这没争议。但它有一个老生常谈的问题——部署到非 Vercel 平台非常痛苦。

Next.js 的构建工具链是高度定制的（Turbopack），产出格式也是 Vercel 特化的。如果你想部署到 Cloudflare Workers、Netlify 或 AWS Lambda，就得把构建产物重新"翻译"一遍。各平台的适配层（adapter）既脆弱又难维护，每次 Next.js 大版本更新都可能把适配层搞崩。

这不是技术能力的问题，而是架构选择的必然结果。Next.js 的构建管道对外部平台来说就是个黑盒。

## vinext 的思路：换掉地基

Cloudflare 的解法很直接——不适配了，直接用 Vite 重写一个。

vinext 保持了 Next.js 的 API 和约定（App Router、Server Components、文件系统路由等），但底层完全换成了 Vite。这意味着：

- **构建速度大幅提升**：Vite 的增量构建和 esbuild/Rollup 管道本身就比 Webpack/Turbopack 快
- **产物更小**：Vite 的 tree-shaking 和 code splitting 更激进
- **原生支持 Cloudflare Workers**：不需要适配层，构建产物直接就是 Workers 能跑的格式

更关键的是，因为基于 Vite 生态，vinext 天然兼容 Vite 的插件系统，这意味着社区已有的大量 Vite 插件可以直接用。

## 真正的重点：AI 作为工程放大器

坦白说，vinext 的技术思路并不新鲜。社区里早就有人讨论过"用 Vite 替换 Next.js 的构建层"，也有类似的尝试（比如 vite-plugin-ssr）。

但之前没人能在一周内做到"基本可用"的程度。这次的变量是 AI。

一个工程师 + AI，一周，$1,100。这个数字才是真正值得关注的。

它说明了几件事：

**1. AI 编程已经过了"写 demo"的阶段。** vinext 不是一个玩具项目，它已经有客户在生产环境使用。AI 辅助开发正在进入"可以产出生产级代码"的阶段。

**2. 框架级别的工程变得更便宜了。** 以前重写一个框架是需要一个团队做几个月的事。现在一个有经验的工程师配合 AI，一周就能做出原型并推上生产。这会改变很多"build vs buy"的决策。

**3. 竞争壁垒在重新定义。** 如果重写一个框架的成本从"几百万"降到"一千美元"，那框架的护城河在哪里？答案可能不再是代码本身，而是生态、社区和运维经验。

## 冷静看几个问题

当然也不能全盘乐观：

- **兼容性深度存疑**。Next.js 的 API 表面很大，特别是 middleware、ISR、各种 caching 策略。一周时间大概率只覆盖了主要路径，长尾 case 还需要时间打磨。
- **维护成本未知**。写出来容易，跟上 React 和 Next.js 的演进才是持久战。
- **$1,100 的前提是有经验的工程师**。AI 放大的是人的能力，不是凭空创造能力。一个不熟悉框架内部机制的人，花 $11,000 也未必能做出来。

## 写在最后

vinext 本身是否能替代 Next.js 不是最重要的，重要的是它验证了一种新的工程范式：**AI 辅助的快速框架级开发**。这个趋势会加速整个前端工具链的迭代，也会让更多"不满意现有方案"的团队有勇气自己动手。

对开发者来说，这也是一个信号——AI 编程工具的选择越来越重要。不同模型在代码生成、架构理解、上下文处理上的差异很大，选对工具能带来数量级的效率提升。如果你想对比不同模型的编程表现，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号聚合 Claude、GPT、Gemini 等主流模型，快速找到最适合你工作流的那个。
