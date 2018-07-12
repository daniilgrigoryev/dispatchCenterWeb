// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import 'element-ui/lib/theme-chalk/index.css'
import '@mapbox/assembly/dist/assembly.css'
import '@mapbox/assembly/dist/assembly.js'
import 'source-sans-pro/source-sans-pro.css'
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

Vue.use(ElementUI);

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
      sessionStorage.setItem('path', '[{"srcPath":"Authorization","current":true}]');
    }
    localStorage.setItem('lastActive', JSON.stringify(new Date().getTime()));
    if (undefined !== localStorage.getItem('sid') && null !== localStorage.getItem('sid')) {
      let temp = new RequestEntity.RequestParam(new RequestEntity.RequestHead(localStorage.getItem('sid'), sessionStorage.getItem('wid'), null, null, 'addWID'), null);
      RequstApi.sendSocketRequest(temp, this);
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
      RequstApi.sendHttpRequest(requestParam)
        .then(eventResponse => {
          if (eventResponse.status === 200) {
            let data = eventResponse.response;
            if (data.length > 0) {
              let dataJson = JSON.parse(data);
              if (dataJson.method === 'logout') {
                localStorage.removeItem('auth');
                localStorage.removeItem('sid');
                localStorage.removeItem('lastActive');
                sessionStorage.setItem('path', '[{"srcPath":"Authorization","current":true}]');
                this.$router.push('/');
              }
            }
          }
        })
        .catch(eventResponse => {
          alert(eventResponse.message);
        });
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
