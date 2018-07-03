<template>
  <div>
    <h1>Список мониторов</h1>
    <input type="date" v-model="dateBeg"/>
    <input type="date" v-model="dateEnd"/>
    <ul>
      <li v-for="monitor in monitors" class="mt24">
        <el-button v-on:click="getNext(monitor.id)" round type="primary">{{ monitor.name }}</el-button>
      </li>
    </ul>
  </div>
</template>

<script>
  import * as ConstantUtils from './../assets/js/utils/constantUtils';
  import * as RequestEntity from './../assets/js/api/requestEntity';
  import {RequstApi} from './../assets/js/api/requestApi';
  import * as funcUtils from "./../assets/js/utils/funcUtils";

  export default {
    name: "MonitorDict",
    beforeCreate: function () {
      let wid = sessionStorage.getItem('wid');
      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, null, this.$store.state.monitorDict.bean, 'getMonitorDict');
      let requestParam = new RequestEntity.RequestParam(requestHead, null);
      let eventResponse = RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_HTTP, requestParam);
      // debugger;
      if (eventResponse.status === 200) {
        this.$store.dispatch('fillModule', {'selfStore': this.$store, 'event': eventResponse});
      }
    },
    data() {
      return {
        monitors: this.$store.state.monitorDict.data,
        dateBeg: new Date(),
        dateEnd: new Date()
      }
    },
    methods: {
      getNext: function (ruleId) {
        let params = {
          'ruleId': ruleId,
          'dateBeg': null,
          'dateEnd': null
        };
        if (this.dateBeg !== null) {
          params.dateBeg = new Date(this.dateBeg).getTime();
        } else {
          alert("Начальный период необходимо заполнить!");
          return;
        }
        if (this.dateEnd !== null) {
          params.dateEnd = new Date(this.dateEnd).getTime();
        }
        funcUtils.getNextComponent(this.$store.state.monitorViewData.bean);
        this.$router.push({name: 'MonitorViewData', params});
      }
    }
  }
</script>

<style scoped>

</style>
