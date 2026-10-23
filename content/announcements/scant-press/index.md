---
title: Introducing ScantPress
time: '2024-12-27'
meta:
  description: 介绍为 LCPU 官网提供支持的 ScantPress：基于 Vue 3 与 Vite 的轻量静态站点生成器。
  generator: ScantPress 0.0.1
  keywords:
    - 开源项目
    - ScantPress
tags:
  - 开源项目
  - ScantPress
summary: 介绍为 LCPU 官网提供支持的 ScantPress：基于 Vue 3 与 Vite 的轻量静态站点生成器。
---

::: info
Project under construction.

May not publish a npm package in the near future. If you need it, just fork it.
You may also need to rewrite the homepage.
:::

A [VitePress](https://vitepress.dev/) inspired minimalism Static Site Generator (SSG), powers the homepage of Linux Club of Peking University.

Powered by Vue 3 and Vite.

[Live demo](https://lcpu.dev).

## Features

- Opinionated routing
- Vue in markdown
- SSG
- Containers, code blocks, math... A lot supported by MarkdownIt Plugins
- Independently implemented expander component, which offers a fluent animation, compared to VitePress
- Automatically generated sidebar and index pages, grouped by time order (once you added the routes)
- Image lazy loading
- Page outline (experimental)

## Features not implemented yet

- [ ] Referencing frontmatter in markdown
- [ ] Github flavored containers (no plan yet)
