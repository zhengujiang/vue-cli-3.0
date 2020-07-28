<template>
  <el-card shadow="never" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px">
    <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
      <div class="col">
        <span class="titleInner" v-if="type == 'mech'">机构股东对比分析</span>
        <span class="titleInner" v-if="type == 'person'">自然人对比分析</span>
        <span class="titleTime" v-if="timeSelect.length == 2">{{timeSelect[0]}}期与{{timeSelect[1]}}期</span>
        <span class="titleTime" v-else>{{timeSelect[0]}}期与{{timeSelect[1]}}等{{timeSelect.length}}期</span>
      </div>
      <div class="col t-right">
        <span class="page-img" v-if="timeSelect.length>5">
          <el-pagination :current-page.sync="page" @prev-click="addLeft" @next-click="addRight" class="primary-small"
                         small background layout="prev, next" :total="(timeSelect.length-4)*10"></el-pagination>
        </span>
        <span class="holderTitle" v-if="type == 'mech'">股东性质</span>
        <el-select v-if="type == 'mech'" @change="holderChange" style="width: 130px" popper-class="shareholder"
                   class="vxa-select-box" size="mini" v-model="holderSelect" placeholder="全部">
          <el-option
            v-for="item in holderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select @change="changeNum(type, mechSelect)" style="width: 85px" class="vxa-select-box" size="mini"
                   v-model="mechSelect" placeholder="请选择">
          <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                     :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="type" v-if="timeSelect.length == 2">
      <el-checkbox-group :min='1' @change="changeComparison(type, mechTypes)" v-model="mechTypes">
        <el-checkbox :label="1"><span>--</span>稳定</el-checkbox>
        <el-checkbox :label="2"><img class="chk-img" :src="$image.stockholder.c2">新进</el-checkbox>
        <el-checkbox :label="3"><img class="chk-img" :src="$image.stockholder.c3">退出</el-checkbox>
        <el-checkbox :label="4"><img class="chk-img" :src="$image.stockholder.c4">增持</el-checkbox>
        <el-checkbox :label="5"><img class="chk-img" :src="$image.stockholder.c5">减持</el-checkbox>
      </el-checkbox-group>
    </div>
    <el-table ref="tableFocus" size="mini" @sort-change="sortChangeMech" v-loading="mechLoading"
              v-if="timeSelect.length == 2" :data="mechTableData" stripe max-height="400" style="width: 100%">
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="holderName" label="股东名称" width="113">
        <template slot-scope="scope">
          <router-link v-if="scope.row.lastedId" class="vxa-a-hover underline"
                       :to="'/stockholder/institutionAccountInfo?id='+scope.row.lastedId" target="_blank">
            {{scope.row.holderName}}
          </router-link>
          <router-link v-else class="vxa-a-hover underline"
                       :to="'/stockholder/institutionAccountInfo?id='+scope.row.oldId" target="_blank">
            {{scope.row.holderName}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="holderType" label="股东性质"
                       width="115"></el-table-column>
      <el-table-column align="right" class-name="date-column-sort" sortable='custom' prop="lastedPossessAmount"
                       :label="lastRecordDate + '持股数量(股)'" width="150"></el-table-column>
      <el-table-column align="right" class-name="date-column" prop="lastedRatio" :label="lastRecordDate + '持股比例(%)'"
                       width="100"></el-table-column>
      <el-table-column align="right" class-name="split-column" prop="order" label="序号" width="70">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column align="right" class-name="date-column" prop="oldPossessAmount" :label="oldRecordDate + '持股数量(股)'"
                       width="115"></el-table-column>
      <el-table-column align="right" class-name="date-column" prop="oldRatio" :label="oldRecordDate + '持股比例(%)'"
                       width="100"></el-table-column>
      <el-table-column align="right" show-overflow-tooltip sortable='custom' prop="changeStock" label="变化股(股)"
                       width="128">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1"><span v-if="scope.row.changeStock != 0">{{ scope.row.changeStock}}</span>&nbsp;<span>--</span></span>
          <span v-if="scope.row.status == 2"><span v-if="scope.row.changeStock != 0">{{ scope.row.changeStock}}</span>&nbsp;<img
            class="chk-img" :src="$image.stockholder.c2"></span>
          <span v-if="scope.row.status == 3"><span v-if="scope.row.changeStock != 0">{{ scope.row.changeStock}}</span>&nbsp;<img
            class="chk-img" :src="$image.stockholder.c3"></span>
          <span v-if="scope.row.status == 4"><span v-if="scope.row.changeStock != 0">{{ scope.row.changeStock}}</span>&nbsp;<img
            class="chk-img" :src="$image.stockholder.c4"></span>
          <span v-if="scope.row.status == 5"><span v-if="scope.row.changeStock != 0">{{ scope.row.changeStock}}</span>&nbsp;<img
            class="chk-img" :src="$image.stockholder.c5"></span>
        </template>
      </el-table-column>
      <el-table-column align="right" class-name="date-column" prop="changeRatio" label="变化比例(占总股本)(%)"
                       width="95"></el-table-column>
      <el-table-column align="center" class-name="date-column" label="添加到持股变动图" width="100">
        <template slot-scope="scope">
          <el-checkbox @change="echartsChangeMech(type, scope.$index, scope.row.onePassAccount)"
                       v-model="scope.row.checkBox"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <tableTotal v-if="timeSelect.length == 2" :total="mechTotal"></tableTotal>
    <el-table ref="tableFocus" size="mini" @sort-change="sortChangeMech" v-loading="mechLoading"
              v-if="timeSelect.length > 2" max-height="400" :data="mechTableData" stripe>
      <el-table-column align="center" label="序号">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="holderName" label="股东名称">
        <template slot-scope="scope">
          <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.holderId"
                       target="_blank">
            {{scope.row.holderName}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip align="center" prop="holderType" label="股东性质"></el-table-column>
      <el-table-column sortable="custom" class-name="date-column date-column-more date-column-sort" align="center"
                       :prop="timeSelect[0]" :label="timeSelect[0] + '持股数量(股)'"></el-table-column>
      <el-table-column class-name="date-column date-column-more split-column" align="center"
                       :prop="timeSelect[mechIndex + 1]"
                       :label="timeSelect[mechIndex + 1] + '持股数量(股)'"></el-table-column>
      <el-table-column class-name="date-column date-column-more"
                       v-for="(item, index) in timeSelect.slice(mechIndex + 2, mechIndex + 1 + 4)" :key="index"
                       align="center" :prop="item" :label="item + '持股数量(股)'"></el-table-column>
      <el-table-column align="center" class-name="date-column" label="添加到持股变动图" width="100">
        <template slot-scope="scope">
          <el-checkbox @change="echartsChangeMech(type, scope.$index, scope.row.onePassAccount)"
                       v-model="scope.row.checkBox"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>
    <div v-show="mechOnePass.length > 0" class="vxa-flax-box align vux-1px-b" style="height: 45px;">
      <div class="col">
        <span class="titleInner">
          <span class="titleTime" v-if="timeSelect.length == 2">{{timeSelect[0]}}期与{{timeSelect[1]}}期</span>
          <span class="titleTime" v-else>{{timeSelect[0]}}期与{{timeSelect[1]}}等{{timeSelect.length}}期</span>
          &nbsp;&nbsp;持股变动图
        </span>
      </div>
    </div>
    <div v-show="mechOnePass.length > 0" class="echart-overview" :id="`echart-${type}`"
         v-loading="mechChartLoading"></div>
  </el-card>
</template>
<script>
  import tableTotal from './tableTotal.vue';
  export default {
    data() {
      return {
        page: 1,
        // numberOptions: [],
        holderOptions: [{
          value: '1,2,3,4,5,6,7,8,9,10',
          label: '全部'
        }, {
          value: '1',
          label: '公募基金'
        }, {
          value: '2',
          label: '私募基金'
        }, {
          value: '3',
          label: '证券公司资管产品'
        }, {
          value: '4',
          label: '社保基金'
        }, {
          value: '5',
          label: 'QFII'
        }, {
          value: '6',
          label: 'RQFII'
        }, {
          value: '7',
          label: '汇金公司'
        }, {
          value: '8',
          label: '中证金'
        }, {
          value: '9',
          label: '香港结算公司'
        }, {
          value: '10',
          label: '一般机构或产品'
        }], // 自然人 value 11
        holderSelect: '1,2,3,4,5,6,7,8,9,10', // 股东性质选择
        mechSelect: '',
        recordDate: [],
        mechTypes: [1, 2, 3, 4, 5], // 机构股东对比
        // checkListRecord: [],
        mechTableData: [], // 机构股东表格数据
        companySummaryData: {
          dateTime: '',
          question: [],
          answer: [],
          answerRate: []
        },
        timeSelect: [], // 一键对比之后选中的日期
        mechLoading: false, // 机构股东loading
        mechChartLoading: false,
        // chooseNum: '', // 默认对比数量
        lastRecordDate: '',
        oldRecordDate: '',
        mechIndex: 0,
        mechOnePass: [],
        mechSort: {
          prossesSort: '', // 持股数量排序
          changeSort: '' // 变化股排序
        },
        mechTotal: {
          allAmount: '',
          allRatio: ''
        }
      }
    },
    props: ['time', 'chooseNum', 'checkListRecord', 'numberOptions', 'type'],
    watch: {
      time: function () {
        // this.sortChangeNature();
        this.timeSelect = this.time;
        this.mechSelect = this.chooseNum;
        this.holderSelect = '1,2,3,4,5,6,7,8,9,10';
        this.mechTypes = [1, 2, 3, 4, 5];
        this.$nextTick(() => {
          this.$refs.tableFocus.clearSort();
          this.mechSort = {
            prossesSort: '', // 持股数量排序
            changeSort: '' // 变化股排序
          };
          if (this.timeSelect.length == 2) {
            this.getHolderComparisonInfo(this.chooseNum, this.type);
          } else {
            this.getOneKeyComparisonInfo(this.chooseNum, this.type);
          }
        })
      },
      chooseNum: function () {
        this.mechSelect = this.chooseNum;
      },
      changeData: function () {
        if (this.timeSelect.length == 2) {
          this.getHolderComparisonInfo(this.chooseNum, this.type);
        } else {
          this.getOneKeyComparisonInfo(this.chooseNum, this.type);
        }
      }
    },
    components: {
      tableTotal
    },
    mounted() {
      this.mechSelect = this.chooseNum;
    },
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
      addLeft(val) {
        // if (val == 'mech') {
        if (this.mechIndex == 0) {
          return false
        } else {
          this.mechIndex--;
        }
        // }
        // if (val == 'person') {
        //   if (this.personIndex == 0) {
        //     return false
        //   } else {
        //     this.personIndex--;
        //   }
        // }
      },
      addRight(val) {
        // if (val == 'mech') {
        if (this.mechIndex + 5 >= this.timeSelect.length) {
          return false
        } else {
          this.mechIndex++;
        }
        // }
        // if (val == 'person') {
        //   if (this.personIndex + 5 >= this.timeSelect.length) {
        //     return false
        //   } else {
        //     this.personIndex++;
        //   }
        // }
      },
      changeComparison(type, val) {
        if (type == 'mech' || type == 'person') {
          // type == 'mech' ? this.mechLoading = true : this.personLoading = true;
          // type == 'mech' ? this.mechChartLoading = true : this.personChartLoading = true;
          this.mechLoading = true;
          this.mechChartLoading = true;

          if (this.timeSelect.length == 2) {
            this.getHolderComparisonInfo(this.chooseNum, type);
          } else {
            this.getOneKeyComparisonInfo(this.chooseNum, type);
          }
        }
      },
      changeNum(type, val) {
        if (type == 'mech' || type == 'person') {
          // type == 'mech' ? this.mechLoading = true : this.personLoading = true;
          // type == 'mech' ? this.mechChartLoading = true : this.personChartLoading = true;
          this.mechLoading = true;
          this.mechChartLoading = true;
          this.$refs.tableFocus.clearSort();
          this.mechSort = {
            prossesSort: '', // 持股数量排序
            changeSort: '' // 变化股排序
          };
          if (this.timeSelect.length == 2) {
            this.getHolderComparisonInfo(val, type);
          } else {
            this.getOneKeyComparisonInfo(val, type);
          }
        }
      },
      // 机构股东对比，选择股东性质
      holderChange(val) {
        this.$refs.tableFocus.clearSort();
        this.mechSort = {
          prossesSort: '', // 持股数量排序
          changeSort: '' // 变化股排序
        };
        if (this.timeSelect.length == 2) {
          this.getHolderComparisonInfo(this.chooseNum, 'mech', val);
        } else {
          this.getOneKeyComparisonInfo(this.chooseNum, 'mech', val);
        }
      },
      // 机构股东排序
      sortChangeMech({column, prop, order}) {
        if (column && column.label && column.label == `${this.timeSelect[0]}持股数量(股)`) {
          this.mechSort.changeSort = '';
          order == 'ascending' ? this.mechSort.prossesSort = 'ASC' : this.mechSort.prossesSort = 'DESC';
        } else if (column && column.label && column.label == '变化股(股)') {
          this.mechSort.prossesSort = '';
          order == 'ascending' ? this.mechSort.changeSort = 'ASC' : this.mechSort.changeSort = 'DESC';
        }
        if (this.timeSelect.length == 2) {
          this.getHolderComparisonInfo(this.chooseNum, 'mech');
        } else {
          this.getOneKeyComparisonInfo(this.chooseNum, 'mech');
        }
      },
      // 机构股东与自然人对比分析 两期对比
      getHolderComparisonInfo(chooseNum, type) {
        let dates = [];
        this.timeSelect.forEach(item => {
          dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
        })
        dates.sort();
        let params = {
          lastedRecordDate: dates[1], // 最新权益登记日
          oldRecordDate: dates[0], // 比较权益登记日
          userId: this.$cookie.get('userId'),
          chooseNum: chooseNum, // 对比数量
          summationTypes: this.mechTypes.join(',')
          // possessorAmountOrder: '',
          // changeAmountOrder: ''
        }
        let holderParams = Object.assign({holderPropertys: this.holderSelect}, params); // 机构股东
        let personParams = Object.assign({holderPropertys: '11'}, params); // 自然人
        if (this.type == 'mech') {
          this.mechHolderComparisonInfo(holderParams);
        } else if (this.type == 'person') {
          this.peresonHolderComparisonInfo(personParams)
        }
      },
      // 机构股东与自然人对比分析 多期对比
      getOneKeyComparisonInfo(chooseNum, type) {
        this.page = 1;
        let dates = [];
        this.timeSelect.forEach(item => {
          dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
        })
        let params = {
          recordDates: dates.join(','), // 权益登记日
          userId: this.$cookie.get('userId'),
          chooseNum: chooseNum // 对比数量
          // possessorAmountOrder: '',
          // changeAmountOrder: ''
        };
        let holderParams = Object.assign({holderPropertys: this.holderSelect}, params); // 机构股东
        let personParams = Object.assign({holderPropertys: '11'}, params); // 自然人
        if (this.type == 'mech') {
          this.mechOneKeyComparisonInfo(holderParams);
        } else if (this.type == 'person') {
          this.personOneKeyComparisonInfo(personParams)
        }
        // else if (type == 'all') {
        //   this.mechOneKeyComparisonInfo(holderParams);
        //   this.personOneKeyComparisonInfo(personParams);
        // }
      },
      // 机构股东 双期
      mechHolderComparisonInfo(params) {
        let obj = {
          possessorAmountOrder: this.mechSort.prossesSort,
          changeAmountOrder: this.mechSort.changeSort
        }
        let holderParams = Object.assign(params, obj);
        this.mechTableData = [];
        this.$axios.gxfApi.getHolderComparisonInfo(holderParams).then((res) => {
          this.mechLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.mechTableData = res.data.returnObject.list;
            this.mechTotal.allAmount = res.data.returnObject.allAmount;
            this.mechTotal.allRatio = res.data.returnObject.allRatio;
            for (let i = 0; i < this.mechTableData.length; i++) {
              if (this.mechTableData[i].lastedDate && this.mechTableData[i].oldDate) {
                this.lastRecordDate = this.mechTableData[i].lastedDate;
                this.oldRecordDate = this.mechTableData[i].oldDate;
                break;
              }
            }
            this.mechOnePass = [];
            for (let i = 0; i < this.mechTableData.length; i++) {
              if (i == 0 || i == 1 || i == 2) {
                this.mechTableData[i].checkBox = true;
                this.mechOnePass.push(this.mechTableData[i].onePassAccount);
              } else {
                this.mechTableData[i].checkBox = false;
              }
            }
            for (let i = 0; i < this.mechTableData.length; i++) {
              let data = this.mechTableData[i];
              for (let key in data) {
                if (key == 'lastedRatio' || key == 'oldRatio') {
                  if (data[key]) {
                    data[key] = data[key].toFixed(2);
                  }
                }
                if (key == 'lastedPossessAmount' || key == 'oldPossessAmount' || key == 'changeStock') {
                  data[key] = this.amountAbs(data[key]);
                }
              }
            }
            this.getHolderComparisonChart('mech');
          }
        })
      },
      // 机构股东 多期
      mechOneKeyComparisonInfo(params) {
        let obj = {
          possessorAmountOrder: this.mechSort.prossesSort,
          changeAmountOrder: ''
        }
        let holderParams = Object.assign(params, obj);
        this.mechTableData = [];
        this.$axios.gxfApi.getOneKeyComparisonInfo(holderParams).then((res) => {
          this.mechLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.mechTableData = res.data.returnObject.dataList;
            this.mechOnePass = [];
            if (this.timeSelect.length > 2) {
              this.timeSelect.forEach(item => {
                for (let i = 0; i < this.mechTableData.length; i++) {
                  this.mechTableData[i][item] = this.amountAbs(this.mechTableData[i][item])
                }
              })
            }
            for (let i = 0; i < this.mechTableData.length; i++) {
              if (i == 0 || i == 1 || i == 2) {
                this.mechTableData[i].checkBox = true;
                this.mechOnePass.push(this.mechTableData[i].onePassAccount);
              } else {
                this.mechTableData[i].checkBox = false;
              }
            }
            this.getHolderComparisonChart('mech');
          }
        })
      },
      // 持股变动图
      echartsChangeMech(type, rowIndex, val) {
        this.mechTableData = Object.assign([], this.mechTableData);
        const row = this.mechTableData[rowIndex];
        if (this.mechOnePass.length < 3) {
          if (row.checkBox) {
            this.mechOnePass.push(this.mechTableData[rowIndex].onePassAccount);
          } else {
            let index = this.mechOnePass.findIndex(e => e == row.onePassAccount);
            this.mechOnePass.splice(index, 1);
          }
        } else {
          if (row.checkBox) {
            this.$message({showClose: true, type: "error", duration: 3000, message: '最多三个选项'});
            this.$set(row, "checkBox", false);
          } else {
            let index = this.mechOnePass.findIndex(e => e == row.onePassAccount);
            this.mechOnePass.splice(index, 1);
          }
        }
        this.getHolderComparisonChart();
      },
      // 机构股东与自然人 持股变动图
      getHolderComparisonChart(type) {
        // type == 'mech' ? this.mechChartLoading = true : this.personChartLoading = true;
        this.mechChartLoading = true
        let dates = [];
        this.timeSelect.forEach(item => {
          dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
        })
        let params = {
          recordDates: dates.join(','),
          // onePass: type == 'mech' ? this.mechOnePass.join(',') : this.mechOnePass.join(','),
          onePass: this.mechOnePass.join(','),
          userId: this.$cookie.get('userId')
        }
        this.$axios.gxfApi.getHolderComparisonChart(params).then((res) => {
          // type == 'mech' ? this.mechChartLoading = false : this.personChartLoading = false;
          this.mechChartLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject;
            let chartData = {};
            if (data.length > 0) {
              chartData.dateTime = data.map(e => {
                // return this.$common.transTime(e.date)[1]
                return e.date
              })
              chartData.stockPrice = data.map(e => {
                return e.stockPrice
              })
              chartData.possessorName = data[0].rollOfficialDataList.map(e => {
                return e.possessorName
              })
              chartData.possessorName.push('股价')

              let amountData = []
              data[0].rollOfficialDataList.forEach((item, index) => {
                let possessorName = item.possessorName
                let amount = []
                data.forEach((item2, index2) => {
                  amount.push(item2.rollOfficialDataList[index].possessorAmount)
                })
                amount = this.unitArray(amount)
                amountData.push({'possessorName': possessorName, 'amount': amount})
              })
              chartData.amountData = amountData
              chartData.areaMarketValue = data[0].rollOfficialDataList.map(e => {
                return e.possessorAmount
              })
              chartData.companyMarketValue = data[1].rollOfficialDataList.map(e => {
                return e.possessorAmount
              })

              chartData.dateTime = this.unitArray(chartData.dateTime)
              chartData.stockPrice = this.unitArray(chartData.stockPrice)

              this.echartOverview(`echart-${this.type}`, chartData)
            }
          }
        })
      },
      unitArray(arr) {
        arr.unshift('')
        arr.unshift('')
        arr.unshift('')
        arr.push('')
        arr.push('')
        arr.push('')
        return arr
      },
      // 自然人 双期
      peresonHolderComparisonInfo(params) {
        let obj = {
          possessorAmountOrder: this.mechSort.prossesSort,
          changeAmountOrder: this.mechSort.changeSort
        }
        let personParams = Object.assign(params, obj);
        this.mechTableData = [];
        this.$axios.gxfApi.getHolderComparisonInfo(personParams).then((res) => {
          this.mechLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.mechTableData = res.data.returnObject.list;
            this.mechTotal.allAmount = res.data.returnObject.allAmount;
            this.mechTotal.allRatio = res.data.returnObject.allRatio;
            for (let i = 0; i < this.mechTableData.length; i++) {
              if (this.mechTableData[i].lastedDate && this.mechTableData[i].oldDate) {
                this.lastRecordDate = this.mechTableData[i].lastedDate;
                this.oldRecordDate = this.mechTableData[i].oldDate;
                break;
              }
            }
            this.mechOnePass = [];
            for (let i = 0; i < this.mechTableData.length; i++) {
              if (i == 0 || i == 1 || i == 2) {
                this.mechTableData[i].checkBox = true;
                this.mechOnePass.push(this.mechTableData[i].onePassAccount);
              } else {
                this.mechTableData[i].checkBox = false;
              }
            }
            for (let i = 0; i < this.mechTableData.length; i++) {
              let data = this.mechTableData[i];
              for (let key in data) {
                if (key == 'lastedRatio' || key == 'oldRatio') {
                  if (data[key] !== 0) {
                    data[key] = data[key].toFixed(2);
                  }
                }
                if (key == 'lastedPossessAmount' || key == 'oldPossessAmount' || key == 'changeStock') {
                  data[key] = this.amountAbs(data[key]);
                }
              }
            }
            this.getHolderComparisonChart('person');
          }
        })
      },
      // 自然人 多期
      personOneKeyComparisonInfo(params) {
        let obj = {
          possessorAmountOrder: this.mechSort.prossesSort,
          changeAmountOrder: ''
        }
        let personParams = Object.assign(params, obj);
        this.mechTableData = [];
        this.$axios.gxfApi.getOneKeyComparisonInfo(personParams).then((res) => {
          this.mechLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.mechTableData = res.data.returnObject.dataList;
            this.mechOnePass = [];
            if (this.timeSelect.length > 2) {
              this.timeSelect.forEach(item => {
                for (let i = 0; i < this.mechTableData.length; i++) {
                  this.mechTableData[i][item] = this.amountAbs(this.mechTableData[i][item])
                }
              })
            }
            for (let i = 0; i < this.mechTableData.length; i++) {
              if (i == 0 || i == 1 || i == 2) {
                this.mechTableData[i].checkBox = true;
                this.mechOnePass.push(this.mechTableData[i].onePassAccount);
              } else {
                this.mechTableData[i].checkBox = false;
              }
            }
            this.getHolderComparisonChart('person');
          }
        })
      },
      echartOverview(id, data) {
        console.log(data)
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7', '#738bff', '#ffac25', '#FF7844'];
        let seriesData = []
        data.amountData.forEach((item, index) => {
          seriesData.push({
            name: item.possessorName,
            type: 'bar',
            itemStyle: {normal: {color: color[index]}},
            barWidth: 10,
            barGap: '10%',
            data: item.amount.reverse()
          })
        })
        seriesData.push({
          name: '股价',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {normal: {color: '#C0BAA7'}},
          symbol: "circle",
          symbolSize: 7,
          data: data.stockPrice.reverse()
        })
        console.log(seriesData);
        let that = this;
        var option = {
          title: {
            text: '市值： (亿元)',
            show: false,
            textStyle: {
              color: '#323232',
              fontWeight: 400,
              fontSize: 14
            },
            top: 10,
            left: 40
          },
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae"
            },
            formatter: function (data) {
              if (data[0].name) {
                let html = `<div style="display:flex;color:#8d8d8d;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data[0].name}</span>
                          </div>`;
                data.forEach((item, index) => {
                  let value = 0
                  if (item.seriesName == '股价' && item.value) {
                    value = item.value.toFixed(2)
                  } else {
                    value = that.$array.amountAbs(item.value)
                  }
                  html += `
                  <div style="display:flex;justify-content:space-between">
                    <span>${item.seriesName}：</span><span>${value}</span>
                  </div>
                `
                })
                return html
              } else {
                return ''
              }
            }
          },
          grid: {
            top: "25%",
            left: "0%",
            right: "0%",
            bottom: "10%",
            containLabel: true
          },
          legend: {
            selectedMode: false,
            align: 'left',
            top: 10,
            left: 5,
            formatter: function (name) {
              if (name == '股价') {
                return name + '(元)'
              } else {
                return name + '(股)'
              }
            },
            data: data.possessorName
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: 100,
              top: 325,
              height: 15,
              backgroundColor: '#FFE0B7',
              fillerColor: '#DFCCAF',
              showDataShadow: false,
              showDetail: false,
              handleIcon: 'image://https://oss.in-hope.cn/xiaoan/web_static/echart_circle.png',
              handleSize: '130%'
            },
            {
              type: 'inside',
              show: true,
              start: 0,
              end: 100,
              handleSize: 8
            }
          ],
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 30,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            boundaryGap: true,
            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: data.dateTime.reverse()
          }],
          yAxis: [
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            },
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: '{value}'
              },
              // min: 0,
              // // max: 100,
              // max: function(value) {
              //   let max = parseInt(value.max * 2)
              //   if (max == 0) {
              //     max = 1
              //   }
              //   return max
              // },
              position: 'right',
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            }
          ],
          series: seriesData
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
