// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import $ from "jquery";
import {guid} from "./assets/js/utils/funcUtils";
import {RequstApi} from './assets/js/api/requestApi';
import * as ConstantUtils from './assets/js/utils/constantUtils';
import * as RequestEntity from './assets/js/api/requestEntity';
import * as funcUtils from "./assets/js/utils/funcUtils";

Vue.config.productionTip = false;

let vue = new Vue({
  el: '#app',
  router,
  store,
  data: {},
  render: h => h(App),
  beforeCreate: function () {
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    if (null === sessionStorage.getItem('wid')) {
      sessionStorage.setItem('wid', guid());
      sessionStorage.setItem((sessionStorage.getItem('wid')), '[]');
    }
    localStorage.setItem('lastActive', JSON.stringify(new Date().getTime()));
    if (undefined !== localStorage.getItem('sid') && null !== localStorage.getItem('sid')) {
      let temp = new RequestEntity.RequestParam(new RequestEntity.RequestHead(localStorage.getItem('sid'), sessionStorage.getItem('wid'), null, null, 'addWID'), null);
      RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_WS, temp, this);
    }
  },
  mounted: function () {
    this.activateTimer();
  },
  methods: {
    logout: function () {
      funcUtils.removeAllComponents();
      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), sessionStorage.getItem('wid'), null, null, 'logout');
      let requestParam = new RequestEntity.RequestParam(requestHead, null);
      let eventResponse = RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_HTTP, requestParam);
      if (eventResponse.status === 200) {
        let data = eventResponse.response;
        if (data.length > 0) {
          let dataJson = JSON.parse(data);
          if (dataJson.method === 'logout') {
            localStorage.removeItem('auth');
            localStorage.removeItem('sid');
            localStorage.removeItem('lastActive');
            this.$router.push('/');
          }
        }
      }
    },
    activateTimer: function () {
      debugger;
      $("body").bind("mousemove keypress mousedown", (function (e) {
        localStorage.setItem('lastActive', JSON.stringify(new Date().getTime()));
      }))
    }
  }
  // template: '<App/>',
  // components: { App }
});
