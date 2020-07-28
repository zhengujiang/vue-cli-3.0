<template>
  <div id="stockStruct">
    <!--GET /holderStructure/HoldingStockDegree 按持股集中度 -->
    <el-card v-loading="focusLoading" shadow="never" style="margin-top: 16px" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px 16px;">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
        <div class="col">
          <span class="titleInner">按持股集中度</span>
        </div>
      </div>
      <div class="vxa-flax-box align" style="margin-top: 15px">
        <div class="col">
          <div class="echart-overview" id="echart-focus" style="height: 300px"></div>
        </div>
        <div class="col t-right">
          <el-table ref="focusTable" @sort-change="focusSortChange" size="mini" max-height="375" :data="focusTable" stripe>
            <el-table-column align="center" prop="possessorType" label="类型"></el-table-column>
            <el-table-column sortable="custom" align="right" class-name="date-column" prop="possessorAmount" label="持股数量(股)">
              <template slot-scope="scope">
                {{amountAbs(scope.row.possessorAmount)}}
              </template>
            </el-table-column>
            <el-table-column align="right" prop="possessorRatio" label="持股比例(%)"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <!-- /holderStructure/HolderType 按股东性质-->
    <el-card v-loading="holderTypeLoading" shadow="never" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
        <div class="col">
          <span class="titleInner">按股东性质</span>
        </div>
        <div class="col t-right">
          <el-select @change="changeNum('holderType', holderTypeNum)" style="width: 85px" class="vxa-select-box"
                     size="mini" v-model="holderTypeNum" placeholder="请选择">
            <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="vxa-flax-box align">
        <div class="col">
          <div class="echart-overview" id="echart-holdertype"></div>
        </div>
        <div class="col t-right solve_overflow">
          <el-table ref="typeTable" key="holderType" size="mini" width="100%" max-height="350" @sort-change="typeSortChange" :span-method="arraySpanMethod" :summary-method="getSummariesType" show-summary :data="holderTypeTable.list" stripe>
            <el-table-column align="center" class-name="title-column" prop="possessorType" label="股东性质" width='170'>
              <template slot-scope="scope">
                <!-- <span>{{holderOptions[scope.row.possessorType]}}</span> -->
                <el-row>
                  <el-col :span="7" class="item1">
                    <span class="pointer" @click="showItemInfo(scope.row,scope.$index,'holderType')">{{holderOptions[scope.row.possessorType]}}
                      <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                      <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                    </span>
                  </el-col>
                  <el-col :span="6" class="el-right data-col">{{scope.row.possessorNumber}}</el-col>
                  <el-col :span="6" class="el-right data-col">{{amountAbs(scope.row.possessorAmount)}}</el-col>
                  <el-col :span="5" class="el-right data-ratio">{{scope.row.possessorRatio}}</el-col>
                </el-row>
                <div class="group-info" v-show="scope.row.showList">
                  <el-row class="contentRow" v-for="(item,index) in scope.row.list.slice(0,scope.row.indexNum*10 + 10)" :key="index">
                    <el-col :span="7" class="item1 itemName" :title="item.possessorName">
                      <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+item.id" target="_blank">
                        {{item.possessorName}}
                      </router-link>
                    </el-col>
                    <el-col :span="6" class="el-right data-col">&nbsp;{{item.possessorNumber}}</el-col>
                    <el-col :span="6" class="el-right data-col">&nbsp;{{amountAbs(item.possessorAmount)}}</el-col>
                    <el-col :span="5" class="el-right data-ratio">&nbsp;{{item.possessorRatio}}</el-col>
                  </el-row>
                  <el-row class="rowline">
                    <el-col :span="7" class="underlineall">
                      <span @click="takeUpAll(scope.row,scope.$index,'holderType')">收起全部</span>
                    </el-col>
                    <el-col :span="6" class="item1">&nbsp;</el-col>
                    <el-col :span="6" class="item1">&nbsp;</el-col>
                    <el-col :span="5" class="underlineall el-right" @click="continueLook(scope.row,scope.$index,'holderType')">
                      <span @click="continueLook(scope.row,scope.$index,'holderType')">继续查看</span>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column sortable="custom" class-name="title-column" align="right" prop="possessorNumber" label="个数(个)"></el-table-column>
            <el-table-column sortable="custom" class-name="title-column" align="right" prop="possessorAmount" label="持股数量(股)"></el-table-column>
            <el-table-column align="right" prop="possessorRatio" label="持股比例(%)"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <!-- /lastedholder/getCreditGuaranteeInfo 信用担保用户情况-->
    <el-card v-loading="creditAccountLoading" shadow="never" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
        <div class="col">
          <span class="titleInner">信用担保账户持股情况</span>
        </div>
        <div class="col t-right">
          <el-select @change="changeNum('creditAccount', creditAccountNum)" style="width: 85px" class="vxa-select-box"
                     size="mini" v-model="creditAccountNum" placeholder="请选择">
            <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="vxa-flax-box align">
        <div class="col">
          <div class="echart-overview" id="echart-credit" style="height: 380px"></div>
        </div>
        <div class="col t-right solve_overflow">
          <el-table ref="creditTable" key="creditAccount" @sort-change="accountSortChange" size="mini" max-height="375" :span-method="arraySpanMethod" :summary-method="getSummariesCredit" show-summary :data="creditAccountTable.dataList" stripe>
            <el-table-column class-name="title-column" align="center" prop="creditType" label="类型" width='170'>
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="7" class="item1">
                    <span class="pointer" :title="scope.row.creditType" @click="showItemInfo(scope.row,scope.$index,'creditAccount')">
                      <i class="possessorname">{{scope.row.creditType}}</i>
                      <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                      <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                    </span>
                  </el-col>
                  <el-col :span="6" class="el-right data-col">{{scope.row.personNumber}}</el-col>
                  <el-col :span="6" class="el-right data-col">{{amountAbs(scope.row.possessorAmount)}}</el-col>
                  <el-col :span="5" class="el-right data-ratio">{{scope.row.possesorRatio}}</el-col>
                </el-row>
                <div class="group-info" v-show="scope.row.showList">
                  <el-row class="contentRow" v-for="(item,index) in scope.row.rollOfficialDataList.slice(0,scope.row.indexNum*10 + 10)" :key="index">
                    <el-col :span="7" class="item1 possessor" :title="item.possessorName">
                      <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+item.id" target="_blank">
                        {{item.possessorName}}
                      </router-link>
                    </el-col>
                    <el-col :span="6" class="el-right data-col">&nbsp;{{item.personNumber}}</el-col>
                    <el-col :span="6" class="el-right data-col">&nbsp;{{amountAbs(item.possessorAmount)}}</el-col>
                    <el-col :span="5" class="el-right data-ratio">&nbsp;{{item.possessorRatio}}</el-col>
                  </el-row>
                  <el-row class="rowline">
                    <el-col :span="7" class="underlineall">
                      <span @click="takeUpAll(scope.row,scope.$index,'creditAccount')">收起全部</span>
                    </el-col>
                    <el-col :span="6" class="item1">&nbsp;</el-col>
                    <el-col :span="6" class="item1">&nbsp;</el-col>
                    <el-col :span="5" class="underlineall el-right" @click="continueLook(scope.row,scope.$index,'creditAccount')">
                      <span @click="continueLook(scope.row,scope.$index,'creditAccount')">继续查看</span>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column class-name="title-column" sortable="custom" align="right" prop="personNumber" label="个数(个)"></el-table-column>
            <el-table-column class-name="title-column" sortable="custom" align="right" prop="possessorAmount" label="持股数量(股)"></el-table-column>
            <el-table-column align="right" prop="possesorRatio" label="持股比例(%)"></el-table-column>
          </el-table>
          <p class="vxa-prompt">*&nbsp;因存在同时通过普通证券账户和信用担保账户持股的情况，股东合计个数可能超过{{creditAccountNum}}个</p>
        </div>
      </div>
    </el-card>
    <!-- /holderStructure/HolderAddress 按股东地理位置 -->
    <el-card v-loading="holderPositionLoading" shadow="never" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:16px">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
        <div class="col">
          <span class="titleInner">按股东地理位置分布</span>
        </div>
        <div class="col t-right">
          <el-select @change="changeNum('holderPosition', holderPositionNum)" style="width: 85px" class="vxa-select-box"
                     size="mini" v-model="holderPositionNum" placeholder="请选择">
            <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="vxa-flax-box align" style="margin-top: 15px">
        <div class="col">
          <div id="chart-maps"></div>
        </div>
        <div class="col t-right solve_overflow">
          <el-table ref="addressTable" size="mini" max-height="380" @sort-change="sortChange" :span-method="arraySpanMethod" :summary-method="getSummariesPosition" show-summary :data="holderPositionTable.list" stripe>
            <el-table-column class-name="title-column" align="center" prop="pickAddress" label="地理位置" width='170'>
              <template slot-scope="scope">
                <el-row>
                  <el-col :span="7" class="item1">
                    <span class="pointer" :title="scope.row.creditType" @click="showItemInfo(scope.row,scope.$index,'holderPosition')">
                      <i class="possessorname">{{scope.row.pickAddress}}</i>
                      <i class="el-icon-arrow-down" v-show="!scope.row.showList"></i>
                      <i class="el-icon-arrow-up" v-show="scope.row.showList"></i>
                    </span>
                  </el-col>
                  <el-col :span="6" class="el-right data-col">&nbsp;{{scope.row.holderAddressNumber}}</el-col>
                  <el-col :span="6" class="el-right data-col">&nbsp;{{amountAbs(scope.row.possessorAmount)}}</el-col>
                  <el-col :span="5" class="el-right data-ratio">&nbsp;{{scope.row.possessorRatio}}</el-col>
                </el-row>
                <div class="group-info" v-show="scope.row.showList">
                  <el-row class="contentRow" v-for="(item,index) in scope.row.list.slice(0,scope.row.indexNum*10 + 10)" :key="index">
                    <el-col :span="7" class="item1 itemName" :title="item.possessorName">
                      <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+item.id" target="_blank">
                        {{item.possessorName}}
                      </router-link>
                    </el-col>
                    <el-col :span="6" class="el-right data-col">&nbsp;{{item.possessorNumber}}</el-col>
                    <el-col :span="6" class="el-right data-col">&nbsp;{{amountAbs(item.possessorAmount)}}</el-col>
                    <el-col :span="5" class="el-right data-ratio">&nbsp;{{item.possessorRatio}}</el-col>
                  </el-row>
                  <el-row class="rowline">
                    <el-col :span="7" class="underlineall">
                      <span @click="takeUpAll(scope.row,scope.$index,'holderPosition')">收起全部</span>
                    </el-col>
                    <el-col :span="6" class="item1">&nbsp;</el-col>
                    <el-col :span="6" class="item1">&nbsp;</el-col>
                    <el-col :span="5" class="underlineall el-right" @click="continueLook(scope.row,scope.$index,'holderPosition')">
                      <span @click="continueLook(scope.row,scope.$index,'holderPosition')">继续查看</span>
                    </el-col>
                  </el-row>
                </div>
              </template>
            </el-table-column>
            <el-table-column class-name="title-column" sortable="custom" align="right" prop="holderAddressNumber" label="个数(个)"></el-table-column>
            <el-table-column class-name="title-column" sortable="custom" align="right" prop="possessorAmount" label="持股数量(股)"></el-table-column>
            <el-table-column align="right" prop="possessorRatio" label="持股比例(%)"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        numberOptions: [],
        holderTypeNum: '',
        creditAccountNum: '',
        holderPositionNum: '',
        focusTable: [],
        holderTypeTable: [],
        creditAccountTable: [],
        holderPositionTable: [],
        timeDate: '',
        focusLoading: false,
        holderTypeLoading: false,
        creditAccountLoading: false,
        holderPositionLoading: false,
        holderOptions: '',
        focusSort: '',
        addMountSort: '',
        addNumSort: '',
        typeMountSort: '',
        typeNumSort: '',
        accountMountSort: '',
        accountNumSort: ''
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      $route() {
        this.timeDate = this.$route.query.time;
        this.getHolderComparisonChooseDate();
        this.$refs.focusTable.clearSort();
        this.$refs.addressTable.clearSort();
        this.$refs.creditTable.clearSort();
        this.$refs.typeTable.clearSort();
        this.focusTable = [];
        this.holderTypeTable = [];
        this.creditAccountTable = [];
        this.holderPositionTable = [];
        this.focusSort = '';
        this.addMountSort = '';
        this.addNumSort = '';
        this.typeMountSort = '';
        this.typeNumSort = '';
        this.accountMountSort = '';
        this.accountNumSort = '';
      }
    },
    // 生命周期函数
    created() {
      this.holderOptions = this.$config.gxfType;
      this.timeDate = this.$route.query.time;
      this.getHolderComparisonChooseDate();
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
      // 表格合并列
      arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (columnIndex === 0) {
          return [1, 4];
        } else {
          return [0, 0];
        }
      },
      focusSortChange(val) {
        if (val.order == 'ascending') {
          this.focusSort = 'ASC';
        } else if (val.order == 'descending') {
          this.focusSort = 'DESC';
        } else {
          this.focusSort = '';
        }
        this.holdingStockDegree(true);
      },
      typeSortChange(val) {
        if (this.holderTypeNum) {
          if (val.prop == 'possessorAmount') {
            if (val.order == 'descending') {
              this.typeMountSort = 'DESC'
            } else if (val.order == 'ascending') {
              this.typeMountSort = 'ASC';
            } else {
              this.typeMountSort = '';
            }
            this.typeNumSort = '';
          } else if (val.prop == 'possessorNumber') {
            if (val.order == 'descending') {
              this.typeNumSort = 'DESC';
            } else if (val.order == 'ascending') {
              this.typeNumSort = 'ASC';
            } else {
              this.typeNumSort = '';
            }
            this.typeMountSort = '';
          }
          this.holderType('isSort'); // isSort 表示排序，eacharts图无须更新
        }
      },
      sortChange(val) {
        if (this.holderPositionNum) {
          if (val.prop == 'possessorAmount') {
            val.order == 'descending' ? this.addMountSort = 'DESC' : this.addMountSort = 'ASC';
            this.addNumSort = '';
          } else if (val.prop == 'holderAddressNumber') {
            val.order == 'descending' ? this.addNumSort = 'DESC' : this.addNumSort = 'ASC';
            this.addMountSort = '';
          }
          this.holderAddress();
        }
      },
      showItemInfo (row, index, type) {
        row.showList = !row.showList
        row.indexNum = 0;
        if (type == 'holderType') {
          this.holderTypeTable.list = Object.assign([], this.holderTypeTable.list)
        } else if (type == 'creditAccount') {
          this.creditAccountTable.dataList = Object.assign([], this.creditAccountTable.dataList)
        } else if (type == 'holderPosition') {
          this.holderPositionTable.list = Object.assign([], this.holderPositionTable.list)
        }
      },
      takeUpAll (row, index, type) {
        row.showList = false;
        if (type == 'holderType') {
          this.holderTypeTable.list = Object.assign([], this.holderTypeTable.list)
        } else if (type == 'creditAccount') {
          this.creditAccountTable.dataList = Object.assign([], this.creditAccountTable.dataList)
        } else if (type == 'holderPosition') {
          this.holderPositionTable.list = Object.assign([], this.holderPositionTable.list)
        }
      },
      continueLook (row, index, type) {
        row.indexNum++;
        if (type == 'holderType') {
          this.holderTypeTable.list = Object.assign([], this.holderTypeTable.list)
        } else if (type == 'creditAccount') {
          this.creditAccountTable.dataList = Object.assign([], this.creditAccountTable.dataList)
        } else if (type == 'holderPosition') {
          this.holderPositionTable.list = Object.assign([], this.holderPositionTable.list)
        }
      },
      getSummariesType(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property == 'possessorAmount') {
            sums[index] = this.amountAbs(this.holderTypeTable.totalAmount);
          } else if (column.property == 'possessorRatio') {
            sums[index] = this.holderTypeTable.totalRatio;
          } else if (column.property == 'possessorNumber') {
            sums[index] = this.amountAbs(this.holderTypeTable.totalNumber);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      getSummariesCredit(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property == 'possessorAmount') {
            sums[index] = this.amountAbs(this.creditAccountTable.allHoldAmount);
          } else if (column.property == 'possesorRatio') {
            sums[index] = this.creditAccountTable.allRatio;
          } else if (column.property == 'personNumber') {
            sums[index] = this.amountAbs(this.creditAccountTable.allPersonAmount);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      getSummariesPosition(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
            return;
          }
          if (column.property == 'possessorAmount') {
            sums[index] = this.amountAbs(this.holderPositionTable.totalAmount);
          } else if (column.property == 'possessorRatio') {
            sums[index] = this.holderPositionTable.totalRatio;
          } else if (column.property == 'holderAddressNumber') {
            sums[index] = this.amountAbs(this.holderPositionTable.totalNumber);
          } else {
            sums[index] = '';
          }
        });
        return sums;
      },
      changeNum(type, val) {
        if (type == 'holderType') {
          this.$refs.typeTable.clearSort();
          this.typeMountSort = '';
          this.typeNumSort = '';
          this.holderType();
        } else if (type == 'creditAccount') {
          this.$refs.creditTable.clearSort();
          this.accountMountSort = '';
          this.accountNumSort = '';
          this.getCreditGuaranteeInfo();
        } else if (type == 'holderPosition') {
          this.$refs.addressTable.clearSort();
          this.addMountSort = '';
          this.addNumSort = '';
          this.holderAddress('', '');
        }
      },
      getHolderComparisonChooseDate() {
        let params = {
          recordDates: this.timeDate,
          userId: this.$cookie.get('userId')
        }
        this.numberOptions = [];
        this.$axios.gxfApi.getHolderComparisonChooseDate(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            res.data.returnObject.forEach(item => {
              let obj = {label: `前${item}`, value: item};
              this.numberOptions.push(obj);
            })
            let num = '';
            // this.numberOptions[this.numberOptions.length - 1].value >= 200 ? num = 200 : num = this.numberOptions[this.numberOptions.length - 1].value;
            num = this.numberOptions[this.numberOptions.length - 1].value;
            this.holderTypeNum = num;
            this.creditAccountNum = num;
            this.holderPositionNum = num;
            this.getAllData();
          }
        })
      },
      getAllData() {
        this.holdingStockDegree();
        this.holderType();
        this.getCreditGuaranteeInfo('', '');
        this.holderAddress('', '');
      },
      // 按持股集中度
      holdingStockDegree(type) {
        this.focusLoading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          recordDate: this.timeDate,
          allAmountOrder: this.focusSort
        }
        this.$axios.gxfApi.holdingStockDegree(params).then((res) => {
          this.focusLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.focusTable = res.data.returnObject;
            let data = {
              amount: [],
              type: []
            }
            this.focusTable.forEach(item => {
              data.amount.push(item.possessorAmount);
              data.type.push(item.possessorType);
            })
            // this.barChart('echart-focus', data);
            if (!type) {
              this.echartOverview('echart-focus', data);
            }
          }
        }).catch(res => {
          this.focusLoading = false;
        })
      },
      // 按股东性质
      holderType(type) {
        this.holderTypeLoading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          recordDate: this.timeDate,
          limitNumber: this.holderTypeNum,
          allAmountOrder: this.typeMountSort,
          quantity: this.typeNumSort
        }
        this.$axios.gxfApi.holderType(params).then((res) => {
          this.holderTypeLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.holderTypeTable = res.data.returnObject;
            let obj = {
              name: '',
              value: ''
            }
            let data = [];
            let tableData = res.data.returnObject.list;
            for (let i = 0; i < tableData.length; i++) {
              tableData[i].showList = false;
              tableData[i].indexNum = 0;
              if (tableData[i].possessorType != '总计') {
                data.push({name: this.holderOptions[tableData[i].possessorType], value: tableData[i].possessorAmount})
              }
            }
            if (!type) {
              this.echartPies('echart-holdertype', data, '股东性质')
            }
          }
        }).catch(res => {
          this.holderTypeLoading = false;
        })
      },
      accountSortChange(row) {
        if (row.prop == 'personNumber') {
          this.accountMountSort = '';
          if (row.order == 'ascending') {
            this.accountNumSort = 'ASC'
          } else if (row.order == 'descending') {
            this.accountNumSort = 'DESC'
          } else {
            this.accountNumSort = '';
          }
        } else if (row.prop == 'possessorAmount') {
          this.accountNumSort = '';
          if (row.order == 'ascending') {
            this.accountMountSort = 'ASC';
          } else if (row.order == 'descending') {
            this.accountMountSort = 'DESC';
          } else {
            this.accountMountSort = '';
          }
        }
        this.getCreditGuaranteeInfo(true)
      },
      // 信用担保账户持股情况
      getCreditGuaranteeInfo(type) {
        this.creditAccountLoading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          recordDate: this.timeDate,
          limitNumber: this.creditAccountNum,
          allAmountOrder: this.accountMountSort,
          personNumberOrder: this.accountNumSort
        }
        this.$axios.gxfApi.getCreditGuaranteeInfo(params).then((res) => {
          this.creditAccountLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.creditAccountTable = res.data.returnObject;
            let obj = {
              name: '',
              value: ''
            }
            let data = [];
            let tableData = res.data.returnObject.dataList;
            for (let i = 0; i < tableData.length; i++) {
              tableData[i].showList = false;
              tableData[i].indexNum = 0;
              data.push({name: tableData[i].creditType, value: tableData[i].possessorAmount})
            }
            if (!type) {
              this.echartPies('echart-credit', data, '信用与非信用账户持股比例')
            }
          }
        }).catch(res => {
          this.creditAccountLoading = false;
        })
      },
      // 按股东地理位置分布
      holderAddress(mountSort, numSort) {
        this.holderPositionLoading = true;
        let params = {
          userId: this.$cookie.get('userId'),
          recordDate: this.timeDate,
          limitNumber: this.holderPositionNum,
          allAmountOrder: this.addMountSort,
          quantity: this.addNumSort
        }
        this.$axios.gxfApi.holderAddress(params).then((res) => {
          this.holderPositionLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.holderPositionTable = res.data.returnObject;
            let data = this.holderPositionTable.list
            for (let i = 0; i < data.length; i++) {
              data[i].showList = false;
              data[i].indexNum = 0;
            }
            this.echartMap('chart-maps', this.holderPositionTable.list);
          }
        }).catch(res => {
          this.holderPositionLoading = false;
        })
      },
      echartMap(id, datas) {
        if (!!!document.getElementById(id)) {
          return false
        }
        let myChart = echarts.init(document.getElementById(id));
        let mapData = [
          {name: '北京', value: 0, num: 0},
          {name: '天津', value: 0, num: 0},
          {name: '上海', value: 0, num: 0},
          {name: '重庆', value: 0, num: 0},
          {name: '河北', value: 0, num: 0},
          {name: '河南', value: 0, num: 0},
          {name: '云南', value: 0, num: 0},
          {name: '辽宁', value: 0, num: 0},
          {name: '黑龙江', value: 0, num: 0},
          {name: '湖南', value: 0, num: 0},
          {name: '安徽', value: 0, num: 0},
          {name: '山东', value: 0, num: 0},
          {name: '新疆', value: 0, num: 0},
          {name: '江苏', value: 0, num: 0},
          {name: '浙江', value: 0, num: 0},
          {name: '江西', value: 0, num: 0},
          {name: '湖北', value: 0, num: 0},
          {name: '广西', value: 0, num: 0},
          {name: '甘肃', value: 0, num: 0},
          {name: '山西', value: 0, num: 0},
          {name: '内蒙古', value: 0, num: 0},
          {name: '陕西', value: 0, num: 0},
          {name: '吉林', value: 0, num: 0},
          {name: '福建', value: 0, num: 0},
          {name: '贵州', value: 0, num: 0},
          {name: '广东', value: 0, num: 0},
          {name: '青海', value: 0, num: 0},
          {name: '西藏', value: 0, num: 0},
          {name: '四川', value: 0, num: 0},
          {name: '宁夏', value: 0, num: 0},
          {name: '海南', value: 0, num: 0},
          {name: '台湾', value: 0, num: 0},
          {name: '香港', value: 0, num: 0},
          {name: '澳门', value: 0, num: 0},
          {name: '南海诸岛', value: 0, num: 0}
        ]
        // function randomValue() {
        //   return Math.round(Math.random() * 1000);
        // }
        datas.forEach(e => {
          for (let i = 0; i < mapData.length; i++) {
            if (e.pickAddress.indexOf(mapData[i].name) != -1) {
              mapData[i].value = e.possessorAmount;
              mapData[i].num = e.holderAddressNumber;
            }
          }
        });
        let arr = [];
        mapData.forEach(e => {
          arr.push(e.value);
        });
        let that = this;
        arr.sort(function(a, b) { return b - a })
        let max = arr[0];
        let option = {
          tooltip: {
            show: true,
            trigger: 'item',
            // position: function (pt) {
            //   return [pt[0], '10%'];
            // },
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
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (data) {
              var html = `<div style="display:flex;color:#323232;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data.name}</span>
                          </div>`;
              html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>个数：</span><span style="color: #8d8d8d">${that.amountAbs(data.data.num)}</span></div>
                      <div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>持股数量：</span><span style="color: #8d8d8d">${that.amountAbs(data.value)}</span></div>`
              return html
            }
          },
          visualMap: {
            min: 0,
            max: max,
            left: 'left',
            top: 'bottom',
            text: ['高', '低'],
            // seriesIndex: [1],
            inRange: {
              color: ['#FFECD3', '#C5760D']
            },
            calculable: true
          },
          geo: {
            map: 'china',
            roam: false,
            label: {
              normal: {
                show: false,
                textStyle: {
                  color: 'rgba(0,0,0,0.0)'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#ccc'
              }
            },
            emphasis: {
              label: {
                color: 'transparent'
              },
              itemStyle: {
                areaColor: '#BB2740',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [
            {
              type: 'scatter',
              coordinateSystem: 'geo',
              symbolSize: 1,
              symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
              symbolRotate: 35,
              // label: {
              //   normal: {
              //     formatter: '{b}',
              //     position: 'right',
              //     show: false
              //   },
              //   emphasis: {
              //     show: false
              //   }
              // },
              itemStyle: {
                normal: {
                  color: '#fff'
                }
              }
            },
            {
              // name: '股东架构',
              type: 'map',
              geoIndex: 0,
              roam: false,
              data: mapData,
              itemStyle: {
                color: '#ff8148'
              },
              emphasis: {
                label: {
                  show: true,
                  position: 'inside',
                  color: '#aeaeae'
                },
                labelLine: {
                  lineStyle: {
                    color: '#e3e3e3'
                  }
                }
              }
            }
          ]
        };
        myChart.setOption(option);
      },
      // 柱状图
      echartOverview(id, data) {
        if (!!!document.getElementById(id)) {
          return false
        }
        let max = Math.max.apply(null, data.amount);
        let maxs = [];
        for (let i = 0; i < data.amount.length; i++) {
          maxs.push(max);
        }
        let that = this;
        let myChart = echarts.init(document.getElementById(id));
        // var color = ['#593301', '#945807', '#E98703', '#FF9E1B', '#FFB857', '#FFCA82', '#FFEACD'];
        let color = {
          '全部股东': '#FFEACD',
          '前500股东': '#FFCA82',
          '前200股东': '#FFB857',
          '前50股东': '#E98703',
          '前10股东': '#945807',
          '第一大股东': '#593301'
        }
        let option = {
            tooltip: {
              // 提示框
              trigger: 'axis',
              backgroundColor: '#fff',
              borderWidth: 1,
              borderColor: '#e3e3e3',
              textStyle: {
                color: "#aeaeae"
              },
              axisPointer: {
                type: 'none'
              },
              formatter: function (data) {
                var html = `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span style="color: #8d8d8d">${that.amountAbs(data[0].value)}</span></div>`
                return html
              }
            },
            // legend: {
            //     data: ['2011年', '2012年']
            // },
            grid: {
              top: '1%',
              left: '3%',
              right: '4%',
              bottom: '1%',
              containLabel: true
            },
            xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                axisLabel: {
                  rotate: 30,
                  margin: 10,
                  textStyle: {
                    color: "#8d8d8d",
                    fontSize: 10
                  }
                },
                max: function(val) {
                  return val.max
                },
                axisLine:{
                  lineStyle:{
                    color:'#E3E3E3',
                    width:1
                  }
                },
                splitLine: {
                  show: false
                }
            },
            yAxis: {
                type: 'category',
                data: data.type,
                axisLabel: {
                  textStyle: {
                    color: "#8d8d8d",
                    fontSize: 10
                  }
                },
                axisLine:{
                  lineStyle:{
                    color:'#E3E3E3',
                    width:1
                  }
                }
            },
            series: [
              {
                type: 'bar',
                data: data.amount,
                barWidth: 20,
                itemStyle: {
                  normal:{
                      color: function (params) {
                        return color[params.name];
                      }
                  }
                }
              },
              { // For shadow
                  type: 'bar',
                  itemStyle: {
                      normal: {color: 'rgba(0,0,0,0.05)'}
                  },
                  barGap:'-100%',
                  barWidth: 20,
                  data: maxs,
                  animation: false
              }
            ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      // 饼图
      echartPies(id, data, title) {
        if (!!!document.getElementById(id)) {
          return false
        }
        let that = this;
        let myChart = echarts.init(document.getElementById(id));
        // let color = ["#602221", "#FFB148", '#DC6900', '#968C6D', '#DDDDDD', '#F25B6E', '#DB536A', '#FFB600', '#BB2740', '#C0BAA7', '#FFE0B7'];
        let colorObj = {
          '公募基金': '#602221',
          '私募基金': '#FFE0B7',
          '证券公司资管产品': '#C0BAA7',
          '社保基金': '#DC6900',
          'QFII': '#BB2740',
          'RQFII': '#DB536A',
          '汇金公司': '#DDDDDD',
          '中证金': '#968C6D',
          '香港结算公司': '#FFB148',
          '一般机构或产品': '#FFB600',
          '自然人': '#F25B6E',
          '通过普通证券账户持有': '#FFB148',
          '通过信用担保账户持有': '#602221'
        }
        for (let i = 0; i < data.length; i++) {
          for (let key in colorObj) {
            if (data[i].name == key) {
              data[i].itemStyle = {
                color: colorObj[key]
              }
            }
          }
        }
        let option = {
          tooltip: {
            show: true,
            trigger: 'item',
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
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (data) {
              let html = `<div style="display:flex;color:#8d8d8d;justify-content:space-between">
                        <span>${data.name}：</span><span style="color: #8d8d8d">${that.amountAbs(data.value)}</span></div>`
              return html
            }
          },
          // color: color,
          // title: {
          //   text: title,
          //   left: 'center',
          //   bottom: 10,
          //   textStyle: {
          //     align: 'center',
          //     color: '#AEAEAE',
          //     fontSize: 12
          //   }
          // },
          series: [
            {
              name: title,
              type: 'pie',
              minAngle: 1,
              selectedMode: 'single',
              avoidLabelOverlap: true,
              hoverAnimation: false,
              // radius: ['30%', '50%'],
              radius: title == '股东性质' ? ['30%', '50%'] : ['30%', '50%'],
              center: ['50%', '50%'],
              data: data,
              label: {
                show: true,
                position: 'outside',
                formatter: '\n{b}',
                color: '#aeaeae',
                normal: {
                  formatter: function(item) {
                    return `${item.name}${that.amountAbs(item.value)}`
                  },
                  textStyle: {
                    color: '#aeaeae'
                  }
                }
              },
              labelLine: {
                show: true,
                length: 20,
                length2: 5,
                smooth: false,
                lineStyle: {
                  color: '#e3e3e3'
                }
              },
              itemStyle: {
                emphasis: {
                  label: {
                    show: true,
                    position: 'outside',
                    color: '#aeaeae'
                  },
                  labelLine: {
                    lineStyle: {
                      color: '#e3e3e3'
                    }
                  }
                }
              }
            }
          ]
        };
        myChart.setOption(option, true);
      },
      barChart(id, data) {
        if (!!!document.getElementById(id)) {
          return false
        }
        var myChart = echarts.init(document.getElementById(id));
        var option = {
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
                show: false,
                precision: 0
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
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (data) {
              var html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data[0].name}</span>
                          </div>`;
              data.forEach((item) => {
                if (item.seriesName.indexOf('率') > -1) {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}%</span></div>`
                } else {
                  html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}</span></div>`
                }
              });
              return html
            }
          },
          grid: {
            top: 40,
            left: 0,
            right: 20,
            bottom: 10,
            containLabel: true
          },
          color: ['#FFAC25', '#6D8CFF', '#FC6D40'],
          xAxis: {
            type: 'value',
            axisLabel: {
              margin: 10,
              route: 30,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            }
          },
          yAxis: [
            {
              type: 'category',
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
              },
              data: data.type
            },
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: ''
              },
              min: 0,
              max: 100,
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
            }],
          series: [
            {
              name: '负面',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              label: {
                normal: {
                  show: false,
                  position: 'insideRight'
                }
              },
              data: data.amount
            }
          ]
        };
        myChart.setOption(option, true);
      }
    }
  }
</script>
<style lang="scss">
  #stockStruct {
    .el-table {
      th {
        padding: 0;
        .cell {
          padding-left: 0;
        }
      }
      th.title-column {
        .cell {
          padding: 0;
        }
      }
      .el-table__body-wrapper {
        max-height: 300px;
      }
      .el-table--scrollable-y .el-table__body-wrapper {
        overflow-y: auto;
      }
      td.date-column {
        .cell {
          padding-right: 18px;
        }
      }
      tr {
        .data-col {
          padding-right: 15px;
        }
      }
      tr {
        .data-ratio {
          padding-right: 0;
        }
      }
      .el-table__footer-wrapper {
        tr {
          td {
            &:nth-child(3) {
              .cell {
                padding-right: 5px;
              }
            }
          }
        }

      }
    }
    .solve_overflow {
      .el-table {
        width: 580px;
      }
    }
    .group-info {
      border-top: 1px solid #e3e3e3;
      margin-top: 10px;
    }
    .el-left {
      text-align: left;
    }
    .el-center{
      text-align: center;
    }
    .el-right {
      text-align: right;
      padding-right: 10px;
    }
    .underlineall {
      color: #FFB148;
      text-decoration: underline;
    }
    .itemName {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .rowline {
      height: 40px;
      line-height: 40px;
      border-top: 1px solid #e3e3e3;
      cursor: pointer;
    }
    .el-table__expanded-cell[class*=cell] {
      padding: 0;
    }
    .contentRow {
      height: 30px;
      line-height: 30px;
      background:rgba(248,248,248,1);
    }
    .possessorname {
      display: inline-block;
      width: 80%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
    .possessor {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
    .vxa-prompt {
      padding: 10px 0 0 0;
      font-size: 12px;
      font-weight: 400;
      color: rgba(141, 141, 141, 1);
      text-align: left;
    }
  }
</style>

<style lang="scss">
  #stockStruct {
    .compare {
      .titleInner {
        color: rgba(50, 50, 50, 1);
        font-size: 14px;
        font-weight: 600;
        margin-right: 8px;
      }
      .echart-overview {
        height: 380px;
        width: 100%;
      }
    }
    #chart-maps {
      height: 380px;
      width: 100%;
      position: relative;
    }
  }
</style>
