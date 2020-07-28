<template>
  <div id="fundProfile">
    <div class="header">
      <div class="title content">
        <p class="details">万家消费成长股票型投资基金</p>
      </div>
    </div>
    <div class="content">
      <div class="fundProfile">
        <ul>
          <li class="fundProfileList" v-for="(item, index) in fundProfileData" :key="index" @click="fundProfileListVisted(index)" :class="{'fundProfileListVisted': fundProfileData[index].tabShow}">
            {{item.tab}}
          </li>
        </ul>
      </div>
      <div class="basicInfo">
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px">
          <div class="info-header">
            <p class="shareholder">基金概况</p>
          </div>
          <table class="table">
            <tr>
              <td>基金名称</td><td>万家消费成长股票型证券投资基金</td><td>基金代码</td><td>519193</td>
            </tr>
            <tr>
              <td>基金运作方式</td><td>开放式</td><td>基金类别</td><td>股票型</td>
            </tr>
            <tr>
              <td>基金管理人</td><td>万家基金管理有限公司</td><td>基金托管人</td><td>中国建设银行股份有限公司</td>
            </tr>
            <tr>
              <td>基金合同生效日期</td><td>2017-02-23</td><td>基金合同存续期截止日</td><td>2099-12-31</td>
            </tr>
          </table>
        </el-card>
        <el-card class="box-info-card card-sencond" shadow="never" body-style="padding:0 16px">
          <div class="info-header">
            <p class="shareholder">净值日报</p>
          </div>
          <el-table class="el-data" :data="tableData" stripe style="width:100%;">
            <el-table-column prop="data" label="估值日期" align="center"></el-table-column>
            <el-table-column prop="number" label="单位净值" align="center"></el-table-column>
            <el-table-column prop="sum" label="累计净值" align="center"></el-table-column>
            <el-table-column prop="num" label="基金资产净值" align="center"></el-table-column>
          </el-table>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        fundProfileData: [
          {
            'tab': '账户信息', 'tabShow': ''
          }, {
            'tab': '产品基本信息', 'tabShow': 'true'
          }, {
            'tab': '管理人信息', 'tabShow': ''
          }, {
            'tab': '其他持股情况', 'tabShow': ''
          }],
        tableData:[
          {data: '2018-08-29', number: '1.1633', sum: '1.1633', num: ''},
          {data: '2018-08-28', number: '1.1640', sum: '1.1640', num: ''},
          {data: '2018-08-27', number: '1.1681', sum: '1.1681', num: ''},
          {data: '2018-08-24', number: '1.1402', sum: '1.1402', num: ''},
          {data: '2018-08-25', number: '1.1394', sum: '1.1394', num: ''}
        ]
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
      fundProfileListVisted(index) {
        let len = this.fundProfileData.length
        for (let i = 0; i < len; i++) {
          this.fundProfileData[i].tabShow = false
        }
        this.fundProfileData[index].tabShow = true
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
  #fundProfile {
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
      .fundProfile{
        height: 68px;
        border-bottom: 1px solid rgba(227,227,227,1);
        .fundProfileList {
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
        .fundProfileListVisted {
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
            width: 160px;
            text-align: right;
            padding-right: 16px;
            background:rgba(248,248,248,1);
          }
          td:nth-child(even){
            padding-left: 16px;
          }
          td:nth-child(2) {
            width: 440px;
          }
          td:nth-child(4) {
            width: 459px;
          }
        }
      }
      .card-sencond{
        .info-header{
          margin-bottom: 15px;
          height: 20px;
          line-height: 20px;
          margin-top: 11px;
        }
        .el-table {
          text-align: center;
          th{
            width:1168px;
            height:35px;
            background:rgba(240,240,240,1);
            padding: 0;
            font-size:12px;
            font-weight:400;
            color:rgba(50,50,50,1);
            text-align: center;
            border: none;
          }
          td{
            height: 35px;
            PADDING: 0;
            font-size: 12px;
            color:rgba(50,50,50,1);
            border: none;
            div{
              line-height: 35px;
            }
          }
        }
      }
    }
  }
</style>
