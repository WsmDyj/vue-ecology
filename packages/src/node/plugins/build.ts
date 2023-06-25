import { readFile } from 'fs/promises'
import { Plugin } from '../plugin'
import hash from 'hash-sum'
import { parse, compileScript, compileTemplate, compileStyle } from '@vue/compiler-sfc'
import path from 'path'

const genId = (filepath: string) => hash(path.relative(process.cwd(), filepath))

export function buildPlugin(): Plugin {
  return {
    name: 'vite:esbuild',
    // 加载模块
    async load(id) {
      try {
        const code = await readFile(id, "utf-8");
        return code;
      } catch (e) {
        console.log(e)
        return null;
      }
    },
    async transform(code, id) {
      const extname = path.extname(id).slice(1);
      if (extname === 'vue') {
        let contents = ''
        const scriptIdentifier = '_sfc_main'
        const {descriptor} = parse(code)
        if (descriptor.script) {
          const compiled = compileScript(descriptor, {
            id: genId(id)
          })
          contents += compiled.content.replace('export default ', `const ${scriptIdentifier}  = `)
        }
        if (descriptor.template) {
          const hasScoped = descriptor.styles.some((s) => s.scoped)
          const rawId = genId(id)
          const compiled = compileTemplate({
            source: descriptor.template.content,
            filename: rawId,
            id: rawId,
            scoped: hasScoped,
            compilerOptions: {
              scopeId: hasScoped ? `data-v-${id}` : undefined
            }
          })
          contents += compiled.code
          contents += `
            ${scriptIdentifier}.render = render
            export default ${scriptIdentifier}
          `
        }
        if (descriptor.styles.length > 0) {
          const rawId = genId(id)
          let content = ''
          for (const style of descriptor.styles) {
            const compiled = compileStyle({
              source: style.content,
              filename: rawId,
              id: rawId,
              scoped: style.scoped,
              preprocessLang: style.lang as any,
            })
            content += compiled.code
          }
          contents += `
              const id = "${id}"
              const __vite__css = ${JSON.stringify(content)}
              updateStyle(id, __vite__css)
              ${scriptIdentifier}.__vite__css = __vite__css
          `
        }
        return {
          code: contents
        }
      }
      if (extname === 'css') {
       return {
        code: `
            const id = "${id}"
            const __vite__css = ${JSON.stringify(code)}
            updateStyle(id, __vite__css)
            export default __vite__css
          `
       }
      }
      return { code }
    }
  }
}