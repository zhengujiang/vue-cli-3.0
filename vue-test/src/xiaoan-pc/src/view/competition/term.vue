<template>
  <div id="term">
    <div class="content">
      <!-- <div class="termImage">
        <div class="top"></div>
        <p class="termText">这里也是一句话文案<br/>这里可不可以有一些关于这次活动的介绍</p>
        <div class="termBottom"><span>扫码添加小安公众号参加</span><img src="/static/image/business/test/qrcode.png"/></div>
      </div> -->
      <div class="termInner">
        <p class="termAward">活动条款</p>
        <div class="terms">
          <p id="firstTerm" class="title">赛程安排：</p>
          本次活动设置网络海选、区域赛、决赛三个阶段。网络海选时间为2018.11.22-12.05，区域赛及决赛将根据大赛进展情况另安排具体时间，敬请期待！
          <br/><br/>
          <p class="title">参赛平台：</p>
          网络海选将通过“信公咨询”“信公小安”微信公众号入口及“信公小安”web版（https://xiaoan.in-hope.cn/）进行，区域赛及决赛将以线下活动形式进行。
          <br>
          <br/><p class="title">具体参赛规则：</p>
          <div ><span>第一阶段：网络海选</span>（2018.11.22-12.05）<br/> 
          1、参赛者参与网络海选，不仅可以得积分赢奖品，同时还有机会赢得线下区域赛的参赛资格；
          <br/>2、参赛者总积分=答题积分+签到积分+邀请好友积分+邀请董秘打call积分；
          <br/>3、答题积分计算规则
          <br/> &nbsp;(1) 我们将分别于2018年11月22日、11月26日及11月29日，在参赛平台开放以信息披露、公司治理和资本运作为主题的考题；每开放一套考题，参赛者增加一次答题机会；每套考题可以多次答题，取最高分为该套试卷的最终得分；每成功邀请一个好友（分享链接），参赛者增加一次答题机会（答题机会不设上限），通过邀请好友新增的答题机会可以用于任意一套考卷上
          <br/> &nbsp;(2) 每套考题一共有20道题，参赛者正确回答一道题将获得5个得分，一套试卷最高得分100分，参赛者最终答题得分的计算方式为：
          <br/>最终答题得分=（信息披露试卷最高得分+公司治理试卷最高得分+资本运作试卷最高得分）/3
          <br/> &nbsp;(3) 答题得分同时将转换为答题积分计入参赛者总积分中，计算方式为：
          <br/>答题积分=信息披露试卷最高得分/5+公司治理试卷最高得分/5+资本运作试卷最高得分/5；
          <br/>4、签到积分计算规则
          <br/>参赛者每天有一次签到机会，签到一次获得1积分；
          <br/>5、邀请好友积分计算规则
          <br/>邀请好友参赛，每成功邀请到一个好友（好友完成参赛注册），邀请者将获得5积分，被邀请者将获得3积分；
          <br/>6、邀请董秘打call积分计算规则
          <br/>邀请董秘为参赛者加油打call，邀请成功（董秘完成名片认证），参赛者将获得30积分。
          <br/>
          <br/>
           <p class="title">网络海选奖品：</p>
          1、拼综合实力！总积分排名前十的选手，每人将获得500元的奖励；
          <br/>2、拼脑力！答题得分排名前十的选手（答题得分相同的以完成时间快的为优先），每人将获得信公小安2019年全年出版物；
          <br/>3、拼人缘！邀请好友获得积分排名前十的选手，每人将获得价值9999元的信公小安基础企业版会员一年；
          <br/>4、阳光普照奖！所有参赛者将获得信公小安企业版三个月试用权（如适用）。
          <br/><br/>
          <p class="title">第二阶段：线下区域赛</p>
          网络海选总积分排名前一百名的参赛选手，将获得参与线下区域赛的资格（若其中有意愿参与线下区域赛的选手不足一百人，线下区域赛资格名额将依次顺延）；
          <br/>区域赛设置华北、华东、华南三个分赛区；
          <br/>华南分赛区举办地为广州和深圳，华东分赛区举办地为上海，华北分赛区举办地为北京。
          <br/><br/>
          <p class="title">第三阶段：线下决赛</p>
          区域赛将选拔出10名选手参加总决赛；
          <br/>决赛地点：上海淳大万丽酒店（上海浦东新区迎春路719号）。
          <br/><br/>
          <p class="title">线下决赛奖品：</p>
          决赛将评选出1名“总冠军”，“总冠军”将获得5万元现金奖励，其余9名决赛入围选手将分别获得1万现金奖励。
          <br/><br/>
          <p class="title">主办单位：</p>
          信公咨询、天风证券
          <br/><br/>
          <p class="title">技术支持：</p>
          信公小安
          <br/><br/>
          <p style="font-size:12px">*本次比赛最终解释权属于上海信公印诚信息技术有限公司
          </p>
          </div>
        </div>
        <div class="termButton" v-if="content">
          <el-button @click="disagree" type="primary" plain size="medium">不同意</el-button>
          <el-button @click="agree" type="primary" size="medium">同意</el-button>
        </div>
        <div class="termButton" v-else>
          <el-button @click="returnHome" type="primary" size="medium">返回</el-button>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
    export default {
        name: "term",
        data() {
          return {
            content: true
          }
        },
        created() {
          if (this.$route.query.content) {
            this.content = false;
          }
        },
        methods: {
          disagree() {
            this.$router.push({path: '/competition/join', query: {isTerm: false}});
          },
          agree() {
            this.$router.push({path: '/competition/join', query: {isTerm: true}});
          },
          returnHome() {
            history.go(-1);
          }
        }
    }
</script>

<style lang="scss">
  #term {
    min-height: 800px;
    background: #FFFFFF;
    padding: 20px;
    .content {
      // padding: 16px;
      clear: both;
      overflow: hidden;
      box-shadow: 0 0 10px #CCC;
    }
    .termImage {
      // float: left;
      width:584px;
      height:568px;
      padding-top: 68px;
      padding-bottom: 35px;
      background: url(/static/img/competition/bg.jpg) no-repeat;
      .top {
        width:527px;
        height:216px;
        margin: 0 auto 48px;
        background: url(/static/img/competition/bg-title.png) no-repeat;
        background-size: contain;
      }
      .termText {
        text-align: center;
        height: 110px;
        font-size:16px;
        font-weight:bold;
        color:rgba(254,205,4,1);
        line-height: 30px;
      }
      .termBottom {
        text-align: right;
        span {
          font-size:16px;
          font-weight:400;
          color:rgba(255,255,255,1);
        }
        img {
          height: 90px;
          width: 90px;
          margin: 0 34px 0 20px;
        }

      }
    }
    .termInner {
      padding: 0 31px;
      .termAward {
        margin-top: 15px;
        margin-bottom: 19px;
        font-size: 30px;
        text-align: center;
        font-weight:bold;
        color:rgba(50,50,50,1);
      }
      .terms {
        padding: 0 16px;
        overflow: auto;
        width: 100%;
        height: 590px;
        border: 1px solid #E3E3E3;
        font-size: 14px;
        color: #545454;
        line-height: 21px; 
        #firstTerm {
          margin-top: 20px;
        }
        .title {
          font-size: 14px;
          color: #333333;
          font-weight: 600;
          line-height: 22px; 
        }
      }
      .termButton {
        display: flex;
        justify-content:center; 
        align-items: center;
        height: 102px;
        // margin-top: 39px;
        .el-button {
          width: 179px;
        }
      }
    }
  }
</style>
