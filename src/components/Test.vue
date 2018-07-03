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
      if (currentComponent === null) {
        currentComponent = funcUtils.getNextComponent(this.$store.state.monitorViewData.bean);
      }
      /*if (undefined !== props || null !== props) {

      } else {

      }*/
    },
    methods: {
      logout: function () {
        this.$root.logout();
      },
      getPrev: function () {
        funcUtils.getPrevComponent();
        this.$router.push('/monitorViewData');
      }
    }
  }
</script>

<style scoped>

</style>
