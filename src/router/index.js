import Vue from 'vue'
import Router from 'vue-router'
import Authorization from './../components/Authorization'
import MonitorViewData from '../components/MonitorViewData'
import MonitorDict from '../components/MonitorDict'
import Test from '../components/Test'
import PageNotFound from '../components/404'

Vue.use(Router);

const router = new Router({
  mode: 'history',
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
  if (to.name === null) {
    next('/404');
  } else if (to.name === 'Authorization') {
    next();
  } else if (localStorage.getItem('auth') === 'true') {
    next();
  } else {
    next('/');
  }
});

export default router;
