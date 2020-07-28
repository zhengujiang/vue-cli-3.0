<template>
  <el-card shadow="never" class="box-card mtop16" id="regulatorWordCloud" v-loading="keyWordLading">
    <div slot="header">
      <span>监管公司舆情统计</span>
      <el-select class="select-time" @change="keyWordChange" size="mini" v-model="keyWordVal"
                 placeholder="词云">
        <el-option v-for="item in optionKeyWordData" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div class="echart-word">
      <!--<div class="title-left">辖区所有公司</div>-->
      <div class="echart-box">
        <!--<el-checkbox-group v-model="checkList" class="checkbox-group">
          <el-checkbox label="正面" class="up"></el-checkbox>
          <el-checkbox label="负面" class="down"></el-checkbox>
          <el-checkbox label="中性" class="unchange"></el-checkbox>
        </el-checkbox-group>-->
        <div class="echart-wordcloud" id="echartWordCloud"></div>
      </div>

      <!--<div class="title-right">监管公司</div>-->
      <div class="rank-list">
        <div class="rank-item title">
          <div class="rank">排名</div>
          <div>公司名称</div>
          <div class="level">热度</div>
        </div>
        <div class="rank-item" v-for="(item,index) in orderList" v-if="index<5">
          <div class="rank">{{index + 1}}</div>
          <div>{{item.companyName}}</div>
          <div class="level">
            <span class="level-hot up">{{item.total?item.total:0}}</span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        checkList: ['正面', '负面', '中性'],
        keyWordLading: false,
        keyWordVal: 'TODAY',
        optionKeyWordData: [
          {
            value: 'TODAY',
            label: '前一天'
          }, {
            value: 'SEVEN_DAY',
            label: '最近7天'
          }, {
            value: 'MONTH',
            label: '最近30天'
          }
        ],
        keyWordData: [],
        orderList: []
      }
    },
    props: {
      companyCodes: String
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      companyCodes: function (val) {
        // this.getSuperviseCompanySentimentTotal()
      }
    },
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      this.getSuperviseCompanySentimentTotal()
    },
    mounted() {
    },
    // 方法
    methods: {
      keyWordChange() {
        this.getSuperviseCompanySentimentTotal()
      },
      getSuperviseCompanySentimentTotal() {
        this.keyWordLading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.superviseCompany.getSuperviseCompanySentimentTotal,
          params: {
            dateTypeEnum: this.keyWordVal,
            wordCount: 40,
            orderCount: 5,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          this.keyWordLading = false;
          // console.log(res);
          if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            this.orderList = data.orderList
            this.keyWordData = data.wordList.map(e => {
              return {name: e.word, value: e.total}
            })
            this.wordCloud(this.keyWordData);
          }
        }).catch((err) => {
          setTimeout(e => {
            this.keyWordLading = false;
          }, 1000)
        })
      },
      // =>渲染
      wordCloud(datas) {
       console.log(datas)
//        return false
        var myChart = echarts.init(document.getElementById('echartWordCloud'));
        var that = this;
        var color = ['#738BFF', '#FFB164', '#FFB09C', '#BBBBBB'];
        var option = {
          background: '#fff',
          series: [{
            type: 'wordCloud',
            // shape: 'circle',
            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.
            // maskImage: maskImage,
            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.
            left: 'center',
            top: '5%',
            width: '90%',
            height: '90%',
            right: 'center',
            bottom: '5%',
            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.
            sizeRange: [16, 36],
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
            rotationRange: [0, 45],
            // rotationStep: 45,
            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.
            gridSize: 25,
            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            drawOutOfBound: false,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: '400',
                color: (item) => {
                  // console.log('item-->' + item)
                  if (item.name.indexOf('股') > -1) {
                    return '#ff0000'
                  } else {
                    return color[parseInt(Math.random() * 4)];
                  }
                }
              },
              emphasis: {
                fontSize: 36,
                shadowBlur: 20,
                backgroundColor: '#f8f8f8',
                shadowColor: '#f8f8f8',
                shadowOffsetX: 0,
                shadowOffsetY: 0
              }
            },
            data: datas
            // data: data
          }]
        }
        myChart.setOption(option, true);
        myChart.on('click', (item) => {
          /* let newHost = that.$api.host;
          if (that.userInfo.enterpriseUser) {
            var tempWindow = window.open('_blank');
            tempWindow.location = newHost + 'investor/search?mustTitle=' + item.data.name; // 后更改页面地址
          } */
        });
      }
    }
  }
</script>

<style lang="scss">
  #regulatorWordCloud {
    .select-time {
      position: relative;
      top: -4px;
      float: right;
      width:100px;
    }
    .echart-word {
      display: flex;
      height: 350px;
      .title-left {
        background-color: #ffb148;
        box-shadow: 0 0 20px 0 rgba(0,0,0,0.15);
        border-radius: 2px 2px 0 0;
        color: #fff;
        width: 28px;
        height: 112px;
        padding: 5px 8px;
        font-size: 12px;
        font-weight: 300;
        margin-left: 36px;
      }
      .echart-box {
        .checkbox-group {
          margin-left: 28px;
          margin-top: 20px;
        }
        .el-checkbox + .el-checkbox {
          margin-left: 16px;
        }
        .el-checkbox__label {
          color: #323232;
          font-size: 12px;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label {
           color: #323232;
           font-size: 12px;
         }
        .up {
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #FF7844;
            border-color: #FF7844;
          }
        }
        .down {
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #64A1FF;
            border-color: #64A1FF;
          }
        }
        .unchange {
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: #FFB148;
            border-color: #FFB148;
          }
        }
        .echart-wordcloud {
          width:600px;
          padding:0 40px;
          height: 340px;
        }
      }

      .title-right {
        background-color: #ffb148;
        box-shadow: 0 0 20px 0 rgba(0,0,0,0.15);
        border-radius: 2px 2px 0 0;
        color: #fff;
        width: 28px;
        height: 80px;
        padding: 5px 8px;
        font-size: 12px;
        font-weight: 300;
        /*margin-left: 36px;*/
        margin-top:40px;
      }
      .rank-list {
        width: 230px;
        height: 280px;
        box-shadow: 0 0 20px 0 rgba(0,0,0,0.10);
        border-radius: 4px;
        margin-top: 35px;
        padding: 0 12px;
        .rank-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 5px;
          height: 45px;
          border-bottom: 1px solid #e3e3e3;
          font-size: 12px;
          color: #8d8d8d;
          .rank {
            width: 25px;
            text-align: center;
          }
          .level {
            width: 50px;
            text-align: right;
            .down-up-img {
              position: relative;
              right: 5px;
              top: 1px;
              height: 13px;
            }
            .unchange-img {
              position: relative;
              /*right: 3px;*/
              top: -3px;
            }
            .up {
              color: #FF7844;
            }
            .down {
              color: #64A1FF;
            }
            .unchange {
              color: #FFB148;
            }
            .level-hot {
              display: inline-block;
              min-width:30px;
              text-align: right;
            }
          }
          &:last-child {
            border-bottom: 0;
          }
        }
        .title {
          color: #545454;
        }
      }
    }
  }
</style>
