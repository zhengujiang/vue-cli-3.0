<template>
  <div id="dataCalibration">
    <div class="source">
      <div class="title">数据校准</div>
      <div class="selectArea" v-if="!outUser">
        <p>数据来源</p>
        <el-select v-model="value" placeholder="请选择" @change="sourceChange">
          <el-option v-for="item in options" :key="item.value"
                     :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="selectArea" v-else>
        <div v-if="this.sourceType !== 1">
          <p style="text-align: left;font-size: 14px;">数据来源：{{ years }}年年度经审计年报</p>
        </div>
        <div v-else-if="this.sourceType == 1">
          <p style="text-align: left;font-size: 14px;">数据来源：用户自定义</p>
          <p style="text-align: left;font-size: 14px;">数据更新于{{ $common.transTime(updateTime)[0] }}</p>
          <p style="text-align: left;font-size: 14px;">请使用最近一年、最近一期经审计的财务数据</p>
        </div>

      </div>
    </div>
    <div class="list">
      <div class="listOne">
        <div class="title">总资产</div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="latestIssueTotalAssets"
            @blur="inpuTing(1)"
            @focus="changeInput(1)"
            :maxlength='maxLength'> <!-- clearable -->
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText }}
          </div>
          <div class="finalSplit"></div>
        </div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="totalAssets"
            @blur="inpuTing(2)"
            @focus="changeInput(2)"
            :maxlength='maxLength'>
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText2 }}
          </div>
          <div class="finalSplit"></div>
        </div>
      </div>
      <div class="listOne">
        <div class="title">归母净资产</div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="latestIssueNetAssets"
            @blur="inpuTing(3)"
            @focus="changeInput(3)"
            :maxlength='maxLength'> <!-- clearable -->
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText }}
          </div>
          <div class="finalSplit"></div>
        </div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="netAssets"
            @blur="inpuTing(4)"
            @focus="changeInput(4)"
            :maxlength='maxLength'>
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText2 }}
          </div>
          <div class="finalSplit"></div>
        </div>
      </div>
      <div class="listOne">
        <div class="title">归母净利润</div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="netProfit"
            @blur="inpuTing(5)"
            @focus="changeInput(5)"
            :maxlength='maxLength'> <!-- clearable -->
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText2 }}
          </div>
          <div class="finalSplit"></div>
        </div>
      </div>
      <div class="listOne">
        <div class="title">营业总收入</div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="totalOperatingIncome"
            @blur="inpuTing(6)"
            @focus="changeInput(6)"
            :maxlength='maxLength'> <!-- clearable -->
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText2 }}
          </div>
          <div class="finalSplit"></div>
        </div>
      </div>
      <div class="listOne" v-if="stockMarket == 'SH' && stockMarket !== 'ZX'">
        <div class="title">营业成本</div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="operatingCost"
            @blur="inpuTing(7)"
            @focus="changeInput(7)"
            :maxlength='maxLength'> <!-- clearable -->
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText2 }}
          </div>
          <div class="finalSplit"></div>
        </div>
      </div>
      <div class="listOne"
           v-else-if="(stockMarket == 'CY' && stockMarket !== 'ZX')">
        <div class="title">主营收入</div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="mainBusinessIncome"
            @blur="inpuTing(8)"
            @focus="changeInput(8)"
            :maxlength='maxLength'> <!-- clearable -->
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText2 }}
          </div>
          <div class="finalSplit"></div>
        </div>
      </div>
      <div class="listOne"
           v-else-if="(stockMarket == 'SZ' && stockMarket !== 'ZX')">
        <div class="title">主营收入</div>
        <div class="final">
          <el-input
            placeholder="请输入内容"
            v-model="mainBusinessIncome"
            @blur="inpuTing(8)"
            @focus="changeInput(8)"
            :maxlength='maxLength'> <!-- clearable -->
          </el-input>
          <div class="finalUnit">元</div>
          <div class="finalText">
            {{ finalText2 }}
          </div>
          <div class="finalSplit"></div>
        </div>
      </div>
      <!-- <v-inputList title="营业成本" finalText2="年末"></v-inputList>-->
      <div class="buttonArea">
        <el-button type="primary" @click="resetM">重置</el-button>
        <el-button type="primary" @click="saveData">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import inputList from './inputList.vue'

  export default {
    name: 'dataCalibration',
    data() {
      return {
        options: [{
          value: '选项1',
          label: '2016年年度经审计年报'
        }],
        userObj: {},
        outUser: false,
        value: '',
        companyCode: '',
        companyName: '',
        sourceType: 1,
        levelType: 1,
        years: '',
        updateTime: '',
        id: '',
        totalAssets: '',
        latestIssueTotalAssets: '',
        netAssets: '',
        latestIssueNetAssets: '',
        totalOperatingIncome: '',
        operatingCost: '',
        netProfit: '',
        mainBusinessIncome: '', // 主营业务收入
        stockMarket: '',
        numberArr: [],

        finalText: '期末',
        finalText2: '年末',
        totalNum: 0,
        maxLength: 16,
        outChange: false,
        shaixuan: false,
        userInfo: {}
      }
    },
    components: {
      'v-inputList': inputList
    },
    watch: {
      options: function (val) {
        for (let i in val) {
          if (parseInt(val[i].label) == this.years) {
            this.value = val[i].label
          }
        }
      },
      totalAssets: function (val) {
        if (val == '') {
          this.totalAssets = '0'
        }
      },
      latestIssueTotalAssets: function (val) {
        if (val == '') {
          this.latestIssueTotalAssets = '0'
        }
      },
      netAssets: function (val) {
        if (val == '') {
          this.netAssets = '0'
        }
      },
      latestIssueNetAssets: function (val) {
        if (val == '') {
          this.latestIssueNetAssets = '0'
        }
      },
      totalOperatingIncome: function (val) {
        if (val == '') {
          this.totalOperatingIncome = '0'
        }
      },
      operatingCost: function (val) {
        if (val == '') {
          this.operatingCost = '0'
        }
      },
      netProfit: function (val) {
        if (val == '') {
          this.netProfit = '0'
        }
      },
      mainBusinessIncome: function (val) {
        if (val == '') {
          this.mainBusinessIncome = '0'
        }
      }

    },
    created() {
      this.userInfo = JSON.parse(this.$cookie.get('userInfo'));
      this.companyCode = window.sessionStorage.getItem('companyCode')
      this.companyName = window.sessionStorage.getItem('companyName')
      if (this.userInfo.superviseUser) {
        this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
      }
      this.getMyInfo()
      // console.log('companyInfo = ', this.companyCode, this.companyName)
    },
    mounted() {
      // this.value = this.options[0].label
    },
    methods: {
      // 获取用户信息
      getMyInfo() {
        this.$http({
          methods: 'GET',
          url: this.$api.user.getMyInfo,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          // console.log(res)
          if (res.data.returnCode == 1) {
            this.userObj = res.data.returnObject
            if (this.userObj.superviseUser) {
              this.userObj.level = 0
            }
            if (this.userObj.level == 0) {
              this.outUser = true
              this.getDataOutside() // 外部用户获取年报数据
            } else {
              this.outUser = false
              this.getYearData() // 内部用户获取年报数据
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 重置
      resetM() {
        this.$confirm('将重置为最新年报数据，所有修改的数据将丢失，是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.userObj.level == 0) {
            this.resetDataOut()
          } else {
            this.resetData()
          }
        }).catch(() => {
        })
      },
      // 外部用户重置
      resetDataOut() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.resetDataOut,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: this.userInfo.enterpriseUser ? this.userInfo.companyId : ''
          }
        }).then((res) => {
          console.log('外部用户重置 = ', res)
          if (res.data.returnCode == 1) {
            var dataObj = res.data.returnObject
            this.years = dataObj.year
            this.companyName = dataObj.companyName
            this.sourceType = dataObj.sourceType
            // this.stockMarket = dataObj.stockMarket
            if (this.sourceType == 0) {
              // console.log('options = ', this.options)
              for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].label == '用户自定义') {
                  console.log(this.options[i])
                  this.options.splice(i, 1)
                  for (let i in this.options) {
                    if (parseInt(this.options[i].label) == this.years) {
                      this.value = this.options[i].label
                    }
                  }
                }
              }
            }
            // this.id = dataObj.id
            this.totalAssets = this.fmoney(dataObj.totalAssets)
            this.latestIssueTotalAssets = this.fmoney(dataObj.latestIssueTotalAssets)
            this.netAssets = this.fmoney(dataObj.latestIssueNetAssets)
            this.latestIssueNetAssets = this.fmoney(dataObj.netAssets)
            this.netProfit = this.fmoney(dataObj.netProfit)
            this.totalOperatingIncome = this.fmoney(dataObj.totalOperatingIncome)
            this.operatingCost = this.fmoney(dataObj.operatingCost)
            this.mainBusinessIncome = this.fmoney(dataObj.mainBusinessIncome)
            var arr = [dataObj.totalAssets, dataObj.latestIssueTotalAssets, dataObj.netAssets, dataObj.latestIssueNetAssets, dataObj.netProfit, dataObj.totalOperatingIncome, dataObj.operatingCost, dataObj.mainBusinessIncome]
            this.numberArr = arr.join(',')
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '重置成功！'
            })
            this.sourceType = 0
            this.saveDataOut()
            this.$emit('resetChange', 'true')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 内部用户重置
      resetData() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.resetData,
          params: {
            userId: this.$cookie.get('userId'),
            code: this.companyCode
          }
        }).then((res) => {
          console.log('内部用户重置 = ', res)
          if (res.data.returnCode == 1) {
            var dataObj = res.data.returnObject
            this.years = dataObj.year
            this.companyName = dataObj.companyName
            this.sourceType = dataObj.sourceType
            // this.stockMarket = dataObj.stockMarket
            if (this.sourceType == 0) {
              // console.log('options = ', this.options)
              for (let i = 0; i < this.options.length; i++) {
                if (this.options[i].label == '用户自定义') {
                  console.log(this.options[i])
                  this.options.splice(i, 1)
                  for (let i in this.options) {
                    if (parseInt(this.options[i].label) == this.years) {
                      this.value = this.options[i].label
                    }
                  }
                }
              }
            }
            this.id = dataObj.id
            this.totalAssets = this.fmoney(dataObj.totalAssets)
            this.latestIssueTotalAssets = this.fmoney(dataObj.latestIssueTotalAssets)
            this.netAssets = this.fmoney(dataObj.latestIssueNetAssets)
            this.latestIssueNetAssets = this.fmoney(dataObj.netAssets)
            this.netProfit = this.fmoney(dataObj.netProfit)
            this.totalOperatingIncome = this.fmoney(dataObj.totalOperatingIncome)
            this.operatingCost = this.fmoney(dataObj.operatingCost)
            this.mainBusinessIncome = this.fmoney(dataObj.mainBusinessIncome)
            var arr = [dataObj.totalAssets, dataObj.latestIssueTotalAssets, dataObj.netAssets, dataObj.latestIssueNetAssets, dataObj.netProfit, dataObj.totalOperatingIncome, dataObj.operatingCost, dataObj.mainBusinessIncome]
            this.numberArr = arr.join(',')
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '重置成功！'
            })
            this.$emit('resetChangeInside', 'true')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 保存用户修改
      saveData() {
        var arr = [this.rmoney(this.totalAssets), this.rmoney(this.latestIssueTotalAssets), this.rmoney(this.netAssets), this.rmoney(this.latestIssueNetAssets), this.rmoney(this.netProfit), this.rmoney(this.totalOperatingIncome), this.rmoney(this.operatingCost), this.rmoney(this.mainBusinessIncome)].join(',')
        console.log('arr = ', arr)
        console.log('numberArr = ', this.numberArr)
        if (this.numberArr == arr) {
          console.log('未修改')
        } else {
          console.log('已修改')
          this.sourceType = 1
          if (this.userObj.level == 0) {
            this.saveDataOut()

          } else {
            this.saveDataM()

          }
        }
      },
      // 外部保存修改数据信息
      saveDataOut() {
        this.$http({
          method: 'POST',
          url: this.$api.lookuptables.saveDataOut,
          params: {
            id: this.id,
            name: this.companyName,
            year: this.years,
            totalAssets: this.rmoney(this.totalAssets),
            latestIssueTotalAssets: this.rmoney(this.latestIssueTotalAssets),
            netAssets: this.rmoney(this.netAssets),
            latestIssueNetAssets: this.rmoney(this.latestIssueNetAssets),
            netProfit: this.rmoney(this.netProfit),
            totalOperatingIncome: this.rmoney(this.totalOperatingIncome),
            operatingCost: this.rmoney(this.operatingCost),
            mainBusinessIncome: this.rmoney(this.mainBusinessIncome),
            sourceType: this.sourceType
            // levelType: this.levelType
          }
        }).then((res) => {
          console.log('外部保存修改数据信息', res)
          if (res.data.returnCode == 1) {
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '保存成功！'
            })
            this.$emit('resetChange', 'true')
            this.outChange = true
            this.getDataOutside()
//            if (this.shaixuan) {
//              this.resetDataOut()
//            }
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              duration: 3000,
              message: res.data.returnMsg
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 内部员工保存修改数据信息
      saveDataM() {
        this.$http({
          method: 'POST',
          url: this.$api.lookuptables.saveDatas,
          params: {
            id: this.id,
            name: this.companyName,
            year: this.years,
            totalAssets: this.rmoney(this.totalAssets),
            latestIssueTotalAssets: this.rmoney(this.latestIssueTotalAssets),
            netAssets: this.rmoney(this.netAssets),
            latestIssueNetAssets: this.rmoney(this.latestIssueNetAssets),
            netProfit: this.rmoney(this.netProfit),
            totalOperatingIncome: this.rmoney(this.totalOperatingIncome),
            operatingCost: this.rmoney(this.operatingCost),
            mainBusinessIncome: this.rmoney(this.mainBusinessIncome),
            sourceType: this.sourceType,
            levelType: this.levelType,
            userId: this.$cookie.get('userId'),
            code: this.companyCode
          }
        }).then((res) => {
          console.log('内部员工保存修改数据信息 = ', res)
          if (res.data.returnCode == 1) {
            this.$message({
              showClose: true,
              type: 'success',
              duration: 3000,
              message: '保存成功！'
            })
            this.$emit('resetChangeInside', 'true')
            this.getYearData()
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              duration: 3000,
              message: res.data.returnMsg
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 外部用户获取年报数据
      getDataOutside() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.getData,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: this.userInfo.enterpriseUser ? this.userInfo.companyId : '',
            companyCode: this.userInfo.enterpriseUser ? '' : this.companyCode
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.companyCode = res.data.returnObject.code
            this.options = []
            var dataObj = res.data.returnObject
            var yearList = res.data.yearList
            if (yearList && yearList.length !== 0) {
              for (var i in yearList) {
                var obj = {
                  value: i,
                  label: yearList[i]
                }
                this.options.push(obj)
              }
            }
            this.years = dataObj.year
            if (this.options.length == 0 && this.years) {
              let obj1 = {
                value: 0,
                label: this.years + '年年度经审计年报'
              }
              this.options.push(obj1)
            }
//            if (this.outChange) {
//              console.log('123 == ', this.outChange)
//              this.value = '用户自定义'
//            }
            console.log('456  == ', this.value)
            this.years = dataObj.year
            this.companyName = dataObj.companyName
            this.sourceType = dataObj.sourceType
            this.stockMarket = dataObj.stockMarket
            this.updateTime = dataObj.updateTime
            if (this.sourceType == 1) {
              this.value = '用户自定义'
            }
            console.log('789  == ', this.value)
            this.id = dataObj.id
            this.totalAssets = this.fmoney(dataObj.totalAssets)
            this.latestIssueTotalAssets = this.fmoney(dataObj.latestIssueTotalAssets)
            this.netAssets = this.fmoney(dataObj.netAssets)
            this.latestIssueNetAssets = this.fmoney(dataObj.latestIssueNetAssets)
            this.netProfit = this.fmoney(dataObj.netProfit)
            this.totalOperatingIncome = this.fmoney(dataObj.totalOperatingIncome)
            this.operatingCost = this.fmoney(dataObj.operatingCost)
            this.mainBusinessIncome = this.fmoney(dataObj.mainBusinessIncome)
            var arr = [dataObj.totalAssets, dataObj.latestIssueTotalAssets, dataObj.netAssets, dataObj.latestIssueNetAssets, dataObj.netProfit, dataObj.totalOperatingIncome, dataObj.operatingCost, dataObj.mainBusinessIncome]
            this.numberArr = arr.join(',')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 内部员工获取年报数据
      getYearData() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.getYearData,
          params: {
            userId: this.$cookie.get('userId'),
            code: this.companyCode
          }
        }).then((res) => {
          console.log('getYearData =', res)
          if (res.data.returnCode == 1) {
            this.options = []
            var dataObj = res.data.returnObject
            var yearList = res.data.yearList
            if (yearList && yearList.length !== 0) {
              for (var i in yearList) {
                var obj = {
                  value: i,
                  label: yearList[i]
                }
                this.options.push(obj)
              }
            }
            this.years = dataObj.year
            this.companyName = dataObj.companyName
            this.sourceType = dataObj.sourceType
            this.stockMarket = dataObj.stockMarket
            if (this.sourceType == 1) {
              this.value = '用户自定义'
            }
            this.id = dataObj.id
            this.totalAssets = this.fmoney(dataObj.totalAssets)
            this.latestIssueTotalAssets = this.fmoney(dataObj.latestIssueTotalAssets)
            this.netAssets = this.fmoney(dataObj.netAssets)
            this.latestIssueNetAssets = this.fmoney(dataObj.latestIssueNetAssets)
            this.netProfit = this.fmoney(dataObj.netProfit)
            this.totalOperatingIncome = this.fmoney(dataObj.totalOperatingIncome)
            this.operatingCost = this.fmoney(dataObj.operatingCost)
            this.mainBusinessIncome = this.fmoney(dataObj.mainBusinessIncome)
            var arr = [dataObj.totalAssets, dataObj.latestIssueTotalAssets, dataObj.netAssets, dataObj.latestIssueNetAssets, dataObj.netProfit, dataObj.totalOperatingIncome, dataObj.operatingCost, dataObj.mainBusinessIncome]

            this.numberArr = arr.join(',')
          } else if (res.data.returnCode == -1) {
            this.$message({
              showClose: true,
              type: 'warning',
              duration: 3000,
              message: res.data.returnMsg
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 更改年报数据来源
      sourceChange() {
        console.log('更改年报数据来源 = ', this.options[this.value].label)
        if (this.options[this.value].label !== '用户自定义') {
          this.getData()
        } else {
          // this.options[this.value].label = 1
          this.getData()
        }
      },
      // 内部员工通过年份获取年报
      getData() {
        this.$http({
          methods: 'GET',
          url: this.$api.lookuptables.getNumData,
          params: {
            userId: this.$cookie.get('userId'),
            code: this.companyCode,
            year: parseInt(this.options[this.value].label) ? parseInt(this.options[this.value].label) : 1
          }
        }).then((res) => {
          console.log('内部员工通过年份获取年报', res.data)
          if (res.data.returnCode == 1) {
            var dataObj = res.data.returnObject
            this.latestIssueTotalAssets = this.fmoney(dataObj.latestIssueTotalAssets)
            this.totalAssets = this.fmoney(dataObj.totalAssets)
            this.netAssets = this.fmoney(dataObj.latestIssueNetAssets)
            this.latestIssueNetAssets = this.fmoney(dataObj.netAssets)
            this.netProfit = this.fmoney(dataObj.netProfit)
            this.totalOperatingIncome = this.fmoney(dataObj.totalOperatingIncome)
            this.operatingCost = this.fmoney(dataObj.operatingCost)
            this.mainBusinessIncome = this.fmoney(dataObj.mainBusinessIncome)
            var arr = [dataObj.totalAssets, dataObj.latestIssueTotalAssets, dataObj.netAssets, dataObj.latestIssueNetAssets, dataObj.netProfit, dataObj.totalOperatingIncome, dataObj.operatingCost, dataObj.mainBusinessIncome]

            this.numberArr = arr.join(',')
            if (this.userObj.level == 0) {
              this.$emit('resetChange', 'true')
            } else {
              this.$emit('resetChangeInside', 'true')
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      inpuTing(x) {
        if (x == 1) {
          this.latestIssueTotalAssets = this.fmoney(this.latestIssueTotalAssets)
        } else if (x == 2) {
          this.totalAssets = this.fmoney(this.totalAssets)
        } else if (x == 3) {
          this.latestIssueNetAssets = this.fmoney(this.latestIssueNetAssets)
        } else if (x == 4) {
          this.netAssets = this.fmoney(this.netAssets)
        } else if (x == 5) {
          this.netProfit = this.fmoney(this.netProfit)
        } else if (x == 6) {
          this.totalOperatingIncome = this.fmoney(this.totalOperatingIncome)
        } else if (x == 7) {
          this.operatingCost = this.fmoney(this.operatingCost)
        } else if (x == 8) {
          this.mainBusinessIncome = this.fmoney(this.mainBusinessIncome)
        }
      },
      changeInput(x) {
        if (x == 1) {
          this.latestIssueTotalAssets = this.rmoney(this.latestIssueTotalAssets)
        } else if (x == 2) {
          this.totalAssets = this.rmoney(this.totalAssets)
        } else if (x == 3) {
          this.latestIssueNetAssets = this.rmoney(this.latestIssueNetAssets)
        } else if (x == 4) {
          this.netAssets = this.rmoney(this.netAssets)
        } else if (x == 5) {
          this.netProfit = this.rmoney(this.netProfit)
        } else if (x == 6) {
          this.totalOperatingIncome = this.rmoney(this.totalOperatingIncome)
        } else if (x == 7) {
          this.operatingCost = this.rmoney(this.operatingCost)
        } else if (x == 8) {
          this.mainBusinessIncome = this.rmoney(this.mainBusinessIncome)
        }
      },

      // 聚焦去掉标点符号
      rmoney(number) {
        if (number.length <= 0) {
          return (number == '' ? '' : number)
        } else {
          var ret = (number + '').replace(/[^\d\.-]/g, '')
          return parseFloat(ret)
        }
      },
      // 格式化金额
      outputdollars(number) {
        var mod, output
        if (number.length <= 3) {
          return (number == '' ? '' : number)
        } else {
          mod = number.length % 3
          output = (mod == 0 ? '' : (number.substring(0, mod)))
          for (var i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0)) {
              output += number.substring(mod + 3 * i, mod + 3 * i + 3)
            } else {
              output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3)
            }
          }
          return (output)
        }
      },
      outputcents(amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100)
        return (amount < 10 ? '.0' + amount : '.' + amount)
      },
      fmoney(number) {
        number = String(number)
        var ngmer = ''
        number = number.replace(/\,/g, '')
        // console.log(number);
        if (isNaN(number) || number == '') {
          number = ''
        } else {
          number = Math.round(number * 100) / 100
          if (number < 0) {
            ngmer = ('-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0))
          } else {
            ngmer = (this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0))
          }
        }
        return ngmer
      }
    }
  }
</script>
<style lang="scss">
  #dataCalibration {
    .el-select {
      width: 100%;
      .el-input__inner {
        padding: 0 5px;
      }
    }
    .el-input__icon{
      line-height: 1;
    }
    .el-input__inner {
      width: 100%;
      height: 30px;
      border-radius: 4px;
    }
    .list {
      .el-input__inner {
        text-align: right;
        padding: 0 20px 0 35px;
        font-size: 13px;
        color: #323232;
      }
    }
    .el-input__suffix {
      right: 0px;
    }
    .el-select .el-input .el-select__caret {
      color: #ffb148;
    }
  }
</style>
<style lang="scss" scoped>
  #dataCalibration {
    width: 100%;
    height: 100%;
    .source {
      width: 100%;
      height: auto;
      background: #fff3e4;
      padding: 12px;
      box-sizing: border-box;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #323232;
        text-align: center;
        width: 100%;
        padding-bottom: 5px;
      }
      .selectArea {
        width: 100%;
        p {
          font-size: 14px;
          color: #323232;
          font-weight: bold;
          line-height: 25px;
        }
      }
    }
    .list {
      width: 100%;
      height: auto;
      padding: 0 12px;
      box-sizing: border-box;
      .title {
        font-size: 14px;
        font-weight: bold;
        color: #323232;
        line-height: 30px;
      }
      .final {
        width: 100%;
        height: auto;
        position: relative;
        margin-bottom: 10px;
        .finalText {
          font-size: 13px;
          color: #8d8d8d;
          position: absolute;
          left: 5px;
          top: 5px;
        }
        .finalUnit {
          font-size: 13px;
          color: #323232;
          position: absolute;
          right: 5px;
          top: 5.5px;
        }
        .finalSplit {
          width: 1px;
          height: 13px;
          background: #e3e3e3;
          position: absolute;
          left: 35px;
          top: 8px;
        }
      }
      .buttonArea {
        font-size: 14px;
        font-weight: bold;
        margin-top: 15px;
        margin-bottom: 15px;
        .el-button--primary {
          background: #ffefda;
          color: #ffb148;
          border-radius: 4px;
          width: 95px;
          height: 30px;
          line-height: 30px;
          padding: 0;
          &:active {
            background: #fff;
          }
        }
        .el-button--primary:last-child {
          background: #ffb148;
          color: #fff;
          &:active {
            background: #fff;
          }
        }
      }
    }
  }
</style>
