<template>
  <div class="expertRead">
    <div class="finance-title">
      <div class="content">
        <p>科创板在审公司统计</p>
        <p>汇集科创板专家，为您全面解读科创板规则及实践</p>
      </div>
    </div>
    <div class="main">
      <el-row :gutter="15">
        <el-col :span="18" style="padding-right: 6px">
          <el-card class="jump" :id="item.id" v-for="(item, index) in expertList" :key="index">
            <div class="title vux-1px-b" style="font-weight: 600">{{item.name}}专栏解读</div>
            <div class="jump_info" :class="{'expert01': index === 0, 'expert02': index === 1, 'expert03': index === 2}">
              <img class="photo" :src="item.img" alt="">
              <div class="info">
                <p><span class="name">{{item.titles}}</span>&nbsp;&nbsp;<span>{{item.status}}</span></p>
                <p>{{item.describe}}</p>
              </div>
            </div>
            <v-list :data="item.professorInfoList"></v-list>
          </el-card>
          <img class="contact" src="https://oss.in-hope.cn/xiaoan/web_static/kcb2x.png" alt="">
        </el-col>
        <el-col :span="6" style="padding-left: 6px">
          <el-card shadow="hover">
            <div class="vux-1px-b clearFix">
              <div class="title fl">监管动态</div>
              <div class="more fr">
                <span @click="getActivities" style="cursor:pointer">更多<i class="el-icon-arrow-right"></i></span>
              </div>
            </div>
            <div class="activeList">
              <ul>
                <li v-for="(item, index) in superviseList" :key="index" :class="{'vux-1px-b': index != superviseList.length-1}">
                  <p><a :href="item.href" target="_blank">{{item.title}}</a></p>
                  <p class="time">{{$common.transTime(item.releaseDate)[1]}}</p>
                  <!--<p>{{item.title}}</p>-->
                  <!--<p class="time">{{$common.transTime(item.releaseDate)[1]}}</p>-->
                </li>
              </ul>
            </div>
          </el-card>
          <el-card class="news" shadow="hover">
            <div class="vux-1px-b clearFix">
              <div class="title fl">科创板新闻</div>
            </div>
            <div class="activeList">
              <ul>
                <li v-for="(item, index) in newList" :key="index" :class="{'vux-1px-b': index != newList.length-1}">
                  <p><a :href="item.href" target="_blank">{{item.title}}</a></p>
                  <p class="time">{{$common.transTime(item.releaseDate)[1]}}</p>
                </li>
                <!--<li v-for="(item, index) in newList" :key="index" :class="{'vux-1px-b': index != newList.length-1}">-->
                  <!--<p>{{item.title}}</p>-->
                  <!--<p class="time">{{$common.transTime(item.releaseDate)[1]}}</p>-->
                <!--</li>-->
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import list from './components/list.vue'
export default {
  data() {
    return {
      newList: [],
      superviseList: [],
      expertList: []
      // expertList: [
      //   {
      //     name: '王骥跃', id: "jump1", status: '资深保荐代表人', 
      //     img: 'https://oss.in-hope.cn/xiaoan/web_static/wangtitle.png', 
      //     desc: '任职于券商一线业务部门，保荐过多家A股上市公司，对中国资本市场有独到、深刻的理解。',
      //     list: [
      //       {title: '科创板满月，注册制初现', plate: [], show: false, date: '2019-4-1', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483965&idx=1&sn=a1500514389898b3fb97f1b9a49fda16&chksm=fabb7878cdccf16ef2eebf7a32f4d91cf1bdc1e0dda5a3bd1ecace7a41f3090dac8955c5e0c6&scene=0&xtrack=1&key=2acbacda797c2932828ec16ddc304b83280b70ff035619f51e194e652f67d781b7db6323514a65496647f8532eeba22a79ae99fab5b902c6cc0ca4c5fd8a21c1d8c3d1ef3be3bcb00ad9ba65a74b2ebc&ascene=1&uin=MzcxNzA2NQ%3D%3D&devicetype=Windows+10&version=62060739&lang=zh_CN&pass_ticket=5uBoj9W9bfF1NqaJCsXiM9BHmLCDQqs0e%2BpCbIMMzAM%3D', describe: '科创板不仅仅是简单开设一个板块，更重要的是试点注册制，完善资本市场基础制度。短短一个月时间，科创板展现了透明、高效，带动了市场关注，击碎许多传言，倒逼了既有审核体系改革，注册制已然初现市场，并给中国证券市场带来了悄然转变。'},
      //       {title: '简评科创板首批9家申请公司质量', plate: [], show: false, date: '2019-3-24', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483958&idx=1&sn=6f13162a31da1b0a4f61a27e26aea84e&chksm=fabb7873cdccf16533cbc30c541fb176baa72a1c3f6b2f1cd4da24647b2acf574fe29e4d3e89&mpshare=1&scene=1&srcid=032638RfHiW2LCNDqBnQzcfN#rd', describe: '在万众瞩目中，科创板首批被受理的申请公司名单于3月22日晚18:09分公开了，随之同步公开披露的还有这9家公司的主要申请材料，比现有IPO预披露内容要丰富了很多。'},
      //       {title: '传闻终究不是现实，为上交所点赞', plate: [], show: false, date: '2019-3-22', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483957&idx=1&sn=254ae33f6a632a0c5039a51fa81808ca&chksm=fabb7870cdccf16670d61da7bde00808a46de05cfd678729652dd57cfb027a933c57885eb5f2&mpshare=1&scene=1&srcid=0326bNX1bQ8juXphXSObhGSb#rd', describe: '值得注意的是，天奈科技和利元亨也在首批受理名单中。周四一早，微博上传出消息，称民生证券上报的上述俩科创板项目被劝退。传闻终究不是现实，上交所用受理函公告击碎了传闻。'},
      //       {title: '科创板来了，券商业务模式也要变了', plate: [], show: false, date: '2019-3-21', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483956&idx=1&sn=00211da4b8c7f686271ce68026806e05&chksm=fabb7871cdccf167eb99d01c34f164fac1d1e65b922ab5db7bb96d2f8363b4a497e84a273d44&mpshare=1&scene=1&srcid=0326COwdjrn6pwwKyqxM2B0S#rd', describe: '科创板来了，不只是给投行业务部门提供了新的业务机会，更重要的是整个券商业务模式要随之而发生重大变化。'},
      //       {title: '科创板3月18日开门迎客，5月见证首单？', plate: [], show: false, date: '2019-3-20', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483943&idx=1&sn=af6dc7fa7981e57f14d515538ad914c8&chksm=fabb7862cdccf174b579fad635e51763118dcc15e1f7d68623f312bcd5e9874c76610bd9dcbc&mpshare=1&scene=1&srcid=0326RDs9kWUcQPD3jBgo4syw#rd', describe: '在相关规则生效2周后，上交所科创板股票发行上市审核系统于3月18日正式上线，也就是说科创板开始收材料了。'},
      //       {title: '首批科创板申请企业为何低调无闻？', plate: [], show: false, date: '2019-3-19', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483942&idx=1&sn=19f48f2c6d9f0a05f0688435c53b830c&chksm=fabb7863cdccf175a4249fda29874399832d460aa1393be98af9a9d3015891a5c5acf5186c4c&mpshare=1&scene=1&srcid=0326eT3woD2fdNnX12SWApWw#rd', describe: '这两家公司公开媒体报道都很少，显然并不是之前热捧的所谓“硬科技”公司，也不是优先推荐的三大领域的知名公司，可以说“低调无闻”。'},
      //       {title: '两个锚点！科创板IPO定价的关键！', plate: [], show: false, date: '2019-3-12', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483928&idx=1&sn=08fbfbf0154b06d035b840f4f2576df5&chksm=fabb785dcdccf14b63ce729fb6060111b8539c69b8d69cca442c5a5d8529174f6aeba1bbea85&mpshare=1&scene=1&srcid=0326BZPlqPooQI7lPUgsw28b#rd', describe: '在科创板的询价机制设计下，IPO定价的关键要素，不是各种估值模型，不是可比价格或市场法估值，也不是大家普遍认为可能高估的前期外部融资的估值，而是两个最关键的锚：投价报告和上市条件指标！'},
      //       {title: '全面解读科创板注册制改革（附PPT）', plate: [], show: false, date: '2019-3-6', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483922&idx=1&sn=1de493f2d0b4e37a35ac319efa305bfc&chksm=fabb7857cdccf141327e0a532873ac95538b3c6fe717ac19f4311760b112b9ff159a4b039c51&mpshare=1&scene=1&srcid=0326070ajMOB4IpJhMsc5Jhr#rd', describe: '这套文件，是第一套监管一线为主起草的全套制度性文件，直面股票定价、交易、减持、退市等市场核心问题，充分体现了市场化法制化改革的决心。'},
      //       {title: '该如何看待神速诞生的科创板', plate: [], show: false, date: '2019-3-5', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483859&idx=1&sn=e970f689eca0abe5bf8f6e153a55060c&chksm=fabb7b96cdccf2803e142983027830041a9a69c9b5c557a8fc51bcbe5381d43109c7cbf2e69c&mpshare=1&scene=1&srcid=0326JdzbztV4WuQqWBen7GUU#rd', describe: '科创板注册制是最高领导亲自推动的证券市场顶层设计供给侧改革。'},
      //       {title: '科创板就是证券市场供给侧改革的试验田', plate: [], show: false, date: '2019-2-25', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483814&idx=1&sn=f66710bce1eb597ad42f616ffa1b8d1c&chksm=fabb7be3cdccf2f56cf4627207b225ebd51d0d98d44b930a6339f58ba88ef24cc1f2252dc333&mpshare=1&scene=1&srcid=0326WzHVxYuvnCWf7kwDDIE9#rd', describe: '证券市场的供给侧改革，很重要的一块是股票市场的供给侧改革；股票市场的供给侧，就是股票市场的股票来源问题；股票来源的主要供应渠道，就是IPO、再融资以及发行股份购买资产；而科创板注册制的改革试点，就是要对股票来源这个股票市场的供给侧进行改革。'},
      //       {title: '上科创板？还是去纳斯达克？', plate: [], show: false, date: '2019-2-21', url: 'https://mp.weixin.qq.com/s?__biz=MzUzMTk4NDE3MA==&mid=2247483805&idx=1&sn=e74bfae8100557ef20cabb09ad408fab&chksm=fabb7bd8cdccf2ce9b75d8e7af98c98473f9b344bd9c7dff50f6c4d89c6d0c840a38c21bed62&mpshare=1&scene=1&srcid=0326X1skYdRHJfJ7G9JtcDoN#rd', describe: '对于拟上市的科创公司来说，是留在国内上科创板，还是沿着原定路线去纳斯达克，成为一个问题。'}
      //     ]
      //   },
      //   {
      //     name: '黄智', id: "jump2", status: '信公咨询创始合伙人',
      //     img: 'https://oss.in-hope.cn/xiaoan/web_static/huangtitle.png', 
      //     desc: '曾任职于上海证券交易所，参与过《企业会计准则》、《股票上市规则》及资本市场其他相关法规的论证、制定和修订。',
      //     list: [
      //       {title: '科创板之表决权差异安排：兼具效率和公平的公司治理手段', date: '2019-4-3', plate: [], show: false, url: 'https://mp.weixin.qq.com/s/3GakVZQGNYTcOKPL0zgOLg', describe: '科创板引入表决权差异安排，通过设置特别表决权A类股份和普通表决权B类股份，使创始人在拥有很少股份的同时，依然保持对企业的控制权，提升公司的治理效率。'},
      //       {title: '科创企业选择科创板的重要理由 ——灵活多样的股权激励', date: '2019-3-26', plate: [], show: false, url: 'https://mp.weixin.qq.com/s/c_jE-eyMWvYvwSaFYhw2rw', describe: '科创板推出之后，很多拟上市企业面临一个新选择——是在科创板还是其他传统板块上市？对于高度依赖创始人和核心技术人员的科创型企业，往往必须利用股权吸引、留住、持续激励人才，这就要求配备一套灵活多样的股权激励机制。'}
      //     ]
      //   },
      //   {
      //     name: '吴非', id: "jump3", status: '信公咨询合伙人', 
      //     img: 'https://oss.in-hope.cn/xiaoan/web_static/wutitle.png', 
      //     desc: '曾任职于上海证券交易所，参与了股票发行注册制、战新板等重要规则制定和修改等工作。',
      //     list: [
      //       {title: '要建立更为包容的市场指标体系', plate: [], show: false, date: '2018-12-18', url: 'https://m.yicai.com/video/100081956.html?from=timeline&isappinstalled=0', describe: '科创板+注册制箭在弦上，信公咨询总经理吴非认为 ，我们要建立更为包容的市场指标体系。'},
      //       {title: '科创板将如何定位？', plate: [], show: false, date: '2018-12-14', url: 'https://mp.weixin.qq.com/s?__biz=MjM5MjA1MTQyMg==&mid=2651741562&idx=1&sn=93ef4ba24c19e56baa50b91d0d512ccd&chksm=bd56c4cb8a214ddd8a710c611fd1db3406d0ec719809d65ef6fe20501f3bbab131eeb1ba5bd7&mpshare=1&scene=1&srcid=0326xNB3RHqcNKDlojp6BCnb#rd', describe: '很多业内人士都把“纳斯纳克”作为标杆，纳斯达克的制度设计有何高明之处？有哪些做法值得我们借鉴？市场念叨了多年的注册制，到底是什么样的？注册制是否等于低门槛准入？信公咨询总经理吴非邀您一起来探讨。'},
      //       {title: '对话信公咨询总经理吴非：八问八答“画像”科创板', plate: [], show: false, date: '2018-11-29', url: 'http://finance.sina.com.cn/roll/2018-11-29/doc-ihpevhcm2280506.shtml', describe: '第一财经与曾经参与过战新板筹备，如今任职信公咨询总经理的吴非进行了一场对话，回顾过往的宝贵经验，来为科创板“画像”。'}
      //     ]
      //   }
      // ]
    }
  },
  components: {
    'v-list': list
  },
  created() {
    this.getStibNews();
    this.getStibSupervise();
    this.getAdvertInfo();
  },
  mounted() {
    // this.$nextTick(e => {
    //   setTimeout(() => {
    //     let linkA = document.createElement('a');
    //     let jump = this.$route.query.num;
    //     let href = `${window.location.href}#${jump}`;
    //     linkA.setAttribute('href', href);
    //     linkA.click();
    //     let scrollTop = '';
    //     if (document.documentElement && document.documentElement.scrollTop) {
    //       document.documentElement.scrollTop -= 70
    //       scrollTop = document.documentElement.scrollTop;
    //     } else if (document.body) {
    //       document.body.scrollTop -= 70
    //       scrollTop = document.body.scrollTop;
    //     }
    //   }, 300)
    // })
  },
  methods: {
    link() {
      let linkA = document.createElement('a');
      let jump = this.$route.query.num;
      let href = `${window.location.href}#${jump}`;
      linkA.setAttribute('href', href);
      linkA.click();
      let scrollTop = '';
      if (document.documentElement && document.documentElement.scrollTop) {
        document.documentElement.scrollTop -= 70
        scrollTop = document.documentElement.scrollTop;
      } else if (document.body) {
        document.body.scrollTop -= 70
        scrollTop = document.body.scrollTop;
      }
    },
    getAdvertInfo() {
      this.$http({
        method: 'GET',
        url: this.$api.kechuangban.getAdvertInfo,
        params: {}
      }).then((res) => {
        if (res.data.returnCode == 200) {
          let data = res.data.returnObject;
          this.expertList = data.EXPERTS_READ;
          this.expertList.forEach(e => {
            e.professorInfoList.forEach((e, index) => {
              // e.show = false;
              this.$set(e, 'show', false);
              e.plate = [];
            })
          })
          setTimeout(e => {
            this.link();
          }, 200)
        }
      }).catch((err) => {

      })
    },
    changeTab(item) {
      this.tabTitle.forEach(e => {
        e.active = false;
      });
      item.active = true;
    },
    getActivities() {
      window.open(`${window.location.origin}/activities?index=4`)
    },
    // 获取科创板新闻
    getStibNews() {
      let params = {
        pageNo: 1,
        pageSize: 10
      }
      this.$axios.kechuangban.getStibNews(params).then(res => {
        if (res.data.returnCode == '200') {
          this.newList = res.data.returnObject.newsList;
        }
      }).catch(err => {

      })
    },
    // 获取科创板监管动态
    getStibSupervise() {
      let params = {
        pageNo: 1,
        pageSize: 5
      }
      this.$axios.kechuangban.getStibSupervise(params).then(res => {
        if (res.data.returnCode == '200') {
          this.superviseList = res.data.returnObject.superviseList;
          console.log(this.superviseList);
        }
      }).catch(err => {

      })
    }
  }
}
</script>
<style lang="scss">
 .expertRead {
   .el-card__body {
      padding: 8px 16px;
      padding-bottom: 8px;
    }
 }
</style>

<style lang="scss" scoped>
  .expertRead {
    background-color: #f6f6f6;
    .finance-title {
      width: 100%;
      height: 140px;
      background-image: url(https://oss.in-hope.cn/xiaoan/web_static/financeBack.jpg);
      background-size: 100% 100%;
      color: #FFFFFF;
      p:first-child {
        font-size:30px;
        font-weight:600;
        padding: 35px 0 8px 0;
      }
      p {
        font-size:12px;
        font-weight:400;
      }
    }
    .main {
      margin: 0 auto;
      width: 1230px;
      padding: 0 15px;
      margin-top: 16px;
      .news {
        margin-top: 16px;
        margin-bottom: 23px;
      }
      .left {
        width: 892px;
        // min-height: 100px;
        // background-color: yellow;
        display: inline-block;
        margin-right: 10px;
      }
      .right {
        width: 292px;
        min-height: 100px;
        background-color: blue;
        display: inline-block;
      }
      .search {
        margin-top: 16px;
      }
      .title {
        font-size: 14px;
        color: #323232;
        font-weight: 600;
      }
      .line {
        width: 100%;
        height: 1px;
        background:rgba(0,0,0,1);
        opacity: 0.08;
        margin-bottom: 16px;
      }
      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
      .vux-1px-b {
        padding-bottom: 12px;
      }
      .more {
        color: #AEAEAE;
        font-size: 12px;
      }
      .activeList {
        li {
          padding-top: 9px;
          &:hover {
            transition: all .3s;
            background-color: #f8f8f8;
          }
          p {
            color: #323232;
            font-size: 14px;
          }
          .time {
            color: #8D8D8D;
            font-size: 12px;
            margin-top: 2px;
          }
        }
        .vux-1px-b {
          padding-bottom: 9px;
        }
      }
      .contact {
        width: 100%;
        height: 200px;
        margin: 16px 0 23px 0;
      }
      a:hover {
        transition: all .3s;
        color: #FFB148;
      }
    }
    .jump {
      margin-top: 16px;
      &:first-child {
        margin-top: 0;
      }
      .el-card__body {
        padding: 8px 16px;
      }
      .jump_info {
        padding: 20px;
        margin-top: 16px;
      }
      .expert01 {
        background: url('https://oss.in-hope.cn/xiaoan/web_static/huang-1.png') no-repeat;
      }
      .expert02 {
        background: url('https://oss.in-hope.cn/xiaoan/web_static/wu-1.png') no-repeat;
      }
      .expert03 {
        background: url('https://oss.in-hope.cn/xiaoan/web_static/wang1.png') no-repeat;
      }
      .photo {
        display: inline-block;
        width: 86px;
        height: 86px;
        border-radius: 50%;
      }
      .info {
        display: inline-block;
        overflow: hidden;
        margin-left: 10px;
        // margin-top: 10px;
        vertical-align: top;
        p {
          font-size: 12px;
          margin-top: 10px;
          font-size: 12px;
          color:rgba(255,255,255,0.8);
          font-weight: 600;
          .name {
            font-size: 14px;
            color:rgba(255,255,255,1);
            font-weight: 600;
          }
        }
      }
    }
  }
</style>

