---
layout: post
title: "KittenTTS：25MB 的开源 TTS 模型，不用 GPU 也能跑"
date: 2026-03-20
author: Cobb
categories: [AI, Dev]
tags: [TTS, 语音合成, 开源, KittenTTS, ONNX, 边缘计算]
pin: false
image:
  path: /assets/img/posts/kittentts-lightweight-tts-model/cover.png
  alt: KittenTTS
---

> **项目地址：** [KittenML/KittenTTS](https://github.com/KittenML/KittenTTS)  
> **在线体验：** [Hugging Face Demo](https://huggingface.co/spaces/KittenML/KittenTTS-Demo)  
> **License：** Apache 2.0

## 一句话总结

KittenTTS 是一个开源的轻量级文本转语音库，最小模型只有 **25MB**，基于 ONNX 推理，**不需要 GPU**，纯 CPU 就能跑出高质量语音。今天在 Hacker News 上拿了 320+ 赞。

## 为什么值得关注

TTS（Text-to-Speech）领域一直有个矛盾：好的模型动辄几百 MB 甚至几 GB，需要 GPU 推理；轻量模型的音质又差强人意。

KittenTTS 试图打破这个局面：

- **15M 参数的 nano 模型**，int8 量化后只有 25MB
- **ONNX 推理**，纯 CPU 运行，不依赖 PyTorch/TensorFlow
- **24kHz 采样率**，音质不含糊
- **8 个内置语音**：Bella、Jasper、Luna、Bruno、Rosie、Hugo、Kiki、Leo
- **可调语速**，支持数字/货币/单位的文本预处理

换句话说，你可以把它跑在树莓派、手机、IoT 设备上。边缘部署 TTS 终于有了靠谱的选择。

## 模型矩阵

| 模型 | 参数量 | 体积 | 特点 |
|------|--------|------|------|
| kitten-tts-mini | 80M | 80MB | 音质最佳 |
| kitten-tts-micro | 40M | 41MB | 平衡之选 |
| kitten-tts-nano | 15M | 56MB (fp32) | 最小参数 |
| kitten-tts-nano (int8) | 15M | **25MB** | 极致轻量 |

## 快速上手

安装只需一行：

```bash
pip install https://github.com/KittenML/KittenTTS/releases/download/0.8.1/kittentts-0.8.1-py3-none-any.whl
```

使用也极简：

```python
from kittentts import KittenTTS

model = KittenTTS("KittenML/kitten-tts-mini-0.8")
audio = model.generate("Hello, world!", voice="Jasper")

import soundfile as sf
sf.write("output.wav", audio, 24000)
```

还能调语速：

```python
audio = model.generate("快一点说话", voice="Luna", speed=1.2)
```

## 我的看法

### 1. 边缘 AI 的基础设施

大模型的趋势是越来越大，但实际落地时"小而美"的模型同样重要。25MB 的 TTS 模型，意味着：

- 嵌入式设备可以本地跑语音合成，不用联网
- 应用包体积几乎不受影响
- 隐私敏感场景不用把文本发到云端

### 2. ONNX 生态的价值

KittenTTS 选择 ONNX 作为推理框架是聪明的。ONNX Runtime 支持几乎所有平台（Windows、Linux、macOS、iOS、Android、Web），一次导出到处运行。

### 3. 目前的局限

- **Developer Preview**：API 可能变
- **仅英文**：目前只支持英文语音
- **int8 模型有 bug**：官方承认 nano-int8 有些用户遇到问题
- **商业支持另谈**：虽然 Apache 2.0 开源，但自定义语音和企业支持需要联系团队

### 4. 适合什么场景

- 原型开发：快速给 demo 加上语音
- IoT/边缘设备：离线语音播报
- 无障碍功能：低成本集成屏幕朗读
- 教育应用：英语发音辅助

## HN 社区反馈

320+ 赞，评论区主要关注：

- **音质对比**：和 Piper TTS、Kokoro 等轻量方案的对比
- **多语言支持**：社区最期待的功能
- **模型架构**：有人好奇 15M 参数如何做到不错的音质

在线 Demo 可以直接试：[Hugging Face Spaces](https://huggingface.co/spaces/KittenML/KittenTTS-Demo)

---

*KittenTTS 目前处于 Developer Preview 阶段（v0.8），API 可能在后续版本中变化。*
