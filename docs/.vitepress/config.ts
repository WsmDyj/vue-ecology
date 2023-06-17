import { defineConfig } from 'vitepress';
import { sidebar, nav } from './relaConf';

export default defineConfig({
  title: 'vue-ecology',
  outDir: 'dist',
  description: 'vue三大生态',
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/WsmDyj/vue-ecology/tree/main/docs/:path',
      text: '在 GitHub 上编辑此页'
    },
    logo: '/logo.png',
    nav: nav,
    sidebar: sidebar,
    footer: {
      message: 'MIT Licensed | Copyright © 2023-present kledwu.'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WsmDyj/vue-ecology.git' }
    ]
  },
  markdown: {
    theme: {
      light: 'vitesse-light',
      dark: 'vitesse-dark'
    },
    lineNumbers: true,
  }
});
