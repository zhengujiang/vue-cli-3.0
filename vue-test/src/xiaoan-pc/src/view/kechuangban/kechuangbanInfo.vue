<template>
  <div id="institutionIndex">
    <div class="header">
      <div class="title content">
        <p class="details">{{possessorName}}</p>
      </div>
    </div>
    <div class="content" v-loading="infoLoading">
      <el-tabs class="account-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane v-for="(item ,i) in accountInfoData" :key="i" :label="item.tab"
                     :name="item.type" v-if="item.show"></el-tab-pane>
      </el-tabs>
      <info v-if="activeName == 'baseInfo'"></info>
      <relation v-else-if="activeName == 'relation'"></relation>
      <risk v-else></risk>
    </div>
  </div>
</template>

<script>
  import info from './info.vue'
  import relation from './relation.vue'
  import risk from './risk.vue'
  export default {
    name: "institutionIndex",
    data() {
      return {
        infoLoading: false,
        possessorName: '',
        activeName: 'baseInfo',
        accountInfoData: [
          {
            'tab': '基本信息',
            show: true,
            type: 'baseInfo'
          },
          {
            'tab': '关联',
            show: true,
            type: 'relation'
          },
          {
            'tab': '风险和涉诉',
            show: true,
            type: 'risk'
          }
        ]
      }
    },
    created() {
      // this.checkHasIndustryName();
      this.possessorName = this.$route.query.name;
    },
    components: {
      info,
      relation,
      risk
    },
    methods: {
      checkHasIndustryName() {
        this.infoLoading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          id: this.$route.query.id,
          name: this.$route.query.name ? decodeURI(decodeURI(this.$route.query.name)) : ''
        };
        this.$axios.gxfApi.checkHasIndustryName(params).then((res) => {
          this.infoLoading = false;
          // if (res.data.returnCode == 200) {
          //   this.getShareholderInfo(true);
          // } else {
          //   this.getShareholderInfo(false); // 没有工商信息
          // }
        }).catch((err) => {
          this.infoLoading = false;
        })
      },
      handleClick(tab, event) {
        this.activeName = tab.name;
        // let index = tab.index;
        // let query = this.$route.query
        // this.$router.push({path: this.accountInfoData[index].link, query: query});
      }
    }
  }
</script>

<style lang="scss" scoped>
  #institutionIndex {
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
