<template>
  <div style="height: 100%;">
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
        <div class="dc-widget-item__caption">за выбранный период</div>
      </div>

      <el-input
        size="mini"
        clearable
        v-model="searchKey"
        placeholder="Для поиска напишите известную информацию об объекте"
        class="dc-widget-grid__item__header__search">
      </el-input>

      <button type="button" class="searchButton" @click="filterKeyChange"><i class="el-icon-search"></i></button>

      <div class="dc-widget-grid__item__header__right-column">
        <div class="dc-widget-grid__item__header__buttons">
          <el-tooltip class="item" effect="dark" content="Раскрыть на весь экран" placement="bottom">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-zoomin-small-white.svg" alt="">
            </el-button>
          </el-tooltip>

          <el-tooltip class="item" effect="dark" content="Меню операций" placement="bottom">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-burger-small-white.svg" alt="">
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!--/Хедер тайла-->

    <!--Таблица объектов метрики-->
    <div style="overflow-y: auto; overflow-x: hidden; height: 375px;">
      <float-thead-table :scrollContainer="scrollContainer" autoReflow :top="36" class="dc-widget-grid__item__table-list">
        <thead>
          <tr>
            <th style="width: 55px;">
              <label for="allChecked">
                <input id="allChecked" v-model="allChecked" :disabled="objectsLength > 4 && !allChecked"
                       v-on:click="selectAllCheckBox" type="checkbox"/>
              </label>
            </th>
            <th>Имя</th>
            <th>Описание</th>
            <th>Алертов</th>
            <th style="width: 150px">Первый</th>
            <th style="width: 150px">Последний</th>
            <th style="width: 150px">Прошло</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in tableMetricaObjects">
            <td style="width: 55px;">
              <label>
                <input v-model="item.selected" :disabled="!item.selected && selectedObjects.length >= 3"
                       v-on:click="selectCheckBox(item)" type="checkbox"/>
              </label>
            </td>
            <td>{{item.object.name}}</td>
            <td>{{item.object.note}}</td>
            <td>{{item.object.alarms}}</td>
            <td style="width: 150px">{{item.firstAlarm}}</td>
            <td style="width: 150px">{{item.lastAlarm}}</td>
            <td style="width: 150px">{{item.differenceAlarm}} сек</td>
          </tr>
        </tbody>
      </float-thead-table>
    </div>
    <!--/Таблица объектов метрики-->
  </div>
</template>

<script>
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";
  import FloatThead from 'vue-floatthead';
  import Vue from 'vue'

  Vue.use(FloatThead);

  export default {
    name: "metrica-passport-table",
    props: {
      title: {
        type: String
      }
    },
    components: {
      FloatThead
    },
    data() {
      return {
        allChecked: false,
        selectedObjects: [],
        objectsLength: 0,
        searchKey: ''
      }
    },
    computed: {
      tableMetricaObjects: function () {
        let tableMetricaData = this.getTableMetricaData();
        let res;
        if (tableMetricaData) {
          res = tableMetricaData;
        }
        return res;
      }
    },
    methods: {
      scrollContainer(table) {
        return table.parent();
      },
      filterKeyChange() {
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.monitorViewData.bean, 'filterObjects');
        let requestParam = new RequestEntity.RequestParam(requestHead, {filter: this.searchKey});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              this.$store.dispatch('fillModule', {'event': eventResponse});
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      },
      selectCheckBox(item) {
        let self = this;
        if (item.selected) {
          item.selected = false;
          let index = this.selectedObjects.indexOf(item.object.id);
          if (index !== -1) {
            this.selectedObjects.splice(index, 1);
          }
        } else {
          item.selected = true;
          this.selectedObjects.push(item.object.id);
        }
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.monitorViewData.bean, 'selectObjects');
        let requestParam = new RequestEntity.RequestParam(requestHead, {ids: this.selectedObjects});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              self.$store.dispatch('fillModule', {'selfStore': self.$store, 'event': eventResponse});
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      },
      selectAllCheckBox() {
        let self = this;
        this.selectedObjects = [];
        let allChecked = this.allChecked;
        let objects = this.tableMetricaObjects;
        if (!allChecked) {
          objects.forEach((obj) => {
            obj.selected = true;
            self.selectedObjects.push(obj.id);
          })
        } else {
          objects.forEach((obj) => {
            obj.selected = false;
          })
        }
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.monitorViewData.bean, 'selectObjects');
        let requestParam = new RequestEntity.RequestParam(requestHead, {ids: this.selectedObjects});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              self.$store.dispatch('fillModule', {'selfStore': self.$store, 'event': eventResponse});
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      },
      getTableMetricaData: function () {
        let res = null;
        let data = this.$store.state.monitorViewData.data;
        if (data) {
          let formatDate = function (date) {
            let now = date;
            let year = "" + now.getFullYear();
            let month = "" + (now.getMonth() + 1);
            if (month.length === 1) {
              month = "0" + month;
            }
            let day = "" + now.getDate();
            if (day.length === 1) {
              day = "0" + day;
            }
            let hour = "" + now.getHours();
            if (hour.length === 1) {
              hour = "0" + hour;
            }
            let minute = "" + now.getMinutes();
            if (minute.length === 1) {
              minute = "0" + minute;
            }
            let second = "" + now.getSeconds();
            if (second.length === 1) {
              second = "0" + second;
            }
            return day + "." + month + "." + year + " " + hour + ":" + minute + ":" + second;
          };
          res = [];
          let objects = data.objects;
          this.objectsLength = objects.length;
          this.searchKey = data.filter || '';
          let selectedObjects = data.selectObj;
          this.selectedObjects = selectedObjects;
          this.allChecked = selectedObjects.length > 0;
          for (let i = 0; i < objects.length; i++) {
            let object = {
              selected: selectedObjects.includes(objects[i].id),
              id: objects[i].id,
              firstAlarm: !funcUtils.isNull(objects[i].firstAlarm) ? formatDate(new Date(objects[i].firstAlarm)) : '',
              lastAlarm: !funcUtils.isNull(objects[i].lastAlarm) ? formatDate(new Date(objects[i].lastAlarm)) : '',
              differenceAlarm: !funcUtils.isNull(objects[i].firstAlarm) && !funcUtils.isNull(objects[i].lastAlarm) ? (objects[i].lastAlarm - objects[i].firstAlarm) / 1000 : '',
              object: objects[i]
            };
            res.push(object);
          }
        }
        return res;
      },
    }
  }
</script>

<style lang="scss">
  .dc-widget-grid__item__table-list {
    text-transform: uppercase !important;
    width: 100%;

    thead {
      background: #050511;

      th {
        text-align: center;
        color: #888b89;
      }

    }

    tbody {
      tr {
        border-bottom: 1px solid #353b4a;

        td {
          text-align: center;
          padding: 3px 0;
          color: #9b9b9c;
        }
      }
    }
  }

  .searchButton {
    color: #fff;
    background-color: #20a0ff;
    border-color: #20a0ff;
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 6px 10px;
    font-size: 14px;
    border-radius: 4px;
  }
</style>
