<template>
  <v-nav navIndex="1">
    <template slot="slotMain">
      <div id="subscibe" class="content">
        <template v-if="isList">
          <div class="title fc">已订阅学习资料</div>
          <div class="item" v-for="(list,index) in subscribeList" @click="linkTo(list.favouriteId)">
            <div class="itemtop">
              <span class="fbc2 fleft fontS">{{ list.createTime }}</span>
              <span class="fc fright cancel"
                    @click.stop="cancelSubscribe(list.favouriteId,list.sort,list.favourite.favouriteName)">
                <!--取消订阅-->
                <i class="iconfont web-icon_quxiaodingyue-"></i>
              </span>
            </div>
            <img class="iconimg foledimg" :src="$image.user.folde">
            <div class="center" v-if="list.favourite.favouriteName.length > 12">{{ list.favourite.favouriteName }}</div>
            <div class="center" style="text-align: center" v-else>{{ list.favourite.favouriteName }}</div>
            <el-row class="fbc2 iconRow">
              <el-col :span="6" class="elcolFirst"><i class="iconfont web-fagui1" style="color:#90b8f4;"></i>
                &nbsp;&nbsp;{{ list.favourite.lawCount }}
              </el-col>
              <el-col :span="6"><i class="iconfont web-gonggao2" style="color:#ffd091;font-size: 17px;"></i>
                &nbsp;&nbsp;{{ list.favourite.caseCount }}
              </el-col>
              <el-col :span="6" class="elcolLast"><i class="iconfont web-anli1" style="color:#ffa691;"></i>
                &nbsp;&nbsp;{{ list.favourite.caselawCount ? list.favourite.caselawCount : 0  }}
              </el-col>
              <el-col :span="6" class="elcolLast"><i class="iconfont web-yanbao" style="color:#8bdde4;"></i>
                &nbsp;&nbsp;{{ list.favourite.reportCount }}
              </el-col>
            </el-row>
          </div>
        </template>
        <div v-else>
          <img class="nosubscribe" :src="$image.user.nosubscribe">
        </div>

        <div class="clear"></div>
        <!-- 新增学习资料 -->
        <div class="title fc" v-if="recommendList.length !== 0">
          <span class="fleft">新增学习资料</span>
          <span class="fright"><i class="iconfont web-huanyipi2"></i>
          <span class="split fontS" @click="getRecommendCollect('add')">换一批</span></span>
        </div>
        <div class="listbox">
          <div class="list" v-for="(list,index) in recommendList" @click="linkTo(list.id, 'notSubscribe')">
            <div class="listTitle">
              <span>{{ list.title }}</span>
              <div class="inline fright fbc2 fontS">
                <span>{{ list.releaseTime }}</span>
                <i class="split fontS" style="color:#e3e3e3;width: 1px;height: 10px;background: #e3e3e3;display: inline-block"></i>
                <i class="iconfont web-dingyue" style="color:#ffb148;font-size: 16px;margin-top: 3px;"></i>
                <span class="fc split" @click.stop="subscribe(list.id)">订阅</span>
              </div>
            </div>
            <div class="listDesc fbc2">{{ list.descrip }}</div>
          </div>
        </div>
      </div>
    </template>
  </v-nav>
</template>

<script>
  import nav from './nav.vue'

  export default {
    data () {
      return {
        msg: '',
        rows: 1,
        listTotal: 3,
        subscribeList: [],
        isList: true,
        recommendList: []
      }
    },
    // 使用其它组件
    components: {
      'v-nav': nav
    },
    // 方法
    computed: {},
    watch: {
      subscribeList (val) {
        console.log('watch subscribeList', this.subscribeList)
        if (this.subscribeList !== []) {
          this.isList = true
        } else {
          this.isList = false
        }
        // if (this.$common.browserSort() !== 'Chrome') {
          for (var i = 0; i < val.length; i++) {
            if (val[i].favourite.favouriteName.length > 38) {
              val[i].favourite.favouriteName = val[i].favourite.favouriteName.substring(0, 38) + "..."
            }
          }
        // }
      }
    },
    methods: {
      // 跳转详情页面
      linkTo (index, sort) {
        if (sort) {
          this.$router.push({
            path: '/subscribeList/subscribeContent',
            query: {
              id: index,
              sort: this.rows
            }
          })
        } else {
          // console.log('this.subscribeList', this.subscribeList, index)
          for (var i = 0; i < this.subscribeList.length; i++) {
            if (index == this.subscribeList[i].favouriteId) {
              if (this.subscribeList[i].favourite.shareKey !== '' && this.subscribeList[i].favourite.shareKey !== undefined) {
                // console.log('123')
                this.$router.push({
                  path: '/subscribeList/subscribeContent', // /collect/collectDetails
                  query: {
                    id: index,
                    shareKey: this.subscribeList[i].favourite.shareKey
                  }
                })
              } else {
                // console.log('456')
                this.$router.push({
                  path: '/subscribeList/subscribeContent',
                  query: {
                    id: index
                  }
                })
              }
            }
          }
        }

      },
      // 订阅推荐收藏夹
      subscribe (collectId) {
        this.$http({
          method: 'GET',
          url: this.$api.user.subscribeRecommend,
          params: {
            recommendId: collectId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '订阅成功'})
          }
          this.getMySubscribe()
          this.getRecommendCollect()
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 获取推荐收藏夹列表
      getRecommendCollect (index) {
        if (index == 'add') {
          this.rows += 1
        }
        this.$http({
          method: 'GET',
          url: this.$api.user.getRecommendCollect,
          params: {
            userId: this.$cookie.get('userId'),
            rows: this.rows
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.recommendList = []
            this.recommendList = res.data.returnObject.favoriteList
            this.listTotal = res.data.returnObject.totalSize
            if (this.rows == this.listTotal) {
              this.rows = 0
            }
            for (let i in this.recommendList) {
              this.recommendList[i].releaseTime = this.$common.transTime(this.recommendList[i].releaseTime)[1]
            }
          } else if (res.data.returnCode == -1) {
            this.recommendList = []
          } else {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: res.data.returnMsg})
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 取消订阅收藏夹
      cancelSubscribe (listId, sort, name) {
        console.log('sort', sort)
        this.$confirm('取消订阅' + name + '是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (sort == 'recommend') {
            this.$http({
              method: 'GET',
              url: this.$api.user.cancelRecommend,
              params: {
                userId: this.$cookie.get('userId'),
                recommendId: listId
              }
            }).then((res) => {
              console.log('取消订阅', res)
              if (res.data.returnCode == 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '取消订阅成功'})
              }
              this.getMySubscribe()
              this.getRecommendCollect()
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
                id: listId
              }
            }).then((res) => {
              console.log('取消订阅', res)
              if (res.data.returnCode == 1) {
                this.$message({showClose: true, type: 'success', duration: 3000, message: '取消订阅成功'})
              }
              this.getMySubscribe()
            }).catch((err) => {
              console.log(err)
              this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
            })
          }
        }).catch(() => {
//          this.$message({type: 'warning', message: '已取消删除'})
        })
      },
      // 获取收藏的推荐收藏夹
      getRecommend () {
        this.$http({
          method: 'GET',
          url: this.$api.user.getRecommend,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            var content = {}
            content = res.data.returnObject
            var lawNum = ''
            var caseNum = ''
            var reportNum = 0
            // this.subscribeList = []
            if (content !== null && content.length !== 0) {
              for (let i = 0; i < content.length; i++) {
                for (let j in content[i].countList) {
                  if (content[i].countList[j].type == 'law') {
                    lawNum = content[i].countList[j].num
                    if (content[i].countList.length == 1) {
                      caseNum = 0
                    }
                  } else if (content[i].countList[j].type == 'announcement') {
                    caseNum = content[i].countList[j].num
                    if (content[i].countList.length == 1) {
                      lawNum = 0
                    }
                  }
                }
                this.subscribeList.push({
                  createTime: this.$common.transTime(content[i].releaseTime)[1],
                  favouriteId: content[i].id,
                  sort: 'recommend',
                  favourite: {
                    favouriteName: content[i].title,
                    lawCount: lawNum,
                    caseCount: caseNum,
                    reportCount: reportNum
                  }
                })
              }
            }
          } else if (res.data.returnCode == -1) {
            // console.log('abcabc', this.subscribeList)
            if (this.subscribeList !== []) {
              this.isList = true
            } else {
              this.isList = false
            }
            if (this.subscribeList.length == 0) {
              this.isList = false
            }
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 获取用户订阅收藏夹
      getMySubscribe () {
        this.$http({
          method: 'GET',
          url: this.$api.user.getMySubscribe,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          this.subscribeList = []
          if (res.data.returnCode == 1) {
            this.subscribeList = res.data.returnObject
            for (let i in this.subscribeList) {
              this.subscribeList[i].createTime = this.$common.transTime(this.subscribeList[i].createTime)[1]
            } // 20180105 1800
          }
          this.getRecommend() // 获取用户订阅的学习资料
        }).catch((err) => {
          console.log(err)
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }
    },
    // 生命周期函数
    created () {
      this.getMySubscribe()
      this.getRecommendCollect()
    },
    mounted () {
    }
  }
</script>

<style lang="scss" scoped>
  #subscibe {
    margin: 20px auto;
    padding: 0px 0 25px;
    border: 1px solid #e3e3e3;
    border-radius: 2px;
    background-color: #fff;
    .left {
      text-align: left;
    }
    .fontS {
      font-size: 14px;
    }
    .right {
      text-align: right;
    }

    .title {
      margin: 10px 25px;
      border-bottom: 1px dotted #e3e3e3;
      line-height: 40px;
      height: 40px;
      font-size: 16px;
      .split {
        cursor: pointer;
      }
    }
    .f16 {
      font-size: 20px;
    }
    .nosubscribe {
      margin: 30px 0 40px 540px;
    }
    .item {
      width: 249px;
      height: 300px;
      float: left;
      margin: 10px 25px 10px 25px;
      padding: 20px 15px;
      border: 1px solid #f0f1f5;
      box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
      border-radius: 2px;
      text-align: center;
      cursor: pointer;
      &:hover {
        -moz-box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
        -webkit-box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
      }
      .center {
        min-height: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3; // （行数）
        -webkit-box-orient: vertical;
        text-align: left;
      }
      .itemtop {
        width: 100%;
        height: 25px;
      }
      .foledimg {
        margin: 50px 0 30px 0;
      }
      .iconRow {
        margin-top: 18px;
        padding-top: 8px;
        border-top: 1px solid #e3e3e3;
        font-size: 14px;
        .iconimg{
          width: 14px;
        }
        .elcolFirst{
          text-align: left;line-height: 20px;
          img{
            float: left;
          }
        }
        .elcolLast{
          text-align: right;line-height: 20px;
        }
      }
      .cancel {
        display: none;
      }
      &:hover .cancel {
        display: block;
        cursor: pointer;
      }
    }
    .listbox {
      padding: 0 25px;
      margin-top: 15px;
      .list {
        padding: 5px 15px 15px 15px;
        height: auto;
        border: 1px solid #f0f1f5;
        margin-top: 15px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
        cursor: pointer;
        .listTitle {
          border-bottom: 1px solid #e3e3e3;
          line-height: 40px;
          height: 40px;
          font-size: 17px;
        }
        .listDesc {
          margin-top: 10px;
          font-size: 13px;
        }
        .split {
          cursor: pointer;
        }
        &:hover {
          -moz-box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
          -webkit-box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
          box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
          .listTitle {
            color: #ffb148;
            // text-decoration: underline;
          }
        }
      }
    }

  }
</style>
