<template>
  <section id="members-invite">
    <header>
      <h4 class="card-title">邀请好友加入信公企业版</h4>
    </header>
    <el-form :model="inviteForm" ref="inviteForm">
      <el-row :gutter="10" class="input-hint">
        <el-col :span="6">好友手机号</el-col>
        <el-col :span="6">好友用户名</el-col>
        <el-col :span="6">好友邮箱</el-col>
      </el-row>
      <el-row :gutter="10" v-for="(user, index) in inviteForm.inviteInfoList" key="index">
        <el-col :span="6">
          <el-form-item :prop="'inviteInfoList.' + index + '.mobile'" :rules="{validator:mobileValidate, trigger: ['blur','change']}">
            <el-input v-model="user.mobile" size="mini" placeholder="11位手机号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :prop="'inviteInfoList.' + index + '.userName'">
            <el-input v-model="user.userName" size="mini" placeholder="用于邮件使用名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :prop="'inviteInfoList.' + index + '.email'" :rules="{validator:emailValidate, trigger: ['blur','change']}">
            <el-input v-model="user.email" size="mini" placeholder="name@example.com"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-form-item>
            <el-button @click.prevent="removeInviteUser(user)" size="mini" v-if="inviteForm.inviteInfoList.length>1">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-button type="text" @click="addInviteUser" class="add-btn"> + 添加一位好友</el-button>
        </el-col>
        <el-col :span="6" style="text-align:right">
          <el-button type="primary" @click="sendInvatation" size="mini">发送邀请</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="divider"></div>
    <div class="invite-box">
      <el-row :gutter="10">
        <el-col :span="20">
          <p>您也可以通过向好友发送邀请链接邀请他加入小安！<span class="small">点击更新共享链接后，原共享链接失效</span></p>
        </el-col>
        <el-col :span="4">
          <p>
            <el-button type="text" @click="refreshLink" size="small"><i class="el-icon-refresh"></i> 更新</el-button>
          </p>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="20">
          <el-input v-model="inviteLink" readonly size="small"></el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :data-clipboard-text="inviteLink" @click="copyInviteLink" size="small" class="copy-btn">复制链接</el-button>
        </el-col>
      </el-row>
    </div>
  </section>
</template>
<script>
import Clipboard from 'clipboard';
export default {
  name: "members-invite",
  data() {
    return {
      userInfo: {},
      companyInfo: {},
      inviteLink: '',
      inviteForm: {
        inviteInfoList: [{
          mobile: '',
          userName: '',
          email: ''
        }]
      }
    }
  },
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
    this.getCompanyInfo();
    this.getInvitationUrl();
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
    mobileValidate(rule, value, callback) {
      if (value === '') {
        callback(new Error('手机号不能为空'));
      }
      if (!this.$regx.telphone(value)) {
        callback(new Error('请输入合法的手机号'));
      }
      callback();
    },
    emailValidate(rule, value, callback) {
      if (value === '') {
        callback(new Error('邮箱不能为空'));
      }
      if (!this.$regx.mail(value)) {
        callback(new Error('请输入合法的邮箱'));
      }
      callback();
    },
    removeInviteUser(user) {
      if (this.inviteForm.inviteInfoList.length === 1) {
        return;
      }
      let index = this.inviteForm.inviteInfoList.indexOf(user);
      if (index !== -1) {
        this.inviteForm.inviteInfoList.splice(index, 1);
      }
    },
    addInviteUser() {
      if (this.companyInfo.inviteCount > this.inviteForm.inviteInfoList.length) {
        this.inviteForm.inviteInfoList.push({
          mobile: '',
          userName: '',
          email: ''
        });
      } else {
        this.$message({
          type: "error",
          message: `剩余可邀请人数已满`
        });
      }
    },
    getInvitationUrl() {
      this.$http({
        method: "POST",
        url: this.$api.manage.getInvitationUrl,
        params: {
          companyId: this.userInfo.companyId,
          userId: this.userInfo.id
        }
      }).then(res => {
        if (res.data.returnCode == 1 || res.data.returnCode == 200) {
          this.inviteLink = location.protocol + '//' + location.host + '/index?inviteCode=' + res.data.returnObject;
        }
      }).catch(err => {});
    },
    refreshLink() {
      this.$http({
        method: "POST",
        url: this.$api.manage.generateInvitationUrl,
        params: {
          companyId: this.userInfo.companyId,
          userId: this.userInfo.id
        }
      }).then(res => {
        if (res.data.returnCode == 1 || res.data.returnCode == 200) {
          this.$message({
            type: "success",
            message: '邀请链接已更新'
          });
          this.inviteLink = location.protocol + '//' + location.host + '/index?inviteCode=' + res.data.returnObject;
        }
      }).catch(err => {});
    },
    copyInviteLink() {
      const clipboard = new Clipboard('.copy-btn')
      clipboard.on('success', () => {
        this.$message({ type: 'success', message: '复制成功！快去分享吧' });
        clipboard.destroy();
      });
    },
    sendInvatation() {
      this.$refs['inviteForm'].validate(valid => {
        if (valid) {
          this.$http({
            method: "POST",
            url: this.$api.manage.inviteUsers,
            data: {
              companyId: this.userInfo.companyId,
              userId: this.userInfo.id,
              inviteInfoList: this.inviteForm.inviteInfoList
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.$message({
                type: "success",
                message: '已发送邀请'
              });
            } else if (res.data.returnCode == 400) {
              this.$message({
                type: "error",
                message: '邀请人数已达上限'
              });
            } else if (res.data.returnCode == 406) {
              this.$message({
                type: "error",
                message: '请勿重复邀请'
              });
            } else {
              this.$message({
                type: "error",
                message: '邀请失败'
              });
            }
          }).catch(err => {
            this.$message({
              type: "error",
              message: '邀请失败'
            });
          });
        }
      });
    }
  }
}
</script>
<style lang="scss">
#members-invite {
  .input-hint {
    text-align: center;
    font-size: 14px;
  }
  .add-btn {
    text-decoration: underline;
  }
  .divider {
    width: 100%;
    height: 0;
    border-bottom: solid 1px #ebeef5;
    padding: 10px 0;
  }
  .invite-box {
    p {
      padding: 10px 0;
      font-size: 14px;
      line-height: 30px;
      .small {
        font-size: 12px;
        color: #8d8d8d;
      }
      .el-button {
        padding: 0;
        margin: 0;
      }
    }
  }
}
</style>
