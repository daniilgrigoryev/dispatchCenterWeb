<template>
  <div>
    <button v-on:click="logout">Logout</button>
    <button v-on:click="getPrev">Prev</button>
  </div>
</template>

<script>
  import * as funcUtils from "./../assets/js/utils/funcUtils";

  export default {
    name: "Test",
    data() {
      return {}
    },
    beforeCreate: function () {
      // debugger;
      let currentComponent;
      let componentsRoute = JSON.parse(sessionStorage.getItem(sessionStorage.getItem('wid')));
      currentComponent = funcUtils.getCurrentComponent(componentsRoute);
      /*if (undefined !== props || null !== props) {

      } else {

      }*/
    },
    methods: {
      logout: function () {
        this.$root.logout();
      },
      getPrev: function () {
        funcUtils.getPrevComponent(() => {
          funcUtils.getPrevPage(this.$router, 'MonitorViewData');
        });
      }
    }
  }
</script>

<style scoped>

</style>
