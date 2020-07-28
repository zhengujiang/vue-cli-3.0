<template>
  <div id="subscribe">
    <el-dialog id="addEvent-dialog" :visible.sync="dialogVisible" width="500px" center :before-close="handleClose">
      <div slot="title" class="title">请输入关键词</div>
      <div class="company-card-body">
        <div class="card-form-box">
          <div class="form-keyword-box">
            <div class="form-row">
              <input type="text" :placeholder="placeholder" v-model='keywordPopupText' id="popupText">
            </div>
            <div class="form-tips" v-if="textBool">{{text}}</div>
          </div>
          <div class="form-row">
            <div class="form-btn-box">
              <button class="form-btn form-btn-cancel" type="reset" @click="remove">取消</button>
              <button class="form-btn form-btn-submit" type="button" @click="submission">确定</button>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "keywordPopup",
    props: {
      value: {
        type: Boolean,
        default: false
      },
      // 包含的关键词
      keywordPopupArr: {
        type: Array
      },
      // 不包含关键词
      keywordPopupArrNo: {
        type: Array
      },
      roundString: '',
      keywordType: ''
    },
    data() {
      return {
        textBool: false,
        text: '* 请不要输入重复的关键词',
        dialogVisible: false,
        keywordPopupText: '',
        // 包含关键词
        keywordArr: '',
        // 不包含关键词
        keywordArrNo: '',
        types: '',
        placeholder: ""
      }
    },
    updated() {
      document.querySelector('#popupText').focus();
    },
    watch: {
      value(val) {
        this.dialogVisible = val;
      },
      roundString() {
        this.keywordPopupText = '';
        this.textBool = false;
        // 包含关键词
        this.keywordArr = this.keywordPopupArr;
        // 不包含关键词
        this.keywordArrNo = this.keywordPopupArrNo;
        this.types = this.keywordType;
        if (this.keywordType == 1) {
          this.placeholder = '请输入包含关键词';
        } else {
          this.placeholder = '请输入不包含关键词';
        }
      }
    },
    methods: {
      handleClose() {
        this.$emit('close', false);
      },
      remove() {
        this.$emit("close");
      },
      submission() {
        var _this = this;
        var bool = false;
        var val = this.keywordPopupText.replace(/\s*/g, "");
        if (val) {
          if (this.types == 1) {
            // 包含关键词
            for (var i = 0; i < this.keywordArr.length; i++) {
              if (this.keywordArr[i].name == val) {
                bool = true;
                continue;
              }
            }

          } else {
            // 不包含关键词
            for (var j = 0; j < this.keywordArrNo.length; j++) {
              if (this.keywordArrNo[j].name == val) {
                bool = true;
                continue;
              }
            }
          }

          if (bool) {
            this.textBool = true;
          } else {
            this.textBool = false;
            this.$emit("addKeyWordPopup", val, this.types);
          }

        } else {
          this.remove();
        }

      }
    }
  }
</script>

<style lang="scss" scoped>

  .title {width: 100%;height: 31px;margin: -9px auto;color: #FFB148;font-weight: 800;border-bottom: 1px solid #e3e3e3;}
  .form-row input {float: left;height: 34px;line-height: 34px;border-radius: 4px;border: 1px solid #E3E3E3;padding: 0 10px;margin: 3px 0;width: 100%;color: #000;}
  .card-form-box {
    .form-row {
      width: 100%;
      height: 40px;
    }
    .form-row-auto {
      width: 100%;
      height: auto;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .form-row label {
      float: left;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #323232;
      margin-left: 1px;
    }
    .form-row-auto label {
      line-height: 40px;
    }

    .form-tips {
      font-size: 12px;
      // color: #FFB148;
      color: red;
    }
  }
  .card-form-box .form-select-box {
    height: 40px;
    padding: 8px 0;
    margin-left: 90px;
    input {
      width: 120px;
      height: 24px;
      font-size: 14px;
      text-align: left;
    }
    i {
      position: relative;
      top: 18px;
    }
  }
  .form-row .form-btn-box {
    width: 326px;
    margin: 21px auto;
  }
  .form-btn-box {
    .form-btn {
      display: inline-block;
      width: 150px;
      height: 35px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 16px;
      text-align: center;
    }
    .form-btn-cancel {
      background: rgba(255, 177, 72, 0.3);
      color: #FFB148;
      border: 1px solid #FFB148;
      margin-right: 20px;
    }
    .form-btn-submit {
      background: #FFB148;
      color: #FFF;
      border: 1px solid #FFB148;
    }
  }

</style>

<style lang="scss">
  #subscribe .el-dialog--center {margin-top: 35vh !important;}
  #subscribe .el-dialog__headerbtn {top: 15px;}
</style>
