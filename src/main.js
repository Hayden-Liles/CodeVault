import '@mdi/font/css/materialdesignicons.css'
import 'bootstrap'
import { createApp, watch } from 'vue'
// @ts-ignore
import App from './App.vue'
import { router } from './router'
import { setupAuthListener } from './services/AuthService.js'
import { AppState } from './AppState'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

const root = createApp(App)
setupAuthListener()

watch(() => AppState.isLoading, (isLoading) => {
  if (!isLoading) {
    root
      .use(router)
      .mount('#app')
  }
})
