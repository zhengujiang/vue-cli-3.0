<template>
  <div id="institutionOtherInfo">
    <el-table style="min-height: 400px;width: 100%" v-loading="tableLoading" :data="tableData" :default-sort = "{prop: 'reportDate', order: 'descending'}" @sort-change="sortChange" stripe>
      <el-table-column align="center" prop="code" label="股票代码"></el-table-column>
      <el-table-column align="center" prop="name" label="股票名称"></el-table-column>
      <el-table-column class-name="data-column" align="right" sortable="custom" prop="num" label="持股数量(股)">
        <template slot-scope="scope">
          {{amountAbs(scope.row.num)}}
        </template>
      </el-table-column>
      <el-table-column align="right" prop="rate" label="持股比例(%)">
        <template slot-scope="scope">
          {{scope.row.rate.toFixed(2)}}
        </template>
      </el-table-column>
      <el-table-column align="right" prop="price" label="持股市值(元)">
        <template slot-scope="scope">
          <span v-if="scope.row.price !== 0">{{$array.abs(scope.row.price, true)}}</span>
          <span v-else>{{scope.row.price}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="sw" label="申万行业分类"></el-table-column>
      <el-table-column align="center" prop="csrc" label="证监会行业分类"></el-table-column>
      <el-table-column class-name="time-column" align="right" sortable="custom" prop="reportDate" label="更新时间">
        <template slot-scope="scope">
          {{transTime(scope.row.reportDate)}}
        </template>
      </el-table-column>
    </el-table>
    <div class="footer">
      <div class="pagination" v-show="tableData.length > 0">
        <div class="block" style="width: 100%;text-align: center">
          <el-pagination
            style="text-align: left"
            @current-change="selectPage"
            layout="prev, pager, next"
            :current-page="flip"
            :page-count="total">
          </el-pagination>
        </div>
        <div class="button-group">
          <el-radio-group v-model="pageSize" size="mini">
            <el-radio-button label="30条"></el-radio-button>
            <el-radio-button label="50条"></el-radio-button>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flip: 1, // 默认页码
        total: 0, // 总页数
        pageSize: '30条',
        otherInfoData: [
          {
            'tab': '基本信息', 'tabShow': ''
          }, {
            'tab': '账户信息', 'tabShow': ''
          }, {
            'tab': '管理人信息', 'tabShow': ''
          }, {
            'tab': '其他持股情况', 'tabShow': true
          }],
        tableData: [],
        tableLoading: false,
        numSort: '',
        dateSort: 'desc'
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      'pageSize': function() {
        this.getOtherShareHolding();
      }
    },
    // 生命周期函数
    created() {
      this.getOtherShareHolding();
    },
    mounted() {
    },
    // 方法
    methods: {
      amountAbs(val) {
        if (val == null || val == '--') {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      otherInfoListVisted(index) {
        let len = this.otherInfoData.length
        for (let i = 0; i < len; i++) {
          this.otherInfoData[i].tabShow = false
        }
        this.otherInfoData[index].tabShow = true
        if (index == 0) {
          this.$router.push({path: '/stockholder/institutionBaseInfo', query: {item: index}})
        } else if (index == 1) {
          this.$router.push({path: '/stockholder/institutionAccountInfo', query: {item: index}})
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
      },
      selectPage(val) {
        this.flip = val;
        this.getOtherShareHolding();
      },
      sortChange(val) {
        if (val.prop == 'reportDate') {
          this.numSort = '';
          val.order == 'ascending' ? this.dateSort = 'asc' : this.dateSort = 'desc';
        } else if (val.prop == 'num') {
          this.dateSort = '';
          val.order == 'ascending' ? this.numSort = 'asc' : this.numSort = 'desc';
        }
        this.getOtherShareHolding();
      },
      transTime(date) {
        return this.$common.transTime(date)[1]
      },
      // 查询其他持股情况
      getOtherShareHolding() {
        this.tableLoading = true;
        let size = this.pageSize.substring(0, this.pageSize.length - 1);
        let params = {
          id: this.$route.query.id,
          userId: this.$cookie.get('userId'),
          pageNum: this.flip,
          pageSize: size,
          numOrder: this.numSort,
          dateOrder: this.dateSort
        }
        this.$axios.gxfApi.getOtherShareHolding(params).then(res => {
          this.tableLoading = false;
          if (res.data.returnObject) {
            this.tableData = res.data.returnObject;
            this.total = Math.ceil(res.data.total / size);
            this.tableData.forEach(e => {
              Object.keys(e).forEach(item => {
                if (e[item] == null) {
                  e[item] = '--';
                }
              })
            })
          } else {
            this.tableData = [];
          }
        }).catch(err => {
          this.tableLoading = false;
        })
      }
    }
  }
</script>

<style lang="scss">
  #institutionOtherInfo {
    min-height: 600px;
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
    .other {
      height: 68px;
      border-bottom: 1px solid rgba(227, 227, 227, 1);
      .otherInfoList {
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
      .otherInfoListVisted {
        padding-bottom: 15px;
        border-bottom: 2px solid #FFAC38;
        color: #FFAC38;
      }
    }
    .el-table {
      &::before {
        height: 0;
      }
      td.data-column {
        .cell {
          padding-right: 7px;
        }
      }
      .time-column {
        padding-right: 20px;
      }
      td.time-column {
        padding-right: 27px;
      }
      th {
        height: 45px;
        padding: 0;
        background: rgba(240, 240, 240, 1);
        font-size: 12px;
        // text-align: center;
        border: none;
        div {
          font-weight: 400;
          font-family: PingFangSC-Regular;
          color: rgba(50, 50, 50, 1);
          padding: 0;
        }
      }
      td {
        padding: 0;
        height: 35px;
        border: none;
      }
      td div {
        // text-align: center;
        font-size: 12px;
        height: 35px;
        line-height: 35px;
        padding: 0;
        border: none;
        font-weight: 400;
        font-family: PingFangSC-Regular;
        color: rgba(0, 0, 0, 1);
      }
      td:nth-child(3) div {
        color: rgba(50, 50, 50, 1);
      }
    }
    .footer {
      position: relative;
      border: 1px solid #FFFFFF;
      width: 1200px;
      margin: auto;
      .pagination {
        width: 400px;
        height: auto;
        margin: 26px auto;
        margin-left: 0;
        .btn-prev, .btn-next, li {
          margin-right: 10px;
          width: 30px;
          height: 30px;
          border-radius: 4px;
          border: 1px solid #e3e3e3;
          box-sizing: border-box;
          padding: 0;
          min-width: 30px;
          .el-icon {
            font-size: 14px;
          }
        }
        li:last-child {
          margin-right: 0;
        }
        .el-pager {
          li {
            font-size: 12px;
            color: #8d8d8d;
            font-weight: 400;
          }
          li.active {
            color: #fff;
            background: #ffb148;
          }
        }
        .btn-next {
          margin-left: 10px;
          color: #b4bccc;
        }
        .btn-prev {
          color: #b4bccc;
        }
        .el-pagination {
          padding-left: 0;
        }
      }
      .button-group {
        position: absolute;
        right: 0;
        bottom: 26px;
        .group-right {
          background-color: #FFFFFF;
          border-color: #E3E3E3;
          padding: 5px 9px 8px 9px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          line-height: 17px;
        }
        .group-left {
          border-color: #E3E3E3;
          padding: 5px 9px 8px 9px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          line-height: 17px;
        }
        .el-radio-button span {
          display: inline-block;
          width: 45px;
          height: 30px;
          line-height: 30px;
          padding: 0;
          text-align: center;
        }
      }
    }

  }
</style>
