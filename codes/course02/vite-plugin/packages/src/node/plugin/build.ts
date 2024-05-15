import { Plugin } from '../plugin'
import { readFile } from 'fs/promises'

export function buildPlugin(): Plugin {
  return {
    name: 'vite:esbuild',
    async load(id) {
      try {
        const code = await readFile(id, "utf-8");
        return code;
      } catch (e) {
        console.log(e)
        return null;
      }
    },
  }
}