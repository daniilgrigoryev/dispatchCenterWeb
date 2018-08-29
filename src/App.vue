<template>
  <div id="app">
    <Indicator/>
    <router-view></router-view>
  </div>
</template>

<script>
  import Indicator from './components/SharedWidgets/Indicator.vue';

  export default {
    name: 'app',
    components: { Indicator }
  }
</script>

<style lang="scss">
  body {
    /*background: #050511;*/
    background: #28282e;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
    font-family: DINPro, Helvetica Neue, Helvetica, sans-serif;
    color: #656b7b;
    overflow: hidden;
  }

  .data-empty {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #888;
    font-size: 14px;
  }
</style>
