import Vue from 'vue'
import Router from 'vue-router'
import Authorization from './../components/Authorization'
import MonitorViewData from '../components/metricaPassport/MonitorViewData'
import AlarmViewData from '../components/alarmPassport/AlarmViewData'
import MonitorReestr from '../components/MonitorReestr'
import MonitorEdit from '../components/MonitorEdit'
import AlarmRuleReestr from '../components/AlarmRuleReestr'
import AlarmRuleEdit from '../components/AlarmRuleEdit'
import PageNotFound from '../components/404'
import * as funcUtils from "./../assets/js/utils/funcUtils";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  hashbang: false,
  routes: [
    {
      path: '/',
      name: 'Authorization',
      component: Authorization
    },
    {
      path: '/monitorViewData',
      name: 'MonitorViewData',
      component: MonitorViewData,
      props: true
    },
    {
      path: '/alarmViewData',
      name: 'AlarmViewData',
      component: AlarmViewData,
      props: true
    },
    {
      path: '/monitorReestr',
      name: 'MonitorReestr',
      component: MonitorReestr
    },
    {
      path: '/monitorEdit',
      name: 'MonitorEdit',
      component: MonitorEdit
    },
    {
      path: '/alarmRuleReestr',
      name: 'AlarmRuleReestr',
      component: AlarmRuleReestr
    },
    {
      path: '/alarmRuleEdit',
      name: 'AlarmRuleEdit',
      component: AlarmRuleEdit
    },
    {
      path: '/404',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  let path = funcUtils.getFromSessionStorage('path');
  let currentPage = funcUtils.getCurrentPage(path);
  if (funcUtils.isNull(to) || funcUtils.isNull(to.name)) {
    next('/404');
  } else if (funcUtils.isNull(currentPage)) {
      if (funcUtils.isNull(sessionStorage.getItem('wid'))) {
        next();
      } else {
        next('/');
      }
  } else if (to.name === 'Authorization' && currentPage.routeName === 'Authorization') {
      next();
  } else if (funcUtils.getfromLocalStorage('auth') && currentPage.routeName === to.name) {
      next();
  } else {
      next({name: currentPage.routeName});
  }
});

export default router;
