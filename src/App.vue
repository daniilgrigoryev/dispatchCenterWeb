<template>
  <div id="app">
    <Indicator/>
    <router-view></router-view>
  </div>
</template>

<script>
  import Indicator from './components/Indicator.vue';

  export default {
    name: 'app',
    components: { Indicator }
  }
</script>

<style>
  body {
    /*font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;*/
    font-family: 'Source Sans Pro', sans-serif;
    /*background: linear-gradient(135deg, rgba(22,32,48,1) 0%,rgba(22,32,48,1) 100%);*/
    /*background: #1c2733;*/
    /*background: #252a30;*/
    background: linear-gradient(to top, #1d1e24, #2a333c);
    min-height: 100vh;
    color: #64b2e4;
  }
</style>
