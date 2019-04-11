<template>
  <div id="comp-clause">
    <div class="scroll">
      <h2>赛程安排：</h2>
      <p>本次活动设置网络海选、区域赛、决赛三个阶段。网络海选时间为2018.11.22-12.05，区域赛及决赛将根据大赛进展情况另安排具体时间，敬请期待！</p>
      <!---->
      <h2>参赛平台：</h2>
      <p>网络海选将通过“信公小安”微信公众号入口及“信公小安”web版（https://xiaoan.in-hope.cn/）进行，区域赛及决赛将以线下活动形式进行。</p>
      <!---->
      <h2>具体参赛规则：</h2>
      <h2>第一阶段：网络海选（2018.11.22-12.05）</h2>
      <p>1、参赛者参与网络海选，不仅可以攒积分赢奖品，同时还有机会赢取线下区域赛的入场券；</p>
      <p>2、参赛者总积分=答题积分+签到积分+邀请好友积分+邀请董秘打call积分；</p>
      <p>3、答题积分计算规则</p>
      <p>
        （1）我们将分别于2018年11月22日、11月26日及11月29日，在参赛平台开放以信息披露、公司治理和资本运作为主题的考题；每开放一套考题，参赛者增加一次答题机会；每套考题可以多次答题，取最高分为最终得分；每成功邀请一个好友（分享链接），参赛者增加一次答题机会（答题机会不设上限），通过邀请好友新增的答题机会可以用于任意一套考卷上</p>
      <p>（2）每套考题一共有20道题，参赛者正确回答一道题将获得5个得分，一套试卷最高得分100分，参赛者最终答题得分的计算方式为：最终答题得分=（信息披露试卷最高得分+公司治理试卷最高得分+资本运作试卷最高得分）/3</p>
      <p>（3）答题得分同时将转换为答题积分计入参赛者总积分中，计算方式为：答题积分=信息披露试卷最高得分/5+公司治理试卷最高得分/5+资本运作试卷最高得分/5；</p>
      <p>4、签到积分计算规则</p>
      <p>参赛者每天有一次签到机会，签到一次获得1积分；</p>
      <p>5、邀请好友积分计算规则</p>
      <p>邀请好友参赛，每成功邀请到一个好友（好友完成参赛注册），邀请者将获得5积分，被邀请者将获得3积分；</p>
      <p>6、邀请董秘打call积分计算规则</p>
      <p>邀请董秘为参赛者加油打call，邀请成功（董秘完成名片认证），参赛者将获得30积分。</p>
      <!---->
      <h2>网络海选奖品：</h2>
      <p>1、拼综合实力！积分总数排名前十的选手，每人将获得500元的奖励；</p>
      <p>2、拼脑力！答题得分排名前十的选手（答题得分相同的以完成时间快的为优先），每人将获得信公小安2019年全年出版物；</p>
      <p>3、拼人缘！邀请好友获得积分排名前十的选手，每人将获得价值9999元的信公小安企业版会员一年；</p>
      <p>4、阳光普照奖！所有参赛者将获得信公小安企业版三个月试用权。 </p>
      <!---->
      <h2>第二阶段：线下区域赛</h2>
      <p>网络海选总积分排名前一百名的参赛选手，将获得参与线下区域赛的资格（若其中有意愿参与线下区域赛的选手不足一百人，线下区域赛资格名额将依次顺延）</p>
      <p>区域赛设置华北、华东、华南三个分赛区</p>
      <p>华南分赛区举办地为广州和深圳，华东分赛区举办地为上海，华北分赛区举办地为北京。</p>
      <!---->
      <h2>第三阶段：线下决赛</h2>
      <p>区域赛将选拔出10名选手参加总决赛；</p>
      <p>决赛地点：上海淳大万丽酒店（上海浦东新区迎春路719号）。</p>
      <!---->
      <h2>线下决赛奖品：</h2>
      <p>决赛将评选出1名“总冠军”，“总冠军”将获得5万元现金奖励，其余9名决赛入围选手将分别获得1万现金奖励。</p>
      <h2>主办单位：</h2>
      <p>信公咨询、天风证券</p>
      <h2>技术支持：</h2>
      <p>信公小安</p>
      <p class="small">*本次比赛最终解释权属于上海信公印诚信息技术有限公司</p>
    </div>
    <flexbox class="clause-footer" gutter="15" v-transfer-dom>
      <template v-if="!form">
        <flexbox-item>
          <x-button class="foot-left" @click.native="checkBtn(1)">不同意</x-button>
        </flexbox-item>
        <flexbox-item>
          <x-button class="foot-right" @click.native="checkBtn(2)">同意</x-button>
        </flexbox-item>
      </template>
      <template v-else>
        <flexbox-item>
          <x-button class="foot-right" @click.native="$router.back(-1)">返回</x-button>
        </flexbox-item>
      </template>
    </flexbox>
  </div>
</template>

<script>
  import {Flexbox, FlexboxItem, XButton, TransferDom} from 'vux'
  export default {
    name: "comp-clause",
    directives: {
      TransferDom
    },
    components: {
      Flexbox, FlexboxItem, XButton
    },
    data() {
      return {
        add: ``,
        form: false
      }
    },
    created() {
      if (this.$route.query.form) {
        this.form = true;
      }
    },
    mounted(){
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    methods: {
      checkBtn(type) {
        // console.log();
        this.$router.replace({path: '/competition/enroll', query: {check: type}});
      }
    }
  }
</script>

<style lang="scss">
  .clause-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 15px 18px 35px 18px;
    background-color: white;
    .foot-left {
      background: white;
      color: #545454;
      &::after {
        border-color: #FFCD02;
      }
    }
    .foot-right {
      background: #FFCD02;
      color: #545454;
      &::after {
        border-color: #FFCD02;
      }
    }
  }
  #comp-clause {
    background: #fff;
    width: 100%;
    min-height: 100%;
    padding: 0 18px;
    .scroll {
      width: 100%;
      height: 100%;
      padding-bottom: 130px;
    }
    h2, h3 {
      color: #333333;
      text-indent: 25px;
    }
    h2 {
      font-size: 15px;
      font-family: PingFangSC-Medium, sans-serif;
      font-weight: 900;
      padding-top: 20px;
      line-height: 2;
    }
    h3 {
      font-size: 14px;
      // padding-top: 1em;
      font-family: PingFangSC-Medium, sans-serif;
    }
    p {
      color: #666666;
      text-indent: 25px;
      text-align: justify;
      font-size: 13px;
      line-height: 1.6;
      // text-justify-trim: j;
      &.small {
        margin-top: 30px;
        font-size: 12px;
        color: #8d8d8d;
      }
    }
  }
</style>
