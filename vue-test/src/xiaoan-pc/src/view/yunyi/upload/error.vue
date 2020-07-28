<template>
  <div id="error">
    <div class="errorInner">
      <img src="https://oss.in-hope.cn/xiaoan/web_static/header.jpg" alt="" class="backg">
      <div class="detail">
        <div class="errorInner">
          <img src="https://oss.in-hope.cn/xiaoan/web_static/error.png" alt="" class="errorImage">
          <div class="errorText">
            <p>系统正在升级维护，请稍后再试！</p>
            <p>给您带来不便，敬请谅解！</p>
            <a href="##">再试一次</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "error"
  }
</script>

<style scoped lang="scss">
  #error {
    width: 100%;
    background: rgba(246,246,246,1);
    padding-bottom: 55px;
    .errorInner {
      width: 1200px;
      margin: 0 auto;
      background: white;
      .backg {
        width:1200px;
        height:240px;
      }
      .detail {
        width: 1200px;
        height: 500px;
        border-radius: 2px;
        margin-top: 55px;
        .errorInner {
          .errorImage {
            width: 400px;
            height: 400px;
            float: left;
            display: block;
            margin-left: 130px;
          }
          .errorText {
            margin-top: 130px;
            float: left;
            p:first-child {
              font-size:32px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(50,50,50,1);
              line-height:45px;
              margin-bottom: 5px;
            }
            p:nth-child(2) {
              font-size:16px;
              font-family:PingFangSC-Light;
              font-weight:300;
              color:rgba(141,141,141,1);
              line-height:22px;
              margin-bottom: 32px;
            }
            a {
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(255,177,72,1);
              line-height:20px;
              text-decoration: underline;
            }
          }
        }
      }
    }

  }
</style>
