# ScantPress

> [!IMPORTANT]
>
> Project under construction.
>
> May not publish a npm package in the near future. If you need it, just fork it.
> You may also need to rewrite the homepage.

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

## Article cover images

Set `meta.image` in article frontmatter to an image relative to that article:

```yaml
meta:
  image: ./cover.jpg
```

Local covers go through Vite's asset pipeline, including the article raster optimizer,
with hashed filenames and absolute URLs in Open Graph, Twitter, structured data, and
Atom feeds. Covers are emitted even when absent from the article body. SVGs and other
assets remain separate files rather than inline data URLs. Missing local covers fail
the build. Absolute HTTP(S) URLs are retained; `/cover.jpg` refers to `public/cover.jpg`.

Run `bun run build` to generate both pages and feeds. `bun run build:feed` uses the
metadata from the latest server build, so rebuild the bundles after changing covers.
