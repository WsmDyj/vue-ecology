import path from "path"
import type { NextHandleFunction } from "connect"
import MagicString from 'magic-string'
import type { ViteDevServer } from "../../server"
import { readFile } from "fs/promises"

export interface HtmlTagDescriptor {
  tag: string
  attrs?: Record<string, string | boolean | undefined>
  children?: string | HtmlTagDescriptor[]
  injectTo?: 'head' | 'body' | 'head-prepend' | 'body-prepend'
}

export type IndexHtmlTransformResult = {
  html: string
  tags: HtmlTagDescriptor[]
}

function incrementIndent(indent: string = '') {
  return `${indent}${indent[0] === '\t' ? '\t' : '  '}`
}

function injectToHead(html: string, tags: HtmlTagDescriptor[]): string {
  const headPrependInjectRE = /([ \t]*)<head[^>]*>/i

  // const a = tags.map((tag) => `${indent}${serializeTag(tag, indent)}\n`).join('')

  return html.replace(headPrependInjectRE, (match, p1) => {
    console.log(match, incrementIndent(p1))
  })
}

export function createDevHtmlTransformFn(html: string): string {
  const devHtmlHook: IndexHtmlTransformResult = {
    html,
    tags: [
      {
        tag: 'script',
        attrs: {
          type: 'module',
          src: path.posix.join('/', `/@vite/client`),
        },
        injectTo: 'head-prepend',
      },
    ],
  }
  html = injectToHead(devHtmlHook.html, devHtmlHook.tags)
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

