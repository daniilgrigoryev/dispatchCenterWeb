import Vue from 'vue'
import Router from 'vue-router'
import Authorization from './../components/Authorization'
import MonitorDict from '../components/MonitorDict'
import MonitorViewData from '../components/metricaPassport/MonitorViewData'
import AlarmViewData from '../components/alarmPassport/AlarmViewData'
import ObjectViewData from '../components/objectPassport/ObjectViewData'
import MonitorReestr from '../components/reestrPassport/MonitorReestr'
import MonitorEdit from '../components/editPassport/MonitorEdit'
import SearchView from '../components/SearchView'
import AlarmRuleReestr from '../components/reestrPassport/AlarmRuleReestr'
import AlarmReestr from '../components/reestrPassport/AlarmReestr'
import CameraReestr from '../components/reestrPassport/CameraReestr'
import MapReestr from '../components/reestrPassport/MapReestr'
import AlarmRuleEdit from '../components/editPassport/AlarmRuleEdit'
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
      path: '/monitorDict',
      name: 'MonitorDict',
      component: MonitorDict
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
      path: '/objectViewData',
      name: 'ObjectViewData',
      component: ObjectViewData,
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
      path: '/alarmReestr',
      name: 'AlarmReestr',
      component: AlarmReestr
    },
    {
      path: '/cameraReestr',
      name: 'CameraReestr',
      component: CameraReestr
    },
    {
      path: '/mapReestr',
      name: 'MapReestr',
      component: MapReestr
    },
    {
      path: '/alarmRuleEdit',
      name: 'AlarmRuleEdit',
      component: AlarmRuleEdit
    },
    {
      path: '/searchView',
      name: 'SearchView',
      component: SearchView
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
