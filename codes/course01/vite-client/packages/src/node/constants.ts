import path, { resolve } from 'node:path'
import { URL, fileURLToPath } from 'node:url'

export const CLIENT_PUBLIC_PATH = `/@vite/client`

// export const VITE_PACKAGE_DIR = resolve(
//   // import.meta.url is `dist/node/constants.js` after bundle
//   fileURLToPath(new URL(import.meta.url)),
//   '../../..',
// )

// export const CLIENT_ENTRY = resolve(VITE_PACKAGE_DIR, 'dist/client/client.mjs')