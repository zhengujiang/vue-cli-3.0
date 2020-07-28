<template>
  <div id="application-compare">
    <div class="flex-box">
      <div class="flex">
        <header>
          <h4 class="card-title">可比公司设置</h4>
        </header>
      </div>
      <div class="flex flex-right">
        <v-stock-search type="compare" @onSelectSuccess="onSelectSuccess"></v-stock-search>
      </div>
    </div>
    <div class="companyNumber">可比公司数：{{page.total}}</div>
    <el-table height="501" :data="stockTableData" size="small" class="stock-table" stripe
              @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="30" align="left" header-align="left">
      </el-table-column>
      <el-table-column v-if="!col.hidden" v-for="(col,index) in stockTableColumns" :prop="col.prop" :key="index"
                       :label="col.label" :width="col.width" :fixed="index==0" :sortable="!col.sortable"
                       :align="col.align?col.align:'right'" :sort-orders="['ascending','descending']">
        <template slot-scope="scope">
          <span :class="stockValueStyle(col,scope.row)">{{formatStockValue(col,scope.row)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100" align="center" header-align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="handleCancelAttention(scope.$index, scope.row)">取消关注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="foot-page">
      <div class="flex left">
        <el-button type="text" size="small" v-if="stockSelection.length" @click="batchCancel">取消可比所选</el-button>
      </div>
      <div class="flex middle">
        <el-pagination background layout="prev, pager, next" :page-size="page.size" :total="page.total"
                       @current-change="handleCurrentChange">
        </el-pagination>
      </div>
      <div class="flex">
      </div>
    </div>
  </div>
</template>
<script>
  import VStockSearch from '@/view/condition/components/stockSearch'

  export default {
    name: "application-compare",
    components: {
      VStockSearch
    },
    data() {
      return {
        value: '',
        isStockTableLoading: false,
        stockTableData: [],
        page: {
          index: 1,
          size: 10,
          total: 0
        },
        userInfo: {},
        stockSelection: [],
        stockTableColumns: [{
          prop: 'zhongWenJianCheng',
          label: '股票代码',
          width: 90,
          align: 'center',
          sortable: true
        }, {
          prop: 'obj',
          label: '股票简称',
          width: 90,
          align: 'center',
          sortable: true
        }, {
          prop: 'zongShiZhi',
          label: '总市值',
          format: {
            scale: 1 / 10000,
            suffix: '亿'
          }
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
          },
          hidden: true
        }, {
          prop: 'zuiGaoJia',
          label: '最高',
          format: {
            color: 'last'
          },
          hidden: true
        }, {
          prop: 'zuiDiJia',
          label: '最低',
          format: {
            color: 'last'
          },
          hidden: true
        }, {
          prop: 'kaiPanJia',
          label: '今开',
          format: {
            color: 'last'
          },
          hidden: true
        }, {
          prop: 'hangYe',
          label: '行业',
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
          format: {
            scale: 1 / 1000000,
            suffix: '万手'
          },
          hidden: true
        }, {
          prop: 'chengJiaoLiang',
          label: '总额',
          format: {
            scale: 1 / 100000000,
            suffix: '亿'
          },
          hidden: true

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
          label: '市盈率(动)'
          // width: 100
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
          prop: 'zongGuBen',
          label: '总股本',
          format: {
            scale: 1 / 100000000,
            suffix: '亿'
          },
          hidden: true
        }, {
          prop: 'liuTongBGu',
          label: '流通股',
          format: {
            scale: 1 / 100000000,
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
            scale: 1 / 100000000,
            suffix: '亿'
          },
          hidden: true
        }]
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.getCompanyCompare();
    },
    methods: {
      batchCancel() {
        let code = this.stockSelection.map(e => e.code);
        this.deleteCompanyCompare(code.toString());
      },
      deleteCompanyCompare(code) {
        this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
        this.$http({
          method: "POST",
          url: this.$api.enterpriseCompany.deleteCompanyCompare,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: this.userInfo.companyId,
            companyCode: code
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 200) {
            this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
            this.getCompanyCompare();
          }
        }).catch((err) => {

        })
      },
      handleCancelAttention(index, row) {
        console.log(index, row.obj);
        let code = row.code;
        this.$confirm('确定要取消关注吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteCompanyCompare(code)
        }).catch(() => {

        });
      },
      stockValueStyle(col, row) {
        let value = row[col.prop];
        if (col.format && col.format.color) {
          switch (col.format.color) {
            case 'sign':
              if (parseFloat(value) >= 0) {
                return {"red": true};
              } else {
                return {"green": true};
              }
            case 'last':
              if (parseFloat(value) >= parseFloat(row['zuoShou'])) {
                return {"red": true};
              } else {
                return {"green": true};
              }
          }
        }
        return false;
      },
      //
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
      //
      handleSelectionChange(val) {
        console.log(val);
        this.stockSelection = val;
      },
      //
      onSelectSuccess(data) {
        console.log(data);
        this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
        this.getCompanyCompare();
      },
      //
      handleCurrentChange(val) {
        console.log(val);
        this.page.index = val;
        this.getCompanyCompare();
      },
      //
      getCompanyCompare() {
        this.$http({
          method: "GET",
          url: this.$api.enterpriseCompany.getCompanyCompare,
          params: {
            companyId: this.userInfo.companyId,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.page.total = res.data.total;
              let data = res.data.returnObject;
              let fullCodes = data.map(e => e.fullCode);
              this.getStockInfoByCodes(fullCodes.toString(), 0);
            } else {
              this.stockTableData = [];
            }
          }
        }).catch((err) => {

        })
      },
      //
      getStockInfoByCodes(codes, stockType) {
        return new Promise((resolve, reject) => {
          if (!codes) {
            reject(new Error('empty codes'));
          }
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
              this.stockTableData.map((obj) => {
                obj.code = obj.obj.replace('SH', '').replace('SZ', '')
              })
              this.isStockTableLoading = false;
            } else {
              this.isStockTableLoading = false;
              this.stockTableData = [];
            }
            resolve(true);
          }).catch(reject);
        });
      }
    }
  }
</script>
<style lang="scss">
  #application-compare {
    .flex-box {
      width: 100%;
      display: flex;
      align-items: center;
      .flex {
        flex: 1;
        &.flex-right {
          text-align: right;
          padding-left: 40%;
        }
      }
    }
    .companyNumber {
      font-size: 14px;
      color: #8d8d8d;
      text-align: left;
      text-indent: 1em;
    }
    .foot-page {
      margin-top: 20px;
      text-align: center;
      display: flex;
      width: 100%;
      .flex {
        flex: 1;
        &.middle {
          flex: 0 0 70%;
        }
        &.left {
          text-align: left;
        }
      }
    }
    .el-table {
      thead > tr > th {
        font-weight: 400;
        color: #bb9766;
      }
      .red {
        color: #fa4319;
      }
      .green {
        color: #29da89;
      }
      &.small-table.el-table--scrollable-x .el-table__body-wrapper {
        overflow-x: hidden;
      }
    }
  }
</style>
