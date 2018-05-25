import Vue from 'vue';
import FastClick from 'fastclick';
import App from './app';
import store from './store';

FastClick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>'
});
