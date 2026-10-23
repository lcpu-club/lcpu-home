---
title: 'Infra Seminars 04 - 8月9日 | Pipeline Ordering: Data Orchestration'
time: '2026-08-08'
tags:
  - 活动
  - Infra Seminars
  - AI Infra
meta:
  description: 8 月 9 日 Infra Seminars 04：学习流水线中的数据编排与执行顺序，优化 GPU 数据流。
  keywords:
    - 活动
    - Infra Seminars
    - AI Infra
summary: 8 月 9 日 Infra Seminars 04：学习流水线中的数据编排与执行顺序，优化 GPU 数据流。
---

当一次训练需要调动成百上千张 GPU，当一个算子几毫秒的差距都会被重复放大，模型背后的系统究竟如何工作？

这个暑假，北京大学未名超算队与北京大学学生 Linux 俱乐部共同推出的 **Weiming HPC Training Camp × LCPU AI Infra Seminars** 将于7月到9月正式开课！

从 Kernel 到编译器，从分布式系统到集合通信，从模型推理到强化学习系统，我们将在七周时间里，围绕四个 Topic，一起走进大模型训练与推理背后的系统。

现在，准备工作已经就绪。

第一阶段我们将进入 Topic 1 —— **Kernel & ML Compiler**。从 GPU 的工作方式开始，逐步认识 CUDA 编程模型，并初步接触 Triton、TileLang 等 GPU Kernel DSL。

## Session 04 | Pipeline Ordering: Data Orchestration

硬件发展过程中，计算能力、内存带宽提升的同时，频率提升稍显缓慢。单个操作 latency 的改善已经远慢于系统 throughput 的增长，现代体系结构从“降低 latency”逐渐转为越来越依赖于通过并行性容忍和隐藏 latency。从指令并行 ILP，乱序执行 OoO，到内存层级并行 MLP、Warp 调度与 TLP，追寻自动 latency hiding 的方法不断发展和演进，然而，随着 Tensor Core 等专用计算单元的吞吐快速增长，计算与数据供给能力之间的差距进一步扩大。以 `cp.async`、TMA 为代表的异步数据搬运机制，逐渐将原先很大程度由硬件自动完成的 latency hiding，暴露为程序员和编译器需要显式组织的 Pipeline。具体来说，我们需要：

- 处理数据和计算的依赖关系，尽可能让计算和数据搬运重叠发生

- 理解同步的 scope 和同步的边界，只做必要的同步和通信

- 增加在途（in-flight）数据搬运，提高 MLP 和 Pipeline Depth，以 Multi Buffering、存储资源和并发度换取 latency hiding

更进一步的，我们甚至不再完全依赖通用的 Warp Scheduling 来自动隐藏延迟，而是主动固定不同执行资源的职责，并显式安排工作的空间和时间结构，通过如：

- Persistent Scheduling

- Warp Specialization

- Software Pipeline

等范式，来进一步掌控各种操作何时、如何发生。

这些，都可以算是 Pipeline Ordering: Data Orchestration，即如何组织数据、处理计算。

在最新的硬件上，上述内容已成为发挥硬件极限性能、实现极致性能算子的关键核心与重中之重。

本节课，我们将在有限的时间内，对上述内容进行综合性的介绍。

课前阅读：

1.  [NVIDIA CUDA Programming Guide, Cooperative Groups](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/cooperative-groups.html)

2.  [NVIDIA Developer Blog, Cooperative Groups](https://developer.nvidia.com/blog/cooperative-groups/)

3.  [NVIDIA CUDA Programming Guide, Asynchronous Data Copies](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/async-copies.html)

4.  [NVIDIA CUDA Programming Guide, Pipelines](https://docs.nvidia.com/cuda/cuda-programming-guide/04-special-topics/pipelines.html)

5.  [NVIDIA Nsight Compute, Source Page](https://docs.nvidia.com/nsight-compute/NsightCompute/index.html#source-page)

## 活动安排

**活动主题**

Session 04 | Pipeline Ordering: Data Orchestration

**时间**

2026 年 8 月 9 日（周日）

19:30 - 21:30

**线上参与**

- 腾讯会议（会议号将在活动群内公布）

- 腾讯会议直播

- B 站直播 （B站搜索 LCPU直播姬 ）

- [LCPU Livestream](https://live.lcpu.dev)

**分享人**

卢怡霏｜信息科学技术学院25级本科生、北京大学学生 Linux 俱乐部骨干

**主办**

北京大学未名超算队

北京大学学生 Linux 俱乐部
