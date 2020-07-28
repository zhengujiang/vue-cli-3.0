<template>
  <div class="topTenRule">
    <div class="topbg"></div>
    <div class="ruleContent">
      <p class="title">
        <span>{{userInfo.title}}</span>
        <span class="cancelFollow" v-if="userInfo.isCollect" @click="cancelFollow">取消关注</span>
        <span class="follow" v-else @click="follow"><i class="el-icon-plus"></i> 关注</span>
      </p>
      <p class="info">{{userInfo.descrip}}</p>
      <div class="clearFix">
        <el-card  class="left" v-loading="dataLoading">
          <div>
            <div class="no-list" v-if="listInfo.length == 0">
              <v-noInfo></v-noInfo>
            </div>
            <div class="no-list" v-else>
              <v-list :data="listInfo"></v-list>
              <div class="foot-pagination" v-if="page.total > page.size">
                  <div class="row block">
                  <el-pagination @current-change="selectPage" layout="prev, pager, next"
                                 :page-size="page.size" :current-page="page.index" :total="page.total">
                  </el-pagination>
                  </div>
                  <div class="row">
                    <el-radio-group size="mini" v-model="page.size" @change="handlePageChange">
                      <el-radio-button :label="30">30条</el-radio-button>
                      <el-radio-button :label="50">50条</el-radio-button>
                    </el-radio-group>
                  </div>
              </div>
            </div>
          </div>
        </el-card>
        <div class="right">
          <!-- <v-adv :pageName="'投关检索'"></v-adv> -->
          <div class="advertisement" v-if="(userInfo.title.indexOf(key) != -1)" v-for="(item, key, index) in banner" :key="index" >
            <div class="advImg">
              <a :href="item.url" target="_blank">
                <img style="width: 292px" :src="`${item.img}`"/>
              </a>
            </div>
          </div>
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
import VList from './components/topTenDetailList'
export default {
  name: "topTenRule",
  data () {
    return {
      listInfo: [],
      advertList: [],
      page: {
        index: 1,
        size: 30,
        total: 0
      },
      userInfo: {title: ''},
      dataLoading: false,
      banner: {
        '退市新规': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerOne.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/2UXWHuVwT'
        },
        '回购新规': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerTwo.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/2YMPCbVWr'
        },
        '公司治理': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerThree.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/0tS7uJxtr'
        },
        'CDR新规': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerFour.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/95C9titsa'
        },
        '停复牌新规': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerThree.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/0tS7uJxtr'
        },
        '重组新规': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerFive.jpg',
          url: 'https://appe8O3plIM2665.h5.xeknow.com/st/0leRB3yFw'
        },
        '纪律处分和监管措施': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerThree.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/0tS7uJxtr'
        },
        '公告格式': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerOne.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/2UXWHuVwT'
        },
        '行业指引新规': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerOne.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/2UXWHuVwT'
        },
        '高送转新规': {
          img: 'https://oss.in-hope.cn/xiaoan/web_static/bannerSix.jpg',
          url: 'https://st.h5.xiaoe-tech.com/st/7jFaZOczl'
        }
      }
    };
  },
  components: {
    VList
  },
  created() {
    this.id = this.$route.query.id
    this.getContent();
    this.getAdvertList();
  },
  mounted() {},
  methods: {
    follow() {
        this.$http({
          method: 'GET',
          url: this.$api.user.subscribeRecommend,
          params: {
            recommendId: this.id,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '关注成功'})
          }
          this.getContent()
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
    },
    cancelFollow() {
      this.$confirm('确定要取消关注吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          method: 'GET',
          url: this.$api.user.cancelRecommend,
          params: {
            userId: this.$cookie.get('userId'),
            recommendId: this.id
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '取消关注成功'})
          }
          this.getContent()
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }).catch(() => {})
    },
    getSubscribeList () {
      this.listInfo = [];
      this.dataLoading = true
      this.$http({
        method: 'GET',
        url: this.$api.user.subscribeList,
        params: {
          recommendId: this.id,
          page: this.page.index,
          pageSize: this.page.size
        }
      }).then((res) => {
        this.dataLoading = false
        if (res.data.returnCode == 1) {
          // let data = res.data.returnObject.detailsList;
          let content = res.data.returnObject.detailsList
          for (let i in content) {
            let obj = {
              title: content[i].title,
              id: content[i].refId,
              type: content[i].type,
              listTitle: content[i].title,
              describe: content[i].content,
              issued: content[i].dispatchUnit,
              date: this.$common.transTime(content[i].releaseDate)[1],
              timeliness: content[i].timeliness,
              isDescribe: null,
              plate: {},
              show: false
            }
            this.listInfo.push(obj)
          }
          this.page.total = res.data.returnObject.total;
          // this.listTotal = res.data.returnObject.total
          // this.total = Math.ceil(this.listTotal / this.pageNum)
        }
      }).catch((err) => {
        this.dataLoading = false
        this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
      })
    },
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
    getContent () {
      this.$http({
        method: 'GET',
        url: this.$api.user.subscribeContent,
        params: {
          recommendId: this.id,
          userId: this.$cookie.get('userId')
        }
      }).then((res) => {
        if (res.data.returnCode == 1) {
          this.userInfo = res.data.returnObject.recommendAttr;
          this.listInfo = []
          this.getSubscribeList()
          this.loading = false
        }
      }).catch((err) => {
        this.loading = false
        
      })
    },
    selectPage(val) {
      this.page.index = val;
      this.getSubscribeList()
    },
    handlePageChange(val) {
      this.page.size = val;
      this.getSubscribeList();
    }
  }
}
</script>
<style lang="scss">
.topTenRule {
  .foot-pagination {
    padding: 30px 0;
    display: flex;
    align-items: center;
    text-align: inherit;
    .row {
      flex: 1;
      &:last-child {
        flex: inherit;
        .el-radio-button--mini .el-radio-button__inner {
          padding: 8px;
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
    .btn-prev, .btn-next, li {
      margin-right: 10px;
      width: auto;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
      box-sizing: border-box;
      padding: 0 8px;
      min-width: 30px;
      .el-icon {
        font-size: 14px;
      }
    }
    li:last-child {
      margin-right: 0;
    }
    .el-pager {
      li {
        font-size: 12px;
        color: #8d8d8d;
        font-weight: 400;
      }
      li.active {
        color: #fff;
        background: #ffb148;
      }
    }
    .btn-next {
      margin-left: 10px;
      color: #b4bccc;
    }
    .btn-prev {
      color: #b4bccc;
    }
  }
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
      /* 触发 hasLayout */ 
      zoom: 1; 
    }
    .title {
      font-size: 30px;
      line-height: 42px;
      font-weight: 600;
      margin-bottom: 8px;
      .cancelFollow {
        display: inline-block;
        width: 64px;
        height: 24px;
        padding: 0 8px;
        background-color: #D8D8D8;
        font-size: 12px;
        line-height:24px;
        color: #8F8F8F;
        font-weight: 400;
        border-radius: 3px;
        cursor: pointer;
      }
      .follow {
        display: inline-block;
        width: 53px;
        height: 23px;
        line-height: 23px;
        color: #fff;
        font-size: 12px;
        background-color: #FFB148;
        text-align: center;
        border-radius: 3px;
        cursor: pointer;
      }
    }
    .info {
      width: 896px;
      font-size: 12px;
      line-height: 20px;
      font-family:PingFangSC-Regular;
      margin-bottom: 30px;
    }
    .left {
      float: left;
      width: 896px;
    }
    .right {
      float: right;
      width: 292px;
      .advertisement {
        width: 100%;
        .advImg {
          margin-bottom: 15px;
          font-size: 0;
          display: inherit;
          img {
            width: 100%;
            border-radius: 3px;
          }
        }
      }
      .title {
        font-size: 14px;
        line-height: 20px;
        font-weight: 600;
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