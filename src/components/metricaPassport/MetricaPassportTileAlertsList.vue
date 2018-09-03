<template>
  <div class="dc-alerts-wrapper" style="height: 100%;">
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
    <ul id="dc_alerts_list" class="dc-alerts-list" style="height: 385px;">
      <li v-for="(item, index) in alertsList"
          :key="item.uniqueKey"
          :style="{display: (index + 1) === activeAlertListItem || activeAlertListItem === 0 ? 'block' : 'none'}"
          :row-key="index + 1"
          :class="'dc-alerts-list__type ' + item.dcAlertsListType"
          :title="item.name">
        <!--Алерты – немедленный уровень-->
        <div :class="'dc-alerts-list__type__level ' + item.dcAlertsListTypeLevel"
             @click="setActiveAlertItem(index + 1, item)">
          <div>
            <div class="dc-alerts-list__type__level__heading">{{item.name}}</div>
            <div class="dc-alerts-list__type__level__subheading">{{item.levelName}}</div>
          </div>
          <div style="margin-left: auto; display: flex; align-items: center;">
            <div class="dc-alerts-list__type__level__value">{{item.count}}</div>
            <el-button type="text" :icon="(index + 1) === activeAlertListItem ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"
                       class="dc-alerts-list__type__level__toggler"></el-button>
          </div>
        </div>




        <ul :style="{display: (index + 1) === activeAlertListItem ? 'block' : 'none', height: '335px', 'overflow-y': 'auto'}">
          <li class="dc-alerts-list-item"
              :style="{background: alarm.selected ? '#b5aeb5 !important' : 'transparent'}"
              v-for="(alarm, indexInner) in item.alarms"
              :title="alarm.note">
            <div class='flex-parent'>
              <div class="flex-child flex-parent flex-parent--center-cross mr24">
                <label>
                  <input v-model="alarm.selected" :disabled="!alarm.selected && selectedAlarms.length >= 3"
                         @click="setActiveAlarm(alarm)" type="checkbox"/>
                </label>
              </div>
              <div class='flex-child'>
                <div @click="getAlarmPassport(alarm.id)" class="dc-alerts-list-item__name">
                  <span>алерт</span> ID {{alarm.id}}
                </div>
                <div class="dc-alerts-list-item__note">{{alarm.note}}</div>
              </div>
              <div class='flex-child' style="margin-left: auto;">
                <div class="dc-alerts-list-item__date">{{alarm.alarmTime | formatDateTime('DD.MM.YYYY')}}</div>
                <div class="dc-alerts-list-item__time">{{alarm.alarmTime | formatDateTime('HH:mm')}}</div>
              </div>
            </div>
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
  import "animate.css";

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
        let res;
        let data = this.$store.state.monitorViewData.data;
        if (data) {
          let rules = data.alarmRules;
          let alarms = data.alarms;
          let selectedAlarms = data.selectAlarms;
          this.selectedAlarms = selectedAlarms;
          if (data.selectObj.length > 0) {
            this.activeAlertListItem = 0;
          }
          let rulesData = {};
          let rulesList = [];
          let rulesObj = {};
          rules.forEach((rule) => {
            rulesObj[rule.id] = rule;
          });

          alarms.forEach((alarm) => {
            let rule = rulesObj[alarm.alarmRuleId];
            let uniqueKey = rule.id + rule.note + alarm.level;
            let ruleData = rulesData[uniqueKey];
            if (funcUtils.isUndefined(ruleData)) {
              ruleData = {
                id: rule.id,
                name: rule.note,
                count: 0,
                level: rule.level,
                alarmLastTime: null,
                alarms: [],
                alarmsNotes: [],
                uniqueKey: uniqueKey
              };
              switch (rule.level) {
                case 1: {
                  ruleData.dcAlertsListType = 'dc-alerts-list__type--1';
                  break;
                }
                case 2: {
                  ruleData.dcAlertsListType = 'dc-alerts-list__type--2';
                  break;
                }
                case 3: {
                  ruleData.dcAlertsListType = 'dc-alerts-list__type--3';
                  break;
                }
                case 4: {
                  ruleData.dcAlertsListType = 'dc-alerts-list__type--4';
                  break;
                }
                case 5: {
                  ruleData.dcAlertsListType = 'dc-alerts-list__type--5';
                  break;
                }
              }
              ruleData.levelName = funcUtils.lookupValue('levelNames', alarm.level).label;
              switch (alarm.level) {
                case 1: {
                  ruleData.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--low';
                  break;
                }
                case 2: {
                  ruleData.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--normal';
                  break;
                }
                case 3: {
                  ruleData.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--moderate';
                  break;
                }
                case 4: {
                  ruleData.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--high';
                  break;
                }
                case 5: {
                  ruleData.dcAlertsListTypeLevel = 'dc-alerts-list__type__level--immediate';
                  break;
                }
              }
              rulesData[uniqueKey] = ruleData;
            }
            ruleData.count++;
            alarm.selected = false;
            if (!ruleData.alarmsNotes.includes(alarm.note)) {
              if (selectedAlarms.includes(alarm.id)) {
                alarm.selected = true;
              }
              ruleData.alarmsNotes.push(alarm.note);
              ruleData.alarms.push(alarm);
            }
            if (ruleData.alarmLastTime < alarm.alarmTime) {
              ruleData.alarmLastTime = alarm.alarmTime;
            }
          });
          for (let prop in rulesData) {
            if (rulesData.hasOwnProperty(prop) && rulesData[prop].count > 0) {
              rulesList.push(rulesData[prop]);
            }
          }
          this.alertsListSize = rulesList.length;
          res = rulesList;
        }
        return res;
      }
    },
    methods: {
      setActiveAlertItem: function (index, item) {
        let containsClass = function(sourceElement, className) {
          return sourceElement.className.indexOf(className) > -1;
        };
        let addClass = function (element, classes) {
          if (typeof classes === "string") {
            if (!containsClass(element, classes)) {
              element.classList.add(classes);
            }
          } else if (typeof classes === "object") {
            for (let i = 0; i < classes.length; i++) {
              if (!containsClass(element, classes[i])) {
                element.classList.add(classes[i]);
              }
            }
          }
        };
        let removeClass = function (element, classes) {
          if (typeof classes === "string") {
            if (containsClass(element, classes)) {
              element.classList.remove(classes);
            }
          } else if (typeof classes === "object") {
            for (let i = 0; i < classes.length; i++) {
              if (containsClass(element, classes[i])) {
                element.classList.remove(classes[i]);
              }
            }
          }
        };
        let ul = document.getElementsByClassName('dc-alerts-list__type');
        let ulLi = document.getElementById('dc_alerts_list').querySelector('li[row-key=' + '\'' + index + '\'' + ']');
        if (index === this.activeAlertListItem) {
          this.activeAlertListItem = 0;
          removeClass(ulLi, ['fadeInLeft', 'slow']);
          addClass(ulLi, ['animated', 'fadeOut']);
          ulLi.style.display = 'none';
          removeClass(ulLi.querySelector('ul'), ['animated', 'fadeInLeft']);
          ulLi.querySelector('ul').style.display = 'none';
          removeClass(ulLi.querySelector('i'), 'el-icon-arrow-down');
          addClass(ulLi.querySelector('i'), 'el-icon-arrow-right');
          for (let i = 0; i < ul.length; i++) {
            let el = ul[i];
            removeClass(el, 'fadeOut');
            addClass(el, 'fadeInRight');
            // el.classList.remove('slow');
            el.style.display = '';
          }
        } else {
          this.activeAlertListItem = index;
          for (let i = 0; i < ul.length; i++) {
            let el = ul[i];
            addClass(el, ['animated', 'faster']);
            removeClass(el, 'fadeInRight');
            addClass(el, 'fadeOut');
            el.style.display = 'none';
            el.querySelector('ul').style.display = 'none';
          }
          removeClass(ulLi, 'fadeOut');
          addClass(ulLi, 'fadeInLeft');
          removeClass(ulLi.querySelector('i'), 'el-icon-arrow-right');
          addClass(ulLi.querySelector('i'), 'el-icon-arrow-down');
          ulLi.style.display = '';
          addClass(ulLi.querySelector('ul'), ['animated', 'faster', 'fadeInLeft']);
          ulLi.querySelector('ul').style.display = '';
        }
        setTimeout(() => {
          for (let i = 0; i < ul.length; i++) {
            let el = ul[i];
            removeClass(el, ['animated', 'fadeInLeft', 'fadeOut', 'slow', 'fadeInRight', 'faster']);
            removeClass(el.querySelector('ul'), ['animated', 'fadeInLeft', 'fadeOut', 'slow', 'fadeInRight', 'faster']);
          }
        }, 400);
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
      },
      getAlarmPassport: function (alarmId) {
        let monitorViewData = this.$store.state.monitorViewData.data;
        let params = {
          'alarmId': alarmId,
          'dateBeg': monitorViewData.dateBeg,
          'dateEnd': monitorViewData.dateEnd
        };
        if (funcUtils.isNull(monitorViewData.dateBeg)) {
          alert("Начальный период необходимо заполнить!");
          return;
        }
        funcUtils.getNextComponent(this.$store.state.alarmViewData.bean, () => {
          funcUtils.getNextPage(this.$router, this.$store.state.alarmViewData.routeName, params);
        });
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
  $-color-alert-type-4: #897213;
  $-color-alert-type-5: #237e22;

  .dc-alerts-wrapper {
    display: flex;
    flex-direction: column;
  }

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

    &.dc-alerts-list__type--4 {
      .el-collapse-item__header {
        color: $-color-alert-type-4 !important;
      }

      .dc-alerts-list__type__level:before {
        background-color: $-color-alert-type-4;
      }
    }

    &.dc-alerts-list__type--5 {
      .el-collapse-item__header {
        color: $-color-alert-type-5 !important;
      }

      .dc-alerts-list__type__level:before {
        background-color: $-color-alert-type-5;
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
    color: white;
    background-repeat: no-repeat;
    background-position: 18px center;
    background-size: 18px;
    /*cursor: pointer;*/

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

    .dc-alerts-list__type__level__value {
      font-size: 24px;
      margin-right: 10px;
    }
  }

  .dc-alerts-list-item {
    padding: 5px 10px;
    color: white;
    font-size: 13px;
    line-height: 1.35;
    border-bottom: 1px solid rgba(114, 135, 165, 0.5);

    &:hover {
      background: rgba(114, 135, 165, 0.15) !important;
      /*cursor: pointer;*/
    }

    &.dc-alerts-list-item--selected {
      background: rgba(114, 135, 165, 0.35) !important;
    }
  }

  .dc-alerts-list-item__name {
    &:hover {
      color: #0068ff;
      cursor: pointer;
    }

    text-decoration: underline;
    text-transform: uppercase;

    span {
      opacity: 0.5;
    }
  }

  .dc-alerts-list-item__note {
    font-weight: 500;
    font-size: 14px;
  }

  .dc-alerts-list-item__date {
    text-align: right;
    opacity: 0.5;
    line-height: 1;
  }

  .dc-alerts-list-item__time {
    text-align: right;
    font-size: 20px;
    font-weight: 500;
  }

  .dc-alerts-list__type__level__toggler {
    margin-right: 10px;
    transition: all 100ms linear;

    .dc-alerts-list__type--active & {
      transform: rotate(90deg);
    }
  }
</style>
