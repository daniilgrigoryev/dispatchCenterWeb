<template>
  <div>
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

    <ve-line
      :data="chartData"
      :settings="chartSettings"
      :theme="theme"
      :legend="legend"
      :toolbox="chartOptions.toolbox"
      :legend-visible="true"
      :data-zoom="chartOptions.dataZoom">
      <div v-if="chartDataSize <= 0" class="data-empty">data empty😂</div>
    </ve-line>

    <!--/Линейная диаграмма-->
  </div>
</template>

<script>
  import VeLine from 'v-charts/lib/line.common' // https://v-charts.js.org/#/en/start

  export default {
    components: {VeLine},
    props: {
      title: {
        type: String
      }
    },
    data() {
      return {
        theme: {
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
          grid: {
            top: 40,
            left: '5%',
            width: '80%'
          },
          textStyle: {
            fontSize: '13',
            color: 'rgba(114, 135, 165, 0.85)'
          },
          "line": {
            lineStyle: {
              width: 4,
            },
            smooth: true,
            symbol: 'roundRect',

          },
          "categoryAxis": {
            "axisLine": {
              "show": true,
            },
            "axisLabel": {
              "show": true,
              "textStyle": {
                "color": "rgba(114, 135, 165, 0.85)"
              }
            },
            "splitLine": {
              "show": false
            },

          },
          "valueAxis": {
            "splitLine": {
              "show": false
            },
          },
          tooltip: {
            padding: 5,
            backgroundColor: 'rgba(44,50,61,0.9)',
            borderWidth: 1,
            textStyle: {
              color: "#c7cae2"
            }
          }
        },
        legend: {
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
        chartOptions: {
          dataZoom: [{
            type: 'inside'
          }, {
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
          toolbox: {
            show : true,
            feature : {
              mark : {show: true},
              dataView : {show: true, readOnly: false},
              magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
              restore : {show: true},
              saveAsImage : {show: true}
            }
          }
        },
        chartDataSize: 0
      }
    },
    computed: {
      chartData: function () {
        let chartData = this.getLineChartData();
        let res;
        if (chartData) {
          res = {
            columns: chartData.columns,
            rows: chartData.rows
          };
        }
        return res;
      },
      chartSettings: function () {
        let chartData = this.getLineChartData();
        let res;
        if (chartData) {
          res = {
            labelMap: chartData.labelMap
          };
        }
        return res;
      }
    },
    methods: {
      getLineChartData() {
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
          return day + "." + month + "." + year; // + " " + hour + ":" + minute + ":" + second
        };
        let res;
        let data = this.$store.state.monitorViewData.data;
        if (data) {
          let columns = [];
          let labelMap = {};
          let rows = [];
          let grafic = data.graph;
          let cnt = 0;
          columns.push('date');
          labelMap['date'] = 'Фиксации';
          let parsedDataGraph = {};
          for (let k in grafic) {
            if (grafic.hasOwnProperty(k)) {
              let graph = grafic[k];
              let graphName = '';
              if (k !== 0) {
                data.objects.forEach((obj) => {
                  if (obj.id == k) {
                    graphName = ' ' + obj.name;
                  }
                });
              }
              for (let i = 0; i < data.items.length; i++) {
                let column = data.items[i].marker + graphName;
                let columnItem = data.items[i].name + graphName;
                if (!columns.includes(column)) {
                  columns.push(column);
                }
                labelMap[column] = columnItem;
                let dataGraph = graph[data.items[i].name];
                // dataGraph.sort(sortNumber);
                for (let m = 0; m < dataGraph.length; m++) {
                  let date = formatDate(new Date(dataGraph[m].d));
                  if (undefined === parsedDataGraph[date]) {
                    parsedDataGraph[date] = {};
                  }
                  let count = parsedDataGraph[date][columnItem];
                  if (!count) {
                    count = 0;
                  }
                  count += dataGraph[m].v;
                  parsedDataGraph[date][column] = count;
                }
              }
            }
          }
          for (let prop in parsedDataGraph) {
            if (parsedDataGraph.hasOwnProperty(prop)) {
              let obj = {};
              obj['date'] = prop;
              for (let innerProp in parsedDataGraph[prop]) {
                if (parsedDataGraph[prop].hasOwnProperty(innerProp)) {
                  obj[innerProp] = parsedDataGraph[prop][innerProp];
                }
              }
              rows.push(obj);
            }
          }
          rows.sort(sortDate);
          res = {
            columns: columns,
            rows: rows,
            labelMap: labelMap
          };
          cnt++;
          this.chartDataSize = cnt;
        }
        return res;
      }
    }
  }
</script>

<style>
  .ve-line {
    margin: auto;
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
