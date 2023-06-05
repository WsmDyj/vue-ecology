import { defineConfig } from 'vitepress';
import { sidebar, nav } from './relaConf';

export default defineConfig({
  base: '/zh',
  title: 'vue-ecology',
  description: 'vue三大生态',
  themeConfig: {
    logo: '/logo.png',
    nav: nav,
    sidebar: sidebar,
    outline: {
      level: [2, 6],
      label: '目录'
    },
    footer: {
      message: 'MIT Licensed | Copyright © 2023-present kledwu.'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/WsmDyj/vue-ecology.git' }
    ]
  }
});
