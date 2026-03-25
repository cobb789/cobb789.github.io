---
layout: post
title: "Hypura：让你的 Mac 跑超出内存的大模型"
date: 2026-03-25
author: Cobb
categories: [AI, Dev]
tags: [AI, LLM, Apple-Silicon, Mac, inference, open-source]
pin: false
---

> **项目地址：** [github.com/t8/hypura](https://github.com/t8/hypura)
> **配图来源：** 项目 README

---

32GB 内存的 Mac 能跑 40GB 的模型吗？

正常情况下不行。llama.cpp 会因为内存不足直接崩溃，macOS 的 swap 机制会疯狂抖动直到 OOM killer 把进程杀掉。

但 **Hypura** 说可以。它是一个面向 Apple Silicon 的 LLM 推理调度器，通过理解模型架构和硬件层级，把张量智能分配到 GPU、RAM 和 NVMe 三个存储层级上——让超出物理内存的模型也能跑起来。

## 核心思路：分层调度

Hypura 的设计哲学很简单：**不是所有的张量都需要在 GPU 里。**

一个大模型里，不同类型的权重有不同的访问模式：

| 类型 | 特点 | Hypura 策略 |
|------|------|------------|
| Norms / Embeddings | 每个 token 都要访问，但体积很小 | 钉在 GPU |
| Attention 层 | 频繁访问 | 常驻 GPU |
| MoE Expert Router | 稀疏访问（Mixtral 每次只激活 2/8 个 expert） | 按需从 NVMe 加载 |
| Dense FFN 权重 | 占模型体积 ~60%，但可以流式处理 | 从 NVMe 流式读取 |

这意味着：**模型权重不需要全部装进内存**。推理引擎可以一次一个矩阵地从 NVMe 流式读取权重，只在 RAM 里保留激活值和 KV cache。

## MoE 的特殊优化

对 Mixture-of-Experts 模型（比如 Mixtral 8x7B），Hypura 做了三层优化：

1. **Router 拦截：** 在 eval 回调中识别被选中的 expert，只加载需要的 expert 权重（I/O 减少 75%）
2. **Neuron Cache：** 跟踪已加载的 expert 切片，利用时间局部性实现 99.5% 缓存命中率
3. **Co-activation 预测：** 预测下一步哪些 expert 会被激活，提前预取

## 实际性能

| 模型 | 大小 | 硬件 | 速度 | llama.cpp |
|------|------|------|------|-----------|
| Mixtral 8x7B | 31 GB | 32 GB Mac Mini | 2.2 tok/s | ❌ 崩溃 |
| Llama 70B | 40 GB | 32 GB Mac Mini | 0.3 tok/s | ❌ 崩溃 |

2.2 tok/s 不算快，但重点是：**它能跑，而不是直接崩溃**。

对于能装进内存的模型，Hypura 以零开销运行——直接走 Metal GPU 全速推理，不会因为调度层而变慢。

## 三层存储架构

Hypura 读取 GGUF 文件后，会自动 profile 硬件（GPU working set、RAM 容量、NVMe 带宽），然后解一个放置优化问题：

- **GPU (Metal)：** Attention 层、norms、embeddings。最快，但受 `recommendedMaxWorkingSetSize` 限制
- **RAM：** 溢出的权重，作为中间缓冲层
- **NVMe：** Dense FFN 权重和非活跃的 MoE expert 权重。通过动态大小的缓冲池流式传输

预取深度根据可用内存自动调整：内存越多，lookahead 越深，NVMe 读取延迟就越容易被隐藏。

## 为什么这个项目有意思

1. **解决真实痛点：** 很多人的 Mac 内存不够跑想要的模型，但也不想花大几千升级到 192GB。Hypura 提供了一个工程层面的 workaround
2. **理解模型架构：** 不是简单粗暴地 swap，而是理解哪些权重在什么时候被需要，做精准调度
3. **Apple Silicon 友好：** 利用了统一内存和快速 NVMe 的硬件特性，这是 Intel Mac 做不到的
4. **Rust 实现：** 性能关键路径用 Rust 写，系统级调度不会成为瓶颈

## 局限性

0.3 tok/s 跑 70B 模型的体验不会很好——你需要有耐心。Hypura 更适合的场景是：

- 模型刚好超出内存一点（比如 32GB Mac 跑 36-40GB 模型）
- 研究和实验场景，不需要实时交互
- MoE 模型（稀疏性带来的 I/O 优化效果最明显）

如果你的模型本来就能装进内存，Hypura 不会让它变慢，但也不会让它变快。

## 我的看法

这是一个非常"Apple Silicon 思维"的项目。统一内存架构模糊了 GPU/CPU/存储的边界，Hypura 把这个思路推到了极致——**把 NVMe 也当作模型运行的一部分**。

从工程美感上说，这个项目很漂亮。它不是暴力解法（加更多内存），而是理解问题的结构（不同权重的访问模式不同），然后用最小成本解决问题。第一性原理思维的典型应用。

长期来看，随着模型越来越大，这种分层调度的思路可能会成为本地推理的标准做法。Hypura 算是这个方向的一个有趣探索。

---

> **项目地址：** [github.com/t8/hypura](https://github.com/t8/hypura)
> **技术栈：** Rust + Metal + GGUF
> **适用平台：** Apple Silicon Mac（M1/M2/M3/M4 系列）
