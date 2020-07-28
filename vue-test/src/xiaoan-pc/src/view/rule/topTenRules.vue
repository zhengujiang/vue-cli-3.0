<template>
  <div class="topTenRule">
    <div class="topbg"></div>
    <div class="ruleContent">
      <p class="title">2018年资本市场十大新规</p>
      <p class="info">在习近平新时代中国特色社会主义思想和党的十九大精神指引下，2018年，监管部门按照“围绕资本市场改革，加强制度建设，激发市场活力，促进资本市场长期健康发展”的重要部署，深入推进法治化、市场化、国际化建设，加快形成融资功能完备、基础制度扎实、市场监管有效、投资者权益得到充分保护的资本市场。</p>
      <div class="clearFix">
        <el-card  class="left">
          <div>
            <div class="no-list" v-if="listInfo.length == 0">
              <v-noInfo></v-noInfo>
            </div>
            <div class="no-list" v-else>
              <v-list :data="listInfo"></v-list>
            </div>
          </div>
        </el-card>
        <div class="right">
          <v-adv :pageName="'投关检索'"></v-adv>
          <el-card>
            <div class="head-flex vux-1px-b">
              <div class="row title">信公干货</div>
            </div>
            <ul>
              <li class="listInfo" v-for="(item, index) in advertList" :key="index">
                <a :href="item.advertUrl" target="_blank">
                  <span :class="{'infoOne': index == 0, 'infoTwo': index == 1, 'infoThree': index == 2, 'num': true}">{{index + 1}}</span>
                  <span>{{item.advertTitle}}</span>
                </a>
              </li>
            </ul>
          </el-card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VList from './components/topTenRulelist'
export default {
  name: "topTenRule",
  data () {
    return {
      listInfo: [],
      advertList: [],
      ruleList: [
        {name: '退市新规', level: 5},
        {name: '回购新规', level: 5},
        {name: '公司治理', level: 4},
        {name: 'CDR新规', level: 4},
        {name: '停复牌新规', level: 4},
        {name: '重组新规', level: 4},
        {name: '纪律处分和监管措施', level: 4},
        {name: '公告格式', level: 3},
        {name: '行业指引新规', level: 3},
        {name: '高送转新规', level: 3}
      ]
    };
  },
  components: {
    VList
  },
  created() {
    this.getRegulationList();
    this.getAdvertList();
  },
  mounted() {},
  methods: {
    getAdvertList() {
        this.$http({
          url: this.$api.advert.getAdvertList,
          method: "GET",
          params: {
            pageNum: 1,
            pageSize: "10",
            type: '信公干货'
          }
        })
          .then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.advertList = res.data.returnObject
            }
          })
          .catch(err => {
            console.log(err);
          });
    },
    getRegulationList() {
      this.$http({
        method: "GET",
        // url: this.$api.user.getRecommendCollect,
        url: this.$api.user.getRecommendCollectFavoriteAll,
        params: {
          userId: this.$cookie.get("userId"),
          pageNum: 1,
          pageSize: 1000
        }
      })
        .then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let list = res.data.returnObject.favoriteList
            let data = list.splice(list.length - 10, list.length - 1);
            for (let key of this.ruleList) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].title.indexOf(key.name) != -1) {
                  let obj = {
                    countList: data[i].countList,
                    descrip: data[i].descrip,
                    dispatchUnit: data[i].dispatchUnit,
                    effectTime: data[i].effectTime,
                    id: data[i].id,
                    isCollect: data[i].isCollect,
                    market: data[i].market,
                    outline: data[i].outline,
                    pdfName: data[i].pdfName,
                    pdfUrl: data[i].pdfUrl,
                    releaseTime: data[i].releaseTime,
                    title: data[i].title,
                    show: false,
                    level: key.level
                  }
                  this.listInfo.push(obj);
                }
              }
            }
          } else {
            this.listInfo = [];
          }
        })
        .catch(err => {
          this.listInfo = [];
        });
    }
  }
}
</script>
<style>
.topTenRule .advertisement .advImg img {
  border: none
}
</style>

<style lang='scss' scoped>
.topTenRule {
  background-color: #f6f6f6;
  .topbg {
    width: 100%;
    height: 200px;
    background: url('https://oss.in-hope.cn/xiaoan/web_static/rulebg.png') no-repeat;
    background-size: 100% 100%;
  }
  .ruleContent {
    width: 1200px;
    margin: 0 auto;
    margin-top: -168px;
    padding-bottom: 40px;
    p {
      color: #FFFFFF;
    }
    .clearFix:after{
      content: ""; 
      display: block; 
      height: 0; 
      clear: both; 
      visibility: hidden;  
      }

    .clearFix {
      zoom: 1; 
    }
    .title {
      font-size: 30px;
      line-height: 42px;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .info {
      width: 896px;
      font-size: 12px;
      line-height: 20px;
      margin-bottom: 30px;
    }
    .left {
      float: left;
      width: 896px;
    }
    .right {
      float: right;
      width: 292px;
      .title {
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
        font-family:PingFangSC-Semibold;
        margin-bottom: 8px;
      }
      .listInfo {
        width: 100%;
        height: 35px;
        line-height: 35px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:hover {
          background-color: #F6F6F6;
        }
        a {
          color: #323232;
        }
        .num {
          display: inline-block;
          width: 14px;
          height: 14px;
          border-radius: 7px;
          line-height: 14px;
          text-align: center;
          vertical-align: middle;
        }
        .infoOne {
          background-color: #FFB148;
          color: #fff;
        }
        .infoTwo {
          background-color: #AFB8DD;
          color: #fff;
        }
        .infoThree {
          background-color: #FFC59C;
          color: #fff;
        }
      }
    }
  }
}
</style>