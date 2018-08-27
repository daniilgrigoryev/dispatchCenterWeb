<template>
  <div>
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
      </div>

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

    <div class="dc-alert-passport-content absolute bottom">
      <!-- Цветная плашка с описанием -->
      <div :class="'dc-alert-passport-content-item dc-alert-passport-status-box ' + alertData.dcAlertPlateLevel">
        <div class="flex-parent flex-parent--start-cross">
          <i class="dc-alert-passport-status-box__icon"></i>
          <div class="dc-alert-passport-status-box__title flex-child">
            {{ alertData.alarmRuleNote }}
          </div>
          <el-tooltip class="dc-alert-passport-status-box__menu" effect="dark" content="Меню операций"
                      placement="bottom">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-burger-medium-white.svg" alt="">
            </el-button>
          </el-tooltip>
        </div>

        <div class="dc-alert-passport-status-box__priority">
          <span>приоритет:</span> {{ alertData.levelName }}
        </div>

        <div class='grid mt24'>
          <div class='col col--1'>
            <img class="dc-alert-passport-status-box--small-description-map-pin"
                 src="../../assets/img/icon-map-pin-white.svg" alt="">
          </div>
          <div class='col col--8'>
                    <span class="dc-alert-passport-status-box__small-description-title">
                        описание объекта
                    </span>
            <span class="dc-alert-passport-status-box__small-description">
                        {{ alertData.objectNote }}
                    </span>
          </div>
          <div class='col col--3'>
                      <span class="dc-alert-passport-status-box__small-description-title">
                        ID
                    </span>
            <span class="dc-alert-passport-status-box__small-description">
                        {{ alertData.objectName }}
                    </span>
          </div>
        </div>
      </div>
      <!--/ Цветная плашка с описанием -->

      <!-- Время начала и окончания -->
      <div class='dc-alert-passport-content-item grid grid--gut6 mb6'>
        <div class='col'>
          <div class="dc-inner-tile-box dc-inner-tile-box--dark-gray">
            <div class="dc-alert-passport__time-title">время возникновения</div>
            <div class="dc-alert-passport__time-values">
              <div class="dc-alert-passport__time-values__title">{{alertData.alarmTime | formatRelativeDate()}}</div>
              <div class="dc-alert-passport__time-values__value">{{alertData.alarmTime | formatDateTime('hh:mm')}}</div>
            </div>
          </div>
        </div>
        <div class='col'>
          <div class="dc-inner-tile-box-wrapper dc-inner-tile-box dc-inner-tile-box--dark-gray dc-inner-tile-box--is-working">
            <div class="dc-alert-passport__time-title">окончание</div>

            <div class="dc-alert-passport__time-values dc-alert-passport__time-values--hidden-value">
              <div class="dc-alert-passport__time-values__title">{{ alertData.alarmLastTime }}</div>
              <div class="dc-alert-passport__time-values__value">23:02</div>
            </div>
          </div>
        </div>
      </div>
      <!-- /Время начала и окончания -->

      <!-- Описание алерта -->
      <div class="dc-alert-passport-content-item dc-inner-tile-box dc-inner-tile-box--medium-gray">
        <h5>Описание алерта</h5>

        <p class="dc-alert-passport__descriptions-text">
          {{ alertData.note }}
        </p>
      </div>
      <!-- /Описание алерта -->
    </div>

  </div>
</template>

<script>
  import * as RequestEntity from '../../assets/js/api/requestEntity';
  import {RequstApi} from '../../assets/js/api/requestApi';
  import * as funcUtils from "../../assets/js/utils/funcUtils";

  export default {
    name: "alert-passportport-tile-description",
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {

      };
    },
    computed: {
      alertData: function () {
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
        let res = {};
        let data = this.$store.state.alarmViewData.data;
        if (data) {
          data.alarmLastTime = '';
          data.levelName = {};
          let actions = data.actions;
          if (data.state === 3) {
            if (actions !== undefined && actions !== null) {
              let max = actions.reduce((max, action) => action.lastOperTime < max ? action.lastOperTime : max, actions[0].lastOperTime);
              data.alarmLastTime = max | formatDateTime('DD.MM.YYYY hh:mm');
            }
          } else {
            data.alarmLastTime = funcUtils.lookupValue('stateNames', data.state);
          }

          if (data.level !== undefined && data.level !== null) {
            switch (data.level) {
              case 1: {
                data.dcAlertPlateLevel = 'dc-alert-passport-status-box--level-low';
                data.levelName = 'Незаметный';
                break;
              }
              case 2: {
                data.dcAlertPlateLevel = 'dc-alert-passport-status-box--level-normal';
                data.levelName = 'Низкий';
                break;
              }
              case 3: {
                data.dcAlertPlateLevel = 'dc-alert-passport-status-box--level-moderate';
                data.levelName = 'Нормальный';
                break;
              }
              case 4: {
                data.dcAlertPlateLevel = 'dc-alert-passport-status-box--level-high';
                data.levelName = 'Высокий';
                break;
              }
              case 5: {
                data.dcAlertPlateLevel = 'dc-alert-passport-status-box--level-immediate';
                data.levelName = 'Срочный';
                break;
              }
            }
          }

          res = data;
        }
        return res;
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss">
  $-color-alert-level-immediate: #bc1b0a;
  $-color-alert-level-high: #d85803;
  $-color-alert-level-moderate: #d89a0f;
  $-color-alert-level-normal: #0fac56;
  $-color-alert-level-low: #3a5b6d;

  .dc-alert-passport-content {
    width: 100%;
    height: calc(100% - 32px);
    top: 32px;
  }

  .dc-alert-passport-content-item {
    height: auto !important;
  }

  .dc-inner-tile-box {
    $bg-offset: 10px;
    padding: 15px;
    margin-bottom: 5px;
    background: no-repeat calc(100% - #{$bg-offset}) $bg-offset;
    border-radius: 5px;
    height: 100%;

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

  .dc-alert-passport-status-box {
    margin-bottom: 5px;
    padding: 10px;
    color: white;
    border-radius: 4px;

    .dc-alert-passport-status-box__icon {
      $size: 32px;
      width: $size;
      height: $size;
      display: block;
      background: transparent no-repeat center;
      background-size: 24px;
    }

    .dc-alert-passport-status-box__title {
      margin: 0 15px;
      flex: 1;
      font-size: 20px;
      font-weight: 500;
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .dc-alert-passport-status-box__menu {
      height: 28px;
      margin-left: auto;
    }

    .dc-alert-passport-status-box__priority {
      font-size: 17px;

      span {
        display: inline-block;
        margin: 15px 5px 0 15px;
        opacity: 0.7;
      }
    }

    &.dc-alert-passport-status-box--level-immediate {
      background-color: $-color-alert-level-immediate;

      .dc-alert-passport-status-box__icon {
        background-image: url("../../assets/img/icon-tmp-gear-white.svg");
      }
    }

    &.dc-alert-passport-status-box--level-high {
      background-color: $-color-alert-level-high;

      .dc-alert-passport-status-box__icon {
        background-image: url("../../assets/img/icon-tmp-gear-white.svg");
      }
    }

    &.dc-alert-passport-status-box--level-moderate {
      background-color: $-color-alert-level-moderate;

      .dc-alert-passport-status-box__icon {
        background-image: url("../../assets/img/icon-tmp-gear-white.svg");
      }
    }

    &.dc-alert-passport-status-box--level-normal {
      background-color: $-color-alert-level-normal;

      .dc-alert-passport-status-box__icon {
        background-image: url("../../assets/img/icon-tmp-gear-white.svg");
      }
    }

    &.dc-alert-passport-status-box--level-low {
      background-color: $-color-alert-level-low;

      .dc-alert-passport-status-box__icon {
        background-image: url("../../assets/img/icon-tmp-gear-white.svg");
      }
    }

    .dc-alert-passport-status-box__small-description-title {
      display: block;
      opacity: 0.7;
      line-height: 1.5;
      font-size: 13px;
      font-weight: 500;
    }

    .dc-alert-passport-status-box__small-description {
      display: block;
      text-transform: uppercase;
      font-size: 13px;
      line-height: 1.5;
    }

    .dc-alert-passport-status-box--small-description-map-pin {
      $size: 28px;
      display: inline-block;
      margin-top: 5px;
      width: $size;
      height: $size;
    }
  }

  .dc-alert-passport__time-title {
    color: #7e8c91;
    font-size: 16px;
  }

  .dc-alert-passport__time-values {
    display: inline-block;
    margin-top: 10px;
    padding: 20px;
    border: 1px solid #0068ff;
    border-radius: 10px;

    .dc-inner-tile-box--is-working & {
      border-color: transparent;
      padding-left: 0;

      .dc-alert-passport__time-values__value {
        visibility: hidden;
      }
    }
  }

  .dc-alert-passport__time-values__title {
    font-size: 24px;
    color: white;
    opacity: 0.5;
    line-height: 0.5;
  }

  .dc-alert-passport__time-values__value {
    margin-top: 15px;
    font-size: 34px;
    color: white;
  }

  .dc-alert-passport__descriptions-text {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1.3;
  }
</style>
