<template>
  <div id="ipo-retrial-list">
    <div class="content" v-loading="tableSreenLoading">
      <div class="turnover-time">截止{{endDateTime}}</div>
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-box">
        <!---->
        <el-tab-pane :key="'all'" class="v-tabs-item" label="全部" name="all">
          <!---->
          <v-tab-pane-retrial-item type="all" name="全部" @date-change="dateChange"></v-tab-pane-retrial-item>
        </el-tab-pane>
        <!---->
        <el-tab-pane :key="'sh'" class="v-tabs-item" label="沪主板" name="sh">
          <!---->
          <v-tab-pane-retrial-item type="sh" name="沪市主板" @date-change="dateChange"></v-tab-pane-retrial-item>
        </el-tab-pane>
        <!---->
        <el-tab-pane :key="'zx'" class="v-tabs-item" label="中小板" name="zx">
          <!---->
          <v-tab-pane-retrial-item type="zx" name="深市中小板" @date-change="dateChange"></v-tab-pane-retrial-item>
        </el-tab-pane>
        <!---->
        <el-tab-pane :key="'cy'" class="v-tabs-item" label="创业板" name="cy">
          <!---->
          <v-tab-pane-retrial-item type="cy" name="深市创业板" @date-change="dateChange"></v-tab-pane-retrial-item>
        </el-tab-pane>
        <!---->
        <el-tab-pane :key="'innovate'" class="v-tabs-item" label="试点创新企业" name="innovate">
          <!---->
          <v-tab-pane-retrial-item type="innovate" name="试点创新" @date-change="dateChange"></v-tab-pane-retrial-item>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import VTabPaneRetrialItem from './marketList/tabPaneRetrialItem'
  const cityOptions = ['上海', '北京', '广州', '深圳'];
  export default {
    name: "ipoRetrialList",
    components: {
      VTabPaneRetrialItem
    },
    data() {
      return {
        endDateTime: '',
        tabData: [
          {name: '全部', type: 'all'},
          {name: '沪主板', type: 'sh'},
          {name: '中小板', type: 'zx'},
          {name: '创业板', type: 'cy'},
          {name: '试点创新企业', type: 'innovate'}
        ],
        tableSreenLoading: false,
        activeName: 'all',
        dateTime: '',
        tableDataLading: false
      }
    },
    watch: {
      $route: function (to, form) {
        // console.log(to, form);
      }
    },
    created() {
      //
      if (this.$route.query.active) {
        if (this.filterRoute(this.$route.query.active)) {
          this.activeName = this.$route.query.active;
        } else {
          let query = Object.assign({}, this.$route.query, {active: 'all'});
          this.$router.replace({query: query});
        }
      } else {
        let query = Object.assign({}, this.$route.query, {active: 'all'});
        this.$router.replace({query: query});
      }
      //
    },
    methods: {
      dateChange(val) {
        this.endDateTime = val;
      },
      filterRoute(route) {
        let set = false;
        this.tabData.forEach((item) => {
          if (item.type == route) {
            set = true;
          }
        })
        return set
      },
      //
      submitBtns(i) {
        this.tableSreenLoading = true;
        this.tableHeader[i].show = false;
        setTimeout(() => {
          this.tableSreenLoading = false;
        }, 1000)
      },
      //
      handleClick(val) {
        let query = Object.assign({}, this.$route.query, {active: this.activeName});
        this.$router.replace({query: query});
      }
    }
  }
</script>

<style lang="scss">
  #ipo-retrial-list {
    .warning {
      font-size: 12px;
      color: #aeaeae;
      text-align: left;
      margin-top: 20px;
      font-weight: normal;
    }
    .tabs-box {
      .splitTab {
        position: absolute;
        right: -40px;
        top: 0;
        color: #e3e3e3;
        font-weight: 100;
      }
      .el-tabs__header {
        margin-bottom: 10px;
      }
      .el-tabs__item {
        height: 50px;
        line-height: 50px;
        color: #8d8d8d;
        font-size: 14px;
        font-weight: normal;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__item.is-active {
        color: #ffb148;
        .date {
          color: #ffb148;
        }
      }
    }
    //
    .company-table {
      width: 100%;
      font-size: 12px;
      border: none;
      border: 0;
      border-collapse: collapse;
      table-layout: fixed;
      thead {
        tr {
          background: #f2f2f2;
          height: 45px;
          td {
            color: #323232;
            font-size: 12px;
            text-align: center;
            &.row {
              text-align: center;
              .cell {
                cursor: pointer;
                outline: none;
                transition: all .3s;
                &.is-active {
                  color: #ffb148;
                  font-weight: bold;
                  i {
                    display: inline-block;
                    transition: transform .3s, -webkit-transform .3s, -ms-transform .3s;
                    -webkit-transform: scale3d(0.8, 0.8, 0.8) rotate(180deg);
                    -ms-transform: scale3d(0.8, 0.8, 0.8) rotate(180deg);
                    transform: scale3d(0.8, 0.8, 0.8) rotate(180deg);
                  }
                }
                i {
                  font-size: 10px;
                  color: #ffb148;
                  display: inline-block;
                  transition: transform .3s, -webkit-transform .3s, -ms-transform .3s;
                  -webkit-transform: scale3d(0.8, 0.8, 0.8) rotate(0deg);
                  -ms-transform: scale3d(0.8, 0.8, 0.8) rotate(0deg);
                  transform: scale3d(0.8, 0.8, 0.8) rotate(0deg);
                }
              }
              &.market {
                width: 80px;
              }
              &.form {
                width: 130px;
              }
              &.audit {
                width: 95px;
              }
              &.status {
                width: 70px;
              }
              &.index {
                width: 55px;
              }
              &.company {
                width: 152px;
              }
              &.rankNo {
                width: 70px;
              }
            }
          }
        }
      }
      tbody {
        tr {
          height: 40px;
          &.is-background {
            background: #F8F8F8;
          }
          td {
            font-size: 12px;
            color: rgba(84, 84, 84, 1);
            &.row {
              text-align: left;
              .cell {
                padding: 5px 3px;
                .link {
                  color: #ffb148;
                  text-decoration: underline;
                  cursor: pointer;
                  &:hover {
                    color: #ffb148;
                  }
                }
              }
              &.is-center {
                text-align: center;
              }
              &.is-right {
                text-align: right;
              }
              &.is-left {
                text-align: left;
              }
              &.index {
                width: 60px;
                font-size: 16px;
                color: #323232;
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
                    background-color: #90B8F5;
                    color: white;
                  }
                  &.index2 {
                    background-color: #F5BE95;
                    color: white;
                  }
                }
              }
              &.company {
                width: 152px;
              }
              &.rankNo {
                i {
                  font-size: 12px;
                  font-weight: bold;
                }
                .jiantou-top {
                  color: #FFB148;
                }
                .jiantou-bottom {
                  color: #29DA89;
                }
              }
            }
          }

        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  #ipo-retrial-list {
    width: 100%;
    min-height: 800px;
    .turnover-time {
      position: absolute;
      right: 0;
      top: 19px;
      font-size: 12px;
      color: rgba(141, 141, 141, 1);
      line-height: 16px;
    }
  }
</style>
