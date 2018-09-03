<template>
  <div style="height: 100%;">
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
        <div class="dc-widget-item__caption">по времени</div>
      </div>

      <div class="dc-widget-grid__item__header__right-column">
        <div class="dc-widget-grid__item__header__buttons">
          <el-tooltip class="item" effect="dark" content="Показать легенду" placement="left-start">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-tag-small-white.svg" alt="">
            </el-button>
          </el-tooltip>

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
      style="width: 100%"
      :options="lineChart"
      auto-resize
    >
    </echarts>
    <!--/Линейная диаграмма-->
  </div>
</template>

<script>
  import echarts from 'vue-echarts/components/ECharts'

    export default {
        name: "AlarmPassportTileLineChart",
      components: {echarts},
      props: {
        title: {
          type: String
        }
      },
      data() {
        return {
          chartDataSize: 0
        }
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
          let data = this.$store.state.alarmViewData.data;
          if (data) {
            option = {
              dataZoom: [
                {
                  type: 'slider',
                  show: true,
                  realtime: true,
                  bottom: '6%'
                },
                {
                  type: 'inside',
                  show: true,
                  realtime: true
                }
              ],
              color:
                [
                  '#0f0',
                  '#ba55d3',
                  '#87ceeb',
                  '#ff6969',
                  '#ffd700',
                  '#ffe4b5',
                  '#8a2be2',
                  '#c71585',
                  '#008080',
                  '#b22222',
                  '#e0830a',
                  '#1c91c0',
                  '#00c000',
                  '#c0c0c0',
                  '#9999ff',
                  '#afffaf',
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
                padding: 5,
                backgroundColor: 'rgba(44,50,61,0.9)',
                borderWidth: 1,
                textStyle: {
                  color: "#c7cae2"
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
                }
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
              xAxis: null,
              yAxis: {
                type: 'value',
                boundaryGap: false,
                splitLine: {
                  show: false
                }
              },
              series: null
            };
            let series = [];
            let xAxis = {
              type: 'time',
              boundaryGap: false,
              maxInterval: 3600 * 1000 * 24 * 10,
              splitLine: {
                show: false
              },
              axisLabel: {
                formatter: (data) => {
                  return formatDate(new Date(data));
                },
              },
            };
            let chartDataSize = 0;
            let grafic = data.graph;
            let sortableGraph = [];
            for (let prop in grafic) {
              if (grafic.hasOwnProperty(prop)) {
                let graphVal = {
                  name: prop,
                  values: grafic[prop],
                  min: null
                };
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
              item.values.forEach((val) => {
                serie.data.push([new Date(val.d), val.v]);
              });
              chartDataSize += 1;
              series.push(serie);
            });
            this.chartDataSize = chartDataSize;
            option.xAxis = xAxis;
            option.series = series;
          }
          return option;
        }
      }
    }
</script>

<style scoped>

</style>
