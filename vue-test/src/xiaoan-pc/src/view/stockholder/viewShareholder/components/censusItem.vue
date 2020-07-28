<template>
  <el-card class="vux-card__margin vxa-card-box censusItem" shadow="hover" body-style="padding:0 10px;">
    <div class="vxa-card_head vux-1px-b">股本数据统计<span class="time">（{{timeDateFun}}期）</span></div>
    <div class="vux-card_content vux-1px-b">
      <div id="peitotalId"></div>
      <vxa-not-info v-if="notData"></vxa-not-info>
    </div>
    <div class="vux-card_content" v-if="circulateAllAmountDisplay">
      <div id="circulateId"></div>
      <vxa-not-info v-if="notData"></vxa-not-info>
    </div>
  </el-card>
</template>

<script>
  import NoInfo from "../../../../components/noInfo";
  export default {
    name: "censusItem",
    components: {NoInfo},
    data() {
      return {
        circulateAllAmountDisplay: true,
        notData: false,
        circulationPic: true
      }
    },
    props: {
      timeDate: {
        type: [String, Number],
        default: 0
      },
      type: {
        type: [String, Number],
        default: 0
      }
    },
    created() {
      this.getShareStatistics();
    },
    computed: {
      timeDateFun: function () {
        return this.$common.transTime(this.timeDate)[1]
      }
    },
    mounted() {
    },
    methods: {
      amountAbs(val) {
        if (val == null) {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      getShareStatistics() {
        let params = {
          userId: this.$cookie.get('userId'),
          rollType: this.type,
          recordDate: this.$common.transTime(this.timeDate)[1]
        };
        this.$axios.gxfApi.getShareStatistics(params).then(res => {
          if (res.data.returnCode == 200) {
            this.notData = false;
            console.log(res.data);
            let dataObject = res.data.returnObject;
            if (dataObject.circulatePersonAmount == null) {
              dataObject.circulatePersonAmount = 0
            }
            if (dataObject.circulateInstitutionAmount == null) {
              dataObject.circulateInstitutionAmount = 0
            }
            if (dataObject.securityPersonAmount == null) {
              dataObject.securityPersonAmount = 0
            }
            if (dataObject.securityInstitutionAmount == null) {
              dataObject.securityInstitutionAmount = 0
            }
            if (dataObject.securityAllAmount == null) {
              dataObject.securityAllAmount = 0
            }
            if (dataObject.circulateAllAmount == null) {
              this.circulateAllAmountDisplay = false
              dataObject.circulateAllAmount = 0
            }
            let dataP = [
              {
                name: '个人(股)',
                value: dataObject.securityPersonAmount
              },
              {
                name: '机构(股)',
                value: dataObject.securityInstitutionAmount
              }
            ];

            let dataI = [
              {
                name: '个人(股)',
                value: dataObject.circulatePersonAmount
              },
              {
                name: '机构(股)',
                value: dataObject.circulateInstitutionAmount
              }
            ];
            // let totalP = dataObject.securityPersonAmount + dataObject.securityInstitutionAmount;
            let totalP = dataObject.securityAllAmount;
            // let totalI = dataObject.circulatePersonAmount + dataObject.circulateInstitutionAmount;
            let totalI = dataObject.circulateAllAmount;
            this.$nextTick(_ => {
              this.echartPies('peitotalId', dataP, `股本统计(总股本:${this.amountAbs(totalP)})`)
              this.echartPies('circulateId', dataI, `流通股本统计(总流通股本:${this.amountAbs(totalI)})`)
              if (dataObject.circulatePersonAmount == 0 && dataObject.circulateInstitutionAmount == 0) {
                this.circulationPic = false;
              }
            })
          } else {
            this.notData = true;
          }
        }).catch(err => {
          this.notData = true;
        })
      },
      echartPies(id, data, title) {
        let myChart = echarts.init(document.getElementById(id));
        let color = ["#602221", "#FFB148"];
        const that = this;
        let name = data.map(e => {
          return e.name
        })
        let option = {
          legend: {
            x: 'left',
            y: '15%',
            data: name,
            icon: 'roundRect',
            textStyle: {
              color: 'rgba(174,174,174,1)'
            }
          },
          tooltip: {
            show: true,
            trigger: 'item',
            position(pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (data) {
              let html = ``;
              html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${data.name}：</span><span>${that.amountAbs(data.value)}</span></div>`
              return html
            }
          },
          color: color,
          title: {
            text: title,
            left: 'left',
            top: 10,
            textStyle: {
              align: 'center',
              color: 'rgba(84,84,84,1)',
              fontSize: 12
            }
          },
          series: [
            {
              name: title,
              type: 'pie',
              minAngle: 6,
              // selectedMode: 'single',
              hoverAnimation: false,
              radius: ['30%', '50%'],
              center: ['50%', '60%'],
              data: data,
              label: {
                show: true,
                position: 'outside',
                formatter: '\n{b}',
                color: '#aeaeae'
              },
              labelLine: {
                show: true,
                length: 20,
                length2: 5,
                smooth: false,
                lineStyle: {
                  color: '#e3e3e3'
                }
              },
              itemStyle: {
                emphasis: {
                  label: {
                    show: true,
                    position: 'outside',
                    color: '#aeaeae'
                  },
                  labelLine: {
                    lineStyle: {
                      color: '#e3e3e3'
                    }
                  }
                }
              }
            }
          ]
        };
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .censusItem {
    #peitotalId, #circulateId {
      height: 220px;
    }
  }
</style>
