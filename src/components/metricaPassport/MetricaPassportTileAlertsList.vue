<template>
  <div>
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
      </div>

      <div class="dc-widget-grid__item__header__right-column">
        <div class="dc-widget-item__caption">
          за период:
          <span class="dc-widget-item__caption__value--2">36</span>
        </div>

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

    <!-- Список уровней алертов по типам -->
    <ul class="dc-alerts-list">
      <li v-for="(item, index) in alertsList" v-bind:class="'dc-alerts-list__type ' + item.dcAlertsListType"
          v-bind:title="item.name" v-bind:name="index + 1">
        <!--Алерты – немедленный уровень-->
        <div v-bind:class="'dc-alerts-list__type__level ' + item.dcAlertsListTypeLevel"
             v-on:click="setActiveAlertItem(index + 1)">
          <div>
            <div class="dc-alerts-list__type__level__heading">{{item.name}}</div>
            <div class="dc-alerts-list__type__level__subheading">{{item.levelName}}</div>
          </div>
          <div style="margin-left: auto; display: flex; align-items: center;">
            <div class="dc-alerts-list__type__level__value">{{item.count}}</div>
            <el-button type="text" icon="el-icon-arrow-right"></el-button>
          </div>
        </div>
        <ul v-bind:style="{display: (index + 1) === activeAlertListItem ? 'block' : 'none'}">
          <li v-on:click="setActiveAlarm(alarm)"
              class="dc-alerts-list-item"
              v-bind:style="{background: alarm.selected ? '#b5aeb5 !important' : 'transparent'}"
              v-for="(alarm, indexInner) in item.alarms"
              v-bind:title="alarm.note">
            <p>{{alarm.note}}</p>
          </li>
        </ul>
        <!--/Алерты – немедленный уровень-->
      </li>
    </ul>
    <div v-if="alertsListSize <= 0" class="data-empty">data empty😂</div>
    <!--/Список уровней алертов (по типам)-->
  </div>
</template>

<script>
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";


  export default {
    name: "metrica-pie-chart-alerts-list",
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        selectedAlarms: [],
        activeAlertListItem: 0,
        alertsListSize: 0
      };
    },
    computed: {
      alertsList: function () {
        let alerts = this.getAlerts();
        let res;
        if (alerts) {
          res = alerts;
        }
        return res;
      }
    },
    methods: {
      getAlerts: function () {
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
        let data = this.$store.state.monitorViewData.data;
        if (null !== data) {
          let rules = data.alarmRules;
          let alarms = data.alarms;
          let selectedAlarms = data.selectAlarms;
          this.selectedAlarms = selectedAlarms;
          let rulesData = {};
          let rulesList = [];
          for (let i = 0; i < rules.length; i++) {
            let rule = rulesData[rules[i].id];
            if (undefined === rule) {
              rule = {
                id: rules[i].id,
                name: rules[i].note,
                count: 0,
                level: rules[i].level,
                alarmLastTime: null,
                alarms: [],
                alarmsNotes: []
              };
              switch (rule.level) {
                case 1: {
                  rule.dcAlertsListType = 'dc-alerts-list__type--1';
                  rule.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--low';
                  rule.levelName = 'Незаметный';
                  break;
                }
                case 2: {
                  rule.dcAlertsListType = 'dc-alerts-list__type--2';
                  rule.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--normal';
                  rule.levelName = 'Низкий';
                  break;
                }
                case 3: {
                  rule.dcAlertsListType = 'dc-alerts-list__type--3';
                  rule.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--moderate';
                  rule.levelName = 'Нормальный';
                  break;
                }
                case 4: {
                  rule.dcAlertsListType = 'dc-alerts-list__type--4';
                  rule.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--high';
                  rule.levelName = 'Высокий';
                  break;
                }
                case 5: {
                  rule.dcAlertsListType = 'dc-alerts-list__type--5';
                  rule.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--immediate';
                  rule.levelName = 'Срочный';
                  break;
                }
              }
              rulesData[rules[i].id] = rule;
            }
          }
          for (let j = 0; j < alarms.length; j++) {
            let ruleData = rulesData[alarms[j].alarmRuleId];
            ruleData.count++;
            let alarm = alarms[j];
            alarm.selected = false;
            if (!ruleData.alarmsNotes.includes(alarm.note)) {
              if (selectedAlarms.includes(alarm.id)) {
                alarm.selected = true;
              }
              ruleData.alarmsNotes.push(alarm.note);
              ruleData.alarms.push(alarms[j]);
            }
            if (ruleData.alarmLastTime < alarms[j].alarmTime) {
              ruleData.alarmLastTime = alarms[j].alarmTime;
            }
          }
          for (let prop in rulesData) {
            if (rulesData.hasOwnProperty(prop) && rulesData[prop].count > 0) {
              rulesList.push(rulesData[prop]);
            }
          }
          this.alertsListSize = rulesList.length;
          return rulesList;
        }
      },
      setActiveAlertItem: function (index) {
        if (index === this.activeAlertListItem) {
          this.activeAlertListItem = 0;
        } else {
          this.activeAlertListItem = index;
        }
      },
      setActiveAlarm: function (alarm) {
        let self = this;
        if (alarm.selected) {
          alarm.selected = false;
          let index = this.selectedAlarms.indexOf(alarm.id);
          if (index !== -1) {
            this.selectedAlarms.splice(index, 1);
            send();
          }
        } else {
          if (this.selectedAlarms.length < 3) {
            alarm.selected = true;
            this.selectedAlarms.push(alarm.id);
            send();
          }
        }
        function send() {
          let wid = sessionStorage.getItem('wid');
          let componentsRoute = funcUtils.getFromSessionStorage(wid);
          let currentComponent = funcUtils.getCurrentComponent(componentsRoute);
          let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, self.$store.state.monitorViewData.bean, 'selectAlarms');
          let requestParam = new RequestEntity.RequestParam(requestHead, {ids: self.selectedAlarms});
          RequstApi.sendHttpRequest(requestParam)
            .then(eventResponse => {
              if (eventResponse.status === 200) {
                self.$store.dispatch('fillModule', {'selfStore': self.$store, 'event': eventResponse});
              }
            })
            .catch(eventResponse => {
              alert(eventResponse.message);
            });
        }
      }
    }
  }
</script>

<style lang="scss">
  $-color-alert-level-immediate: #bc1b0a;
  $-color-alert-level-high: #d85803;
  $-color-alert-level-moderate: #d89a0f;
  $-color-alert-level-normal: #0fac56;
  $-color-alert-level-low: #3a5b6d;

  $-color-alert-type-1: #07cee2;
  $-color-alert-type-2: #8979b2;
  $-color-alert-type-3: #936152;

  /*** Типы алертов ***/
  .dc-alerts-list__type {

    .el-collapse-item__header:before {
      content: 'Тип:';
      margin-right: 5px;
      color: #7e8c91;
      font-size: 10px;
      font-weight: 700;
      opacity: 0.65;
      letter-spacing: 0.5px;
    }

    &.dc-alerts-list__type--1 {
      .el-collapse-item__header {
        color: $-color-alert-type-1 !important;

      }

      .dc-alerts-list__type__level:before {
        background-color: $-color-alert-type-1;
      }
    }

    &.dc-alerts-list__type--2 {
      .el-collapse-item__header {
        color: $-color-alert-type-2 !important;
      }

      .dc-alerts-list__type__level:before {
        background-color: $-color-alert-type-2;
      }
    }

    &.dc-alerts-list__type--3 {
      .el-collapse-item__header {
        color: $-color-alert-type-3 !important;
      }

      .dc-alerts-list__type__level:before {
        background-color: $-color-alert-type-3;
      }
    }
  }

  /*** Уровни алертов ***/
  .dc-alerts-list__type__level {
    position: relative;
    display: flex;
    align-items: center;
    margin-bottom: 2px;
    padding-left: 50px;
    background-repeat: no-repeat;
    background-position: 18px center;
    background-size: 18px;
    cursor: pointer;

    &:before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 8px;
      border-right: 2px solid #050511;
    }

    &.dc-alerts-list__type__level--immediate {
      background-color: $-color-alert-level-immediate;
      background-image: url('../../assets/img/icon-alert-level-immediate-white.svg');
    }

    &.dc-alerts-list__type__level--high {
      background-color: $-color-alert-level-high;
      background-image: url('../../assets/img/icon-alert-level-high-white.svg');
    }

    &.dc-alerts-list__type__level--moderate {
      background-color: $-color-alert-level-moderate;
      background-image: url('../../assets/img/icon-alert-level-moderate-white.svg');
    }

    &.dc-alerts-list__type__level--normal {
      background-color: $-color-alert-level-normal;
      background-image: url('../../assets/img/icon-alert-level-normal-white.svg');
    }

    &.dc-alerts-list__type__level--low {
      background-color: $-color-alert-level-low;
      background-image: url('../../assets/img/icon-alert-level-low-white.svg');
    }

    .dc-alerts-list__type__level__heading {
      text-transform: uppercase;
      font-size: 13px;
      line-height: 1.3;

      &:before {
        content: 'Тип:';
        text-transform: uppercase;
        opacity: 0.65;
        font-weight: 600;
        margin-right: 5px;
        font-size: 10px;
      }
    }

    .dc-alerts-list__type__level__subheading {
      padding-left: 28px;
      line-height: 1.3;
      font-weight: 600;
      font-size: 13px;
      opacity: 0.85;
      text-transform: capitalize;
      letter-spacing: -0.5px;
    }

    .el-button {
      margin-left: auto;
      font-size: 24px;
      color: white !important;
    }
  }

  .dc-alerts-list-item {
    padding: 2px 5px;
    font-size: 16px;

    &:hover {
      background: #b5aeb5 !important;
      cursor: pointer;
    }
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
