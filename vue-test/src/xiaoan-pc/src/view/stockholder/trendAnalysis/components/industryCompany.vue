<template>
  <div id="industryCompany">
    <el-dialog class="dialogStockHolder set-industry-company" :visible.sync="setDialog" width="530px" center
               @close="closeSetDialog">
      <template slot="title">设置同行业公司</template>
      <div class="setkonggu-content">
        <div class="konggu-search">
          <span class="ml sp">同行业公司</span>
          <!--<el-input v-model="companyName" placeholder="输入公司代码／简称" size="mini" class="stock-name ml"></el-input>-->
          <el-autocomplete id="worksSearchWordInfo" class="stock-name ml" size="mini" spellcheck="false"
                           v-model="searchWord"
                           :fetch-suggestions="querySearch"
                           placeholder="输入公司代码／简称" :popper-append-to-body="false"
                           @keyup.enter.native="searchCompany"
                           @select="handleSelect">
            <!--<i class="el-icon-search el-input__icon" slot="prefix" @click="menuHandleIconClick"></i>-->
            <template slot-scope="{ item }">
              <div class="name">
                <span style="width: 200px; display: inline-block">{{ item.code }}</span>
                <span>{{ item.name }}</span>
              </div>
            </template>
          </el-autocomplete>
          <el-button type="primary" icon="el-icon-search" size="mini" class="ml" @click="searchCompany"></el-button>
        </div>
        <div class="compnayList-box">
          <div class="hleft">
            <el-table :data="compnayList" style="width: 100%" height="350" class="compnayList" stripe size="mini">

              <el-table-column prop="name" label="可选同行业公司">
              </el-table-column>

              <el-table-column prop="name" label="操作" width="60" align="center">
                <template slot-scope="scope">
                  <!--<span v-show="!scope.row.ischecked" class="addh" @click="addToRight(scope.row, scope.$index)">+</span>-->
                  <!--<span v-show="scope.row.ischecked" class="addhyet">+</span>-->
                  <i class="iconfont web-jia addh" v-show="!scope.row.ischecked" @click="addToRight(scope.row, scope.$index)"></i>
                  <i class="iconfont web-jia addhyet" v-show="scope.row.ischecked"></i>
                </template>
              </el-table-column>
            </el-table>
            <div class="center pagination">
              <el-pagination background layout="prev, pager, next" :pager-count="5" :total="total"
                             :current-page="pageNum" :page-size="9" @current-change="pageChange"
                             :small="true"></el-pagination>
            </div>
          </div>
          <div class="hright">
            <el-table :data="compnayAdd" style="width: 100%" height="350" class="compnayList" stripe size="mini">
              <el-table-column prop="name" label="已添加同行业公司" align="left">
                <template slot-scope="scope">
                  <div class="possessorname" :title="scope.row.name">{{ scope.row.name}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="操作" width="60" align="center">
                <template slot-scope="scope">
                  <img class="pointer" :src="$image.stockholder.delete" @click="deleteTo(scope.row, scope.$index)">
                </template>
              </el-table-column>
            </el-table>
            <div class="r-btn-box">
              <span class="tip">请选择4家公司</span>
              <span class="span-btn" @click="addAll">恢复默认</span>
              <span class="span-btn" @click="deleteAll">全部删除</span>
            </div>
          </div>

        </div>
      </div>
      <div class="center top20">
        <el-button type="primary" class="btn-main" @click="closeSetDialog" plain size="small">取消</el-button>
        <el-button type="primary" class="btn-main" @click="setManualSameIndustry" size="small">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        setDialog: false,
        userId: '',
        searchWord: '',
        companyName: '',
        compnayList: [],
        compnayAdd: [],
        total: 0,
        pageNum: 1,
        pageSize: 9
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    props: ['companyCode', 'setDialogInfo'],
    watch: {
      companyCode: function (val) {
        if (val) {
          // this.getAllIndustryCompany()
          this.searchWord = '';
          this.pageNum = 1;
          this.getManualSameIndustry();
        }
      },
      setDialogInfo: function (val) {
        this.setDialog = this.setDialogInfo;
        this.searchWord = '';
        this.pageNum = 1;
        if (val) {
          this.getManualSameIndustry();
        }
      },
      searchWord: function (val) {
        if (val.length == 0) {
          this.pageNum = 1;
          this.getAllIndustryCompany();
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      // this.getAllIndustryCompany()
      this.getManualSameIndustry()
    },
    mounted() {
    },
    // 方法
    methods: {
      querySearch(queryString, cb) {
//        if (!this.searchWord) {
//          this.$message({showClose: true, type: 'warning', duration: 3000, message: '请输入公司代码/简称'});
//          return false
//        }
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: this.searchWord
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            let gridData = data.filter(e => {
              return e.bstock != true
            })
            cb(gridData)
          }
        })
      },
      handleSelect(item) {
        this.searchWord = item.code;
        this.pageNum = 1;
        this.getAllIndustryCompany();
      },
      pageChange(index) {
        this.pageNum = index;
        this.getAllIndustryCompany()
      },
      searchCompany() {
        this.pageNum = 1;
        this.getAllIndustryCompany()
      },
      // + 号操作
      addToRight(item, index) {
        console.log(item.name);
        console.log(555);
        if (item.code == this.companyCode) {
          this.$confirm(`您当前查看的正是"${item.name}"趋势分析页面，故无法将"${item.name}"设置为同行业公司`, '小安提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          }).catch(() => {
          })
          return
        }
        if (this.compnayAdd.length < 4) {
          this.$set(this.compnayList[index], 'ischecked', true)
          this.compnayList = Object.assign([], this.compnayList)
          this.compnayAdd.unshift(item)
        } else {
          this.$confirm('同行业公司最多可添加4家，如需添加，请先删除不需要的同行业公司再加入', '小安提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          }).catch(() => {
          })
        }
      },
      // 全部添加
      addAll() {
        // this.compnayList.forEach((item, index) => {
        //   if (!item.ischecked) {
        //     // item.ischecked = true
        //     this.$set(this.compnayList[index], 'ischecked', true)
        //     this.compnayAdd.unshift(item)
        //   }
        // })
        this.compnayAdd = [];
        // this.compnayList = [];
        this.getDefaultSameIndustry();
        // this.compnayList = Object.assign([], this.compnayList)
      },
      // 删除已添加
      deleteTo(obj, i) {
        this.compnayAdd.splice(i, 1)
        this.compnayList.forEach((item, index) => {
          if (obj.name == item.name) {
            this.$set(this.compnayList[index], 'ischecked', false)
          }
        })
        this.compnayList = Object.assign([], this.compnayList)
      },
      // 删除所有已添加
      deleteAll() {
        this.compnayAdd = []
        this.compnayList.forEach((item, index) => {
          this.$set(this.compnayList[index], 'ischecked', false)
        })
        this.compnayList = Object.assign([], this.compnayList)
      },
      closeSetDialog() {
        this.pageNum = 1;
        this.searchWord = '';
        this.$emit("upAdd", false);
      },
      addCompany() {

      },
      // 获取所有同行业公司
      getAllIndustryCompany() {
        let paras = {
          code: this.companyCode,
          keyWord: this.searchWord,
          pageNo: this.pageNum,
          pageSize: this.pageSize,
          userId: this.userId
        }
        this.$axios.gxfApi.getAllIndustryCompany(paras)
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.compnayList = res.data.returnObject;
              this.total = res.data.total;
              if (this.compnayAdd.length > 0) {
                let companyCodes = this.compnayAdd.map(e => e.code).join(',')
                this.compnayList.forEach((item, index) => {
                  if (companyCodes.indexOf(item.code) > -1) {
                    item.ischecked = true
                  } else {
                    item.ischecked = false
                  }
                })
              }

            } else {
              this.compnayList = []
            }
          })
      },
      // 获取同行业公司
      getManualSameIndustry() {
        let paras = {
          code: this.companyCode,
          userId: this.userId,
          pageNo: 1,
          pageSize: 9
        }
        this.$axios.gxfApi.getManualSameIndustry(paras)
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.compnayAdd = res.data.returnObject
            } else {
              this.compnayAdd = []
            }
            this.getAllIndustryCompany()
          })
      },
      // 手动设置同行业公司
      setManualSameIndustry() {
        if (this.compnayAdd.length < 4) {
          this.$confirm('请选择4家同行业公司，或者点击恢复默认同行业公司', '小安提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          }).catch(() => {
          })
          return
        }
        let companyCodes = []
        this.compnayAdd.forEach((item, index) => {
          companyCodes.push(item.code)
        })
        let paras = {
          companyCodes: companyCodes.join(','),
          userId: this.userId,
          accountCode: this.companyCode
        }
        this.$axios.gxfApi.setManualSameIndustry(paras)
          .then((res) => {
            this.closeSetDialog();
            this.$store.commit('setDialogInfo', true);
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '设置成功'});
            } else {
              this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg});
            }
          })
      },

      // 恢复默认同行业公司
      getDefaultSameIndustry() {
        let paras = {
          code: this.companyCode,
          userId: this.userId,
          pageNo: 1,
          pageSize: 9
        }
        this.$axios.gxfApi.getDefaultSameIndustry(paras)
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.compnayAdd = res.data.returnObject
            } else {
              this.compnayAdd = []
            }
            this.getAllIndustryCompany()
          })
      }
    }
  }
</script>

<style lang="scss">
  .el-message-box__wrapper {
    .el-message-box__title {
      text-align: center;
      color: #FFB148;
    }
  }

  .el-message-box__btns {
    text-align: center;
  }

  #industryCompany {
    .set-industry-company {

      .setkonggu-content {
        min-height: 400px;
        /*border-bottom: 1px solid #e3e3e3;*/
        .konggu-search {
          font-size: 12px;
          display: flex;
          align-items: center;
          padding-bottom: 10px;
          .sp {
            white-space: nowrap;
          }
          .ml {
            display: inline-block;
            margin-left: 10px;
          }
          .gdxj {
            width: 140px;
          }
          .stock-name {
            width: 460px;
          }
        }

      }
      .compnayList-box {
        height: 390px;
        .hleft {
          width: 260px;
          float: left;
          border: 1px solid #e3e3e3;
          .pagination {
            padding: 5px 0;
          }
        }
        .hright {
          width: 228px;
          float: right;
          border: 1px solid #e3e3e3;
          .r-btn-box {
            height: 36px;
            line-height: 36px;
            text-align: right;
            padding-left: 5px;
            .tip {
              float: left;
              color: #8d8d8d;
              font-size: 12px;
            }
            .span-btn {
              font-size: 12px;
              color: #ffb148;
              margin-right: 10px;
              text-decoration: underline;
              cursor: pointer;
            }
          }
        }
      }
      .btn-main {
        width: 120px;
      }
    }
    .el-dialog__header {

    }
    .el-dialog__body {
      padding: 10px 16px 12px 16px;
    }
  }

</style>
