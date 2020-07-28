<template>
  <div id="userManage">
    <div class="content">
      <el-tabs v-model="activeName">
        <el-tab-pane class="tabPane" label="用户管理" name="first"></el-tab-pane>
      </el-tabs>
      <el-row :gutter="20">
        <el-col :span="24">
          <div class="userMsg-head">
            <ul class="">
              <li>
                <el-input class="input"
                          placeholder="请输入用户姓名"
                          prefix-icon="el-icon-search"
                          v-model="selectUserName" clearable>
                </el-input>
              </li>
              <li>
                <el-input class="input"
                          placeholder="请输入用户手机号"
                          prefix-icon="el-icon-search"
                          v-model="selectMobile" clearable>
                </el-input>
              </li>
              <li>
                <el-select class="input" v-model="selectUserState" clearable placeholder="请选择用户状态">
                  <el-option
                    v-for="item in stateOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </li>
            </ul>
            <ul>
              <li>
              </li>
              <li>
              </li>
              <li class="checkStatus">
                <!--<el-checkbox v-model="selectUserStatus" class="checkSee">显示离任人员</el-checkbox>-->
                <el-button class="selectButton" type="primary" icon="el-icon-search" size="small" @click="getUserList">
                  搜索
                </el-button>
              </li>
            </ul>
          </div>
        </el-col>
      </el-row>
      <div class="table-title">
        <span class="leftSpan">可用用户数量：</span><span class="numSpan">{{useNum}}</span>
        <span class="rightSpan">用户上限：</span><span class="numSpan">{{inviteTotal}}</span>
        <el-button class="add-button" size="small" :icon="showIcon" plain="" @click="addUser">新增</el-button>
      </div>
      <div class="div-add-user" v-show="addShow">
        <el-card shadow="always">
          <ul>
            <li>
              <el-input placeholder="请输入手机号" v-model="addMobile" maxlength="11" clearable=""
                        @clear="resetInviteLink"></el-input>
            </li>
            <li class="link-input">
              <el-input class="link-in" placeholder="邀请链接" v-model="inviteLink" disabled></el-input>
            </li>
            <li>
              <el-button plain @click="makeLink">{{btnType}}</el-button>
            </li>
          </ul>
        </el-card>
      </div>
      <div class="table-content">
        <el-table
          :data="userList"
          style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form label-position="left" inline class="demo-table-expand">
                <el-form-item label="用户名">
                  <span>{{ props.row.userName }}</span>
                </el-form-item>
                <el-form-item label="邮箱">
                  <span>{{ props.row.email }}</span>
                </el-form-item>
                <el-form-item label="姓名">
                  <span>{{ props.row.realName }}</span>
                </el-form-item>
                <el-form-item label="职位">
                  <span>{{ props.row.position }}</span>
                </el-form-item>
                <el-form-item label="手机号">
                  <span>{{ props.row.mobile }}</span>
                </el-form-item>
                <el-form-item label="个人简介">
                  <span>{{ props.row.synopsis }}</span>
                </el-form-item>
                <el-form-item label="加入时间">
                  <span>{{ props.row.enterpriseTime }}</span>
                </el-form-item>
                <el-form-item label="微信名">
                  <span>{{ props.row.weixinUsername }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="用户名" prop="userName"></el-table-column>
          <el-table-column label="姓名" prop="realNameShow"></el-table-column>
          <el-table-column label="手机号" prop="mobile"></el-table-column>
          <el-table-column label="职位" prop="position"></el-table-column>
          <!--<el-table-column label="任职状态" prop="userJobStatus"></el-table-column>-->
          <el-table-column label="用户状态" prop="userState"></el-table-column>
          <el-table-column label="最近一次登录时间" prop="lastLoginDate"></el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button title="编辑" size="mini" @click="editRealName(scope.$index, scope.row)"><i
                class="el-icon-edit"></i>
              </el-button>
              <el-button id="stateBtn" :disabled="scope.row.isAdmin" title="锁定" size="mini"
                         @click="editState(scope.$index, scope.row)"><i class="el-icon-sold-out"></i>
              </el-button>
              <el-button id="removeBtn" :disabled="scope.row.isAdmin" title="移除" size="mini"
                         @click="removeUser(scope.$index, scope.row)"><i class="el-icon-remove"></i>
              </el-button>
              <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisible">
                <el-form :model="userInfo">
                  <el-form-item label="手机号码">
                    <el-input v-model="userInfo.mobile" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="用户姓名">
                    <el-input v-model="userInfo.realName"></el-input>
                  </el-form-item>
                  <el-form-item label="用户职位">
                    <el-select class="input" v-model="selectUserPosition" clearable placeholder="请选择职位">
                      <el-option
                        v-for="item in userPosition"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                  <el-button @click="dialogFormVisible = false">取 消</el-button>
                  <el-button type="primary" @click="editUserInfo">确 定</el-button>
                </div>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!--<div class="pagination-page">-->
      <!--<el-pagination layout="prev, pager, next" :total="pageTotal">-->
      <!--</el-pagination>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: "userManage",
    data() {
      return {
        activeName: 'first',
        name: 'userManage',
        selectUserName: '',
        selectMobile: '',
        selectUserState: '',
        stateOption: [{
          value: '1',
          label: '可用'
        }, {
          value: '0',
          label: '禁用'
        }],
        pageTotal: 100,
        userStatus: true,
        userList: [],
        // 新增开关
        addShow: false,
        showIcon: 'el-icon-plus',
        addMobile: '',
        inviteLink: '',
        btnType: '生成链接',
        userData: {},
        userId: this.$cookie.get("userId"),
        rootUserId: '',
        dialogFormVisible: false,
        userInfo: {},
        inviteNum: 0,
        useNum: 0,
        inviteTotal: 5,
        userPosition: [],
        selectUserPosition: ''
      }
    },
    created() {
      this.resetInviteLink()
      if (this.$cookie.get('userInfo')) {
        this.userData = window.JSON.parse(this.$cookie.get('userInfo'));
        console.log("用户信息-------------------", this.userData)
        if (this.userData.companyId === null || this.userData.companyId === '') {
          this.$message({showClose: true, type: 'error', message: '非企业用户，请先开通'})
          this.$router.push('/manage/account')
        } else if (!this.userData.enableState) {
          this.$message({showClose: true, type: 'error', message: '当前企业已被禁用'})
          this.$router.push('/manage/account')
        } else if (!this.userData.state) {
          this.$message({showClose: true, type: 'error', message: '您已被管理员禁用'})
          this.$router.push('/manage/account')
        } else {
          this.getByCompanyId()
          this.getUserList()
          this.checkInvitedUserLimit()
        }
      }

      console.log("", this.userData.companyId)
      console.log("", this.userId)
      console.log("", this.userData.userName)
    },
    methods: {
      // 通过公司id获取公司信息
      getByCompanyId() {
        this.$http({
          method: 'GET',
          url: this.$api.manage.getByCompanyId,
          params: {
            companyId: this.userData.companyId
          }
        }).then((res) => {
          console.log("获取公司信息", res.data)
          if (res.data.returnCode === 1) {
            this.inviteTotal = res.data.returnObject.userLimit
            this.rootUserId = res.data.returnObject.rootUserId;
            if (this.rootUserId !== this.userId) {
              this.$message({showClose: true, type: 'error', message: '非管理员！'})
              this.$router.push('/manage/account')
            }
          }
        })
      },
      // 获取企业用户
      getUserList() {
        let params = {
          companyId: this.userData.companyId,
          jobStatus: '',
          mobile: this.selectMobile,
          realName: this.selectUserName,
          state: this.selectUserState,
          // status: this.selectUserState,
          userName: ''
        }
        this.$http({
          method: 'POST',
          url: this.$api.manage.listUserByCompanyId,
          data: params
        }).then((res) => {
          console.log("res---------", res.data);
          this.useNum = 0
          if (res.data.returnCode === 1) {
            this.userList = res.data.returnObject;
            this.userList.forEach((item) => {
              if (item.lastLoginDate) {
                item.lastLoginDate = this.formatDateTime(item.lastLoginDate)
              }
              item.enterpriseTime = this.fmtDate(item.enterpriseTime)
              item.userState = '禁用';
              item.userJobStatus = '离任';
              item.realNameShow = item.realName;
              if (item.state) {
                item.userState = '可用';
                this.useNum += 1
              }
              if (item.jobStatus) {
                item.userJobStatus = '现任';
              }
              item.isAdmin = false
              if (item.id == this.rootUserId) {
                item.isAdmin = true
                item.realNameShow = item.realName + ' 【管】'
              }
            })
            console.log(this.userList)
          }
        })
      },
      formatDateTime: function (inputTime) {
        var date = new Date(inputTime);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
      },
      fmtDate(obj) {
        var date = new Date(obj);
        var y = 1900 + date.getYear();
        var m = "0" + (date.getMonth() + 1);
        var d = "0" + date.getDate();
        return y + "-" + m.substring(m.length - 2, m.length) + "-" + d.substring(d.length - 2, d.length);
      },
      // 编辑用户真实姓名
      editRealName(index, row) {
        console.log('32423', index, row);
        this.dialogFormVisible = true;
        this.userInfo = row;
        this.getPosition()
      },
      // 获取职位信息
      getPosition() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getPosition,
          params: {}
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.userPosition = res.data.returnObject
            this.selectUserPosition = this.userInfo.position
          }
        })
      },
      // 编辑用户信息
      editUserInfo() {
        console.log("selectUserPosition", this.selectUserPosition)
        let positions = this.selectUserPosition

        if (this.selectUserPosition.indexOf('-', 0) == -1) {
          positions = ''
        }
        console.log("positions", positions)
        this.$http({
          method: 'POST',
          url: this.$api.manage.updateUserInfo,
          params: {
            realName: this.userInfo.realName,
            userId: this.userInfo.id,
            position: positions
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.dialogFormVisible = false
            this.getUserList()
          }
        })
      },
      // 编辑用户锁定
      removeUser(index, row) {
        console.log(index, row);
        let data = row
        this.$http({
          method: 'POST',
          url: this.$api.manage.removeUser,
          params: {
            companyId: this.userData.companyId,
            userId: data.id
          }
        }).then((res) => {
          if (res.data.returnCode === 1) {
            this.getUserList()
            this.$message({showClose: true, message: '该用户已被移除！', type: 'success'})
          } else {
            this.$message({showClose: true, message: 'error', type: 'error'})
          }
        })
      },
      // 禁用用户
      editState(index, row) {
        let data = row
        this.$http({
          method: 'POST',
          url: this.$api.manage.cancelUser,
          params: {
            companyId: this.userData.companyId,
            userId: data.id
          }
        }).then((res) => {
          console.log("companyId", this.userData.companyId)
          console.log("userId", data.id)
          console.log("info", res.data)
          if (res.data.returnCode === 1) {
            this.getUserList()
            this.$message({showClose: true, message: '该用户已被禁用！', type: 'success'})
          } else {
            this.$message({showClose: true, message: 'error', type: 'error'})
          }
        })
      },
      // 新增
      addUser() {
        // this.addShow ? this.addShow = false : this.addShow = true;
        if (this.addShow) {
          this.showIcon = 'el-icon-plus';
          this.addShow = false
        } else {
          this.showIcon = 'el-icon-arrow-down';
          this.addShow = true;
        }
      },
      // 获取该公司可邀请人数
      checkInvitedUserLimit() {
        this.$http({
          method: 'GET',
          url: this.$api.manage.checkInvitedUserLimit,
          params: {
            companyId: this.userData.companyId,
            number: this.inviteTotal
          }
        }).then((res) => {
          console.log("可用用户数量", res.data)
          if (res.data.returnCode === 1) {
            this.inviteNum = res.data.returnObject
            console.log("inviteNum--------", this.inviteNum)
          }
        })
      },
      // 生成链接---校验手机号
      makeLink() {
        if (this.btnType === '生成链接') {
          if (this.addMobile === '') {
            this.$message({
              showClose: true,
              message: '手机号为空',
              type: 'error'
            })
          } else {
            if (!this.$regx.telphone(this.addMobile)) {
              this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写正确的手机号'})
              return false
            }
            if (this.inviteNum == 0 || this.inviteNum < 0) {
              this.$message({showClose: true, type: 'warning', duration: 3000, message: '邀请数量和用户数量已上限！请勿频繁操作'})
              return false
            }
            this.$http({
              method: 'GET',
              url: this.$api.manage.checkMobileExist,
              params: {
                companyId: this.userData.companyId,
                mobile: this.addMobile
              }
            }).then((res) => {
              console.log("生成链接接口返回-------", res.data);
              // 0:已被邀请,1:未被邀请;2:已加入该企业;3:该用户已加入其它企业
              if (res.data.returnCode === 1) {
                // 生成邀请链接
                this.makeLinkAll()
              } else if (res.data.returnCode === 0) {
                this.$message({
                  showClose: true,
                  message: '该手机号已被邀请',
                  type: 'error'
                })
              } else if (res.data.returnCode === 2) {
                this.$message({
                  showClose: true,
                  message: '该用户已加入该企业',
                  type: 'error'
                })
              } else if (res.data.returnCode === 3) {
                this.$message({
                  showClose: true,
                  message: '该用户已加入其它企业',
                  type: 'error'
                })
              }
            })

          }
        } else {
          this.$message({
            showClose: true,
            message: '复制邀请链接成功！',
            type: 'success'
          })
        }
      },
      // 生成邀请链接
      makeLinkAll() {
        this.$http({
          method: 'GET',
          url: this.$api.manage.generateInvitationUrl,
          params: {
            companyId: this.userData.companyId,
            mobile: this.addMobile,
            adminUserId: this.userId,
            adminUserName: this.userData.userName
          }
        }).then((res) => {
          console.log("生成邀请链接：", res.data)
          if (res.data.returnCode === 1) {
            this.inviteLink = res.data.returnObject;
            // this.inviteLink = this.$api.host + res.data.returnObject;
            this.btnType = '复制链接';
            this.$message({
              showClose: true,
              message: '链接生成成功，有效期3天',
              type: 'success'
            })
          } else {
            this.$message({
              showClose: true,
              message: '生成失败',
              type: 'error'
            })
          }
        })
      },
      // 邀请链接重置
      resetInviteLink() {
        this.inviteLink = '';
        this.btnType = '生成链接';
      }
    }
  }
</script>

<style lang="scss">
  #userManage {
    min-height: 800px;
    .el-tabs__item {
      font-size: 16px;
    }
    .userMsg-head {
      ul {
        display: flex;
        cursor: default;
        li {
          cursor: default;
          flex: 1;
          margin-right: 12px;
          margin-top: 12px;
          &:last-child {
            margin-right: 0;
          }
          .input {
            width: 100%;
            .el-input {
              width: 100%;
            }
          }
          &.checkStatus {
            text-align: right;
          }
        }
      }
    }
    .table-title {
      height: 40px;
      .rightSpan {
        margin-left: 19%;
        color: darkgray;
        font-size: 15px;
      }
      .leftSpan {
        color: darkgray;
        font-size: 15px;
      }
      .numSpan {
        margin-left: 5%;
      }
      .add-button {
        margin-left: 572px;
      }
    }
    .table-content {
      min-height: 520px;
      .demo-table-expand {
        font-size: 0;
      }
      .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
      }
      .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
      }
      .el-table th {
        background-color: #969896;
      }
      .el-table thead {
        color: #fffdef;
      }
    }
    /*// 分页*/
    /*.pagination-page {*/
    /*margin: 20px 0;*/
    /*text-align: center;*/
    /*}*/
    .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
    .el-col {
      border-radius: 4px;
    }
    .bg-purple-dark {
      background: #99a9bf;
    }
    .bg-purple {
      background: #d3dce6;
    }
    .bg-purple-light {
      background: #e5e9f2;
    }
    .grid-content {
      border-radius: 4px;
      min-height: 100px;
    }
    .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
    }
    .el-input {
      width: 200px;
    }
    .div-add-user {
      min-height: 200px;
      text-align: center;
      /*background-color: #63a35c;*/
      position: relative;
      .el-card {
        height: 110px;
        width: 70%;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        ul {
          display: flex;
          cursor: default;
          li {
            flex: 1;
            margin-right: 12px;
            margin-top: 12px;
            cursor: default;
            &:last-child {
              margin-right: 0;
            }
            &.link-input {
              flex: 0 0 60%;
            }
            .link-in {
              width: 100%;
            }
          }
        }
      }
    }
  }

</style>
