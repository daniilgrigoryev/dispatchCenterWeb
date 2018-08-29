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
        let sortNumber = function (a, b) {
          return a[Object.keys(a)[0]] - b[Object.keys(b)[0]];
        };
        let sortDate = function (a, b) {
          let date1 = a[Object.keys(a)[0]];
          let date2 = b[Object.keys(b)[0]];
          let day1 = date1.substring(0, date1.indexOf('.'));
          let day2 = date2.substring(0, date2.indexOf('.'));
          let month1 = date1.substring(date1.indexOf('.') + 1, date1.lastIndexOf('.'));
          let month2 = date2.substring(date2.indexOf('.') + 1, date2.lastIndexOf('.'));
          let year1 = date1.substring(date1.lastIndexOf('.') + 1, date1.length);
          let year2 = date2.substring(date2.lastIndexOf('.') + 1, date2.length);
          let parsedDate1 = new Date(year1, month1 - 1, day1, '00', '00', '00');
          let parsedDate2 = new Date(year2, month2 - 1, day2, '00', '00', '00');
          return parsedDate1.getTime() - parsedDate2.getTime();
        };
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
          return day + "." + month + "." + year + "\n" + hour + ":" + minute + ":" + second; //
        };
        let option;
        let data = this.$store.state.monitorViewData.data;
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
          let grafic = data.graph;
          let chartDataSize = 0;
          let sortableGraph = [];
          for (let prop in grafic) {
            if (grafic.hasOwnProperty(prop)) {
              let graphVal = {
                id: +prop,
                graphName: '',
                values: [],
                min: null
              };
              if (graphVal.id !== 0) {
                data.objects.forEach((obj) => {
                  if (obj.id === graphVal.id) {
                    graphVal.graphName = obj.name;
                  }
                });
              }
              let values = Object.entries(grafic[prop]);
              values.forEach((item) => {
                let value = {
                  name: item[0],
                  items: item[1]
                };
                value.items.sort((a,b) => {
                  return a.d - b.d;
                });
                value.min = value.items[0].d;
                if (graphVal.min > value.min || graphVal.min === null) {
                  graphVal.min = value.min;
                }
                graphVal.values.push(value);
              });
              graphVal.values.sort((a,b) => {
                return a.min - b.min;
              });
              sortableGraph.push(graphVal);
            }
          }
          sortableGraph.sort((a,b) => {
            return a.min - b.min;
          });
          sortableGraph.forEach((item) => {
            item.values.forEach((itemVal) => {
              let name = itemVal.name + ' ' + item.graphName;
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
              itemVal.items.forEach((val) => {
                serie.data.push([new Date(val.d), val.v]);
              });
              chartDataSize += 1;
              series.push(serie);
            });
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

<style>
  .ve-line {
    margin: auto;
  }
</style>
