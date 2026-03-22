---
layout: post
title: "Tinybox：$12,000 买一台离线 AI 主机，跑 120B 参数模型"
date: 2026-03-22
author: Cobb
categories: [AI, Hardware]
tags: [AI, hardware, tinygrad, tinybox, local-ai, geohot]
pin: false
image: /assets/img/posts/tinybox-offline-ai-hardware.png
---

George Hotz（geohot）的 tiny corp 做了一件有意思的事：把 AI 推理的算力打包进一台可以放在办公室的机器里，售价 $12,000 起。这就是 Tinybox。

今天这东西冲上 HN 首页 300+ points，说明开发者群体对「本地 AI 算力」的需求不是在减弱，而是在加速。

## 硬件规格：两个版本，一个方向

![Tinybox Green V2 搭载 4 块 RTX PRO 6000 Blackwell](/assets/img/posts/tinybox-offline-ai-hardware-1.jpg){: w="700" }
_Tinybox Green V2：4x RTX PRO 6000 Blackwell，384GB 显存_

Tinybox 目前有两个在售版本：

**Red V2（$12,000）**
- 4x AMD 9070XT，64GB 显存
- 778 TFLOPS FP16
- 2560 GB/s 显存带宽
- 功耗 1600W，噪音 < 50dB

**Green V2（$65,000）**
- 4x RTX PRO 6000 Blackwell，384GB 显存
- 3086 TFLOPS FP16
- 7168 GB/s 显存带宽
- 功耗 3200W

还有一个 Exabox 在规划中 —— 720 块 RDNA5 GPU，逼近 1 EXAFLOP，预计 2027 年发售，价格约 $10M。那是数据中心的事了，跟个人开发者无关。

## 为什么值得关注

**不是性价比，是所有权。**

云端推理的问题不是贵（虽然也贵），而是你永远不拥有算力。API 可以涨价、限流、下架模型、审查输出。你的业务建立在别人的基础设施上，就要承受别人的决策。

Tinybox Red 的 $12,000 大概相当于 6-12 个月的云端 GPU 租金。过了这个时间点，每一次推理都是免费的。对于需要持续运行本地模型的团队来说，这笔账算得过来。

**120B 参数不是噱头。**

Green V2 的 384GB 显存可以完整装下 120B 参数模型（FP16）。这个规模已经覆盖了 Llama 3 70B、Qwen 72B 等主流开源模型，甚至可以跑更大的量化版本。对于大部分企业级推理场景，够用了。

## tinygrad 是关键

Tinybox 不只是硬件。tiny corp 自己写了 tinygrad —— 一个极简的神经网络框架，把所有操作归结为三类 Op：Elementwise、Reduce、Movement。

这个设计哲学很激进：不是在 PyTorch 上做优化，而是从零开始重新定义计算图应该长什么样。好处是跨硬件兼容性更好（AMD、NVIDIA 都能跑），坏处是生态还很早期，不能直接跑 Hugging Face 上的模型。

作为工程师，我欣赏这种「重新发明轮子」的勇气 —— 前提是轮子确实更好。tinygrad 在特定场景下的性能已经证明了这一点。

## 冷静看待

几个现实问题：

1. **软件生态不成熟。** 你不能 `pip install transformers` 然后直接跑。需要用 tinygrad 的接口，模型兼容性有限
2. **散热和噪音。** Green V2 的 3200W 功耗意味着你需要认真考虑电力和散热方案
3. **维护成本。** 自建硬件的隐性成本 —— 运维、升级、故障排除 —— 容易被低估
4. **模型更新速度。** 云端 API 的优势在于你永远可以用最新的模型。本地硬件只能跑开源模型，更新节奏不同

## 我的判断

Tinybox 代表的方向是对的：AI 算力应该像电脑一样，可以买、可以拥有、可以控制。geohot 用 $12,000 的价格把这件事做到了消费级的边缘。

但现阶段它更适合三类用户：隐私敏感型企业、AI 研究团队、以及对硬件有执念的开发者。对大部分人来说，云端 API 仍然是更务实的选择 —— 至少在开源模型追上闭源模型之前。

如果你在多个 AI 模型之间频繁切换，推荐试试 [OfoxAI](https://ofox.ai)（ofox.ai）— 一个账号搞定 Claude、GPT、Gemini 等主流模型，不用自建硬件也能灵活调用。

---

*参考来源：[tinygrad.org](https://tinygrad.org/#tinybox)，[Hacker News 讨论](https://news.ycombinator.com/)*
