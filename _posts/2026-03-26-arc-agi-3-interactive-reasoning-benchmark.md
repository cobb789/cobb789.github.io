---
layout: post
title: "ARC-AGI-3 发布：人类 100% vs AI 0.26%，最强交互式推理基准来了"
date: 2026-03-26
author: Cobb
categories: [AI]
tags: [AI, benchmark, ARC-AGI, reasoning, agent]
pin: false
---

> ARC Prize Foundation 在 Y Combinator 总部发布了 ARC-AGI-3 —— 史上第一个交互式 AI 推理基准。人类得分 100%，前沿 AI 模型不到 1%。这不是 AI 不够聪明，而是 AI 根本不会「学习」。

## 从静态拼图到交互式游戏

ARC-AGI 系列由 Keras 之父 François Chollet 在 2019 年创立，一直是衡量 AI 抽象推理能力的标杆。

前两代的测试方式很直接：给 AI 看一组输入/输出网格图案，让它推断规则并完成新的实例。到 2025 年，前沿模型在 ARC-AGI-1 上已经能跑到 90%+，于是 ARC 团队推出了更难的 ARC-AGI-2，最好的系统也只能跑到十几分。

**ARC-AGI-3 彻底改变了游戏规则。**

这次不再是静态拼图。每个测试环境是一个回合制游戏，有自己的内部逻辑。关键是：**没有说明书，没有规则描述，没有目标提示。** AI 只能看到当前画面，执行动作，观察结果，然后自己搞清楚该做什么、怎么做。

简单说：从「看图找规律」升级到了「丢进陌生世界，自己活下来」。

## 数据有多残酷

30 天开发者预览期的数据：

| 参与者 | 得分 |
|--------|------|
| 人类玩家 | **100%** |
| 最强 AI Agent | 12.58% |
| 前沿 LLM（GPT-5.x, Claude 4.x 等） | **< 1%** |
| Frontier LLM 直接推理 | **0.26%** |

1200+ 名人类玩家参与了 3900+ 场游戏，他们的表现就是基线。AI 不是跟满分比，而是跟普通人比 —— 然后被碾压。

## 评分机制：不是对错，是效率

ARC-AGI-3 的评分不是二元的「做对了/做错了」。它测量的是 **行动效率** —— 和人类玩家比，AI 用了多少步达到目标？

如果 AI 靠暴力搜索、反复试错来通关，即使最终到了终点，分数也会被严重扣减。这意味着 **记忆和穷举行不通**，只有真正理解了环境规则的 agent 才能拿高分。

这是第一个正式测量「人类 vs AI 学习效率」而非「能力上限」的基准。

## 为什么 LLM 全军覆没

前沿大模型在 ARC-AGI-3 上几乎为零分，原因很直接：

**1. 没有指令就不会动**

当前的 LLM 本质上是「指令执行器」。给它清晰的 prompt，它能写代码、分析数据、生成文案。但当面对一个完全陌生的环境，没有任何说明，需要自己通过交互来理解规则时 —— 它不知道该做什么。

**2. 不会「试错-学习」循环**

人类面对陌生游戏的第一反应是：随便试试，看看会发生什么。通过观察结果，快速建立心智模型，然后越来越高效。LLM 缺乏这种 online learning 能力 —— 它的知识在训练时就固化了。

**3. 不会跨关卡迁移**

ARC-AGI-3 的每个游戏有 8-10 个关卡，难度递增，后面的关卡会引入新机制。人类能把前面学到的规则迁移到新情境，LLM 做不到。

## 开源工具包

ARC-AGI-3 的基准测试工具包已开源（MIT 协议）：

```bash
pip install arc-agi
# 或
uv add arc-agi
```

核心 API 极简：

```python
import arc

game = arc.make("ls20")  # 实例化游戏环境
state = game.reset()     # 获取初始状态

action = arc.GameAction(...)
state, reward, done, info = game.step(action)
```

支持 OpenAI、Anthropic、Google、DeepSeek 等主流推理后端。需要 ARC API key（arcprize.org 免费申请）。

## 200 万美元奖金，获胜必须开源

ARC Prize 2026 设置了超过 200 万美元的奖金池，分为两个赛道：

- **ARC-AGI-3 Competition**（Kaggle 竞赛）：构建能玩 ARC-AGI-3 游戏的 agent
- **ARC-AGI-2 Grand Prize**：延续经典格式，今年的大奖保证颁出

所有获胜方案必须开源，不允许使用外部 API。这是 ARC Prize 一贯的立场：推动开放研究，而非商业垄断。

## 发布活动的彩蛋

3 月 25 日在 Y Combinator 总部的发布会上，François Chollet 和 Sam Altman 进行了一场关于「在通往 AGI 的路上如何衡量智能」的炉边对谈。考虑到 OpenAI 的模型在这个基准上几乎零分，这场对话应该很有意思。

## 这意味着什么

ARC-AGI 系列一直是 AI 能力的「照妖镜」：

- ARC-AGI-1 预测了推理模型（reasoning models）的崛起
- ARC-AGI-2 预测了编码 agent 的爆发
- ARC-AGI-3 指向下一个前沿：**从"会执行指令的 AI"到"会在陌生环境中学习的 AI"**

当前 AI 的瓶颈不是参数量、不是上下文长度、不是多模态能力。是 **学习能力** —— 面对从未见过的问题，从零开始理解规则、建立模型、高效解决。

这才是 AGI 的真正门槛。而 ARC-AGI-3 第一次把这个门槛量化了。

---

**参考链接：**
- [ARC Prize 官方公告](https://arcprize.org/blog/arc-agi-3-launch)
- [ARC-AGI-3 技术报告](https://arcprize.org/media/ARC_AGI_3_Technical_Report.pdf)
- [GitHub 工具包](https://github.com/arcprize/arc-agi-3-benchmarking)
- [ARC Prize 2026 竞赛页](https://arcprize.org/competitions/2026)
