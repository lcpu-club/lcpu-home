---
title: Infra Seminars 07 - 8月27日 | Inference & LLM Serving
time: '2026-08-27'
tags:
  - 活动
  - Infra Seminars
  - AI Infra
meta:
  description: 8 月 27 日 Infra Seminars 07：介绍大模型推理与服务系统，理解高效部署的关键机制。
  keywords:
    - 活动
    - Infra Seminars
    - AI Infra
summary: 8 月 27 日 Infra Seminars 07：介绍大模型推理与服务系统，理解高效部署的关键机制。
---

当一次训练需要调动成百上千张 GPU，当一个算子几毫秒的差距都会被重复放大，模型背后的系统究竟如何工作？

这个暑假，北京大学未名超算队与北京大学学生 Linux 俱乐部共同推出的 **Weiming HPC Training Camp × LCPU AI Infra Seminars** 将于 7月到9月正式开课！

从 Kernel 到编译器，从分布式系统到集合通信，从模型推理到强化学习系统，我们将在七周时间里，围绕四个 Topic，一起走进大模型训练与推理背后的系统。

现在，准备工作已经就绪。

本周开始，我们将进入第三阶段： Inference & LLM Serving

## Session 07 | Inference & LLM Serving

训练结束，我们获得了一个性能强大的模型。然而，如何把模型推起来、如何把模型推得更快，如何在相同机器上承载更多请求，都变成让模型走向实用的过程中不可避免的问题：为什么 DeepSeek 的 API 比别家便宜？为什么 DeepSeek V4 Flash API 这么快？

为了对推理系统进行优化，我们开始关注 TTFT (Time to Fist Token)、TPOT (Time Per Output Token)、Throughput 等等指标，并期望通过优化并行策略、优化不同场景下的算子库等多种方法来优化这些指标。

与此同时，针对推理负载的特点，我们还引入了 PD 分离（Prefill-Decode Disaggregation）等策略，来最大化硬件效率；随着推理规模的扩大、以及超长上下文场景的出现，KV Cache 逐渐成为了整个推理系统的核心，在包含 PD 分离等复杂并行策略的推理集群上，KV Cache 管理也面临巨大的挑战

不止于API，强化学习中 Rollout 对推理的需求，也让推理变得越来越重要。

本节课， 我们将聚焦推理系统的核心：原理、目标、指标、Benchmark，为大家做综合的介绍。

课前阅读：

- FlashMLA https://github.com/deepseek-ai/FlashMLA

- DeepGEMM https://github.com/deepseek-ai/DeepGEMM

- DeepEP https://github.com/deepseek-ai/DeepEP

## 活动安排

**活动主题**

Session 07 | Inference & LLM Serving

**时间**

2026 年 8 月 27 日（周四）

19:30 - 21:30

**线上参与**

- 腾讯会议（会议号将在活动群内公布）

- 腾讯会议直播

- B 站直播 （B站搜索 LCPU直播姬 ）

- LCPU Livestream （https://live.lcpu.dev）

**分享人**

孔昊然｜北京大学学生 Linux 俱乐部骨干

**主办**

北京大学未名超算队

北京大学学生 Linux 俱乐部
