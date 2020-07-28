<template>
  <el-card shadow="never" class="box-card" body-style="padding:0 16px" id="company-will-item">
    <div class="head-flex vux-1px-b">
      <div class="row title">过去一年上会公司情况</div>
      <div class="row r-pagination text">
        <router-link to="/ipo/will/overview" target="_blank">查看更多<i class="el-icon-arrow-right"></i>
        </router-link>
      </div>
    </div>
    <div class="e-chart-box">
      <div id="echart-pie-will"></div>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "company-will-item",
    components: {},
    data() {
      return {
        willData: []
      }
    },
    created() {
      this.getLastOneYearInfo();
    },
    mounted() {
      this.$nextTick(() => {

      })
    },
    methods: {
      getLastOneYearInfo() {
        this.$http({
          method: 'GET',
          url: this.$api.publish.getLastOneYearInfo
        }).then((res) => {
          if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            this.willData = data.map((e) => {
              return {name: e.name, value: e.count}
            })
            this.$nextTick(() => {
              this.echartInit('echart-pie-will', this.willData);
            })
          }
          // this.willData =
          console.log(res.data);
        }).catch((err) => {

        })
      },
      echartInit(id, datas) {
        let myChart = echarts.init(document.getElementById(id));
        var dataS = datas;
        var total = dataS.reduce((prev, curr, idx, arr) => {
          return parseFloat(curr.value) + parseFloat(prev);
        }, 0);
        console.log('====>', total);
        dataS.forEach((item) => {
          item.ratio = ((item.value / total) * 100).toFixed(0) + '%'
        });
        console.log(dataS);
        var option = {
          tooltip: {
            show: false,
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            orient: 'vertical',
            top: 'center',
            right: 0,
            data: ['通过', '未通过', '暂缓表决'],
            textStyle: {
              fontSize: 12,
              color: '#aeaeae'
            },
            itemWidth: 18,
            itemHeight: 9,
            padding: 0,
            formatter: function (val) {
              var valueArr = {};
              dataS.forEach((item) => {
                if (item.name == val) {
                  valueArr = item;
                }
              })
              return val + valueArr.value + '(' + valueArr.ratio + ')'
            }
          },
          grid: {
            left: 0
          },
          color: [
            '#FBD6A4',
            '#B45E0B',
            '#FFB148'
          ],
          series: [
            {
              name: '',
              type: 'pie',
              radius: ['0%', '100%'],
              center: ['23%', '50%'],
              // selectedMode: 'single',
              hoverAnimation: false,
              label: {
                normal: {
                  position: 'inner',
                  formatter: '{c}',
                  textStyle: {
                    color: '#ffffff',
                    fontSize: 12
                  }
                }
              },
              itemStyle: {
                emphasis: {
                  label: {
                    show: true,
                    position: 'center',
                    textStyle: {
                      color: '#fff'
                    }
                  }
                }
              },
              data: dataS
            }
          ]
        };
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss" scoped>
  #company-will-item {
    .head-flex {
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0;
      .row {
        flex: 1;
        &.title {
          font-size: 14px;
          color: #323232;
          font-weight: bold;
        }
        &.r-pagination {
          flex: inherit;
          text-align: right;
          &.text {
            font-size: 12px;
            color: #8d8d8d;
            cursor: pointer;
            i {
              font-size: 12px;
            }
          }
        }
      }
    }
    .e-chart-box {
      padding: 17px 0;
      width: 100%;
      #echart-pie-will {
        height: 110px;
        width: 100%;
      }
    }
  }
</style>
