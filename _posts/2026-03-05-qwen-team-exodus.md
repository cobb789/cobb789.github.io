---
layout: post
title: "Qwen 核心团队出走：开源 AI 的商业化困局"
date: 2026-03-05
author: Cobb
categories: [AI]
tags: [AI, LLM, Qwen, Alibaba, open-source]
pin: false
---

作为 [OfoxAI](https://ofox.ai)（ofox.ai）的开发者，我每天都在跟各家大模型打交道。昨天 Qwen3.5 小模型系列刚发布，今天就传来核心团队出走的消息 — 这个反差太戏剧性了。

## 发生了什么

Qwen 团队技术负责人林俊洋（Junyang Lin）在 X 上发了一句话：「me stepping down. bye my beloved qwen.」随后，高级研究员 Binyuan Hui 和实习生 Kaixin Li 也宣布离开。没有解释原因，没有官方声明。

这不是普通的人事变动。林俊洋是 Qwen 从实验室项目成长为全球开源 AI 标杆的核心推手，Qwen 系列在 HuggingFace 上的下载量超过 6 亿次。

## Qwen3.5：一份漂亮的告别礼物

讽刺的是，团队离开前交出的 Qwen3.5 小模型系列可能是他们最好的作品。

9B 参数的模型用 Gated DeltaNet 混合架构，3:1 的线性注意力与全注意力比例，支持 26.2 万 token 的上下文窗口，能在笔记本甚至手机上本地运行。Elon Musk 都公开称赞其「令人印象深刻的智能密度」。

这不是什么 benchmark 刷分，这是实打实的工程突破 — 让大模型跑在边缘设备上，这一直是林俊洋主张的「算法-硬件协同设计」路线。

## 真正的问题：开源与商业化的张力

VentureBeat 用了一个很准确的词：「aggressive monetization」。这几乎是所有开源 AI 项目的宿命 — 研究团队追求技术影响力和开源声誉，企业管理层追求商业回报。

这不是阿里独有的问题。Meta 的 LLaMA 团队、Google 的 DeepMind，都在经历类似的张力。区别在于，Qwen 团队的离开来得如此突然，如此公开，暗示矛盾已经不可调和。

几个值得关注的信号：

1. **时机敏感** — 在重大发布后 24 小时内离开，说明决定早已做出，只是在等产品交付
2. **集体行动** — 技术负责人带着核心成员一起走，这不是个人选择，是路线分歧
3. **沉默** — 阿里官方没有回应，三位离职者也没有解释原因，这种沉默本身就是信号

## 对开发者意味着什么

短期来看，Qwen 的开源模型不会消失。代码在 GitHub 上，权重在 HuggingFace 上，社区可以继续用。

但长期来看，这个事件提出了一个更大的问题：**开源大模型的可持续性**。

如果核心贡献者离开，谁来维护？谁来做下一代的架构创新？社区 fork 可以修 bug，但很难做出 Qwen3.5 这种级别的架构突破。

我的判断：Qwen 的黄金时代可能已经过去了。不是因为技术不行，而是因为做开源 AI 需要的不只是钱和算力 — 还需要一群真正相信开源的人。

## 一点思考

大模型领域正在经历一个「商业化觉醒」的阶段。训练一个前沿模型的成本是天文数字，投资人要回报，管理层要营收。开源，至少在当前的商业逻辑下，是一个越来越难以维持的选择。

这也是为什么多模型策略变得越来越重要 — 不要把赌注押在任何单一模型或团队上。今天是 Qwen，明天可能是别的项目。保持灵活，随时切换，才是开发者的生存之道。

---

*参考来源：[VentureBeat - Did Alibaba just kneecap its powerful Qwen AI team?](https://venturebeat.com/technology/did-alibaba-just-kneecap-its-powerful-qwen-ai-team-key-figures-depart-in)*
