<template>
  <div>
    <h1>Список мониторов</h1>
    <el-date-picker v-model="dateBeg" format="dd.MM.yyyy" type="date" placeholder="Pick a start">
    </el-date-picker>
    <el-date-picker v-model="dateEnd" format="dd.MM.yyyy" type="date" placeholder="Pick a end">
    </el-date-picker>
    <ul>
      <li v-for="monitor in monitors" class="mt24">
        <el-button v-on:click="getNext(monitor.id)" round type="primary">{{ monitor.name }}</el-button>
      </li>
    </ul>
  </div>
</template>

<script>
  import * as RequestEntity from './../assets/js/api/requestEntity';
  import {RequstApi} from './../assets/js/api/requestApi';
  import * as funcUtils from "./../assets/js/utils/funcUtils";
  import * as VueGridLayout from "vue-grid-layout" // https://github.com/jbaysolutions/vue-grid-layout

  export default {
    name: "MonitorDict",
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
    },
    beforeCreate: function () {
      let wid = sessionStorage.getItem('wid');
      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, null, this.$store.state.monitorDict.bean, 'getMonitorDict');
      let requestParam = new RequestEntity.RequestParam(requestHead, null);
      RequstApi.sendHttpRequest(requestParam)
        .then(eventResponse => {
          if (eventResponse.status === 200) {
            this.$store.dispatch('fillModule', {'selfStore': this.$store, 'event': eventResponse});
          }
        })
        .catch(eventResponse => {
          alert(eventResponse.message);
        });
    },
    data() {
      return {
        dateBeg: null,
        dateEnd: null
      }
    },
    computed: {
      monitors: function() {
        return this.$store.state.monitorDict.data
      }
    },
    methods: {
      getNext: function (ruleId) {
        let params = {
          'ruleId': ruleId,
          'dateBeg': this.dateBeg,
          'dateEnd': this.dateEnd
        };
        if (funcUtils.isNull(this.dateBeg)) {
          alert("Начальный период необходимо заполнить!");
          return;
        }
        funcUtils.getNextComponent(this.$store.state.monitorViewData.bean, () => {
          funcUtils.getNextPage(this.$router, this.$store.state.monitorViewData.routeName, params);
        });
      }
    }
  }
</script>

<style lang="scss">
</style>
