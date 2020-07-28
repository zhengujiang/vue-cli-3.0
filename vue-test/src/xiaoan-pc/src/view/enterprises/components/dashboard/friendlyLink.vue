<template>
  <el-card id="" class="box-card friendlyLink" header="友情连接">
    <ul>
      <li v-for="(item,index) in friendlyLinkList">
        <a :href="item.url" target="_blank">
          <img class="friendly-icon" :src="item.img"/> {{item.name}}</a>
      </li>
    </ul>
  </el-card>
  <!--// 中国证券监督管理委员会	http://www.csrc.gov.cn/pub/newsite/
  //        上海证券交易所	http://www.sse.com.cn/
  //        深圳证券交易所	http://www.szse.cn/
  //        全国中小企业股份转让系统	http://www.neeq.com.cn/

  //        中国证券登记结算有限公司	http://www.chinaclear.cn/
  //        中国上市公司协会	http://www.capco.org.cn/
  //        中国证券业协会	http://www.sac.net.cn/
  //        中国证券投资基金业协会	http://www.amac.org.cn/

  //        中国证券投资者保护基金有限责任公司	http://www.sipf.com.cn/
  //        中国证券金融股份有限公司	http://www.csf.com.cn/
  //        中华人名共和国财政部	http://www.mof.gov.cn/index.htm
  //        国家税务总局	http://www.chinatax.gov.cn/-->
</template>

<script>
  export default {
    data() {
      return {
        friendlyLinkList: [
          {
            name: '中国证券监督管理委员会',
            img: this.$image.dashboard.jiandu,
            url: 'http://www.csrc.gov.cn/pub/newsite/'
          }, {
            name: '上海证券交易所',
            img: this.$image.dashboard.sh,
            url: 'http://www.sse.com.cn/'
          }, {
            name: '深圳证券交易所',
            img: this.$image.dashboard.sz,
            url: 'http://www.szse.cn/'
          }, {
            name: '全国中小企业股份转让系统',
            img: this.$image.dashboard.guzhuansys,
            url: 'http://www.neeq.com.cn/'
          }, {
            name: '中国证券登记结算有限公司',
            img: this.$image.dashboard.dengjijishuan,
            url: 'http://www.chinaclear.cn/'
          }, {
            name: '中国上市公司协会',
            img: this.$image.dashboard.gongsixiehui,
            url: 'http://www.capco.org.cn/'
          }, {
            name: '中国证券业协会',
            img: this.$image.dashboard.ie,
            url: 'http://www.sac.net.cn/'
          }, {
            name: '中国证券投资基金业协会',
            img: this.$image.dashboard.touzhijijin,
            url: 'http://www.amac.org.cn/'
          }, {
            name: '中国证券投资者保护基金有限责任公司',
            img: this.$image.dashboard.baofujijin,
            url: 'http://www.sipf.com.cn/'
          }, {
            name: '中国证券金融股份有限公司',
            img: this.$image.dashboard.ie,
            url: 'http://www.csf.com.cn/'
          }, {
            name: '中华人民共和国财政部',
            img: this.$image.dashboard.ie,
            url: 'http://www.mof.gov.cn/index.htm'
          }, {
            name: '国家税务总局',
            img: this.$image.dashboard.shuiwuju,
            url: 'http://www.chinatax.gov.cn/'
          }
        ]
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {}
  }
</script>

<style lang="scss">
  .friendlyLink {
    margin-top: 20px;
    height: 170px;
    ul {
      font-size: 14px;
      height: 120px;
      padding: 10px 0;
      li {
        width:25%;
        float: left;
        height: 30px;
        a {
          &:hover {
            color: #ffb148;
          }
        }
        .friendly-icon {
          height: 15px;
          position: relative;
          top: 2px;
        }
      }
    }
  }
</style>
