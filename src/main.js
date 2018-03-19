import Vue from 'vue';
import ElementUI from 'element-ui';
import VueClipboard from 'vue-clipboard2';
// import $ from 'jquery';
// import 'bootstrap'
import 'element-ui/lib/theme-chalk/index.css';
// import locale from 'element-ui/lib/locale/lang/en'
import App from './App';
import router from './router';
import store from './store';
import '@/icons'; // icon
import '@/permission';
require('jquery-ui-dist/jquery-ui.js');
import 'babel-polyfill';

// import '../static/UE/ueditor.config.js'
// import '../static/UE/ueditor.all.min.js'
// import '../static/UE/lang/zh-cn/zh-cn.js'
// import '../static/UE/ueditor.parse.min.js'
// import '../static/XH/xheditor-1.2.2.min.js'
// import '../static/XH/xheditor_lang/zh-cn.js'

Vue.use(ElementUI);
Vue.use(VueClipboard);

Vue.config.productionTip = false;

const VueUploadComponent = require('vue-upload-component');
Vue.component('file-upload', VueUploadComponent);

const app = new Vue({
  // el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
});

app.$mount('#app');
