<template>
  <div id="personEdit">
    <el-form label-width="100px" class="ruleForm">
      <el-form-item label="用户名" :class="[{'is-success': errFrom.userName === 1}, {'is-error': errFrom.userName === 0}]"
                    required>
        <el-input v-model="ruleForm.userName" spellcheck="false" @blur="onblur('userName')"
                  @focus="oninput('userName')"></el-input>
        <div v-show="errFrom.userName===0" class="el-form-item__error">请输入用户名</div>
      </el-form-item>

      <el-form-item label="姓名" :class="[{'is-success': errFrom.realName === 1}, {'is-error': errFrom.realName === 0}]"
                    required>
        <el-input v-model="ruleForm.realName" spellcheck="false" @blur="onblur('realName')"
                  @focus="oninput('realName')"></el-input>
        <div v-show="errFrom.realName===0" class="el-form-item__error">请输入姓名</div>
      </el-form-item>

      <el-form-item label="邮箱" :class="[{'is-success': errFrom.email === 1}, {'is-error': errFrom.email === 0}]"
                    required class="hiddenreqired">
        <el-input v-model="ruleForm.email" spellcheck="false" @blur="onblur('email')"
                  @focus="oninput('email')"></el-input>
        <div v-show="errFrom.email===0" class="el-form-item__error">
          {{ruleForm.email ===''?'请输入邮箱':'邮箱格式错误'}}
        </div>
      </el-form-item>

      <el-form-item label="公司类型" required>
        <el-col :span="12" class="space">
          <el-form-item :class="[{'is-success': errFrom.companyTypeOne === 1}]">
            <el-select v-model="ruleForm.companyTypeOne" placeholder="请选择" @change="companyTypeOneChange"
                       @blur="onblur('companyTypeOne')">
              <el-option v-for="item in companyTypeOneList" :key="item.id" :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item :class="[{'is-success': errFrom.companyTypeOne === 1}]">
            <el-select v-model="ruleForm.companyTypeTwo" placeholder="请选择" @change="companyTypeTwoChange"
                       @blur="onblur('companyTypeTwo')">
              <el-option v-for="item in companyTypeTwoList" :key="item.id" :label="item.name"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>

      <el-form-item label="公司代码" v-show="isShowCode"
                    :class="[{'is-success': errFrom.companyCode === 1}, {'is-error': errFrom.companyCode === 0}]"
                    required>
        <el-input v-model="ruleForm.companyCode" :placeholder="codePlaceholder" spellcheck="false"
                  @blur="onblur('companyCode')" @focus="oninput('companyCode')"></el-input>
        <div v-show="errFrom.companyCode===0" class="el-form-item__error">
          {{errFromInfo.companyCode}}
        </div>
      </el-form-item>

      <el-form-item label="公司名称"
                    :class="[{'is-success': errFrom.companyName === 1}, {'is-error': errFrom.companyName === 0}]"
                    required>
        <el-input v-model="ruleForm.companyName" spellcheck="false" @blur="onblur('companyName')"
                  @focus="oninput('companyName')"></el-input>
        <div v-show="errFrom.companyName===0" class="el-form-item__error">请输入公司名称</div>
      </el-form-item>

      <el-form-item label="公司职位" :class="[{'is-success': errFrom.position === 1}]" required class="hiddenreqired">
        <el-select v-model="ruleForm.position" placeholder="请选择公司职位" no-data-text="请选择公司职位"
                   @change="onblur('position')">
          <el-option v-for="item in positionList" :key="item.id" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label=" " required class="hiddenreqired" v-show="isShowPositionOther">
        <el-input v-model="ruleForm.positionOther" spellcheck="false"></el-input>
      </el-form-item>

      <el-form-item label="公司地址" required class="hiddenreqired">
        <el-col :span="8" class="space">
          <el-form-item :class="[{'is-success': errFrom.companyProvince === 1}]">
            <el-select v-model="ruleForm.companyProvince" placeholder="请选择" no-data-text="请选择"
                       @change="getCitylistOnChang">
              <el-option v-for="item in areaData.pro" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" class="space">
          <el-form-item :class="[{'is-success': errFrom.companyProvince === 1}]">
            <el-select v-model="ruleForm.companyCity" placeholder="请选择" no-data-text="请选择" @change="getTownList">
              <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item :class="[{'is-success': errFrom.companyProvince === 1}]">
            <el-select v-model="ruleForm.companyTown" placeholder="请选择" no-data-text="请选择">
              <el-option v-for="item in townList" :key="item.id" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label=" " :class="[{'is-success': errFrom.companyStreet === 1}]">
        <el-input type="textarea" v-model="ruleForm.companyStreet" placeholder="请输入公司详细地址"></el-input>
      </el-form-item>

      <el-form-item v-if="!register">
        <el-button v-if="stype==='edit'" class="subBtn" type="primary" @click="submitForm()">保 存</el-button>
        <el-button v-else class="regBtn" type="primary" @click="submitForm()">注 册</el-button>
      </el-form-item>
      <el-form-item v-else>
        <el-button class="regBtn" type="primary" @click="submitForm()">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import areaData from '@/service/area_data'
  export default {
    name: 'personEdit',
    props: {
      stype: {
        type: String,
        required: true
      },
      weixinNick: {
        type: String
      },
      register: {
        type: Boolean
      }
    },
    data() {
      return {
        ruleForm: {
          'userName': '',
          'realName': '',
          'mobile': '',
          'email': '',
          'position': '',
          'positionOther': '',
          'companyName': '',
          'companyProvince': '',
          'companyCity': '',
          'companyTown': '',
          'companyStreet': '',
          'provinceId': '',
          'cityId': '',
          'areaId': '',
          'companyTypeOne': '',
          'companyTypeTwo': '',
          'companyCode': '',
          'weixinId': null,
          'weixinUsername': '',
          'weixinUnionId': null,
          'weixinAvatar': '',
          'regDatetime': null,
          'level': 1,
          'memberId': null,
          'registerFrom': 1,
          'token': null,
          'hasLyz': null,
          'lyzUrl': null,
          'stockType': 1
        },
        errFrom: {
          'userName': '',
          'realName': '',
          'mobile': '',
          'email': '',
          'position': '',
          'companyName': '',
          'companyProvince': '',
          'companyCity': '',
          'companyTown': '',
          'companyStreet': '',
          'provinceId': '',
          'cityId': '',
          'areaId': '',
          'companyTypeOne': '',
          'companyTypeTwo': '',
          'companyCode': '',
          'weixinId': null,
          'weixinUsername': '',
          'weixinUnionId': null,
          'weixinAvatar': '',
          'regDatetime': null,
          'level': 1,
          'memberId': null,
          'token': null,
          'hasLyz': null,
          'lyzUrl': null,
          'stockType': 1
        },
        errFromInfo: {
          companyCode: ''
        },
        areaData: areaData,
        cityList: '',
        townList: '',
        userInfo: {},
        companyTypeOneList: [],
        companyTypeTwoList: [],
        positionList: [],
        setCompanyCode: '',
        codePlaceholder: '',
        isShowCode: true,
        isShowPositionOther: false
      }
    },
    methods: {
      checkAll() {
        let allkey = ['userName', 'realName', 'email', 'companyTypeOne', 'companyTypeTwo', 'companyCode', 'companyName', 'position', 'companyProvince', 'companyStreet']
        for (let i = 0; i < allkey.length; i++) {
          if (allkey[i] === 'companyCode') {
            let errMsg = this.setCompanyErrCode()
            if (errMsg !== '') {
              this.errFrom.companyCode = 0
            } else {
              this.errFrom.companyCode = 1
            }
          } else {
            this.onblur(allkey[i])
          }
        }
        if (this.errFrom.userName === 0 || this.errFrom.realName === 0 || this.errFrom.email === 0 ||
          this.errFrom.companyCode === 0 || this.errFrom.companyName === 0) {
          return false
        } else {
          return true
        }
      },
      onblur(key) {
        if (key === 'userName') {
          if (this.empty(this.ruleForm.userName)) {
            this.errFrom.userName = 0
          } else {
            this.errFrom.userName = 1
          }
        } else if (key === 'realName') {
          if (this.empty(this.ruleForm.realName)) {
            this.errFrom.realName = 0
          } else {
            this.errFrom.realName = 1
          }
        } else if (key === 'email') {
          console.log(this.ruleForm.email !== '')
          if (!this.$regx.mail(this.ruleForm.email) && this.ruleForm.email !== '') {
            this.errFrom.email = 0
          } else {
            this.errFrom.email = 1
          }
        } else if (key === 'companyCode') {
          let errMsg = this.setCompanyErrCode()
          if (errMsg !== '') {
            this.errFrom.companyCode = 0
          } else {
            this.errFrom.companyCode = 1
            if (this.isShowCode) {
              this.getStockCode()
            }
          }
        } else if (key === 'companyName') {
          if (this.empty(this.ruleForm.companyName)) {
            this.errFrom.companyName = 0
          } else {
            this.errFrom.companyName = 1
          }
        } else if (key === 'companyTypeOne') {
          this.errFrom.companyTypeOne = 1
        } else if (key === 'companyTypeTwo') {
          this.errFrom.companyTypeTwo = 1
        } else if (key === 'position') {
          if (this.ruleForm.position !== '请选择') {
            this.errFrom.position = 1
          } else {
            this.errFrom.position = 2
          }
          if (this.ruleForm.position === '其他') {
            this.isShowPositionOther = true
          } else {
            this.isShowPositionOther = false
          }
        } else if (key === 'companyProvince') {
          if (this.ruleForm.companyProvince !== '请选择') {
            this.errFrom.companyProvince = 1
          } else {
            this.errFrom.companyProvince = 2
          }
        } else if (key === 'companyStreet') {
          if (this.ruleForm.companyStreet !== '') {
            this.errFrom.companyStreet = 1
          } else {
            this.errFrom.companyStreet = 2
          }
        }
      },
      oninput(key) {
        if (key === 'userName') {
          this.errFrom.userName = 2
        } else if (key === 'realName') {
          this.errFrom.realName = 2
        } else if (key === 'realName') {
          this.errFrom.email = 2
        } else if (key === 'companyCode') {
          this.errFrom.companyCode = 2
        } else if (key === 'email') {
          this.errFrom.email = 2
        } else if (key === 'companyCode') {
          this.errFrom.companyCode = 2
        } else if (key === 'companyName') {
          this.errFrom.companyName = 2
        }
      },
      empty(value) {
        if (!value) {
          return true
        } else {
          return this.$regx.blank(value)
        }

      },
      submitForm() {
        if (this.checkAll()) {
          this.completePersonInfo()
        }
      },
      completePersonInfo() {
        // let userId = this.$cookie.get('userId')
        let userId = '';
        if (sessionStorage.getItem('registerInfo') && JSON.parse(sessionStorage.getItem('registerInfo')).id) {
          userId = JSON.parse(sessionStorage.getItem('registerInfo')).id;
        } else {
          userId = this.$cookie.get('userId')
        }
        let data = {
          id: userId,
          userId: userId,
          userName: encodeURIComponent(this.ruleForm.userName),
          realName: this.ruleForm.realName,
          email: this.ruleForm.email,
          position: this.getPositionId(),
          positionOther: this.ruleForm.positionOther,
          companyName: this.ruleForm.companyName,
          companyProvince: this.ruleForm.companyProvince,
          companyCity: this.ruleForm.companyCity,
          companyTown: this.ruleForm.companyTown,
          companyStreet: this.ruleForm.companyStreet,
          provinceId: this.getProId(this.ruleForm.companyProvince),
          cityId: this.getCityId(this.ruleForm.companyCity),
          areaId: this.getTownId(this.ruleForm.companyTown),
          companyTypeOne: this.getListId(this.ruleForm.companyTypeOne, this.companyTypeOneList),
          companyTypeTwo: this.getListId(this.ruleForm.companyTypeTwo, this.companyTypeTwoList),
          companyCode: this.ruleForm.companyCode === '0' ? '' : this.ruleForm.companyCode,
          // fromUserId: this.ruleForm.fromUserId,
          memberId: this.ruleForm.memberId,
          registerFrom: this.ruleForm.registerFrom,
          level: this.ruleForm.level
        }
        this.$db.dataUser.completePersonInfo(this, data).then((res) => {
          if (res.data.returnCode === 1) {
            if (this.stype === 'add') {
              this.$emit('submitForm')
              // this.$message({message: '信息提交成功', showClose: true, type: 'success', duration: 3000})
              this.$auth.loginSetAuth(this, res.data.returnObject);
            } else {
              this.$message({message: '信息修改成功', showClose: true, type: 'success', duration: 3000})
              this.$auth.reSetUserStore(this)
            }
            // this.$auth.loginSetAuth(this, res.data.returnObject);
            sessionStorage.removeItem('registerInfo');
            // this.$auth.reSetUserStore(this, res.data.returnObject);
          } else {
            this.$message({message: res.data.returnMsg, showClose: true, type: 'error', duration: 3000})
          }
        })
      },
      addUserInfo() {
        this.ruleForm.position = '请选择'
        this.ruleForm.companyProvince = '请选择'
        this.ruleForm.companyCity = '请选择'
        this.ruleForm.companyTown = '请选择'
        this.ruleForm.companyTypeOne = '上市公司'
        this.ruleForm.companyTypeTwo = '沪市主板'
        this.getCompanyinfo()
        this.getPosition()
        this.getCityList(this.ruleForm.companyProvince, this.ruleForm.companyCity, this.ruleForm.companyTown)
      },
      editUserInfo() {
        this.$db.dataUser.getUserInfo(this)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.ruleForm = res.data.returnObject
              if (!this.ruleForm.position) {
                this.ruleForm.position = '请选择'
              }
              if (this.ruleForm.position === '其他') {
                this.isShowPositionOther = true
              } else {
                this.isShowPositionOther = false
              }
              if (!this.ruleForm.email) {
                this.ruleForm.email = ''
              }
              if (!this.ruleForm.companyTypeOne) {
                this.ruleForm.companyTypeOne = '上市公司'
              }
              if (!this.ruleForm.companyTypeTwo) {
                this.ruleForm.companyTypeTwo = '沪市主板'
              }
              this.getCompanyinfo()
              this.getStockCode()
              this.getPosition()
              if (!this.ruleForm.companyProvince) {
                this.ruleForm.companyProvince = '请选择'
              }
              if (!this.ruleForm.companyCity) {
                this.ruleForm.companyCity = '请选择'
              }
              if (!this.ruleForm.companyTown) {
                this.ruleForm.companyTown = '请选择'
              }
              this.getCityList(this.ruleForm.companyProvince, this.ruleForm.companyCity, this.ruleForm.companyTown)
            }
          })
      },
      // 公司类型连动
      getCompanyinfo() {
        this.$db.dataUser.getCompanyinfo(this)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.companyTypeOneList = res.data.returnObject
              this.companyTypeOneChange(this.ruleForm.companyTypeOne, 0)
            }
          })
      },
      companyTypeOneChange(value, isChange) {
        for (let i in this.companyTypeOneList) {
          if (this.companyTypeOneList[i].name == value) {
            this.companyTypeTwoList = this.companyTypeOneList[i].userCompanyInfoList
            if (isChange !== 0) {
              this.ruleForm.companyTypeTwo = this.companyTypeTwoList[0].name
              this.ruleForm.companyCode = ''

            }
            this.setCompanyErrCode()
          }
        }
      },
      companyTypeTwoChange(value, isChange) {
        this.setCompanyErrCode()
      },
      setCompanyErrCode() {
        let info = ''
        let isErr = true
        let comType1 = this.ruleForm.companyTypeOne
        let comType2 = this.ruleForm.companyTypeTwo
        let comCode = this.ruleForm.companyCode
        if (comType1 == '上市公司') {
          if (comType2 == '沪市主板') {
            isErr = /^(600|601|603|900)[0-9]{3}$/.test(comCode)
            info = ['600120', '600,601,603,900', '6']
          } else if (comType2 == '深市主板') {
            isErr = /^(000|001|200)[0-9]{3}$/.test(comCode)
            info = ['000001', '000,001,200', '6']
          } else if (comType2 == '深市中小板') {
            isErr = /^(002)[0-9]{3}$/.test(comCode)
            info = ['002001', '002', '6']
          } else if (comType2 == '深市创业板') {
            isErr = /^(300)[0-9]{3}$/.test(comCode)
            info = ['300001', '300', '6']
          } else if (comType2 == '港股主板') {
            isErr = /^(00|01|02|03|04|06|80|84)[0-9]{3}$/.test(comCode)
            info = ['00001', '00,01,02,03,04,06,80,84', '5']
          } else if (comType2 == '港股创业板') {
            isErr = /^(08)[0-9]{3}$/.test(comCode)
            info = ['08030', '08', '5']
          }
        } else if (comType1 == '挂牌公司') {
          if ('创新层,基础层'.indexOf(comType2) >= 0) {
            isErr = /^(43|83|87)[0-9]{4}$/.test(comCode)
            info = ['430002', '43,83,87', '6']
          } else if (comType2 == '两网及退市公司') {
            isErr = /^(40|42)[0-9]{4}$/.test(comCode)
            info = ['400002', '40,42', '6']
          }
        }
        this.codePlaceholder = '请输入公司代码,如:' + info[0]

        let errMsg = ''
        if (!isErr) {
          errMsg = comType1 + comType2 + '代码' + info[1] + '开头' + info[2] + '位数字'
          this.errFromInfo.companyCode = errMsg
        }
        if ('上市公司,挂牌公司'.indexOf(comType1) >= 0 && comType2 != '其他上市公司') {
          this.isShowCode = true
        } else {
          this.isShowCode = false
        }
        return errMsg
      },
      getListId(name, list) {
        let id = ''
        for (let i in list) {
          if (list[i].name === name) {
            id = list[i].id
          }
        }
        return id
      },
      // 获取公司名称
      getStockCode() {
        if (this.ruleForm.companyCode) {
          this.$db.dataUser.getStockCode(this, this.ruleForm.companyCode)
            .then((res) => {
              if (res.data.returnCode === 1) {
                this.ruleForm.companyName = res.data.returnObject
              } else {
                this.ruleForm.companyName = ''
              }
            })
        }

      },
      // 获取公司职位
      getPosition() {
        this.$db.dataUser.getPosition(this)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.positionList = res.data.returnObject
              this.positionList.unshift({id: '0', name: '请选择'})
            }
          })
      },
      // 获取公司职位ID
      getPositionId() {
        let positionId = ''
        for (let i in this.positionList) {
          if (this.positionList[i].name === this.ruleForm.position) {
            positionId = this.positionList[i].id
          }
        }
        if (positionId === '0') {
          positionId = ''
        }
        return positionId
      },
      getProId(proName) {
        let proId = ''
        for (let i in this.areaData.pro) {
          if (this.areaData.pro[i].name === proName) {
            proId = this.areaData.pro[i].id
          }
        }
        return proId
      },
      getCityId(cityName) {
        let cityId = ''
        for (let i in this.cityList) {
          if (this.cityList[i].name === cityName) {
            cityId = this.cityList[i].id
          }
        }
        return cityId
      },
      getTownId(townName) {
        let townId = ''
        for (let i in this.townList) {
          if (this.townList[i].name === townName) {
            townId = this.townList[i].id
          }
        }
        return townId
      },
      getCitylistOnChang(proName, cityName, townName) {
        this.onblur('companyProvince')
        this.getCityList(proName, cityName, townName)
      },
      getCityList(proName, cityName, townName) {
        // this.onblur('companyProvince')
        let proId = this.getProId(proName)
        this.cityList = this.areaData.city[proId]
        if (!cityName || cityName === '请选择') {
          cityName = this.cityList[0].name
          this.ruleForm.companyCity = cityName
        }
        this.getTownList(cityName, townName)
      },
      getTownList(cityName, townName) {
        let cityId = this.getCityId(cityName)
        this.townList = this.areaData.county[cityId]
        if (!townName || townName === '请选择') {
          townName = this.townList[0].name
          this.ruleForm.companyTown = townName
        }
      }

    },
    // 生命周期函数
    created() {
      if (this.stype == 'add') {
        this.addUserInfo()
        this.ruleForm.userName = this.weixinNick
      } else {
        this.editUserInfo()
      }
      // this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      this.userInfo = JSON.parse(sessionStorage.getItem('registerInfo'));
      if (this.userInfo) {
        this.ruleForm.userName = this.userInfo.userName;
      }
    },
    mounted() {

    },
    destroyed() {
      sessionStorage.removeItem('registerInfo');
    }
  }
</script>
<style lang="scss">
  #personEdit {
    .subBtn {
      width: 240px;
      height: 40px;
      font-size: 17px;
    }
    .regBtn {
      width: 220px;
      height: 40px;
      margin-left: 90px;
      font-size: 17px;
    }

    .ruleForm {
      width: 520px;
    }

    .space {
      padding-right: 10px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item.is-required .el-form-item__label:before {
      margin-left: 4px;
      float: right;
      position: relative;
      top: 3px;
    }
    .line {
      text-align: center;
      color: rgba(255, 255, 255, 0)
    }
    .hiddenreqired .el-form-item__label:before {
      visibility: hidden;
    }
    .el-form-item.is-error .el-input__inner {
      border-color: #fb4319
    }
    .el-form-item__error {
      color: #fb4319
    }
    /*
    .ok {
      border-color: #67c23a;
    }
    .err {
      border-color: #f56c6c;
    }
    */
  }

</style>
