<template>
  <div id="abnormal">
    <div class="header vxa-image-bg-affiche">
      <v-headerTitle :title="'异常波动报告'"></v-headerTitle>
    </div>
    <div class="content">
      <el-row :gutter="20" type="flex">
        <el-col :span="5">
          <div class="condition">
            <div class="title">
              <div class="flex">报告日期
                <el-tooltip class="item" effect="light" content="日期留空，显示当日异动报告" placement="bottom-start" popper-class="popper" :visible-arrow="false">
                  <img class="wen" :src="$image.prompt.questionIcon">
                </el-tooltip>
              </div>
              <el-button type="text" @click="resetDate">重置</el-button>
            </div>
            <div class="date">
              <div class="pb10">自：<el-date-picker v-model="startDate" type="date" size="small" placeholder="选择日期" style="width:170px;" :picker-options="pickerOptions1" value-format="yyyy-MM-dd" @change="startDateChange" :editable="false" :clearable="false"></el-date-picker></div>
              <div>到：<el-date-picker v-model="endDate" type="date" size="small" placeholder="选择日期" style="width:130px;":picker-options="pickerOptions2" value-format="yyyy-MM-dd" :editable="false" :clearable="false">
              </el-date-picker>
                <el-dropdown slot="append" placement="bottom" class="codeBtn"  @command="commandDate">
                  <el-button size="small" style="padding: 9px 5px;width:35px;background-color: #f5f7fa;border-color:#e3e3e3; border-radius: 3px;">...</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="week">本周</el-dropdown-item>
                    <el-dropdown-item command="month">本月</el-dropdown-item>
                    <el-dropdown-item command="quarter">本季</el-dropdown-item>
                    <el-dropdown-item command="year">今年</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

              </div>
            </div>
            <div class="title">
              <div class="flex">公司代码
                <el-tooltip class="item" effect="light" content="公司留空，显示沪深两市公司" placement="bottom-start" popper-class="popper" :visible-arrow="false">
                  <img class="wen" :src="$image.prompt.questionIcon">
                </el-tooltip>

              </div>
              <el-button type="text" @click="inputCode=''">重置</el-button>
            </div>
            <div class="code">
              <el-autocomplete  size="small" :debounce="500" popper-class="auto-list"
                v-model="inputCode" :fetch-suggestions="querySearchAsync" placeholder="请输入内容" :clearable="true">
                <el-button slot="prepend" size="small" class="codeBtn">公司</el-button>
                <el-dropdown slot="append" placement="bottom" class="codeBtn" @command="handleSelect">
                  <el-button type="primary">组合</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="company">本公司</el-dropdown-item>
                    <el-dropdown-item command="attention">关注公司</el-dropdown-item>
                    <el-dropdown-item command="compare">可比公司</el-dropdown-item>
                    <el-dropdown-item command="supervise" v-if="userInfo.superviseUser">监管公司</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <template slot-scope="{item}">
                  <div style="width:300px;">
                    <span style="width:60px;display: inline-block" v-html="$common.highlight(inputCode,item.code)"></span>
                    <span v-html="$common.highlight(inputCode,item.name)"></span>
                  </div>
                </template>
              </el-autocomplete>
            </div>
            <div class="wxCodeImg">
              <img :src="$image.condition.wxcode">
              <p class="tip">
                关注信公小安公众号<br/>
                每日接收公司异常波动报告
              </p>
            </div>
          </div>
        </el-col>
        <el-col :span="19">
          <div class="listDetaile">
            <h4>异常波动报告</h4>
            <div class="query">
              <span v-if="startDate == endDate">报告日期：{{startDate}}</span>
              <span v-else>报告日期：{{startDate}} 至 {{endDate}}</span>

              <span v-show="inputCode">公司代码：{{inputCode}}</span>
            </div>
            <el-table class="box-table" :data="dataList.list" style="width: 100%" :empty-text="inputCode?'在报告期内，该公司未发生异动':'在报告期内，未发生异动'" v-loading="loading">
              <el-table-column prop="code" label="股票代码" width="80" header-align="center" align="center"></el-table-column>
              <el-table-column prop="name" label="股票名称" width="100" header-align="center" align="center"></el-table-column>
              <el-table-column prop="reason" label="异动原因" header-align="center" align="center"></el-table-column>
              <el-table-column prop="time" label="异动日期" width="100" header-align="center" align="center"></el-table-column>
              <el-table-column prop="code" label="相关公告" width="200" header-align="center" align="center">
                <template slot-scope="scope">
                  <!--<div class="rulelist">
                    <a :href="'/rule/details?id='+item.mainId" target="_blank"
                       v-for="(item,index) in scope.row.annonmcementDocList">{{item.title}}</a>
                  </div>-->
                  <el-popover ref="popover" placement="bottom" width="300" trigger="click">
                    <div class="rulelist">
                      <template v-if="relationAffiche.length>0">
                        <a :href="'/affiche/details?id='+item.mainId" target="_blank" v-for="(item,index) in relationAffiche">{{item.title}}</a>
                      </template>
                      <template v-else>
                        <div>尚未关联相关公告，请稍后再试</div>
                      </template>
                    </div>
                    <div slot="reference" class="showaffiche" @click="getStockChangeAnnouncement(scope.row.code, scope.row.time)">
                      查看相关公告
                    </div>
                  </el-popover>

                 <!-- <div  class="showaffiche" @click="getStockChangeAnnouncement(scope.row.code, scope.row.time)">
                    查看相关公告
                    <div :id="scope.row.id" class="afficheList" v-show="relationAffiche.length > 0">
                      <a :href="'/rule/details?id='+item.mainId" target="_blank" v-for="(item,index) in relationAffiche">{{item.title}}</a>
                    </div>
                  </div>-->
                  <!--<el-button v-popover:popover  @click="getStockChangeAnnouncement(scope.row.code, scope.row.time)">查看相关公告</el-button>-->
                </template>
              </el-table-column>
            </el-table>
            <div class="center pagination" v-if="dataList.total>20">
              <el-pagination background layout="prev, pager, next" :total="dataList.total" :page-size="20" @current-change="pageChange"></el-pagination>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    data() {
      return {
        loading: false,
        affichePopover: false,
        dataList: {
          list: [],
          pageNum: 1,
          pageSize: 20,
          total: 1
        },
        startDate: '',
        endDate: '',
        inputCode: '',
        groupCode: '',
        autocompleteList: [],
        relationAffiche: [],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() < new Date('2018/01/01') || time.getTime() > new Date()
          }
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() < new Date('2018/01/01') || time.getTime() > new Date()
          }
        }
      }
    },
    // 使用其它组件
    components: {
      ElCol,
      ElRow
    },
    computed: {},
    watch: {
      startDate: function (old, val) {
        if (old && val) {
          this.dataList.pageNum = 1
          this.getStockChangeForReportList()
        }
      },
      endDate: function (old, val) {
        if (old && val) {
          this.dataList.pageNum = 1
          this.getStockChangeForReportList()
        }
      },
      inputCode: function () {
        this.dataList.pageNum = 1
        if (this.inputCode == '本公司' || this.inputCode == '关注公司' || this.inputCode == '可比公司' || this.inputCode == '监管公司') {
          this.groupSearch()
        } else {
          this.groupCode = ''
          this.getStockChangeForReportList()
          console.log('inputCode!!')
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      if (this.userId) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
      }
      this.resetDate()
      this.getStockChangeForReportList()
      if (this.$route.query.from == 'supervise') {
        this.inputCode = '监管公司'
        this.startDate = this.$moment(this.$route.query.starttime).format("YYYY-MM-DD")
        this.endDate = this.$moment(this.$route.query.endtime).format("YYYY-MM-DD")
      }
    },
    mounted() {
    },
    // 方法
    methods: {
      // 重置时间
      resetDate () {
        this.startDate = this.$moment().format("YYYY-MM-DD")
        this.endDate = this.$moment().format("YYYY-MM-DD")
        this.startDateChange()
      },
      // 开始时间change事件n
      startDateChange () {
        let startDate = this.startDate
        if (this.$moment(this.endDate).isBefore(this.startDate)) {
          this.endDate = this.startDate
        }
        if (!startDate) {
          startDate = '2018/01/01'
        }
        let s = this.$moment(startDate).subtract(1, 'days')
        this.pickerOptions2 = {
          disabledDate(time) {
            return time.getTime() <= new Date(s) || time.getTime() > new Date()
          }
        }
      },
      // 时间段选择 本周，本月，本季，本年
      commandDate(command) {
        let sDate = ''
        let now = new Date()
        let y = new Date().getFullYear()
        let m = new Date().getMonth() + 1
        switch (command) {
          case 'week':
            sDate = this.$moment().weekday(1).format("YYYY-MM-DD")
            break
          case 'month':
            sDate = this.$moment(new Date(y + '-' + m + '-1')).format("YYYY-MM-DD")
            break
          case 'quarter':
            let quarter = this.$moment().quarter()
            if (quarter == 1) {
              sDate = y + '-01-01'
            } else if (quarter == 2) {
              sDate = y + '-04-01'
            } else if (quarter == 3) {
              sDate = y + '-07-01'
            } else if (quarter == 4) {
              sDate = y + '-10-01'
            }
            break
          case 'year':
            sDate = y + '-01-01'
            break
        }
        this.startDate = sDate
        this.endDate = this.$moment().format("YYYY-MM-DD")
        this.startDateChange()
      },
      // 公司代码 autocomplete
      loadCode () {
        return new Promise((resolve, reject) => {
          this.$http({
            methods: 'GET',
            url: this.$api.affiche.autoCompleteA,
            params: {
              key: this.inputCode
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.autocompleteList = res.data.returnObject
              this.autocompleteList.forEach((item) => {
                item.value = item.code
              })
            } else {
              this.autocompleteList = []
            }
            resolve(null)
          })
        })
      },
      querySearchAsync(queryString, cb) {
        this.loadCode().then(() => {
          var autocompleteList = this.autocompleteList;
          cb(autocompleteList);
        })
      },
      handleSelect (command) {
        switch (command) {
          case 'company':
            this.inputCode = '本公司'
            break
          case 'attention':
            this.inputCode = '关注公司'
            break
          case 'compare':
            this.inputCode = '可比公司'
            break
          case 'supervise':
            this.inputCode = '监管公司'
            break
        }
        // this.groupSearch()
      },
      // 获取我关注的公司代码
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
              resolve(res.data.returnObject.map(e => e.obj));
            }
            resolve([]);
          }).catch(reject);
        });
      },
      // 可比公司
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
              let obj = res.data.returnObject
              if (obj) {
                resolve(res.data.returnObject.map(e => e.code));
              } else {
                resolve([])
              }
            }
            resolve([])
          }).catch(reject);
        });
      },
      // 获取所有监管公司
      getAllSuperviseCompanyByUser () {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
            method: "GET",
            params: {
              userId: this.userId
            }
          }).then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              resolve(res.data.returnObject.map(e => e.companyCode))
            }
            resolve([])
          }).catch(reject)
        })
      },
      // 搜索方法
      groupSearch () {
        this.groupCode = ''
        if (this.inputCode == '本公司') {
          if (this.userInfo.enterpriseUser) {
            this.groupCode = this.userInfo.enterpriseCompanyCode
            this.getStockChangeForReportList()
          }
        } else if (this.inputCode == '关注公司') {
          this.getMyAttentionCodes().then(codes => {
            if (codes.length > 0) {
              this.groupCode = codes.join(',').replace(/[a-zA-Z]/g, '')
              this.getStockChangeForReportList()
            } else {
              this.$confirm('尚未设置关注公司，是否立即设置?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push('/follow/companies')
              }).catch(() => {
                this.inputCode = ''
              })
            }
          }).catch(err => {
            this.getStockChangeForReportList()
          })
        } else if (this.inputCode == '可比公司') {
          this.getCompanyCompare().then(codes => {
            if (codes.length > 0) {
              this.groupCode = codes.join(',').replace(/[a-zA-Z]/g, '')
              this.getStockChangeForReportList()
            } else {
              if (this.userInfo.root) {
                this.$confirm('尚未设置可比公司，是否立即设置?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.$router.push('/admin/application/compare')
                }).catch(() => {
                  this.inputCode = ''
                })
              } else {
                this.$message({showClose: true, type: "error", duration: 3000, message: '等待管理员设置同行业'});
                this.inputCode = ''
              }
            }
          }).catch(err => {
            this.getStockChangeForReportList()
          })
        } else if (this.inputCode == '监管公司') {
          this.getAllSuperviseCompanyByUser().then(codes => {
            if (codes.length > 0) {
              this.groupCode = codes.join(',').replace(/[a-zA-Z]/g, '')
              this.getStockChangeForReportList()
            } else {
              this.$confirm('尚未设置监管公司，是否立即设置?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.$router.push('/dashboard/regulator')
              }).catch(() => {
                this.inputCode = ''
              })
            }
          }).catch(err => {
            this.getStockChangeForReportList()
          })
        } else if (!/^\d{1,6}$/.test(this.inputCode)) {
          this.$http({
            methods: 'GET',
            url: this.$api.affiche.autoCompleteA,
            params: {
              key: this.inputCode
            }
          }).then((res) => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.gridData = res.data.returnObject
              if (this.gridData.length === 1) {
                if (this.inputCode === this.gridData[0].name) {
                  this.groupCode = this.gridData[0].code
                }
              }
            }
            this.getStockChangeForReportList()

          }).catch((err) => {
            this.getStockChangeForReportList()
          })
        } else {
          this.getStockChangeForReportList()
        }

      },
      pageChange (index) {
        this.dataList.pageNum = index;
        this.getStockChangeForReportList()
      },
      tableSortChange (obj) {
        console.log(obj)
        // obj.order (descending 下,ascending 上)
        // obj.prop (time) 绑定的字端

      },
      getStockChangeForReportList () {
        this.loading = true
        let code = this.inputCode
        if (this.groupCode) {
          code = this.groupCode
        }
        this.$http({
          methods: 'GET',
          url: this.$api.stock.getStockChangeForReportList,
          params: {
            codes: code,
            startDate: this.startDate,
            endDate: this.endDate,
            pageNum: this.dataList.pageNum,
            pageSize: this.dataList.pageSize
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.dataList.list = res.data.returnObject
            this.dataList.total = res.data.total
          } else {
            this.dataList.list = []
            this.dataList.total = 0
          }
          this.loading = false
        }).catch((err) => {
          this.dataList.list = []
          this.dataList.total = 0
          this.loading = false
        })
      },
      // 点击节点名称获取要点信息
      getStockChangeAnnouncement(code, time) {
        // var tempwindow = window.open()
        this.$http({
          method: 'GET',
          url: this.$api.stock.getStockChangeAnnouncement,
          params: {
            code: code,
            changeDate: time
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.affichePopover = true
            this.relationAffiche = res.data.returnObject ? res.data.returnObject : []
            if (this.relationAffiche.length == 1) {
              // this.$common.openWindow('/rule/details?id=' + this.relationAffiche[0].id)
              // var tempwindow = window.open()
              // tempwindow.location = '/rule/details?id=' + this.relationAffiche[0].mainId
            }
          } else {
            this.relationAffiche = []
            // this.$message({showClose: true, type: "error", duration: 3000, message: '暂无相关公告'});
            // this.affichePopover = false
          }
        }).catch(err => {
          this.relationAffiche = []
          // this.$message({showClose: true, type: "error", duration: 3000, message: '暂无相关公告'});
          // this.affichePopover = false
        })
      }
    }
  }
</script>

<style lang="scss">
  #abnormal {
    min-height: 750px;
    background-color: #f6f6f6;
    .header {
      background-color: #f0f1f5;
      height: 60px;
      position: relative;
      background-size: cover;
      overflow: hidden;
    }
    .content {
      padding: 20px 0;
    }
    .col-height {
      min-height: 750px;
    }
    .flex {
      display: flex;
      align-items: center;
    }
    .condition {
      background-color: #fff;
      min-height: 750px;
      border: 1px solid #e3e3e3;
      border-radius: 3px;
      .title {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding:0 15px;
        border-bottom: 1px solid #e3e3e3;
        .wen {
          margin-left: 5px;
          cursor: pointer;
        }
      }
      .date, code {
        border-bottom: 1px solid #e3e3e3;
        padding: 15px;
        .pb10 {
          padding-bottom: 10px;
        }
      }
      .date {
        color: #8d8d8d;
        font-size: 14px;
      }
      .code {
        padding: 15px 15px 0 15px;
        .el-button--small {
          /*width: 40px;*/
          padding: 9px 4px;
        }
        .el-input__inner {
          padding: 0 10px;
        }
        .el-button {
          padding: 12px 6px;
        }
        .el-input-group__prepend, .el-dropdown {
          color: #8d8d8d;
          font-size:13px;
        }

      }
      .wxCodeImg {
        text-align: center;
        margin-top: 300px;
        .tip {
          color: #aeaeae;
          font-size: 12px;
        }
      }
    }
    .listDetaile {
      background-color: #fff;
      min-height: 750px;
      padding: 15px;
      border: 1px solid #e3e3e3;
      border-radius: 3px;
      h4 {
        line-height: 1;
        padding: 0 6px;
        margin: 0;
        border-left: solid 4px #ffb148;
        font-weight: 800;
        color: #323232;
        font-size: 16px;
      }
      .query {
        padding:10px 0 0 10px;
        color: #8d8d8d;
        font-size: 14px;
        span {
          display: inline-block;
          margin-right: 20px;
        }
      }
      .box-table {
        margin-top:15px;
        border-top: 1px solid #ebeef5;

      }
      .el-table thead {
        tr {
          th {
            background-color: #f8f8f8;
          }
        }
      }
      .pagination {
        padding-top: 15px;
      }
      .showaffiche {
        cursor: pointer;
        &:hover {
          color: #ffb148;
        }
        .afficheList {
          position: absolute;
          top: 50px;
          left: 0;
          width:250px;
          background-color: #fff;
          border: 1px solid #e3e3e3;
        }
      }
    }
  }
  .auto-list {
    width:170px !important;
  }
  .el-autocomplete-suggestion__wrap {
    max-height: 380px;
  }
  .rulelist {
    text-align: left;
    a {
      padding: 5px 0;
      display: block;
      &:hover {
        color: #ffb148;
      }
    }
  }
</style>
