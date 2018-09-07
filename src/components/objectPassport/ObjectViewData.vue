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
            <el-button size="mini" class="dc-button-icon-medium" title="Вернуться на предыдущий экран">
              <img src="../../assets/img/icon-back-blue.svg" alt="">
            </el-button>
            <h1>Паспорт объекта</h1>
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
          :row-height="10"
          :is-draggable="true"
          :is-resizable="true"
          :is-mirrored="false"
          :vertical-compact="false"
          :margin="[5, 5]"
          :use-css-transforms="true">

          <!--Тайл "Основные сведения" -->
          <grid-item class="dc-widget-grid__item bg-transparent"
                     :x="gridTilesLayout[0].x"
                     :y="gridTilesLayout[0].y"
                     :w="gridTilesLayout[0].w"
                     :h="gridTilesLayout[0].h"
                     :i="gridTilesLayout[0].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <object-passport-tile-description
              :title="gridTilesLayout[0].i"></object-passport-tile-description>
          </grid-item>
          <!--/Тайл "Основные сведения" -->

          <!--Тайл "На карте" -->
          <grid-item class="dc-widget-grid__item"
                     @moved="tileMoveEvent"
                     :x="gridTilesLayout[1].x"
                     :y="gridTilesLayout[1].y"
                     :w="gridTilesLayout[1].w"
                     :h="gridTilesLayout[1].h"
                     :i="gridTilesLayout[1].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <object-passport-map :title="gridTilesLayout[1].i"></object-passport-map>
          </grid-item>
          <!--/Тайл "На карте" -->

          <!--Тайл "Алерты на объекте" -->
          <grid-item class="dc-widget-grid__item"
                     @moved="tileMoveEvent"
                     :x="gridTilesLayout[2].x"
                     :y="gridTilesLayout[2].y"
                     :w="gridTilesLayout[2].w"
                     :h="gridTilesLayout[2].h"
                     :i="gridTilesLayout[2].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <object-passport-tile-alerts-list ref="objectPassportAlerts"
              :title="gridTilesLayout[2].i"></object-passport-tile-alerts-list>
          </grid-item>
          <!--/Тайл "Алерты на объекте" -->

          <!--Тайл "График метрики" -->
          <grid-item class="dc-widget-grid__item"
                     @moved="tileMoveEvent"
                     :x="gridTilesLayout[3].x"
                     :y="gridTilesLayout[3].y"
                     :w="gridTilesLayout[3].w"
                     :h="gridTilesLayout[3].h"
                     :i="gridTilesLayout[3].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <object-passport-tile-line-chart
              :title="gridTilesLayout[3].i"></object-passport-tile-line-chart>
          </grid-item>
          <!--/Тайл "График метрики" -->

          <!--Тайл "Стики"-->
          <grid-item class="dc-widget-grid__item"
                     :x="gridTilesLayout[4].x"
                     :y="gridTilesLayout[4].y"
                     :w="gridTilesLayout[4].w"
                     :h="gridTilesLayout[4].h"
                     :i="gridTilesLayout[4].i"
                     drag-allow-from=".dc-widget-grid__item__header">
            <object-passport-tile-sticks :title="gridTilesLayout[4].i">
            </object-passport-tile-sticks>
          </grid-item>
          <!--/Тайл "Стики"-->
        </grid-layout>
      </el-main>
      <!--/Область контента-->
    </el-container>
  </el-container>
</template>

<script>
  import * as VueGridLayout from "vue-grid-layout" // https://github.com/jbaysolutions/vue-grid-layout

  import ObjectPassportTileDescription from "./ObjectPassportTileDescription.vue"
  import ObjectPassportMap from "./ObjectPassportTileMap.vue"
  import ObjectPassportTileAlertsList from "./ObjectPassportTileAlertsList.vue"
  import ObjectPassportTileLineChart from "./ObjectPassportTileLineChart.vue"
  import ObjectPassportTileSticks from "./ObjectPassportTileSticks.vue"
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";
  import PageAside from "../SharedWidgets/PageAside";
  import {bus} from "../../assets/js/utils/bus";

  export default {
    components: {
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
      ObjectPassportTileDescription,
      ObjectPassportMap,
      ObjectPassportTileAlertsList,
      ObjectPassportTileLineChart,
      ObjectPassportTileSticks,
      PageAside,
    },
    name: "object-passport-layout",
    computed: {
      objectViewData: function () {
        return this.$store.state.objectViewData.data
      }
    },
    beforeCreate: function () {
      let wid = sessionStorage.getItem('wid');
      let componentsRoute = funcUtils.getFromSessionStorage(wid);
      let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
      this.$store.dispatch('objectViewDataSetCid', currentComponent.cid);
      let method = 'getData';
      let params = this.$route.params;
      if (!funcUtils.isNotEmpty(params.objId) && !funcUtils.isNotEmpty(params.objType) && !funcUtils.isNotEmpty(params.dateBeg)) {
        method = 'restore';
        params = null;
      }
      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.objectViewData.bean, method);
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
    mounted: function () {
      let vm = this;
      this.$store.watch(this.$store.getters.objectViewDataGetCommand, state => {
        vm.updateOnCommand(state);
      });
      bus.$on('refresh', function () {
        vm.refresh();
      });
    },
    data() {
      return {
        // Список тайлов виджетов для грида макета
        gridTilesLayout: [
          {i: 'Основные сведения', x: 0, y: 0, w: 4, h: 25},
          {i: 'На карте', x: 0, y: 30, w: 4, h: 38},
          {i: 'Алерты на объекте', x: 4, y: 0, w: 6, h: 63},
          {i: 'График метрики', x: 10, y: 0, w: 14, h: 40},
          {i: 'Стики', x: 10, y: 40, w: 14, h: 30}
        ],
        isMainMenuCollapsed: true,
        headerSwitch: false
      };
    },
    methods: {
      updateOnCommand: function () {
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.objectViewData.bean, 'restore');
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
      refresh: function () {
        let alerts = this.$refs.objectPassportAlerts;
        let wid = sessionStorage.getItem('wid');
        let componentsRoute = funcUtils.getFromSessionStorage(wid);
        let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
        let methodName;
        let requestBody;
        if (alerts.selectedAlarms.length > 0) {
          alerts.selectedAlarms = [];
          methodName = 'selectAlarms';
          requestBody = {ids: alerts.selectedAlarms};
        }
        if (methodName && requestBody) {
          let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.objectViewData.bean, methodName);
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
          funcUtils.getPrevPage(this.$router, this.$store.state.monitorViewData.routeName);
        });
      },
      toggleMainMenu() {
        this.isMainMenuCollapsed = !this.isMainMenuCollapsed;
      },
      tileMoveEvent: function(i, newX, newY){
        console.log("MOVE i=" + i + ", X=" + newX + ", Y=" + newY);
      }
    },
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

        .dc-button-icon-small:last-child {
          margin-left: 0;
          margin-top: 5px;
        }
      }
    }

  }

  .bg-transparent .dc-widget-grid__item__header__buttons {
    background: #28282e !important;
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

  .dc-inner-tile-box {
    $bg-offset: 10px;
    padding: 15px;
    margin-bottom: 5px;
    background: no-repeat calc(100% - #{$bg-offset}) $bg-offset;
    border-radius: 5px;

    &:last-child {
      margin-bottom: 0;
    }

    &.dc-inner-tile-box--medium-gray {
      background-color: rgba(40, 40, 46, 0.6);

    }

    &.dc-inner-tile-box--dark-gray {
      background-color: rgba(40, 40, 46, 0.45);
    }

    &.dc-inner-tile-box--is-working {
      background-image: url("../../assets/img/icon-play-gray-bg.svg");
      background-size: 64px;
    }
  }


</style>
