<template>
  <div id="business-test">
    <business-header title="董秘测试"></business-header>
    <div class="content">
        <el-card id="dongmiTest" :body-style="{ padding: '20px' }">
          <div class="img"></div>
          <div class="text-content">
            <p class="title">专业董秘才敢做的题!</p>
            <div class="hr"></div>
            <h3>活动详情</h3>
            <p class="text">{{content}}</p>
            <p class="text">{{content2}}</p>
            <div class="qrcode">

          </div>
          <span class="tip">扫描左侧二维码参与测试吧！</span>
          </div>

        </el-card>
    </div>
  </div>
</template>
<script>
import businessHeader from "./components/businessHeader";
import businessSection from "./components/businessSection";

export default {
  name: "business-test",
  components: {
    businessHeader,
    businessSection
  },
  data() {
    return {
      content:
        "本测试涵盖信息披露、公司治理、股票交易、发行、收购、重组等多个专业维度。完整填写注册信息后，系统将从题库中智能地挑选题型并调整难度，最终测评出董秘各个专业维度的能力，得出综合能力指数。",
      content2:
        "测试过程若意外中断，重新登录后可从中断部分继续答题。不论中断频次，系统不会停止计时，测试时长会直接影响综合能力指数，提醒注意答题时间。整难度，最终测评出董秘各个专业维度的能力，得出综合能力指数。"
    };
  }
};
</script>
<style lang="scss">
#business-test {
  background-color: #f6f6f6;
  .content {
    padding-bottom: 20px;
    #dongmiTest {
      margin: 0px auto;
      width: 1200px;
      height: 494px;
      .img {
        float: left;
        width: 520px;
        height: 430px;
        background-image: url("https://oss.in-hope.cn/xiaoan/web_static/business/test/dongmi.png");
        background-size: cover;
      }
      .text-content {
        float: right;
        margin-right: 30px;
        .title {
          font-size: 28px;
          color: #323232;
          font-weight: bolder;
        }
        .hr {
          width: 100%;
          height: 2px;
          background: #e3e3e3;
          margin: 10px 0px;
        }
        h3 {
          font-weight: bolder;
          margin: 15px 0px;
        }
        .text {
          font-size: 16px;
          color: #8d8d8d;
          width: 545px;
          margin-top: 10px;
          line-height: 26px;
        }
        .qrcode {
          margin-top: 15px;
          height: 130px;
          width: 130px;
          display: inline-block;
          background-image: url("https://oss.in-hope.cn/xiaoan/web_static/business/test/qrcode.png");
          background-size: cover;
        }
        .tip {
          color: #aeaeae;
          font-size: 16px;
          margin-left: 30px;
          margin-bottom: 30px;
        }
      }
    }
  }
}
</style>
