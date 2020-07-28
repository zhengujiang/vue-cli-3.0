<template>
    <!--股东性质分类对比-->
    <el-card v-loading="natureLoading" shadow="never" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
        <div class="col">
          <span class="titleInner">按股东性质分类对比</span>
          <span class="titleTime" v-if="timeSelect.length == 2">{{timeSelect[0]}}期与{{timeSelect[1]}}期</span>
          <span class="titleTime" v-else>{{timeSelect[0]}}期与{{timeSelect[1]}}等{{timeSelect.length}}期</span>
        </div>
        <div class="col t-right">
          <span class="page-img" v-if="timeSelect.length>5">
            <el-pagination @prev-click="addLeft('nature')" :current-page.sync="page" @next-click="addRight('nature')" class="primary-small" small background layout="prev, next" :total="(timeSelect.length-4)*10"></el-pagination>
          </span>
          <el-select @change="changeNum('nature', natureSelect)" style="width: 85px" class="vxa-select-box" size="mini" v-model="natureSelect" placeholder="请选择">
            <el-option v-for="item in numberOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </div>
      </div>
      <div class="type" v-if="timeSelect.length == 2">
        <el-checkbox-group :min="1" @change="changeComparison('nature', natureTypes)" v-model="natureTypes">
          <el-checkbox  :label="1"><span>--</span>稳定</el-checkbox>
          <el-checkbox  :label="2"><img class="chk-img" :src="$image.stockholder.c2">新进</el-checkbox>
          <el-checkbox  :label="3"><img class="chk-img" :src="$image.stockholder.c3">退出</el-checkbox>
          <el-checkbox  :label="4"><img class="chk-img" :src="$image.stockholder.c4">增持</el-checkbox>
          <el-checkbox  :label="5"><img class="chk-img" :src="$image.stockholder.c5">减持</el-checkbox>
        </el-checkbox-group>
      </div>
      <el-table ref="tableFocus" size="mini" @sort-change="sortChangeNature" v-if="timeSelect.length == 2" :data="natureTableData.list" stripe max-height="390" style="width: 100%">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="holderPropertyName" label="股东性质" width="113"></el-table-column>
        <el-table-column align="right" sortable="custom" prop="lastPersonAmount" label="个数(个)" width="115"></el-table-column>
        <el-table-column align="right" class-name="date-column-sort" sortable="custom" prop="lastPossessorAmount" :label="lastRecordDate + '持股数量(股)'" width="150"></el-table-column>
        <el-table-column align="right" class-name="date-column" prop="lastPossessorRatio" :label="lastRecordDate + '持股比例(%)'" width="110"></el-table-column>
        <el-table-column align="right" class-name="split-column" prop="order" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column align="right" prop="oldPersonAmount" label="个数(个)" width="115"></el-table-column>
        <el-table-column align="right" class-name="date-column" prop="oldPossessorAmount" :label="oldRecordDate + '持股数量(股)'" width="100"></el-table-column>
        <el-table-column align="right" class-name="date-column" prop="oldPossessorRatio" :label="oldRecordDate + '持股比例(%)'" width="128"></el-table-column>
        <el-table-column align="right" show-overflow-tooltip sortable='custom' prop="changeAmount" label="变化股(股)" width="95">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1"><span v-if="scope.row.changeAmount != 0">{{ scope.row.changeAmount}}</span><span>--</span></span>
            <span v-if="scope.row.status == 2"><span v-if="scope.row.changeAmount != 0">{{ scope.row.changeAmount}}</span><img class="chk-img" :src="$image.stockholder.c2"></span>
            <span v-if="scope.row.status == 3"><span v-if="scope.row.changeAmount != 0">{{ scope.row.changeAmount}}</span><img class="chk-img" :src="$image.stockholder.c3"></span>
            <span v-if="scope.row.status == 4"><span v-if="scope.row.changeAmount != 0">{{ scope.row.changeAmount}}</span><img class="chk-img" :src="$image.stockholder.c4"></span>
            <span v-if="scope.row.status == 5"><span v-if="scope.row.changeAmount != 0">{{ scope.row.changeAmount}}</span><img class="chk-img" :src="$image.stockholder.c5"></span>
          </template>
        </el-table-column>
        <el-table-column align="right" prop="changeRatio" class-name="date-column date-IE" label="变化比例(占总股本)(%)" width="90"></el-table-column>
      </el-table>
      <tableTotal v-if="timeSelect.length == 2" :total="natureTotal" :type="true"></tableTotal>
      <el-table ref="tableFocus" @sort-change="sortChangeNature" size="mini" v-if="timeSelect.length > 2" max-height="390" :data="natureTableData.dataList" stripe>
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="holderProperty" label="股东性质" width="130"></el-table-column>
        <el-table-column sortable='custom' class-name="date-column-more date-column-sort" align="center" :prop="timeSelect[0]" :label="timeSelect[0] + '持股数量(股)'"></el-table-column>
        <el-table-column class-name="date-column-more split-column" align="center" :prop="timeSelect[natureIndex + 1]" :label="timeSelect[natureIndex + 1] + '持股数量(股)'"></el-table-column>
        <el-table-column class-name="date-column-more" v-for="(item, index) in timeSelect.slice(natureIndex + 2, natureIndex + 1 + 4)" :key="index" align="center" :prop="item" :label="item + '持股数量(股)'"></el-table-column>
      </el-table>
      <div class="total"></div>
    </el-card>
</template>
<script>
import tableTotal from './tableTotal.vue';
export default {
  data() {
    return {
      // numberOptions: [],
      natureSelect: '',
      recordDate: [],
      natureTypes: [1, 2, 3, 4, 5], // 股东性质类型选择
      // checkListRecord: [],
      natureTableData: [], // 股东性质表格数据
      timeSelect: [], // 一键对比之后选中的日期
      allLoading: null, // 全屏loading
      natureLoading: false,
      // chooseNum: '', // 默认对比数量
      lastRecordDate: '',
      oldRecordDate: '',
      natureIndex: 0,
      natureSort: {
        prossesSort: '', // 持股数量排序
        personSort: '', // 人员数量排序
        changeSort: '' // 变化股排序
      },
      natureTotal: {
        allAmount: '',
        allRatio: ''
      },
      page: 1
    }
  },
  props: ['time', 'chooseNum', 'checkListRecord', 'numberOptions'],
  watch: {
    time: function() {
      // this.sortChangeNature();
      this.timeSelect = this.time;
      this.natureSelect = this.chooseNum;
      this.natureTypes = [1, 2, 3, 4, 5];
      this.$nextTick(() => {
        this.$refs.tableFocus.clearSort();
        this.natureSort = {
          prossesSort: '', // 持股数量排序
          personSort: '', // 人员数量排序
          changeSort: '' // 变化股排序
        };
        this.getHolderPropertyComparisonInfo(this.chooseNum);
      })
    },
    chooseNum: function() {
      this.natureSelect = this.chooseNum;
    },
    changeData: function() {
      this.getHolderPropertyComparisonInfo(this.chooseNum);
    }
  },
  components: {
    tableTotal
  },
  mounted() {
    this.natureSelect = this.chooseNum;
  },
  methods: {
    amountAbs(val) {
      console.log(val);
      if (val == null || val == '--') {
        return '--'
      } else if (val == 0) {
        return 0;
      } else {
        return this.$array.abs(val, false);
      }
    },
    addLeft(val) {
      if (val == 'nature') {
        if (this.natureIndex == 0) {
          return false
        } else {
          this.natureIndex--;
        }
      }
      if (val == 'mech') {
        if (this.mechIndex == 0) {
          return false
        } else {
          this.mechIndex--;
        }
      }
      if (val == 'person') {
        if (this.personIndex == 0) {
          return false
        } else {
          this.personIndex--;
        }
      }
    },
    addRight(val) {
      if (val == 'nature') {
        if (this.natureIndex + 5 >= this.timeSelect.length) {
          return false
        } else {
          this.natureIndex++;
        }
      }
      if (val == 'mech') {
        if (this.mechIndex + 5 >= this.timeSelect.length) {
          return false
        } else {
          this.mechIndex++;
        }
      }
      if (val == 'person') {
        if (this.personIndex + 5 >= this.timeSelect.length) {
          return false
        } else {
          this.personIndex++;
        }
      }
    },
    changeComparison(type, val) {
      if (type == 'nature') {
        this.natureLoading = true;
        this.getHolderPropertyComparisonInfo(this.chooseNum);
      } else if (type == 'mech' || type == 'person') {
        type == 'mech' ? this.mechLoading = true : this.personLoading = true;
        type == 'mech' ? this.mechChartLoading = true : this.personChartLoading = true;
        if (this.timeSelect.length == 2) {
          this.getHolderComparisonInfo(this.chooseNum, type);
        } else {
          this.getOneKeyComparisonInfo(this.chooseNum, type);
        }
      }
    },
    changeNum(type, val) {
      if (type == 'nature') {
        this.natureLoading = true;
        this.$refs.tableFocus.clearSort();
        this.natureSort = {
          prossesSort: '', // 持股数量排序
          personSort: '', // 人员数量排序
          changeSort: '' // 变化股排序
        };
        this.getHolderPropertyComparisonInfo(val);
      } else if (type == 'mech' || type == 'person') {
        type == 'mech' ? this.mechLoading = true : this.personLoading = true;
        type == 'mech' ? this.mechChartLoading = true : this.personChartLoading = true;
        if (this.timeSelect.length == 2) {
          this.getHolderComparisonInfo(val, type);
        } else {
          this.getOneKeyComparisonInfo(val, type);
        }
      }
    },
    sortChangeNature({ column, prop, order }) {
      // natureSort: {
      //   prossesSort: '', // 持股数量排序
      //   personSort: '', // 人员数量排序
      //   changeSort: '' // 变化股排序
      // }
      if (column && column.label && column.label == `${this.timeSelect[0]}持股数量(股)`) {
        this.natureSort.personSort = '';
        this.natureSort.changeSort = '';
        order == 'ascending' ? this.natureSort.prossesSort = 'ASC' : this.natureSort.prossesSort = 'DESC';

      } else if (column && column.label && column.label == '个数(个)') {
        this.natureSort.prossesSort = '';
        this.natureSort.changeSort = ''
        order == 'ascending' ? this.natureSort.personSort = 'ASC' : this.natureSort.personSort = 'DESC';

      } else if (column && column.label && column.label == '变化股(股)') {
        this.natureSort.prossesSort = '';
        this.natureSort.personSort = ''
        order == 'ascending' ? this.natureSort.changeSort = 'ASC' : this.natureSort.changeSort = 'DESC';
      }
      this.getHolderPropertyComparisonInfo(this.chooseNum);
    },
    // 按股东性质分类对比 两期与多期接口
    getHolderPropertyComparisonInfo(chooseNum) {
      this.page = 1;
      this.natureIndex = 0;
      let dates = [];
      this.natureLoading = true;
      this.timeSelect.forEach(item => {
        dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
      })
      dates.sort(function(a, b) {
        return b - a
      });
      let params = {
        comparisonTypes: this.natureTypes.join(','),
        holderPropertys: '1,2,3,4,5,6,7,8,9,10,11',
        recordDates: dates.join(','),
        userId: this.$cookie.get('userId'),
        chooseNum: chooseNum,
        changeAmountOrderType: this.natureSort.changeSort, // 变化股排序
        personAmountOrderType: this.natureSort.personSort, // 人员数量排序
        possessAmountOrderType: this.natureSort.prossesSort // 持股数量排序
      }
      this.natureTableData = [];
      this.$axios.gxfApi.getHolderPropertyComparisonInfo(params).then((res) => {
        this.natureLoading = false;
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.natureTableData = res.data.returnObject;
          if (this.timeSelect.length > 2) {
            this.timeSelect.forEach(item => {
              for (let i = 0; i < this.natureTableData.dataList.length; i++) {
                this.natureTableData.dataList[i][item] = this.amountAbs(this.natureTableData.dataList[i][item])
              }
            })
          }
          if (this.timeSelect.length == 2) {
            this.lastRecordDate = this.natureTableData.list[0].lastRecordDate;
            this.oldRecordDate = this.natureTableData.list[0].oldRecordDate;
            this.natureTotal.allAmount = this.natureTableData.allAmount;
            this.natureTotal.allRatio = this.natureTableData.allRatio;
            for (let i = 0; i < this.natureTableData.list.length; i++) {
              let data = this.natureTableData.list[i];
              for (let key in data) {
                if (key == 'lastPossessorRatio' || key == 'oldPossessorRatio') {
                  if (data[key]) {
                    data[key] = data[key].toFixed(2);
                  }
                }
                if (key == 'lastPossessorAmount' || key == 'oldPossessorAmount' || key == 'changeAmount') {
                  data[key] = this.amountAbs(data[key]);
                }
                // if (data['lastPersonAmount'] == 0) {
                //   if (key == 'lastPossessorAmount' || key == 'oldPossessorAmount' || key == 'lastPossessorRatio' || key == 'oldPossessorRatio' || key == 'changeAmount' || key == 'changeRatio') {
                //     data[key] = '--';
                //   }
                // }
              }
            }
          }
          // this.timeSelect.length == 2 ? this.showSummary = true : this.showSummary = false;
        }
      })
    }
  }
}
</script>
<style lang="scss">

</style>
