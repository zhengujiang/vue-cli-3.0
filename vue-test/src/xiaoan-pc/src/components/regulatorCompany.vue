<template>
  <div class="regulutorCompany">
    <span class="companyCode" v-if="showCode">{{companyItem.companyFullCode}}</span>
    <el-popover :placement="placement" v-model="showPopover" width="232" trigger="click" popper-class="regulutorCompany">
      <span slot="reference" class="companyName">
        {{companyItem.companyName}}
        <i class="el-icon-caret-bottom i-caret" v-if="companyItem.companyName"></i>
      </span>
      <div class="company-content">
        <div class="search-page">
          <el-input v-model="searchWord" class="input-search" size="mini"  @keyup.enter.native="search">
            <i slot="suffix" class="el-input__icon el-icon-search icon-search" @click.stop="search"></i>
          </el-input>
          <v-page class="vpage" :flip="pageNum" :total="total" v-on:addition="addition" v-on:subtraction="subtraction"></v-page>
        </div>
        <div class="company-item" v-for="(item,index) in companyList" :key="index" v-show="showCompany(index)" @click="setCompany(item)" :class="{'company-select':item.companyCode==companyItem.companyCode}">
          <span>{{item.companyFullCode}}</span>
          <span>{{item.companyName}}</span>
        </div>
      </div>
    </el-popover>
    <el-dialog title="提示" custom-class="regulatorCompany" :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%" center>
      <span>你还未设置监管公司，前往设置。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="goSetCompany">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import page from '@/components/customPage.vue'
  export default {
    name: 'regulatorCompany',
    data() {
      return {
        dialogVisible: false,
        showPopover: false,
        userId: '',
        searchWord: '',
        companyItem: {},
        companyList: [], // 筛选 搜索后的数据
        companyObject: [], // 接口完整数据
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },
    // 使用其它组件
    components: {
      'v-page': page
    },
    props: {
      placement: {
        type: String,
        default: 'bottom'
      },
      showCode: {
        type: Boolean,
        default: false
      }
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getAllSuperviseCompanyByUser()
    },
    mounted() {
    },
    // 方法
    methods: {
      goSetCompany () {
        this.$router.push('/dashboard/regulator')
      },
      search () {
        this.companyList = []
        this.companyObject.forEach((item) => {
          let regx = new RegExp('^' + this.searchWord + '', 'i')
          if (item.companyFullCode.indexOf(this.searchWord) > -1 || item.companyName.indexOf(this.searchWord) > -1 || regx.test(item.companyPinyin)) {
            this.companyList.push(item)
          }
        })
        this.total = this.$common.totalPage(this.companyList.length, this.pageSize)
        this.pageNum = 1
      },
      showCompany (index) {
        let start = (this.pageNum - 1) * this.pageSize
        let end = this.pageNum * this.pageSize
        if (index >= start && index < end) {
          return true
        } else {
          return false
        }
      },
      setCompany (item) {
        sessionStorage.setItem('regulator_company', item.companyFullCode)
        this.showPopover = false
        this.companyItem = item
        this.$router.replace('/transfer?url=' + this.$route.path + '?companyCode=' + item.companyFullCode)
      },
      // 页数加一
      addition() {
        if (this.pageNum < this.total) {
          this.pageNum += 1
        }
      },
      // 页数减一
      subtraction() {
        if (this.pageNum > 1) {
          this.pageNum -= 1
        }
      },
      // 获取所有监管公司
      getAllSuperviseCompanyByUser () {
        let selectCompanyCode = this.$route.query.companyCode
        let storageCompanyCode = sessionStorage.getItem('regulator_company')
        if (storageCompanyCode) {
          selectCompanyCode = storageCompanyCode
        }

        this.$http({
          url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
          method: "GET",
          params: {
            userId: this.userId
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.companyObject = res.data.returnObject
            this.companyList = res.data.returnObject
            if (this.companyObject.toString() != '') {
              this.total = this.$common.totalPage(this.companyList.length, this.pageSize)
              if (!this.$route.query.companyCode) {
                this.companyObject.forEach(item => {
                  if (storageCompanyCode == item.companyFullCode) {
                    this.companyItem = item
                  }
                })

                if (!this.companyItem.companyFullCode) {
                  this.companyItem = this.companyList[0]
                }
                this.companyItem = Object.assign({}, this.companyItem)
                this.$router.replace('/transfer?url=' + this.$route.path + '?companyCode=' + this.companyItem.companyFullCode)
                console.log('/transfer?url=' + this.$route.path + '?companyCode=' + this.companyItem.companyFullCode)

              } else {
                this.companyItem = this.companyList[0]
                this.companyObject.forEach(item => {
                  if (this.$route.query.companyCode == item.companyFullCode) {
                    this.companyItem = item
                  }
                })
                // this.$router.replace('/transfer?url=' + this.$route.path + '?companyCode=' + this.companyItem.companyFullCode)
              }
              sessionStorage.setItem('regulator_company', this.companyItem.companyFullCode)
            } else {
              this.dialogVisible = true
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .regulutorCompany {
    display: inline-block;
    .companyCode {
      display: inline-block;
      margin-right: 5px;
      color: #ffb148;
      outline: none;
      cursor: pointer;
    }
    .companyName {
      color: #ffb148;
      outline: none;
      cursor: pointer;
    }
    .i-caret {
      /*margin-left: 0;*/
    }
    .company-content {
      width: 100%;
      padding: 0 10px;
      .search-page {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #e3e3e3;
        padding-bottom: 10px;
        .input-search {
          width: 100px;
        }
        .icon-search {
          color: #ffb148;
          font-weight: 800;
          cursor: pointer;
        }
        .vpage {
          /*margin-right: -8px;*/
        }
        .flip span {
          margin: 0 5px;
        }
      }

      .company-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        cursor: pointer;
        &:hover {
          color: #ffb148;
        }
      }
      .company-select {
        color: #ffb148;
      }

    }
    .el-dialog__header {
      padding: 0;
      border-bottom: 1px solid #e3e3e3;
    }
    .el-dialog__headerbtn {
      top: 0;
    }
    .el-dialog--center .el-dialog__body {
      padding: 15px 25px 10px;
    }
    .el-dialog__footer {
      padding: 0 10px 10px;
    }
  }


</style>
