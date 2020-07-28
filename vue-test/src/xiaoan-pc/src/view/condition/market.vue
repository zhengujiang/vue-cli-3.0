<template>
  <div id="market-condition">
    <div class="nav-container">
      <div class="content">
        <el-row :gutter="0">
          <el-col :span="18">
            <div class="industry-nav">
              <el-menu :default-active="currentNavIndex" mode="horizontal" @select="handleSelect">
                <el-menu-item index="0" v-if="userInfo.superviseUser">我监管的公司</el-menu-item>
                <el-menu-item index="1">沪深大盘</el-menu-item>
                <el-menu-item index="2">我关注的公司</el-menu-item>
                <el-menu-item index="3" v-if="userInfo.enterpriseUser">可比公司</el-menu-item>
                <el-menu-item index="4" v-if="userInfo.enterpriseUser">申万同行业</el-menu-item>
                <el-menu-item index="5" v-if="userInfo.enterpriseUser">证监会同行业</el-menu-item>
              </el-menu>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="attention-search">
              <v-stock-search type="attention" @onAddAttentionSuccess="onAddAttentionSuccess"></v-stock-search>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="head-bar">
            <span @click="toggleStockTable">{{toggleTooltipText}}<i
              :class="{'el-icon-arrow-right':isCollapse,'el-icon-arrow-left':!isCollapse}"></i></span>
            <el-pagination class="pagination-box" @prev-click="prevClick" @next-click="nextClick" :page-size="1"
                           :current-page.sync="currentPage" :total="totalPage" layout="prev, next" background small>
            </el-pagination>
          </div>
          <el-card :body-style="{ padding: '0px' }" shadow="never" class="box-card box-left">
            <div class="table-container">
              <!--               <el-tooltip class="item" effect="dark" :content="toggleTooltipText" placement="right-start">
                <el-button @click="toggleStockTable" size="mini" class="toggle-btn">
                  <i :class="{'el-icon-d-arrow-right':isCollapse,'el-icon-d-arrow-left':!isCollapse}"></i>
                </el-button>
              </el-tooltip> -->
              <el-table :data="stockTableData" size="small" class="stock-table" height="800" stripe
                        v-loading="isStockTableLoading" @row-click="stockRowClick" ref="stockTable">
                <el-table-column v-if="!col.hidden && !(currentNavIndex==1 && index==2)" :show-overflow-tooltip='true'
                                 v-for="(col,index) in stockTableColumns" :prop="col.prop" :key="index"
                                 :label="col.label" :width="col.width" :fixed="index<2" sortable
                                 :align="col.align?col.align:'right'">
                  <template slot-scope="scope">
                    <!--                     <span v-if="col.prop === 'zhongWenJianCheng'" style="text-align: left">
                      <span class="top">{{scope.row.zhongWenJianCheng}}</span>
                    <span class="bottom">{{scope.row.obj}}</span>
                    </span>
                    <span v-else :class="stockValueStyle(col,scope.row)">{{formatStockValue(col,scope.row)}}</span> -->
                    <span :class="stockValueStyle(col,scope.row)">{{formatStockValue(col,scope.row)}}</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="tips">
                <div class="left">
                  <p>更新时间：{{this.lastUpdateTime}}</p>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <div class="head-bar">
            <h4 class="side-title">信公小安商学院课程推荐</h4>
          </div>
          <el-card :body-style="{ padding: '0px' }" shadow="never" class="box-card card-with-image"
                   v-for="(ad,index) in ads" :key="index">
            <a :href="ad.link" target="_blank"><img :src="ad.src" class="card-image"></a>
          </el-card>
          <!--           <el-card :body-style="{ padding: '0px' }" shadow="never" class="box-card">
            <div class="card-header" slot="header">
              <h4>涨跌幅榜</h4>
              <ul class="switch">
                <li class="active">涨</li>
                <li>跌</li>
              </ul>
            </div>
            <el-table :data="zhangDieData" size="mini" class="small-table" stripe>
              <el-table-column v-for="col in zhangDieTableColumns" :prop="col.prop" :key="col.prop" :label="col.label" width="71">
                <template slot-scope="scope">
                  <span v-if="col.prop === 'zhangDie'" :class="stockValueStyle2(scope.row[col.prop])">{{scope.row[col.prop]}}</span>
                  <span v-else-if="col.prop === 'zhangFu'" :class="stockValueStyle2(scope.row[col.prop])">{{scope.row[col.prop]}}</span>
                  <span v-else>{{scope.row[col.prop]}}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-card> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import stockSearch from '@/view/condition/components/stockSearch'

  export default {
    data() {
      return {
        userId: '',
        userInfo: {},
        companyCode: '',
        currentNavIndex: '1',
        stockSearchData: [],
        lastUpdateTime: '',
        serverTime: '',
        currentPage: 1,
        totalPage: 1,
        scrollStepWidth: 300,
        globalIndicatorCodes: [ // 大盘指数代码
          "SH000001", "SZ399001", "SH000300", "SZ399005", "SZ399006", "SH000016", "SH000905", "SZ399673", "SH000015", "SH000010", "SH000009", "SH000903", "SH000906", "SH000002", "SH000003", "SZ399106", "SZ399101", "SZ399102", "SZ399107", "SZ399108"
        ],
        isCollapse: true,
        isStockTableLoading: true,
        stockTableData: [],
        stockInput: '',
        timer: null,
        sameIndustryCodes: [],
        ads: [{
          src: 'https://oss.in-hope.cn/xiaoan/web_static/promotion_lesson1.png',
          link: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81OWY4NDU0OGRjM2NkXzNoNFJYWFlNIiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'
        }, {
          src: 'https://oss.in-hope.cn/xiaoan/web_static/promotion_lesson2.png',
          link: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81OWU5YmI0ZDJjODI3X3RLV3I3TmxnIiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'
        }, {
          src: 'https://oss.in-hope.cn/xiaoan/web_static/promotion_lesson3.png',
          link: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81OWFkMzJjOGQ2Yzg2X2NSUUNxcmJ0IiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'
        }],
        stockTableColumns: [{
          prop: 'obj',
          label: '股票代码',
          width: 100,
          align: 'left'
        }, {
          prop: 'zhongWenJianCheng',
          label: '股票名称',
          width: 110,
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
          width: 90,
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
          width: 110,
          hidden: true
        }, {
          prop: 'jingTaiShiYingLv',
          label: '市盈率(静)',
          width: 110,
          hidden: true
        }, {
          prop: 'shiJingLv',
          label: '市净率',
          width: 90,
          hidden: true
        }, {
          prop: 'meiGuJingZiChan',
          label: '每股净资产',
          width: 110,
          hidden: true
        }, {
          prop: 'zongShiZhi',
          label: '总市值',
          width: 90,
          auto: true,
          format: {
            scale: 1 / 10000,
            suffix: '亿'
          },
          hidden: true
        }, {
          prop: 'zongGuBen',
          label: '总股本',
          width: 90,
          auto: true,
          format: {
            scale: 1 / 10000,
            suffix: '亿'
          },
          hidden: true
        }, {
          prop: 'wuXianShouGuHeJi',
          label: '流通股',
          width: 90,
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
        }],
        zhangDieTableColumns: [{
          prop: 'zhongWenJianCheng',
          label: '代码简称'
        }, {
          prop: 'zuiXinJia',
          label: '当前价'
        }, {
          prop: 'zhangDie',
          label: '涨跌'
        }, {
          prop: 'zhangFu',
          label: '涨跌幅'
        }],
        zhangDieData: Array(5).fill({
          'zhongWenJianCheng': '上证指数',
          'obj': '000001.SH',
          'zuiXinJia': 2882.02,
          'zhangDie': -10.9,
          'zhangFu': '+0.38%',
          'zhenFu': '1.11%',
          'zuiGaoJia': 2903.24,
          'zuiDiJia': 2869.71,
          'chengJiaoLiang': '35649728000000',
          'shiYingLv': 0.83
        })
      }
    },
    components: {
      'v-stock-search': stockSearch
    },
    computed: {
      toggleTooltipText() {
        return this.isCollapse ? '查看更多行情数据' : '精简版行情数据';
      }
    },
    created() {
      this.userId = this.$cookie.get("userId");
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      this.$nextTick(() => {
        this.refreshData(this.currentNavIndex);
      });
      // this.getStockInfoByCodes(this.globalIndicatorCodes.join(','), 1).then(res => {
      //   this.pollingStockInfoByCodes(this.globalIndicatorCodes.join(','), 1);
      // }).catch(err => {});
    },
    destroyed() {
      clearInterval(this.timer);
    },
    beforeRouteEnter(to, from, next) {
      // 不是从公司行情页跳转过来的默认显示沪深大盘
      next(vm => {
        if (vm.$route.query.index == 'supervise') {
          vm.setCurrentNavIndex('0');
        } else {
          let navIndex = (from.name === 'companyCustom') ? vm.$store.state.marketTabIndex : 1;
          vm.setCurrentNavIndex(navIndex.toString());
        }

      });
    },
    methods: {
      setCurrentNavIndex(navIndex) {
        this.currentNavIndex = navIndex;
      },
      pollingStockInfoByCodes(codes, stockType) {
        if (this.timer) {
          clearInterval(this.timer);
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
      getStockInfoByCodes(codes, stockType) {
        return new Promise((resolve, reject) => {
          if (!codes) {
            this.stockTableData = [];
            this.isStockTableLoading = false;
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
              this.lastUpdateTime = this.$common.transTime(res.data.apiDate)[2];
              this.serverTime = this.$common.transTime(res.data.timestamp)[2];
              this.stockTableData = res.data.returnObject;
              this.isStockTableLoading = false;
            } else {
              this.isStockTableLoading = false;
              this.stockTableData = [];
            }
            resolve(true);
          }).catch(reject);
        });
      },
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
              resolve(res.data.returnObject.map(e => e.obj) || []);
            }
            resolve([]);
          }).catch(reject);
        });
      },
      // 获取所有监管公司
      getAllSuperviseCompanyByUser() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
            method: "GET",
            params: {
              userId: this.userId
            }
          }).then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              resolve(res.data.returnObject.map(e => e.companyFullCode))
            }
            resolve([])
          }).catch(reject)
        })
      },
      getCodesByIndustryType(industryType) {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.stock.listSameIndustryCompany,
            params: {
              fullCode: this.userInfo.enterpriseCompanyFullCode,
              industryType: industryType,
              pageNum: 1,
              pageSize: 1000
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              if (res.data.returnObject) {
                resolve(res.data.returnObject.map(e => e.fullCode) || []);
              } else {
                resolve([]);
              }
            }
            resolve([]);
          }).catch(reject);
        });
      },
      getCompanyCompare() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.enterpriseCompany.getCompanyCompare,
            params: {
              companyId: this.userInfo.companyId,
              pageNum: 1,
              pageSize: 1000
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              if (res.data.returnObject) {
                resolve(res.data.returnObject.map(e => e.fullCode) || []);
              } else {
                resolve([]);
              }
            }
            resolve([]);
          }).catch(reject);
        });
      },
      onAddAttentionSuccess(val) {
        this.currentNavIndex = '2';
        this.getMyAttentionCodes().then(codes => {
          this.getStockInfoByCodes(codes.toString(), 0).then(res => {
            this.pollingStockInfoByCodes(codes.join(','), 0);
          }).catch(err => {
          });
        });
      },
      toggleStockTable() {
        this.isCollapse = !this.isCollapse;
        this.isStockTableLoading = true;
        setTimeout(() => {
          this.stockTableColumns.forEach((col, i) => {
            if (col.hasOwnProperty('hidden')) {
              this.$set(this.stockTableColumns[i], 'hidden', !col.hidden);
            }
          });
          this.isStockTableLoading = false;
          if (!this.isCollapse) {
            this.$nextTick(() => {
              setTimeout(() => {
                let wrapperWidth = document.querySelector('.stock-table .el-table__body-wrapper').clientWidth;
                let tableWidth = document.querySelector('.stock-table .el-table__body-wrapper>.el-table__body').clientWidth;
                console.log(wrapperWidth);
                this.totalPage = Math.ceil((tableWidth - wrapperWidth) / this.scrollStepWidth) + 1;

              }, 300)

            });

          }
        }, 1000);
      },
      handleSelect(menuIndex) {
        if (menuIndex == this.currentNavIndex) {
          return;
        }
        this.currentNavIndex = menuIndex;
        this.isStockTableLoading = true;
        this.refreshData(menuIndex);
      },
      refreshData(menuIndex) {
        switch (menuIndex) {
          case '0':
            this.getAllSuperviseCompanyByUser().then(codes => {
              this.getStockInfoByCodes(codes.toString(), 0).then(res => {
                this.pollingStockInfoByCodes(codes.join(','), 0);
              }).catch(err => {
              });
            });
            break;
          case '1':
            this.getStockInfoByCodes(this.globalIndicatorCodes.join(','), 1).then(res => {
              this.pollingStockInfoByCodes(this.globalIndicatorCodes.join(','), 1);
            }).catch(err => {
            });
            break;
          case '2':
            this.getMyAttentionCodes().then(codes => {
              this.getStockInfoByCodes(codes.toString(), 0).then(res => {
                this.pollingStockInfoByCodes(codes.join(','), 0);
              }).catch(err => {
              });
            });
            break;
          case '3':
            this.getCompanyCompare().then(codes => {
              this.getStockInfoByCodes(codes.toString(), 0).then(res => {
                this.pollingStockInfoByCodes(codes.join(','), 0);
              }).catch(err => {
              });
            });
            break;
          case '4':
            this.getCodesByIndustryType(1).then(codes => {
              this.getStockInfoByCodes(codes.toString(), 0).then(res => {
                this.pollingStockInfoByCodes(codes.join(','), 0);
              }).catch(err => {
              });
            }).catch(err => {
            });
            break;
          case '5':
            this.getCodesByIndustryType(0).then(codes => {
              this.getStockInfoByCodes(codes.toString(), 0).then(res => {
                this.pollingStockInfoByCodes(codes.join(','), 0);
              }).catch(err => {
              });
            }).catch(err => {
            });
            break;
        }
      },
      stockRowClick(row, event, column) {
        if (this.currentNavIndex != 1) {
          this.$store.dispatch('switchMarketTab', this.currentNavIndex);
          this.$router.push({path: '/company-condition/' + row.obj});
        }
      },
      prevClick() {
        let wrapper = document.querySelector('.stock-table .el-table__body-wrapper');
        wrapper.scrollLeft -= this.scrollStepWidth;
      },
      nextClick() {
        let wrapper = document.querySelector('.stock-table .el-table__body-wrapper');
        wrapper.scrollLeft += this.scrollStepWidth;
      },
      stockValueStyle2(value) {
        if (parseFloat(value) >= 0) {
          return {"red": true};
        } else {
          return {"green": true};
        }
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
      formatStockValue(col, row) {
        let value = row[col.prop];
        if (col.prop == 'gxsyl' && value === null) {
          return '0.00%'
        }
        if (value === null) {
          return '--';
        }

        if (col.auto) {
          if (col.prop == 'zongShiZhi' || col.prop == 'zongGuBen' || col.prop == 'wuXianShouGuHeJi') {
            return this.$common.autoPrice(value * 10000);
          } else {
            return this.$common.autoPrice(value);
          }

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
      }
    }
  }
</script>
<style lang="scss">
  #market-condition {
    background-color: #f6f6f6;
    min-height: 800px;
    .nav-container {
      background-color: #f0f1f5;
      border-bottom: solid 1px #e6e6e6;
      .attention-search {
        height: 48px;
        display: flex;
        align-items: center;
      }
    }
    .box-card {
      margin: 20px 0;
      &.box-left {
        min-height: 800px;
      }
    }
    .el-menu {
      background-color: transparent;
    }
    .el-menu--horizontal {
      border-bottom-width: 0;
      > .el-menu-item {
        &.is-active,
        &:hover {
          font-weight: 600;
          background-color: transparent;
        }
        height: 48px;
        line-height: 48px;
        padding: 0;
        margin: 0 2%;
      }
    }
    .industry-nav-search {
      height: 48px;
      display: flex;
      align-items: center;
      .el-autocomplete,
      .el-input {
        width: 100%;
      }
    }
    .table-container {
      padding: 10px 15px;
      position: relative;
      .toggle-btn {
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 100;
        padding: 6px;
      }
      .tips {
        margin: 10px 0;
        font-size: 12px;
        color: #aeaeae;
        display: flex;
        .left {
          flex: 1;
        }
        p {
          margin-bottom: 4px;
          line-height: 1.2;
        }
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
      td {
        cursor: pointer;
      }
    }
    .el-card__header {
      padding: 0;
    }
    .card-header {
      padding: 0;
      display: flex;
      align-items: center;
      h4 {
        font-size: 14px;
        padding: 6px 20px 6px 10px;
        margin: 0;
        color: #303133;
        font-weight: 600;
      }
      .switch {
        flex: 1;
        font-size: 14px;
        li {
          cursor: pointer;
          padding: 6px 0;
          margin-right: 6px;
          float: left;
          border-bottom: solid 2px transparent;
          color: #aeaeae;
          &:hover {
            color: #a1a1a1;
          }
          &.active {
            border-bottom-color: #ffb148;
            color: #ffb148;
          }
        }
      }
    }
    .card-with-image {
      border: none;
      &:hover {
        box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }
    }
    .card-image {
      width: 100%;
      display: block;
    }
    .head-bar {
      padding: 4px 0;
      margin: 12px 0;
      font-size: 14px;
      border-bottom: solid 1px #e3e3e3;
      display: flex;
      align-items: center;
      .pagination-box button {
        background-color: #fff;
      }
      span {
        flex: 1;
        color: #bb9766;
        cursor: pointer;
      }
    }
    .side-title {
      color: #ffb148;
      font-size: 14px;
      margin: 0;
    }
  }
</style>
