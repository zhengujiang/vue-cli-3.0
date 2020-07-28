<template>
  <div id="editQuestion">
    <div class="content">
      <div class="title">
        <p>问券名称</p>
        <el-button>编辑</el-button>
      </div>
      <div class="contain">
        <div class="subject">
          <p class="quesTitle">
            1、以下哪些功能是你经常用到的？<span>[多选题]</span>
          </p>
          <el-checkbox-group v-model="checked">
            <el-checkbox v-for="(item, index) in 6" :key="index" label="权限速查表"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="subject">
          <p class="quesTitle">
            1、以下哪些功能是你经常用到的？<span>[多选题]</span>
          </p>
          <el-checkbox-group v-model="checked">
            <el-checkbox v-for="(item, index) in 6" :key="index" label="权限速查表"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="subject">
          <p class="quesTitle">
            1、以下哪些功能是你经常用到的？<span>[多选题]</span>
          </p>
          <el-checkbox-group v-model="checked">
            <el-checkbox v-for="(item, index) in 6" :key="index" label="权限速查表"></el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="subject">
          <p class="quesTitle">
            1、以下哪些功能是你经常用到的？<span>[多选题]</span>
          </p>
          <el-checkbox-group v-model="checked">
            <el-checkbox v-for="(item, index) in 6" :key="index" label="权限速查表"></el-checkbox>
          </el-checkbox-group>
        </div>
         <div class="subject">
          <p class="quesTitle">
            9、写下您认为重要的意见或建议？
          </p>
          <el-input type="textarea" placeholder="在此键入文字 …" v-model="textarea" resize="none"></el-input>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "editQuestion",
    data() {
      return {
        checked: ["权限速查表"],
        textarea:''
      }
    },
    created() {
    },
    methods: {
      handleChange(val) {
        console.log(val);
      },
      preview() {
        
      }
    }
  }
</script>

<style lang="scss">
  #editQuestion {
    padding: 16px 0;
    .content {
      width: 1200px;
      padding-left: 15px;
      padding: 0 16px;
      background-color: #fff;
      .title {
        height: 45px;
        border-bottom: 1px solid #E3E3E3;
        display: flex;
        justify-content: space-between;
        p {
          margin-top: 12px;
          width: 64px;
          font-size:16px;
          font-family:PingFangSC-Semibold;
          font-weight:600;
          color:rgba(50,50,50,1);
          line-height:22px;
          }
        .el-button {
          margin-top: 9px;
          padding: 0;
          width:64px;
          height:28px;
          border: none;
          background:rgba(255,177,72,1);
          border-radius:4px;
          span {
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(255,255,255,1);
          }
        }
      }
      .contain {
        padding-top: 24px;
        padding-bottom: 36px;
        .subject {
          padding-left: 116px;
          margin-bottom: 24px;
          .quesTitle {
            font-size:16px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
            margin-bottom: 16px;
            span {
              color: #FFB148;
              margin-right: 26px;
            }
            .el-button {
              width: 50px;
              font-size:14px;
              color:rgba(84,84,84,1);
              height: 20px;
              span {
                color:rgba(84,84,84,1);
              }
            }
          }
          .el-checkbox-group, .el-radio-group {
            margin-left: 26px;
            .el-checkbox, .el-radio {
              display: block;
              margin-bottom: 8px;
              margin-left: 0;
              .el-checkbox__label, .el-radio__label {
                font-size: 16px;
                font-family: PingFangSC-Regular;
                font-weight: 400;
                color: rgba(50, 50, 50, 1);
                line-height: 22px;
              }
            }
            .el-checkbox:last-child, .el-radio:last-child {
              margin: 0;
            }
          }
          .el-textarea {
            margin-left: 26px;
            .el-textarea__inner {
              width:904px;
              height:114px;
              background:rgba(246,246,246,1);
              border-radius:2px;
              border:1px solid rgba(227,227,227,1);
            }
          }
        }
      }
    }
  }
</style>
