<template>
  <div id="businessRegistration">
    <div class="header">
      <div class="title content">
        <p class="details">深圳价值在线信息科技股份有限公司</p>
      </div>
    </div>
    <div class="content">
      <div class="base">
        <ul>
          <li class="baseInfoList" v-for="(item,index) in baseInfoData" :key="index"
              @click="baseInfoListVisted(index)" :class="{'baseInfoListVisted': baseInfoData[index].tabShow}">
            {{item.tab}}
          </li>
        </ul>
      </div>
      <div class="basicInfo">
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px">
          <div class="info-header">
            <p class="shareholder">工商登记信息</p>
          </div>
          <table class="table">
            <tr>
              <td>统一社会信用代码</td><td>9144030034998484XX</td><td>注册号</td><td>440301113747601</td>
            </tr>
            <tr>
              <td>名称</td><td>深圳价值在线信息科技股份有限公司</td><td>类型</td><td>股份有限公司(非上市)</td>
            </tr>
            <tr>
              <td>法定代表人</td><td>苏梅</td><td>注册资本</td><td>2655.5533万人民币元</td>
            </tr>
            <tr>
              <td>成立日期</td><td>2015年08月25日</td><td>经营期限自</td><td>2015年08月25日</td>
            </tr>
            <tr>
              <td>登记机关</td><td>福田局</td><td>核准日期</td><td>2018年08月13日</td>
            </tr>
            <tr>
              <td>登记状态</td><td>存续</td><td>地址</td><td>深圳市福田区沙头街道滨河大道9289号京基滨河时代广场北区一期B座09层</td>
            </tr>
            <tr>
              <td>经营范围</td><td colspan="3">从事计算机软硬件、信息系统软硬件的开发、销售;计算机软硬件及网络系统的技术开发、技术咨询、技术转让、技术服务；企业理咨询、商务信息咨询、财务咨询、公关策划、市场信息咨询、人才资源理咨询、信息咨询（不含限制项目）；经济信息咨询（不含限制项目）；贸易咨询、会务服务、展览展示服务、企业形策划；信息传输、软件和信息技术服务;信息系统设计、集成、运行维护；信息技术咨询。(法律、 行政法规、国务院决定禁止的项目除外，限制的项目须取得许可后方可经营) ^经营性互联网信息服务。</td>
            </tr>
          </table>
        </el-card>
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px">
          <div class="info-header">
            <p class="shareholder">联系方式</p>
          </div>
          <table class="table">
            <tr>
              <td>网址</td><td></td><td>联系电话</td><td>0755-23618811</td>
            </tr>
            <tr>
              <td>电子邮箱</td><td>ermei.hu@valueonline.cn</td><td>通信地址</td><td>深圳市福田区沙头街道滨河大道9289号京基滨河时代广场北区一期B座09层</td>
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
        baseInfoData: [
        {
          'tab': '账户信息', 'tabShow': ''
        }, {
          'tab': '基本信息', 'tabShow': true
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
       // 调用子组件方法
      baseInfoListVisted(index) {
        let len = this.baseInfoData.length
        for (let i = 0; i < len; i++) {
          this.baseInfoData[i].tabShow = false
        }
        this.baseInfoData[index].tabShow = true
        if (index == 0) {
          this.$router.push({path: '/stockholder/institutionAccountInfo', query: {item: index}})
        } else if (index == 1) {
          this.$router.push({path: '/stockholder/institutionBaseInfo', query: {item: index}})
        } else if (index == 2) {
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
  #businessRegistration {
    // margin-bottom: 16px;
    .header {
      width: 100%;
      height: 100px;
      box-shadow:0px 2px 7px 0px rgba(0,0,0,0.09);
      .title {
        display: flex;
        align-items:Center;
        height: 100px;
        .details {
        font-size:20px;
        font-weight:600;
        color:rgba(50,50,50,1);
        }
      }
    }
    .base {
      height: 68px;
      border-bottom: 1px solid rgba(227,227,227,1);
      .baseInfoList {
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
      .baseInfoListVisted {
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
</style>
