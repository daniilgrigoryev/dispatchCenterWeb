import Vue from 'vue'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ru-RU'
import App from './App'
import router from './router'
import store from './store'
import $ from "jquery";
import {guid} from "./assets/js/utils/funcUtils";
import {RequstApi} from './assets/js/api/requestApi';
import * as RequestEntity from './assets/js/api/requestEntity';
import * as funcUtils from "./assets/js/utils/funcUtils";
import './themes/element-theme-build/index.css'
import './assets/js/vendor/vendor.js'

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale, size: 'small' });

let vue = new Vue({
  el: '#app',
  router,
  store,
  data: {},
  render: h => h(App),
  beforeCreate: function () {
    history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      history.go(1);
    };
    if (funcUtils.isNull(sessionStorage.getItem('wid'))) {
      sessionStorage.setItem('wid', guid());
      sessionStorage.setItem((sessionStorage.getItem('wid')), '[]');
      funcUtils.addToSessionStorage('path', [{routeName: 'Authorization', current: true}]);
    }
    funcUtils.addToLocalStorage('lastActive', new Date().getTime());
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
                funcUtils.addToSessionStorage('path', [{routeName: 'Authorization', current: true}]);
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
      $("body").bind("mousemove keypress mousedown", (function (e) {
        localStorage.setItem('lastActive', JSON.stringify(new Date().getTime()));
      }))
    }
  }
});
