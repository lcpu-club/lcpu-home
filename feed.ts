import { Feed } from 'feed'
import { generatePages } from './generator/pages-generator'
import { RouteTitleRecord } from './src/site'
import { writeFileSync } from 'fs'
import chalk from 'chalk'

console.log(chalk.bgYellow.greenBright('Generating feed:'))

const pages = generatePages()
  .filter((page) => page.category && page.category in RouteTitleRecord)
  .sort((a, b) => Date.parse(b.time) - Date.parse(a.time))

const postsFeed = new Feed({
  title: '北京大学学生 Linux 俱乐部',
  description:
    '北京大学学生 Linux 俱乐部(Linux Club of Peking University, LCPU)是由学生自发成立的民间组织，以学习研究 Linux 操作系统和其它各种与开源相关的软硬件技术为目的。',
  id: 'https://lcpu.dev/',
  link: 'https://lcpu.dev/',
  language: 'zh-Hans',
  image: 'https://lcpu.dev/favicon.svg',
  favicon: 'https://lcpu.dev/favicon.ico',
  copyright: `© 2003 - ${new Date().getFullYear()} 北京大学学生 Linux 俱乐部`,
  updated: new Date(pages[0].time),
  generator: 'ScantPress',
  feedLinks: {
    atom: 'https://lcpu.dev/posts.atom',
  },
  author: {
    name: '北京大学学生 Linux 俱乐部',
    email: 'linuxclub@pku.edu.cn',
    link: 'https://lcpu.dev/',
  },
})

pages.forEach((page) => {
  postsFeed.addItem({
    title: page.title,
    id: `https://lcpu.dev${page.contentUrl}`,
    link: `https://lcpu.dev${page.contentUrl}`,
    description: page.meta?.description,
    content: page.excerpt,
    author: page.data?.author
      ? [
          {
            name: page.data.author as string,
          },
        ]
      : [
          {
            name: '北京大学学生 Linux 俱乐部',
            email: 'linuxclub@pku.edu.cn',
            link: 'https://lcpu.dev/',
          },
        ],
    date: new Date(page.time),
    image: page.meta?.image,
    category: page.category ? [{ name: RouteTitleRecord[page.category] }] : [],
  })
})

writeFileSync('./dist/static/posts.atom', postsFeed.atom1())
console.log(chalk.green('generated:'), 'dist/static/posts.atom')

Object.keys(RouteTitleRecord).forEach((routeBase) => {
  const categoryPages = pages.filter((page) => page.category === routeBase)
  const categoryFeed = new Feed({
    title: `${RouteTitleRecord[routeBase]} | 北京大学学生 Linux 俱乐部`,
    description:
      '北京大学学生 Linux 俱乐部(Linux Club of Peking University, LCPU)是由学生自发成立的民间组织，以学习研究 Linux 操作系统和其它各种与开源相关的软硬件技术为目的。',
    id: `https://lcpu.dev/${routeBase}/`,
    link: `https://lcpu.dev/${routeBase}/`,
    language: 'zh-Hans',
    image: 'https://lcpu.dev/favicon.svg',
    favicon: 'https://lcpu.dev/favicon.ico',
    copyright: `© 2003 - ${new Date().getFullYear()} 北京大学学生 Linux 俱乐部`,
    updated: new Date(categoryPages[0].time),
    generator: 'ScantPress',
    feedLinks: {
      atom: `https://lcpu.dev/${routeBase}/posts.atom`,
    },
    author: {
      name: '北京大学学生 Linux 俱乐部',
      email: 'linuxclub@pku.edu.cn',
      link: 'https://lcpu.dev/',
    },
  })
  categoryPages.forEach((page) => {
    categoryFeed.addItem({
      title: page.title,
      id: `https://lcpu.dev${page.contentUrl}`,
      link: `https://lcpu.dev${page.contentUrl}`,
      description: page.meta?.description,
      content: page.excerpt,
      author: page.data?.author
        ? [
            {
              name: page.data.author as string,
            },
          ]
        : [
            {
              name: '北京大学学生 Linux 俱乐部',
              email: 'linuxclub@pku.edu.cn',
              link: 'https://lcpu.dev/',
            },
          ],
      date: new Date(page.time),
      image: page.meta?.image,
    })
  })
  categoryFeed.addCategory(RouteTitleRecord[routeBase])
  writeFileSync(`./dist/static/${routeBase}/posts.atom`, categoryFeed.atom1())
  console.log(chalk.green('generated:'), `dist/static/${routeBase}/posts.atom`)
})
