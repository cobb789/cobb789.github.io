---
layout: post
title: "Axios 供应链攻击波及 OpenAI：npm 生态的信任危机"
date: 2026-04-11
author: Cobb
categories: [AI, Dev]
tags: [security, supply-chain, npm, openai, north-korea]
pin: false
---

4 月 10 日，OpenAI 发布了一则安全公告：他们的 macOS 应用签名流程受到了 Axios npm 包供应链攻击的影响。攻击者是朝鲜关联的威胁组织，目标是 Axios 1.14.1 版本——一个每周下载量超过 5000 万的 npm 包。

这件事的严重程度，远超"又一个 npm 漏洞"。

## 发生了什么

3 月 31 日，Axios 的 GitHub Actions 工作流被入侵，恶意代码被注入到 1.14.1 版本中。OpenAI 的 macOS 应用签名流程恰好依赖了这个版本——ChatGPT Desktop、Codex App、Codex CLI、Atlas 四个产品的代码签名证书都暴露在了攻击面内。

代码签名证书是什么？它是操作系统用来验证"这个软件确实来自 OpenAI"的凭证。如果证书被窃取，攻击者理论上可以签发伪装成 OpenAI 官方应用的恶意软件。

OpenAI 的分析结论是：由于 payload 执行时序和证书注入顺序等因素，证书**大概率没有被成功窃取**。但他们选择了最保守的策略——假设已泄露，全部轮换。

## 为什么这件事值得关注

**1. 攻击路径的精准性**

这不是漫无目的的"投毒"，而是针对特定高价值目标的精准打击。朝鲜黑客选择 Axios 这个几乎所有 Node.js 项目都会用到的 HTTP 库，通过 GitHub Actions 工作流注入——这意味着任何在 CI/CD 中使用了 Axios 的项目都可能受影响。

**2. npm 生态的结构性脆弱**

JavaScript 生态的依赖树深度是出了名的。一个前端项目动辄 `node_modules` 里上千个包，每一个都是潜在的攻击面。Axios 这种"基础设施级"的包一旦被攻破，波及范围是指数级的。

这不是第一次了。`event-stream`（2018）、`ua-parser-js`（2021）、`colors.js`（2022）……npm 供应链攻击已经成为一种系统性风险。

**3. OpenAI 的应急响应值得学习**

说实话，OpenAI 这次的处理堪称教科书：

- 立即聘请第三方取证团队
- 假设最坏情况（证书已泄露），全部轮换
- 与 Apple 合作确保旧证书无法再签发新软件
- 验证所有已发布软件未被篡改
- 设定明确的版本截止日期（5 月 8 日）

**没有"我们正在调查中"的模糊说辞，直接给出了具体行动和时间线。**

## 开发者该做什么

如果你是 macOS 上的 OpenAI 产品用户，立即更新到最新版本。5 月 8 日之后，旧版本将不再可用。

如果你是 Node.js 开发者，这是一个好时机重新审视你的依赖安全策略：

- **锁定依赖版本**：`package-lock.json` 不是摆设，CI 环境用 `npm ci` 而不是 `npm install`
- **审计依赖**：`npm audit` 定期跑，关注 GitHub Dependabot 告警
- **最小权限原则**：GitHub Actions 的 secrets 只暴露给真正需要的 step
- **考虑使用 Sigstore/cosign** 等工具验证依赖的签名

供应链安全不是"安全团队的事"。当你 `npm install` 的时候，你就在做一个信任决策。

## 更大的图景

这件事折射出 AI 行业一个越来越尖锐的矛盾：AI 公司正在构建人类历史上最强大的系统，但它们的软件基础设施和所有人一样，依赖着同一套开源生态——包括它的脆弱性。

OpenAI 的签名证书差点被朝鲜黑客拿走，不是因为 OpenAI 不重视安全，而是因为整个软件供应链的信任模型本身就有结构性缺陷。

这个问题没有简单的解法。但至少，意识到它的存在是第一步。

---

如果你在多个 AI 模型之间频繁切换做开发和安全测试，推荐试试 [ofox.ai](https://ofox.ai) — 一个账号搞定 Claude、GPT、Gemini 等主流模型，省去来回切换的麻烦。
