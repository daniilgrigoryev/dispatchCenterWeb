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

    <el-carousel id="metricaCarousel" :autoplay="false" ref="carousel" arrow="never">
      <!--Список алертов-->
      <el-carousel-item>
        <ul class="dc-alerts-list" v-show="activeAlertsListSize === null">
          <li v-for="(item, index) in alertsList" :class="['dc-alerts-list__type ' + item.dcAlertsListType]"
              v-bind:title="item.name" v-bind:name="index">
            <!--Алерты – немедленный уровень-->
            <div v-bind:class="'dc-alerts-list__type__level ' + item.dcAlertsListTypeLevel"
                 @click="setActiveAlertItem(index, item); setCarouselItem(1)">
              <div>
                <div class="dc-alerts-list__type__level__heading">{{item.name}}</div>
                <div class="dc-alerts-list__type__level__subheading">{{item.levelName}}</div>
              </div>
              <div style="margin-left: auto; display: flex; align-items: center;">
                <div class="dc-alerts-list__type__level__value">{{item.count}}</div>
                <el-button type="text" icon="el-icon-arrow-right"
                           class="dc-alerts-list__type__level__toggler"></el-button>
              </div>
            </div>
          </li>
        </ul>
      </el-carousel-item>
      <!--/Список алертов-->

      <!--Развернутый алерт-->
      <el-carousel-item class="dc-alerts-list__type--active">
        <div v-if="activeAlertsListSize !== null" v-bind:class="'dc-alerts-list__type__level ' + alertsList[activeAlertListItem].dcAlertsListTypeLevel"
             @click="setCarouselItem(0); activeAlertListItem = 0; activeAlertsListSize = null;"
             style="width: 100%;">
          <div>
            <div class="dc-alerts-list__type__level__heading">{{alertsList[activeAlertListItem].name}}</div>
            <div class="dc-alerts-list__type__level__subheading">{{alertsList[activeAlertListItem].levelName}}</div>
          </div>
          <div style="margin-left: auto; display: flex; align-items: center;">
            <div class="dc-alerts-list__type__level__value">{{alertsList[activeAlertListItem].count}}</div>
            <el-button type="text" icon="el-icon-arrow-right" class="dc-alerts-list__type__level__toggler"></el-button>
          </div>
        </div>

        <div id="alertsList">
          <ul v-if="activeAlertsListSize !== null">
            <li :class="['dc-alerts-list-item', {'dc-alerts-list-item--selected': alarm.selected}]"
                :style="{background: alertsList[activeAlertListItem].selected ? '#b5aeb5 !important' : 'transparent'}"
                v-for="(alarm, indexInner) in alertsList[activeAlertListItem].alarms"
                :title="alarm.note">
              <div class='flex-parent'>
                <div class="flex-child flex-parent flex-parent--center-cross mr24">
                  <input v-model="alarm.selected" :disabled="!alarm.selected && selectedAlarms.length >= 3"
                         @click="setActiveAlarm(alarm)" type="checkbox"/>
                </div>
                <div class='flex-child'>
                  <div @click="getAlarmPassport(alarm.id)" class="dc-alerts-list-item__name">
                    <span>камера</span> ID 00-00-00000-0
                  </div>
                  <div class="dc-alerts-list-item__note">{{alarm.note}}</div>
                </div>
                <div class='flex-child' style="margin-left: auto;">
                  <div class="dc-alerts-list-item__date">{{alarm.alarmTime | formatDateTime('DD.MM.YYYY')}}</div>
                  <div class="dc-alerts-list-item__time">{{alarm.alarmTime | formatDateTime('hh:mm')}}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </el-carousel-item>
      <!--/Развернутый алерт-->
    </el-carousel>

    <!--/Хедер тайла-->

    <!-- Список уровней алертов по типам -->
    <!--<div style="display: flex; align-items: center;">
      <transition name="fadeToLeft">
        <ul v-show="activeAlertsListSize === null" id="dc_alerts_list" class="dc-alerts-list" style="height: 385px; width: 100%;">
          <li v-for="(item, index) in alertsList"
              :key="item.uniqueKey"
              :row-key="index + 1"
              :class="'dc-alerts-list__type ' + item.dcAlertsListType"
              :title="item.name">
            &lt;!&ndash;Алерты – немедленный уровень&ndash;&gt;
            <div :class="'dc-alerts-list__type__level ' + item.dcAlertsListTypeLevel"
                 @click="setActiveAlertItem(index, item)">
              <div>
                <div class="dc-alerts-list__type__level__heading">{{item.name}}</div>
                <div class="dc-alerts-list__type__level__subheading">{{item.levelName}}</div>
              </div>
              <div style="margin-left: auto; display: flex; align-items: center;">
                <div class="dc-alerts-list__type__level__value">{{item.count}}</div>
                <el-button type="text" icon="el-icon-arrow-right"
                           class="dc-alerts-list__type__level__toggler"></el-button>
              </div>
            </div>
          </li>
        </ul>
      </transition>

      <transition name="fadeToRight">
        <div :style="{visibility: activeAlertsListSize > 0 ? 'visible' : 'hidden'}"> &lt;!&ndash;  :class="'dc-alerts-list__type ' + alertsList[activeAlertListItem].dcAlertsListType" &ndash;&gt;
          <div v-if="activeAlertsListSize !== null" :class="'dc-alerts-list__type__level ' + alertsList[activeAlertListItem].dcAlertsListTypeLevel"
               @click="activeAlertListItem = 0; activeAlertsListSize = null"
               style="position: absolute; width: 100%; top: 32px;">
            <div>
              <div class="dc-alerts-list__type__level__heading">{{alertsList[activeAlertListItem].name}}</div>
              <div class="dc-alerts-list__type__level__subheading">{{alertsList[activeAlertListItem].levelName}}</div>
            </div>
            <div style="margin-left: auto; display: flex; align-items: center;">
              <div class="dc-alerts-list__type__level__value">{{alertsList[activeAlertListItem].count}}</div>
              <el-button type="text" icon="el-icon-arrow-down" class="dc-alerts-list__type__level__toggler"></el-button>
            </div>
          </div>
          <div id="alertsList" style="height: 335px; overflow-y: auto; position: absolute; top: 76px; width: 100%;">
            <ul v-if="activeAlertsListSize !== null">
              <li class="dc-alerts-list-item"
                  :style="{background: alarm.selected ? '#b5aeb5 !important' : 'transparent'}"
                  v-for="(alarm, indexInner) in alertsList[activeAlertListItem].alarms"
                  :title="alarm.note">
                <div class='flex-parent'>
                  <div class="flex-child flex-parent flex-parent&#45;&#45;center-cross mr24">
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
          </div>
        </div>
      </transition>
    </div>-->
     <!--/Алерты – немедленный уровень-->
    <div v-if="alertsList.length <= 0" class="data-empty">data empty😂</div>
    <!--/Список уровней алертов (по типам)-->
  </div>
</template>

<script>
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";
  import { bus } from "../../assets/js/utils/bus";

  export default {
    name: "metrica-pie-chart-alerts-list",
    props: {
      title: {
        type: String
      }
    },
    mounted () {
      let alertsList = document.getElementById('alertsList');
      if (funcUtils.isNotEmpty(alertsList)) {
        alertsList.addEventListener('scroll', this.handleScroll);
      }
    },
    data() {
      return {
        selectedAlarms: [],
        activeAlertListItem: 0,
        activeAlertsListSize: null,
        scrollCount: 40,
        selectedCarouselItem: 0
      };
    },
    computed: {
      alertsList: function () {
        let res = [{}];
        let data = this.$store.state.monitorViewData.data;
        if (data) {
          let rules = data.alarmRules;
          let alarms = data.alarms;
          let selectedAlarms = data.selectAlarms;
          this.selectedAlarms = selectedAlarms;
          if (data.selectObj.length > 0) {
            this.activeAlertListItem = 0;
            this.activeAlertsListSize = null;
          }
          let rulesData = {};
          let rulesList = [];
          let rulesObj = {};
          rules.forEach((rule) => {
            rulesObj[rule.id] = rule;
          });
          let vm = this;
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
            if (vm.scrollCount < 40) {
              vm.scrollCount = 40;
            }
            if (ruleData.alarmsNotes.length < vm.scrollCount) {
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
          res = rulesList;
        }
        return res;
      }
    },
    methods: {
      handleScroll() {
        let alertsList = document.getElementById('alertsList');
        if( alertsList.offsetHeight + alertsList.scrollTop >= alertsList.scrollHeight ) {
          this.scrollCount += 40;
        }
      },
      setCarouselItem: function (index) {
        this.$refs.carousel.setActiveItem(index);
      },
      setActiveAlertItem(index, item) {
        this.activeAlertsListSize = item.alarms.length;
        if (index === this.activeAlertListItem) {
          this.activeAlertListItem = 0;
          this.activeAlertsListSize = 0;
        } else {
          this.activeAlertListItem = index;
        }
        document.getElementById('alertsList').scrollTop = 0;
        this.scrollCount = 40;
      },
      setActiveAlarm: function (alarm) {
        bus.$emit('resetScroll', true);
        let vm = this;
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
          let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, vm.$store.state.monitorViewData.bean, 'selectAlarms');
          let requestParam = new RequestEntity.RequestParam(requestHead, {ids: vm.selectedAlarms});
          RequstApi.sendHttpRequest(requestParam)
            .then(eventResponse => {
              if (eventResponse.status === 200) {
                vm.$store.dispatch('fillModule', {'selfStore': vm.$store, 'event': eventResponse});
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
          'beanName': 'monitorViewData',
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

  #metricaCarousel {
    height: 100%;

    .el-carousel__container {
      height: 100%;

      #alertsList {
        height: calc(100% - 44px);
        overflow-y: auto;
      }
    }
  }

  /*.fadeToLeft-enter-active, .fadeToLeft-leave-active {
    transition: all 300ms ease-in-out;
    transform: translateX(0px);
    opacity: 1;
  }
  .fadeToLeft-enter, .fadeToLeft-leave-to !* .fadeToLeft-leave-active below version 2.1.8 *! {
    transition: all 300ms ease-in-out;
    transform: translateX(-719px);
    opacity: 0;
  }

  .fadeToRight-enter-active, .fadeToRight-leave-active {
    transition: all 300ms ease-in-out;
    transform: translateX(0px);
    opacity: 1;
  }
  .fadeToRight-enter, .fadeToRight-leave-to !* .fadeToRight-leave-active below version 2.1.8 *! {
    transition: all 300ms ease-in-out;
    transform: translateX(719px);
    opacity: 0;
  }*/

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
