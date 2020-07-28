<template>
  <div id="kechuangbanInfo">
    <div class="content" style="margin-top: 16px">
      <el-card class="box-info-card" shadow="never" body-style="padding:0 16px" v-loading="tableDataListLoading">
        <div class="info-header">
          <p class="shareholder">工商登记信息</p>
        </div>
        <table class="table possessor">
          <tr class="vux-1px-b">
            <td class="one">统一社会信用代码</td>
            <td class="two">{{tableDataList['统一社会信用代码']}}</td>
            <td class="one">注册号</td>
            <td class="three">{{tableDataList['注册号']}}</td>
          </tr>
          <tr class="vux-1px-b">
            <td class="odd">名称</td>
            <td>{{tableDataList['名称']}}</td>
            <td class="odd">类型</td>
            <td>{{tableDataList['类型']}}</td>
          </tr>
          <tr class="vux-1px-b">
            <td class="odd">法定代表人</td>
            <td>{{tableDataList['法定代表人']}}</td>
            <td class="odd">注册资本</td>
            <td>{{abs(tableDataList['注册资本（万元）'])}}</td>
          </tr>
          <tr class="vux-1px-b">
            <td class="odd">登记状态</td>
            <td>{{tableDataList['登记状态']}}</td>
            <td class="odd">核准日期</td>
            <td>{{tableDataList['核准日期']}}</td>
          </tr>
          <tr class="vux-1px-b">
            <td class="odd">成立日期</td>
            <td>{{tableDataList['成立日期']}}</td>
            <td class="odd">经营期限自</td>
            <td>{{tableDataList['经营期限自']}}</td>
          </tr>
          <tr class="vux-1px-b">
            <td class="odd">经营范围</td>
            <td colspan="3">{{tableDataList['经营范围']}}</td>
          </tr>
        </table>
      </el-card>
      <!---->
      <el-card class="box-info-card" shadow="never" body-style="padding:0 16px" v-loading="nianbaoLoading">
        <div class="info-header">
          <p class="shareholder">联系方式</p>
        </div>
        <table class="table possessor">
          <tr>
            <td class="one">网址</td>
            <td class="two">{{nianbao['网址']}}</td>
            <td class="one">联系电话</td>
            <td class="three">{{nianbao['企业联系电话']}}</td>
          </tr>
          <tr>
            <td class="odd">电子邮箱</td>
            <td>{{nianbao['企业电子邮箱']}}</td>
            <td class="odd">通信地址</td>
            <td>{{nianbao['企业通信地址']}}</td>
          </tr>
        </table>
      </el-card>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: true,
        basicInfoData: {},
        basicLoading: true,
        tableDataList: {},
        tableDataListLoading: true,
        nianbao: {},
        nianbaoLoading: true
      }
    },
    mounted() {
      setTimeout(_ => {
        // let type = this.institutionAccountInfo.possessorType
        // if (type == '1' || type == '2' || type == '3') {
        //   this.getPublicValueReport();
        //   this.getBasicInfo();
        // } else {
          this.riskstormSearch();
        // }
      }, 1000)
    },
    // 方法
    methods: {
      checkHasIndustryName() {
        this.infoLoading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          name: decodeURI(decodeURI(this.$route.query.name))
        };
        this.$axios.gxfApi.checkHasIndustryName(params).then((res) => {

          // if (res.data.returnCode == 200) {
          //   this.getShareholderInfo(true);
          // } else {
          //   this.getShareholderInfo(false); // 没有工商信息
          // }
        }).catch((err) => {
          this.infoLoading = false;
        })
      },
      amountAbs(val) {
        if (val == null) {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      //
      abs(val) {
        if (val * 1) {
          val = val * 1
        } else {
          return parseFloat(val).toFixed(4)
        }
        // 金额转换 元 保留2位小数 并每隔3位用逗号分开 1,234.56
        let str = (val).toFixed(4) + '';
        let intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); // 取到整数部分
        let dot = str.substring(str.length, str.indexOf(".")); // 取到小数部分搜索
        return (intSum + dot);
      },
      //
      // getPublicValueReport() {
      //   console.log(this.$route);
      //   let params = {
      //     id: this.$route.query.id,
      //     userId: this.$cookie.get('userId')
      //   };
      //   this.$axios.gxfApi.getPublicValueReport(params).then(res => {
      //     if (res.data.returnCode == 200) {
      //       this.tableData = res.data.returnObject;
      //     }
      //   }).catch(err => {

      //   })
      // },
      //
      riskstormSearch(val) {
        let params = {
          requestUrl: '/v1/company/search',
          requestParams: 'keyword',
          userId: this.$cookie.get('userId'),
          requestValues: decodeURI(decodeURI(this.$route.query.name))
        }
        this.$axios.gxfApi.riskstorm(params).then(res => {
          if (res.data.hits.length > 0) {
            let companyId = '';
            res.data.hits[0]['统一社会信用代码'] ? companyId = res.data.hits[0]['统一社会信用代码'] : companyId = res.data.hits[0]['注册号']
            // let companyId = res.data.hits[0]['注册号'];
            this.riskstormCompanyId(companyId);
            this.riskstormnianbao(companyId);
          }
        }).catch(err => {

        })
      },
      //
      riskstormCompanyId(val) {
        let params = {
          requestUrl: '/v1/company/' + val,
          requestParams: 'keyword',
          userId: this.$cookie.get('userId'),
          requestValues: ''
        }
        this.$axios.gxfApi.riskstorm(params).then(res => {
          this.tableDataListLoading = false;
          if (res.data) {
            this.tableDataList = res.data;
          }
        }).catch(err => {

        })
      },
      //
      riskstormnianbao(val) {
        let params = {
          requestUrl: `/v1/company/${val}/nianbao`,
          requestParams: 'keyword',
          userId: this.$cookie.get('userId'),
          requestValues: ''
        }
        this.$axios.gxfApi.riskstorm(params).then(res => {
          this.nianbaoLoading = false;
          if (res.data.hits.length > 0) {
            let data = res.data.hits[0];
            this.nianbao = Object.assign({}, data['基本信息'], data['网站信息'][0]);
          }
        }).catch(err => {

        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  #kechuangbanInfo {
    .header {
      width: 100%;
      height: 100px;
      box-shadow: 0px 2px 7px 0px rgba(0, 0, 0, 0.09);
      .title {
        display: flex;
        align-items: Center;
        height: 100px;
        .details {
          font-size: 20px;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
        }
      }
    }
    .account-tabs {
      margin-top: 10px;
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__item {
        height: 46px;
        line-height: 46px;
      }
    }
    .account {
      height: 68px;
      border-bottom: 1px solid rgba(227, 227, 227, 1);
      .accountInfoList {
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
      .accountInfoListVisted {
        padding-bottom: 15px;
        border-bottom: 2px solid #FFAC38;
        color: #FFAC38;
      }
    }
    /**/
    .box-info-card {
      width: 100%;
      background-color: white;
      margin-bottom: 16px;
      border-color: #e3e3e3;
      .el-table {
        th {
          height: 35px;
          padding: 0;
          .cell {
            color: rgba(50, 50, 50, 1);
            line-height: 1.4;
            padding: 5px 10px;
          }
        }
        td {
          color: rgba(0, 0, 0, 1);
          height: 35px;
          padding: 0;
          div {
            line-height: 35px;
          }
        }
      }
      .info-header {
        flex: 1;
        display: flex;
        height: 45px;
        align-items: center;
        .shareholder {
          font-size: 14px;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          color: rgba(50, 50, 50, 1);
          line-height: 20px;
        }
        .button-group {
          flex: 1;
          text-align: right;
          .el-button {
            padding: 0;
          }
        }
      }
      table.possessor {
        width: 100%;
        font-size: 12px;
        font-weight: 400;
        color: #323232;
        line-height: 17px;
        margin-bottom: 16px;
        border-top: 1px solid rgba(227, 227, 227, 1);
        tr {
          border-bottom: 1px solid rgba(227, 227, 227, 1);

          td {
            color: rgba(50, 50, 50, 1);
            padding: 10px 16px;
            &:last-child {
              padding-right: 0;
            }
            &:nth-child(odd) {
              padding-left: 0;
              padding-right: 16px;
            }
            &:nth-child(even) {
              padding-left: 16px;
              padding-right: 0;
            }
          }
        }
        .seeDetails {
          color: #FFB148;
          text-decoration: underline;
        }
        .seeDetails:hover {
          cursor: pointer;
        }
        .one {
          width: 140px;
          text-align: right;
          background-color: #F8F8F8;
        }
        .two {
          width: 283px;
        }
        .three {
          width: 231px;
        }
        .four {
          width: 143px;
          text-align: right;
          background-color: #F8F8F8;
          padding-right: 16px;
        }
        .odd {
          background-color: #F8F8F8;
          text-align: right;
          padding-right: 16px;
        }
      }
      .el-table__header {
        background-color: #f8f8f8;
        tr {
          th {
            background-color: #F0F0F0;
            .cell {
              color: rgba(50, 50, 50, 1);
            }
          }
        }
      }
      .limited {
        font-size: 12px;
        font-weight: 400;
        color: rgba(141, 141, 141, 1);
        line-height: 17px;
        margin-top: 9px;
      }
      .picture {
        font-size: 14px;
        font-weight: 600;
        color: rgba(50, 50, 50, 1);
        line-height: 20px;
        font-family: PingFangSC-Semibold;
        margin: 16px auto;
      }
      .table {
      }
      .echart-overview {
        height: 315px;
        width: 100%;
      }
    }
  }
</style>
