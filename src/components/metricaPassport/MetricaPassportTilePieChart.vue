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

    <!--Круговая диаграмма-->
    <ve-pie
      :data="chartData"
      :theme="theme"
      ref="pieChart"
      :settings="chartSettings"
      :legend-visible="false">
      <div v-if="chartDataSize <= 0" class="data-empty">data empty😂</div>
    </ve-pie>
    <!--/Круговая диаграмма-->

    <!--Футер тайла-->
    <div class="dc-widget-grid__item__footer">
      <div class="dc-widget-item__caption">
        типов :
        <span class="dc-widget-item__caption__value--2">{{typesAlert}}</span>
      </div>
      <div class="dc-widget-item__caption">
        алертов:
        <span class="dc-widget-item__caption__value--2">{{alerts}}</span>
      </div>
      <div class="dc-widget-item__caption">
        на объектах:
        <span class="dc-widget-item__caption__value--2">{{objectsAlert}}</span>
      </div>
    </div>
    <!--/Футер тайла-->
  </div>
</template>

<script>
  import VePie from 'v-charts/lib/pie.common' // https://v-charts.js.org/#/en/start'

  export default {
    components: {VePie},
    props: {
      title: {
        type: String
      }
    },
    data: function () {
      return {
        theme: {
          pie: {
            color: [],
            tooltip: {
              padding: 5,
              backgroundColor: 'rgba(44,50,61,0.85)',
              borderWidth: 1,
              formatter: function (params) {
                let title = 'Тип';
                if (
                  params.data.name === 'Незаметный' ||
                  params.data.name === 'Низкий' ||
                  params.data.name === 'Нормальный' ||
                  params.data.name === 'Высокий' ||
                  params.data.name === 'Срочный') {
                  title = 'Уровень';
                }
                return `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="margin-right: 10px;">
                                    <div style="font-size: 10px; font-weight: 300; text-transform: uppercase; letter-spacing: 1.5px; color: #89a1c2;">${title}</div>
                                    <div style="font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">${params.data.name}</div>
                                </div>
                                <div style="font-size: 24px; font-weight: 600;">${params.data.value}</div>
                            </div>`;
              }
            }
          }
        },
        chartSettings: {
          selectedMode: false,
          radius: 140,
          offsetY: 160,
          itemStyle: {
            shadowBlur: 20,
            emphasis: {
              show: true,
              label: {
                show: false,
                formatter: function (params) {
                  return ``
                }
              }
            }
          },
          label: {
            normal: {
              show: false,
            },
          },
          color: [],
          level: []
        },
        typesAlert: 0,
        alerts: 0,
        objectsAlert: 0,
        chartDataSize: 0
      }
    },
    computed: {
      chartData: function () {
        let chartData = this.getPieChartData();
        let res;
        if (chartData) {
          let arr = chartData.rows[0].concat(chartData.rows[1]);
          res = {
            columns: chartData.columns,
            rows: arr
          };
          this.chartSettings.level = chartData.names;
        }
        return res;
      }
    },
    mounted: function () {
      setTimeout(function () {
        // TODO: убрать злобный хак ресайза окна! - но иначе графикв выездает за пределы блока
        window.dispatchEvent(new Event('resize'));
      }, 500)
    },
    methods: {
      getPieChartData() {
        let res;
        let data = this.$store.state.monitorViewData.data;
        if (null !== data) {
          let rules = data.alarmRules;
          let alarms = data.alarms;
          let selectedAlarms = data.selectAlarms;
          let rows = [[], []];
          let names = [[], []];
          let legend = [];
          let levelsCount = {};
          let rulesData = {};
          this.theme.pie.color = [];
          let levelColors = this.theme.pie.color;
          this.alerts = selectedAlarms.length > 0 ? selectedAlarms.length : alarms.length;
          this.objectsAlert = data.selectObj.length > 0 ? data.selectObj.length : data.objects.length;
          // Типы
          for (let m = 0; m < rules.length; m++) {
            let rule = rulesData[rules[m].id];
            if (undefined === rule) {
              rulesData[rules[m].id] = {
                id: rules[m].id,
                note: rules[m].note,
                count: 0,
                alarmLastTime: null
              };
            }
          }

          for (let n = 0; n < alarms.length; n++) {
            if (selectedAlarms.length > 0 && !selectedAlarms.includes(alarms[n].id)) {
              continue;
            }
            let ruleData = rulesData[alarms[n].alarmRuleId];
            ruleData.count++;
            if (ruleData.alarmLastTime < alarms[n].alarmTime) {
              ruleData.alarmLastTime = alarms[n].alarmTime;
            }
          }
          let k = 0;
          for (let prop in rulesData) {
            if (rulesData.hasOwnProperty(prop) && rulesData[prop].count > 0) {
              if (!levelColors.includes('#00dbff') && k === 0) {
                levelColors.push('#00dbff');
              } else if (!levelColors.includes('#8979b2') && k === 1) {
                levelColors.push('#8979b2');
              } else if (!levelColors.includes('#936152') && k === 2) {
                levelColors.push('#936152');
              }
              let rule = rulesData[prop];
              rows[0].push({
                'name': rule.note,
                'value': rule.count
              });
              names[0].push(rule.note);
            }
            k++;
          }
          // Уровни
          for (let i = 0; i < alarms.length; i++) {
            if (selectedAlarms.length > 0 && !selectedAlarms.includes(alarms[i].id)) {
              continue;
            }
            let name;
            switch (alarms[i].level) {
              case 1: {
                name = 'Незаметный';
                if (!levelColors.includes('#496c7f')) {
                  levelColors.push('#496c7f');
                }
                break;
              }
              case 2: {
                name = 'Низкий';
                if (!levelColors.includes('#15c565')) {
                  levelColors.push('#15c565');
                }
                break;
              }
              case 3: {
                name = 'Нормальный';
                if (!levelColors.includes('#d39909')) {
                  levelColors.push('#d39909');
                }
                break;
              }
              case 4: {
                name = 'Высокий';
                if (!levelColors.includes('#ff6600')) {
                  levelColors.push('#ff6600');
                }
                break;
              }
              case 5: {
                name = 'Срочный';
                if (!levelColors.includes('#f72806')) {
                  levelColors.push('#f72806');
                }
                break;
              }
            }
            if (!legend.includes(name)) {
              legend.push(name);
            }
            let level = levelsCount[name];
            if (!level) {
              levelsCount[name] = 0;
            }
            levelsCount[name] = ++levelsCount[name];
          }
          for (let j = 0; j < legend.length; j++) {
            rows[1].push({
              'name': legend[j],
              'value': levelsCount[legend[j]]
            });
            names[1].push(legend[j]);
          }
          this.typesAlert = names[0].length;
          res = {
            columns: ['name', 'value'],
            rows: rows,
            names: names
          };
          this.chartDataSize = rows[0].length + rows[1].length;
        }
        return res;
      }
    }
  }
</script>

<style>
  .ve-pie {
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
