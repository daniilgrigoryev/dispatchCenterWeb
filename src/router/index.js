import Vue from 'vue'
import Router from 'vue-router'
import Authorization from './../components/Authorization'
import MonitorViewData from '../components/MonitorViewData'
import MonitorDict from '../components/MonitorDict'
import Test from '../components/Test'
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
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/monitorDict',
      name: 'MonitorDict',
      component: MonitorDict
    },
    {
      path: '/404',
      name: 'PageNotFound',
      component: PageNotFound
    }
  ]
});

router.beforeEach((to, from, next) => {
  let path = JSON.parse(sessionStorage.getItem('path'));
  let currentPage = funcUtils.getCurrentPage(path);
  if (null === to.name) {
    next('/404');
  } else if (null === currentPage) {
    next('/');
  } else if (to.name === 'Authorization' && currentPage.srcPath === 'Authorization') {
    next();
  } else if (localStorage.getItem('auth') === 'true' && currentPage.srcPath === to.name) {
    next();
  } else {
    next({name: currentPage.srcPath});
  }
});

export default router;
