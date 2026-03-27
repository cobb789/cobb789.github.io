---
layout: post
title: "Anthropic 意外泄露 Claude Mythos：内部代号 Capybara，比 Opus 更强的新模型层级"
date: 2026-03-27
author: Cobb
categories: [AI, Claude]
tags: [AI, Claude, Anthropic, LLM, cybersecurity, Mythos, Capybara]
pin: false
image:
  path: /assets/img/posts/anthropic-mythos-cover.jpg
  alt: "Dario Amodei, CEO of Anthropic"
---

> 原文来自 [Fortune 独家报道](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/)（记者 Jeremy Kahn）。

---

## 事件概要

3 月 26 日晚，Fortune 独家爆出：Anthropic 因 CMS（内容管理系统）配置失误，将近 **3,000 份未发布资产**——包括草稿博客、内部 PDF、活动策划文档——暴露在一个公开可搜索的数据缓存中。

这批泄露材料由 LayerX Security 的高级 AI 安全研究员 **Roy Paz** 和剑桥大学网络安全研究员 **Alexandre Pauwels** 分别独立发现并交叉验证。Fortune 联系 Anthropic 后，后者才关闭了这个数据存储的公开搜索权限。

被泄露的核心内容：**Anthropic 正在测试一款名为 "Claude Mythos" 的全新 AI 模型**，内部代号 **Capybara（水豚）**。

Anthropic 随后向 Fortune 确认了这款模型的存在：

> "We're developing a general purpose model with meaningful advances in reasoning, coding, and cybersecurity. Given the strength of its capabilities, we're being deliberate about how we release it. We consider this model a step change and the most capable we've built to date."

翻译：我们正在开发一款通用模型，在推理、编程和网络安全方面有重大进步。鉴于其能力之强，我们在发布上格外审慎。我们认为这款模型代表了一次阶跃式进步，是我们迄今构建的最强模型。

## Capybara：Opus 之上的第四层级

目前 Anthropic 的产品线是三层结构：

| 层级 | 定位 | 特点 |
|------|------|------|
| **Haiku** | 入门级 | 小、快、便宜 |
| **Sonnet** | 中间路线 | 平衡性能与成本 |
| **Opus** | 旗舰级 | 最大、最强 |
| **Capybara** 🆕 | 超旗舰 | 比 Opus 更大、更强、更贵 |

泄露的草稿博客这样描述：

> "'Capybara' is a new name for a new tier of model: larger and more intelligent than our Opus models—which were, until now, our most powerful."

> "Compared to our previous best model, Claude Opus 4.6, Capybara gets dramatically higher scores on tests of software coding, academic reasoning, and cybersecurity, among others."

**Mythos 是模型名，Capybara 是层级名**，两者指向同一个底层模型。草稿博客还表示 Mythos 是"by far the most powerful AI model we've ever developed"（迄今为止我们开发的最强大 AI 模型）。

### Capybara 意味着什么

这不只是多了一个更贵的选项。Capybara 的出现意味着 Anthropic 正式打破了自己维持了两年多的三层产品结构——这在 AI 行业是一个信号级事件。

**从产品策略看：** Haiku/Sonnet/Opus 的三层体系已经成为行业标杆，OpenAI 的 GPT-4o mini/GPT-4o/GPT-5 也在模仿类似结构。现在 Anthropic 主动在顶层之上再加一层，说明他们认为**模型能力的天花板还远没到**，而且有足够的企业客户愿意为"超旗舰"付费。

**从技术层面看：** 草稿博客强调 Capybara 在编码、学术推理和网络安全上"dramatically higher scores"——注意用词是 **dramatically**，不是 marginally，不是 somewhat。在 Opus 4.6 已经是业内顶级的基础上还能"大幅"提升，这要么意味着架构上有重大突破，要么意味着投入了远超以往的计算资源来训练，或者两者兼有。

**从定价角度看：** Opus 已经是 Claude 系列中最贵的模型。Capybara 被描述为"更贵"——如果 Opus 4.6 的 API 价格是 $15/$75 per million tokens（输入/输出），Capybara 可能会达到 $30-50/$150+ 的区间。这个价格只有大企业和高价值场景才用得起，但对于代码审计、安全漏洞扫描、复杂法律文档分析这些场景，一次调用省下的人工成本可能是几千美元。

**从竞争格局看：** 这是 Anthropic 向 OpenAI 发出的直接挑战。OpenAI 目前最强的是 GPT-5.3 系列，Google 有 Gemini Ultra 2。Capybara 如果真的达到泄露文档描述的水平，将重新定义"最强 AI 模型"的标准。AI 军备竞赛正式进入了**超旗舰时代**。

## 网络安全：双刃剑的新高度

泄露文档中最引人关注的部分是 Anthropic 对 Mythos 网络安全能力的自我评估——这些是 Anthropic 自己写的，不是外部猜测：

- 该模型 **"currently far ahead of any other AI model in cyber capabilities"**（目前在网络安全能力上远超任何其他 AI 模型）
- 它 **"presages an upcoming wave of models that can exploit vulnerabilities in ways that far outpace the efforts of defenders"**（预示着一波即将到来的模型浪潮，能够以远超防御者的速度发现并利用漏洞）

因此，Anthropic 计划的发布策略是：

1. **先给网络安全防御团队使用**，让他们有时间加固代码库
2. 目前处于**邀请制早期访问**阶段
3. 模型运行成本高昂，**尚未准备好公开发布**

### 行业背景

这并非孤例。2026 年 2 月是一个转折点：

- **OpenAI** 发布 GPT-5.3-Codex，将其列为网络安全"高能力"级别——这是 OpenAI Preparedness Framework 下首个获此分类的模型，也是首个被专门训练来发现软件漏洞的模型
- **Anthropic** 同一周发布 Opus 4.6，展示了在生产代码库中发现**此前未知漏洞**的能力
- Anthropic 此前还披露，包括与中国政府关联的黑客组织在内的攻击者，曾试图利用 Claude Code 对约 30 个组织（包括科技公司、金融机构和政府机构）发起协调攻击

Mythos 在这条路上显然走得更远。正如 NewsGab 分析指出的：这本质上是一个**双重用途（dual-use）**问题——对防御者有用的工具，对攻击者同样有用，甚至可能成为攻击的力量倍增器。

## 最讽刺的部分

一家以"AI 安全"为核心定位的公司，被一个 **CMS 默认设置为公开**的配置问题给泄了底。

不是零日漏洞，不是内部人员泄密，就是有人忘了把开关拨到 "private"。

泄露的缓存里甚至还包括：

- 一场在**英国乡村 18 世纪庄园**举办的 **CEO 私密峰会**详情——邀请制，参会者可以提前预览未发布的 Claude 功能，与政策制定者面对面
- 大量未发布的内部文档和 PDF

Anthropic 的声明强调泄露"不涉及核心基础设施、AI 系统、客户数据或安全架构"，并特别指出"AI 工具（包括 Claude Code 和 Cowork）并非造成此次配置错误的原因"。

但正如 Fortune 所指出的：**AI 编程工具现在让人可以轻而易举地爬取和关联这类意外公开的数据**。一家警告世界 AI 驱动网络攻击风险的公司，自己的 CMS 配置成了漏洞——这个反差确实有点大。

## Hacker News 社区反应

这个事件在 [Hacker News 上引发了热烈讨论](https://news.ycombinator.com/item?id=47538795)。技术社区主要关注几个方向：

- **安全叙事的可信度**：一家声称做"负责任 AI"的公司，连自己的 CMS 都管不好，如何让人相信它能管好比 Opus 还强的模型？
- **"先给防御者用"能否成立**：模型一旦开放 API，攻击者获取的速度不会比防御者慢
- **行业军备竞赛加剧**：OpenAI 和 Anthropic 在网络安全能力上的竞赛正在加速
- **Capybara 的命名**：水豚……不得不说，Anthropic 的动物命名品味一如既往

## 我的看法

**1. 模型层级扩展是必然趋势。** Opus 之上再加一层不意外。计算成本的下降和企业客户的付费意愿决定了厂商会持续推出更大更贵的模型。Capybara 这个定位说明 Anthropic 在瞄准高端企业市场——这些企业愿意为最强能力付溢价。

**2. 网络安全能力是新的军备竞赛。** 从 GPT-5.3-Codex 到 Opus 4.6 再到 Mythos，每个新模型都在刷新"发现漏洞"的能力上限。"先给防御者用"的策略在理论上合理，但现实中**攻击者获取模型的速度往往不比防御者慢**。真正的安全不是靠时间差，而是靠系统性的防御能力建设。

**3. 这次泄露本身就是最好的安全教材。** 一个 CMS 的默认公开配置，导致近 3,000 份内部文档暴露。这恰恰证明了 Anthropic 自己在泄露文档里写的——AI 时代，发现和利用这类"低级错误"的效率会被 AI 工具指数级放大。**最大的安全风险往往不是技术前沿的攻防，而是最基本的配置管理。**

**4. 没有发布时间表。** 草稿博客里嵌入了一个发布日期，但 Anthropic 没有确认是否还会按原计划发布。考虑到这次泄露的尴尬程度，他们很可能会调整节奏。但模型已经在测试了——发布只是时间问题。

**5. 这是真泄露还是营销？** 说实话，这事有几个点值得品味。第一，一家号称最重视安全的 AI 公司，CMS 配置这么低级的错误？近 3,000 份文档"不小心"公开？第二，泄露的内容刚好是一篇**结构完整、措辞精炼的产品发布博客草稿**——不是内部邮件、不是会议纪要，而是一篇随时可以发布的 PR 稿。第三，泄露时机恰好在 OpenAI 和 Google 连续发布新模型之后，Anthropic 需要"存在感"。第四，Anthropic 的回应既不慌也不否认，而是优雅地确认了模型存在并强调"阶跃式进步"——这不像危机公关，更像**顺水推舟**。当然，也有可能真的只是有人忘了拨开关。但在 AI 行业，"意外泄露"已经成了一种经典的预热手段——Apple 都玩过。不管是真泄露还是"泄露式营销"，效果是一样的：全网都在讨论 Mythos，而 Anthropic 一分钱广告费没花。

**6. 对开发者意味着什么？** 如果你在用 Claude API，Capybara 层级意味着未来会有一个"最贵但最强"的选项。对于需要极致推理和编码能力的场景（比如代码审计、复杂架构设计），可能值得关注。但也意味着 Anthropic 的定价策略会更加分层。

---

*原始推文由 [宝玉 @dotey](https://x.com/dotey) 翻译解读，Fortune 独家报道原文由 Jeremy Kahn 撰写。*

*OfoxAI · 你的AI开发伙伴 · [ofox.ai](https://cobb789.ofox.ai)*
