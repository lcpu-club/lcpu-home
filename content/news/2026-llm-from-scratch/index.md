---
title: 学习组丨从零训练大模型！
time: '2026-01-17'
tags:
  - 活动
  - LLM From Scratch
  - AI
meta:
  description: 以 Stanford CS336 为蓝本，从模型架构、数据处理到系统优化，动手实现并训练语言模型。
  keywords:
    - 活动
    - LLM From Scratch
    - AI
summary: 以 Stanford CS336 为蓝本，从模型架构、数据处理到系统优化，动手实现并训练语言模型。
---

# 这个寒假，从零训练你自己的大模型

每天都在用大模型，有没有好奇过：

- 那些神奇的回答究竟是怎么生成的？

- 训练数据从哪里来，又如何清洗？

- 几十亿参数的模型，怎么塞进显卡跑起来？

- Scaling Law 到底在 scale 什么？

**这个寒假，北京大学学生 Linux 俱乐部邀请你一起，从零开始训练一个属于自己的大模型。**

---

## 🎯 项目介绍

今年寒假，Linux 俱乐部计划开展**LLM From Scratch**计划，以斯坦福大学广受好评的 **CS336: Language Modeling from Scratch** 为蓝本，带你亲手实现大模型训练的全流程。

不是调 API，不是微调开源模型，而是：

**从 Tokenizer 写起，从第一个 Attention 算子写起，从第一条梯度开始训练。**

---

## 📚 你将学到什么

### Phase 1：跟随 CS336，完成五大核心作业

**作业1｜Building a Transformer LM**

- 手写 BPE Tokenizer

- 从零实现 Transformer 语言模型

- 实现 Cross-Entropy Loss 和 AdamW 优化器

- 在 TinyStories 和 OpenWebText 上训练并评估

**作业2｜Systems and Parallelism**

- Benchmarking 与 Profiling

- 用 Triton 手写 Flash Attention 2 内核

- 实现分布式数据并行训练 (DDP)

- 优化器状态分片

**作业3｜Scaling Laws**

- 探索模型规模、计算量与性能的关系

- 跑遍从 64 到 1024 维度的模型配置

- 亲手验证 Scaling Law 的魔力

**作业4｜Filtering Language Modeling Data**

- 从 Common Crawl 抽取文本

- 过滤有害内容和个人隐私信息

- 数据去重

- 对比不同数据处理策略对模型性能的影响

**作业5｜Alignment and Reasoning RL**

- 零样本 Prompting 基线

- 用 DeepSeek R1 的推理轨迹做监督微调

- Expert Iteration 与 GRPO

- 可选：指令微调与 DPO

### Phase 2：训练 2B 模型 & Bonus 实验

完成基础课程后，我们将：

- 清洗更大规模的数据集

- 在 CS336 模型基础上扩大架构

- 在 5090/H100 集群上训练数天

- 用 MMLU、GSM8K 等 benchmark 测试

- 尝试 FP4 训练等前沿实验

---

## 🗓️ 时间安排

**Phase 1：1月19日 - 3月1日（共6周）**

| 周次   | 课程内容      | 作业主题         |
| ------ | ------------- | ---------------- |
| Week 1 | Lecture 1-5   | Transformer 基础 |
| Week 2 | Lecture 6-9   | 系统与并行       |
| Week 3 | Lecture 10-11 | Scaling Laws     |
| Week 4 | Lecture 12-16 | 数据处理         |
| Week 5 | Lecture 17    | 对齐与强化学习   |

**Phase 2：3月初 - 3月中旬**

2B 模型训练与 Bonus 实验

---

## 💡 为什么要参加

**对于想入门 LLM 的同学：**

- Linux俱乐部骨干倾心设计，力争反映业界真实大模型训练场景，挑战硬核

- 不是看 PPT 听故事，是自己写代码跑实验

- 斯坦福原版作业 + 中文字幕视频 + 学习小组互相支持

- 社团提供5090和H100算力，不需要自己租算力

**对于已经有基础的同学：**

- 系统性填补知识盲区

- 分布式训练、Flash Attention 等工程技能

- 和志同道合的人一起讨论

**对于所有人：**

- 当你说"我从零训过大模型"，这份底气是真实的

---

## 🚀 如何参与

填写下方问卷报名，不要忘记加入问卷末尾的微信群。参与同学需为 LCPU 社团成员。

---

2025 年，DeepSeek 让我们看到了开源力量的无限可能。

2026 年，不如自己也来亲手训一个？

**LLM From Scratch，我们寒假见。**

---

项目负责人：陈嘉骏

技术负责人：孙远航

特别鸣谢：宽德投资

![](./image_1.png)
