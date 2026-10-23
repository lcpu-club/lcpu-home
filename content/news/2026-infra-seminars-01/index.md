---
title: Infra Seminars 7月26日 第一次课 | 从并行编程到第一个 GPU Kernel
time: '2026-07-25'
tags:
  - 活动
  - Infra Seminars
  - AI Infra
meta:
  description: 7 月 26 日 Infra Seminars 首课：从并行编程基础出发，编写第一个 GPU Kernel。
  keywords:
    - 活动
    - Infra Seminars
    - AI Infra
summary: 7 月 26 日 Infra Seminars 首课：从并行编程基础出发，编写第一个 GPU Kernel。
---

当一次训练需要调动成百上千张 GPU，当一个算子几毫秒的差距都会被重复放大，模型背后的系统究竟如何工作？

这个暑假，北京大学未名超算队与北京大学学生 Linux 俱乐部共同推出的 **Weiming HPC Training Camp × LCPU AI Infra Seminars 将于 7月26日（星期日）正式开课**！

从 Kernel 到编译器，从分布式系统到集合通信，从模型推理到强化学习系统，围绕四个 Topic，让我们一起走进大模型训练与推理背后的系统。

现在，准备工作即将就绪

第一周我们将进入 Topic 1 —— **Kernel & ML Compiler**。从 GPU 的工作方式开始，逐步认识 CUDA 编程模型，并初步接触 Triton、TileLang 等 GPU Kernel DSL。

## Session 00 | 从 HPC 到 AI Infra: 并行计算与并行编程

为什么超算和 AI Infra 息息相关？为什么随着算力增强，人工智能才能越来越强？

为什么大模型在 GPU 上才能运行和训练？

这都归功于大模型的计算和传统的科学计算、气候模拟等问题一样，能够**高度并行**

- 为什么能并行？

- 什么地方并行？

- 如何做并行计算？

- 为什么大模型 Infra 要写 Kernel？为什么普通 CPU 编程不叫写 Kernel？

这次课希望能给你建立一些直觉上的感受。

### 课前阅读 & 参考资料

- Introduction to Parallel Computing Tutorial (https://hpc.llnl.gov/documentation/tutorials/introduction-parallel-computing-tutorial)

- Parallel Computing on Wikipedia (https://en.wikipedia.org/wiki/Parallel_computing)

## Session 01 | GPU 编程模型

为什么 GPU 上的一个线程不比 CPU 更快，却能完成更大规模的并行计算？

CUDA 为何要把线程组织成 Thread、Block 和 Grid？Warp 又是什么？

当我们从 CUDA 转向 Triton、TileLang，编程视角为什么会从“一个线程”变成“一块数据”？

- **MLSys on GPU**: SIMD 与 SIMT、Throughput 与 Latency，以及 GPU 为何适合大规模并行计算

- **CUDA Programming Model**: Host 与 Device、Kernel Launch、Thread / Block / Grid、Warp，以及线程之间的执行与协作

- **Triton / TileLang**: Program、Block 与 Tile Level 编程

本次课希望简单介绍上述内容，帮助大家建立后续学习所需的基本视角，为后续深入学习打下基础。

### 课前阅读 & 参考资料

- CUDA-From-Correctness-To-Performance-Code/lecture.md (https://github.com/interestingLSY/CUDA-From-Correctness-To-Performance-Code/blob/master/lecture.md)

- CUDA Programming Guide (https://docs.nvidia.com/cuda/cuda-programming-guide/)

- CUDA C Best Practices Guide (https://docs.nvidia.com/cuda/cuda-c-best-practices-guide/)

- TileLang Documentation (https://tilelang.com/)

- Triton Documentation (https://triton-lang.org/main/index.html)

## 丰富的交流与实践

Infra Seminars 不是一套由少数讲者单向输出的课程

无论是课前、课中还是课后，我们都欢迎大家积极交流、提出意见、给出反馈！

此外，在直播课程之外，我们还准备了丰富的实践作业，敬请大家关注！

同时，我们也非常欢迎有独到见解的你来做分享，向大家分享你在某个子领域的见解！（具体关注活动群内报名📢）

## 活动安排

**活动主题**

Session 00 | 从 HPC 到 AI Infra: 并行计算与并行编程

Session 01｜GPU Programming Model

本次活动还将介绍活动的整体安排、内容设计、评测与算力等！

**时间**

2026 年 7 月 26 日（周日）

18:00 - 20:30

**线上参与**

腾讯会议（会议链接届时公布于活动群）

B站直播（B站搜索 **LCPU直播姬** ）

LCPU 直播平台（https://live.lcpu.dev/）

**分享人**

陈嘉骏｜元培学院 25 级本科生，未名超算队成员

郑 熠｜信息科学技术学院 25 级本科生，未名超算队成员

王艺霏｜信息科学技术学院 25 级本科生，未名超算队成员

**本周日（7 月 26日）**，Weiming HPC Training Camp × LCPU AI Infra Seminars，**第一课见！**

---

**主办**

北京大学未名超算队

北京大学学生 Linux 俱乐部

**特别感谢**

**![](./image_1.png)**

**腾讯成立于1998年，总部位于中国深圳。公司一直秉承科技向善的宗旨。我们的通信和社交服务连接全球逾10亿人，帮助他们与亲友联系，畅享便捷的出行、支付和娱乐生活。腾讯发行多款风靡全球的电子游戏及其他优质数字内容，为全球用户带来丰富的互动娱乐体验。腾讯还提供云计算、营销、金融科技等一系列企业服务，支持合作伙伴实现数字化转型，促进业务发展。**

![](./image_2.jpg)

宽德投资是一家国内领先、业务全面的量化对冲基金。基于先进高效的研究和交易构架，以及完善的资产管理系统，宽德投资在国内期货、股票、期权等主流市场具有良好的盈利能力。

宽德智能学习实验室(Will)是宽德投资独立孵化的创业型实验室，致力于实现超级科技助手(ASI for Sci-Tech)。Will将汇聚顶尖AI人才，专注于研发通用性超级科技助手，追求技术复利与持续性领先。
