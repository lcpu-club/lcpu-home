<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { useRoute } from '../router/router'

interface Slide {
  src: string
  alt: string
  caption: string
}
const route = useRoute()
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
const stage = useTemplateRef<HTMLElement>('stage')
const slides = ref<Slide[]>([])
const index = ref(0)
const current = computed(() => slides.value[index.value])
const scale = ref(1)
const position = ref({ x: 0, y: 0 })
const dragging = ref(false)
const touchOnly = ref(false)
let origin: HTMLElement | undefined
let overflow = ''
let padding = ''
let observer: MutationObserver | undefined
let openingPointer: { x: number; y: number } | undefined
const enhanced = new Map<
  HTMLImageElement,
  { tabindex: string | null; role: string | null; label: string | null }
>()
const pointers = new Map<number, { x: number; y: number }>()
let gesture: { x: number; y: number; distance: number } | undefined
let swipeStart: { id: number; x: number; y: number } | undefined
let moved = false

function reset() {
  scale.value = 1
  position.value = { x: 0, y: 0 }
  pointers.clear()
  gesture = undefined
  swipeStart = undefined
  dragging.value = false
}
function zoom(value: number, point = { x: 0, y: 0 }) {
  const next = Math.max(1, Math.min(5, value))
  const ratio = next / scale.value
  position.value =
    next === 1
      ? { x: 0, y: 0 }
      : {
          x: point.x - (point.x - position.value.x) * ratio,
          y: point.y - (point.y - position.value.y) * ratio,
        }
  scale.value = next
}
function move(step: number) {
  index.value = (index.value + step + slides.value.length) % slides.value.length
  reset()
}
function close() {
  if (dialog.value?.open) dialog.value.close()
  afterClose()
}
function afterClose() {
  if (!slides.value.length) return
  document.body.style.overflow = overflow
  document.body.style.paddingRight = padding
  slides.value = []
  reset()
  if (origin?.isConnected) origin.focus({ preventScroll: true })
  origin = undefined
}
async function open(image: HTMLImageElement) {
  if (slides.value.length) return
  const gallery = image.closest('.image-gallery')
  const images = gallery
    ? [...gallery.querySelectorAll<HTMLImageElement>('.image-gallery-slide img')].filter(
        (img) => !img.closest('a'),
      )
    : [image]
  index.value = Math.max(0, images.indexOf(image))
  slides.value = images.map((img) => ({
    src: img.currentSrc || img.src,
    alt: img.alt,
    caption:
      gallery?.querySelector(':scope > figcaption')?.textContent?.trim() ||
      img.closest('figure')?.querySelector('figcaption')?.textContent?.trim() ||
      img.alt,
  }))
  origin = image
  overflow = document.body.style.overflow
  padding = document.body.style.paddingRight
  const gutter = window.innerWidth - document.documentElement.clientWidth
  if (gutter > 0)
    document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`
  document.body.style.overflow = 'hidden'
  reset()
  await nextTick()
  if (!slides.value.length || !dialog.value?.isConnected) return
  dialog.value.showModal()
}
function eligible(target: EventTarget | null): target is HTMLImageElement {
  return (
    target instanceof HTMLImageElement &&
    !!target.closest('.md-content') &&
    !target.closest('a, button, [hidden]')
  )
}
function click(event: MouseEvent) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    !eligible(event.target)
  )
    return
  if (
    openingPointer &&
    Math.hypot(event.clientX - openingPointer.x, event.clientY - openingPointer.y) > 10
  )
    return
  open(event.target)
}
function key(event: KeyboardEvent) {
  if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return
  if (eligible(event.target) && ['Enter', ' '].includes(event.key)) {
    event.preventDefault()
    open(event.target)
  }
}
function recordPointer(event: PointerEvent) {
  openingPointer = { x: event.clientX, y: event.clientY }
}
function enhance(root: ParentNode) {
  const images = [...root.querySelectorAll<HTMLImageElement>('.md-content img')]
  if (root instanceof Element && root.closest('.md-content')) {
    if (root instanceof HTMLImageElement) images.push(root)
    else images.push(...root.querySelectorAll<HTMLImageElement>('img'))
  }
  for (const image of images) {
    if (enhanced.has(image) || image.closest('a, button')) continue
    enhanced.set(image, {
      tabindex: image.getAttribute('tabindex'),
      role: image.getAttribute('role'),
      label: image.getAttribute('aria-label'),
    })
    image.tabIndex = 0
    image.setAttribute('role', 'button')
    image.setAttribute('aria-label', image.alt ? `查看大图：${image.alt}` : '查看大图')
    image.classList.add('imagebox-trigger')
  }
  // Do not retain images from articles that have been navigated away from.
  for (const image of enhanced.keys()) if (!image.isConnected) enhanced.delete(image)
}
function point(event: { clientX: number; clientY: number }) {
  const rect = stage.value!.getBoundingClientRect()
  return {
    x: event.clientX - rect.left - rect.width / 2,
    y: event.clientY - rect.top - rect.height / 2,
  }
}
function sample() {
  const [a, b] = [...pointers.values()]
  if (!a) return undefined
  return b
    ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, distance: Math.hypot(a.x - b.x, a.y - b.y) }
    : { ...a, distance: 0 }
}
function pointerDown(event: PointerEvent) {
  if (event.button !== 0) return
  if (!pointers.size) {
    moved = false
    swipeStart =
      event.pointerType === 'touch' && scale.value === 1 && slides.value.length > 1
        ? { id: event.pointerId, x: event.clientX, y: event.clientY }
        : undefined
  } else {
    // A pinch must never turn into navigation when either finger is lifted.
    swipeStart = undefined
  }
  stage.value!.setPointerCapture(event.pointerId)
  pointers.set(event.pointerId, point(event))
  if (pointers.size > 1) moved = true
  gesture = sample()
  dragging.value = true
}
function pointerMove(event: PointerEvent) {
  if (!pointers.has(event.pointerId) || !gesture) return
  pointers.set(event.pointerId, point(event))
  const next = sample()!
  const dx = next.x - gesture.x,
    dy = next.y - gesture.y
  if (Math.hypot(dx, dy) > 2 || next.distance !== gesture.distance) moved = true
  if (next.distance && gesture.distance)
    zoom((scale.value * next.distance) / gesture.distance, gesture)
  if (scale.value > 1) position.value = { x: position.value.x + dx, y: position.value.y + dy }
  gesture = next
}
function pointerUp(event: PointerEvent) {
  const start = swipeStart
  swipeStart = undefined
  pointers.delete(event.pointerId)
  gesture = sample()
  dragging.value = pointers.size > 0
  if (
    event.type !== 'pointerup' ||
    !start ||
    start.id !== event.pointerId ||
    pointers.size ||
    scale.value !== 1
  )
    return
  const dx = event.clientX - start.x
  const dy = event.clientY - start.y
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    moved = true
    move(dx < 0 ? 1 : -1)
  }
}
function dialogClick(event: MouseEvent) {
  if (event.target instanceof Element && event.target.closest('button')) return
  // Pointer capture retargets clicks after dragging or pinching to the stage.
  if (moved && event.target instanceof Node && stage.value?.contains(event.target)) return
  close()
}
function wheel(event: WheelEvent) {
  if (touchOnly.value) return
  zoom(scale.value * Math.exp(-event.deltaY * 0.002), point(event))
}
function dialogKey(event: KeyboardEvent) {
  if (event.altKey || event.ctrlKey || event.metaKey) return
  if (['ArrowLeft', 'ArrowRight'].includes(event.key) && slides.value.length > 1) {
    event.preventDefault()
    move(event.key === 'ArrowLeft' ? -1 : 1)
  } else if (!touchOnly.value && ['+', '=', '-', '0'].includes(event.key)) {
    event.preventDefault()
    zoom(event.key === '0' ? 1 : scale.value + (event.key === '-' ? -0.5 : 0.5))
  }
}
watch(() => route.path, close)
onMounted(() => {
  touchOnly.value = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  document.addEventListener('click', click)
  document.addEventListener('keydown', key)
  document.addEventListener('pointerdown', recordPointer, { passive: true })
  enhance(document)
  observer = new MutationObserver((records) => {
    for (const record of records)
      for (const node of record.addedNodes) if (node instanceof Element) enhance(node)
  })
  observer.observe(document.getElementById('app')!, { childList: true, subtree: true })
})
onUnmounted(() => {
  close()
  afterClose()
  observer?.disconnect()
  document.removeEventListener('click', click)
  document.removeEventListener('keydown', key)
  document.removeEventListener('pointerdown', recordPointer)
  for (const [image, attrs] of enhanced) {
    for (const [name, value] of Object.entries({
      tabindex: attrs.tabindex,
      role: attrs.role,
      'aria-label': attrs.label,
    })) {
      if (value === null) image.removeAttribute(name)
      else image.setAttribute(name, value)
    }
    image.classList.remove('imagebox-trigger')
  }
  enhanced.clear()
})
</script>

<template>
  <dialog
    ref="dialog"
    class="imagebox"
    aria-label="图片查看器"
    @close="
      () => {
        if (!dialog?.open) afterClose()
      }
    "
    @cancel.prevent="close"
    @keydown="dialogKey"
    @click="dialogClick"
  >
    <template v-if="current">
      <header class="imagebox-toolbar">
        <span aria-live="polite" aria-atomic="true">{{ index + 1 }} / {{ slides.length }}</span>
        <div>
          <button
            v-if="!touchOnly"
            type="button"
            aria-label="缩小图片"
            :disabled="scale <= 1"
            @click="zoom(scale - 0.5)"
          >
            <MinusIcon />
          </button>
          <span v-if="touchOnly" class="imagebox-scale" role="status" aria-label="缩放比例">
            {{ Math.round(scale * 100) }}%
          </span>
          <button v-else type="button" aria-label="重置缩放" @click="reset">
            {{ Math.round(scale * 100) }}%
          </button>
          <button
            v-if="!touchOnly"
            type="button"
            aria-label="放大图片"
            :disabled="scale >= 5"
            @click="zoom(scale + 0.5)"
          >
            <PlusIcon />
          </button>
          <button type="button" aria-label="关闭图片查看器" autofocus @click="close">
            <XMarkIcon />
          </button>
        </div>
      </header>
      <div
        ref="stage"
        class="imagebox-stage"
        :class="{ 'is-dragging': dragging }"
        @wheel.prevent="wheel"
        @pointerdown="pointerDown"
        @pointermove="pointerMove"
        @pointerup="pointerUp"
        @pointercancel="pointerUp"
        @lostpointercapture="pointerUp"
      >
        <img
          :src="current.src"
          :alt="current.alt"
          draggable="false"
          :style="{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }"
        />
      </div>
      <button
        v-if="slides.length > 1 && !touchOnly"
        type="button"
        class="imagebox-prev"
        aria-label="上一张图片"
        @click="move(-1)"
      >
        <ChevronLeftIcon />
      </button>
      <button
        v-if="slides.length > 1 && !touchOnly"
        type="button"
        class="imagebox-next"
        aria-label="下一张图片"
        @click="move(1)"
      >
        <ChevronRightIcon />
      </button>
      <footer class="imagebox-caption">
        <p v-if="current.caption">{{ current.caption }}</p>
        <small>{{
          touchOnly
            ? `${slides.length > 1 ? '左右滑动切换 · ' : ''}双指缩放 · 拖动查看 · 轻点关闭`
            : '按钮或滚轮缩放 · 拖动查看 · 点击图片或按 Esc 关闭'
        }}</small>
      </footer>
    </template>
  </dialog>
</template>

<style>
.imagebox-trigger {
  cursor: zoom-in;
}
.imagebox-trigger:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 4px;
}
.imagebox {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  height: 100dvh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgb(12 15 20 / 96%);
  color: white;
  box-sizing: border-box;
  overflow: hidden;
}
.imagebox[open] {
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
}
.imagebox::backdrop {
  background: rgb(0 0 0 / 80%);
}
.imagebox-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: max(0.5rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right)) 0.5rem
    max(0.75rem, env(safe-area-inset-left));
  gap: 0.5rem;
}
.imagebox-scale {
  align-self: center;
  padding-inline: 0.5rem;
}
.imagebox-toolbar > div {
  display: flex;
  gap: 0.25rem;
}
.imagebox button {
  display: inline-grid;
  place-items: center;
  min-width: 44px;
  min-height: 44px;
  padding: 0.5rem;
  border: 1px solid rgb(255 255 255 / 20%);
  border-radius: 999px;
  background: rgb(255 255 255 / 8%);
  color: white;
  cursor: pointer;
  font: inherit;
}
.imagebox button:hover {
  background: rgb(255 255 255 / 20%);
}
.imagebox button:disabled {
  opacity: 0.35;
  cursor: default;
}
.imagebox button:focus-visible {
  outline: 2px solid #93c5fd;
  outline-offset: 3px;
}
.imagebox svg {
  width: 1.25rem;
  height: 1.25rem;
}
.imagebox-stage {
  min-height: 0;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: none;
  cursor: zoom-out;
}
.imagebox-stage.is-dragging {
  cursor: grabbing;
}
.imagebox-stage img {
  display: block;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  user-select: none;
  flex-shrink: 0;
}
.imagebox-prev,
.imagebox-next {
  position: absolute;
  top: 50%;
  z-index: 1;
}
.imagebox-prev {
  left: max(0.5rem, env(safe-area-inset-left));
}
.imagebox-next {
  right: max(0.5rem, env(safe-area-inset-right));
}
.imagebox-caption {
  text-align: center;
  padding: 0.5rem 1rem max(0.75rem, env(safe-area-inset-bottom));
  max-height: 25dvh;
  overflow: auto;
}
.imagebox-caption p {
  margin: 0 0 0.375rem;
  line-height: 1.5;
}
.imagebox-caption small {
  color: #aeb8c6;
}
</style>
