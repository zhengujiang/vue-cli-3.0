<template>
  <div id="follow-companies">
    <header class="flex-header">
      <h4 class="card-title">关注公司</h4>
      <v-stock-search class="stock-search" @onAddAttentionSuccess="onAddAttentionSuccess"></v-stock-search>
    </header>
    <el-table v-if="stockTableData.length >0" :data="stockTableData" size="small" class="stock-table" stripe @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30">
      </el-table-column>
      <el-table-column v-if="!col.hidden" v-for="(col,index) in stockTableColumns" :prop="col.prop" :key="index" :label="col.label" :width="col.width" :fixed="index==0" sortable :align="col.align?col.align:'right'">
        <template slot-scope="scope">
          <!--           <span v-if="col.prop === 'zhongWenJianCheng'" style="text-align: left">
                      <span class="top">{{scope.row.zhongWenJianCheng}}</span>
          <span class="bottom">{{scope.row.obj}}</span> -->
          <!--</span>-->
          <span :class="stockValueStyle(col,scope.row)">{{formatStockValue(col,scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleCancelAttention(scope.$index, scope.row)">取消关注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <v-noInfo v-else></v-noInfo>
    <p class="tips">
      <el-button type="text" v-if="stockSelection.length" @click="batchCancel">取消关注所选</el-button>
    </p>
  </div>
</template>
<script>
import moment from 'moment'
import VStockSearch from '@/view/condition/components/stockSearch'

export default {

  name: 'follow-companies',
  components: {
    VStockSearch
  },
  data() {
    return {
      userId: '',
      stockTableData: [],
      stockSelection: [],
      stockTableColumns: [{
        prop: 'obj',
        label: '股票代码',
        width: 100,
        align: 'left'
      }, {
        prop: 'zhongWenJianCheng',
        label: '股票名称',
        width: 100,
        align: 'left'
      }, {
        prop: 'hangYe',
        label: '行业',
        hidden: true,
        width: 220,
        align: 'left'
      }, {
        prop: 'zuiXinJia',
        label: '现价',
        format: {
          color: 'last'
        }
      }, {
        prop: 'zhangDie',
        label: '涨跌',
        format: {
          color: 'sign'
        }
      }, {
        prop: 'zhangFu',
        label: '涨跌幅',
        format: {
          color: 'sign',
          suffix: '%'
        }
      }, {
        prop: 'zhenFu',
        label: '振幅',
        format: {
          suffix: '%'
        }
      }, {
        prop: 'zuiGaoJia',
        label: '最高',
        format: {
          color: 'last'
        }
      }, {
        prop: 'zuiDiJia',
        label: '最低',
        format: {
          color: 'last'
        }
      }, {
        prop: 'kaiPanJia',
        label: '今开',
        format: {
          color: 'last'
        },
        hidden: true
      }, {
        prop: 'zuoShou',
        label: '昨收',
        hidden: true
      }, {
        prop: 'zhangTing',
        label: '涨停',
        format: {
          color: 'last'
        },
        hidden: true
      }, {
        prop: 'dieTing',
        label: '跌停',
        format: {
          color: 'last'
        },
        hidden: true
      }, {
        prop: 'chengJiaoLiang',
        label: '总量',
        width: 100,
        auto: true,
        format: {
          scale: 1 / 1000000,
          suffix: '万手'
        },
        hidden: true
      }, {
        prop: 'chengJiaoE',
        label: '总额',
        auto: true,
        format: {
          scale: 1 / 10000,
          suffix: '万'
        }
      }, {
        prop: 'huanShou',
        label: '换手',
        format: {
          suffix: '%'
        },
        hidden: true
      }, {
        prop: 'liangBi',
        label: '量比',
        hidden: true
      }, {
        prop: 'weiBi',
        label: '委比',
        format: {
          suffix: '%'
        },
        hidden: true
      }, {
        prop: 'shiYingLv',
        label: '市盈率(动)',
        width: 100,
        hidden: true
      }, {
        prop: 'jingTaiShiYingLv',
        label: '市盈率(静)',
        width: 100,
        hidden: true
      }, {
        prop: 'shiJingLv',
        label: '市净率',
        hidden: true
      }, {
        prop: 'meiGuJingZiChan',
        label: '每股净资产',
        width: 110,
        hidden: true
      }, {
        prop: 'zongShiZhi',
        label: '总市值',
        auto: true,
        format: {
          scale: 1 / 10000,
          suffix: '亿'
        },
        hidden: true
      }, {
        prop: 'zongGuBen',
        label: '总股本',
        auto: true,
        format: {
          scale: 1 / 10000,
          suffix: '亿'
        },
        hidden: true
      }, {
        prop: 'wuXianShouGuHeJi',
        label: '流通股',
        auto: true,
        format: {
          scale: 1 / 10000,
          suffix: '亿'
        },
        hidden: true
      }, {
        prop: 'zhouZuiGao',
        label: '52周最高',
        width: 100,
        hidden: true
      }, {
        prop: 'zhouZuiDi',
        label: '52周最低',
        width: 100,
        hidden: true
      }, {
        prop: 'mgfh',
        label: '股息',
        hidden: true
      }, {
        prop: 'gxsyl',
        label: '股息收益率',
        width: 110,
        format: {
          suffix: '%'
        },
        hidden: true
      }]
    }
  },
  created() {
    this.userId = this.$cookie.get("userId");
    this.getFollowStockData();
  },
  methods: {
    getMyAttentionCodes() {
      return new Promise((resolve, reject) => {
        this.$http({
          method: "GET",
          url: this.$api.stock.getMyAttentions,
          params: {
            userId: this.userId,
            pageNum: 1,
            pageSize: 1000
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            resolve(res.data.returnObject.map(e => e.obj));
          } else {
            resolve([]);
          }
        }).catch(reject);
      });
    },
    getFollowStockData() {
      this.getMyAttentionCodes().then(codes => {
        this.getStockInfoByCodes(codes.join(','), 0).then(res => {
          this.pollingStockInfoByCodes(codes.join(','), 0);
        }).catch(err => {});
      });
    },
    getStockInfoByCodes(codes, stockType) {
      return new Promise((resolve, reject) => {
        this.$http({
          method: "GET",
          url: this.$api.stock.getStockInfoByCodes,
          params: {
            fullCodes: codes,
            stockType: stockType
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.stockTableData = res.data.returnObject;
            this.isStockTableLoading = false;
          } else {
            this.stockTableData = [];
          }
          resolve(true);
        }).catch(reject);
      });
    },
    pollingStockInfoByCodes(codes, stockType) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setInterval(() => {
        let date = moment().format('YYYY-MM-DD');
        // 周一到周五 09:15 - 11:30  12:59-15:00 轮询
        if (moment(this.serverTime).weekday() >= 1 && moment(this.serverTime).weekday() <= 5 && (moment(this.serverTime).isBetween(date + ' 09:15:00', date + ' 11:30:00') || moment(this.serverTime).isBetween(date + ' 12:59:00', date + ' 15:00:00'))) {
          this.getStockInfoByCodes(codes, stockType);
        }
      }, 10 * 1000);
    },
    stockValueStyle(col, row) {
      let value = row[col.prop];
      if (col.format && col.format.color) {
        switch (col.format.color) {
          case 'sign':
            if (parseFloat(value) >= 0) {
              return { "red": true };
            } else {
              return { "green": true };
            }
          case 'last':
            if (parseFloat(value) >= parseFloat(row['zuoShou'])) {
              return { "red": true };
            } else {
              return { "green": true };
            }
        }
      }
      return false;
    },
    formatStockValue(col, row) {
      let value = row[col.prop];
      if (value === null) {
        return '--';
      }
      if (col.auto) {
        return this.$common.autoPrice(value);
      } else {
        if (col.format && col.format.scale) {
          value = value * col.format.scale
        }
        if (!isNaN(value)) {
          value = this.$common.abs(parseFloat(value))
        }
        if (col.format && col.format.suffix) {
          value = value + col.format.suffix
        }
      }
      return value;
    },
    batchCancel() {
      let fullCodes = this.stockSelection.map(e => e.obj.substr(2));
      console.log('test');
      this.$http({
        method: "GET",
        url: this.$api.stock.batchDeleteAttention,
        params: {
          companyCodes: fullCodes.toString(),
          userId: this.$cookie.get('userId')
        }
      }).then(res => {
        if (res.data.returnCode == 1 || res.data.returnCode == 200) {
          this.$confirm('确认取消关注选中股票？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.stockSelection = []
            this.$message({ showClose: true, type: 'success', duration: 3000, message: '取消关注成功' });
            this.getFollowStockData();
          }).catch(err => {});
        }
      }).catch(err => {});
    },
    onAddAttentionSuccess() {
      this.getFollowStockData();
    },
    handleSelectionChange(val) {
      this.stockSelection = val;
    },
    handleCancelAttention(index, row) {
      this.$confirm('确认取消关注该股票？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: "GET",
          url: this.$api.stock.deleteAttention,
          params: {
            companyFullCode: row.obj,
            userId: this.$cookie.get('userId')
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({ showClose: true, type: 'success', duration: 3000, message: '取消关注成功' });
            this.getFollowStockData();
          }
        }).catch(err => {});
      }).catch(err => {});
    }
  }
}
</script>
<style lang="scss">
#follow-companies {
  .flex-header {
    display: flex;
    align-items: center;
    .card-title {
      flex: 1;
    }
    .stock-search {
      width: 300px;
    }
  }
  .stock-table {
    .top {
      display: block;
      line-height: 1;
    }
    .bottom {
      display: block;
      line-height: 1;
      color: #aeaeae;
      transform: scale(0.8);
      transform-origin: 0 50%;
    }
  }
  .el-table {
    thead>tr>th {
      font-weight: 400;
      color: #bb9766;
    }
    .red {
      color: #fa4319;
    }
    .green {
      color: #29da89;
    }
  }
  .tips {
    height: 30px;
  }
}
</style>
