import 'mint-ui/lib/style.css';
import Vue from 'vue';
import MintUI from 'mint-ui';
import FastClick from 'fastclick';
import IndexView from './components/index-view.vue';
import store from './store';

if (process.env.NODE_ENV === 'development') {
  const VConsole = require('common/js/dev/vconsole.min');
  const vconsole = new VConsole();
}

Vue.use(MintUI);
FastClick.attach(document.body);

const isDev = process.env.NODE_ENV !== 'production';

Vue.config.debug = isDev;
Vue.config.devtools = isDev;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { IndexView },
  template: '<IndexView/>'
});
