<template>
  <div id="stockholderComparison">
    <div class="select-date">
      <div class="check-data">
        <el-checkbox-group v-model="stages" @change="change1" :min='2' :max="12">
          <el-checkbox v-for="item in stageList" :label="item" :key="item">{{item}}期</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="comparison-btnbox">
        <el-button class="comparison-btn" type="primary" @click="comparison">一键对比</el-button>
        <div class="tip">默认勾选最新2期，最多选12期</div>
      </div>
    </div>
    <div v-if="quantity == 2" class="change">
      <div class="changeLeft" v-loading="priceLoading">
        <p class="changeInfo">股价变化
          <i @mouseover="mouseoverPrice" @mouseout="mouseoutPrice" class="el-icon-info i-info"></i>
        </p>
        <div v-if="priceDisplay" class="priceDisplay">
          {{recordDateSearch[0]}}期较{{recordDateSearch[1]}}期股价变化及变化幅度
        </div>
        <div v-if="!priceDisplay" class="changeInner">
          <span>
            <em v-if="stockPrice.difference > 0" class="up">+{{stockPrice.difference}}</em>
            <em v-else-if="stockPrice.difference < 0" class="down">{{stockPrice.difference}}</em>
            <em v-else="stockPrice.difference = 0" class="equally">{{stockPrice.difference}}</em>(元)
          </span>
          <span>
            <em v-if="stockPrice.ratio > 0" class="up">+{{stockPrice.ratio}}</em>
            <em v-else-if="stockPrice.ratio < 0" class="down">{{stockPrice.ratio}}</em>
            <em v-else="stockPrice.ratio = 0" class="equally">{{stockPrice.ratio}}</em>(%)
          </span>
        </div>
      </div>
      <div class="changeRight" v-loading="natureLoading">
        <p class="changeInfo">股东变化
          <i @mouseover="mouseoverShareholder" @mouseout="mouseoutShareholder" class="el-icon-info i-info"></i>
        </p>
        <div v-if="shareholderDisplay" class="shareholderDisplay">
          {{recordDateSearch[0]}}期较{{recordDateSearch[1]}}期股东变化情况，取前{{numberName}}名股东数据
        </div>
        <div v-if="!shareholderDisplay" class="changeInner">
          <span><em>{{wending}}</em>稳定(户)</span>
          <span><em>{{xinjin}}</em>新进(户)</span>
          <span><em>{{tuichu}}</em>退出(户)</span>
          <span><em>{{zengchi}}</em>增持(户)</span>
          <span><em>{{jianchi}}</em>减持(户)</span>
        </div>
      </div>
    </div>
    <div class="compare vxa_card-b-margin">
      <div class="title">
        <div class="titleInfo">
          <span v-if="quantity == 2" class="titleInner">{{recordDateSearch[0]}}期对比{{recordDateSearch[1]}}期</span>
          <span v-if="quantity > 2" class="titleInner">{{recordDateSearch[0]}}期对比{{recordDateSearch[1]}}等{{recordDateSearch.length}}期</span>
        </div>
        <div class="titleStocker">
          <span class="page-img" v-if="recordDateSearch.length>5">
            <el-pagination @prev-click="backward" @next-click="forward" class="primary-small" small background
                           layout="prev, next" :total="pageNum"></el-pagination>
          </span>
          股东性质
          <el-select class="holderType" popper-class="shareholder" @change="holderTypeChange" v-model="shareHolderType"
                     size="mini" placeholder="全部">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-select class="holderNumber" popper-class="shareholder" @change="holderNumber" v-model="numberName"
                     size="mini" placeholder="前200名">
            <el-option
              v-for="item in firstNumber"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="two-phases" v-show="quantity == 2" v-loading="natureLoading">
        <div class="type">
          <el-checkbox-group v-model="types" :min="1" @change="recalculation">
            <el-checkbox :label="1"><span>--稳定</span></el-checkbox>
            <el-checkbox :label="2"><img class="chk-img" :src="$image.stockholder.c2">新进</el-checkbox>
            <el-checkbox :label="3"><img class="chk-img" :src="$image.stockholder.c3">退出</el-checkbox>
            <el-checkbox :label="4"><img class="chk-img" :src="$image.stockholder.c4">增持</el-checkbox>
            <el-checkbox :label="5"><img class="chk-img" :src="$image.stockholder.c5">减持</el-checkbox>
          </el-checkbox-group>
        </div>
        <el-table ref="tableFocus" @sort-change="tableSortChange" :data="tableData" stripe max-height="395"
                  style="width: 100%" show-summary
                  :summary-method="getSummaries" size="mini">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="holderName" label="股东名称" width="140" show-overflow-tooltip align="center">
            <template slot-scope="scope">
              <router-link class="vxa-a-hover underline"
                           :to="'/stockholder/institutionAccountInfo?id='+(scope.row.lastedId ? scope.row.lastedId : scope.row.oldId)"
                           target="_blank">
                {{scope.row.holderName}}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="holderType" label="股东性质" width="120" align="center"></el-table-column>
          <el-table-column prop="lastedPossessAmount" :label="recordDateSearch[0]+'持股数量(股)'" width="120" align="center"
                           sortable="custom" class-name="two-column"></el-table-column>
          <el-table-column prop="lastedRatio" :label="recordDateSearch[0]+'持股比例(%)'" width="120"
                           class-name="two-column"></el-table-column>
          <el-table-column type="index" label="序号" width="80" class-name="split-column" align="right"></el-table-column>
          <el-table-column prop="oldPossessAmount" :label="recordDateSearch[1]+'持股数量(股)'" width="120"
                           class-name="two-column" align="center"></el-table-column>
          <el-table-column prop="oldRatio" :label="recordDateSearch[1]+'持股比例(%)'" width="100" class-name="two-column"
                           align="center"></el-table-column>
          <el-table-column prop="changeStock" label="变化股(股)" width="130" align="right" sortable="custom"
                           class-name="two-column-right">
            <template slot-scope="scope">
              <span v-if="scope.row.status != 1">{{scope.row.changeStock}}</span>&nbsp;
              <i v-if="scope.row.status == 1">--</i>
              <img v-if="scope.row.status == 2" :src="$image.stockholder.c2">
              <img v-if="scope.row.status == 3" :src="$image.stockholder.c3">
              <img v-if="scope.row.status == 4" :src="$image.stockholder.c4">
              <img v-if="scope.row.status == 5" :src="$image.stockholder.c5">
            </template>
          </el-table-column>
          <el-table-column prop="changeRatio" label="变化比例(占总股本)(%)" width="85" class-name="two-column-rgt"
                           align="center"></el-table-column>
          <el-table-column prop="addImg" label="添加到持股变动图" width="80" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isShow" @change="handleSelectionChange1(scope.$index)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="quantity > 2" class="multiphase" v-loading="manyLoading">
        <el-table ref="tableFocusIn" @sort-change="tableSortChange" :data="tableDataLot" stripe max-height="395"
                  style="width: 100%" size="mini">
          <el-table-column type="index" label="序号" width="60" align="center"></el-table-column>
          <el-table-column prop="holderName" label="股东名称" align="center" width="180" show-overflow-tooltip>
            <template slot-scope="scope">
              <router-link class="vxa-a-hover underline"
                           :to="'/stockholder/institutionAccountInfo?id='+scope.row.holderId" target="_blank">
                {{scope.row.holderName}}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="holderType" label="股东性质" width="120" align="center"></el-table-column>
          <el-table-column :prop="recordDateSearch[0]" class-name="first-column" :label="recordDateSearch[0]+'持股数量(股)'"
                           width="170" align="center" sortable="custom"></el-table-column>
          <el-table-column :prop="cutArray[0]" :label="cutArray[0]+'持股数量(股)'" align="center"
                           class-name="split-column date-column">
            <template slot-scope="scope">
              <div :class="span()">{{scope.row[cutArray[0]]}}</div>
            </template>
          </el-table-column>
          <el-table-column :prop="cutArray[1]" :label="cutArray[1]+'持股数量(股)'" align="center" class-name="date-column">
            <template slot-scope="scope">
              <div :class="span()">{{scope.row[cutArray[1]]}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="cutArray[2]" :prop="cutArray[2]" :label="cutArray[2]+'持股数量(股)'" align="center"
                           class-name="date-column">
            <template slot-scope="scope">
              <div :class="span()">{{scope.row[cutArray[2]]}}</div>
            </template>
          </el-table-column>
          <el-table-column v-if="cutArray[3]" :prop="cutArray[3]" :label="cutArray[3]+'持股数量(股)'" align="center"
                           class-name="date-column">
            <template slot-scope="scope">
              <div :class="span()">{{scope.row[cutArray[3]]}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="addImg" label="添加到持股变动图" width="90" align="center">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isShow" @change="handleSelectionChange(scope.$index)"></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom-info">
        <div class="totalNumber">
          <span>共{{totalNumber}}条</span>
        </div>
        <div class="export">
          <el-button class="export-btn" type="primary" @click="exportRollOfficialDig =true">导出Excel</el-button>
        </div>
      </div>
    </div>
    <div class="changeImg" v-if="onePassArray.length > 0">
      <div class="title">
        <p class="titleInner">
          <span v-if="quantity == 2">{{recordDateSearch[0]}}期与对比{{recordDateSearch[1]}}期</span>
          <span v-if="quantity > 2" class="titleInner">{{recordDateSearch[0]}}期对比{{recordDateSearch[1]}}等{{recordDateSearch.length}}期</span>
          <span>持股变动图</span></p>
      </div>
      <div v-if="quantity == 2" id="comparisonChartOne" style="width:100%;height: 330px;"
           v-loading="pictureLoading"></div>
      <div v-if="quantity > 2" id="comparisonChart" style="width:100%;height: 330px;" v-loading="pictureLoading"></div>
    </div>
    <!---->
    <!---->
    <el-dialog top="35vh" class="dialogStockHolder exportRollOfficialDig" :visible.sync="exportRollOfficialDig"
               width="620px" :show-close="true" :close-on-click-modal="false" center
               :title="exportRollOfficialDigTitle">
      <!---->
      <div class="progress-log">
        <div class="message" style="color: #8d8d8d;padding: 0 0 10px 0;font-size:14px;">导出数据需要一些时间，请耐心等待！</div>
        <div class="officialDig-box">
          <div class="col title">导出范围:</div>
          <div class="col">
            <el-radio-group v-model="checkedNum" @change="radioGroupChange">
              <el-radio :label="item.value" :key="index"
                        v-for="(item,index) in firstNumber">{{item.label}}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="center" style="padding-top: 10px">
          <el-button style="width: 150px" size="small" type="primary" plain @click="exportRollOfficialClick(0,false)">取消
          </el-button>
          <el-button style="width: 150px" size="small" type="primary" @click="exportRollOfficialClick(0,true)">确认
          </el-button>
        </div>
      </div>
      <!---->
      <el-dialog top="35vh" :before-close="beforeCloseDig" width="620px" :title="exportRollOfficialDigTitle"
                 :visible.sync="doneDownProgress"
                 append-to-body>
        <div class="progress-log">
          <div class="message">导出数据需要一些时间，请耐心等待！</div>
          <vxa-progress v-model="uploadAnalysis" :animation="false" :height="12" :width="'100%'"></vxa-progress>
        </div>
      </el-dialog>
      <!---->
      <el-dialog top="35vh" :close-on-click-modal="false" :show-close="false" width="620px"
                 :title="exportRollOfficialDigTitle"
                 :visible.sync="doneDownClear" append-to-body>
        <div class="message" style="text-align: center">您将放弃导出显示信息！</div>
        <div class="center top20" style="padding-top: 20px">
          <el-button @click="exportRollOfficialClick(2,false)" style="width: 150px" type="primary" class="check-btn"
                     plain>放弃
          </el-button>
          <el-button @click="exportRollOfficialClick(2,true)" style="width: 150px" type="primary" class="check-btn">
            继续导出
          </el-button>
        </div>
      </el-dialog>
      <!---->
      <el-dialog top="35vh" :before-close="beforeCloseDig" :close-on-click-modal="false" width="620px"
                 :title="exportRollOfficialDigTitle"
                 :visible.sync="doneDown" append-to-body>
        <div class="message" style="text-align: center;">导出完成！</div>
        <div class="center top20" style="padding-top: 20px">
          <el-button style="width: 150px" @click="exportRollOfficialClick(4,true)" type="primary" class="check-btn">确认
          </el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        exportRollOfficialDig: false,
        doneDownProgress: false,
        doneDownClear: false,
        doneDown: false,
        uploadAnalysis: 0,
        exportRollOfficialFileUrl: '',
        exportRollOfficialDigTitle: '导出股东对比分析',
        checkedNum: '200',
        nextCheckedNum: '200',
        userId: '',
        natureLoading: false,
        pictureLoading: false,
        manyLoading: false,
        priceLoading: false,
        quantity: '', // 控制哪个table表格显示
        stageList: [],
        stages: [], // 选中期数
        recordDateSearch: [], // 表格要显示的期数
        cutArray: [], // 翻页截取的字段
        length: '',
        i: 1,
        userInfo: {},
        lastedRecordDate: '',
        oldRecordDate: '',
        time: '',
        stockPrice: {},
        options: [{
          value: '1,2,3,4,5,6,7,8,9,10,11',
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
        }, {
          value: '11',
          label: '自然人'
        }],
        value: '',
        shareHolderType: '1,2,3,4,5,6,7,8,9,10,11',
        firstNumber: [],
        numberName: "200",
        possessorAmountOrder: '', // 持股数量排序 DESC:倒序
        changeAmountOrder: '', // 变化股排序 DESC:倒序
        types: [1, 2, 3, 4, 5], // 合计项类别,默认选中5项
        jianchi: '',
        tuichu: '',
        wending: '',
        xinjin: '',
        zengchi: '',
        changeStock: '', // 总变化股数
        changeRatio: '', // 总变化比例
        onePass: '', // 一码通
        onePassArray: [],
        tableData: [],
        tableDataLot: [],
        totalNumber: '',
        companySummaryLading: false,
        firstDisplay: false, // 判断是否为第一次显示
        priceDisplay: false,
        shareholderDisplay: false,
        pageNum: 1,
        exportRollOfficialFileName: ''
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.getLastedRecordDate();
    },
    mounted() {
      // 图表的方法
    },
    // 方法
    methods: {
      mouseoverPrice() {
        this.priceDisplay = true;
      },
      mouseoutPrice() {
        this.priceDisplay = false;
      },
      mouseoverShareholder() {
        this.shareholderDisplay = true;
      },
      mouseoutShareholder() {
        this.shareholderDisplay = false;
      },
      // 数字每三位加一个逗号
      amountAbs(val) {
        if (val == null) {
          return '--';
        } else if (val == 0) {
          return 0;
        } else if (val == '--') {
          return '--';
        } else {
          return this.$array.abs(val, false);
        }
      },
      beforeCloseDig() {
        this.doneDownClear = true;
      },
      span() {
        if (this.quantity == 3) {
          return 'date3'
        } else if (this.quantity == 4) {
          return 'date4'
        } else if (this.quantity >= 5) {
          return 'date5'
        }
      },
      //
      exportRollOfficialClick(type, bool) {
        switch (type) {
          case 0:
            if (bool) {
              //
              this.exportRollOfficialDig = bool;
              this.doneDownProgress = bool;
              this.exportOneKeyComparisonExcel();
              this.uploadAnalysis = 0
              window.exportRoll = setInterval(_ => {
                this.uploadAnalysis += Math.ceil(Math.random());
                if (this.uploadAnalysis >= 72) {
                  clearInterval(window.exportRoll);
                }
              }, 1213)
            } else {
              this.exportRollOfficialDig = false;
              this.checkedNum = this.nextCheckedNum;
            }
            break;
          case 1:
            break;
          case 2:
            if (bool) {
              //
              this.exportRollOfficialDig = bool;
              this.doneDownClear = false;
            } else {
              //
              this.exportRollOfficialDig = false;
              this.doneDownProgress = false;
              this.doneDownClear = false;
              this.doneDown = false;
              this.checkedNum = this.nextCheckedNum;
            }
            break;
          case 3:
            if (bool) {
              this.doneDown = true;
            }
            break;
          case 4:
            if (bool) {
              this.exportRollOfficialDig = false;
              this.checkedNum = this.nextCheckedNum;
              this.doneDownProgress = false;
              this.doneDownClear = false;
              this.doneDown = false;
              this.$array.download(this.exportRollOfficialFileUrl, this.exportRollOfficialFileName);
            }
            break;
        }
      },
      radioGroupChange(val) {
        console.log(val);
      },
      // GET /holdecomparison/exportOneKeyComparisonExcel
      exportOneKeyComparisonExcel() {
        let params = {
          holderPropertys: this.shareHolderType,
          recordDates: this.time,
          userId: this.$cookie.get('userId'),
          chooseNum: this.checkedNum,
          orderType: this.changeAmountOrder
        };
        this.$axios.gxfApi.exportOneKeyComparisonExcel(params).then((res) => {
          if (res.data.returnCode == 200) {
            this.exportRollOfficialFileUrl = res.data.returnObject.url;
            this.exportRollOfficialFileName = res.data.returnObject.fileName;
            this.uploadAnalysis = 100;
            setTimeout(_ => {
              clearInterval(window.exportRoll);
              this.exportRollOfficialClick(3, true)
            }, 300);
          } else {
            setTimeout(_ => {
              clearInterval(window.exportRoll);
              this.$message({showClose: true, type: 'warning', duration: 3000, message: '导出信息失败！'});
              this.exportRollOfficialDig = false;
              this.checkedNum = this.nextCheckedNum;
              this.doneDownProgress = false;
              this.doneDownClear = false;
              this.doneDown = false;
            }, 300);
          }
        });
      },
      /**/
      // 默认选中最新的两期
      selectionRecordDate() {
        if (this.stageList.length >= 2) {
          this.stages[0] = this.stageList[0];
          this.stages[1] = this.stageList[1];
        }
      },
      tableSortChange(column, prop, order) {
        if (column.prop == 'lastedPossessAmount') {
          if (column.order == 'ascending') { // 升序
            this.possessorAmountOrder = 'ASC';
            this.changeAmountOrder = ''
            this.getHolderComparisonInfo();
          }
          if (column.order == 'descending') {
            this.possessorAmountOrder = 'DESC';
            this.changeAmountOrder = ''
            this.getHolderComparisonInfo();
          }
        }
        if (column.prop == 'changeStock') {
          if (column.order == 'ascending') { // 升序
            this.changeAmountOrder = 'ASC';
            this.possessorAmountOrder = '';
            this.getHolderComparisonInfo();
          }
          if (column.order == 'descending') {
            this.changeAmountOrder = 'DESC';
            this.possessorAmountOrder = '';
            this.getHolderComparisonInfo();
          }
        }
        if (column.prop == this.recordDateSearch[0]) {
          if (column.order == 'ascending') { // 升序
            this.possessorAmountOrder = 'ASC';
            this.changeAmountOrder = '';
            this.getOneKeyComparisonInfo();
          }
          if (column.order == 'descending') {
            this.possessorAmountOrder = 'DESC';
            this.changeAmountOrder = '';
            this.getOneKeyComparisonInfo();
          }
        }
      },
      forward() {
        if (this.i <= this.length) {
          this.i += 1;
          this.cutArray = this.recordDateSearch.slice((this.i), (this.i + 4));
        }
      },
      backward() {
        if (this.i > 1) {
          this.i -= 1;
          this.cutArray = this.recordDateSearch.slice((this.i), (this.i + 4));
        }
      },
      change1() {
        this.stages.sort((a, b) => {
          return this.$common.getTimestampms(b) - this.$common.getTimestampms(a);
        });
      },
      // 股东名数发生变化
      holderNumber() {
        this.possessorAmountOrder = '';
        this.changeAmountOrder = '';
        if (this.quantity == 2) {
          this.$refs.tableFocus.clearSort();
          this.getHolderComparisonInfo();
        } else {
          this.$refs.tableFocusIn.clearSort();
          this.getOneKeyComparisonInfo();
        }
      },
      // 股东性质发生变化
      holderTypeChange() {
        this.possessorAmountOrder = '';
        this.changeAmountOrder = '';
        if (this.quantity == 2) {
          this.$refs.tableFocus.clearSort();
          this.getHolderComparisonInfo();
        } else {
          this.$refs.tableFocusIn.clearSort();
          this.getOneKeyComparisonInfo();
        }
      },
      // 合计类型发生变化
      recalculation() {
        this.getHolderComparisonInfo();
      },
      // 合计
      getSummaries(param) {
        const {columns, data} = param;
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计';
          }
          if (column.property == 'changeStock') {
            sums[index] = this.amountAbs(this.changeStock);
          }
          if (column.property == 'changeRatio') {
            sums[index] = this.changeRatio;
          }
        });
        return sums;
      },
      comparison() {
        this.types = [1, 2, 3, 4, 5]; // 合计项类别,默认选中5项
        this.firstDisplay = true;
        this.onePassArray = [];
        // 判断选中期数是否小于2期
        if (this.stages.length < 2) {
          this.$message({showClose: true, type: "error", duration: 3000, message: '最少选择二期数据对比'});
        } else {
          this.shareHolderType = '1,2,3,4,5,6,7,8,9,10,11';
          if (this.stages.length == 2) {
            // this.quantity = this.stages.length;
            let lastedRecordDate = new Date(this.stages[0]).getTime();
            let oldRecordDate = new Date(this.stages[1]).getTime();
            if (lastedRecordDate > oldRecordDate) {
              this.lastedRecordDate = lastedRecordDate;
              this.oldRecordDate = oldRecordDate;
            } else {
              this.lastedRecordDate = oldRecordDate;
              this.oldRecordDate = lastedRecordDate;
            }
            this.getStockPriceComparison();
          }
          let arary = [];
          let item = '';
          for (let index = 0; index < this.stages.length; index++) {
            item = new Date(this.stages[index]).getTime();
            arary.push(item);
          }
          this.time = arary.join(','); // 获得时间戳
          this.getHolderComparisonChooseDate();
        }
      },
      // 获得两期选中到变动图的一码通
      handleSelectionChange1(rowIndex) {
        this.tableData = Object.assign([], this.tableData);
        const row = this.tableData[rowIndex];
        if (this.onePassArray.length < 3) {
          if (row.isShow) {
            this.onePassArray.push(this.tableData[rowIndex].onePassAccount);
          } else {
            let index = this.onePassArray.findIndex(e => e == row.onePassAccount);
            this.onePassArray.splice(index, 1);
          }
        } else {
          if (row.isShow) {
            this.$message({showClose: true, type: "error", duration: 3000, message: '最多三个选项'});
            this.$set(row, "isShow", false);
          } else {
            let index = this.onePassArray.findIndex(e => e == row.onePassAccount);
            this.onePassArray.splice(index, 1);
          }
        }
        this.onePass = this.onePassArray.join(",");
        this.getHolderComparisonChart();
      },
      //  获得多期选中到变动图的一码通
      handleSelectionChange(rowIndex) {
        this.tableDataLot = Object.assign([], this.tableDataLot);
        const row = this.tableDataLot[rowIndex];
        if (this.onePassArray.length < 3) {
          if (row.isShow) {
            this.onePassArray.push(this.tableDataLot[rowIndex].onePassAccount);
          } else {
            let index = this.onePassArray.findIndex(e => e == row.onePassAccount);
            this.onePassArray.splice(index, 1);
          }
        } else {
          if (row.isShow) {
            this.$message({showClose: true, type: "error", duration: 3000, message: '最多三个选项'});
            this.$set(row, "isShow", false);
          } else {
            let index = this.onePassArray.findIndex(e => e == row.onePassAccount);
            this.onePassArray.splice(index, 1);
          }
        }
        this.onePass = this.onePassArray.join(",");
        this.getHolderComparisonChart();
      },
      // 添加到持股变动图
      getHolderComparisonChart() {
        this.pictureLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getHolderComparisonChart,
          params: {
            recordDates: this.time,
            onePass: this.onePass,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.pictureLoading = false;
            let data = res.data.returnObject;
            let chartData = {};
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
            // chartData.areaMarketValue = data[0].rollOfficialDataList.map(e => {
            //   return e.possessorAmount
            // })
            // chartData.companyMarketValue = data[1].rollOfficialDataList.map(e => {
            //   return e.possessorAmount
            // })

            chartData.dateTime = this.unitArray(chartData.dateTime)
            chartData.stockPrice = this.unitArray(chartData.stockPrice)

            console.log(chartData);
            console.log("图表数据");
            if (this.quantity == 2) {
              this.echartOverview('comparisonChartOne', chartData);
            }
            if (this.quantity > 2) {
              this.echartOverview('comparisonChart', chartData);
            }
          }
        }).catch(() => {
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
      // 选中两期时，获取股东变化和table数据
      getHolderComparisonInfo() {
        this.tableData = [];
        this.natureLoading = true;
        let summationTypes = this.types.join(",");
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getHolderComparisonInfo,
          params: {
            holderPropertys: this.shareHolderType,
            lastedRecordDate: this.lastedRecordDate,
            oldRecordDate: this.oldRecordDate,
            userId: this.userId,
            chooseNum: this.numberName,
            possessorAmountOrder: this.possessorAmountOrder,
            changeAmountOrder: this.changeAmountOrder,
            summationTypes: summationTypes
          }
        }).then((res) => {
          this.natureLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let array = [];
            this.onePassArray = [];
            this.jianchi = res.data.returnObject.jianchi;
            this.tuichu = res.data.returnObject.tuichu;
            this.wending = res.data.returnObject.wending;
            this.xinjin = res.data.returnObject.xinjin;
            this.zengchi = res.data.returnObject.zengchi;
            array = res.data.returnObject.list;
            array.forEach((item) => {
              item.oldPossessAmount = this.amountAbs(item.oldPossessAmount);
              item.lastedPossessAmount = this.amountAbs(item.lastedPossessAmount);
              item.changeStock = this.amountAbs(item.changeStock);
              if (item.lastedRatio !== 0) {
                item.lastedRatio = this.$common.toDecimal2(item.lastedRatio);
              }
              if (item.oldRatio !== 0) {
                item.oldRatio = this.$common.toDecimal2(item.oldRatio);
              }
              // item.changeRatio = this.$common.toDecimal2(item.changeRatio);
            })
            this.tableData = array;
            this.recordDateSearch = this.stages;
            this.changeStock = res.data.returnObject.allAmount;
            this.changeRatio = res.data.returnObject.allRatio;
            this.totalNumber = res.data.returnObject.list.length;
            this.quantity = this.stages.length;
            this.tableData.forEach((item, i) => {
              item.isShow = false
              if (i < 3) {
                item.isShow = true;
                this.onePassArray.push(this.tableData[i].onePassAccount);
              }
            })
            this.onePass = this.onePassArray.join(",");
            // console.log(this.onePass);
            this.getHolderComparisonChart();
          }
        }).catch(() => {
        })
      },
      // 获取可以选择的期数
      getLastedRecordDate() {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getLastedRecordDate,
          params: {
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.stageList = res.data.returnObject;
            this.selectionRecordDate();
            // this.comparison();
            if (this.stages.length == 2) {
              let lastedRecordDate = new Date(this.stages[0]).getTime();
              let oldRecordDate = new Date(this.stages[1]).getTime();
              this.lastedRecordDate = lastedRecordDate;
              this.oldRecordDate = oldRecordDate;
              this.getStockPriceComparison();
            }
            let arary = [];
            let item = '';
            for (let index = 0; index < this.stages.length; index++) {
              item = new Date(this.stages[index]).getTime();
              arary.push(item);
            }
            this.time = arary.join(','); // 获得时间戳
            this.getHolderComparisonChooseDate();
          }
        }).catch(() => {
        })
      },
      // 获得可选多少名
      getHolderComparisonChooseDate() {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getHolderComparisonChooseDate,
          params: {
            recordDates: this.time,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.firstNumber = [];
            res.data.returnObject.forEach((item, index) => {
              let num = {value: '', label: ''};
              num.value = item.toString();
              num.label = "前" + item + "名";
              this.firstNumber.push(num);
              if (item >= 100) {
                this.checkedNum = "100";
                this.numberName = "100";
              }
              if (item >= 200) {
                this.checkedNum = "200";
                this.numberName = "200";
              }
            })
            if (this.firstDisplay) {
              if (this.numberName == "200") {
                this.$confirm('系统默认进行前200名股东对比分析', '小安提示', {
                  confirmButtonText: '确定',
                  // cancelButtonText: '继续填写',
                  type: 'warning'
                }).then(() => {
                  if (this.stages.length == 2) {
                    this.getHolderComparisonInfo();
                  }
                  if (this.stages.length > 2) {
                    this.getOneKeyComparisonInfo();
                  }
                }).catch(() => {
                })
              }
              if (this.numberName == 100) {
                this.$confirm('系统默认进行前100名股东对比分析', '小安提示', {
                  confirmButtonText: '确定',
                  // cancelButtonText: '继续填写',
                  type: 'warning'
                }).then(() => {
                  if (this.stages.length == 2) {
                    this.getHolderComparisonInfo();
                  }
                  if (this.stages.length > 2) {
                    this.getOneKeyComparisonInfo();
                  }
                }).catch(() => {
                })
              }
            } else {
              this.getHolderComparisonInfo();
            }
            this.nextCheckedNum = this.checkedNum
          }
        }).catch(() => {
        })
      },
      // 获取股价对比
      getStockPriceComparison() {
        this.priceLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getStockPriceComparison,
          params: {
            lastedRecordDate: this.lastedRecordDate,
            oldRecordDate: this.oldRecordDate,
            code: this.userInfo.enterpriseCompanyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.stockPrice = res.data.returnObject;
            this.priceLoading = false;
          }
        }).catch(() => {
        })
      },
      //  一键对比（超过两期数据时）
      getOneKeyComparisonInfo() {
        this.manyLoading = true;
        this.tableDataLot = [];
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getOneKeyComparisonInfo,
          params: {
            holderPropertys: this.shareHolderType,
            recordDates: this.time,
            userId: this.userId,
            chooseNum: this.numberName,
            possessorAmountOrder: this.possessorAmountOrder,
            changeAmountOrder: this.changeAmountOrder
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.recordDateSearch = [];
            let array = [];
            this.onePassArray = [];
            this.recordDateSearch = res.data.returnObject.recordDateArray;
            array = res.data.returnObject.dataList;
            array.forEach((item) => {
              this.recordDateSearch.forEach((value) => {
                item[value] = this.amountAbs(item[value]);
              })
            })
            this.tableDataLot = array;
            this.length = this.recordDateSearch.length - 5;
            if (this.recordDateSearch.length > 4) {
              this.pageNum = (this.recordDateSearch.length - 4) * 10;
            }
            this.totalNumber = this.tableDataLot.length;
            this.quantity = this.stages.length;
            this.manyLoading = false;
            if (this.length < 0) {
              this.cutArray = this.recordDateSearch.slice(1, this.recordDateSearch.length);
            }
            if (this.length >= 0) {
              this.cutArray = this.recordDateSearch.slice(1, 5);
            }
            this.tableDataLot.forEach((item, i) => {
              item.isShow = false
              if (i < 3) {
                item.isShow = true;
                this.onePassArray.push(this.tableDataLot[i].onePassAccount);
              }
            })
            this.onePass = this.onePassArray.join(",");
            this.getHolderComparisonChart();
          }
        }).catch(() => {
        })
      },
      echartOverview(id, data) {
        if (!!!document.getElementById(id)) {
          return false
        }
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
              top: 300,
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

<style lang="scss">
  .exportRollOfficialDig {
    .officialDig-box {
      display: flex;
      .col {
        flex: 1;
        &.title {
          flex: 0 0 20%;
        }
        .el-radio-group {
          .el-radio + .el-radio {
            margin-left: 0;
          }
          .el-radio {
            margin: 5px 0;
            margin-right: 40px;
          }
        }
      }
    }
  }
  .shareholder {
    .el-select-dropdown__item {
      font-size: 12px;
    }
  }
  #stockholderComparison {
    .select-date {
      display: flex;
      justify-content: space-between;
      padding: 16px 16px 8px 16px;
      min-height: 100px;
      border-radius: 4px;
      border: 1px dashed #e3e3e3;
      margin-bottom: 20px;
      .check-data {
        width: 780px;
        .el-checkbox {
          margin-right: 40px;
          padding-bottom: 8px;
          width: 110px;
        }
        .el-checkbox + .el-checkbox {
          margin-left: 0;
        }
      }
      .comparison-btnbox {
        width: 358px;
        .comparison-btn {
          width: 358px;
          height: 50px;
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 25px;
        }
        .tip {
          padding: 8px 0;
          font-size: 14px;
          color: #B6B5B5;
        }
      }
    }
    .change {
      clear: both;
      margin-bottom: 20px;
      height: 140px;
      .changeInfo {
        height: 32px;
        font-size: 14px;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
        border-bottom: 1px solid rgba(227, 227, 227, 1);
        margin-bottom: 20px;
        i {
          width: 12px;
          height: 12px;
          margin-left: 4px;
          color: rgba(214, 214, 214, 1);
        }
      }
      .changeInner {
        text-align: center;
        height: 55px;
        line-height: 55px;
        span {
          box-sizing: border-box;
          display: inline-block;
          width: 180px;
          float: left;
          font-size: 12px;
          em {
            font-size: 32px;
            font-weight: 600;
            font-style: normal;
          }
          .up {
            color: #FB4319;
          }
          .down {
            color: #29DA89;
          }
          .equally {
            color: #323232;
          }
        }
      }
      .changeLeft {
        float: left;
        width: 392px;
        height: 140px;
        padding: 13px 16px 19px 16px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        span:nth-child(1) {
          border-right: 1px solid rgba(227, 227, 227, 1);
        }
        .priceDisplay {
          text-align: left;
          font-size: 12px;
          font-weight: 400;
          color: rgba(84, 84, 84, 1);
        }
      }
      .changeRight {
        float: right;
        width: 792px;
        height: 140px;
        padding: 13px 16px 19px 16px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        .shareholderDisplay {
          font-size: 12px;
          font-weight: 400;
          color: rgba(84, 84, 84, 1);
        }
        .changeInner {
          span {
            width: 152px;
            border-right: 1px solid rgba(227, 227, 227, 1);
          }
          span:nth-child(1) {
            em {
              color: #323232;
            }
          }
          span:nth-child(2) {
            em {
              color: #FB4319;
            }
          }
          span:nth-child(3) {
            em {
              color: #29DA89;
            }
          }
          span:nth-child(4) {
            em {
              color: #FB4319;
            }
          }
          span:last-child {
            em {
              color: #29DA89;
            }
            border-right: none;
          }
        }
      }
    }
    .compare {
      width: 100%;
      background: rgba(255, 255, 255, 1);
      border-radius: 4px;
      border: 1px solid rgba(227, 227, 227, 1);
      padding: 0 16px 16px;
      .title {
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(227, 227, 227, 1);
        .titleInfo {
          .titleInner {
            font-size: 14px;
            font-weight: 600;
            color: rgba(50, 50, 50, 1);
          }
        }
        .titleStocker {
          font-size: 12px;
          font-weight: 400;
          color: rgba(141, 141, 141, 1);
          .holderType {
            margin-left: 5px;
            margin-right: 16px;
            .el-input__inner {
              width: 140px;
            }
          }
          .holderNumber {
            .el-input__inner {
              width: 90px;
            }
          }
          .page-img {
            position: relative;
            top: 2px;
            .right-img {
              margin-right: 16px;
              margin-left: 14px;
            }
            .left-picture, .right-picture {
              cursor: pointer;
            }
            .primary-small {
              display: inline-block;
              line-height: 27px;
              margin-right: 15px;
              .btn-prev {
                margin-right: 15px;
              }
            }
          }
        }
      }
      .multiphase {
        .el-table {
          margin-top: 16px;
          td.first-column {
            .cell {
              padding-right: 47px;
              text-align: right;
            }
          }
          th.first-column {
            .cell {
              width: 90px;
              height: 34px;
              line-height: 17px;
              text-align: left;
              padding-left: 0px;
              padding-right: 20px;
              margin-left: 18px;
              .caret-wrapper {
                position: relative;
                top: -34px;
                right: -65px;
              }
            }
          }
          .date3 {
            padding-right: 77px;
          }
          .date4 {
            padding-right: 32px;
          }
          .date5 {
            padding-right: 9px;
          }
        }
        th {
          height: 45px;
          padding: 0;
          font-size: 12px;
          font-weight: 400;
          color: rgba(84, 84, 84, 1);
        }
        th.date-column {
          .cell {
            width: 90px;
            height: 34px;
            line-height: 17px;
            text-align: left;
            padding-left: 0px;
            padding-right: 20px;
            margin-left: 18px;
            .caret-wrapper {
              position: relative;
              top: -34px;
              right: -65px;
            }
          }
        }
        td.date-column {
          .cell {
            text-align: right;
            padding-right: 20px;
          }
        }
        .split-column {
          &:before {
            content: '';
            position: absolute;
            left: 0px;
            top: 0;
            width: 1px;
            height: 100%;
            box-shadow: 14px -1px 5px 0px rgba(0, 0, 0, 0.18);
          }
        }
      }
      .two-phases {
        .type {
          height: 49px;
          line-height: 49px;
          .el-checkbox {
            margin-right: 10px;
            .chk-img {
              margin-right: 3px;
            }
            .el-checkbox__label {
              padding-left: 5px;
              font-size: 12px;
              font-weight: 400;
              color: #323232;
            }
          }
        }
        .el-table {
          th.two-column {
            .cell {
              width: 90px;
              height: 34px;
              line-height: 17px;
              text-align: left;
              padding-left: 0px;
              padding-right: 20px;
              margin-left: 18px;
              .caret-wrapper {
                position: relative;
                top: -34px;
                right: -65px;
              }
            }
          }
          td.two-column {
            .cell {
              text-align: right;
              padding-right: 25px;
            }
          }
          td.two-column-right {
            .cell {
              text-align: right;
              padding-right: 38px;
            }
          }
          td.two-column-rgt {
            .cell {
              text-align: right;
              padding-right: 30px;
            }
          }
          th {
            height: 45px;
            padding: 0;
            font-size: 12px;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            text-align: center;
          }
          td {
            border: none;
            height: 35px;
            padding: 0;
            .cell {
              height: 35px;
              font-size: 12px;
              line-height: 35px;
              padding: 0;
              text-align: center;
            }
          }
          .gutter {
            display: none;
          }
          .split-column {
            &:before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              width: 1px;
              height: 100%;
              box-shadow: 14px -1px 5px 0px rgba(0, 0, 0, 0.18);
            }
          }
        }
        .el-table::before {
          height: 0;
        }
      }
      .bottom-info {
        width: 100%;
        position: relative;
        padding: 26px;
        .totalNumber {
          position: absolute;
          display: inline-block;
          left: 0px;
          top: 16px;
          span {
            margin-top: 16px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(141, 141, 141, 1);
            line-height: 17px;
          }
        }
        .export {
          position: absolute;
          display: inline-block;
          right: 0px;
          top: 16px;
          .export-btn {
            padding: 0px;
            width: 120px;
            height: 35px;
            line-height: 35px;
            border-radius: 4px;
            span {
              font-size: 16px;
              font-weight: 600;
              color: rgba(255, 255, 255, 1);
              line-height: 35px;
              margin-bottom: 6px;
            }
          }
        }
      }
    }
    .changeImg {
      width: 100%;
      height: 374px;
      border-radius: 4px;
      border: 1px solid rgba(227, 227, 227, 1);
      padding: 0 18px 16px 16px;
      .title {
        height: 45px;
        text-align: left;
        line-height: 45px;
        border-bottom: 1px solid rgba(227, 227, 227, 1);
        font-size: 14px;
        font-weight: 600;
        color: rgba(50, 50, 50, 1);
        span {
          margin-right: 10px;
        }
      }
      .echart-overview {
        height: 315px;
        width: 100%;
        margin-top: 16px;
      }
    }
  }
</style>
