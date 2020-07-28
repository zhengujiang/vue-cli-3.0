<template>
  <div id="dataManage" class="content">
    <ul class="menu">
      <li v-for="(item,index) in menuList" :class="{active: item.active}" @click="handleMenu(item, index)">
        {{item.name}}
      </li>
    </ul>
    <el-dialog class="dialogStockHolder dialogXieye" :visible.sync="showDialog" width="620px" :show-close="false" :close-on-click-modal="false" center>
      <template slot="title">用户协议
        <i class="el-dialog__close el-icon el-icon-close xieye-close" @click="goLinke"></i>
      </template>
      <div class="xieye-content">
        一、接受条款<br/>
        1、用户点击信公小安注册页面的同意注册按钮并完成注册程序、获得信公小安账号和密码时，视为用户与信公小安已达成《信公小安用户协议》。<br/><br/>
        2、信公小安在此特别提示，用户欲使用信公小安服务，必须事先认真阅读本协议全部条款（未成年人阅读时应得到其监护人的陪同），特别是本协议中免除、减轻或者限制信公小安责任的全部条款以及含有限制用户权利内容的全部条款。<br/><br/>
        3、用户下载、注册、登录、使用及连接信公小安服务等行为均将被视为用户完全了解、接受并同意遵守本协议项下的全部内容。本协议可由信公小安单方随时修改，修改后的协议条款一经信公小安公布即代替本协议的原条款，构成用户与信公小安之间就本协议主题事由的全部、最新协议。用户可可以随时在信公小安网站或信公小安应用程序中查阅最新协议条款。如果用户不接受信公小安修改后的最新协议条款，请立即停止使用信公小安服务。如用户选择继续使用信公小安服务，则视为用户完全了解、接受并同意遵守信公小安修改后的最新协议条款。<br/><br/>
        4、用户特此声明，已经完全理解本协议相关内容，并不存在任何重大误解；同时，认可协议内容并不存在有失公平的情形。<br/><br/>
        二、用户信息条款<br/>
        1、用户个人信息。用户个人信息包括下列信息：用户真实姓名，职业，头像，手机号码，IP地址。<br/><br/>
        2、非用户个人信息。用户对信公小安服务的操作状态、使用记录、使用习惯等反映在信公小安服务器端的全部记录信息，及其他一切本条第1款所述的用户个人信息范围外的信息，均为普通信息，均不属于用户个人信息。<br/><br/>
        3、第三方平台记录信息。用户通过新浪微博账号、微信账号等第三方平台账号（下称“第三方平台”）注册、登录、使用信公小安服务的，将被视为用户完全了解、同意并接受信公小安已包括但不限于收集、统计、分析等方式使用其在新浪微博、微信等第三方平台上填写、登记、公布、记录的全部信息（下称“第三方平台记录信息”）。用户一旦使用第三方平台账号注册、登录、使用信公小安服务，信公小安对该等第三方平台记录的信息的任何使用，均将被视为已经获得了用户本人的完全同意并接受。<br/><br/>
      </div>
      <div class="center top20"><el-checkbox v-model="checked">我同意</el-checkbox></div>
      <div class="center top20">
        <el-button type="primary" class="check-btn" @click="close" size="small">确认</el-button>
      </div>
    </el-dialog>
    <el-dialog class="recordDateCheckDialogInfo" top="35vh" :before-close="beforeCloseDig" width="620px" title="小安提示"
                 :visible.sync="exportData"
                 append-to-body>
        <div class="progress-log">
          <div class="message">当前没有导入完整数据，请至少导入一期完整数据</div>
          <div class="center" style="padding-top: 30px">
            <el-button style="width: 90px" size="small" type="primary" @click="exportData = false">立即导入
            </el-button>
          </div>
        </div>
      </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        checked: false,
        showDialog: false,
        userInfo: {},
        menuList: [
          {name: '股东名册导入及管理', tabName: 'rosterExport', active: true, link: '/stockholder/rosterExport'},
          {name: '股东分组及设置', tabName: 'groupSet', active: false, link: '/stockholder/groupSet'},
          {name: '投资者数据库管理', tabName: 'investorManage', active: false, link: '/stockholder/investorManage'}
        ],
        recordDate: [],
        exportData: false
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      $route: function () {
        this.menuLoad()
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
//      if (!this.userInfo.selectAgreeMent) {
//        this.showDialog = true
//      }
      this.menuLoad()
    },
    mounted() {
    },
    // 方法
    methods: {
      menuLoad () {
        let name = this.$route.name
        this.menuList.forEach((item, index) => {
          if (name.indexOf(item.tabName) > -1) {
            item.active = true
          } else {
            item.active = false
          }
        })
      },
      handleMenu (item, index) {
        this.getLastedRecordDate(item, index);
      },
      // 获取名册期数
      getLastedRecordDate (item, index) {
        let paras = {
          userId: this.userId
        }
        this.$axios.gxfApi.getLastedRecordDate(paras)
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.recordDate = res.data.returnObject;
              if (this.recordDate.length == 0) {
                this.exportData = true;
              } else {
                this.menuList.forEach((item2, index2) => {
                  if (index2 == index) {
                    this.$set(this.menuList[index2], 'active', true)
                  } else {
                    this.$set(this.menuList[index2], 'active', false)
                  }
                })
                this.$router.push(item.link)
              }
            }
          })
      },
      beforeCloseDig() {
        this.exportData = false
      },
      close() {
        if (this.checked) {
          this.$http({
            method: 'POST',
            url: this.$api.gxfApi.updateAgreeMent,
            params: {
              userId: this.userId,
              status: 1
            }
          }).then((res) => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              // this.showDialog = false
              this.userInfo.selectAgreeMent = true
              this.$cookie.set('userInfo', this.userInfo)
            }
          })
        } else {
          this.$message({showClose: true, type: 'error', duration: 3000, message: '请先同意用户协议'});
        }
      },
      goLinke () {
        this.$router.push('/index')
      }
    }
  }
</script>

<style lang="scss">
  #dataManage {
    .menu {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #e3e3e3;
      margin-bottom: 16px;
      li {
        position: relative;
        padding: 15px 0;
        margin-right: 40px;
        float: left;
        font-size: 14px;
      }
      .active {
        color: #ffb148;
        &::before {
          content: '';
          position: absolute;
          width: 60px;
          height: 2px;
          top: 48px;
          left: 50%;
          margin-left: -30px;
          background-color: #ffb148;

        }
      }
    }
  }
  .dialogXieye {
    .el-dialog__header {
      .xieye-close {
        position: absolute;
        cursor: pointer;
        right: 10px;
        top: 20px;
        color: #8d8d8d;
      }
    }
  }
  .recordDateCheckDialogInfo {
    .el-dialog__header {
      border-bottom: 1px solid #e3e3e3;
      .el-dialog__title {
        color: #ffb148;
      }
      .el-dialog__body {
        padding: 25px;
      }
    }
    .message {
      text-align: center;
    }
  }
</style>
