<template>
  <div>
    <div id="pieChart" style="position: absolute; left: 0; top: 0; width: 35vw; height:25vh;"></div>
    <div id="lineChart" style="position: absolute; right: 0; top: 0; width: 60vw; height:55vh;"></div>
    <div id="table" style="position: absolute; right: 0; bottom: 0; width: 60vw; height:45vh;">
      <table id="example" class="display nowrap" style="width:100%">
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
    <div id="alarmRules" style="position: absolute; left: 0; bottom: 0; width: 60vw; height:45vh;"><ul id="alarmRulesList"></ul></div>
    <button style="position: relative;" v-on:click="getPrev">Prev</button>
    <button style="position: relative;" v-on:click="getNext">Next</button>
  </div>
</template>

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
      debugger;
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
      debugger;
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
          if (!legend.includes(name)) {
            legend.push(name);
          }
          let level = levelsCount[name];
          if (undefined === level) {
            levelsCount[name] = 0;
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
            orient: 'vertical',
            x: 'center',
            data: legend
          },
          series: [
            {
              name:'Уровни:',
              type:'pie',
              radius: ['40%', '50%'],
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'center'
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: '20',
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
            axisLabel: {
              show: true,
              rotate: 45,
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
            title: {
              text: 'График'
            },
            dataZoom: {
              show: true,
              realtime: true
            },
            tooltip: {
              trigger: 'axis',
              formatter: function(params) {
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
              data: legend
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                magicType: { show: true, type: ['line', 'bar'] },
                restore: { show: true },
                saveAsImage: { show: true }
              }
            },
            xAxis: xAxis,
            yAxis: {
              type: 'value'
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
        for (let i = 0 ; i < sortedObjects.length; i++) {
          dataTable.push([sortedObjects[i].name, sortedObjects[i].alarms, Math.round(((new Date().getTime() - sortedObjects[i].firstAlarm) / 1000 / 60 / 24)) + ' ч', Math.round(((new Date().getTime() - sortedObjects[i].lastAlarm) / 1000 / 60 / 24)) + ' ч', sortedObjects[i].note]);
        }
        let table = $('#example').DataTable({
          data:           dataTable,
          deferRender:    true,
          scrollY:        100,
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

<style>
  .dataTables_scrollBody {
    max-height: 400px !important;
  }
</style>
