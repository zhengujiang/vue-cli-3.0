<template>
  <div id="marketInstitution" class="content">
    <div class="retrieval">
      <span class="history" @click="changeHistory" :class="{color:history}">历史股东检索</span>
      <span class="market" @click="changeMarket" :class="{color:market}">全市场投资者检索</span>
    </div>
    <div class="search-input">
      <div class="auto">
        <input class="input-text" @keyup.enter="searchInfo" v-model="searchWord" type="text" placeholder="搜索投资者名称">
        <button @click="searchInfo">
          <i class="el-icon-search"></i>
        </button>
        <ul class="autoComplate" v-show="showAutoComplate && searchWord">
          <li v-for="(item, index) in autocompleteList" @click="goDetaile(index)">
            <p v-html="item"></p>
          </li>
        </ul>
      </div>
    </div>
    <div class="investorTable">
      <el-table v-if="!judgement" :data="tableData" stripe style="width: 100%" v-loading="tableLoading">
        <template slot="empty">
          <div class="noinfo">
            <v-noInfo altText='检索不到内容'></v-noInfo>
          </div>
        </template>
        <el-table-column prop="holderName" label="投资者名称" align="center" width="300" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
            <router-link class="vxa-a-hover underline" :to="'/stockholder/institutionAccountInfo?id='+scope.row.id" target="_blank">
              {{scope.row.holderName}}
            </router-link>
          </template> -->
        </el-table-column>
        <el-table-column prop="companyCode" label="股票代码" align="center" width="120"></el-table-column>
        <el-table-column prop="companyName" label="股票名称" align="center" width="150"></el-table-column>
        <el-table-column class-name="holderAmount" prop="holderAmount" label="持股数量(股)" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column class-name="holderRatio" prop="holderRatio" label="持股比例(%)" align="center" width="150"></el-table-column>
        <el-table-column class-name="marketValue" prop="marketValue" label="持股市值(万元)" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column prop="recordDate" label="更新时间" align="center"></el-table-column>
      </el-table>
      <div class="pageNumber" v-if=" !judgement && tableData.length > 0">
        <p class="limit">共{{number}}条</p>
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
    <el-card v-if="judgement" class="box-overview-card word" shadow="never" body-style="padding:0px 16px" v-loading="keyWordLading">
      <div class="overview-header vux-1px-b">
        <div class="row title">热门投资者</div>
        <div class="row select"><span @click="keyWordChange"><i class="el-icon-refresh"></i> 换一批</span></div>
      </div>
      <div class="echart-word">
        <div style="height: 100%" id="echartWordCloud"></div>
        <div class="no-data" v-if="keyWordData.length == 0">
          <div class="text"><span>暂无数据</span></div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
          history: false,
          market: true,
          keyWordData: [],
          investorMan: [],
          showAutoComplate: false,
          autocompleteList: [],
          judgement: true, // 判断搜索词是否存在
          searchWord:'',
          userId: '',
          tableData:[],
          number: '',
          keyWordLading: false,
          tableLoading: false,
          page: {
            size: 30,
            index: 1,
            total: 1000 // 总条目数
          }
        }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      searchWord: function (val) {
        setTimeout(() => {
          this.getAutoCompleteHotWord()
        }, 500)
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId');
      this.getHotInstitutioninfo();
    },
    mounted() {
      document.addEventListener('click', () => {
        this.showAutoComplate = false
      })
    },
    // 方法
    methods: {
      currentChange(index) {
        this.page.index = index;
        this.$array.scrollToTop();
        this.getOfficialDataByInstitution();
      },
      pageSizeChange(val) {
        this.page.index = 1;
        this.page.size = val;
        this.$array.scrollToTop();
        this.getOfficialDataByInstitution();
      },
      getAutoCompleteHotWord() {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getAutoCompleteHotWord,
          params: {
            keyWord: this.searchWord
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
            } else {
              this.showAutoComplate = false
              this.autocompleteList = []
            }
          }
        }).catch((err) => {
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
      goDetaile(index) {
        this.searchWord = this.investorMan[index];
        this.searchInfo();
      },
      searchInfo () {
        if (!this.searchWord) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'});
          this.judgement = true;
          this.getHotInstitutioninfo();
        } else if (this.searchWord && this.searchWord.length < 2) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'});
        } else {
          this.judgement = false;
          // this.page.size = 30;
          this.page.index = 1;
          this.getOfficialDataByInstitution();
        }
      },
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
      getHotInstitutioninfo () {
        this.keyWordLading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getHotInstitutioninfo,
          params: {
            limitNumber: '35'
          }
        }).then((res) => {
          this.keyWordLading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject;
            this.keyWordData = data.map((item, index) => {
              return {name: item, value: index}
            })
            this.wordCloud(this.keyWordData);
          }
        }).catch(() => {
          setTimeout(e => {
            this.keyWordLading = false;
          }, 1000)
        })
      },
      getOfficialDataByInstitution() {
        this.tableLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getOfficialDataByInstitution,
          params: {
            keyWord: this.searchWord,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.tableLoading = false;
            res.data.returnObject.forEach((item) => {
              item.holderAmount = this.amountAbs(item.holderAmount);
              item.marketValue = this.amountAbs(item.marketValue);  // 市值
              item.holderRatio = this.amountAbs(item.holderRatio);  // 市值
              if (item.holderRatio != '--') {
                item.holderRatio = this.$common.toDecimal2(item.holderRatio);
              }
            })
            this.tableData = res.data.returnObject;
            this.number = res.data.total;
            this.page.total = res.data.total;
          }
        }).catch(() => {
        })
      },
      changeHistory() {
        this.$router.push({path: '/stockholder/historyStockholder', query: {}})
      },
      changeMarket() {
        this.$router.push({path: '/stockholder/marketInstitution', query: {}})
      },
      keyWordChange() {
        this.getHotInstitutioninfo();
      },
      // =>渲染
      wordCloud(datas) {
        var myChart = echarts.init(document.getElementById('echartWordCloud'));
        var that = this;
        var color = ['#738BFF', '#FFB164', '#FFB09C', '#BBBBBB'];
        var option = {
          background: '#fff',
          series: [{
            type: 'wordCloud',
            // shape: 'circle',
            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.
            // maskImage: maskImage,
            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.
            left: 'center',
            top: '5%',
            width: '90%',
            height: '90%',
            right: 'center',
            bottom: '5%',
            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.
            sizeRange: [14, 24],
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
            rotationRange: [0, 0],
            // rotationStep: 45,
            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.
            gridSize: 27,
            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            drawOutOfBound: false,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: '400',
                color: () => {
                  return color[parseInt(Math.random() * 4)];
                }
              },
              emphasis: {
                fontSize: 26,
                shadowBlur: 20,
                // backgroundColor: '#f8f8f8',
                shadowColor: '#f8f8f8',
                shadowOffsetX: 0,
                shadowOffsetY: 0
              }
            },
            data: datas
          }]
        }
        myChart.setOption(option, true);
        myChart.on('click', (item) => {
          this.searchWord = item.name;
          this.judgement = false;
          // this.page.size = 30;
          this.page.index = 1;
          this.getOfficialDataByInstitution();
        });
      }
    }
};
</script>

<style lang="scss">
#marketInstitution {
  padding-bottom: 19px;
  min-height: 610px;
  .search-input {
    margin-top:16px;
    width: 100%;
    .input-text {
      width: 1085px;
      height: 40px;
      box-shadow: 0px 0px 2px #e3e3e3;
      border-radius: 4px;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
      padding: 0 9px;
      border: 1px solid #e3e3e3;
      float: left;
      font-size: 12px;
      font-weight: 400;
      color:#000000;
      line-height: 40px;
      margin-bottom: 16px;
      border-right: none;
    }
    button {
      width: 114px;
      height: 40px;
      background: #ffb148;
      float: left;
      border: 0;
      outline: none;
      font-size: 20px;
      border-radius: 0;
      color: #ffffff;
      padding: 0 !important;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      box-shadow: 0px 0px 2px #ffb148;
    }
    .auto {
      position: relative;
      .autoComplate {
        position: absolute;
        z-index: 100 !important;
        top: 50px;
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
  .box-overview-card {
    width: 100%;
    background-color: white;
    margin-top:16px;
    border-color: #e3e3e3;
    .echart-word {
      width: 100%;
      height: 300px;
    }
    .overview-header {
      display: flex;
      height: 45px;
      align-items: center;
      .row {
        flex: 1;
        &.title {
          font-size: 14px;
          color: #323232;
          font-weight: 600;
        }
        &.select {
          cursor: pointer;
          text-align: right;
          color: #858585;
          font-size: 14px;
          .el-icon-refresh {
            font-size: 16px;
          }
        }
      }
    }
  }
  .investorTable {
    margin-top: 16px;
    .el-table {
      min-height: 380px;
      .noinfo {
        min-height: 400px;
      }
      font-size: 12px;
      // border-bottom: 1px solid #E3E3E3;
      th.investorName{
        .cell {
          height:17px;
          font-size:12px;
          font-weight:400;
          color:rgba(0,0,0,1);
        }
      }
      td.holderRatio {
        .cell {
          text-align: right;
          padding-right: 54px;
        }
      }
      td.holderAmount {
        .cell {
          text-align: right;
          padding-right: 50px;
        }
      }
      td.marketValue {
        .cell {
          text-align: right;
          padding-right: 50px;
        }
      }
      th .cell {
        font-size:12px;
        color:rgba(84,84,84,1);
        line-height:17px;
      }
      .cell {
        line-height: 17px;
      }
    }
    th {
      background-color:#F0F0F0;
      border: none;
      padding: 9px;
    }
    .el-table::before {
      height: 0;
    }
    td {
      padding: 9px;
      line-height: 17px;
    }
    .pageNumber {
      width: 100%;
      border-top: 1px solid#E3E3E3;
      .limit {
        font-size: 12px;
        font-weight: 400;
        color:rgba(141,141,141,1);
        line-height: 17px;
        margin-top: 10px;
      }
      .footer {
        position: relative;
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
    .market {
      cursor: pointer;
      margin-left: 16px;
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
    .history {
      cursor: pointer;
      font-size:16px;
      font-weight:400;
      color:rgba(50,50,50,1);
    }
  }
}
</style>
