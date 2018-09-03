<template>
  <el-container class="dc-page-container">
    <!--Главное меню-->
    <page-aside></page-aside>
    <!--/Главное меню-->
    <el-container>
      <!--Хедер экрана-->
      <el-header height="30" class="dc-page-header">
        <el-row type="flex" class="row-bg" justify="space-between">
          <el-col
            :span="12"
            class="flex-parent flex-parent--center-cross">
            <h1>Проезды и нарушения</h1>
            <div class="dc-widget-item__caption" style="margin-left: 10px;">год 6 мес. 24 дня 6ч 11м</div>
          </el-col>
          <el-col :span="4" class="flex-parent flex-parent--end-main flex-parent--center-cross">
            <el-switch
              v-model="headerSwitch"
              active-color="#13ce66"
              inactive-color="#ff4949"
              class="dc-page-header__switch"
              style="margin-right: 10px;"
              title="Уведомления">
            </el-switch>


            <el-button @click="refresh" size="mini" class="dc-button-icon-medium" title="Действие">
              <img src="../../assets/img/icon-reload-white.svg" alt="">
            </el-button>

            <el-button size="mini" class="dc-button-icon-medium" title="Действие">
              <img src="../../assets/img/icon-alarmclock-white.svg" alt="">
            </el-button>

            <el-popover
              placement="bottom"
              title="Title"
              width="200"
              trigger="click"
              content="this is content, this is content, this is content">
              <p>Are you sure to delete this?</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="visible2 = false">cancel</el-button>
                <el-button type="primary" size="mini" @click="visible2 = false">confirm</el-button>
              </div>
              <el-button slot="reference" size="mini" class="dc-button-icon-medium" title="Действие">
                <img src="../../assets/img/icon-burger-large-white.svg" alt="">
              </el-button>
            </el-popover>
          </el-col>
        </el-row>
      </el-header>
      <!--/Хедер экрана-->

      <!--Область контента-->
      <el-main class="dc-page-content">
        <grid-layout
          class="dc-widget-grid"
          :layout="gridTilesLayout"
          :col-num="24"
          :row-height="100"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="true"
          :margin="[5, 5]"
          :use-css-transforms="true">

          <!--Тайл "Типы и уровни"-->
          <grid-item class="dc-widget-grid__item"
                     :x="gridTilesLayout[0].x"
                     :y="gridTilesLayout[0].y"
                     :w="gridTilesLayout[0].w"
                     :h="gridTilesLayout[0].h"
                     :i="gridTilesLayout[0].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <metrica-passport-tile-pie-chart :title="gridTilesLayout[0].i" ref="metricaPassportPieChart">
            </metrica-passport-tile-pie-chart>
          </grid-item>
          <!--/Тайл "Типы и уровни"-->

          <!--Тайл "Список алертов"-->
          <grid-item class="dc-widget-grid__item"
                     style="overflow: hidden;"
                     :x="gridTilesLayout[1].x"
                     :y="gridTilesLayout[1].y"
                     :w="gridTilesLayout[1].w"
                     :h="gridTilesLayout[1].h"
                     :i="gridTilesLayout[1].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <metrica-pie-chart-alerts-list :title="gridTilesLayout[1].i" ref="metricaPassportAlerts">
            </metrica-pie-chart-alerts-list>
          </grid-item>
          <!--/Тайл "Список алертов"-->

          <!--Тайл "Стики"-->
          <grid-item class="dc-widget-grid__item"
                     :x="gridTilesLayout[2].x"
                     :y="gridTilesLayout[2].y"
                     :w="gridTilesLayout[2].w"
                     :h="gridTilesLayout[2].h"
                     :i="gridTilesLayout[2].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <metrica-passport-tile-sticks :title="gridTilesLayout[2].i">
            </metrica-passport-tile-sticks>
          </grid-item>
          <!--/Тайл "Стики"-->

          <!--Тайл "График показателей по времени"-->
          <grid-item class="dc-widget-grid__item"
                     :x="gridTilesLayout[3].x"
                     :y="gridTilesLayout[3].y"
                     :w="gridTilesLayout[3].w"
                     :h="gridTilesLayout[3].h"
                     :i="gridTilesLayout[3].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <metrica-passport-tile-line-chart :title="gridTilesLayout[3].i" ref="metricaPassportLineChart">
            </metrica-passport-tile-line-chart>
          </grid-item>
          <!--/Тайл "График показателей по времени"-->

          <!--Тайл "Таблица-список объектов"-->
          <grid-item class="dc-widget-grid__item"
                     :x="gridTilesLayout[4].x"
                     :y="gridTilesLayout[4].y"
                     :w="gridTilesLayout[4].w"
                     :h="gridTilesLayout[4].h"
                     :i="gridTilesLayout[4].i"
                     drag-allow-from=".dc-widget-grid__item__header"
                     drag-ignore-from="input">
            <metrica-passport-table :title="gridTilesLayout[4].i" ref="metricaPassportTable">
            </metrica-passport-table>
          </grid-item>
          <!--/Тайл "Таблица-список объектов"-->
        </grid-layout>
      </el-main>
      <!--/Область контента-->
    </el-container>
  </el-container>
</template>


<script>
  // TODO: импортируем компоненты сюда...
  import * as VueGridLayout from "vue-grid-layout" // https://github.com/jbaysolutions/vue-grid-layout

  import MetricaPassportTilePieChart from "./MetricaPassportTilePieChart"
  import MetricaPieChartAlertsList from "./MetricaPassportTileAlertsList"
  import MetricaPassportTileSticks from "./MetricaPassportTileSticks"
  import MetricaPassportTileLineChart from "./MetricaPassportTileLineChart"
  import MetricaPassportTable from "./MetricaPassportTileTable"
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";
  import PageAside from "../SharedWidgets/PageAside";

  export default {
    // TODO: ...и сюда
    components: {
      PageAside,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      MetricaPassportTilePieChart,
      MetricaPieChartAlertsList,
      MetricaPassportTileSticks,
      MetricaPassportTileLineChart,
      MetricaPassportTable,
    },
    computed: {
      monitorViewData: function () {
        return this.$store.state.monitorViewData.data
      }
    },
    beforeCreate: function () {
      let wid = sessionStorage.getItem('wid');
      let componentsRoute = funcUtils.getFromSessionStorage(wid);
      let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
      this.$store.dispatch('monitorViewDataSetCid', currentComponent.cid);
      let method = 'getData';
      let params = this.$route.params;
      if (!funcUtils.isNotEmpty(params.ruleId) && !funcUtils.isNotEmpty(params.dateBeg)) {
        method = 'restore';
        params = null;
      }
      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.monitorViewData.bean, method);
      let requestParam = new RequestEntity.RequestParam(requestHead, params);
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
    data() {
      return {
        // Список тайлов виджетов для грида макета
        gridTilesLayout: [
          {i: 'Типы и уровни', x: 0, y: 0, w: 7, h: 4},
          {i: 'Список алертов', x: 0, y: 3, w: 7, h: 4},
          {i: 'Стики', x: 7, y: 0, w: 17, h: 3.2},
          {i: 'График показателей', x: 7, y: 0, w: 17, h: 4},
          {i: 'Список объектов', x: 7, y: 5, w: 17, h: 4}
        ],
        headerSwitch: false
      };
    },
    mounted: function () {
      let self = this;
      this.$store.watch(this.$store.getters.monitorViewDataGetCommand, state => {
        self.updateOnCommand(state);
      })
    },
    methods: {
      updateOnCommand: function () {
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.monitorViewData.bean, 'restore');
        let requestParam = new RequestEntity.RequestParam(requestHead, null);
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
      refresh: function (resp) {
        let alerts = this.$refs.metricaPassportAlerts;
        let table = this.$refs.metricaPassportTable;
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let methodName;
        let requestBody;
        if (table.selectedObjects.length > 0) {
          table.selectedObjects = [];
          methodName = 'selectObjects';
          requestBody = {ids: table.selectedObjects};
        } else if (alerts.selectedAlarms.length > 0) {
          alerts.selectedAlarms = [];
          methodName = 'selectAlarms';
          requestBody = {ids: alerts.selectedAlarms};
        }
        if (methodName && requestBody) {
          let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.monitorViewData.bean, methodName);
          let requestParam = new RequestEntity.RequestParam(requestHead, requestBody);
          RequstApi.sendHttpRequest(requestParam)
            .then(eventResponse => {
              if (eventResponse.status === 200) {
                this.$store.dispatch('fillModule', {'event': eventResponse});
              }
            })
            .catch(eventResponse => {
              alert(eventResponse.message);
            });
        }
      },
      getPrev: function () {
        funcUtils.getPrevComponent(() => {
          funcUtils.getPrevPage(this.$router, this.$store.state.monitorDict.routeName);
        });
      }
    }
  }
</script>

<style lang="scss">
  $-dc-main-aside--collapsed-width: 72px;
  $-dc-color-bg-1: rgba(40, 40, 46, 0.65);

  .dc-widget-item__caption {
    display: flex;
    align-items: center;
    color: #7e8c91;
    font-size: 12px;
    line-height: 0.8;

    .dc-widget-item__caption__value--1 {
      margin: 0 4px;
      color: #9560e0;
      font-weight: 600;
    }

    .dc-widget-item__caption__value--2 {
      margin: 0 4px;
      color: white;
      font-weight: 500;
      font-size: 14px;
      letter-spacing: -0.5px;
    }
  }

  .dc-widget-grid__item__header__search {
    width: 40%;
    margin-left: 30px;
    background: transparent;

    input {
      background: rgba(126, 140, 145, 0.12);
      border: none;
    }
  }

  /* Тайл грида */
  .dc-widget-grid__item {
    background: $-dc-color-bg-1;
    border-radius: 4px;

    .dc-widget-grid__item__header {
      display: flex;
      align-items: flex-start;
      padding: 4px;
      font-weight: 300;
      transition: background-color 200ms linear 80ms;

      &:hover {
        background-color: rgba(39, 40, 45, 0.65);
      }
    }

    .dc-widget-grid__item__footer {
      $offset: 8px;
      position: absolute;
      bottom: $offset;
      left: $offset;
      right: $offset;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      text-align: center;
      background: $-dc-color-bg-1;
      border-radius: 4px;
    }

    .dc-widget-grid__item__header__right-column {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .dc-widget-grid__item__header__buttons {
      display: flex;
      margin-left: 10px;
      background: #050511;
      padding: 5px;
      border-radius: 4px;

      &.dc-widget-grid__item__header__buttons--vertical {
        flex-direction: column;
        align-items: center;
        background: #28282e;

        .dc-button-icon-small:last-child  {
          margin-left: 0;
          margin-top: 5px;
        }
      }
    }

  }

  .dc-page-container {
    height: 100vh;
    background: #000;
  }

  .dc-page-content {
    padding: 0;
    overflow: hidden;
  }

  .dc-main-aside {
    background: $-dc-color-bg-1;
    transition-delay: 150ms;

    .el-menu-item [class^="el-icon-"] {
      font-size: 24px !important;
    }

    &.dc-main-aside--collapsed {
      width: $-dc-main-aside--collapsed-width !important;

      .el-tooltip, .el-submenu__title {
        padding: 0 25px !important;
      }
    }

    .dc-main-aside__logo {
      height: 64px;
      background: #7e8c91 url("../../assets/img/logo-menu.svg") no-repeat center;
      background-size: 42px;
    }

    .dc-main-aside__user {
      display: flex;
      flex-direction: column;
      padding: 8px;
      align-items: center;
      height: 80px;
      margin-top: auto;
      background: #7e8c91;
      background-size: 28px;
      text-align: center;
      color: white;
      font-size: 15px;
      line-height: 1.1;

      img {
        display: block;
        margin: auto;
      }
    }

    .el-menu {
      border-right: none;
    }

    .el-menu--collapse {
      width: $-dc-main-aside--collapsed-width !important;
    }

    .el-menu-item, .el-menu-item,
    .el-submenu__title, .el-submenu__title {
      color: #7e8c91;
      font-size: 16px;
    }

    .el-menu-item:hover, .el-menu-item:focus,
    .el-submenu__title:hover, .el-submenu__title:focus {
      background-color: rgba(144, 144, 144, 0.22);
    }

    .el-menu-item.is-active, .el-menu-item.is-active {
      background-color: rgba(255, 255, 255, 0.12);
      color: white;
    }

    .el-menu-item-group__title {
      padding: 7px 0 7px 20px;
      line-height: normal;
      font-size: 12px;
      color: #909399;
      background: rgba(148, 148, 148, 0.15);
    }
  }

  .dc-page-header {
    padding: 0 5px 0 10px;
  }

  .dc-page-header__switch {

    .el-switch__label {
      line-height: 1;
    }

    .el-switch__core {
      width: 25px !important;
      height: 10px !important;
    }

    .el-switch__core:after {
      width: 11px;
      height: 11px !important;
      top: -1px;
      margin-left: -3px;
    }

    &.is-checked .el-switch__core::after {
      margin-left: -10px !important;
    }

  }

  .dc-button-icon-medium {
    /*width: 40px !important;*/
    margin-left: 0 !important;
    padding: 7px 10px;
    border: none;
    background: none !important;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }

    span {
      display: block;
      width: 18px;
      height: 18px;
    }

    img {
      display: block;
      width: inherit;
      height: inherit;
    }
  }

  .dc-button-icon-small {
    $size: 14px;

    padding: 0;
    border: none;
    background: none !important;
    opacity: 0.8;

    &:hover {
      opacity: 1;
    }

    span {
      display: inline-block;
      width: $size;
      height: $size;
    }

    img {
      display: inline-block;
      width: inherit;
      height: inherit;
    }
  }


</style>
