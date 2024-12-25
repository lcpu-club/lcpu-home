---
title: ~THE ULTIMATE MARKDOWN BENCHMARK!!!~
time: 2024-12-25
metaDescription: 尝试所有在本项目中合法的 Markdown 语法
---

Merry, merry Christmas  
Lonely, lonely Christmas

---

## Markdown Syntax

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

**Bold Text**

_Italic Text_

**_Bold and Italic Text_**

~~Strikethrough Text~~

- Unordered List Item 1
- Unordered List Item 2

1. Ordered List Item 1
2. Ordered List Item 2

[Link to Google](https://www.google.com)

![Alt Text for Image](https://via.placeholder.com/150)

`Inline Code`

```python
# Code Block
def hello_world():
    print("Hello, World!")
```

> Blockquote  
> This is a blockquote.

| Left-Aligned | Center-Aligned | Right-Aligned |
| :----------- | :------------: | ------------: |
| Left         |     Center     |         Right |
| Data         |      Data      |          Data |

**Escaping Characters:**  
\*This is not italic\*

**Inline Images with Links:**  
[![Alt Text](https://via.placeholder.com/150)](https://www.google.com)

**Horizontal Rule:**

---

## Extended Markdown Syntax

### Math `(markdown-it-mathjax3)`

When $(a \ne 0)$, there are two solutions to $(ax^2 + bx + c = 0)$ and they are:
$[x = {-b \pm \sqrt{b^2-4ac} \over 2a}]$

$$
f(x) =
\begin{cases}
    \frac{1}{2} \sum_{i=1}^{n} \left( x_i - \mu \right)^2 & \text{if } x \geq 0, \\
    \int_{0}^{\infty} e^{-t} \cdot \log(1 + t) \, dt & \text{if } x < 0,
\end{cases}
$$

where $\mu$ is the mean, and $x_i$ are the sample points. The matrix $\mathbf{A}$ is defined as:

$$
\mathbf{A} = \begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n} \\
a_{21} & a_{22} & \cdots & a_{2n} \\
\vdots & \vdots & \ddots & \vdots \\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}
$$

### Containers `(markdown-it-containers)`

::: warning
If you’re using drugs, stop it, get some help.
:::

::: error
The failing system failed successfully.
:::

::: info
We will provide you with some information that is
useless at all
:::

::: expander
Never gonna give you up,  
Never gonna let you down,  
Never gonna run around and,  
Desert you~

```csharp
Console.WriteLine("Got rickrolled lol");
```

:::

## UnoCSS

<h2 text-amber dark:text-blue font-italic font-black text-5xl text-shadow-lg class="text-shadow-color-amber-6/20 dark:text-shadow-color-blue-3/20" >UnoCSS support</h2>

## Reactivity

<span class="counter" font-bold text-lg>Current value: {{ count }}</span>
<button v-on:click="add" m-t-2>
ADD ONE!
</button>

## Vue Components

<ProjectCard :project="project" />

<script setup lang="ts">
import { ref } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'
import type { Project } from '@/data/project'
const count = ref(0)
const project : Project = {
  title: '>_<',
  description: 'Ciallo～(∠・ω< )⌒★',
  image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.cfn5B-21s-pyI5_couP9NQHaHa'
}

function add() {
  count.value++
}
</script>

<style lang="css" scoped>
.counter {
  display: block;
}

button {
  border: 0;
  border-radius: 1rem;
  padding: 1rem 2rem;
  background-color:rgb(222, 222, 222);
}

button:hover {
  background-color:rgb(214, 214, 214);
}
</style>
