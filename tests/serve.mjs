import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
const root = resolve('dist/static')
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.woff2': 'font/woff2',
}
createServer(async (req, res) => {
  try {
    let file = resolve(
      root,
      '.' + decodeURIComponent(new URL(req.url, 'http://localhost').pathname),
    )
    if (!file.startsWith(root + sep) && file !== root) throw new Error('Invalid path')
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html')
    res
      .writeHead(200, { 'Content-Type': types[extname(file)] ?? 'application/octet-stream' })
      .end(await readFile(file))
  } catch {
    res
      .writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
      .end(await readFile(resolve(root, '404.html')))
  }
}).listen(4178, '0.0.0.0')
