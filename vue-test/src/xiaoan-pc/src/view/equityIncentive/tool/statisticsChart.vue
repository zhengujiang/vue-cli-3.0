<template>
  <div id="statisticsChart">
    <div class="content">
      <div class="title">
        <p>问券名称</p>
        <div class="button">
          <el-button>下载分析报告</el-button>
          <el-button>下载原始问卷</el-button>
        </div>
      </div>
      <div class="contain">
        <div class="header">
          <el-radio-group v-model="radioChart" size="mini">
            <el-radio-button label="1" @click.native.prevent="toData">数据概览</el-radio-button>
            <el-radio-button label="2" @click.native.prevent="toChart">图表概览</el-radio-button>
          </el-radio-group>
        </div>
        <div class="body">
          <div class="item">
            <p class="quesTitle">
              1、这是题目名称 <span>[多选题]</span>
            </p>
            <div class="chart">chart</div>
            <p class="more">查看多选题百分比计算方法</p>
          </div>
          <div class="item">
            <p class="quesTitle">
              1、这是题目名称 <span>[多选题]</span>
            </p>
            <div class="chart">chart</div>
            <p class="more">查看多选题百分比计算方法</p>
          </div>
          <div class="item">
            <p class="quesTitle">
              9、意见/建议汇总
            </p>
            <p class="advice">这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充这是意见或建议的假字填充</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "statisticsChart",
    data() {
      return {
        radioChart: '2',
        checked: ["权限速查表"],
        textarea:'',
        tableData: [
          {option: '这是第一题的选项', subTitle: '123', percentage: '50%'},
          {option: '这是第一题的选项', subTitle: ' 99', percentage: '50%'},
          {option: '这是第一题的选项', subTitle: ' 23', percentage: '50%'},
          {option: '这是第一题的选项', subTitle: '  2', percentage: '50%'}
          ]
      }
    },
    created() {
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      toData() {
      this.$router.push({path: '/equityIncentive/statistics'})
    },
    toChart() {
      this.$router.push({path: '/equityIncentive/statisticsChart'})
    }
    }
  }
</script>

<style lang="scss">
  #statisticsChart {
    padding: 16px 0;
    .content {
      width: 1200px;
      padding-left: 15px;
      padding: 0 16px;
      background-color: #fff;
      .title {
        height: 45px;
        border-bottom: 1px solid #E3E3E3;
        display: flex;
        justify-content: space-between;
        p {
          margin-top: 12px;
          width: 64px;
          font-size:16px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(50,50,50,1);
          line-height:22px;
          }
        .button {
          margin-top: 9px;
            .el-button {
              padding: 0;
              width:108px;
              height:28px;
              border: none;
              background:rgba(255,177,72,1);
              border-radius:4px;
              span {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(255,255,255,1);
              }
            }
            .el-button:nth-child(2) {
              margin-left: 16px;
              border: 1px solid #FFB148;
              background:rgba(255,240,219,1);
              span {
                color: #FFB148;
              }
            }
        }
      }
      .contain {
        .header {
          height: 60px;
          .el-radio-group {
            margin-top: 8px;
            margin-left: 1009px;
            height: 24px;
            font-family: PingFangSC-Regular;
            font-weight: 400;
            color: white;
            line-height: 8px;
            .el-radio-button__inner {
              height: 24px;
              line-height: 8px;
            }
          }
        }
        .body {
          .item {
            padding-left: 90px;
            padding-right: 90px;
            padding-bottom: 28px;
            .quesTitle {
              font-size:16px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(50,50,50,1);
              margin-bottom: 8px;
              span {
                margin-left: 15px;
                color: #FFB148;
              }
            }
            .chart {
              height: 241px;
              background-color: pink;
            }
            .more {
              padding-top: 8px;
              padding-left: 16px;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(84,84,84,1);
            }
            .advice {
              padding: 11px 16px 14px;
              width: 988px;
              height: 69px;
              background: #F7F7F7;
              margin-bottom: 16px;
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(84,84,84,1);
              line-height:22px;
            }
          }
          .item:nth-child(3) {
            padding-bottom: 20px;
          }
        }
      }
    }
  }
</style>
