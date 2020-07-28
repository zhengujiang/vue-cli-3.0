<template>
  <div id="collectDetails" v-loading="leading">
    <div class="title" v-show="favouriteInfo.favouriteName">{{favouriteInfo.favouriteName}}</div>
    <!---->
    <div class="about-info">
      <div class="row author" v-if="favouriteInfo.userName">
        <span class="textHidden">作者：{{favouriteInfo.userName}}</span>
      </div>
      <div class="row time">
        <span class="">发布日期：{{favouriteInfo.createTime}}</span>
      </div>
      <div class="row time">
        <span class="">更新日期：{{favouriteInfo.updateTime}}</span>
      </div>
      <div class="row share" v-if="!isTeam">
        <span class="shareText" @click="shareswitch" v-if="favouriteInfo.share"><i
          class="iconfont web-fenxiang2"></i>取消分享</span>
        <span class="shareText" @click="share" v-else><i class="iconfont web-fenxiang2"></i>分享</span>
      </div>
      <div class="row edit" v-if="!isTeam && favouriteInfo.isDefault == 0">
        <span class="editEdit" @click="goEidt()"><i class="iconfont web-bianji"></i>编辑</span>
      </div>
      <div class="row delete" v-if="!isTeam && favouriteInfo.isDefault == 0">
        <span class="delText" @click="goDelete"><i class="iconfont web-shanchu"></i>删除</span>
      </div>
    </div>
    <!---->
    <el-collapse-transition>
      <div class="desc" v-show="favouriteInfo.introduction">{{favouriteInfo.introduction}}</div>
    </el-collapse-transition>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tabPaneOption" :key="index"
                   :label="item.label+'(' + item.total + ')'" :name="item.id">
        <template v-if="item.total != 0">
          <v-list :key="index" :info="item.list" sort="collect" :loading="loading" @linkTo="goLink"
                  @delCollect="delcollect"></v-list>
          <div class="pagination">
            <div class="block" style="width: 100%;text-align: center" v-show="item.total > 4">
              <el-pagination :key="index" @current-change="selectPage" layout="prev, pager, next"
                             :current-page="item.pageIndex" :page-count="item.pageTotal">
              </el-pagination>
            </div>
          </div>
        </template>
        <v-noInfo v-show="item.total == 0"></v-noInfo>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="扫码分享" :visible="showQrcode" width="320px" @close="showQrcode = false">
      <div class="qrcenter">
        <v-qrcode :text="shareUrl"></v-qrcode>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import list from '@/components/list.vue'
  import qrcode from '@/components/qrcode.vue'

  export default {
    data() {
      return {
        leading: false,
        loading: true,
        tabData: [
          {label: '全部', name: '', type: 'total', id: '0'},
          {label: '法规', name: '', type: 'law', id: '1'},
          {label: '公告', name: '', type: 'case', id: '2'},
          {label: '案例', name: '', type: 'caselaw', id: '3'},
          {label: '研报', name: '', type: 'report', id: '4'},
          {label: '问答', name: '', type: 'qa', id: '5'},
          {label: 'e互动', name: '', type: 'interact', id: '6'},
          {label: 'IPO', name: '', type: 'publish', id: '7'}
        ],
        tabPaneOption: [
          {
            list: [],
            label: '全部',
            name: 'total',
            type: 'total',
            id: '0',
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            total: 0
          },
          {
            list: [],
            label: '法规',
            name: 'law',
            type: 'law',
            id: '1',
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            total: 0
          },
          {
            list: [],
            label: '公告',
            name: 'case',
            type: 'case',
            id: '2',
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            total: 0
          },
          {
            list: [],
            label: '案例',
            name: 'caselaw',
            type: 'caselaw',
            id: '3',
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            total: 0
          },
          {
            list: [],
            label: '研报',
            name: 'report',
            type: 'report',
            id: '4',
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            total: 0
          },
          {list: [], label: '问答', name: 'qa', type: 'qa', id: '5', pageIndex: 1, pageSize: 10, pageTotal: 0, total: 0},
          {
            list: [],
            label: 'e互动',
            name: 'interact',
            type: 'interact',
            id: '6',
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            total: 0
          },
          {
            list: [],
            label: 'IPO',
            name: 'publish',
            type: 'publish',
            id: '7',
            pageIndex: 1,
            pageSize: 10,
            pageTotal: 0,
            total: 0
          }
        ],
        favouriteInfo: {
          favouriteName: ''
        },
        showtype: 'total',
        isTeam: false,
        activeName: '0',
        queryId: '',
        //
        userInfo: {},
        showQrcode: false,
        shareUrl: '',
        enterprisesUserInfo: {}
      }
    },
    filters: {},
    // 使用其它组件
    components: {
      'v-list': list,
      'v-qrcode': qrcode
    },
    // 方法
    computed: {},
    watch: {
      '$route': function () {
        this.queryId = this.$route.query.id
        this.info = []
        this.loading = true
        // this.showtype = this.tabData[0].type;
        this.getContent();
        //
        this.isTeam = false;
        if (this.$route.query.type) {
          this.isTeam = false;
          if (this.$route.query.type == 'team') {
            this.isTeam = true;
          }
        }
      }
    },
    // 生命周期函数
    created() {
      this.enterprisesUserInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.queryId = this.$route.query.id;
      this.isTeam = false;
      if (this.$route.query.type) {
        this.isTeam = false;
        if (this.$route.query.type == 'team') {
          this.isTeam = true;
        }
      }
      this.getContent();
    },
    mounted() {
    },
    methods: {
      // 删除收藏夹
      delcollect(id, sort, list) {
        console.log('id=', this.queryId, sort, list)
        this.$confirm('删除这条收藏内容是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(_ => {
          let params = {
            id: id,
            favouriteId: this.queryId,
            type: sort
          }
          this.$axios.collect.deleteCollectById(params).then((res) => {
            console.log(res)
            if (res.data.returnCode == 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '删除成功'})
              this.getContent()
            }
          })
        }).catch(_ => {
//          this.$message({type: 'warning', message: '已取消删除'})
        })
      },
      // 选择页数
      selectPage(i) {
        console.log(this.tabPaneOption[this.activeName]);
        this.tabPaneOption[this.activeName].pageIndex = i;
        this.getContent()
      },
      //
      goLink(id, type) {
        var url = '';
        var watch = false;
        switch (type) {
          case 'law':
            url = '/rule/details?id=' + id;
            watch = true;
            break;
          case 'case':
            url = '/affiche/details?id=' + id;
            watch = true;
            break;
          case 'caselaw':
            url = '/case/details?id=' + id;
            watch = true;
            break;
          case 'report':
            url = '/report/details?id=' + id;
            watch = true;
            break;
          case 'qa':
            this.getQuestionIdByAnswerId(id);
            break;
          case 'interact':
            url = '/investor/answer?id=' + id;
            watch = true;
            break;
          case 'publish':
            url = '/ipo/details?id=' + id;
            watch = true;
            break;
        }
        if (watch) {
          this.$common.openWindow(url);
        }
      },
      //
      getQuestionIdByAnswerId(id) {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.getQuestionIdByAnswerId,
          params: {
            answerId: id
          }
        }).then((res) => {
          console.log(res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let url = '/xhAnswerDetail?questionId=' + res.data.returnObject + '&answerId=' + id;
            let that = this;
            var newWin = null,
              isBlock = !1;
            /** 新窗口被某些扩展阻止打开，会抛出错误，因此使用try..catch **/
            try {
              newWin = that.$common.openWindow(url);
              /** 新窗口被阻止时，返回值是undefined或null**/
              (!newWin) && (isBlock = !0);
            } catch (ex) {
              isBlock = !0;
            }
            if (isBlock) {
              // 被拦截
              that.$router.push('/xhAnswerDetail?questionId=' + res.data.returnObject + '&answerId=' + id);
            }
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '问题不存在或者已删除！'})
          }
        }).catch((err) => {
          console.warn(err);
        })
      },
      //
      goEidt() {
        this.$router.push('/collect/addCollect?id=' + this.queryId);
      },
      //
      handleClick(tab) {
        console.log('handleClick', tab);
        this.tabPaneOption[this.activeName].pageIndex = 1
        this.showtype = this.tabPaneOption[tab.index].type;
        this.getContent()
      },
      //
      goDelete() {
        this.$confirm('删除' + this.favouriteInfo.favouriteName + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'GET',
            url: this.$api.user.delCollect,
            params: {
              id: this.favouriteInfo.id
            }
          }).then((res) => {
            console.log(res)
            if (res.data.returnCode == 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '删除成功!'})
              this.$router.push('/favorite')
            }
          }).catch((err) => {
            this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
          })
        }).catch(() => {
        })
      },
      //
      share() {
        this.shareUrl = this.$api.share.collectDetails + this.queryId
        this.showQrcode = true
      },
      //
      shareswitch() {
        this.$confirm('取消分享' + this.favouriteInfo.favouriteName + ', 是否继续?', '取消分享', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'GET',
            url: this.$api.user.shareswitch,
            params: {
              favouriteId: this.queryId,
              userId: this.$cookie.get('userId'),
              isShare: false
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '取消分享成功'})
              this.getContent()
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
            }
          })
        }).catch(() => {
        })
      },
      // 获取收藏夹内容
      getContent() {
        this.leading = true;
        this.loading = true;
        this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
        let userId = this.$cookie.get('userId');
        if (this.$route.query.type) {
          this.isTeam = false;
          if (this.$route.query.type == 'team') {
            this.isTeam = true;
            userId = this.enterprisesUserInfo.companyId
          }
        }
        let params = {
          favourableId: this.queryId,
          userId: userId,
          page: this.tabPaneOption[this.activeName].pageIndex,
          rows: this.tabPaneOption[this.activeName].pageSize,
          showType: this.showtype,
          isDesktop: 'y'
        };

        this.$axios.collect.getCollectContent(params).then((res) => {
          setTimeout(() => {
            this.leading = false;
            this.loading = false;
          }, 500)
          console.log('收藏夹内容', res, this.leading);
          let favouriteInfo = res.data.returnObject.favourite;
          this.favouriteInfo = favouriteInfo;
          if (this.favouriteInfo) {
            this.favouriteInfo.createTime = this.$common.transTime(this.favouriteInfo.createTime)[0]
            this.favouriteInfo.updateTime = this.$common.transTime(this.favouriteInfo.updateTime)[0]
          }
          // this.userInfo = res.data.returnObject.favourite;
          document.title = favouriteInfo.favouriteName ? favouriteInfo.favouriteName : '收藏夹内容'
          let content = [], total = 0;
          //
          if (res.data.returnObject && res.data.returnCode == 1) {
            content = res.data.returnObject.collects.map((item) => {
              return {
                title: item.title, id: item.refId, collectId: item.id, type: item.type,
                listTitle: item.title, describe: item.content, issued: item.faWenZiHao,
                date: this.$common.transTime(item.publishTime)[1], timeliness: item.timeLiness, plate: {}
              }
            });
            total = res.data.total;
          }
          if (res.data.returnCode == -1) {
            total = favouriteInfo.caseCount + favouriteInfo.lawCount + favouriteInfo.caselawCount + favouriteInfo.reportCount + favouriteInfo.interactCount + favouriteInfo.publishCount
          }
          //
          //
          this.tabPaneOption.forEach((item, index) => {
            if (item.type == 'total') {
              item.total = total;
            }
            if (item.type == 'law') {
              item.total = favouriteInfo.lawCount;
            }
            if (item.type == 'case') {
              item.total = favouriteInfo.caseCount;
            }
            if (item.type == 'caselaw') {
              item.total = favouriteInfo.caselawCount;
            }
            if (item.type == 'report') {
              item.total = favouriteInfo.reportCount;
            }
            if (item.type == 'qa') {
              item.total = favouriteInfo.qaCount;
            }
            if (item.type == 'interact') {
              item.total = favouriteInfo.interactCount;
            }
            if (item.type == 'publish') {
              item.total = favouriteInfo.publishCount;
            }
            if (item.type == this.showtype) {
              item.list = content;
            }
            //
            item.pageTotal = Math.ceil(item.total / item.pageSize)

          })
          console.log('tabPaneOption', this.tabPaneOption);
          //
        }).catch((error) => {
          setTimeout(() => {
            this.leading = false;
          }, 3000)
        })
      }
    }
  }
</script>
<style lang="scss">
  .el-pager li.active + li {
    border-left: 1px solid #e3e3e3;
  }
  .el-message-box__status.el-icon-warning {
    color: #ffb148;
  }
  .pagination {
    width: 400px;
    height: auto;
    margin: 32px auto;
    .btn-prev, .btn-next, li {
      margin-right: 10px;
      width: 30px;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
      box-sizing: border-box;
      padding: 0;
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
  .el-tabs__nav-wrap::after {
    height: 1px;
    background-color: #e3e3e3;
  }
  #collectDetails {
    .borderNone {
      border-bottom: 1px solid #e3e3e3 !important;
      padding-bottom: 8px;
    }
  }
</style>
<style lang="scss" scoped>
  #collectDetails {
    height: 100%;
    .title {
      font-size: 16px;
      font-weight: 800;
      min-height: 28px;
      color: #323232;
    }
    .about-info {
      display: flex;
      width: 100%;
      height: 45px;
      align-items: center;
      > .row {
        flex: 1;
        padding: 10px 0;
        color: #aeaeae;
        font-size: 14px;
        text-align: left;
        &.author {
          flex: 0 0 20%;
          .textHidden {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 181px;
          }
        }
        &.share {
          flex: 0 0 10%;
          text-align: right;
          .shareText {
            cursor: pointer;
          }
          span {
            color: #FFB148;
          }
        }
        &.edit {
          flex: 0 0 10%;
          text-align: right;
          .editText {
            cursor: pointer;
          }
          span {
            color: #FFB148;
          }
        }
        &.delete {
          text-align: right;
          flex: 0 0 10%;
          .delText {
            cursor: pointer;
          }
          span {
            color: #FFB148;
          }
        }
      }
    }
    .desc {
      padding: 10px 0;
      color: #8d8d8d;
      font-size: 14px;
      text-align: justify;
    }
    .icolor {
      color: #ffb148;
    }
    .time {
      text-align: center;
    }
    .editButton {
      cursor: pointer;
      text-align: center;
    }
    .editButton:last-child {
      text-align: right;
    }

    .nocollect {
      margin-left: 370px;
      margin-top: 150px;
    }
    .qrcenter {
      margin-left: 12px;
    }
  }
</style>
