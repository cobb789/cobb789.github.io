---
layout: post
title: "从 300KB 到 69KB：LLM 如何解决 KV Cache 的「记忆之重」"
date: 2026-04-01
author: Cobb
categories: [AI, Dev]
tags: [LLM, KV Cache, transformer, architecture, inference]
pin: false
image: /assets/img/posts/kv-cache-weight-of-remembering.jpg
---

作为 [OfoxAI](https://ofox.ai)（ofox.ai）的工程师，我每天都在和不同模型的推理性能打交道。最近 Hacker News 上一篇关于 KV Cache 演进的文章引起了我的注意 —— 它把一个底层但至关重要的工程问题讲得足够清楚。

## 你的对话是有「重量」的

当你向 ChatGPT 发送一条消息时，每个 token 会生成 query、key、value 三个向量。其中 key-value 对会被缓存在 GPU 显存中 —— 这就是 KV Cache。没有它，生成每个新 token 都要重新处理整段对话历史，计算复杂度从线性退化为平方级。

但 KV Cache 有代价。GPT-2 时代，**每个 token 占 300KB 显存**。一段 4000 token 的对话，光缓存就要吃掉 1.2GB —— 还没算模型权重本身。

![KV Cache 的演进](/assets/img/posts/kv-cache-weight-of-remembering.jpg){: w="700" }
_从 GPT-2 到 DeepSeek V3，每个 token 的 KV Cache 开销缩减了 77%_

## 四次架构演进，四种记忆哲学

Sebastian Raschka 的 LLM Architecture Gallery 对比了不同架构的 KV Cache 开销，数据很直观：

### 1. GPT-2（2019）：全量记忆 —— 300KB/token

多头注意力（MHA）的原始形态。每个注意力头独立维护自己的 key-value 对，不共享、不压缩。设计哲学很朴素：显存便宜，那就全记住。

### 2. Llama 3（2024）：共享记忆 —— 128KB/token

分组查询注意力（GQA）让多个 query head 共享同一组 key-value 对。开销直接砍半，精度几乎无损。背后的洞察是：**很多注意力头学到的表征是冗余的**。共享视角和独立视角效果差不多。

### 3. DeepSeek V3（2024）：压缩记忆 —— 69KB/token

多头潜在注意力（MLA）更激进：先把 key-value 压缩到低维潜在空间，推理时再解压。671B 参数的模型（MoE 路由后仅 37B 活跃），每 token 只要 69KB。有损压缩？是的。但消融实验表明效果持平甚至略优于标准 MHA。

### 4. 更远的未来：选择性记忆

Mamba 等状态空间模型走得更远 —— 用固定大小的隐状态替代整个 KV Cache，理论上实现常数级内存开销。代价是牺牲对历史 token 的精确回溯能力。

## 工程启示

这条演进路线清晰地展示了一个工程权衡：**精确记忆 vs. 高效记忆**。

- 全量缓存 → 精确但昂贵
- 共享 key-value → 利用冗余
- 潜在空间压缩 → 有损但高效
- 固定状态 → 极致高效但丢失细节

这跟我们做系统设计一模一样。Cache 策略永远是空间、速度和精度的三角博弈。LLM 架构师们用了六年，把单 token 开销压缩了 77%，而且还在继续。

对开发者来说，理解 KV Cache 的开销有实际意义：长上下文窗口不是免费的，128K context 的代价远比你想象的大。选模型时除了看 benchmark 分数，也该看看它的推理效率。

---

> 参考：[The Weight of Remembering](https://news.future-shock.ai/the-weight-of-remembering/)（Future Shock AI, 2026-03）
