<template>
  <div id="verification">
    <el-dialog
      :title="title"
      :visible.sync="isVisible"
      width="30%"
      :before-close="handleClose">
      <el-form  ref="form" label-width="80px">
        <!-- <el-form-item label="手机号">
          <el-input v-model="phone" id="txtbindMobile" :placeholder="phonePlaceholder" type.number="text" size="small"></el-input>
        </el-form-item> -->
        <el-form-item label="验证码">
          <el-input v-model="verifiCode" :disabled="!isSent" placeholder="填写验证码" type.number="text" size="small"></el-input>
        </el-form-item>
        <el-form-item label="">
           <el-button size="small" :disabled="!!(btnText !== '获取验证码')" @click.once="getCode">{{btnText}}</el-button>
        </el-form-item>
      </el-form>
      
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="checkCode" :disabled="!!!verifiCode">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      verifiCode: "",
      phonePlaceholder: "请输入手机号",
      phone: "",
      isSent: false,
      btnText: "获取验证码",
      getCodeTime: 0
    };
  },
  props: {
    type: {
      default: "",
      type: String
    },
    title: {
      default: "验证码",
      type: String
    },
    isVisible: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    handleClose() {
      this.$emit("cancel");
      return false;
    },
    checkPhone() {
      let bindMobileregx = !this.$regx.telphone(this.phone);
      if (bindMobileregx) {
        console.log("bind", bindMobileregx);
        document.querySelector("#txtbindMobile").focus();
        this.phonePlaceholder = "请填写正确手机号";
        this.$message({
          showClose: true,
          type: "warning",
          message: "请填写正确手机号"
        });
        return false;
      } else {
        console.log("get");
        this.getCode();
      }
    },
    getCode() {
      console.log("get");
      this.getCodeTime = 60;
      this.codeTime();
      this.isSent = true;
      this.$emit("sent", this.type);
    },
    codeTime() {
      setTimeout(() => {
        this.getCodeTime--;
        if (this.getCodeTime > 0) {
          this.btnText = `${this.getCodeTime}秒后重试`;
          this.codeTime();
        } else {
          this.btnText = "获取验证码";
        }
      }, 1000);
    },
    sendsmscode() {
      if (this.getCodeTime <= 0) {
        let mobile_regx = !this.$regx.telphone(this.bindMobile);
        if (mobile_regx) {
          document.querySelector("#txtbindMobile").focus();
          return false;
        }
        this.$db.dataUser
          .sendsmscode(this, this.bindMobile, "modifyWx")
          .then(res => {
            if (res.data.returnCode === 1) {
              this.$message({
                showClose: true,
                type: "success",
                duration: 3000,
                message: "验证码发送成功"
              });
              this.getCodeTime = 60;
              this.codeTime();
            } else {
              this.$message({
                showClose: true,
                type: "error",
                duration: 3000,
                message: res.data.returnMsg
              });
              // this.bindSCodeTip = res.data.returnMsg
            }
          });
      }
    },
    checkCode() {
      this.$emit("check", { code: this.verifiCode, type: this.type });
    }
  }
};
</script>

<style>
</style>
