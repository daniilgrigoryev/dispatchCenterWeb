<template>
  <div style="height: 100%;">
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
      style="width: 100%; height: 310px;"
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
  import echarts from 'vue-echarts/components/ECharts';
  import * as funcUtils from "../../assets/js/utils/funcUtils";

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
              trigger: 'item',
              formatter: function (params) {
                if (params.seriesName === 'Тип') return;
              }
            },
            series: [
              // "ТИПЫ"
              {
                name: 'Тип',
                type: 'pie',
                radius: ['35%', '55%'],
                selectedMode: false,
                itemStyle: {
                  shadowBlur: 15,
                  emphasis: {
                    show: true,
                    label: {
                      show: false,
                      formatter: function (params) {
                        return `{title|${params.data.name}}\n{value|${params.data.value}}\n{subtitle|алертов}`
                      },
                      borderRadius: 10,
                      padding: 5,

                      textStyle: {
                        textTransform: 'uppercase'
                      },

                      rich: {
                        title: {
                          color: "white",
                          fontSize: 12,
                          fontWeight: 300,
                          opacity: 1,
                          backgroundColor: "rgba(44,50,61,0.7)",
                          borderRadius: 6,
                          padding: [6, 6],
                          lineHeight: 15,
                          textTransform: 'uppercase'
                        },
                        value: {
                          color: 'white',
                          borderRadius: 2,
                          fontSize: '40',
                          fontWeight: 300,
                          padding: [5, 10],
                          lineHeight: 50,
                        },
                        subtitle: {
                          color: "white",
                          fontSize: 14,
                          fontWeight: 300,
                          opacity: 0.2,
                          lineHeight: 1,
                        },
                      }
                    }
                  }
                },
                avoidLabelOverlap: false,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                data: []
              },
              // "УРОВНИ"
              {
                name: 'Уровень',
                type: 'pie',
                radius: ['70%', '90%'],
                selectedMode: false,

                label: {
                  normal: {
                    show: false,
                    position: 'center',
                    backgroundColor: 'rgba(44,50,60,0.6)',
                    color: 'red'
                  },
                },
                tooltip: {
                  padding: 10,
                  backgroundColor: 'rgba(44,50,61,0.7)',
                  borderWidth: 1,
                  formatter: function (params) {
                    return `
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <div style="margin-right: 20px;">
                                    <div style="font-size: 12px; font-weight: 300; color: white;">Уровень аларма</div>
                                    <div style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">${params.data.name}</div>
                                </div>
                                <div style="font-size: 32px; font-weight: 300;">${params.data.value}</div>
                            </div>`;
                  }
                },
                itemStyle: {
                  shadowBlur: 25,
                },
                emphasis: {
                  show: true,
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
          this.alerts = selectedAlarms.length > 0 ? selectedAlarms.length : alarms.length;
          this.objectsAlert = chartData.selectObj.length > 0 ? chartData.selectObj.length : chartData.objects.length;

          // Типы
          for (let m = 0; m < rules.length; m++) {
            let rule = rulesData[rules[m].id];
            if (funcUtils.isUndefined(rule)) {
              rulesData[rules[m].id] = {
                id: rules[m].id,
                level: rules[m].level,
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
          for (let prop in rulesData) {
            if (rulesData.hasOwnProperty(prop) && rulesData[prop].count > 0) {
              let rule = rulesData[prop];
              switch (rule.level) {
                case 1: {
                  option.color.push('#00dbff');
                  break;
                }
                case 2: {
                  option.color.push('#8979b2');
                  break;
                }
                case 3: {
                  option.color.push('#936152');
                  break;
                }
                case 4: {
                  option.color.push('#897213');
                  break;
                }
                case 5: {
                  option.color.push('#237e22');
                  break;
                }
              }
              option.series[0].data.push({
                'value': rule.count,
                'name': rule.note
              });
            }
          }
          // Уровни
          for (let i = 0; i < alarms.length; i++) {
            if (selectedAlarms.length > 0 && !selectedAlarms.includes(alarms[i].id)) {
              continue;
            }
            let name = funcUtils.lookupValue('levelNames', alarms[i].level).label;
            switch (alarms[i].level) {
              case 1: {
                if (!option.color.includes('#3a5b6d')) {
                  option.color.push('#3a5b6d');
                }
                break;
              }
              case 2: {
                if (!option.color.includes('#0fac56')) {
                  option.color.push('#0fac56');
                }
                break;
              }
              case 3: {
                if (!option.color.includes('#d89a0f')) {
                  option.color.push('#d89a0f');
                }
                break;
              }
              case 4: {
                if (!option.color.includes('#d85803')) {
                  option.color.push('#d85803');
                }
                break;
              }
              case 5: {
                if (!option.color.includes('#bc1b0a')) {
                  option.color.push('#bc1b0a');
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
