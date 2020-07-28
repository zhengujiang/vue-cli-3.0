<template>
  <div id="endInfo">
    <div class="contentBottom">
      <div class="choose message">
        <span></span><span>后续信息</span><span></span>
      </div>
      <p class="message-box">若参加线下活动有后续信息，比如时间地点，若没有参加线下比赛则没有此板块</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: "endInfo",
    components: {
    }
  }
</script>

<style lang="scss">
  #endInfo {
    width: 897px;
    .choose {
      color: #FFFFFF;
      font-size: 16px;
      width: 183px;
      text-align: center;
      margin: 0 auto 5px;
      clear: both;
      height: 25px;
      span {
        display: block;
        float: left;
        width: 95px;
        font-weight:600;
      }
      span:first-child, span:last-child {
        height: 2px;
        background: #F7CE35;
        width: 44px;
        margin-top: 10px;
      }
    }
    .contentBottom {
      clear: both;
      width: 100%;
      height: 150px;
      border:1px solid rgba(84,84,84,1);
      border-radius:4px;
      .message {
        margin: 20px auto 10px;
      }
      .message-box {
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        padding-left: 18px;
      }
    }
  }
</style>
