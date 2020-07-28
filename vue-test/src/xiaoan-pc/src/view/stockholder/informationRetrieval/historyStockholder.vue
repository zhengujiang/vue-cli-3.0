<template>
  <div id="historyStockholder" class="content">
    <div class="retrieval">
      <span class="history" @click="changeHistory">历史股东检索</span>
      <span class="market" @click="changeMarket">全市场投资者检索</span>
    </div>
    <div class="search">
      <div class="search-input">
        <div class="auto">
          <input class="input-text" @keyup.enter="searchChange" v-model="searchWord" type="text" placeholder="搜索股东名称/地址">
          <button @click="searchChange">
              <i class="el-icon-search"></i>
          </button>
          <ul class="autoComplate" v-show="showAutoComplate && searchWord">
            <li v-for="(item, index) in autocompleteList" @click="goDetaile(index)">
              <p v-html="item"></p>
            </li>
          </ul>
        </div>
      </div>
      <div class="search-option">
        <span>股东性质</span>
        <el-select class="holderType" @change="holderTypeChange" popper-class="shareholder" size="mini" v-model="holderTypeName" placeholder="全部">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <span>股东地域</span>
        <el-select class="regionOption" @change="regionChange" popper-class="shareholder" size="mini" v-model="regionName" placeholder="全部">
          <el-option
            v-for="item in selectionRegion"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-select class="selectionDate" @change="startChange" popper-class="shareholder" size="mini" v-model="startTime" placeholder="全部">
          <el-option
            v-for="item in selectionStartDate"
            :key="item.value"
            :label="item.label"
            :disabled="item.disabled"
            :value="item.value">
          </el-option>
        </el-select>
        <span class="between">至</span>
        <el-select class="selectionDate" @change="endChange" popper-class="shareholder" size="mini" v-model="endTime" placeholder="全部">
          <el-option
            v-for="item in selectionEndDate"
            :key="item.value"
            :label="item.label"
            :disabled="item.disabled"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div v-loading="viewLoading">
      <div class="table">
        <el-table ref="tableFocus" @sort-change="tableSortChange" size="small" :data="tableData" stripe style="width: 100%">
          <template slot="empty">
            <p class="limit">* 限售股：“--”表示该股东不持有限售股或因股东名册数据缺失无法匹配</p>
            <p class="limit">* 仅支持检索前1000名股东数据</p>
            <div class="noinfo">
              <v-noInfo altText='检索不到内容'></v-noInfo>
            </div>
          </template>
          <el-table-column type="index" label="序号" align="center" width="60">
            <template slot-scope="scope">{{scope.$index + 1 + (page.index-1)*page.size}}</template>
          </el-table-column>
          <el-table-column class-name="investor-name" prop="possessorName" label="股东名称" align="center" width="190">
            <template slot-scope="scope">
              <el-tooltip :content="scope.row.possessorName" placement="top">
                <router-link :to="'/stockholder/institutionAccountInfo?id='+scope.row.id" target="_blank">
                  <div class="info">
                    {{scope.row.possessorName}}
                  </div>
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="possessorTypeName" label="股东性质" align="center" width="120"></el-table-column>
          <el-table-column class-name="possessorAmount" prop="possessorAmount" label="持股数量(股)" align="center" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column prop="possessorRatio" label="持股比例(%)" align="center" width="90"></el-table-column>
          <el-table-column class-name="shareRestrictAmount" prop="shareRestrictAmount" label="限售股(股)" align="right" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column class-name="pledgeFreezeAmount" prop="pledgeFreezeAmount" label="质押/冻结(股)" align="center" sortable="custom" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column class-name="messageAddress" prop="messageAddress" label="地址" align="center" width="170"></el-table-column>
          <el-table-column label="添加到数据库" align="center" width="120">
            <template slot-scope="scope">
              <span v-if="!scope.row.addInvestor" class="append" @click="addInvestorClick(scope)">添加</span>
              <span v-else="scope.row.addInvestor" class="appended">已添加</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-if="tableData.length > 0">
        <p class="limit">* 限售股：“--”表示该股东不持有限售股或因股东名册数据缺失无法匹配</p>
        <p class="limit">* 仅支持检索前1000名股东数据</p>
        <div class="footer">
          <div class="pagination">
            <div style="width: 100%;text-align:left">
              <el-pagination @current-change="currentChange" :current-page="page.index"
                :page-size="page.size" layout="prev, pager, next" :total="page.total"></el-pagination>
            </div>
            <div class="button-group">
              <el-radio-group size="mini" @change="pageSizeChange" v-model="page.size">
                <el-radio-button :label="30">30条</el-radio-button>
                <el-radio-button :label="50">50条</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import market from './marketInstitution.vue'
  export default {
    data() {
      return {
        userId: '',
        viewLoading: false,
        selectionDate: [],
        stageList: [],
        selectionRegion: [{
          value: '',
          label: '全部'
        }],
        investorMan: [],
        autocompleteList: [],
        showAutoComplate: false,
        possessorAmountOrder: '', // 持股数量排序
        changeAmountOrder: '', // 限售股排序
        possessorOrder: '', // 质押股排序
        searchWord: '',
        holderTypeName: '',
        regionName: '',
        startTime: '',
        endTime: '',
        selectionStartDate: [], // 开始时间数组
        selectionEndDate: [], // 结束时间数组
        addStyle: true,
        page: {
          size: 30,
          index: 1,
          total: 1000 // 总条目数
        },
        options: [{
          value: '',
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
        tableData:[]
      }
    },
    // 使用其它组件
    components: {
      'v-market':market
    },
    computed: {},
    watch: {
      searchWord: function (val) {
        setTimeout(() => {
          this.getHistoryAutoCompleteHotWord()
        }, 500)
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId');
      this.getLastedRecordDate();
    },
    mounted() {
      document.addEventListener('click', () => {
        this.showAutoComplate = false
      })
    },
    // 方法
    methods: {
      // 数字每三位加一个逗号
      amountAbs(val) {
        if (val == null) {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      amountNull(val) {
        if (val == null || val == '') {
          return '--'
        } else if (val == 0) {
          return 0;
        }
        // console.log(val)
        return val;
      },
      amountRestrict(val) {
        if (val == null || val == 0) {
          return '--'
        } else {
          return this.$array.abs(val, false);
        }
      },
      goDetaile(index) {
        this.searchWord = this.investorMan[index];
        this.searchChange();
      },
      searchChange () {
        if (this.searchWord.length < 2) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'});
          this.page.index = 1;
          this.getHistoryHolderInfo();
        } else {
          // this.page.size = 30;
          this.page.index = 1;
          this.getHistoryHolderInfo();
        }
      },
      getHistoryAutoCompleteHotWord () {
        let startTime = this.$common.getTimestampms(this.startTime);
        let endTime = this.$common.getTimestampms(this.endTime);
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getHistoryAutoCompleteHotWord,
          params: {
            keyWord: this.searchWord,
            userId: this.userId,
            startDate: startTime,
            endDate: endTime
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject.length > 0) {
              this.showAutoComplate = true;
              let obj = [];
              this.investorMan = res.data.returnObject;
              res.data.returnObject.forEach((item, i) => {
                if (i <= 9) {
                  item = this.hightLignt(item);
                  obj.push(item);
                }
              });
              this.autocompleteList = obj;
              // console.log(this.autocompleteList);
            } else {
              this.showAutoComplate = false
              this.autocompleteList = []
            }
          }
        }).catch(() => {
        })
      },
      hightLignt(value) {
        let searchValue = this.searchWord.split(' ').join(',')
        if (searchValue.indexOf(',') > -1) {
          let searchWordArr = searchValue.split(',')
          for (let i in searchWordArr) {
            if (searchWordArr[i]) {
              let reg = new RegExp('(' + searchWordArr[i].replace('*', '') + ')', 'gmi')
              value = value.replace(reg, '<span class="hightLight">$1</span>')
            }
          }
          return value
        } else {
          let reg = new RegExp('(' + searchValue.replace('*', '') + ')', 'gmi')
          return value.replace(reg, '<span class="hightLight">$1</span>')
        }
      },
      // 获得股东地域
      getAddressList () {
        let startTime = this.$common.getTimestampms(this.startTime);
        let endTime = this.$common.getTimestampms(this.endTime);
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getAddressList,
          params: {
            userId: this.userId,
            startDate: startTime,
            endDate: endTime
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            res.data.returnObject.forEach((item, index) => {
              if (item) {
                let num = {value: '', label: ''};
                num.value = item;
                num.label = item;
                this.selectionRegion.push(num);
              }
            })
          }
        }).catch(() => {
        })
      },
      currentChange(index) {
        this.page.index = index;
        this.$array.scrollToTop();
        this.getHistoryHolderInfo();
      },
      pageSizeChange(val) {
        this.page.index = 1;
        this.page.size = val;
        this.getHistoryHolderInfo();
      },
      // 股东性质发生变化
      holderTypeChange() {
        this.$refs.tableFocus.clearSort();
        this.possessorOrder = '';
        this.changeAmountOrder = '';
        this.possessorAmountOrder = '';
        this.page.index = 1;
        this.getHistoryHolderInfo();
      },
      startChange(val) {
        if (val > this.endTime) {
          this.endTime = val;
        }
        //
        this.selectionEndDate.forEach((end) => {
          end.disabled = false;
          if (this.startTime > end.value) {
            end.disabled = true;
          }
        });
        // this.page.size = 30;
        this.$refs.tableFocus.clearSort();
        this.possessorOrder = '';
        this.changeAmountOrder = '';
        this.possessorAmountOrder = '';
        this.page.index = 1;
        this.getHistoryHolderInfo();
      },
      endChange(val) {
        if (this.startTime > val) {
          this.endTime = this.startTime;
        }
        // this.page.size = 30;
        this.$refs.tableFocus.clearSort();
        this.possessorOrder = '';
        this.changeAmountOrder = '';
        this.possessorAmountOrder = '';
        this.page.index = 1;
        this.getHistoryHolderInfo();
      },
      regionChange (val) {
        this.$refs.tableFocus.clearSort();
        this.possessorOrder = '';
        this.changeAmountOrder = '';
        this.possessorAmountOrder = '';
        // this.page.size = 30;
        this.page.index = 1;
        this.getHistoryHolderInfo();
      },
      tableSortChange(column, prop, order) {
        if (column.prop == 'possessorAmount') {
          if (column.order == 'ascending') { // 升序
            this.possessorAmountOrder = 'ASC';
            this.changeAmountOrder = '';
            this.possessorOrder = '';
            this.page.index = 1;
            this.getHistoryHolderInfo();
          }
          if (column.order == 'descending') {
            this.possessorAmountOrder = 'DESC';
            this.changeAmountOrder = '';
            this.possessorOrder = '';
            this.page.index = 1;
            this.getHistoryHolderInfo();
          }
        }
        if (column.prop == 'shareRestrictAmount') {
          if (column.order == 'ascending') { // 升序
            this.changeAmountOrder = 'ASC'
            this.possessorAmountOrder = '';
            this.possessorOrder = '';
            this.page.index = 1;
            this.getHistoryHolderInfo();
          }
          if (column.order == 'descending') {
            this.changeAmountOrder = 'DESC';
            this.possessorAmountOrder = '';
            this.possessorOrder = '';
            this.page.index = 1;
            this.getHistoryHolderInfo();
          }
        }
        if (column.prop == 'pledgeFreezeAmount') {
          if (column.order == 'ascending') { // 升序
            this.possessorOrder = 'ASC';
            this.changeAmountOrder = '';
            this.possessorAmountOrder = '';
            this.page.index = 1;
            this.getHistoryHolderInfo();
          }
          if (column.order == 'descending') {
            this.possessorOrder = 'DESC';
            this.changeAmountOrder = '';
            this.possessorAmountOrder = '';
            this.page.index = 1;
            this.getHistoryHolderInfo();
          }
        }
      },
      addInvestorClick(scope) {
        let shareholdingNum = scope.row.possessorAmount.replace(/,/g, "");
        let params = {
          investorName: scope.row.possessorName,
          investType: scope.row.possessorType,
          shareholdingNum: shareholdingNum,
          contactAddress: scope.row.messageAddress,
          createUserId: this.userId,
          rollOfficialId: scope.row.id,
          onePasswordAccount: scope.row.onePasswordAccount,
          recordDate: scope.row.recordDate
        };
        this.addInvestor(params);
      },
      // 添加到数据库
      addInvestor(params) {
        this.$axios.gxfApi.addInvestor(params).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.getHistoryHolderInfo();
          }
        })
      },
      // 获取股东检索列表数据
      getHistoryHolderInfo () {
        this.viewLoading = true;
        let startTime = this.$common.getTimestampms(this.startTime);
        let endTime = this.$common.getTimestampms(this.endTime);
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getHistoryHolderInfo,
          params: {
            recordStartDate: startTime, // 开始期数
            recordEndDate: endTime, // 结束期数
            holderPropertys: this.holderTypeName,
            holderName: this.searchWord, // 搜索框的股东名称和地址
            holderAddress: this.regionName, // 股东地域
            holderIdNumber: '', // 身份证号码
            holderPostCode: '', // 邮编
            holderPhone: '',
            userId: this.userId,
            possessorAmountOrder: this.possessorAmountOrder,
            restrictAmountOrder: this.changeAmountOrder,
            pledgeAmountOrder: this.possessorOrder,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let array = [];
            array = res.data.returnObject;
            array.forEach((item) => {
              
              item.possessorAmount = this.amountAbs(item.possessorAmount);
              item.shareRestrictAmount = this.amountRestrict(item.shareRestrictAmount);
              if (item.pledgeFreezeAmount == '--') {
                item.pledgeFreezeAmount = 0
              }
              item.pledgeFreezeAmount = this.amountAbs(item.pledgeFreezeAmount);
              item.possessorTypeName = this.amountNull(item.possessorTypeName);
              item.possessorRatio = this.amountNull(item.possessorRatio);
              if (item.possessorRatio != '--') {
                item.possessorRatio = this.$common.toDecimal2(item.possessorRatio);
              }
              item.messageAddress = this.amountNull(item.messageAddress);
              if (item.messageAddress == 0) {
                item.messageAddress = '--';
              }
            })
            this.tableData = array;
            // this.tableData = Object.assign([], array);
            this.page.total = res.data.total;
            this.viewLoading = false;
          }
        }).catch((err) => {
        })
      },
      changeHistory() {
        this.$router.push({path: '/stockholder/historyStockholder', query: {}})
      },
      changeMarket() {
        this.$router.push({path: '/stockholder/marketInstitution', query: {}})
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
            let array = res.data.returnObject.reverse();
            let arr = array;
            array.forEach((item) => {
              let value = {value: '', label: ''};
              value.value = item;
              value.label = item + "期";
              this.selectionEndDate.push(value);
            })
            arr.forEach((item) => {
              let value = {value: '', label: ''};
              value.value = item;
              value.label = item + "期";
              this.selectionStartDate.push(value);
            })
            this.startTime = this.selectionStartDate[0].value;
            this.endTime = this.selectionEndDate[this.selectionEndDate.length - 1].value;
            this.getHistoryHolderInfo();
            this.getAddressList();
          }
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="scss">
  .shareholder {
    .el-select-dropdown__item {
      font-size: 12px;
    }
  }
  #historyStockholder {
    min-height: 600px;
    .table {
      min-height: 380px;
      .noinfo {
        min-height: 400px;
      }
      td.investor-name .cell {
        .info {
          width: 190px;
          text-align: center;
          max-height: 46px;
          overflow : hidden;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-height: 1.4;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
        }
        .info:hover {
          color:rgba(255, 177, 72, 1);
          text-decoration: underline;
        }
      }
      .el-table__empty-text {
        width: 100%;
      }
       .limit {
        font-size: 12px;
        font-weight: 400;
        color:rgba(141,141,141,1);
        line-height: 17px;
        text-align: left;
      }
      table {
        font-size: 12px;
        font-weight:400;
        color:rgba(84,84,84,1);
        line-height:17px;
      }
      td {
        vertical-align: middle;
        border: none;
        padding: 6px 0;
        div{
          // height: 35px;
          line-height: 23px;
          padding: 0;
          color:rgba(84,84,84,1);
        }
      }
      td.pledgeFreezeAmount {
        .cell {
          padding-right: 36px;
        }
      }
      td.shareRestrictAmount {
        .cell {
          padding-right: 19px;
        }
      }
      td.possessorAmount {
        .cell {
          padding-right: 39px;
        }
      }
      td.messageAddress {
        .cell {
          width: 170px;
          text-align: center;
          max-height: 46px;
          overflow : hidden;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
        }
      }
      th {
        height: 35px;
        padding: 0;
        background-color: #F0F0F0;
        border: none;
        .cell {
          color:rgba(84,84,84,1);
        }
      }
      td:nth-child(4){
        text-align: right;
        div{
          width: 105px;
        }
      }
      td:nth-child(5){
        div{
          width: 135px;
        }
      }
      td:nth-child(6){
        text-align: right;
        div{
          width: 130px;
        }
      }
      td:nth-child(7){
        text-align: right;
        div{
          width: 115px;
        }
      }
      .el-table::before {
        height: 0;
      }
      .append {
        font-size: 12px;
        color: #FFB148;
        text-decoration: underline;
      }
      .append:hover {
        cursor: pointer;
      }
      .appended {
        font-size: 12px;
        color: #8D8D8D;
      }
      .appended:hover {
        cursor: pointer;
      }
    }
    .retrieval{
      font-size: 16px;
      font-weight:600;
      color:rgba(50,50,50,1);
      line-height:22px;
      height:67px;
      border-bottom: 1px solid rgba(227,227,227,1);
      padding: 30px 0 15px 18px;
      .history {
        cursor: pointer;
        margin-right: 16px;
        font-weight: 600;
        color:#FFB148;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          width: 60px;
          height: 2px;
          top: 33px;
          left: 50%;
          margin-left: -29px;
          background-color: #ffb148;
        }
      }
      .market {
        cursor: pointer;
        font-size:16px;
        font-weight:400;
        color:rgba(50,50,50,1);
      }
    }
    .search {
        margin: 16px auto;
        .search-input {
          height: 24px;
          display: inline-block;
          .input-text {
            width: 380px;
            height: 24px;
            box-shadow: 0px 0px 2px #E3E3E3;
            border-radius: 2px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            padding: 0 9px;
            border: 1px solid #E3E3E3;
            float: left;
            font-size:12px;
            font-weight:400;
            color:rgba(141,141,141,1);
            line-height:24px;
            border-right: none;
          }
          button {
            width: 40px;
            height: 24px;
            background: #FFB148;
            float: left;
            border: 0;
            outline: none;
            font-size: 13px;
            border-radius: 0;
            color: #ffffff;
            padding: 0 !important;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            box-shadow: 0px 0px 2px #FFB148;
          }
          .auto {
            position: relative;
            .autoComplate {
              position: absolute;
              z-index: 100 !important;
              top: 35px;
              left: 0;
              width: 380px;
              min-height: 48px;
              background-color: #fff;
              box-shadow: 0 0 15px #e3e3e3;
              li {
                padding: 0 12px;
                list-style-type: none;
                width: 100%;
                height: 35px;
                line-height: 1;
                font-size: 15px;
                background-color: white;
                box-sizing: border-box;
                p {
                  display: inline-block;
                  float: left;
                  height: 35px;
                  line-height: 35px;
                  width: 100%;
                  box-sizing: border-box;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-align: justify;
                  border-bottom: 1px solid #e3e3e3;
                  .hightLight {
                    color: #ff9933;
                  }
                }
              }
            }
          }
        }
      .search-option {
        font-size:12px;
        font-weight:400;
        color:rgba(141,141,141,1);
        display: inline-block;
        float: right;
        line-height:17px;
        .holderType {
          margin-left: 5px;
          margin-right: 15px;
          .el-input__inner {
            width: 140px;
          }
        }
        .regionOption {
          margin-left: 5px;
          margin-right: 15px;
          .el-input__inner {
            width: 83px;
          }
        }
        .selectionDate {
          .el-input__inner {
            width: 125px;
          }
        }
        .between {
          margin: 0 5px;
        }
      }
    }
    .footer {
      position: relative;
      border: 1px solid #FFFFFF;
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
        bottom: 29px;
        .el-radio-button__inner {
          padding: 5px 9px 5px 9px;
          line-height: 17px;
        }
      }
    }
    .limit {
      font-size: 12px;
      font-weight: 400;
      color:rgba(141,141,141,1);
      line-height: 17px;
      margin-top: 10px;
    }
  }
</style>
