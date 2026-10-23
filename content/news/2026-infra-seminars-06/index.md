---
title: Infra Seminars 06 - 8月23日 | AI Communication Stack
time: '2026-08-23'
tags:
  - 活动
  - Infra Seminars
  - AI Infra
meta:
  description: 8 月 23 日 Infra Seminars 06：梳理 AI 通信栈，学习大规模 GPU 集群中的通信与优化。
  keywords:
    - 活动
    - Infra Seminars
    - AI Infra
summary: 8 月 23 日 Infra Seminars 06：梳理 AI 通信栈，学习大规模 GPU 集群中的通信与优化。
---

当一次训练需要调动成百上千张 GPU，当一个算子几毫秒的差距都会被重复放大，模型背后的系统究竟如何工作？

这个暑假，北京大学未名超算队与北京大学学生 Linux 俱乐部共同推出的 **Weiming HPC Training Camp × LCPU AI Infra Seminars** 将于 **7月到9月**正式开课！

从 Kernel 到编译器，从分布式系统到集合通信，从模型推理到强化学习系统，我们将在七周时间里，围绕四个 Topic，一起走进大模型训练与推理背后的系统。

现在，准备工作已经就绪。

本周开始，我们将进入第二阶段： Parallelization and Communication。从现代网络系统开始，探索Scale-Out的力量。

## 1Session 06 | AI Communication Stack

Pipeline 背后真正的问题是：谁来决定什么工作在什么时候、在哪个资源上执行？谁负责维护依赖、推进执行，并判断一个阶段何时真正完成？这其中涉及到一组连续的设计trade off：硬件与软件的责任划分、编程复杂度与硬件复杂度、静态与动态调度、显式控制与自动管理、灵活性与可预测性，以及细粒度重叠带来的性能收益与状态和同步开销。

在单 GPU 内部，这些责任可以由 Compiler、Warp Scheduler、Scoreboard、Pipeline、Barrier、Copy Engine 和 Memory Hierarchy 共同承担。我们关注数据如何在 Register、Shared Mem、片上专用存储和 HBM 之间流动并保证计算正确推进。

今天，我们把同一个问题扩展到 GPU-to-GPU 高速互联。 此时数据的 Producer 和 Consumer 不再位于同一块 GPU 上，数据可能需要跨越 GPU Fabric、NVLink / NVSwitch、PCIe、RNIC、RDMA Transport 和交换网络。原本局限在单 GPU 内部的 Readiness、Ordering、Completion 和 Visibility，现在必须跨越不同的设备、地址域、队列、协议乃至故障域继续成立。我们今天讨论这些状态和控制责任应该放在哪里，并介绍Workload中对通信的要求以及工业界一些经典的解决方案。

本次活动无课前阅读。

## 2活动安排

**活动主题**

Session 06 | AI Communication Stack

**时间**

2026 年 8 月 23 日（周日）

19:30 - 21:30

**线上参与**

- 腾讯会议（会议号将在活动群内公布）

**分享人**

孔昊然｜北京大学学生 Linux 俱乐部骨干

**主办**

北京大学未名超算队

北京大学学生 Linux 俱乐部
