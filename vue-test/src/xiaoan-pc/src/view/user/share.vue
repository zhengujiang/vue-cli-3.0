<template>
  <v-nav navIndex="3">
    <template slot="slotMain">
      <div id="share">
        <div class="content-box">
          <template v-if="shareContent.length>0">
            <div class="item" v-for="(list,index) in shareContent" @click="linkContent(list.id)">
              <el-row>
                <el-col :span="15" class="fbc2 left fontS">{{ list.createTime }}</el-col>
                <el-col :span="3">
                  <i class="iconfont web-bianji iconimg cancel" @click.stop="linkEdit(list.id)"
                     style="color:#ffb148;font-size: 17px;margin-top: -1px;"></i>
                </el-col>
                <el-col :span="3">
                  <i class="iconfont web-fenxiang2 iconimg cancel"
                     @click.stop="cancelShare(list.id, list.favouriteName)" style="color:#ffb148;"></i>
                </el-col>
                <el-col :span="3">
                  <i class="iconfont web-shanchu iconimg cancel" style="color:#ffb148"
                     @click.stop="delCollect(list.id, list.favouriteName)"></i>
                </el-col>
              </el-row>
              <img class="iconimg foledimg" :src="$image.user.folde">
              <div class="center textHidden" v-if="list.favouriteName.length < 12">{{ list.favouriteName }}</div>
              <div class="center textHidden" style="text-align: left" v-else>{{ list.favouriteName }}</div>
              <el-row class="fbc2 iconRow">
                <el-col :span="6" class="elcolFirst">
                  <i class="iconfont web-fagui1" style="color:#90b8f4;"></i> &nbsp;&nbsp;{{ list.lawCount }}
                </el-col>
                <el-col :span="6">
                  <i class="iconfont web-gonggao2" style="color:#ffd091;font-size: 17px;"></i> &nbsp;&nbsp;{{
                  list.caseCount }}
                </el-col>
                <el-col :span="6" class="elcolLast">
                  <i class="iconfont web-anli1" style="color:#ffa691;"></i> &nbsp;&nbsp;{{ list.caselawCount }}
                </el-col>
                <el-col :span="6" class="elcolLast">
                  <i class="iconfont web-yanbao" style="color:#8bdde4;"></i> &nbsp;&nbsp;{{ list.reportCount }}
                </el-col>
              </el-row>
            </div>
          </template>
          <template v-else>
            <v-noInfo :altText="''" :imgSrc="noshare"></v-noInfo>
          </template>
          <div class="clear"></div>
        </div>
      </div>
    </template>
  </v-nav>
</template>
<script>
  import nav from './nav.vue'
  export default {
    data() {
      return {
        noshare: this.$image.user.noshare,
        msg: '',
        shareContent: []
      }
    },
    // 使用其它组件
    components: {
      'v-nav': nav
    },
    // 方法
    computed: {},
    watch: {
      shareContent: function (val) {
        // if (this.$common.browserSort() !== 'Chrome') {
        for (var i = 0; i < val.length; i++) {
          if (val[i].favouriteName.length > 38) {
            val[i].favouriteName = val[i].favouriteName.substring(0, 38) + "..."
          }
        }
        // }
      }
    },
    methods: {
      cancelShare(id, name) {
        this.$confirm('取消分享' + name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'GET',
            url: this.$api.user.shareswitch,
            params: {
              favouriteId: id,
              userId: this.$cookie.get('userId'),
              isShare: false
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '取消分享成功'})
              this.getMyShare()
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
            }
          })
        }).catch(() => {
          //          this.$message({type: 'warning', message: '已取消删除'})
        })
      },
      delCollect(id, name) {
        this.$confirm('删除' + name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'GET',
            url: this.$api.user.delCollect,
            params: {
              id: id
            }
          }).then((res) => {
            console.log(res)
            if (res.data.returnCode == 1) {
              this.$message({type: 'success', message: '删除成功!'})
              this.getMyShare()
            }
          }).catch((err) => {
            this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
          })
        }).catch(() => {
          //          this.$message({type: 'warning', message: '已取消删除'})
        })
      },
      linkContent(index) {
        this.$router.push({path: '/collect/collectDetails?id=' + index + '&column=2'})
      },
      linkEdit(id) {
        this.$router.push('/collect/addCollect?id=' + id)
      },
      // 获取我分享的收藏夹
      getMyShare() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getMyCollect,
          params: {
            userId: this.$cookie.get('userId'),
            pageSize: 100,
            pageIndex: 1
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              var content = res.data.returnObject.list
              this.shareContent = content.filter((item) => {
                return item.share == true
              })
              for (let i in this.shareContent) {
                this.shareContent[i].createTime = this.$common.transTime(this.shareContent[i].createTime)[1]
              }
            } else {
              this.shareContent = []
            }
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }
    },
    // 生命周期函数
    created() {
      this.getMyShare()
    },
    mounted() {
    }
  }
</script>
<style lang="scss" scoped>
  #share {
    padding-bottom: 20px;
    .content-box {
      padding: 10px 0;
      border: 1px solid #e3e3e3;
      border-radius: 2px;
      background-color: #fff;
      min-height: 650px;
    }
    .left {
      text-align: left;
    }
    .fontS {
      font-size: 14px;
    }
    .right {
      text-align: right;
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
      .center {
        max-height: 70px;
        min-height: 70px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
      .foledimg {
        margin: 50px 0 30px 0;
      }
      .iconRow {
        margin-top: 25px;
        padding-top: 8px;
        border-top: 1px solid #e3e3e3;
        font-size: 14px;
        .iconimg {
          width: 14px;
        }
        .elcolFirst {
          text-align: left;
          line-height: 20px;
          img {
            float: left;
          }
        }
        .elcolLast {
          text-align: right;
          line-height: 20px;
        }
      }
      &:hover {
        -moz-box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
        -webkit-box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
        box-shadow: 5px 5px 15px rgba(0, 0, 0, .2);
      }
      .cancel {
        display: none;
      }
      &:hover .cancel {
        display: block;
        cursor: pointer;
      }
    }
    .noneshare {
      margin-left: 540px;
      margin-top: 250px;
    }
  }
</style>
