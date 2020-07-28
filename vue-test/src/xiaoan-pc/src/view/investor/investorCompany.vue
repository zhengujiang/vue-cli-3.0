<template>
  <div id="investor-company">
    <div class="box-header">
      <div class="content">
        <div class="list">
          <div class="row img">
            <span class="code sh-bg-color" v-if="companyData.fullCode.indexOf('SH') >-1">{{companyData.code}}</span>
            <span class="code sz-bg-color" v-else>{{companyData.code}}</span>
          </div>
          <div class="row text">
            <div class="font-size-16 name" v-if="userInfo.enterpriseUser">{{companyData.name}}</div>
            <div class="font-size-16 name" v-else="userInfo.superviseUser">
              <v-regulatorCompany></v-regulatorCompany>
            </div>
          </div>
          <div class="row btns">
            <el-button class="radio-btn" type="primary" :plain="$route.meta.check == 'list'"
                       @click="checkChange(true)">总览
            </el-button>
            <el-button class="radio-btn" type="primary" :plain="$route.meta.check == 'overview'"
                       @click="checkChange(false)">列表
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <el-card class="box-card no-border" :class="{'is-background': $route.meta.check == 'overview'}" shadow="never"
             body-style="padding:0px">
      <div class="content">
        <el-row :gutter="16">
          <el-col :span="18" class="left-list">
            <!---->
            <!---->
            <router-view></router-view>
            <!---->
            <!---->
          </el-col>
          <el-col :span="6" class="right-card">
            <v-adv :pageName="'投关公司互动'" style="margin-top:15px;"></v-adv>
            <!--<el-card class="box-card" shadow="never" body-style="padding:0px">-->
            <!--&lt;!&ndash;广告&ndash;&gt;-->
            <!--<v-adv></v-adv>-->
            <!--</el-card>-->
            <!--提问公司排名-->
            <el-card class="box-card" shadow="never" body-style="padding:0 16px">
              <v-company-question-item></v-company-question-item>
            </el-card>
            <!--本月提问回答-->
            <el-card class="box-card" shadow="never" body-style="padding:0 16px">
              <v-company-answer-item></v-company-answer-item>
            </el-card>
            <!--本月提问最多投资者-->
            <el-card class="box-card" shadow="never" body-style="padding:0 16px">
              <v-investor-question-item></v-investor-question-item>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
  //
  import VCompanyAnswerItem from '@/view/investor/components/companyAnswerItem'
  import VCompanyQuestionItem from '@/view/investor/components/companyQuestionItem'
  import VInvestorQuestionItem from '@/view/investor/components/investorQuestionItem'
  export default {
    name: "investor-company",
    components: {
      VCompanyAnswerItem,
      VCompanyQuestionItem,
      VInvestorQuestionItem
    },
    data() {
      return {
        userInfo: {},
        companyCode: '',
        companyName: '',
        companyData: {
          fullCode: ''
        }
      }
    },
    watch: {
      check(val) {
        this.checkChange(val);
      },
      $route: function (val) {
        this.initData()
      }
    },
    created() {
      this.initData()
    },
    mounted() {
    },
    methods: {
      initData () {
        this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
        if (this.userInfo.enterpriseUser) {
          this.companyCode = this.userInfo.enterpriseCompanyCode;
        } else {
          if (this.$route.query.companyCode) {
            this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
          }
        }
        this.querySearchAsync(this.companyCode);
      },
      querySearchAsync(queryString) {
        this.$http({
          method: "GET",
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: queryString
          }
        }).then(res => {
          const obj = [];
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            if (res.data.returnObject) {
              this.companyData = data[0];
            }
          }
        });
      },

      //
      checkChange(val) {
        console.log(this.$route, val);
        let link = ''
        if (val) {
          // true
          link = '/investor/company/overview'
        } else {
          // false list
          link = '/investor/company/list'
        }
        this.$router.replace({path: link, query: this.$route.query});
      }
    }
  }
</script>

<style lang="scss">
  #investor-company {
    .left-list {
      .list-tabs {
        .el-tabs__item {
          height: 52px;
          line-height: 50px;
          font-size: 16px;
          color: #323232;
          transition: all .3s;
          &.is-active {
            color: #ffb148;
          }
          .el-badge__content.is-fixed {
            top: 9px;
          }
        }
        .el-tabs__nav-wrap::after {
          height: 1px;
          background-color: #e3e3e3;
        }
        .no-list-all {
          min-height: 800px;
          width: 100%;
        }
      }

    }
  }

</style>

<style lang="scss">
  #investor-company {
    background-color: #f6f6f6;
    @import "../../../static/css/animate";
    .box-header {
      width: 100%;
      height: 100px;
      background: #fff;
      -moz-box-shadow: 0px 10px 20px #f6f6f6;
      -webkit-box-shadow: 0px 10px 20px #f6f6f6;
      box-shadow: 0px 10px 20px #f6f6f6;
      position: relative;
      overflow: hidden;
      .list {
        display: flex;
        height: 100px;
        align-items: center;
        .row {
          flex: 1;
          &.img {
            flex: inherit;
            .code {
              display: inline-block;
              height: 48px;
              width: 48px;
              border-radius: 50%;
              line-height: 48px;
              text-align: center;
              font-size: 12px;
              color: #FFFFFF;
            }
          }
          &.text {
            padding-left: 10px;
            .name {
              font-size: 20px;
              color: #323232;
              display: flex;
              align-items: center;
              font-weight: 500;
            }
          }
          &.btns {
            text-align: right;
            .radio-btn {
              padding: 0;
              height: 30px;
              width: 60px;
              text-align: center;
              border-radius: 2px;
            }
          }
        }
      }
    }
    .no-border {
      border: 0;
      border: none;
      margin: 0;
      padding-bottom: 16px;
      transition: all .3s;
      &.is-background {
        background-color: #f6f6f6;
      }
    }
    .left-list {
      min-height: 600px;
      .no-list {
        height: 800px;
      }
    }
  }
</style>
