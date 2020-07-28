<template>
  <section id="members-manage">
    <header>
      <h4 class="card-title">成员管理 <span class="small">成员数：{{companyInfo.userCount}}/{{companyInfo.userLimit}}，剩余 <span style="color:#ffb184;">{{companyInfo.inviteCount}}</span> 个成员可邀请</span></h4>
    </header>
    <el-table :data="userList" v-if="userList.length>0" border stripe size="small">
      <el-table-column prop="mobile" label="手机" width="110px">
      </el-table-column>
      <el-table-column label="用户名" show-overflow-tooltip width="160px">
        <template slot-scope="scope">
          <span v-if="scope.row.realName">{{scope.row.userName}}({{scope.row.realName}})</span>
          <span v-else>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="角色" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.id == userInfo.rootUserId">管理员</span>
          <span v-else>用户</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="账号状态" width="100px">
        <template slot-scope="scope">
          <span v-if="scope.row.companyInviteState===null">可用</span>
          <span v-if="scope.row.companyInviteState===0">待确认</span>
          <span v-if="scope.row.companyInviteState===1">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="登录状态">
        <template slot-scope="scope">
          <template v-if="scope.row.realName">
            <span>登录次数：{{scope.row.loginCount}}次;</span>
            <span>上次登录：{{$common.transTime(scope.row.lastLoginDate)[2]}}</span>
          </template>
          <span v-else>暂无记录</span>
        </template>
      </el-table-column>
      <!--       <el-table-column prop="email" label="邮箱" show-overflow-tooltip width="160px">
      </el-table-column> -->
      <el-table-column label="操作" width="100px">
        <template slot-scope="scope">
          <el-button type="text" class="change-btn" v-if="scope.row.companyInviteState===null && scope.row.id != userInfo.id" @click="changeCompanyAdmin(scope.row,scope.$index)"><i class="iconfont web-gerenzhongxin"></i></el-button>
          <el-button type="text" class="delete-btn" @click="removeUser(scope.row,scope.$index)" v-if="scope.row.id != userInfo.id"><i class="iconfont web-shanchu"></i></el-button>
        </template>
      </el-table-column>
    </el-table>
    <verification v-if="isVisible" :isVisible='isVisible' :type='type' @cancel="closeVerifiDialog"  @check="handleCheck" @sent="handleSent" title="请输入验证码"></verification>
  </section>
</template>
<script>
import verification from "@/components/verification";
export default {
  components: { verification },
  name: "manage",
  data() {
    return {
      userInfo: {},
      companyInfo: {},
      userList: [],
      isVisible: false,
      smsDialogVisible: false,
      smsCode: "",
      row: {},
      type: ""
    };
  },
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
    if (!this.userInfo.root) {
      this.$router.push("/manage/account");
    }
    this.listUserByCompanyId();
    this.getCompanyInfo();
  },
  methods: {
    getCompanyInfo() {
      this.$http({
        url: this.$api.manage.getByCompanyId,
        method: "GET",
        params: {
          companyId: this.userInfo.companyId
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.companyInfo = res.data.returnObject;
        }
      });
    },
    listUserByCompanyId() {
      this.$http({
        url: this.$api.manage.listUserByCompanyId,
        method: "POST",
        data: {
          companyId: this.userInfo.companyId
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.userList = res.data.returnObject;
        }
      });
    },
    removeUser(row, index) {
      this.row = row;
      this.type = "remove";
      this.$confirm("此操作将永久移除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (row.companyInviteState === null) {
            this.isVisible = true;
          } else {
            this.$http({
              url: this.$api.manage.deleteInvite,
              method: "delete",
              params: {
                userId: this.$cookie.get("userId"),
                companyId: this.userInfo.companyId,
                mobile: this.row.mobile
              }
            })
              .then(res => {
                if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                  this.listUserByCompanyId();
                  this.isVisible = false
                  this.getCompanyInfo();
                  this.$message({
                    type: "success",
                    showClose: true,
                    message: "移除成功!"
                  });
                } else {
                  this.$message({
                    type: "error",
                    showClose: true,
                    message: "移除失败"
                  });
                }
              })
              .catch(err => {});
          }
        })
        .catch(() => {});
    },
    changeCompanyAdmin(row, index) {
      this.row = row;
      this.type = "change";
      this.$confirm("此操作将永久移交管理权限给该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isVisible = true;
        })
        .catch(err => {});
    },
    closeVerifiDialog(e) {
      this.isVisible = false;
    },

    handleCheck(e) {
      let row = this.row;
      console.log("check:", e);
      if (e.type == "remove") {
        // 移除已存在用户
        if (row.companyInviteState === null) {
          this.$http({
            url: this.$api.manage.removeUser,
            method: "post",
            params: {
              removeUserId: this.row.id,
              companyId: this.userInfo.companyId,
              code: e.code,
              userId: this.userInfo.id
            }
          })
            .then(res => {
              if (res.data.returnCode == 200 || res.data.returnCode == 1) {
                this.listUserByCompanyId();
                this.getCompanyInfo();
                  this.isVisible = false
                this.$message({
                  type: "success",
                  showClose: true,
                  message: "移除成功!"
                });
              } else {
                this.$message({
                  type: "error",
                  showClose: true,
                  message: "移除失败"
                });
              }
            })
            .catch(err => {});
        } else {
          // 移除邀请用户
        }
      } else if (e.type == "change") {
        this.$http({
          url: this.$api.enterpriseCompany.changeCompanyAdmin,
          method: "post",
          params: {
            userId: this.userInfo.id,
            companyId: this.userInfo.companyId,
            moveUserId: row.id,
            code: e.code
          }
        })
          .then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.listUserByCompanyId();
              this.getCompanyInfo();
              this.$message({
                type: "success",
                showClose: true,
                message: "移交成功!"
              });
              this.isVisible = false;
              this.$auth.reSetUserStore(this);
              setTimeout(() => {
                this.$router.replace("/manage/changeCompany");
              }, 500);
            } else {
              this.$message({
                type: "error",
                showClose: true,
                message: "移交失败"
              });
            }
          })
          .catch(err => {});
      }
    },
    handleSent(e) {
      console.log("sent:", e);
      if (e == "remove") {
        this.sendRemoveMemberSms(this.row);
      } else if (e == "change") {
        this.sendTransferAdminSms(this.row);
      }
    },
    sendRemoveMemberSms(row) {
      this.$http({
        url: this.$api.enterpriseCompany.sendRemoveMemberSms,
        method: "post",
        params: {
          userId: this.userInfo.id,
          companyName: this.companyInfo.companyFullName,
          removeUserId: row.id
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.$message({
            type: "success",
            showClose: true,
            message: "验证码已发送"
          });
        } else {
          this.$message({
            type: "warning",
            showClose: true,
            message: "手机号不存在，请重试"
          });
        }
      });
    },
    sendTransferAdminSms(row) {
      this.$http({
        url: this.$api.enterpriseCompany.sendTransferAdminSms,
        method: "post",
        params: {
          userId: this.userInfo.id,
          companyName: this.companyInfo.companyFullName
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.$message({
            type: "success",
            message: "验证码已发送"
          });
        } else {
          this.$message({
            type: "warning",
            message: "手机号不存在，请重试"
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
#members-manage {
  .card-title .small {
    font-size: 12px;
    margin-left: 10px;
    color: #8d8d8d;
  }
  .delete-btn {
    padding: 4px;
    background: #fff3df;
  }
  .change-btn {
    padding: 4px;
    background: #eaeeff;
    color: #738bff;
  }
}
</style>
