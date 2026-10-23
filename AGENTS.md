# WeChat article publishing workflow

When the user supplies a WeChat MP article URL, fetch it and produce a publish-ready article in this repository. Complete extraction, metadata, image selection, Markdown cleanup, and validation; a raw HTML-to-Markdown conversion is only an intermediate result. Do not commit, push, publish, or change the WeChat platform unless requested.

## Fetch and inspect

1. Check existing articles for the same title and content before creating a duplicate. Place new Markdown articles under `content/<category>/<date-title>/index.md`, with assets alongside them. Use the original publication date followed by a descriptive kebab-case title: `YYYY-MM-DD-title` (for example, `2026-06-11-summer-shirts-order`). Follow existing category conventions: `news` for reports, activities, and recruitment; `announcements` for service notices and club announcements. Preserve user-specified categories and slugs; do not rename existing article directories merely to apply this convention.
2. Try an HTTP GET of the supplied URL with a browser User-Agent. Confirm that the response contains the actual article, not a verification page, login page, or error. Extract the article body from `#js_content` or `.rich_media_content`, title from `#activity-name`, and the original publication date and author from page metadata and rendered bylines. Publication dates may appear in scripts as well as the visible DOM; do not assume one exact script format or substitute today's date.
3. If direct fetching is blocked or incomplete, use a Camoufox instance or similar browser tool.
4. Inspect the full article, including its ending, before converting. Record real author credits, dates, substantive links, and the purpose of each image. Do not infer an article author from a speaker biography, a handbook's author, or someone mentioned in the prose.

`scripts/wechat-to-md.ts` is an interactive extraction helper (`bun run wechat`). It uses Axios, JSDOM, and Turndown, downloads images, and writes basic frontmatter. It does **not** complete this workflow: its date fallback, metadata, image extension guessing, and unfiltered body/images need review. 

## Frontmatter

Use valid YAML, quoting strings where needed and dates as `'YYYY-MM-DD'`. Match the original publication date, not event dates or the import date. Follow this shape:

```yaml
---
title: 'Article title'
time: '2026-06-11'
tags:
  - 社团事务
  - 社衫
meta:
  description: 简洁的一句话摘要，说明文章的主题和关键信息。
  keywords:
    - 社团事务
    - 社衫
summary: 简洁的一句话摘要，说明文章的主题和关键信息。
---
```

- Choose a few specific tags consistent with existing posts. Write a concise, factual, plain-text summary, usually one short Chinese sentence; keep it well below the generator's 120-character truncation limit. `meta.description` can match `summary`; `meta.keywords` should reflect the topic and tags.
- Omit `author` entirely for club-only credits such as `Linux 俱乐部`, `Linux俱乐部`, `北京大学学生 Linux 俱乐部`, or `LCPU`. Do not add an empty field or replace it with another club spelling.
- Preserve actual named authors, external organizations, and specific groups such as `云计算小组`, `高性能计算小组`, or `未名超算队`. Complete truncated credits from the original page: for example, `想换新皮肤的 LCPUer`, not `想换新皮肤的`.
- Inspect Markdown/HTML body bylines such as `文案`, `文字`, `撰文`, and closing signatures. Move genuine author names into `author` and remove the duplicated body byline. Separate multiple authors with `、`. Keep meaningful photography, editing, review, or sponsor credits in the body; do not misidentify those contributors as authors. Omit duplicate club-only signatures as author credits.
- Do not add `source`, `originalUrl`, or a `微信公众号原文` footer link. The generator's internal `sourceUrl` identifies the local Markdown file and must not be removed or repurposed.
- Add `转载` and an optional `redirect: 'https://…'` only when the article is genuinely forwarded and should link directly to its external original. A WeChat URL alone does not mean a post is forwarded. Prefer the verified original destination and preserve user-selected URLs. Redirects must be absolute HTTP(S) URLs; existing list links open them in a new tab, while directly opening the local article redirects that tab. Ordinary imported club articles should render locally without `redirect`.

## Convert to readable Markdown

- Convert only the article body. Remove WeChat navigation, follow-account prompts, share/read counters, unrelated recommended articles, album cards, media-network footers, and platform-only instructions such as “点击阅读原文”. Preserve the underlying useful action as a normal descriptive link when its destination is known.
- WeChat posts may use numbered references and a closing “参考链接” section because the platform restricts external links. Move each URL into a standard inline Markdown link at its corresponding mention (`[名称](https://…)`), remove the numbered markers and redundant reference section, and preserve the exact destinations. Keep substantive bibliographies and recommended-reading lists that serve a purpose beyond this workaround.
- Use standard Markdown headings (`##`, `###`), paragraphs, lists, blockquotes, fenced code, and links. The page already renders the frontmatter title, date, author, and tags, so do not repeat that title block in the body.
- Rejoin headings split into individual characters, replace repeated ornamental section numbers with a single descriptive heading, and remove empty headings. Repair malformed adjacent emphasis and accidental four-space indentation that turns prose into code. Preserve genuine code, commands, technical symbols, and all substantive information.
- Convert carousels into gallery containers with a shared caption. Remove “左右滑动查看更多” and arrow controls when there is no carousel. Do not preserve inline layout CSS, fixed-size wrappers, giant whitespace, or raw HTML solely for the original WeChat decoration.
- Remove a closing standalone date only when it duplicates the frontmatter publication date. This includes dates before a final content image. Preserve different signing dates, event schedules, deadlines, dates in prose, and dates that cannot be verified as duplicate publication dates.

## Images

- Multiple related images must use the gallery container below instead of a vertical image list. Apply this to consecutive activity photos, screenshots, route maps, design variants, and other image series throughout every post, including images inside list items. Keep images separated by explanatory prose in their original context; keep independently actionable QR codes and ordering links directly visible rather than hiding them in a gallery. It shows one image at a time, with previous/next buttons, keyboard arrow navigation, a counter, and one shared caption. Use descriptive alt text for each image; individual visible captions are suppressed inside galleries. Keep unrelated images separate. Avoid autoplay.

  ```markdown
  ::: gallery 社团计算资源

  ![计算服务器](./server.jpg)

  ![存储设备](./storage.jpg)

  :::
  ```

- Visually inspect images rather than deleting them solely by dimensions, extension, or filename. Contact sheets are useful for large articles. Remove purely decorative borders, confetti, flowers, spacer animations, repeated penguin dividers, carousel arrows (including SVGs), and unrelated promotional footer cards.
- Retain meaningful photos, posters, diagrams, screenshots, sponsor logos, QR codes, shirt designs, and size charts. A small image or a QR code is not automatically decoration. Preserve useful captions and order.
- Write captions in standard Markdown image syntax: `![Caption](./image.png)`. ScantPress renders image-only paragraphs as semantic figures with visible captions taken from alt text; use `![](./image.png)` when there is no caption. Move existing standalone caption paragraphs into the image alt text and remove the duplicate paragraph. For a related group with one shared caption, use the gallery container above. Preserve linked images as `[![Caption](./image.png)](destination)`. Images mixed with prose remain inline and do not get visible captions. Do not use placeholder captions such as `Image`, `图片`, or asset filenames, or raw HTML solely to attach captions.
- Read lazy-loaded image URLs from `data-src` before `src`. Download retained images beside `index.md`, deduplicate repeated assets where practical, and use relative Markdown references such as `![Descriptive caption](./image_1.png)`. Check the response content/type or actual file format; WeChat image URLs often lack a reliable extension, so do not blindly save everything as JPEG.
- Verify every retained image is available and every local reference resolves. Do not silently leave a broken image after a download failure. Delete discarded downloaded assets only after checking that no article or source code still references them. Do not delete shared assets.

## Review and validation

1. Compare the result with the original article: correct title, publication date, complete author, useful tags and short summary; no lost paragraphs, deadlines, links, credits, or content images.
2. Check YAML parsing and local image references, inspect the diff, and run `git diff --check`. Avoid repository-wide formatting or unrelated content changes.
3. Run the production build (`bun run build`) 
4. Preview the rendered article when feasible, especially image-heavy conversions. Check headings, code, image sizing, and the title/date/tag block both on direct load and after internal navigation. Use only the existing browser instance. Report validation limitations accurately.
5. Clean up task-created temporary downloads, review sheets, dependencies/build output that were absent before the task, and task-started preview processes. Close only research tabs created for this task; preserve the user's browser session and existing work. Report the resulting article path and checks performed.

## Lessons from reviewing the existing articles

- Validate the parsed Markdown, not just its source. In this repository, useful checks are unexpected `code_block` tokens (accidentally indented prose), text tokens containing literal `**`, empty headings, skipped heading levels, malformed link destinations, and missing image files. Review findings manually; the hidden Markdown/Vue demo deliberately exercises unusual syntax and must not be normalized like an article.
- Reserve the page's H1 for the frontmatter title. Use H2 for main sections and H3 for their subsections. Convert ornamental `Part1`, `1Session`, separated `**01**` markers, and bold-only section labels into a coherent hierarchy. Preserve meaningful numbers such as `Session 01`, `Phase 2`, years, model sizes, and numbered instructions; never strip digits indiscriminately.
- Chinese punctuation can prevent CommonMark emphasis delimiters from closing. Prefer `**标签**：正文` over `**标签：**正文`; add spaces around emphasized book titles when adjacent Chinese text otherwise makes the delimiters literal. Confirm the rendered output rather than assuming paired asterisks imply bold text.
- Use explicit Markdown links for URLs touching Chinese prose, especially URLs with paths. Linkification can swallow the following sentence into a URL. Remove conversion-introduced escapes inside URLs (for example `#source\-page` or `/Parallel\_computing`) without changing real path characters, encoded URLs, or literal usernames.
- List continuation indentation depends on the marker width: two spaces for `- `, three for `1. `, four for `10. `. Keep images, captions, and code inside the appropriate list item; do not globally remove indentation. Make member biographies nested lists under each name instead of one flat list of names and unrelated attributes. Replace decorative bullet characters and escaped list markers with actual Markdown lists. Avoid empty numbered markers separated from their contents by blank lines: they can become several separate lists instead of one sequence. When replacing HTML credit paragraphs, retain their separation using Markdown paragraphs or list items.
- Put standalone images on their own paragraphs, with blank lines separating them from prose; put their captions inside `![Caption](url)`, not adjacent paragraphs or headings. Bold wrappers do not help an image. Check indented image references too: carousel-arrow SVGs and empty headings can survive a cleanup that only searches column zero. Inspect SVG content before classifying it as decoration.
- Repair flattened code examples by recovering line breaks and adding an appropriate fence language. Preserve commands, values, output, and semantics; do not invent missing code or remove a useful example simply because a line is long. Long genuine commands may use the site's horizontally scrollable code blocks.
- Platform instructions must have a working web equivalent: link to the known competition site, repository releases, or registration form instead of telling website readers to click a nonexistent “阅读原文” control. Keep historical schedules, QR codes, and valid contributor/sponsor credits. A different footer date is not automatically redundant.
- Prefer targeted content fixes over broad CSS changes or repository-wide reformatting. Recheck local references after removing assets, then build the actual Markdown/Vue pipeline: plain Markdown parsing alone does not validate Vue templates, embedded components, syntax highlighting, or prerendering.


## Markdown link normalization

- In article prose, lists, blockquotes, and reference-reading sections, use descriptive `[label](URL)` links. Convert `Title (https://…)`, `Title：https://…`, and `Title https://…` into a single link on the title; do not leave a duplicate bare URL. Use meaningful labels for standalone URLs (for example, a document title, course handout, registration form, or livestream).
- Make navigational bare hostnames clickable with the known HTTP(S) destination. Format explicit contact addresses as `[address](mailto:address)`, but preserve deliberately obfuscated addresses such as `name [at] domain` and literal addresses in code.
- Preserve destination paths, query strings, fragments, URL encoding, and existing redirects exactly. Never guess a missing document URL, replace a historical destination with a newer one, or include adjacent Chinese punctuation/explanations in the destination.
- Inspect parsed Markdown tokens with automatic linkification disabled: HTTP(S) URLs in ordinary text outside `link_open`/`link_close` indicate a missed conversion. Exclude fenced/inline code, image alt text, frontmatter, raw HTML attributes, and the hidden syntax-demo article. Do not insert Markdown link syntax into image alt text; put a useful clickable link in nearby prose when appropriate.
- After normalization, check that every new link parses as a link with the intended label and destination, that existing links/images and code examples remain intact, and that no bare prose URLs or nested/malformed link syntax remain. Validate YAML, run `git diff --check`, and build the production Markdown/Vue pipeline.
