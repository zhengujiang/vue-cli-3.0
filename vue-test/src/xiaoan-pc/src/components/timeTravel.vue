<template>
  <div id="timeTravel">
    <div class="splitLine"></div>
    <div class="year">2017</div>
    <div class="timeNode">
      <div class="left">6.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果</div>
    </div>
    <div class="timeNode">
      <div class="left">11.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果自律组织监管结果自律组织监管结果</div>
    </div>
    <div class="timeNode">
      <div class="left">12.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果自律组织监管结果</div>
    </div>
    <div class="year">2016</div>
    <div class="timeNode">
      <div class="left">11.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果自果</div>
    </div>
    <div class="timeNode">
      <div class="left">1.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果织监管结果</div>
    </div>
    <div class="timeNode">
      <div class="left">11.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果自果</div>
    </div>
    <div class="timeNode">
      <div class="left">1.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果织监管结果</div>
    </div>
    <div class="timeNode">
      <div class="left">11.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果自果</div>
    </div>
    <div class="timeNode">
      <div class="left">1.13</div>
      <div class="circle">
        <div class="ccircle"></div>
      </div>
      <div class="right">自律组织监管结果织监管结果</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'timeTravel'
  }
</script>
<style lang="scss" scoped>
  #timeTravel {
    width: 100%;
    height: auto;
    position: relative;
    padding: 25px 0;
    .splitLine {
      position: absolute;
      left: 51px;
      top: 0;
      width: 1px;
      background-color: #e5e5e5;
      height: 100%;
      z-index: 1;
    }
    .year{
      margin-top: 10px;color:#ffb148;
    }
    .year:first-child{
      margin:0;
    }
    .timeNode {
      width: 100%;
      height: auto;
      overflow: hidden;
      display: -webkit-flex;
      display: flex;
      align-items: center;margin-top: 15px;
      .left, .circle, .right {
        line-height: normal;
      }
      .left {
        margin-right: 5px;min-width: 40px;
      }
      .right {
        margin-left: 10px;
      }
      .circle {
        border-radius: 50%;
        min-width: 13px;
        min-height: 13px;
        background: #ffe1b9;
        position: relative;
        z-index: 2;
        display: flex;align-items: center;justify-content: space-between;
        .ccircle {
          width: 5px;
          height: 5px;
          background: #ffb148;
          margin: auto;
          border-radius: 50%;
        }
      }
    }
  }
</style>
