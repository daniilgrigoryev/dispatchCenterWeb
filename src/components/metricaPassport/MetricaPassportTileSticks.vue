<template>
  <div style="height: 100%;">
    <!--Хедер тайла-->
    <!--TODO: хедер надо вынести в общий компонент-->
    <div class="dc-widget-grid__item__header">
      <div class="dc-widget-grid__item__header__captions">
        <h5>{{title}}</h5>
      </div>

      <div class="dc-widget-grid__item__header__right-column">
        <el-radio-group v-model="timeRadioToggle" size="mini">
          <el-radio-button label="1">по часам</el-radio-button>
          <el-radio-button label="2">по дням</el-radio-button>
          <el-radio-button label="3">по неделям</el-radio-button>
          <el-radio-button label="4">по месяцам</el-radio-button>
        </el-radio-group>

        <div class="dc-widget-grid__item__header__buttons">
          <el-tooltip class="item" effect="dark" content="Меню операций" placement="bottom">
            <el-button size="mini" class="dc-button-icon-small">
              <img src="../../assets/img/icon-burger-small-white.svg" alt="">
            </el-button>
          </el-tooltip>
        </div>
      </div>
    </div>
    <!--/Хедер тайла-->

    <echarts
      :options="alertsList"
      style="width: 100%; height: 100%;"
      auto-resize
    >
    </echarts>
  </div>

</template>

<script>
  import echarts from 'vue-echarts/components/ECharts'
  import 'echarts/lib/chart/bar'

  export default {
    name: "metrica-passport-tile-sticks",
    components: {echarts},
    props: {
      title: {
        type: String
      }
    },
    data: function () {
      return {
        timeRadioToggle: 2
      }
    },
    computed: {
      alertsList: function () {
        let getWeek = (determinedate) => {
          determinedate.setFullYear(determinedate.getFullYear(), determinedate.getMonth(), determinedate.getDate());
          var D = determinedate.getDay();
          if(D == 0) D = 7;
          determinedate.setDate(determinedate.getDate() + (4 - D));
          var YN = determinedate.getFullYear();
          var ZBDoCY = Math.floor((determinedate.getTime() - new Date(YN, 0, 1, -6)) / 86400000);
          var WN = 1 + Math.floor(ZBDoCY / 7);
          return WN;
        };
        let formatDate = (date, timeToggle) => {
          let res;
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
          switch (timeToggle) {
            case 1: {
              res =  day + "." + month + "." + year + " " + hour;
              break;
            }
            case 2: {
              res = day + "." + month + "." + year;
              break;
            }
            case 3: {
              res = getWeek(now) + " неделя";
              break;
            }
            case 4: {
              res = month + " месяц";
              break;
            }
          }
          return /*year + "delemitter" + */res;
        };
        let data = this.$store.state.monitorViewData.data;
        let option;
        if (data) {
          let labelOption = {
            normal: {
              show: true,
              position: 'left',
              distance: 25,
              align: 'center',
              verticalAlign: 'middle',
              formatter: (data) => {
                return data.value[1];
              },
              fontSize: 16,
              rich: {
                name: {
                  textBorderColor: '#fff'
                }
              }
            }
          };
          option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              },
              axis: 'y',
              formatter: function (data) {
                let initialValue = 0;
                let reduced = data.reduce(function (accumulator, currentValue) {
                  return accumulator + currentValue.data.value[1]
                }, initialValue);

                return `
                                <div style="text-align: right;">
                                 <div style="margin-bottom: 4px; font-size: 13px; color: #7e8c91">всего</div>
                                 <div style="font-size: 28px; color: #d1d1d1">${reduced}</div>
                                <div>
                            `
              }
            },
            dataZoom: [
              {
                type: 'slider',
                show: true,
                realtime: true,
                bottom: '12%'
              },
              {
                type: 'inside',
                show: true,
                realtime: true
              }
            ],
            yAxis: {
              axisLine: {
                show: true,
              },
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
            xAxis: {
              type: 'category',
              axisLine: {
                show: true,
              },
              axisLabel: {
                /*formatter: (data) => {
                  return data.substring(data.lastIndexOf('delemitter') + 10, data.length);
                },*/
                textStyle: {
                  color: "rgba(114, 135, 165, 0.85)"
                }
              },
            },
            color: [],
            grid: {
              top: 10,
              bottom: '25%',
              left: '5%',
              width: '90%',
              containLabel: true
            },

            barCategoryGap: '68%',
            series: []
          };
          let timeRadioToggle = parseInt(this.timeRadioToggle);
          let alarms = data.alarms;
          let selectedAlarms = data.selectAlarms;
          let alarmsData = {};
          for (let i = 0; i < alarms.length; i++) {
            if (selectedAlarms.length > 0 && !selectedAlarms.includes(alarms[i].id)) {
              continue;
            }
            let formattedDate = formatDate(new Date(alarms[i].alarmTime), timeRadioToggle);
            let alarm = alarmsData[alarms[i].level];
            if (!alarm) {
              alarm = {
                type: 'bar',
                stack: 'dc-sticks',
                data: {}
              };
              alarmsData[alarms[i].level] = alarm;
              switch (alarms[i].level) {
                case 1: {
                  alarm.name = 'Незаметный';
                  if (!option.color.includes('#3a5b6d')) {
                    option.color.push('#3a5b6d');
                  }
                  break;
                }
                case 2: {
                  alarm.name = 'Низкий';
                  if (!option.color.includes('#0fac56')) {
                    option.color.push('#0fac56');
                  }
                  break;
                }
                case 3: {
                  alarm.name = 'Нормальный';
                  if (!option.color.includes('#d89a0f')) {
                    option.color.push('#d89a0f');
                  }
                  break;
                }
                case 4: {
                  alarm.name = 'Высокий';
                  if (!option.color.includes('#d85803')) {
                    option.color.push('#d85803');
                  }
                  break;
                }
                case 5: {
                  alarm.name = 'Срочный';
                  if (!option.color.includes('#bc1b0a')) {
                    option.color.push('#bc1b0a');
                  }
                  break;
                }
              }
            }
            let count = alarm.data[formattedDate];
            if (!count) {
              count = 0;
            }
            count += 1;
            alarm.data[formattedDate] = count;
          }
          for (let prop in alarmsData) {
            if (alarmsData.hasOwnProperty(prop)) {
              let serie = alarmsData[prop];
              let res = {
                label: timeRadioToggle !== 1 ? labelOption : null,
                type: serie.type,
                stack: serie.stack,
                data: []
              };
              for (let innerProp in serie.data) {
                if (serie.data.hasOwnProperty(innerProp)) {
                  res.data.push({
                    name: serie.name,
                    value: [innerProp, serie.data[innerProp]]
                  });
                }
              }
              option.series.push(res);
            }
          }
        }
        return option;
      }
    }
  }
</script>

<style lang="scss">

</style>
