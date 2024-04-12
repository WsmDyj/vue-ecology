import type { NextHandleFunction } from 'connect'
import type { ViteDevServer } from '../../server'
import { readFile } from 'fs/promises'
import path from 'path'

export function indexHtmlMiddleware(server: ViteDevServer): NextHandleFunction {
  return async (req, res, next) => {
    const url = req.url
    if (url?.endsWith('.html')) {
      const htmlPath = path.resolve(server.config.root, 'index.html')
      let html = await readFile(htmlPath, 'utf-8')
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html");
      return res.end(html);
    }
    next()
  } 
}