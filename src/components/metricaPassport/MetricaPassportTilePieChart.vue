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
            <el-button @click="cmp" size="mini" class="dc-button-icon-small">
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
    <echarts
      :options="pieChart"
      auto-resize
    >
    </echarts>
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
  import echarts from 'vue-echarts/components/ECharts'

  export default {
    props: {
      title: {
        type: String
      }
    },
    components: {echarts},
    data: function () {
      return {
        typesAlert: 0,
        alerts: 0,
        objectsAlert: 0,
        chartDataSize: 0
      }
    },
    computed: {
      pieChart: function () {
        let chartData = this.$store.state.monitorViewData.data;
        let option;
        if (chartData) {
          // based on prepared DOM, initialize echarts instance
          option = {
            tooltip: {
              padding: 5,
              backgroundColor: 'rgba(44,50,61,0.85)',
              borderWidth: 1,
              formatter: function (params) {
                return `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="margin-right: 10px;">
                                    <div style="font-size: 10px; font-weight: 300; text-transform: uppercase; letter-spacing: 1.5px; color: #89a1c2;">${params.seriesName}</div>
                                    <div style="font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 2px;">${params.data.name}</div>
                                </div>
                                <div style="font-size: 24px; font-weight: 600;">${params.data.value}</div>
                            </div>`;
              }
            },
            color: [],
            legend: {
              show: false
            },
            series: [
              {
                name: 'Тип',
                type: 'pie',
                radius: [0, '30%'],
                selectedMode: false,
                emphasis: {
                  show: true,
                  label: {
                    show: false,
                    formatter: function (params) {
                      return ``
                    }
                  }
                },
                itemStyle: {
                  shadowBlur: 20,
                },
                label: {
                  normal: {
                    show: false
                  },
                },
                data: []
              },
              {
                name: 'Уровень',
                type: 'pie',
                radius: ['40%', '55%'],
                selectedMode: false,
                emphasis: {
                  show: true,
                  label: {
                    show: false,
                    formatter: function (params) {
                      return ``
                    }
                  }
                },
                itemStyle: {
                  shadowBlur: 20,
                },
                label: {
                  normal: {
                    show: false
                  },
                },
                data: []
              }
            ]
          };
          let rules = chartData.alarmRules;
          let alarms = chartData.alarms;
          let selectedAlarms = chartData.selectAlarms;
          let legend = [];
          let levelsCount = {};
          let rulesData = {};
          option.color = [];
          let levelColors = option.color;
          this.alerts = selectedAlarms.length > 0 ? selectedAlarms.length : alarms.length;
          this.objectsAlert = chartData.selectObj.length > 0 ? chartData.selectObj.length : chartData.objects.length;
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
              option.series[0].data.push({
                'value': rule.count,
                'name': rule.note
              });
              // option.legend.data.push(rule.note);
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
            option.series[1].data.push({
              'value': levelsCount[legend[j]],
              'name': legend[j]
            });
            // option.legend.data.push(legend[j]);
          }
          this.typesAlert = option.series[0].data.length;
          this.chartDataSize = option.series[0].data.length + option.series[1].data.length;
        }
        return option;
      }
    },
    methods: {
      cmp: function () {
        let chartData = this.$store.state.monitorViewData.data;
        if (chartData) {
          chartData.alarmRules = [];
          chartData.alarms = [];
          chartData.graph = {};
          this.$store.dispatch('monitorViewDataSetData', {data: chartData});
        }
      }
    },
    mounted: function () {
      setTimeout(function () {
        // TODO: убрать злобный хак ресайза окна! - но иначе графикв выездает за пределы блока
        window.dispatchEvent(new Event('resize'));
      }, 500)
    }
  }
</script>

<style>
  .ve-pie {
    margin: auto;
  }
</style>
