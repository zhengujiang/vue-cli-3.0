<template>
  <div id="answerRules">
    <div class="contentBottom">
      <div class="rule">
        <span></span><span>答题规则</span><span></span>
      </div>
      <div class="ruleInner">
        <p>1、我们将分别于2018年11月22日、11月26日及11月29日，在参赛平台开放以信息披露、公司治理和资本运作为主题的考题；每开放一套考 
题，参赛者增加一次答题机会；每套考题可以多次答题，取最高分为该套试卷的最终得分；每成功邀请一个好友（好友完成参赛注册），
参赛者增加一次答题机会（答题机会不设上限），通过邀请好友新增的答题机会可以用于任意一套考卷上</p>
<p>2、每套考题一共有20道题，参赛者正确回答一道题将获得5个得分，一套试卷最高得分100分，参赛者最终答题得分的计算方式为： 
最终答题得分=（信息披露试卷最高得分+公司治理试卷最高得分+资本运作试卷最高得分）/3
<br/>3、答题得分同时将转换为答题积分计入参赛者总积分中，计算方式为：<br/>
答题积分=信息披露试卷最高得分/5+公司治理试卷最高得分/5+资本运作试卷最高得分/5；
    </p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "answerRules",
    components: {
    }
  }
</script>

<style lang="scss">
  #answerRules {
    .contentBottom {
      clear: both;
      width: 897px;
      height: 220px;
      border:1px solid rgba(84,84,84,1);
      border-radius:4px;
      .rule {
        color: #FFFFFF;
        font-size: 16px;
        width: 183px;
        text-align: center;
        margin: 20px auto 10px;
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
      .ruleInner {
        // width: 150px;
        padding-left: 18px;
        p {
          font-size:14px;
          font-weight:400;
          color: #EEEEEE;
        }
      }
    }
  }
</style>
