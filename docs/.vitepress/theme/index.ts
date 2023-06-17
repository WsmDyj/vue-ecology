import DefaultTheme from 'vitepress/theme'
import ZoomImg from './components/ZoomImg.vue'
import './style/var.css';
import './style/custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // register global components
    app.component('ZoomImg', ZoomImg)
  }
};
