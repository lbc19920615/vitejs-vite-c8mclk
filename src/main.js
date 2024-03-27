if (!('anchorName' in document.documentElement.style)) {
  import('@oddbird/css-anchor-positioning');
}

import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

import 'scrollable-component';
import './ele.js';
import './ele/extend.js';

let app = createApp(App);
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-');
app.mount('#app');
