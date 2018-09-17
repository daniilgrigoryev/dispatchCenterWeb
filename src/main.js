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
import './components/SharedFilters/SharedFilters.vue'
import * as ConstantUtils from './assets/js/utils/constantUtils';

import moment from 'moment';
moment.locale('ru');

Vue.config.productionTip = false;
Vue.use(ElementUI, { locale, size: 'small' });

let vue = new Vue({
  el: '#app',
  router,
  store,
  data: {},
  render: h => h(App),
  beforeCreate: function () {
    if (funcUtils.isNull(sessionStorage.getItem('wid'))) {
      sessionStorage.setItem('wid', guid());
      sessionStorage.setItem((sessionStorage.getItem('wid')), '[]');
      funcUtils.addToSessionStorage('path', [{routeName: 'Authorization', current: true}]);
    }
    funcUtils.addToLocalStorage('lastActive', new Date().getTime());
    if (funcUtils.isNotEmpty(localStorage.getItem('sid'))) {
      let temp = new RequestEntity.RequestParam(new RequestEntity.RequestHead(localStorage.getItem('sid'), sessionStorage.getItem('wid'), null, null, 'addWID'), null);
      RequstApi.sendSocketRequest(temp, this);
    }
  },
  mounted: function () {
    this.activateTimer();
    history.pushState(null, null, window.location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  },
  methods: {
    logout: function () {
      funcUtils.removeAllComponents();
      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), sessionStorage.getItem('wid'), null, null, 'logout');
      let requestParam = new RequestEntity.RequestParam(requestHead, null);
      RequstApi.sendHttpRequest(requestParam);
      funcUtils.clearAll();
      this.$router.push('/');
    },
    clearToStart: function () {
      funcUtils.removeAllComponents();
      sessionStorage.setItem((sessionStorage.getItem('wid')), '[]');
      funcUtils.addToSessionStorage('path', [{routeName: 'Authorization', current: true}]);
    },
    getMonitorReestr: function () {
      this.clearToStart();
      funcUtils.getNextPage(this.$router, this.$store.state.monitorReestr.routeName);
    },
    getAlarmRuleReestr: function () {
      this.clearToStart();
      funcUtils.getNextPage(this.$router, this.$store.state.alarmRuleReestr.routeName);
    },
    getAlarmReestr: function () {
      this.clearToStart();
      funcUtils.getNextPage(this.$router, this.$store.state.alarmReestr.routeName);
    },
    getCameraOrMapReestr: function (isMap) {
      let vm = this;
      this.clearToStart();
      (async () => {
        try {
          let wid = sessionStorage.getItem('wid');
          let cid = funcUtils.getfromLocalStorage('cameraReestr');
          let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, this.$store.state.cameraReestr.bean, 'switchMap');
          let requestParam = new RequestEntity.RequestParam(requestHead, {toMap: isMap});
          let eventResponse = await RequstApi.sendHttpRequest(requestParam);
          if (isMap) {
            funcUtils.getNextPage(vm.$router, ConstantUtils.MAP_REESTR);
          } else {
            funcUtils.getNextPage(vm.$router, ConstantUtils.CAMERA_REESTR);
          }
        } catch (e) {
          alert(e.message);
        }
      })();
    },
    getMonitorDict: function () {
      this.clearToStart();
      funcUtils.getNextPage(this.$router, this.$store.state.monitorDict.routeName);
    },
    activateTimer: function () {
      $("body").bind("mousemove keypress mousedown", (function (e) {
        localStorage.setItem('lastActive', JSON.stringify(new Date().getTime()));
      }))
    },

  }
});
