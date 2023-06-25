import path from "path"
import type { NextHandleFunction } from "connect"
import MagicString from 'magic-string'
import type { ViteDevServer } from "../../server"
import { readFile } from "fs/promises"

export interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | undefined>
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

export type IndexHtmlTransformResult = {
  tags: HtmlTagDescriptor[]
}

function serializeAttrs(attrs: HtmlTagDescriptor["attrs"]): string {
  let res = ""
  for (const key in attrs) {
    res += ` ${key}=${JSON.stringify(attrs[key])}`
  }
  return res
}

function serializeTags(tags: HtmlTagDescriptor[]): string {
  return tags.map(({tag, attrs}) => `<${tag}${serializeAttrs(attrs)}></${tag}>\n`).join("")
}

const headPrependInjectRE = /([ \t]*)<head[^>]*>/i

export function createDevHtmlTransformFn(html: string): string {
  const devHtmlHook: IndexHtmlTransformResult = {
    tags: [
      {
        tag: "script",
        attrs: {
          type: "module",
          src: path.posix.join("/", `./client/client.js`)
        },
        injectTo: "head-prepend"
      }
    ]
  }
  html = html.replace(
    headPrependInjectRE,
    (match) => `${match}\n${serializeTags(devHtmlHook.tags)}`
  )
  return html
}

export function indexHtmlMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url
    if (url?.endsWith('.html')) {
      const htmlPath = path.resolve(server.config.root, "index.html") // 拿到html地址
      let html = await readFile(htmlPath, "utf-8") // 读取html内容
      html = createDevHtmlTransformFn(html)
      res.statusCode = 200
      res.setHeader("Content-Type", "text/html")
      return res.end(html) // 返回html内容
    }
    next()
  }
}

