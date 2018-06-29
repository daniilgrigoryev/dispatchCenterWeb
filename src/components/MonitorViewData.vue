<template>
  <el-container>
    <el-aside width="80px">
      <el-row>
        <el-col class="flex-parent flex-parent--center-main mt24">
          <el-button type="warning" icon="el-icon-bell" circle title="Виджеты и предупреждения"></el-button>
        </el-col>

        <el-col class="flex-parent flex-parent--center-main mt24">
          <el-button type="info" icon="el-icon-menu" circle title="Меню"></el-button>
        </el-col>

        <el-col class="flex-parent flex-parent--center-main mt24">
          <el-button type="info" icon="el-icon-menu" circle title="Меню"></el-button>
        </el-col>

      </el-row>
    </el-aside>

    <el-container>
      <el-header>
        <div class='flex-parent flex-parent--center-main flex-parent--space-between-main'>
          <h3 class='txt-h3 main-heading'>Паспорт метрики</h3>
          <div>
            <el-dropdown class="el-header--user-menu" trigger="click">
              <button class="el-dropdown-link flex-parent flex-parent--center-cross">
                <div class="el-header--user-menu--avatar"></div>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </button>

              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>Делай раз</el-dropdown-item>
                <el-dropdown-item>Делай два</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
      </el-header>

      <el-main>
        <div class='grid grid--gut12'>
          <div class='col col--3'>
            <div class="dashboard-widget">
              <h3 class="dashboard-widget--title">Уровень работоспособности</h3>
              <div id="pieChart" style="width: 100%; height: 300px;"></div>
            </div>

            <div class="dashboard-widget">
              <h3 class="dashboard-widget--title">Список алармов</h3>

              <!--Плашка большого аларма-->
              <div class="dashboard-alarm-primary dashboard-alarm--warning">
                <div class='grid grid--gut12'>
                  <div class='col col--10'>
                    <div>
                      <h4 class="dashboard-alarm-primary--title">Грязное стекло</h4>
                    </div>
                  </div>

                  <div class='col col--2 color-white align-r txt-h4'>
                    <i class="el-icon-more"></i>
                  </div>
                </div>

                <div class='grid'>
                  <div class='col col--6 txt-h1 flex-parent flex-parent--end-cross'>42</div>
                  <div class='col col--6 align-r'>
                    <div class="txt-uppercase txt-s">последний</div>
                    <div class="txt-xl mt-neg6">20:11</div>
                    <div class="txt-xl mt-neg18">16.03.2018</div>
                  </div>
                </div>
              </div>
              <!--/Плашка большого аларма-->

              <!--Плашка малого аларма-->
              <div class="dashboard-alarm-secondary dashboard-alarm--error mt6">
                <div class='grid flex-parent flex-parent--center-cross'>
                  <div class='col col--2 txt-h3'>5</div>
                  <div class='col col--7 txt-bold'>
                    критический
                  </div>
                  <div class='col col--3'>
                    16.03.2018
                  </div>
                </div>
              </div>
              <!--/Плашка малого аларма-->

              <!--Плашка малого аларма-->
              <div class="dashboard-alarm-secondary dashboard-alarm--error  mt6">
                <div class='grid flex-parent flex-parent--center-cross'>
                  <div class='col col--2 txt-h3'>26</div>
                  <div class='col col--7 txt-bold'>
                    критический
                  </div>
                  <div class='col col--3'>
                    16.03.2018
                  </div>
                </div>
              </div>
              <!--/Плашка малого аларма-->

              <!--Плашка малого аларма-->
              <div class="dashboard-alarm-secondary dashboard-alarm--info mt6">
                <div class='grid flex-parent flex-parent--center-cross'>
                  <div class='col col--2 txt-h3'>7</div>
                  <div class='col col--7 txt-bold'>
                    информационный
                  </div>
                  <div class='col col--3'>
                    16.03.2018
                  </div>
                </div>
              </div>
              <!--/Плашка малого аларма-->

              <!--<div id="alarmRules">-->
                <!--<ul id="alarmRulesList"></ul>-->
              <!--</div>-->
            </div>
          </div>
          <div class='col col--9'>
            <div class="dashboard-widget dashboard-widget--transparent">
              <h3 class="dashboard-widget--title">график параметров метрики</h3>
              <div id="lineChart" style="width: 100%; height: 55vh;"></div>
            </div>


              <!--Таблица-->
              <div id="table" style="width: 100%; height:45vh;">
              <table id="example" class="display nowrap" style="width:100%; height: inherit;">
              <thead>
              <tr>
              <th>Наименование</th>
              <th>Предупреждений</th>
              <th>Прошло времени после первого</th>
              <th>Прошло времени после последнего</th>
              <th>Примечание</th>
              </tr>
              </thead>
              </table>
              </div>
              <!--/Таблица-->


          </div>

        </div>


      </el-main>
      <!--<el-footer>-->
        <!--<div class='grid'>-->
          <!--<div class='col col&#45;&#45;4'>-->
            <!--<h3 class="dashboard-widget&#45;&#45;title">Поиск объектов</h3>-->

            <!--<el-input placeholder="Поиск...">-->
              <!--<el-button slot="append" type="primary" icon="el-icon-search"></el-button>-->
            <!--</el-input>-->
          <!--</div>-->
          <!--<div class='col col&#45;&#45;8'></div>-->
        <!--</div>-->
      <!--</el-footer>-->
    </el-container>
  </el-container>


</template>

<style scoped>

  .el-main {
    padding: 12px;
  }
  .dataTables_scrollBody {
    max-height: 400px !important;
  }

  .el-container {
    height: 100vh;
  }

  .el-aside {
    /*background: #101823;*/
    /*background: #373E48;*/
    background: linear-gradient(to right, rgb(38, 39, 42), rgb(43, 54, 65));
    border-right: 1px solid #192a40;
  }

  .el-header {
    height: 40px !important;
    padding: 5px 25px;
    /*background: linear-gradient(to bottom, rgba(137, 168, 251, 0.14) 0%, rgba(255, 255, 255, 0) 100%);*/
    /*border-bottom: 1px solid rgba(82, 112, 147, 0.1);*/
  }

  .el-header--user-menu {
    color: white;
  }

  .el-header--user-menu--avatar {
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background: #4e4f60 url('../assets/img/user-avatar.svg') no-repeat center 130%;
    background-size: contain;
  }

  .el-footer {
    height: 90px !important;
  }

  .el-button--danger {
    background: #F82892;
    border-color: #F82892;
  }

  .main-heading {
    font-size: 24px;
  }

  .dashboard-widget {
    min-height: 100px;
    padding: 10px;
    margin-bottom: 14px;
    /*background: #262D47;*/
    /*background: linear-gradient(to right, rgb(20, 30, 48), rgb(36, 59, 85));*/
    background: linear-gradient(to right, rgb(55, 57, 61), rgb(43, 54, 65));
    border: 1px solid #384453;
    border-radius: 4px;
    box-shadow: 0 0 30px #060b0f1a;
  }

  .dashboard-widget--transparent {
    background: transparent;
  }

  .dashboard-widget--title {
    margin-bottom: 4px;
    /*color: #7d818d;*/
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 13px;
  }

  .dashboard-alarm-primary {
    padding: 5px 10px;
    color: #52093cde;
  }

  .dashboard-alarm-primary--title {
    font-size: 24px;
  }

  .dashboard-alarm-secondary {
    padding: 5px 10px;
    line-height: 0.9;
    color: white;
  }

  .dashboard-alarm--warning {
    background: linear-gradient(to left, rgb(254, 140, 0), rgb(248, 54, 0));
  }

  .dashboard-alarm--error {
    background: linear-gradient(to left, rgb(237, 33, 58), rgb(147, 41, 30));
  }

  .dashboard-alarm--info {
    background: linear-gradient(to right, rgb(51, 45, 75), rgb(146, 141, 171));
  }

</style>

<script>
  import * as ConstantUtils from './../assets/js/utils/constantUtils';
  import * as RequestEntity from './../assets/js/api/requestEntity';
  import {RequstApi} from './../assets/js/api/requestApi';
  import * as funcUtils from "./../assets/js/utils/funcUtils";
  import echarts from "./../assets/js/vendor/echarts.min";
  import $ from "jquery";
  import 'datatables.net-dt/css/jquery.dataTables.css'
  import 'datatables.net-scroller-dt/css/scroller.dataTables.css'
  import 'datatables.net-dt/js/dataTables.dataTables.js'
  import 'datatables.net-scroller-dt/js/scroller.dataTables.js'

  export default {
    name: "MonitorViewData",
    data() {
      return {
        monitorViewData: this.$store.state.monitorViewData.data
      }
    },
    beforeCreate: function () {
      let currentComponent;
      let componentsRoute = JSON.parse(sessionStorage.getItem(sessionStorage.getItem('wid')));
      currentComponent = funcUtils.getCurrentComponent(componentsRoute);
      if (currentComponent === null) {
        currentComponent = funcUtils.getNextComponent(this.$store.state.monitorViewData.bean);
      }
      this.$store.dispatch('monitorDictSetCid', currentComponent.cid);
      let wid = sessionStorage.getItem('wid');
      let method;
      let params;
      if (!!this.$route.params.ruleId && !!this.$route.params.dateBeg) {
        method = 'getData';
        params = this.$route.params;
      } else {
        method = 'restore';
        params = null;
      }
      let requestHead = new RequestEntity.RequestHead(localStorage.getItem('sid'), wid, currentComponent.cid, this.$store.state.monitorViewData.bean, method);
      let requestParam = new RequestEntity.RequestParam(requestHead, params);
      let eventResponse = RequstApi.sendRequest(ConstantUtils.REQUEST_TYPE_HTTP, requestParam);
      if (eventResponse.status === 200) {
        this.$store.dispatch('fillModule', {'selfStore': this.$store, 'event': eventResponse});
      }
    },
    mounted: function () {
      this.drawLineChart(this.monitorViewData);
      this.fillTopObjects(this.monitorViewData);
      this.drawPieChart(this.monitorViewData);
      this.fillRules(this.monitorViewData);
    },
    methods: {
      getNext: function () {
        funcUtils.getNextComponent(this.$store.state.monitorViewData.bean);
        this.$router.push('/test');
      },
      getPrev: function () {
        funcUtils.getPrevComponent();
        this.$router.push('/monitorDict');
      },
      drawPieChart: function (data) {
        // based on prepared DOM, initialize echarts instance
        let myChart = echarts.init(document.getElementById('pieChart'));
        let levels = [];
        let legend = [];
        let levelsCount = {};
        let pie = data.alarms;
        for (let i = 0; i < pie.length; i++) {
          let name = 'Уровень ' + pie[i].level;
          let name1 = 'Уровень ' + 2;
          let name2 = 'Уровень ' + 3;
          let name3 = 'Уровень ' + 4;
          if (!legend.includes(name)) {
            legend.push(name);
          }
          if (!legend.includes(name1)) {
            legend.push(name1);
          }
          if (!legend.includes(name2)) {
            legend.push(name2);
          }
          if (!legend.includes(name3)) {
            legend.push(name3);
          }
          let level = levelsCount[name];
          let level1 = levelsCount[name1];
          let level2 = levelsCount[name2];
          let level3 = levelsCount[name3];
          if (undefined === level) {
            levelsCount[name] = 0;
          }
          if (undefined === level1) {
            levelsCount[name1] = 178;
          }
          if (undefined === level2) {
            levelsCount[name2] = 345;
          }
          if (undefined === level3) {
            levelsCount[name3] = 232;
          }
          levelsCount[name] = ++levelsCount[name];
        }

        for (let j = 0; j < legend.length; j++) {
          levels.push({
            value: levelsCount[legend[j]],
            name: legend[j]
          });
        }

        let option = {
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'horizontal',
            x: 'center',
            y: 'bottom',
            textStyle: {
              fontSize: '13',
              color: 'rgba(255, 255, 255, 0.8)'
            },
            data: legend
          },

          series: [
            {
              name: 'Уровни:',
              type: 'pie',
              radius: ['65%', '75%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '17',
                    fontWeight: 'bold'
                  }
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              },
              data: levels
            }
          ]
        };

        myChart.setOption(option);
      },
      drawLineChart: function (data) {
        let sortNumber = function (a, b) {
          return a[0] - b[0];
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
          return day + "." + month + "." + year + " " + hour + ":" + minute + ":" + second;
        };

        if (data.selectAlarms.length > 0 && data.selectObj.length > 0) {

        } else {
          // based on prepared DOM, initialize echarts instance
          let myChart = echarts.init(document.getElementById('lineChart'));
          let legend = [];
          let series = [];
          let xAxis = {
            type: 'time',
            boundaryGap: false,
            data: [],
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,0.1)'
              }
            },
            axisLabel: {
              show: true,
              rotate: 0,
              margin: 8,
              formatter: (value) => {
                return formatDate(new Date(value));
              }
            },
          };
          for (let i = 0; i < data.items.length; i++) {
            legend.push(data.items[i].name);
          }
          if (data.selectAlarms.length > 0 && data.selectObj.length > 0) {

          } else {
            let graph = data.graph[Object.keys(data.graph)[0]];
            for (let j = 0; j < legend.length; j++) {
              let xAxisData = graph[legend[j]];
              let serie = {
                name: legend[j],
                type: 'line',
                lineStyle: {
                  width: 4,
                },
                data: []
              };
              for (let k = 0; k < xAxisData.length; k++) {
                // xAxis.data.push(xAxisData[k].d);
                serie.data.push([xAxisData[k].d, xAxisData[k].v]);
              }
              serie.data.sort(sortNumber);
              series.push(serie);
            }
            // xAxis.data.sort(sortNumber);
            /*for (let a = 0; a < xAxis.data.length; a++) {
              xAxis.data[a] = new Date(formatDate(new Date(xAxis.data[a])));
            */
          }

          // specify chart configuration item and data
          let option = {
            dataZoom: [
              {
                type: 'inside',
                realtime: true,
              }
            ],
            textStyle: {
              fontSize: '12',
              color: 'rgba(255,255,255,0.4)'
            },
            tooltip: {
              trigger: 'axis',
              formatter: function (params) {
                if (!!params && params.length > 0) {
                  let message = formatDate(new Date(params[0].axisValue)) + '<br />';
                  for (let i = 0; i < params.length; i++) {
                    message += params[i].marker + params[i].seriesName + ': ' + params[i].data[1] + '<br />';
                  }
                  return message;
                }
              },
            },
            legend: {
              textStyle: {
                fontSize: '12',
                color: '#64b2e4'
              },
              type: 'scroll',
              orient: 'vertical',
              right: 0,
              top: 0,
              width: 20,
              data: legend
            },
            grid: {
              top: 10,
              left: 20,
              right: 180,
              bottom: 0,
              containLabel: true
            },

            // toolbox: {
            //   feature: {
            //     mark: {show: true},
            //     dataView: {show: true, readOnly: false},
            //     magicType: {show: true, type: ['line', 'bar']},
            //     restore: {show: true},
            //     saveAsImage: {show: true}
            //   }
            // },
            xAxis: xAxis,
            yAxis: {
              type: 'value',
              splitLine: {
                lineStyle: {
                  type: 'dashed',
                  color: 'rgba(255,255,255,0.1)'
                }
              },
            },
            series: series
          };

          // use configuration item and data specified to show chart
          myChart.setOption(option);
        }
      },
      fillTopObjects: function (data) {
        let sortNumberTemp = function (a, b) {
          return b.lastAlarm - a.lastAlarm;
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
          return day + "." + month + "." + year + " " + hour + ":" + minute + ":" + second;
        };
        let objects = data.objects;
        let sortedObjects = objects.sort(sortNumberTemp);

        let dataTable = [];
        for (let i = 0; i < sortedObjects.length; i++) {
          dataTable.push([sortedObjects[i].name, sortedObjects[i].alarms, Math.round(((new Date().getTime() - sortedObjects[i].firstAlarm) / 1000 / 60 / 24)) + ' ч', Math.round(((new Date().getTime() - sortedObjects[i].lastAlarm) / 1000 / 60 / 24)) + ' ч', sortedObjects[i].note]);
        }
        let table = $('#example').DataTable({
          data: dataTable,
          deferRender: true,
          scrollY: 100,
          scrollCollapse: true,
          scroller: true,
          order: [[2, "desc"]]
        });
      },
      fillRules: function (data) {
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
        let rules = data.alarmRules;
        let alarms = data.alarms;
        let rulesData = {};
        let rulesList = [];
        for (let i = 0; i < rules.length; i++) {
          let rule = rulesData[rules[i].id];
          if (undefined === rule) {
            rulesData[rules[i].id] = {
              id: rules[i].id,
              note: rules[i].note,
              count: 0,
              alarmLastTime: null
            };
          }
        }
        for (let j = 0; j < alarms.length; j++) {
          let ruleData = rulesData[alarms[j].alarmRuleId];
          ruleData.count++;
          if (ruleData.alarmLastTime < alarms[j].alarmTime) {
            ruleData.alarmLastTime = alarms[j].alarmTime;
          }
        }
        for (let prop in rulesData) {
          if (rulesData.hasOwnProperty(prop)) {
            rulesList.push(rulesData[prop]);
          }
        }
        let ul = $('#alarmRulesList');
        for (let k = 0; k < rulesList.length; k++) {
          let li = '<li>' + rulesList[k].note + ', ' + rulesList[k].count + ', ' + formatDate(new Date(rulesList[k].alarmLastTime)) + '</li>';
          ul.append(li);
        }
      }
    }
  }
</script>

