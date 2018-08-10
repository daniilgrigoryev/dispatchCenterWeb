<template>
  <div style="height: 100%;">
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
      </div>

      <div class="dc-widget-grid__item__header__right-column">
        <div class="dc-widget-grid__item__header__buttons dc-widget-grid__item__header__buttons--vertical">
          <el-tooltip class="item" effect="dark" content="Свернуть панель" placement="left-start">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-arrow-left-small-white.svg" alt="">
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

    <!--Счетчик 1 -->
    <div class="metrica-passport-tile-current-values-speedometer">
      <header class="metrica-passport-tile-current-values-speedometer__time" title="Время обновления">
        1ч 20м
      </header>
      <i class="metrica-passport-tile-current-values-speedometer__pulse"
         title="Индикатор обновления"></i>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 24"
           class="metrica-passport-tile-current-values-speedometer__trend metrica-passport-tile-current-values-speedometer__trend--up">
        <path d="M9,14h7.67a.59.59,0,0,0,.42-1L13.25,8.8a.59.59,0,0,0-.87,0L8.53,13A.59.59,0,0,0,9,14Z"
              :fill="options_1.series[0].color[0]"/>
      </svg>

      <echarts
        :options="options_1"
        style="width: 100%; height: 135px;"
        auto-resize
      >
      </echarts>

      <div class="metrica-passport-tile-current-values-speedometer__value">52</div>
      <div class="metrica-passport-tile-current-values-speedometer__title">проезды</div>
    </div>
    <!--/Счетчик 1 -->

    <!--Счетчик 2 -->
    <div class="metrica-passport-tile-current-values-speedometer">
      <header class="metrica-passport-tile-current-values-speedometer__time" title="Время обновления">
        2ч
      </header>
      <i class="metrica-passport-tile-current-values-speedometer__pulse"
         title="Индикатор обновления"></i>

      <echarts
        :options="options_2"
        style="width: 100%; height: 135px;"
        auto-resize
      >
      </echarts>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 25"
           class="metrica-passport-tile-current-values-speedometer__trend metrica-passport-tile-current-values-speedometer__trend--down">
        <path d="M16.64 9H9a.6.6 0 0 0-.43 1l4 4.2a.59.59 0 0 0 .87 0l3.71-4.2a.59.59 0 0 0-.51-1z"
              :fill="options_2.series[0].color[0]"/>
      </svg>

      <div class="metrica-passport-tile-current-values-speedometer__value">31</div>
      <div class="metrica-passport-tile-current-values-speedometer__title">нарушения</div>
    </div>
    <!--/Счетчик 2 -->

    <!--Счетчик 3 -->
    <div class="metrica-passport-tile-current-values-speedometer">
      <header class="metrica-passport-tile-current-values-speedometer__time" title="Время обновления">
        20м
      </header>
      <i class="metrica-passport-tile-current-values-speedometer__pulse"
         title="Индикатор обновления"></i>

      <echarts
        :options="options_3"
        style="width: 100%; height: 135px;"
        auto-resize
      >
      </echarts>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 25"
           class="metrica-passport-tile-current-values-speedometer__trend metrica-passport-tile-current-values-speedometer__trend--up">
        <path d="M9,14h7.67a.59.59,0,0,0,.42-1L13.25,8.8a.59.59,0,0,0-.87,0L8.53,13A.59.59,0,0,0,9,14Z"
              :fill="options_3.series[0].color[0]"/>
      </svg>

      <div class="metrica-passport-tile-current-values-speedometer__value">28</div>
      <div class="metrica-passport-tile-current-values-speedometer__title">% нарушений от проездов</div>
    </div>
    <!--/Счетчик 3 -->

    <!--Счетчик 4 -->
    <div class="metrica-passport-tile-current-values-speedometer">
      <header class="metrica-passport-tile-current-values-speedometer__time" title="Время обновления">
        1ч 20 м
      </header>
      <i class="metrica-passport-tile-current-values-speedometer__pulse"
         title="Индикатор обновления"></i>

      <echarts
        :options="options_4"
        style="width: 100%; height: 135px;"
        auto-resize
      >
      </echarts>

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 28 25"
           class="metrica-passport-tile-current-values-speedometer__trend metrica-passport-tile-current-values-speedometer__trend--up">
        <path d="M9,14h7.67a.59.59,0,0,0,.42-1L13.25,8.8a.59.59,0,0,0-.87,0L8.53,13A.59.59,0,0,0,9,14Z"
              :fill="options_4.series[0].color[0]"/>
      </svg>

      <div class="metrica-passport-tile-current-values-speedometer__value">20</div>
      <div class="metrica-passport-tile-current-values-speedometer__title">% оформлений от проездов</div>
    </div>
    <!--/Счетчик 4 -->
  </div>
</template>

<script>
  import echarts from 'vue-echarts/components/ECharts'

  export default {
    name: "metrica-passport-tile-current-values",
    props: {
      title: {
        type: String
      }
    },
    components: {echarts},
    data: function () {
      return {
        options_1: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(5, 5, 17, 0.4)'
          },

          series: [
            {
              type: 'pie',
              center: ['50%', '48%'],
              radius: ['85%', '92%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,

              label: {
                show: false
              },
              color: [
                "#0068ff",
                "#4b4b51",
              ],
              data: [
                {value: 85, name: 'Значение счетчика'},
                {value: 15, name: 'Пустое значение'},
              ]
            }
          ]
        },
        options_2: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(5, 5, 17, 0.4)'
          },

          series: [
            {
              type: 'pie',
              center: ['50%', '48%'],
              radius: ['85%', '92%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,

              label: {
                show: false
              },
              color: [
                "#762dea",
                "#4b4b51",
              ],
              data: [
                {value: 31, name: 'Значение счетчика'},
                {value: 69, name: 'Пустое значение'},
              ]
            }
          ]
        },

        options_3: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(5, 5, 17, 0.4)'
          },

          series: [
            {
              type: 'pie',
              center: ['50%', '48%'],
              radius: ['85%', '92%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,

              label: {
                show: false
              },
              color: [
                "#5a71e2",
                "#4b4b51",
              ],
              data: [
                {value: 85, name: 'Значение счетчика'},
                {value: 15, name: 'Пустое значение'},
              ]
            }
          ]
        },

        options_4: {
          itemStyle: {
            shadowBlur: 12,
            shadowColor: 'rgba(5, 5, 17, 0.4)'
          },

          series: [
            {
              type: 'pie',
              center: ['50%', '48%'],
              radius: ['85%', '94%'],
              avoidLabelOverlap: false,
              hoverAnimation: false,

              label: {
                show: false
              },
              color: [
                "#e600ff",
                "#4b4b51",
              ],
              data: [
                {value: 20, name: 'Значение счетчика'},
                {value: 80, name: 'Пустое значение'},
              ]
            }
          ]
        }
      }
    }
  }
</script>

<style lang="scss">
  .metrica-passport-tile-current-values-speedometer {
    position: relative;
    height: 200px;
    margin: 5px;
    border-radius: 4px;
    background: linear-gradient(to right, rgba(40, 40, 46, 1) 0%, rgba(52, 52, 66, 1) 100%);

    &:before {
      content: '';
      position: absolute;
      pointer-events: none;
      left: 5px;
      right: 5px;
      top: 5px;
      bottom: 5px;
      border: 1px solid #050511;
      border-radius: 4px;
      opacity: 0.35;
    }

    .metrica-passport-tile-current-values-speedometer__trend {
      position: absolute;
      width: 48px;
      left: 0;
      right: 0;
      margin: auto;

      &--up {
        top: calc(50% - 68px);
      }

      &--down {
        bottom: calc(50% - 50px);
      }
    }

    .metrica-passport-tile-current-values-speedometer__pulse {
      $size: 14px;
      position: absolute;
      right: $size;
      top: $size;
      width: $size;
      height: $size;
      border: 1px solid rgba(114, 135, 165, 0.36);
      border-radius: 100%;

      &:after {
        display: block;
        content: '';
        width: 70%;
        height: 70%;
        margin-left: 15%;
        margin-top: 15%;
        background: red;
        border-radius: 100%;
        opacity: 0;
      }

      &.metrica-passport-tile-current-values-speedometer__pulse--animated {
        &:after {
          animation: animated-pulse 0.4s infinite;
        }
      }

      @keyframes animated-pulse {
        0% {
          opacity: 1;
        }
        20% {
          opacity: 0;
        }
        40% {
          opacity: 1;
        }
        60% {
          opacity: 0;
        }
        80% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
    }

    .metrica-passport-tile-current-values-speedometer__time {
      color: #7287a5;
      font-size: 14px;
      font-weight: 500;
      padding: 5px 15px;
      margin-bottom: -10px;
    }

    .metrica-passport-tile-current-values-speedometer__title {
      position: absolute;
      width: 100%;
      bottom: 10px;
      color: #9f9fa0;
      font-size: 16px;
      text-align: center;
      line-height: 1.1;
    }

    .metrica-passport-tile-current-values-speedometer__value {
      position: absolute;
      top: -10px;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20%;
      width: 50%;
      margin: auto;
      font-size: 52px;
      text-align: center;
      color: white;
    }
  }
</style>
