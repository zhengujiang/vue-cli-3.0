<template>
  <div id="privateFund">
    <div class="header">
      <div class="title content">
        <p class="details">万家供应哥斐若宝精选组合一号专项资产管理计划</p>
      </div>
    </div>
    <div class="content">
      <div class="privateFund">
        <ul>
          <li class="privateFundList" v-for="(item, index) in privateFundData" :key="index" @click="privateFundListVisted(index)" :class="{'privateFundListVisted': privateFundData[index].tabShow}">
            {{item.tab}}
          </li>
        </ul>
      </div>
      <div class="basicInfo">
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px">
          <div class="info-header">
            <p class="shareholder">私募基金公示信息</p>
          </div>
          <table class="table">
            <tr>
              <td>基金名称</td><td>万家共赢歌斐诺宝精选组合1号专项资产管理计划</td><td>币种</td><td>人民币现钞</td>
            </tr>
            <tr>
              <td>基金编号</td><td></td><td>基金管理人名称</td><td>歌斐诺宝(上海)资产管理有限公司</td>
            </tr>
            <tr>
              <td>成立时间</td><td>2013-11-15</td><td>管理类型</td><td>顾问管理</td>
            </tr>
            <tr>
              <td>备案时间</td><td>2014-03-17</td><td>托管人名称</td><td>中信银行股份有限公司</td>
            </tr>
            <tr>
              <td>基金备案阶段</td><td>暂行办法实施前成立的基金</td><td>运作状态</td><td>延期运算</td>
            </tr>
            <tr>
              <td>基金类型</td><td>基金专户</td><td>基金信息最后更新时间</td><td>2014-02-07</td>
            </tr>
          </table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        privateFundData: [
          {
            'tab': '账户信息', 'tabShow': ''
          }, {
            'tab': '产品基本信息', 'tabShow': true
          }, {
            'tab': '管理人信息', 'tabShow': ''
          }, {
            'tab': '其他持股情况', 'tabShow': ''
          }]
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {
      privateFundListVisted(index) {
        let len = this.privateFundData.length
        for (let i = 0; i < len; i++) {
          this.privateFundData[i].tabShow = false
        }
        this.privateFundData[index].tabShow = true
        if (index == 0) {
          this.$router.push({path: '/stockholder/institutionAccountInfo', query: {item: index}})
        } else if (index == 1) {
          this.$router.push({path: '/stockholder/institutionBaseInfo', query: {item: index}})
        } else if (index == 2) {
          this.$router.push({path: '/stockholder/institutionManageInfo', query: {item: index}})
        } else if (index == 3) {
          this.$router.push({path: '/stockholder/institutionOtherInfo', query: {item: index}})
        }
        // this.$router.push({path: '/xhList', query: {item: index}})
        // if (index == 0) {
        //   this.$refs.xhLaste.getLasteData()
        // } else if (index == 1) {
        //   this.$refs.xhAnswer.getAnswerData()
        // } else if (index == 2) {
        //   this.$refs.xhRealTime.getRealTimeData()
        // } else if (index == 3) {
        //   this.$refs.xhInvite.getData()
        // }
      }
    }
  }
</script>

<style lang="scss">
  #privateFund {
    // margin-bottom: 16px;
    .header {
      width: 100%;
      height: 100px;
      box-shadow:0px 2px 7px 0px rgba(0,0,0,0.09);
      .title {
        display: flex;
        align-items: center;
        height: 100px;
        .details {
          font-size:20px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(50,50,50,1);
        }
      }
    }
    .content {
      .privateFund{
        height: 68px;
        border-bottom: 1px solid rgba(227,227,227,1);
        .privateFundList {
          height: 100%;
          float: left;
          font-size: 16px;
          padding: 0;
          margin: 30px 45px 16px 0;
          cursor: pointer;
          &:hover {
            color: #FFAC38;
          }
        }
        .privateFundListVisted {
          padding-bottom: 15px;
          border-bottom: 2px solid #FFAC38;
          color: #FFAC38;
        }
      }
      .box-info-card {
        width: 100%;
        background: white;
        margin-top: 16px;
        border-color: #e3e3e3;
        .info-header{
          display: flex;
          height: 45px;
          align-items: center;
          font-size:14px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(50,50,50,1);
          line-height:20px;
        }
        .table {
          width: 100%;
          font-size: 12px;
          font-weight: 400;
          color:rgba(50,50,50,1);
          margin-bottom: 16px;
          border-top:1px solid rgba(227,227,227,1);
          tr {
            border-bottom:1px solid rgba(227,227,227,1);
          }
          td {
            font-family:PingFangSC-Regular;
            height: 35px;
            padding: 9px;
          }
          td:nth-child(odd) {
            width: 155px;
            text-align: right;
            padding-right: 16px;
            background:rgba(248,248,248,1);
          }
          td:nth-child(even){
            padding-left: 16px;
          }
          td:nth-child(2) {
            width: 449px;
          }
          td:nth-child(4) {
            width: 463px;
          }
        }
      }
    }
  }
</style>
