<template>
  <div id="inviteUserManage">
    <!--<el-button type="text" @click="dialogTableVisible = true">打开嵌套表格的 Dialog</el-button>-->
    <el-dialog title="您收到了一条企业邀请" :visible.sync="dialogTableVisible" width="840px" class="dialog-div" cloes>
        <div class="invite-title">
          <strong style="font-size: 18px">{{inviteFrom}}  邀请您加入信公小安企业版：</strong>
        </div>
        <div class="invite-content">
          <el-row :gutter="20">
            <el-col :span="6">
              <img class="img-div" src="http://oss.in-hope.cn/logo/xinhu.jpg" width="160px" height="160px"/>
            </el-col>
            <el-col :span="18">
              <span class="text-style">{{companyName}}</span>
            </el-col>
          </el-row>
        </div>
        <div class="invite-btn">
          <a class="btn-cancel" @click="cancel">拒绝</a>
          <el-button type="primary" class="btn-save" @click="save">接受</el-button>
        </div>
    </el-dialog>


  </div>
</template>

<script>
  export default {
    name: "inviteUserManage",
    data() {
      return {
        inviteFrom: '',
        dialogTableVisible: true,
        companyName: '',
        invite: ''
      }
    },
    created() {
      let url = document.URL;
      if (url.indexOf("invite=", 0) == -1) {
        this.dialogTableVisible = false
        this.$message({showClose: true, type: 'error', duration: 3000, message: '无效的邀请链接'})
      } else {
        let invites = url.substring(url.indexOf("invite=", 0) + 7)
        this.invite = invites
        console.log("invite", invites)
        this.getInfo()
      }

    },
    methods: {

      // 显示邀请信息
      getInfo() {
        this.$http({
          method: 'GET',
          url: this.$api.manage.getCompanyInfoFromInviteLink,
          params: {
            inviteLink: this.invite
          }
        }).then((res) => {
          console.log("获取邀请信息", res.data)
          if (res.data.returnCode === 1) {
            this.inviteFrom = res.data.returnObject.adminUserName
            this.companyName = res.data.returnObject.companyFullName
          } else {
            this.$message({showClose: true, type: 'error', message: res.data.returnMsg})
          }

        })
      },
      // 接受邀请
      save() {
        this.$http({
          method: 'POST',
          url: this.$api.manage.acceptInvited,
          params: {
            invite: this.invite
          }
        }).then((res) => {
          console.log("111", res.data)
          if (res.data.returnCode === 1) {
            this.$message({showClose: true, type: 'success', message: '您已成功加入该企业'})
            this.$router.push('/dashboard')
          } else {
            this.$message({showClose: true, type: 'error', message: res.data.returnMsg})
            this.$router.push('/manage/account')
          }

        })
        this.dialogTableVisible = false;
      },

      // 拒绝邀请
      cancel() {
        this.$http({
          method: 'POST',
          url: this.$api.manage.cancelInvited,
          params: {
            invite: this.invite
          }
        }).then((res) => {
          console.log("取消邀请", res.data)
          if (res.data.returnCode === 1) {
            this.$message({showClose: true, type: 'success', message: '取消成功'})
          } else {
            this.$message({showClose: true, type: 'error', message: res.data.returnMsg})
          }
          history.back(-1)
        })

      },

      close() {
        console.log("关闭：------------")
        window.close()
      }
    }
  }
</script>

<style lang="scss">
  #inviteUserManage {
    width: 840px;
    min-height: 700px;
      .invite-content {
        border: 1px solid moccasin;
        margin-top: 20px;
        width: 800px;
        height: 200px;
        background-color: rgba(255,253,237,0.95);
        .el-col {
          height: 180px;
          margin-top: 20px;
        }
        .img-div {
          margin-left: 20px;
        }
        .text-style {
          font-size: 38px;
          line-height: 1;
          color: lightslategrey;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
        }
      }
      .invite-btn {
        width: 800px;
        height: 50px;
        margin-top: 20px;
        .btn-cancel {
          cursor: pointer;
          margin-left: 668px;
        }
        .btn-save {
          margin-left: 30px;
        }
      }
  }
</style>
