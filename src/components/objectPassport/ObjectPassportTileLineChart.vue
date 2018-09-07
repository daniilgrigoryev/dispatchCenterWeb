<template>
  <div>
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
        <div class="dc-widget-item__caption">
          показателей:
          <span class="dc-widget-item__caption__value--2 color-purple">4</span>
        </div>

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

    <!--/Линейная диаграмма-->
    <echarts
      style="width: 100%; height: 520px;"
      ref="lineChartRef"
      :options="lineChart"
      auto-resize>
    </echarts>
    <!--/Линейная диаграмма-->
  </div>
</template>

<script>
  import echarts from 'vue-echarts/components/ECharts';
  import {bus} from "../../assets/js/utils/bus";
  import * as funcUtils from '../../assets/js/utils/funcUtils';
  /* для ф-ций форматтера */

  export default {
    name: "object-passport-tile-line-chart",
    props: {
      title: String
    },
    components: {echarts},
    data() {
      return {
        data: null,
        chartDataSize: 0,
        clicked: false
      }
    },
    mounted() {
      let vm = this;
      bus.$on('setActiveMonitor', function (payLoad) {
        if (funcUtils.isNotEmpty(vm.$refs.lineChartRef)) {
          if (funcUtils.isEmpty(payLoad.monitor)) {
            vm.$refs.lineChartRef.clear();
          } else {
            vm.data = payLoad.monitor;
            vm.$refs.lineChartRef.refresh();
          }
          vm.clicked = payLoad.clicked;
        }
      });
    },
    computed: {
      lineChart: function () {
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
            hour = "" + hour;
          }
          let minute = "" + now.getMinutes();
          if (minute.length === 1) {
            minute = "0" + minute;
          }
          let second = "" + now.getSeconds();
          if (second.length === 1) {
            second = "0" + second;
          }
          return day + "." + month + "." + year + "\n" + hour + ":" + minute + ":" + second; //
        };
        let option;
        let data = this.data;
        let storeData = this.$store.state.objectViewData.data;
        if (data) {
          if (!this.clicked) {
            this.clicked = false;
            return {};
          }
          option = {
            dataZoom: [
              {
                type: 'slider',
                show: true,
                realtime: true,
              },
              {
                type: 'inside',
                show: true,
                realtime: true
              }
            ],
            color: [
              '#5a71e2',
              '#80b2f2',
              '#762dea',
              '#0068ff'
            ],
            textStyle: {
              fontSize: '13',
              color: 'rgba(114, 135, 165, 0.85)'
            },
            categoryAxis: {
              axisLine: {
                show: true,
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: "rgba(114, 135, 165, 0.85)"
                }
              },
              splitLine: {
                show: false
              },

            },
            valueAxis: {
              splitLine: {
                show: false
              },
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                show: true,
                lineStyle: {
                  type: 'dashed',
                  color: 'rgba(255,255,255,0.3)'
                }
              },
              formatter: function (params) {
                let res = '<div>';
                res += '<span>' + formatDate(new Date(params[0].axisValue)) + '</span>';
                res += '<div>';
                params.forEach((item) => {
                  res += '<div>';
                  res += item.marker;
                  res += item.seriesName;
                  res += ': ' + item.data[1];
                  res += '</div>';
                });
                res += '</div>';
                res += '</div>';
                return res;
              },
            },
            legend: {
              data: [],
              type: 'scroll',
              orient: 'vertical',
              right: '2%',
              top: 45,
              bottom: 20,
              textStyle: {
                fontSize: '12',
                color: 'rgba(114, 135, 165, 0.85)'
              }
            },
            toolbox: {
              show: true,
              feature: {
                dataZoom: {
                  yAxisIndex: 'none'
                },
                dataView: {readOnly: false},
                magicType: {type: ['line', 'bar']},
                restore: {},
                saveAsImage: {}
              }
            },
            grid: {
              top: 40,
              left: '5%',
              width: '80%',
              containLabel: true
            },
            xAxis: {
              type: 'time',
              boundaryGap: false,
              axisTick: false,
              axisLine: {
                show: true,
              },
              splitLine: {
                lineStyle: {
                  color: 'rgba(126,140,145,0.1)'
                }
              },
              maxInterval: 3600 * 1000 * 24 * 10,
              axisLabel: {
                textStyle: {
                  color: "rgba(114, 135, 165, 0.85)"
                },
                formatter: (data) => {
                  return formatDate(new Date(data));
                },
              },
            },
            yAxis: {
              type: 'value',
              boundaryGap: false,
              axisLine: {
                show: true,
              },
              axisTick: false,
              splitLine: {
                lineStyle: {
                  color: 'rgba(126,140,145,0.1)'
                }
              },
              axisLabel: {
                textStyle: {
                  color: "rgba(114, 135, 165, 0.85)"
                }
              },
            },
            series: []
          };
          let chartDataSize = 0;
          let grafic = data.graph;
          let sortableGraph = [];
          let selectedAlarms = storeData.alarms.filter(item => {
            return storeData.selectAlarms.includes(item.id);
          });
          for (let prop in grafic) {
            if (grafic.hasOwnProperty(prop)) {
              let graphVal = {
                name: prop,
                values: grafic[prop],
                min: null,
                max: null
              };
              graphVal.max = graphVal.values.sort((a, b) => b.v - a.v)[0].v;
              graphVal.values.sort((a, b) => {
                return a.d - b.d;
              });
              graphVal.min = graphVal.values[0].d;
              sortableGraph.push(graphVal);
            }
          }
          sortableGraph.sort((a, b) => {
            return a.min - b.min;
          });
          sortableGraph.forEach((item) => {
            let name = item.name;
            option.legend.data.push(name);
            let serie = {
              name: name,
              type: 'line',
              data: [],
              showSymbol: false,
              lineStyle: {
                width: 4,
              },
              symbol: 'roundRect'
            };
            if (funcUtils.isNotEmpty(selectedAlarms) && selectedAlarms.length > 0) {
              selectedAlarms.forEach((alarm) => {
                option.series.push({
                  name: alarm.id,
                  type: 'scatter',
                  xAxisIndex: 0,
                  yAxisIndex: 0,
                  data: [],
                  markLine: {
                    animation: false,
                    lineStyle: {
                      normal: {
                        type: 'solid',
                        color: '#FFF',
                        width: 7,
                      }
                    },
                    tooltip: {
                      show: false
                    },
                    data: [[{
                      coord: [alarm.alarmTime, item.max],
                      symbol: 'none'
                    }, {
                      coord: [alarm.alarmTime, 0],
                      symbol: 'none'
                    }]]
                  }
                });
              });
            }
            item.values.forEach((val) => {
              serie.data.push([new Date(val.d), val.v]);
            });
            chartDataSize += 1;
            option.series.push(serie);
          });
          this.chartDataSize = chartDataSize;
        }
        return option;
      }
    }
  }
</script>

<style lang="scss">

</style>
