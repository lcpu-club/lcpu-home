---
title: 'Infra Seminars 02 - 7月30日 | Memory Abstraction & Hierarchy'
time: 2026-07-29
tags: ['AI Infra', '活动']
source: https://mp.weixin.qq.com/s/3ayYDOuZ7ChwubgfppThfw
author: 'Linux 俱乐部'
meta:
  description: 'Infra Seminars 02 | Memory Abstraction & Hierarchy，7月30号见！'
---

当一次训练需要调动成百上千张 GPU，当一个算子几毫秒的差距都会被重复放大，模型背后的系统究竟如何工作？

这个暑假，北京大学未名超算队与北京大学学生 Linux 俱乐部共同推出的 **Weiming HPC Training Camp × LCPU AI Infra Seminars** 将于 **7月到9月** 正式开课！

从 Kernel 到编译器，从分布式系统到集合通信，从模型推理到强化学习系统，我们将在七周时间里，围绕四个 Topic，一起走进大模型训练与推理背后的系统。

现在，准备工作已经就绪。

第一周我们将进入 Topic 1 —— **Kernel & ML Compiler**。从 GPU 的工作方式开始，逐步认识 CUDA 编程模型，并初步接触 Triton、TileLang 等 GPU Kernel DSL。

## 1Session 02 | Kernels: Memory Abstraction & Hierarchy

从经典的矩阵乘法出发，本节课，我们将讲解从 Data Reuse 利用 Memory Hierarchy 直觉、到 Roofline Model 与 Kernel Optimization 的主要目标；从矩阵乘法的逐渐优化步骤，我们将逐步引出更多硬件执行的机理和流程：

- Warp 里面的 Threads 如何执行？硬件如何进行 Memory 访存？Coalescing 是什么？

- 一个 Thread Block / CTA 里面的 Warps 又是如何调度的？SMSP 又是啥，硬件如何进行经典的 Latency-hiding？

- SMEM 结构是什么？较 Register 有什么特点？这会如何影响性能？

我们还将以 FP32 精度下，不涉及 Tensor Core 的 GEMM 为例，介绍如何实际编写调优一个 Kernel。我们还将通过一个 Reduce Kernel 来介绍 Warp-Level Primitives。调优过程中，我们还会引入 NCU 进行 Profile，并介绍 Profile 结果如何指导进一步调优。

课前阅读：

1.  https://developer.nvidia.com/blog/even-easier-introduction-cuda/

2.  https://www.nvidia.com/en-us/on-demand/session/gtc24-s62191/

3.  https://github.com/olcf/cuda-training-series/blob/master/exercises/hw4/readme.md (资料已较为老旧，建议借助大模型对部分内容进行甄别)

## 2活动安排

**活动主题**

Session 02 | Kernels: Memory Abstraction & Hierarchy

**时间**

2026 年 7 月 30 日（周四）

19:30 - 21:30

**线上参与**

- 腾讯会议（会议号将在活动群内公布）

- 腾讯会议直播

- B 站直播 （B站搜索 LCPU直播姬 ）

- LCPU Livestream （https://live.lcpu.dev）

**分享人**

周宇轩 ｜ 信息科学技术学院 23 级本科生，未名超算队成员

林若瑜 ｜ 信息科学技术学院 23 级本科生，未名超算队成员

---

**主办**

北京大学未名超算队

北京大学学生 Linux 俱乐部

---

[微信公众号原文](https://mp.weixin.qq.com/s/3ayYDOuZ7ChwubgfppThfw)
