---
title: 'Infra Seminars 03 - 8月2日 | Tensor Core'
time: 2026-08-01
tags: ['AI Infra', '活动']
source: https://mp.weixin.qq.com/s/nsfWQWshoCx8C_owaOPBYg
author: 'Linux 俱乐部'
meta:
  description: 'Infra Seminars 03 | Tensor Core，8月2号（周日）晚，快来参加！'
---

当一次训练需要调动成百上千张 GPU，当一个算子几毫秒的差距都会被重复放大，模型背后的系统究竟如何工作？

这个暑假，北京大学未名超算队与北京大学学生 Linux 俱乐部共同推出的 **Weiming HPC Training Camp × LCPU AI Infra Seminars** 将于 **7月到9月** 正式开课！

从 Kernel 到编译器，从分布式系统到集合通信，从模型推理到强化学习系统，我们将在七周时间里，围绕四个 Topic，一起走进大模型训练与推理背后的系统。

现在，准备工作已经就绪。

第一周我们将进入 Topic 1 —— **Kernel & ML Compiler**。从 GPU 的工作方式开始，逐步认识 CUDA 编程模型，并初步接触 Triton、TileLang 等 GPU Kernel DSL。

## 1Session 03 | Kernels with GEMM: Tensor Core

近年来，NVIDIA GPU 的算力正在逐年倍增；细看却不难发现，总算力高速提升的同时，CUDA Core 算力、FP32/FP64 算力的提升却并不显著，主要的算力提升全都来自于一块特殊的硬件：Tensor Core

什么是 Tensor Core ？为什么需要 Tensor Core ？如何使用 Tensor Core ？本讲，我们将从这个问题出发，讲述：

- 什么是 Tensor Core

- Tensor Core 的计算模型

- Programming with Tensor Core

- 低精度下的 Tensor Core

同时，我们还将从这一视角出发， 讨论计算需求和硬件演化之间的关系，看看 sm80/90/100 三代硬件的 Tensor Core 发生了什么变化。

课前阅读：

1.  https://www.nvidia.com/en-us/data-center/tensor-cores/

2.  https://docs.nvidia.com/cuda/parallel-thread-execution/#warp\-level-matrix-instructions-mma 只需要看m16n8k16 那一节，重点是 A 和 B 的 fragment 布局

3.  https://docs.nvidia.com/cuda/cuda-c-programming-guide/#shared\-memory 复习 bank 的划分和 conflict 的成因

4.  DeepSeek-V3 Technical Report，只读 FP8 训练小节

## 2活动安排

**活动主题**

Session 03 | Kernels with GEMM: Tensor Core

**时间**

2026 年 8 月 2 日（周日）

19:30 - 21:30

**线上参与**

- 腾讯会议（会议号将在活动群内公布）

- 腾讯会议直播

- B 站直播 （B站搜索 LCPU直播姬 ）

- LCPU Livestream （https://live.lcpu.dev）

**分享人**

孙远航｜计算机学院 2025 级硕士研究生、未名超算队前队长、北京大学学生 Linux 俱乐部前社长

**主办**

北京大学未名超算队

北京大学学生 Linux 俱乐部

---

[微信公众号原文](https://mp.weixin.qq.com/s/nsfWQWshoCx8C_owaOPBYg)
