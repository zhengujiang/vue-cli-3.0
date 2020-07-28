<template>
  <div id="subscribeContent" v-loading="loading">
    <el-row :gutter="15">
      <el-col :span="24">
        <div class="title" v-show="this.userInfo.title">{{ this.userInfo.title }}</div>
        <el-row class="info">
          <el-col :span="4" v-show="this.userInfo.dispatchUnit">作者：
            <span>{{ this.userInfo.dispatchUnit }}</span>
          </el-col>
          <el-col :span="7" v-show="this.userInfo.createTime" class="time">发布日期：{{ this.userInfo.createTime }}</el-col>
          <el-col :span="7" v-show="this.userInfo.updateTime" class="time">更新日期：{{ this.userInfo.updateTime }}</el-col>
          <el-col :span="3" class="icolor editButton" v-if="this.userInfo.pdfUrl !== null">
            <div @click="clickSubscribe" v-if="tabSort">
              <i class="iconfont web-dingyue"></i>
              关注
            </div>
            <div @click="cancelSubscribe" v-else>
              <i class="iconfont web-icon_quxiaodingyue-"></i>
              取消关注
            </div>
          </el-col>
          <el-col :span="6" class="icolor editButton" v-else>
            <div @click="clickSubscribe" v-if="tabSort">
              <i class="iconfont web-dingyue"></i>
              关注
            </div>
            <div @click="cancelSubscribe" v-else>
              <i class="iconfont web-icon_quxiaodingyue-"></i>
              取消关注
            </div>
          </el-col>
          <el-col :span="3" class="icolor editButton" v-if="this.userInfo.pdfUrl !== null">
            <i class="iconfont web-pdf" style="color:#ff5562" ></i>
            <a :download="this.pdf[0].url" style="color:#ff5562" v-if="this.pdf.length !==0 ">培训资料</a>
          </el-col>
        </el-row>
        <div class="desc" v-show="this.userInfo.descrip">{{ this.userInfo.descrip }}</div>
        <div class="ppt" v-if="this.pdf.length !== 0">
          <div class="pptContent">
            <iframe v-for="list in this.pdf" :src="list.url" v-show="list.show" frameborder="0"></iframe>
          </div>
          <div class="select">
        <span class="leftArrow">
          <img :src="$image.user.leftArrow" alt="">
        </span>
            <span class="centerNum">{{num}}</span>
            <span class="rightArrow">
          <img :src="$image.user.rightArrow" alt="">
        </span>
          </div>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick" v-show="this.totalInfo.length > 0">
          <!--<v-list :info="this.totalInfo" sort="collect_dingyue" :cancelShare="shareFlase" :loading='this.loading'-->
                  <!--@linkTo="goLink"></v-list>-->
          <div class="totalInfo-card">
            <v-list :data="this.totalInfo" sort="collect_dingyue" :cancelShare="shareFlase"></v-list>
          </div>
          <div class="foot-pagination">
            <div class="row block">
              <el-pagination
                @current-change="selectPage"
                layout="prev, pager, next"
                :current-page="flip"
                :page-count="total">
              </el-pagination>
            </div>
            <div class="row">
              <el-radio-group size="mini" v-model="pageSize" @change="handlePageChange">
                <el-radio-button :label="30">30条</el-radio-button>
                <el-radio-button :label="50">50条</el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </el-tabs>
        <div v-show="this.totalInfo.length == 0" style="padding-top: 150px">
          <v-noInfo altText="暂无收藏内容！" :imgSrc="noInfoImg"></v-noInfo>
        </div>
      </el-col>
      <!-- <el-col :span="6">
        <template slot="adv">
          <v-adv :pageName="'投关检索'"></v-adv>
        </template>
      </el-col> -->
    </el-row>
  </div>
</template>
<script>
  import list from './components/list.vue'

  export default {
    data () {
      return {
        pageSize: 30,
        id: '',
        tabSort: '',
        shareKey: '',
        pdf: [],
        num: 1,
        page: 1,
        flip: 1, // 默认页码
        total: 0, // 总页数
        listTotal: 0,
        isContent: true,
        userInfo: Object,
        activeName: 'first',
        tab: '全部(166)',
        totalInfo: [],
        loading: true,
        shareFlase: false,
        noInfoImg: this.$image.prompt.noInfo
      }
    },
    filters: {},
    // 使用其它组件
    components: {
      'v-list': list
    },
    // 方法
    computed: {},
    watch: {
      '$route': function (val) {
        this.id = this.$route.query.id
        this.info = []
        this.pdf = []
        this.loading = true
        this.isContent = true
        // console.log('route = ', val)
        if (val.query.shareKey) {
          this.shareKey = val.query.shareKey
          this.getOthers()
        } else {
          this.getContent()
        }
      }
    },
    methods: {
      handlePageChange(val) {
        this.flip = 1;
        this.loading = true
        if (this.$route.query.shareKey) {
          this.shareKey = this.$route.query.shareKey
          this.getOthers()
        } else {
          this.shareKey = ''
          this.getContent()
        }
        // this.afficheSearch()
      },
      // 关注收藏夹
      clickSubscribe () {
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
          // this.$router.push('/subscribe')
          // this.$router.push('/follow/regulations')
          this.$router.push({path: this.$router.path, query: {id: this.id, sort: ''}})
          this.tabSort = ''
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 取消关注收藏夹
      cancelSubscribe () {
        console.log('sort')
        this.$confirm('取消关注' + this.userInfo.title + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.shareKey == '') {
            this.$http({
              method: 'GET',
              url: this.$api.user.cancelRecommend,
              params: {
                userId: this.$cookie.get('userId'),
                recommendId: this.id
              }
            }).then((res) => {
              console.log('取消关注', res)
              if (res.data.returnCode == 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '取消关注成功'})
              }
              // this.$router.push('/subscribe')
              // this.$router.push('/follow/regulations')
              this.$router.push({path: this.$router.path, query: {id: this.id, sort: 1}})
              this.tabSort = 1
            }).catch((err) => {
              console.log(err)
              this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
            })
          } else {
            this.$http({
              method: 'GET',
              url: this.$api.user.cancelSubscribe,
              params: {
                userId: this.$cookie.get('userId'),
                id: this.id
              }
            }).then((res) => {
              if (res.data.returnCode == 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '取消关注成功'})
              }
              this.$router.push('/subscribe')
            }).catch((err) => {
              console.log(err)
              this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
            })
          }
        }).catch(() => {
//          this.$message({type: 'warning', message: '已取消删除'})
        })
      },
      // 选择页数
      selectPage (i) {
        this.flip = i
        this.loading = true
        this.totalInfo = []
        this.getContent()
        console.log('=======>', i)
      },
      goLink (index, type) {
        if (type == 'law') {
          this.$common.openWindow('/rule/details?id=' + index)
        } else if (type == 'case') {
          this.$common.openWindow('/affiche/details?id=' + index)
        }
      },
      handleClick (tab) {
        console.log(tab.index)
      },
      // 获取关注列表
      getSubscribeList () {
        this.$http({
          method: 'GET',
          url: this.$api.user.subscribeList,
          params: {
            recommendId: this.id,
            page: this.flip,
            pageSize: this.pageSize
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            var content = res.data.returnObject.detailsList
            for (var i in content) {
              var obj = {
                title: content[i].title,
                id: content[i].refId,
                type: content[i].type,
                listTitle: content[i].title,
                describe: content[i].content,
                issued: content[i].dispatchUnit,
                date: this.$moment(content[i].releaseDate).format("YYYY年MM月DD日"),
                timeliness: content[i].timeliness,
                isDescribe: null,
                plate: {},
                show: false
              }
              this.totalInfo.push(obj)
              console.log(this.totalInfo);
              console.log(7777);
            }
            this.listTotal = res.data.returnObject.total
            this.total = Math.ceil(this.listTotal / this.pageSize)
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 获取关注他人的收藏夹
      getOthers () {
        this.userInfo = {}
        this.totalInfo = []
        this.$http({
          method: 'GET',
          url: this.$api.user.getCollectContent,
          params: {
            favourableId: this.id,
            shareKey: this.shareKey,
            userId: this.$cookie.get('userId'),
            page: this.flip,
            rows: this.pageSize,
            showType: 'total'
          }
        }).then((res) => {
          console.log('getOthers ', res)
          if (res.data.returnCode == 1) {
            var infoObj = res.data.returnObject.favourite
            this.userInfo = {
              title: infoObj.favouriteName ? infoObj.favouriteName : '',
              dispatchUnit: infoObj.userName ? infoObj.userName : '',
              createTime: this.$common.transTime(infoObj.createTime)[1] ? this.$common.transTime(infoObj.createTime)[1] : '',
              updateTime: this.$common.transTime(infoObj.updateTime)[1] ? this.$common.transTime(infoObj.updateTime)[1] : '',
              pdfUrl: null,
              pdf: '',
              descrip: infoObj.introduction ? infoObj.introduction : ''
            }
            var content = res.data.returnObject.collects
            this.listTotal = content.length
            this.total = Math.ceil(this.listTotal / this.pageSize)
            for (var i in content) {
              var obj = {
                title: content[i].title ? content[i].title : '',
                id: content[i].refId ? content[i].refId : '',
                type: content[i].type ? content[i].type : '',
                listTitle: content[i].title ? content[i].title : '',
                describe: content[i].content ? content[i].content : '',
                issued: content[i].faWenZiHao ? content[i].faWenZiHao : '',
                date: this.$common.transTime(content[i].publishTime)[1],
                timeliness: content[i].timeLiness ? content[i].timeLiness : '',
                isDescribe: null,
                plate: {}
              }
              this.totalInfo.push(obj)
            }
            this.loading = false
            console.log('totalInfo = ', this.totalInfo)
          } else if (res.data.returnCode == -2) {
            this.shareFlase = true
          } else if (res.data.returnCode == -1) {
            var infoObjs = res.data.returnObject.favourite
            this.userInfo = {
              title: infoObjs.favouriteName ? infoObjs.favouriteName : '',
              dispatchUnit: infoObjs.userName ? infoObjs.userName : '',
              createTime: this.$common.transTime(infoObjs.createTime)[1] ? this.$common.transTime(infoObjs.createTime)[1] : '',
              updateTime: this.$common.transTime(infoObjs.updateTime)[1] ? this.$common.transTime(infoObjs.updateTime)[1] : '',
              pdfUrl: null,
              pdf: '',
              descrip: infoObjs.introduction ? infoObjs.introduction : ''
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取收藏夹内容
      getContent () {
        this.$http({
          method: 'GET',
          url: this.$api.user.subscribeContent,
          params: {
            recommendId: this.id,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log('收藏夹内容', res, this.userInfo.pdfUrl)
          this.userInfo = res.data.returnObject.recommendAttr
          if (this.userInfo.pdfUrl) {
            console.log('pdfUrl', this.userInfo.pdfUrl)
            this.pdf = this.userInfo.pdfUrl.split('&')
            var arr = []
            for (var i in this.pdf) {
              var obj = {
                name: this.userInfo.pdfName.split('&')[i],
                url: this.$common.Trim(decodeURI(this.pdf[i])),
                show: false
              }
              if (i == 0) {
                obj.show = true
              }
              arr.push(obj)
            }
            this.pdf = arr
          }
          // console.log('pdf', this.pdf)
          document.title = this.userInfo.title ? this.userInfo.title : '关注内容'
          if (this.userInfo) {
            this.userInfo.createTime = this.$common.transTime(this.userInfo.releaseTime)[0]
            this.userInfo.updateTime = this.$common.transTime(this.userInfo.effectTime)[0]
          }
          if (res.data.returnCode == 1) {
            this.totalInfo = []
            this.getSubscribeList()
            this.loading = false
          } else if (res.data.returnCode == -1) {
            this.userInfo = res.data.returnObject.recommendAttr
            this.isContent = false
            this.loading = false
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '该收藏夹下没有收藏内容！'})
          }
        }).catch((err) => {
          this.loading = false
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }
    },
    // 生命周期函数
    created () {
      this.id = this.$route.query.id
      this.tabSort = this.$route.query.sort
      if (this.$route.query.shareKey) {
        this.shareKey = this.$route.query.shareKey
        this.getOthers()
      } else {
        this.shareKey = ''
        this.getContent()
      }
    },
    mounted () {
      console.log('id ==', this.id)
    }
  }
</script>
<style lang="scss">
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
</style>
<style lang="scss" scoped>
  #subscribeContent {
    .title {
      font-size: 16px;
      font-weight: 800;
      color: #323232;
    }
    .totalInfo-card {
      position: relative;
      min-height: 700px;
      width: 100%;
    }
    .info {
      padding: 10px 0 10px 0;
      color: #aeaeae;
      font-size: 14px;
      border-bottom: 1px solid #e3e3e3;
      .editButton {
        .iconimg {
          top: 4px;
        }
      }
    }
    .desc {
      padding: 10px 0;
      color: #8d8d8d;font-size: 14px;text-align: justify;
    }
    .ppt {
      width: 100%;
      height: 600px;
      border: 1px dashed #e3e3e3;
      border-radius: 2px;
      .pptContent {
        width: 800px;
        height: 530px;
        margin: 15px auto 0;
        border: 1px solid #e3e3e3;
        box-sizing: border-box;
        overflow: hidden;
        iframe {
          width: 100%;
          height: 100%;
          overflow-y: hidden;
        }
      }
      .select {
        width: 100%;
        height: auto;
        text-align: center;
        margin-top: 20px;
        span {
          display: inline-block;
        }
        .centerNum {
          font-size: 20px;
          color: #323232;
          margin: 0 25px;
        }
        .leftArrow, .rightArrow {
          width: 18px;
          height: 18px;

        }
      }
    }
    .icolor {
      color: #ffb148;
    }
    .time {
      text-align: center;
    }
    .editButton {
      cursor: pointer;
      text-align: right;
    }
    .pdfList {
      width: 100%;
      line-height: 20px;
      word-wrap: break-word;
      margin-bottom: 10px;
      display: block;
      color: #323232;
      &:hover {
        color: #ffb148;
        text-decoration: underline;
      }
    }
    .foot-pagination {
      padding: 30px 0;
    }
  }
</style>
