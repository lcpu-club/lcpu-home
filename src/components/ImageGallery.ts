import { defineComponent, h, ref } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon, Square2StackIcon } from '@heroicons/vue/24/outline'

export default defineComponent({
  name: 'ImageGallery',
  props: { caption: { type: String, default: '' } },
  setup(props, { slots }) {
    const active = ref(0)
    let touchStart: { x: number; y: number } | undefined
    return () => {
      // Named slots keep each slide distinct even when Vue hoists static HTML.
      const images = Object.keys(slots)
        .filter((name) => /^slide-\d+$/.test(name))
        .sort((a, b) => Number(a.slice(6)) - Number(b.slice(6)))
      const index = Math.min(active.value, Math.max(0, images.length - 1))
      const move = (step: number) => {
        if (images.length) active.value = (index + step + images.length) % images.length
      }
      return h(
        'figure',
        {
          class: 'image-gallery',
          role: 'group',
          'aria-roledescription': '图片轮播',
          'aria-label': props.caption || '图片集',
          tabindex: images.length > 1 ? 0 : undefined,
          onKeydown: (event: KeyboardEvent) => {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              move(event.key === 'ArrowLeft' ? -1 : 1)
            }
          },
        },
        [
          h(
            'div',
            {
              class: 'image-gallery-viewport',
              onTouchstart: (event: TouchEvent) => {
                const touch = event.touches.length === 1 ? event.touches[0] : undefined
                touchStart = touch ? { x: touch.clientX, y: touch.clientY } : undefined
              },
              onTouchcancel: () => {
                touchStart = undefined
              },
              onTouchend: (event: TouchEvent) => {
                const start = touchStart
                touchStart = undefined
                const touch = event.changedTouches[0]
                if (!start || !touch || event.touches.length) return
                const dx = touch.clientX - start.x
                const dy = touch.clientY - start.y
                if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) move(dx < 0 ? 1 : -1)
              },
            },
            [
              images.map((name, i) =>
                h(
                  'div',
                  {
                    key: name,
                    hidden: i !== index,
                    inert: i !== index,
                    class: 'image-gallery-slide',
                  },
                  slots[name]?.(),
                ),
              ),
              images.length > 1
                ? h('div', { class: 'image-gallery-controls' }, [
                    h(
                      'button',
                      { type: 'button', 'aria-label': '上一张图片', onClick: () => move(-1) },
                      h(ChevronLeftIcon, { 'aria-hidden': 'true' }),
                    ),
                    h(
                      'span',
                      { 'aria-live': 'polite', 'aria-atomic': 'true' },
                      `${index + 1} / ${images.length}`,
                    ),
                    h(
                      'button',
                      { type: 'button', 'aria-label': '下一张图片', onClick: () => move(1) },
                      h(ChevronRightIcon, { 'aria-hidden': 'true' }),
                    ),
                  ])
                : null,
              images.length > 1
                ? h('span', { class: 'image-gallery-badge', 'aria-hidden': 'true' }, [
                    h(Square2StackIcon),
                    '图片集',
                  ])
                : null,
              images.length > 1
                ? h('span', { class: 'image-gallery-hint', 'aria-hidden': 'true' }, '左右滑动切换')
                : null,
            ],
          ),
          props.caption ? h('figcaption', props.caption) : null,
        ],
      )
    }
  },
})
