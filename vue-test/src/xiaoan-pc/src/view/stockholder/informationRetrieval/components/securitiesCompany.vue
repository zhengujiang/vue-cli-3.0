<template>
  <div id="securitiesCompany">
    <div class="header">
      <div class="title content">
        <p class="details">财通证券资管双季赢鑫瑞3号集合投资管理计</p>
      </div>
    </div>
    <div class="content">
      <div class="account">
        <ul class="xhListTab">
          <li class="xhListTabList" v-for="(item, index) in xhListTabData" :key="index" @click="xhListTabListVisted(index)" :class="{'xhListTabListVisted': xhListTabData[index].tabShow}">
            {{item.tab}}
          </li>
        </ul>
      </div>
      <div class="basicInfo">
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px">
          <div class="info-header">
            <p class="shareholder">证券公司资管产品</p>
          </div>
          <table class="table">
            <tr>
              <td>产品名称</td><td>财通证券资管双季赢鑫睿3号集合资产管理计</td><td>投资类型</td><td>固收类产品</td>
            </tr>
            <tr>
              <td>产品编码</td><td>SEK869</td><td>是否分级</td><td>否</td>
            </tr>
            <tr>
              <td>管理机构</td><td>财通证券资产管理有限公司</td><td>成立规模(万元)</td><td>25864.00</td>
            </tr>
            <tr>
              <td>设立日期</td><td>2018-08-23</td><td>投资者总数</td><td>184</td>
            </tr>
            <tr>
              <td>到期日</td><td>2028-08-23</td><td>托管机构</td><td>中国工商银行股份有限公司</td>
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
        xhListTabData: [
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
      xhListTabListVisted(index) {
        let len = this.xhListTabData.length
        for (let i = 0; i < len; i++) {
          this.xhListTabData[i].tabShow = false
        }
        this.xhListTabData[index].tabShow = true
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
  #securitiesCompany {
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
      .account{
        height: 68px;
        border-bottom: 1px solid rgba(227,227,227,1);
        .xhListTabList {
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
        .xhListTabListVisted {
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
            height: 35px;
            padding: 9px;
          }
          td:nth-child(odd) {
            width: 136px;
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
