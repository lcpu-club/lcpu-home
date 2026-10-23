---
title: Infra Seminars Workshop 01 - 8月1日 | Parallel Programming with TileLang
time: '2026-07-31'
tags:
  - 活动
  - Infra Seminars
  - AI Infra
meta:
  description: 8 月 1 日 TileLang Workshop：动手练习并行编程，学习 GPU Kernel 的编写与优化。
  keywords:
    - 活动
    - Infra Seminars
    - AI Infra
summary: 8 月 1 日 TileLang Workshop：动手练习并行编程，学习 GPU Kernel 的编写与优化。
---

当一次训练需要调动成百上千张 GPU，当一个算子几毫秒的差距都会被重复放大，模型背后的系统究竟如何工作？

这个暑假，北京大学未名超算队与北京大学学生 Linux 俱乐部共同推出的 **Weiming HPC Training Camp × LCPU AI Infra Seminars** 将于 \*\*7月到9月 \*\*正式开课！

从 Kernel 到编译器，从分布式系统到集合通信，从模型推理到强化学习系统，我们将在七周时间里，围绕四个 Topic，一起走进大模型训练与推理背后的系统。

现在，准备工作已经就绪。

第一周我们将进入 Topic 1 —— **Kernel & ML Compiler**。从 GPU 的工作方式开始，逐步认识 CUDA 编程模型，并初步接触 Triton、TileLang 等 GPU Kernel DSL。

## 1Workshop 01 | Parallel Programming with TileLang

> 在每周的 Sessions 之外，我们针对特定专题，设计了自包含、独立成小节的 Workshop；我们希望 Workshop 能不依赖 Main Sessions 的上下文，同时补充有趣、有意思的特定内容

随着 ML Sys 领域的高速发展，对复杂繁琐 CUDA 编程的简化逐渐成为刚需。 在众多 DSL （领域特定语言） 之中，TileLang 实现了对硬件比较良好的简洁描述的同时，很好的隐藏了 CUDA 中必须人为处理的众多细节。同时，在 Tile Library 和 Layout Inference 的帮助下，TileLang 让在 CTA Level 进行并行编程成为了清晰快捷，且性能较好的可行路径。而且，TileLang 的编译栈还提供了方便的调度优化、流水排布等能力。

总的来说，TileLang 允许程序员主要在 Tile/CTA 层级描述 workload decomposition、memory placement、data movement 和 temporal scheduling。编译器负责将这些高层语义映射到线程（**Layout Inference**）、Warp、具体指令和同步机制（**Desugaring & Lowering Pass**），使用户无需手工处理大量 CUDA 实现细节，同时仍能显式控制决定性能的关键结构。

本次 Workshop，我们将介绍：

- TileLang 语法、如何用 TileLang写 Kernel

- TileLang 中的 CTA 到 Thread 的映射与 Layout Inference

- 如何在 TileLang 中做 Latency Hiding

以及 DSL 的 JIT 编译和 Host 侧的相关内容；

最后，我们还将介绍在 TileLang 下如何做算子优化以及一些相关的工具。

课前阅读：

1.  TileLang官方文档：https://tilelang.com/

2.  CuTeDSL 文档：https://docs.nvidia.com/cutlass/latest/media/docs/pythonDSL/cute\_dsl.html

（CuTeDSL 是 NVIDIA 开发和维护的另一套 DSL，其特点 Layout Algebra 比较强大但也相对复杂。本次 Workshop 基本不会涉及 CuTeDSL，但感兴趣的同学可以自行阅读相关内容并对比）

## 2活动安排

**活动主题**

Workshop 01 | Parallel Programming with TileLang

**时间**

2026 年 8 月 1 日（周六）

19:30 - 21:30

**线上参与**

- 腾讯会议（会议号将在活动群内公布）

- 腾讯会议直播

- B 站直播 （B站搜索 LCPU直播姬 ）

- LCPU Livestream （https://live.lcpu.dev）

**分享人**

孔昊然 ｜北京大学学生 Linux 俱乐部骨干

**主办**

北京大学未名超算队

北京大学学生 Linux 俱乐部
