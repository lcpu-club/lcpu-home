---
title: ～THE ULTIMATE MARKDOWN BENCHMARK!!!～
time: 2024-12-25
hidden: true
meta:
  description: 尝试所有在本项目中合法的 Markdown 语法
---

Merry, merry Christmas  
Lonely, lonely Christmas

---

## Markdown Syntax and a super long title

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

```vue
<template>
  <span>{{ 1 + 1 }}</span>
</template>
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

### More Code Blocks

```js
export function createApp() {
  const app = createSSRApp(App) // [!code highlight]
  const router = createRouter() // [!code focus]

  app.provide(RouterSymbol, router)
  app.provide('activityModules', activityModules) // [!code --]
  app.provide('newsModules', newsModules) // [!code ++]
  app.provide('pageModules', pageModules) // [!code ++]
  app.component('ExpanderComponent', ExpanderComponent)
  return { app, router }
}
```

::: expander 显示代码

````md
```js
export function createApp() {
  const app = createSSRApp(App) // [\!code highlight]
  const router = createRouter() // [\!code focus]

  app.provide(RouterSymbol, router)
  app.provide('activityModules', activityModules) // [\!code --]
  app.provide('newsModules', newsModules) // [\!code ++]
  app.provide('pageModules', pageModules) // [\!code ++]
  app.component('ExpanderComponent', ExpanderComponent)
  return { app, router }
}
```
````

:::

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
Console.WriteLine("Got rickrolled lol {{ 1 + 1 }}");
```

:::

Also inline-custom titles:

::: info 情報
伪中国语本当大变面白  
今日顽张！全然问题无！
:::

::: error त्रुटि
विफल प्रणाली सफलतापूर्वक विफल रही।
:::

::: warning 戒以警。

### 蜀道難

**李白**

噫吁嚱，危乎高哉！蜀道之難，難于上青天！  
蠶叢及魚鳧，開國何茫然！  
爾來四萬八千歲，不與秦塞通人煙。  
西當太白有鳥道，可以橫絕峨眉巔。  
地崩山摧壯士死，然后天梯石棧相鉤連。  
上有六龍回日之高標，下有沖波逆折之回川。  
黃鶴之飛尚不得過，猿猱欲度愁攀援。  
青泥何盤盤，百步九折縈巖巒。  
捫參歷井仰脅息，以手撫膺坐長嘆。

問君西游何時還？畏途巉巖不可攀。  
但見悲鳥號古木，雄飛雌從繞林間。  
又聞子規啼夜月，愁空山。  
蜀道之難,難于上青天，使人聽此凋朱顏！  
連峰去天不盈尺，枯松倒掛倚絕壁。  
飛湍瀑流爭喧豗，砯崖轉石萬壑雷。  
其險也如此，嗟爾遠道之人胡為乎來哉！

劍閣崢嶸而崔嵬，一夫當關，萬夫莫開。  
所守或匪親，化為狼與豺。  
朝避猛虎，夕避長蛇；磨牙吮血，殺人如麻。  
錦城雖云樂，不如早還家。  
蜀道之難,難于上青天，側身西望長咨嗟！

:::

::: expander DO NOT OPEN.
永远不弃汝，  
永远不失汝失望，  
常不走，永不动。  
:::

## 或者，我是否能使用中文

## UnoCSS

<h2 text-amber dark:text-blue font-italic font-black text-5xl text-shadow-lg class="text-shadow-color-amber-6/20 dark:text-shadow-color-blue-3/20" >UnoCSS support</h2>

## Reactivity

<span class="counter" font-bold text-lg>Current value: {{ count }}</span>
<button @click="add" m-t-2>
ADD ONE!
</button>

## Vue Components

<ItemCard :item="item" tag="" tagClass="" />

<script setup lang="ts">
import { ref } from 'vue'
import ItemCard from '@/components/ItemCard.vue'
import type { Item } from '@/data/item'
const count = ref(0)
const item : Item = {
  title: '>_<',
  description: 'Ciallo～(∠・ω< )⌒★',
  image: 'https://tse2-mm.cn.bing.net/th/id/OIP-C.cfn5B-21s-pyI5_couP9NQHaHa',
  link: "/",
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

<script lang="ts">
  console.log("script1")
</script>
