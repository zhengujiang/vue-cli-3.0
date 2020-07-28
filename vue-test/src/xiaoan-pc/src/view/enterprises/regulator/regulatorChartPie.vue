<template>
  <el-card shadow="never" class="box-card mtop16" id="regulatorChartPie">
    <div slot="header">
      <span>违规案例</span>
      <el-select class="select-time" @change="selectChange" size="mini" v-model="dateTypeValue"
                 placeholder="">
        <el-option v-for="item in dateTypeData" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <el-row :gutter="16" class="chart-box">
      <div class="report-count">违规总量：<span class="count">{{allCount}}</span></div>
      <el-col :span="12">
          <div v-show="showViolate" class="echaets-dom" id="echarts-violate"></div>
          <div v-show="!showViolate" class="noInfo">该时间段没有违规情况<br/>请选择其他时间段</div>
      </el-col>
      <el-col :span="12">
          <div v-show="showSupervise" class="echaets-dom" id="echarts-supervise"></div>
          <div v-show="!showSupervise" class="noInfo">该时间段没有违规情况<br/>请选择其他时间段</div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    data() {
      return {
        dateTypeValue: '3',
        dateTypeData: [
          {
            value: '1',
            label: '近30天'
          }, {
            value: '2',
            label: '近90天'
          }, {
            value: '3',
            label: '近1年'
          }
        ],
        allCount: 0,
        chartData: {
          violateType: [],
          superviseType: []
        },
        showViolate: true,
        showSupervise: true
      }
    },
    props: {
      companyCodes: String
    },
    // 使用其它组件
    components: {
      ElCol,
      ElRow},
    computed: {},
    watch: {
      companyCodes: function (val) {
        this.getData()
      }
    },
    // 生命周期函数
    created() {
    },
    mounted() {
      // this.getData()
    },
    // 方法
    methods: {
      selectChange() {
        this.getData()
      },
      getData () {
        this.loading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.superviseCompany.violateCase,
          params: {
            dateType: this.dateTypeValue,
            companyCodes: this.companyCodes
          }
        }).then((res) => {
          this.loading = false;

          if (res.data.returnCode == 200) {

            if (res.data.returnObject) {
              // console.log(res.data.returnObject);
              let data = res.data.returnObject

              this.allCount = data.count
//              this.pieData(this.chartData.violateType, 'echarts-violate')
//              this.pieData(this.chartData.superviseType, 'echarts-supervise')

              if (data.violateType == '' || !data.violateType) {
                this.pieData([], 'echarts-violate')
              } else {
                this.chartData.violateType = data.violateType.map(e => {
                  return {'value': e.typeCount, 'name': e.title}
                })
                this.pieData(this.chartData.violateType, 'echarts-violate')
              }
              if (data.superviseType == '' || !data.superviseType) {
                this.pieData([], 'echarts-supervise')
              } else {
                this.chartData.superviseType = data.superviseType.map(e => {
                  return {'value': e.typeCount, 'name': e.title}
                })
                this.pieData(this.chartData.superviseType, 'echarts-supervise')
              }

            } else {
              this.allCount = 0
              this.pieData([], 'echarts-violate')
              this.pieData([], 'echarts-supervise')
            }
          } else {
            this.allCount = 0
            this.pieData([], 'echarts-violate')
            this.pieData([], 'echarts-supervise')
          }
        }).catch((err) => {

          this.loading = false;
        })
        /* this.pieData(data, 'echarts-pies')
        this.pieData(data, 'echarts-pies-GET') */
      },
      pieData(data, id) {
        if (data.length == 0 || data.toString() == '') {
          if (id == 'echarts-violate') {
            this.showViolate = false
          }
          if (id == 'echarts-supervise') {
            this.showSupervise = false
          }
        } else {
          if (id == 'echarts-violate') {
            this.showViolate = true
          }
          if (id == 'echarts-supervise') {
            this.showSupervise = true
          }
        }

        var myChart = echarts.init(document.getElementById(id));
        // let data = this.eChartPie;
        var option = {
          tooltip: {
            trigger: 'item',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            axisPointer: {
              type: 'line',
              lineStyle: {
                opacity: 0
              }
            },
            formatter: function(item) {
              let name = item.name
              if (name.length > 9) {
                name = name.substring(0, 9) + '<br/>' + name.substring(9, name.length)
              }
              return '<div style="border-bottom:1px solid #e3e3e3;max-width:250px;white-space: normal; text-align: left;">' + name + '</div>' + '<div>数量：' + item.value + '</div>' + '<div>比例：' + item.percent + '%</div>'
            },
            textStyle: {
              color: "#aeaeae"
            }
          },
          // color: ['#FFB148', '#FC6D40', '#738BFF', '#fac2b5', '#DDDDDD'],
          // color: ['#FBD6A4', '#FFB148', '#FEBAA8', '#FC724C', '#CD4110', '#A96BC7', '#738BFF', '#76C0CB', '#DDDDDD'],
          color: ['#FFB148', '#FC724C', '#738BFF', '#DDDDDD', '#FBD6A4', '#FEBAA8', '#CD4110', '#A96BC7', '#76C0CB'],
          legend: {
            orient: 'vertical',
            show: false,
            x: 'left'
            // data: ['视频广告', '百度', '谷歌', '必应', '其他']
          },
          series: [{
            name: '净流入',
            type: 'pie',
            selectedMode: 'single',
            radius: ['20%', '50%'],
            labelLine: {
              normal: {
                length: 15,
                length2: 20,
                lineStyle: {
                  // color: '#aeaeae'
                }
              }
            },
            label: {
              normal: {
                formatter: function(item) {
                  let name = item.name
                  if (name.length > 9) {
                    name = name.substring(0, 9) + '\n' + name.substring(9, name.length)
                  }
                  return name
                },
                borderWidth: 0,
                borderRadius: 4,
                shadowBlur: 3,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowColor: '#999',
                // padding: [0, 0],
                rich: {
                  a: {
                    color: '#333',
                    fontSize: 12,
                    lineHeight: 10
                  },
                  hr: {
                    borderColor: '#333',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 15,
                    color: '#333'
                  }
                }
              }
            },
            data: data
          }]
        };
        myChart.setOption(option, true);
      }

    }
  }
</script>

<style lang="scss">
  #regulatorChartPie {
    .select-time {
      position: relative;
      top: -4px;
      float: right;
      width:100px;
    }
    .chart-box {
      min-height: 280px;
      position: relative;
      .report-count {
        position: absolute;
        right: 20px;
        top: 10px;
        font-size: 12px;
        color: #8d8d8d;
        .count {
          color: #FB4319
        }
      }
      .echaets-dom {
        height: 280px;
      }
      .noInfo {
        height: 280px;
        padding-top: 120px;
        color: #aeaeae;
        text-align: center;
      }
    }

  }
</style>
