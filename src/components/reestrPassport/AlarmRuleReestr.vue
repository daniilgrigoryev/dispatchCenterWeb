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
            <h1>Список правил тревоги</h1>
            <!--<div class="dc-widget-item__caption" style="margin-left: 10px;">год 6 мес. 24 дня 6ч 11м</div>-->
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


            <el-button size="mini" class="dc-button-icon-medium" title="Действие">
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
        <!--<el-date-picker v-model="dateBeg" format="dd.MM.yyyy" type="date" placeholder="Pick a start">
             </el-date-picker>
             <el-date-picker v-model="dateEnd" format="dd.MM.yyyy" type="date" placeholder="Pick a end">
       </el-date-picker>-->
        <table>
          <thead>
          <tr>
            <td style="padding: 5px;">Тип источника метрики</td>
            <td style="padding: 5px;">Уровень поднимаемой тревоги</td>
            <td style="padding: 5px;">Статус</td>
            <td style="padding: 5px;">Описание</td>
            <td style="padding: 5px;"></td>
          </tr>
          </thead>
          <tbody>
          <tr v-for="alaramRule in alarmRules">
            <td style="color: #fff; padding: 5px; border: 1px solid grey">{{ alaramRule.sourceTypeName }}</td>
            <td style="color: #fff; padding: 5px; border: 1px solid grey">{{ alaramRule.levelName }}</td>
            <td style="color: #fff; padding: 5px; border: 1px solid grey">{{ alaramRule.statusName }}</td>
            <td style="color: #fff; padding: 5px; border: 1px solid grey">{{ alaramRule.note }}</td>
            <td style="padding: 5px; border: 1px solid grey">
              <el-button v-on:click="editAlarmRule(alaramRule.id)" round type="primary">Редактировать правило</el-button>
            </td>
          </tr>
          </tbody>
        </table>

        <div style="display: flex; align-items: center; margin-top: 25px;">
          <div>Тип метрики</div>
          <el-select style="min-width: 500px" v-model="sourceId" placeholder="Select">
            <el-option label=" " :value="null"></el-option>
            <el-option
              v-for="item in monitorDict"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button :disabled="null === sourceId" v-on:click="createNewAlarmRule()" round type="primary">Создать новое правило</el-button>
        </div>
      </el-main>
      <!--/Область контента-->
    </el-container>
  </el-container>
</template>

<script>
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";
  import * as VueGridLayout from "vue-grid-layout" // https://github.com/jbaysolutions/vue-grid-layout
  import PageAside from "../SharedWidgets/PageAside";

  export default {
    name: "AlarmRuleReestr",
    components: {
      PageAside,
      GridLayout: VueGridLayout.GridLayout,
      GridItem: VueGridLayout.GridItem,
    },
    beforeCreate: function () {
      let wid = sessionStorage.getItem('wid');
      let alarmRuleReestr = funcUtils.getfromLocalStorage('alarmRuleReestr');
      if (funcUtils.isNull(alarmRuleReestr)) {
        alarmRuleReestr = {
          alarmRuleReestrView: null
        };
        funcUtils.addToLocalStorage('alarmRuleReestr', alarmRuleReestr);
      }
      let getData = (methodName) => {
        let cid = alarmRuleReestr.alarmRuleReestrView;
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, cid, this.$store.state.alarmRuleReestr.bean, methodName);
        let requestParam = new RequestEntity.RequestParam(requestHead, {filter: null});
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              this.$store.dispatch('fillModule', {'event': eventResponse});
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      };
      if (funcUtils.isNull(alarmRuleReestr.alarmRuleReestrView)) {
        let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, null, this.$store.state.alarmRuleReestr.bean, null);
        let requestParam = new RequestEntity.RequestParam(requestHead, null);
        RequstApi.sendHttpRequest(requestParam)
          .then(eventResponse => {
            if (eventResponse.status === 200) {
              let data = eventResponse.response;
              if (data.length > 0) {
                let dataJson = JSON.parse(data);
                let respData = dataJson.data;
                let respError = dataJson.error;
                if (!funcUtils.isNull(respData)) {
                  if (dataJson.method === 'addCID') {
                    alarmRuleReestr.alarmRuleReestrView = respData.cid;
                    this.$store.dispatch('alarmRuleReestrSetCid', respData.cid);
                    funcUtils.addToLocalStorage('alarmRuleReestr', alarmRuleReestr);
                    getData('getData');
                  }
                } else {
                  if (!funcUtils.isNull(respError)) {
                    alert(respError.errorMsg);
                  }
                }
              }
            }
          })
          .catch(eventResponse => {
            alert(eventResponse.message);
          });
      } else {
        getData('restore');
      }

      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, null, 'StateBean', 'getMonitorDict');
      let requestParam = new RequestEntity.RequestParam(requestHead, null);
      RequstApi.sendHttpRequest(requestParam)
        .then(eventResponse => {
          if (eventResponse.status === 200) {
            let data = eventResponse.response;
            if (data.length > 0) {
              let dataJson = JSON.parse(data);
              let respData = dataJson.data;
              let respError = dataJson.error;
              if (!funcUtils.isNull(respData)) {
                this.monitorDict = [];
                respData.forEach((monitor) => {
                  this.monitorDict.push({
                    label: monitor.name,
                    value: monitor.id
                  });
                });
              } else {
                if (!funcUtils.isNull(respError)) {
                  alert(respError.errorMsg);
                }
              }
            }
          }
        })
        .catch(eventResponse => {
          alert(eventResponse.message);
        });
    },
    data() {
      return {
        sourceId: null,
        monitorDict: null,
        headerSwitch: false
      }
    },
    computed: {
      alarmRules: function () {
        let res;
        let data = this.$store.state.alarmRuleReestr.data;
        if (data) {
          let alarmDicts = data.data;
          if (funcUtils.isNotEmpty(alarmDicts)) {
            alarmDicts.forEach((dict) => {
              dict.sourceTypeName = funcUtils.lookupValue('sourceTypeNames', dict.sourceType).label;
              dict.levelName = funcUtils.lookupValue('levelNames', dict.level).label;
              dict.statusName = funcUtils.lookupValue('statusNames', dict.status).label;
            });
          }
          res = data.data;
        }
        return res;
      }
    },
    methods: {
      editAlarmRule: function (alaramRuleId) {
        let params = {
          'id': alaramRuleId
        };
        funcUtils.getNextComponent(this.$store.state.alarmRuleEdit.bean, () => {
          funcUtils.getNextPage(this.$router, this.$store.state.alarmRuleEdit.routeName, params);
        });
      },
      createNewAlarmRule: function () {
        let params = {
          'executerId': 1,
          'sourceType': 1,
          'sourceId': this.sourceId
        };
        funcUtils.getNextComponent(this.$store.state.alarmRuleEdit.bean, () => {
          funcUtils.getNextPage(this.$router, this.$store.state.alarmRuleEdit.routeName, params);
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

        .dc-button-icon-small:last-child {
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
