<template>
  <div id="application-collect">
    <header>
      <h4 class="card-title">团队收藏夹设置</h4>
    </header>
    <div class="application-collect-list">
      <div class="content-box">
        <div class="item dotted" @click="newFolder">
          <img class="iconimg foledimg" :src="$image.user.add">
          <el-button class="newFoleder">新建收藏夹</el-button>
        </div>
        <div class="item" v-for="(list,index) in shareContent" @click="linkContent(list.id)">
          <el-row>
            <el-col :span="15" class="fbc2 left fontS">{{ list.createTime }}</el-col>
            <el-col :span="3" v-if="list.share == true">
              <i class="iconfont web-bianji iconimg cancel" v-if="list.isDefault===0"
                 @click.stop="linkEdit(list.id)" style="color:#ffb148;font-size: 17px;margin-top: -1px;"></i>
            </el-col>
            <el-col :span="6" v-if="list.share == false">
              <i class=" iconfont web-bianji iconimg cancel" v-if="list.isDefault===0"
                 @click.stop="linkEdit(list.id)"
                 style="color:#ffb148;float: right;font-size: 17px;margin-top: -1px;"></i>
            </el-col>
            <el-col :span="3" class="edit-delete" v-show="list.share">
              <i class=" iconfont web-fenxiang2 iconimg cancel" v-if="list.isDefault===0"
                 @click.stop="cancelShare(list.id, list.favouriteName)" style="color:#ffb148;"></i>
            </el-col>
            <el-col :span="3" class="edit-delete">
              <i class="icon iconfont web-shanchu iconimg cancel" style="color:#ffb148" v-if="list.isDefault===0"
                 @click.stop="delCollect(list.id, list.favouriteName)"></i>
            </el-col>
          </el-row>
          <img class="iconimg foledimg" :src="$image.user.folde">
          <div class="center textHidden" v-if="list.favouriteName.length < 12">{{ list.favouriteName }}</div>
          <div class="center textHidden" style="text-align: left" v-else>{{ list.favouriteName }}</div>
          <el-row class="fbc2 iconRow">
            <el-col :span="6" class="elcolFirst">
              <i class="icon iconfont web-fagui1" style="color:#90b8f4;"></i> &nbsp;&nbsp;{{ list.lawCount }}
            </el-col>
            <el-col :span="6">
              <i class="icon iconfont web-gonggao2" style="color:#ffd091;font-size: 17px;"></i> &nbsp;&nbsp;{{list.caseCount }}
            </el-col>
            <el-col :span="6" class="elcolLast">
              <i class="icon iconfont web-anli1" style="color:#ffa691;"></i> &nbsp;&nbsp;{{ list.caselawCount }}
            </el-col>
            <el-col :span="6" class="elcolLast">
              <i class="icon iconfont web-yanbao" style="color:#8bdde4;"></i> &nbsp;&nbsp;{{ list.reportCount }}
            </el-col>
          </el-row>
        </div>
        <div class="clear"></div>
        <el-dialog title="扫码分享" :visible="showQrcode" width="320px" @close="showQrcode = false">
          <div class="qrcenter">
            <v-qrcode :text="shareUrl"></v-qrcode>
          </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
  import qrcode from '@/components/qrcode.vue'
  export default {
    name: "application-collect",
    // 使用其它组件
    components: {
      'v-qrcode': qrcode
    },
    data() {
      return {
        teamFavouriteData: {},
        shareUrl: '',
        shareContent: [],
        showQrcode: false,
        userInfo: {}
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.getMyDefaultShare()
    },
    watch: {
      shareContent: function (val) {
        // if (this.$common.browserSort() !== 'Chrome') {
        for (var i = 0; i < val.length; i++) {
          if (val[i].favouriteName.length > 38) {
            val[i].favouriteName = val[i].favouriteName.substring(0, 38) + '...'
          }
        }
        // }
      }
    },
    methods: {
      // 新建收藏夹
      newFolder() {
        // console.log('shareContent', this.shareContent.length)
        this.$router.push({path: '/admin/application/addCollect'})
        // if (this.shareContent.length >= 10) {
        //   this.$message({showClose: true, type: 'warning', duration: 3000, message: '最多创建十个收藏夹！'})
        // } else {
        //   this.$router.push({path: '/admin/application/addCollect'})
        // }
      },
      //
      linkContent(id) {
        this.$router.push({path: '/collect/collectDetails', query: {id: id, type: 'team'}});
      },
      //
      linkEdit(id) {
        this.$router.push({path: '/admin/application/addCollect', query: {id: id}});
      },
      //
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
              this.getMyDefaultShare()
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
            }
          })
        }).catch(() => {
          //          this.$message({type: 'warning', message: '已取消删除'})
        })
      },
      //
      delCollect(id, name) {
        this.$confirm('删除' + name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.teamFavourite.deleteById,
            params: {
              id: id,
              userId: this.$cookie.get('userId'),
              companyId: this.userInfo.companyId
            }
          }).then((res) => {
            // console.log(res)
            if (res.data.returnCode == 1) {
              this.$message({type: 'success', message: '删除成功!'})
              this.getMyDefaultShare()
            }
          }).catch((err) => {
            this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
          })
        }).catch(() => {
          // this.$message({type: 'warning', message: '已取消删除'})
        })
      },
      // 获取我分享的收藏夹
      getMyDefaultShare() {
        this.$http({
          method: 'GET',
          url: this.$api.teamFavourite.getTeamDefault,
          params: {
            companyId: this.userInfo.companyId
          }
        }).then((res) => {
          // console.log('res', res)
          if (res.data.returnCode == 1) {
            this.shareContent = []
            var content = res.data.returnObject
            content.createTime = this.$common.transTime(content.createTime)[1]
            this.shareContent[0] = content

            this.getMyShare()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //
      getMyShare() {
        this.$http({
          method: 'GET',
          url: this.$api.teamFavourite.getFavourite,
          params: {
            companyId: this.userInfo.companyId,
            pageSize: 100,
            pageIndex: 1
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              let list = res.data.returnObject.list;
              list.forEach((item) => {
                item.createTime = this.$common.transTime(item.createTime)[1]
              })
              this.shareContent = this.shareContent.concat(list);
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #application-collect {
    .application-collect-list {
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
      .edit-delete {
        i {
          line-height: 1;
        }
      }
      .right {
        text-align: right;
      }
      .dotted {
        border: 1px dotted #e3e3e3 !important;
      }
      .item {
        width: 249px;
        height: 300px;
        float: left;
        margin: 10px 25px 10px 25px;
        padding: 20px 15px;
        border: 1px solid #f5f5f5;
        box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
        border-radius: 2px;
        text-align: center;
        cursor: pointer;
        transition: 0.3s all;
        .center {
          max-height: 70px;
          min-height: 70px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
        .newFoleder {
          display: block;
          margin: 0 auto;
          background: #ffb148;
          font-size: 16px;
          color: #fff;
          width: 140px;
          height: 40px;
          border-radius: 4px;
          border: none;
          font-weight: 400 !important;
          /*-moz-box-shadow: 0px 0px 10px #ffb148;*/
          /*-webkit-box-shadow: 0px 0px 10px #ffb148;*/
          /*box-shadow: 0px 0px 10px #ffb148;*/
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
    }
  }
</style>
