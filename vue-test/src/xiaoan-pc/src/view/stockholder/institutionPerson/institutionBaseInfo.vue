<template>
  <div id="institutionBaseInfo">
    <el-collapse-transition>
      <!--公募基金-->
      <div v-if="institutionAccountInfo.possessorType == 1">
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px" v-loading="basicLoading">
          <div class="info-header">
            <p class="shareholder">基金概况</p>
          </div>
          <table class="table possessor">
            <tbody>
            <tr class="vux-1px-b">
              <td class="one">基金名称</td>
              <td class="two">{{basicInfoData.productName}}</td>
              <td class="one">基金代码</td>
              <td class="three">{{basicInfoData.productCode}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">基金运作方式</td>
              <td>{{basicInfoData.wordType}}</td>
              <td class="odd">基金类别</td>
              <td>{{basicInfoData.productType}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">基金管理人</td>
              <td>{{basicInfoData.managerName}}</td>
              <td class="odd">基金托管人</td>
              <td>{{basicInfoData.agentName}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">基金合同生效日期</td>
              <td>{{$common.transTime(basicInfoData.startDate)[1]}}</td>
              <td class="odd">基金合同存续期截止日</td>
              <td>{{$common.transTime(basicInfoData.endDate)[1]}}</td>
            </tr>
            </tbody>

          </table>
        </el-card>
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px 16px 16px">
          <div class="info-header">
            <p class="shareholder">基金概况</p>
          </div>
          <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column align="center" width="100" prop="code" label="基金代码"></el-table-column>
            <el-table-column align="center" width="100" prop="levelCode" label="分级代码"></el-table-column>
            <el-table-column align="center" prop="agentName" label="基金简称"></el-table-column>
            <el-table-column align="right" prop="unit" label="份额净值">
              <template slot-scope="scope">
                {{abs(scope.row.unit)}}
              </template>
            </el-table-column>
            <el-table-column align="right" prop="total" label="累计净值">
              <template slot-scope="scope">
                {{abs(scope.row.total)}}
              </template>
            </el-table-column>
            <el-table-column align="right" prop="fundTotal" label="基金资产净值">
              <template slot-scope="scope">
                {{abs(scope.row.fundTotal)}}
              </template>
            </el-table-column>
            <el-table-column align="center" prop="reportDate" label="估值日期">
              <template slot-scope="scope">
                {{$common.transTime(scope.row.reportDate)[1]}}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      <!--私募基金-->
      <div v-else-if="institutionAccountInfo.possessorType == 2">
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px" v-loading="basicLoading">
          <div class="info-header">
            <p class="shareholder">私募基金公示信息</p>
          </div>
          <table class="table possessor">
            <tr class="vux-1px-b">
              <td class="one">基金名称</td>
              <td class="two">{{basicInfoData.productType}}</td>
              <td class="one">币种</td>
              <td class="three">{{basicInfoData.moneyType}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">基金编号</td>
              <td>{{basicInfoData.productCode}}</td>
              <td class="odd">基金管理人名称</td>
              <td>{{basicInfoData.managerName}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">成立时间</td>
              <td>{{$common.transTime(basicInfoData.startDate)[1]}}</td>
              <td class="odd">管理类型</td>
              <td>{{basicInfoData.managerType}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">备案时间</td>
              <td>{{$common.transTime(basicInfoData.recordDate)[1]}}</td>
              <td class="odd">托管人名称</td>
              <td>{{basicInfoData.agentName}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">基金备案阶段</td>
              <td>{{basicInfoData.recordStep}}</td>
              <td class="odd">运作状态</td>
              <td>{{basicInfoData.workStatus}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">基金类型</td>
              <td>{{basicInfoData.productType}}</td>
              <td class="odd">基金信息最后更新时间</td>
              <td>{{$common.transTime(basicInfoData.editDate)[1]}}</td>
            </tr>
          </table>
        </el-card>
      </div>
      <!--证券公司资管产品-->
      <div v-else-if="institutionAccountInfo.possessorType == 3">
        <el-card class="box-info-card" shadow="never" body-style="padding:0 16px" v-loading="basicLoading">
          <div class="info-header">
            <p class="shareholder">证券公司资管产品</p>
          </div>
          <table class="table possessor">
            <tbody>
            <tr class="vux-1px-b">
              <td class="one">基金名称</td>
              <td class="two">{{basicInfoData.productName}}</td>
              <td class="one">投资类型</td>
              <td class="three">{{basicInfoData.investType}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">产品编码</td>
              <td>{{basicInfoData.code}}</td>
              <td class="odd">是否分级</td>
              <td>{{basicInfoData.level}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">管理机构</td>
              <td>{{basicInfoData.managerName}}</td>
              <td class="odd">成立规模(万元)</td>
              <td>{{amountAbs(basicInfoData.scale)}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">设立日期</td>
              <td>{{$common.transTime(basicInfoData.startDate)[1]}}</td>
              <td class="odd">投资者总数</td>
              <td>{{basicInfoData.investerCount}}</td>
            </tr>
            <tr class="vux-1px-b">
              <td class="odd">到期日</td>
              <td>{{$common.transTime(basicInfoData.endDate)[1]}}</td>
              <td class="odd">托管机构</td>
              <td>{{basicInfoData.agentName}}</td>
            </tr>
            </tbody>

          </table>
        </el-card>
      </div>
      <div v-else>
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
    </el-collapse-transition>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: true,
        basicInfoData: {},
        basicLoading: true,
        tableData: [
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          },
          {
            code: '600894',
            name: '广日股份',
            number: '8,000,000',
            proportion: '3',
            value: '24,000,000',
            windIndustry: '电梯',
            sfcIndustry: '电梯',
            updateTime: '2018-12-31'
          }
        ],
        tableDataList: {},
        tableDataListLoading: true,
        nianbao: {},
        nianbaoLoading: true
      }
    },
    // 使用其它组件
    components: {},
    computed: {
      institutionAccountInfo: function () {
        // console.log(this.$store.state.institutionAccountInfo);
        return this.$store.state.institutionAccountInfo
      }
    },
    watch: {
      institutionAccountInfo: function (val) {
        //
      }
    },
    // 生命周期函数
    created() {

    },
    mounted() {
      setTimeout(_ => {
        let type = this.institutionAccountInfo.possessorType
        if (type == '1' || type == '2' || type == '3') {
          this.getPublicValueReport();
          this.getBasicInfo();
        } else {
          this.riskstormSearch(this.institutionAccountInfo.possessorName);
        }
      }, 1000)
    },
    // 方法
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
      getPublicValueReport() {
        console.log(this.$route);
        let params = {
          id: this.$route.query.id,
          userId: this.$cookie.get('userId')
        };
        this.$axios.gxfApi.getPublicValueReport(params).then(res => {
          if (res.data.returnCode == 200) {
            this.tableData = res.data.returnObject;
          }
        }).catch(err => {

        })
      },
      //
      riskstormSearch(val) {
        let params = {
          requestUrl: '/v1/company/search',
          requestParams: 'keyword',
          userId: this.$cookie.get('userId'),
          requestValues: val
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
            console.log(res.data);
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
            console.log(this.nianbao);
          }
        }).catch(err => {

        })
      },

      //
      getBasicInfo() {
        let params = {
          id: this.$route.query.id,
          userId: this.$cookie.get('userId')
        };
        this.$axios.gxfApi.getBasicInfo(params).then(res => {
          this.basicLoading = false;
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.basicInfoData = res.data.returnObject;
            }
          }
        }).catch(err => {
          this.basicLoading = false
        })
      }
    }
  }
</script>

<style lang="scss">
  #institutionBaseInfo {
    min-height: 600px;
  }
</style>
