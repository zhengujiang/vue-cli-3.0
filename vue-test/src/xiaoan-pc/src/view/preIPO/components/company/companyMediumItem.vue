<template>
  <el-card shadow="never" id="companyMedium" v-loading="tableDataLading"
           class="companyMedium-card overview-card box-card first-card"
           body-style="padding:0 16px">
    <div class="head-flex vux-1px-b">
      <div class="row title">IPO上会公司所属中介机构排名</div>
      <div class="row text">
        <el-select class="select-item" size="mini" @change="companyMediumChange" v-model="companyMediumVal"
                   placeholder="请选择">
          <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div class="tabs-content">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-box">
        <el-tab-pane class="v-tabs-item" label="保荐机构" name="QUESTION">
          <!--公司-->
          <table border="0" class="company-table">
            <thead>
            <tr>
              <td class="row" v-for="(item, index) of tableMediumData" :class="item.class">
                <div class="cell" v-if="item.showAbout">
                  <div>{{item.label}}</div>
                  <div class="about">{{item.about}}</div>
                </div>
                <div class="cell" v-else>{{item.label}}</div>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) of institutionFromAuditingData.sponsorInstitution"
                :class="{'is-background': (index+1) % 2 == 0}">
              <td class="row index"><span class="indexNo" :class="'index'+index">{{item.indexNo}}</span></td>
              <td class="row is-center company">
                <router-link class="link" :to="'/ipo/will/list?active=all&sponsor='+item.id" target="_blank">
                  {{item.name}}
                </router-link>
              </td>
              <td class="row is-center market">{{item.shPassCount}}/{{item.shIpoCount}}({{item.shPassRatio}})</td>
              <td class="row is-center market">{{item.zxPassCount}}/{{item.zxIpoCount}}({{item.zxPassRatio}})</td>
              <td class="row is-center market">{{item.cyPassCount}}/{{item.cyIpoCount}}({{item.cyPassRatio}})</td>
              <td class="row is-center market">{{item.allPassCount}}/{{item.allIpoCount}}({{item.allPassRatio}})</td>
            </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane class="v-tabs-item" label="律师事务所" name="ANSWER">
          <!--回答数最多的公司-->
          <table border="0" class="company-table">
            <thead>
            <tr>
              <td class="row" v-for="(item, index) of tableMediumData" :class="item.class">
                <div class="cell" v-if="item.showAbout">
                  <div>{{item.label}}</div>
                  <div class="about">{{item.about}}</div>
                </div>
                <div class="cell" v-else>{{item.label == '保荐机构'? '律师事务所':item.label}}</div>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) of institutionFromAuditingData.lawFirm"
                :class="{'is-background': (index+1) % 2 == 0}">
              <td class="row index"><span class="indexNo" :class="'index'+index">{{item.indexNo}}</span></td>
              <td class="row is-center company">
                <router-link class="link" :to="'/ipo/will/list?active=all&lawfirm='+item.id" target="_blank">
                  {{item.name}}
                </router-link>
              </td>
              <td class="row is-center market">{{item.shPassCount}}/{{item.shIpoCount}}({{item.shPassRatio}})</td>
              <td class="row is-center market">{{item.zxPassCount}}/{{item.zxIpoCount}}({{item.zxPassRatio}})</td>
              <td class="row is-center market">{{item.cyPassCount}}/{{item.cyIpoCount}}({{item.cyPassRatio}})</td>
              <td class="row is-center market">{{item.allPassCount}}/{{item.allIpoCount}}({{item.allPassRatio}})</td>
            </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane class="v-tabs-item" label="会计师事务所" name="ANSWERRATE">
          <!--回复率最多的公司-->
          <table border="0" class="company-table">
            <thead>
            <tr>
              <td class="row" v-for="(item, index) of tableMediumData" :class="item.class">
                <div class="cell" v-if="item.showAbout">
                  <div>{{item.label}}</div>
                  <div class="about">{{item.about}}</div>
                </div>
                <div class="cell" v-else>{{item.label == '保荐机构'? '会计师事务所':item.label}}</div>
              </td>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,index) of institutionFromAuditingData.accountingFirm"
                :class="{'is-background': (index+1) % 2 == 0}">
              <td class="row index"><span class="indexNo" :class="'index'+index">{{item.indexNo}}</span></td>
              <td class="row is-center company">
                <router-link class="link" :to="'/ipo/will/list?active=all&accountingfirm='+item.id"
                             target="_blank">
                  {{item.name}}
                </router-link>
              </td>
              <td class="row is-center market">{{item.shPassCount}}/{{item.shIpoCount}}({{item.shPassRatio}})</td>
              <td class="row is-center market">{{item.zxPassCount}}/{{item.zxIpoCount}}({{item.zxPassRatio}})</td>
              <td class="row is-center market">{{item.cyPassCount}}/{{item.cyIpoCount}}({{item.cyPassRatio}})</td>
              <td class="row is-center market">{{item.allPassCount}}/{{item.allIpoCount}}({{item.allPassRatio}})</td>
            </tr>
            </tbody>
          </table>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
  export default {
    name: "companyMediumItem",
    components: {},
    data() {
      return {
        tableMediumData: [
          {label: '序号', showAbout: false, about: '', class: 'index'},
          {label: '保荐机构', showAbout: false, about: '', class: 'medium is-center'},
          {label: '沪主板', showAbout: true, about: '通过数/上会数(通过率)', class: 'sh'},
          {label: '中小板', showAbout: true, about: '通过数/上会数(通过率)', class: 'zx'},
          {label: '创业板', showAbout: true, about: '通过数/上会数(通过率)', class: 'cy'},
          {label: '合计', showAbout: true, about: '通过数/上会数(通过率)', class: 'total'}
        ],
        //
        selectData: [
          {label: '过去一年', value: '4'},
          {label: '过去90天', value: '3'},
          {label: '过去30天', value: '2'},
          {label: '过去7天', value: '1'}
        ],
        companyMediumVal: '4',
        activeName: 'QUESTION',
        option: {
          company: '中信证券股份有限公司',
          number: '27/30（90%）'
        },
        institutionFromAuditingData: {
          accountingFirm: [], // 会计
          lawFirm: [], // 律师
          sponsorInstitution: [] // 保荐
        },

        tableDataQ: [],
        tableDataA: [],
        tableDataR: [],
        tableDataLading: true
      }
    },
    created() {
      this.getInstitutionData(this.companyMediumVal);
    },
    methods: {
      companyMediumChange(val) {
        this.getInstitutionData(val);
      },
      //
      handleClick() {

      },
      getInstitutionData(type) {
        this.tableDataLading = true
        this.$http({
          method: 'GET',
          url: this.$api.publish.getInstitutionData,
          params: {
            publishCycleType: type
          }
        }).then((res) => {
          this.tableDataLading = false
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            this.institutionFromAuditingData.accountingFirm = data.ACCOUNTING_FIRM;
            this.institutionFromAuditingData.lawFirm = data.LAW_FIRM;
            this.institutionFromAuditingData.sponsorInstitution = data.SPONSOR_INSTITUTION;
          } else {

          }
        }).catch((err) => {
          //
          this.tableDataLading = false
        });
      }
    }
  }
</script>

<style lang="scss">
  #companyMedium {
    &.box-card {
      &.companyMedium-card {
        min-height: 550px;
      }
      .tabs-content {
        padding-bottom: 16px;
        .company-table {
          width: 100%;
          font-size: 14px;
          border: none;
          border: 0;
          border-collapse: collapse;
          table-layout: fixed;
          thead {
            tr {
              background: #f2f2f2;
              height: 40px;
              .row {
                color: #323232;
                font-size: 14px !important;
                text-align: center;
                &.index {
                  width: 55px;
                }
                &.medium {
                  width: 180px;
                }
                .cell {
                  padding: 5px 0;
                  .about {
                    font-size: 12px;
                    color: rgba(141, 141, 141, 1);
                  }
                }
              }
            }
          }
          tbody {
            tr {
              height: 40px;
              .row {
                font-size: 14px;
                color: #545454;
                text-align: left;
                &.is-center {
                  text-align: center;
                }
                &.company {
                  text-align: left;
                  padding-left: 20px;
                }
                .link {
                  &:hover {
                    color: #FFB148;
                    text-decoration: underline;
                  }
                }
                &.market {
                  text-align: right;
                  padding-right: 30px;
                }
                &.index {
                  text-align: center;
                  .indexNo {
                    display: inline-flex;
                    align-items: center;
                    text-align: center;
                    height: 18px;
                    width: 18px;
                    font-size: 14px;
                    line-height: 1;
                    border-radius: 50%;
                    justify-content: center;
                    &.index0 {
                      background-color: #FFC952;
                      color: white;
                    }
                    &.index1 {
                      background-color: #FEA734;
                      color: white;
                    }
                    &.index2 {
                      background-color: #C0BAA7;
                      color: white;
                    }
                  }
                }
              }
              &.is-background {
                background: #F8F8F8;
              }
            }
          }
        }
      }
    }
  }
</style>
