<template>
  <!--<div>-->
  <el-dialog
    custom-class="collectDialog"
    :center=true
    :visible.sync="collectDialogInfo"
    width="430px"
    top="5vh"
    :before-close="handleClose">
    <div v-loading="loading" class="column" v-for="(list,index) in collectList"
         @click.stop="selectItem(list.id, 'L', index)">
      <span class="liTitle">{{ list.title }}</span>
      <el-checkbox v-model="list.checked" v-show="!editStatus" @click.stop="selectItem(list.id, 'L', index)"
                   class="che"></el-checkbox>
    </div>
    <div v-show="activeName=='my'" class="create">
      <el-input placeholder="输入收藏夹名称" v-model="collectName" size="small">
        <el-button slot="append"  type="primary" size="small" @click="newCollect">创建</el-button>
      </el-input>
    </div>
    <div slot="title">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="个人收藏" name="my">
        </el-tab-pane>
        <el-tab-pane label="团队收藏" name="team" v-if="userInfo.enterpriseUser">
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="confirm" v-if="!editStatus"  slot="footer">
      <div class="cancel" @click="cancelCollect">取 消</div>
      <div class="true" @click="addCollect">确 认</div>
    </div>
    <div class="confirm" v-else slot="footer">
      <div class="cancel" style="margin-left: 120px" @click="editCollect">编辑</div>
    </div>
  </el-dialog>
  <!--</div>-->
</template>

<script>
  export default {
    name: "collectDialog",
    components: {},
    props: {
      collectDialogInfo: {
        type: Boolean,
        default: false
      },
      info: {
        type: Object
      }
    },
    watch: {
      alreadyArr: function (val) {
        if (val.length !== 0) {
          console.log('val', val, this.defaultId)
          for (var i in this.alreadyId) {
            for (var j in val) {
              if (this.alreadyId[i] == val[j]) {
                this.collectList[i].checked = true
              }
              if (this.defaultId == val[j]) {
                this.checkedM = true
              } else {
                this.checkedM = false
              }
            }
          }
        }
      }
    },
    data() {
      return {
        defaultCollectObj: {},
        collectList: [],
        defaultId: '',
        alreadyId: [],
        alreadyArr: [],
        editStatus: false,
        activeName: 'my',
        userInfo: {},
        myCollectState: true,
        loading: false,
        collectName: ''
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.getDefaultContent();
    },
    methods: {
      // this.$api.teamFavourite.getFavourite
      getTeamFavourite() {
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
              this.collectList = [];
              this.alreadyId = [];
              var list = res.data.returnObject.list;
              let data = this.defaultCollectObj.concat(list);
              let newData = data.map((e) => {
                return {id: e.id, title: e.favouriteName, checked: false}
              });
              this.collectList = newData;
              this.alreadyId = newData.map(e => e.id);
              this.alreadyList()
            } else {
              this.collectList = [];
              this.alreadyId = [];
              let data = this.defaultCollectObj
              let newData1 = data.map((e) => {
                return {id: e.id, title: e.favouriteName, checked: false}
              });
              console.log('========>', newData1);
              this.collectList = newData1;
              this.alreadyId = newData1.map(e => e.id);
              this.alreadyList()
            }
          } else {
            this.collectList = [];
            this.alreadyId = [];
            let data = this.defaultCollectObj
            let newData1 = data.map((e) => {
              return {
                id: e.id,
                title: e.favouriteName,
                checked: false
              }
            });
            console.log('========>', newData1);
            this.collectList = newData1;
            this.alreadyId = newData1.map(e => e.id);
            this.alreadyList()
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      handleClick(val) {
        this.editStatus = false;
        this.collectList = [];
        if (val.name == 'my') {
          this.myCollectState = true;
          this.getDefaultContent();
        } else {
          this.myCollectState = false;
          this.getTeamDefault();
        }
      },
      // 获得团队默认收藏夹
      getTeamDefault() {
        this.loading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.teamFavourite.getTeamDefault,
          params: {
            companyId: this.userInfo.companyId
          }
        }).then((res) => {
          this.loading = false;
          if (res.data.returnCode == 1) {
            var content = res.data.returnObject
            this.defaultId = content.id;
            this.defaultCollectObj = [content]
            this.getTeamFavourite();
          }
        });
      },
      selectItem(id, sort, index) {
        this.itemId = id;
        this.listArr = []
        this.listPage = 1
        this.collectSort = sort
        // console.log('collectId=', this.collectId, id, sort, index)
        if (sort == 'M') {
          if (this.editStatus) {
            this.showList = true
            this.handleChangeM()
            // this.$nextTick(() => {
            //   this.contentStyle()
            // })
          } else {
            this.checkedM == true ? this.checkedM = false : this.checkedM = true
          }
        } else {
          if (this.editStatus) {
            this.showList = true
            this.collectId = id
            // this.getCollectContent(id)
            // this.$nextTick(() => {
            //   this.contentStyle()
            // })
          } else {
            this.collectList[index].checked == true ? this.collectList[index].checked = false : this.collectList[index].checked = true
          }
        }
      },
      // 取消收藏 重置选中样式
      cancelCollect() {
        for (var i in this.collectList) {
          this.collectList[i].checked = false
        }
        this.$emit('changeCollectDialog', false);
        this.editStatus = true
      },
      editCollect() {
        this.editStatus = false
        this.alreadyList()
      },
      handleClose() {
        this.$emit('changeCollectDialog', false);
        this.myCollectState = true;
      },
      // 获取默认收藏夹
      getDefaultContent() {
        this.loading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.user.getDefaultContent,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          this.loading = false;
          if (res.data.returnCode == 1) {
            var content = res.data.returnObject;
            this.defaultCollectObj = [content]
            this.defaultId = content.id;
            this.getMyCollectB();
          }
        })
      },
      // 获取我的收藏
      getMyCollectB() {
        let userId = "";
        this.myCollectState ? userId = this.$cookie.get('userId') : userId = this.userInfo.companyId;
        this.$http({
          method: 'GET',
          url: this.$api.user.getMyCollect,
          params: {
            userId: userId,
            pageSize: 100,
            pageIndex: 1
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.collectList = [];
              this.alreadyId = [];
              var list = res.data.returnObject.list;
              let data = this.defaultCollectObj.concat(list);
              let newData = data.map((e) => {
                return {id: e.id, title: e.favouriteName, checked: false}
              });
              this.collectList = newData;
              this.alreadyId = newData.map(e => e.id);
              this.alreadyList()
            } else {
              this.collectList = [];
              this.alreadyId = [];
              let data = this.defaultCollectObj
              let newData1 = data.map((e) => {
                return {id: e.id, title: e.favouriteName, checked: false}
              });
              console.log('========>', newData1);
              this.collectList = newData1;
              this.alreadyId = newData1.map(e => e.id);
              this.alreadyList()
            }
          } else {
            this.collectList = [];
            this.alreadyId = [];
            let data = this.defaultCollectObj
            let newData1 = data.map((e) => {
              return {
                id: e.id,
                title: e.favouriteName,
                checked: false
              }
            });
            console.log('========>', newData1);
            this.collectList = newData1;
            this.alreadyId = newData1.map(e => e.id);
            this.alreadyList()
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 已收藏的收藏夹id   alreadyCollect
      alreadyList() {
        if (!!!this.info.id) {
          this.$message({showClose: true, type: 'error', duration: 3000, message: '异常错误！获取不到详情'});
          return
        }
        var idStr
        if (this.alreadyId.length !== 0) {
          idStr = this.alreadyId.join(',')
        }
        this.$http({
          methods: 'GET',
          url: this.$api.user.alreadyCollect,
          params: {
            userId: this.$cookie.get('userId'),
            refId: this.info.id,
            favourableIds: idStr
          }
        }).then((res) => {
          console.log('已收藏的收藏夹id = ', res)
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.alreadyArr = res.data.returnObject
            }
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      // 添加收藏内容
      addCollect() {
        var arr = []
        if (this.checkedM) {
          arr.push(this.defaultId)
        }
        for (var i in this.collectList) {
          if (this.collectList[i].checked == true) {
            arr.push(this.collectList[i].id)
          }
        }
        var id = ''
        if (this.alreadyArr.length !== 0) {
          id = this.alreadyArr.join(',')
        }
        /* if (arr.length !== 0) { */
        var favourableid = arr.join(',')
        this.$http({
          methods: 'GET',
          url: this.$api.user.addCollectList,
          params: {
            refId: this.info.id,
            // favourableId: favourableid,
            title: this.info.title,
            publishTime: this.info.time,
            type: this.info.type,
            timeLiness: this.info.timeliness,
            userId: this.$cookie.get('userId'),
            choseFavourableId: favourableid, // 所选收藏夹
            isCollectId: id // 已被收藏的收藏夹id
          }
        }).then((res) => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '收藏成功！'})
            this.$emit('changeCollectDialog', false);
            this.editStatus = true
          } else if (res.data.returnCode == 2) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
            this.$emit('changeCollectDialog', false);
            this.editStatus = true
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '收藏失败！'})
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
        /* } */
      },
      // 打开默认收藏夹
      handleChangeM() {
        this.$http({
          method: 'GET',
          url: this.$api.user.getDefaultContent,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.checkedM == true ? this.checkedM = false : this.checkedM = true
            // console.log('defaultList', res.data.returnObject)
            var content = res.data.returnObject
            this.defaultId = content.id
            // this.getCollectContent(content.id)
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 新建收藏夹
      newCollect() {
        this.$http({
          method: 'POST',
          url: this.$api.user.addCollect,
          params: {
            userId: this.$cookie.get('userId'),
            favouriteName: this.collectName,
            isDefault: 0,
            introduction: '',
            limitation: ''
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
             this.$message({showClose: true, type: 'success', duration: 3000, message: '创建成功！'})
            this.getMyCollectB()
            this.newName = ''
          } else if (res.data.returnCode == -1) {
             this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写新收藏夹的名称！'})
          } else if (res.data.returnCode == 3) {
             this.$message({showClose: true, type: 'warning', duration: 3000, message: '该文件名称已存在！'})
          } else if (res.data.returnCode == 2) {
             this.$message({showClose: true, type: 'warning', duration: 3000, message: '最多创建十个收藏夹！'})
          }
        }).catch((err) => {
           this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }
    }
  }
</script>

<style lang="scss">
  .collectDialog {
    min-height: 500px;
    position: relative;
    .el-dialog__header {
      padding: 10px 10px 0 10px;
      border-bottom: 1px solid #e3e3e3;
      .el-tabs {
        .el-tabs__header {
          margin-bottom: 0;
          .el-tabs__item {
            font-size: 17px;
          }
          .el-tabs__nav {
            width: auto;
          }
        }
        .el-tabs__nav-wrap::after {
          height: 0px;
        }
      }
    }
    .el-dialog__body {
      max-height: 360px;
      overflow: hidden;
      overflow-y: auto;
      padding: 0 15px;
      position: relative;
      .column {
        padding: 12px 0;
        border-bottom: 1px solid #e3e3e3;
        font-size: 16px;
        color: #323232;
        cursor: pointer;
        transition: .3s all;
        .che {
          float: right;
          margin-right: 10px;
        }
        &:active {
          background: #f0f1f5;
        }
        &:hover {
          // background: #8d8d8d;
        }
      }
      .create {
        padding: 10px 0;
      }
      .el-input-group__append button.el-button {
        color: #fff;
        background-color: #ffb148;
        border-color: #ffb148;
        border-radius: 0 4px 4px 0;
      }
    }
    .el-dialog__footer {
      padding: 0 20px;
      position: absolute;
      bottom: 0px;
      .confirm {
        width: 100%;
        height: 65px;
        /*position: absolute;*/
        left: 0;
        bottom: 0;
        display: table;
        margin-top: 15px;
        // padding-top: 20px;
        .cancel, .true {
          float: left;
          margin-left: 25px;
          width: 150px;
          height: 45px;
          line-height: 45px;
          text-align: center;
          border: 1px solid #ffb148;
          border-radius: 4px;
          font-size: 16px;
          color: #8d8d8d;
          background: #ffefda;
          cursor: pointer;
          box-sizing: border-box;
          user-select: none;
          -ms-user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
          &:active {
            background: #fff;
          }
        }
        .true {
          // margin-right: 30px;
          float: right;
          border: 0;
          background: #ffb148;
          color: #fff;
        }
      }
    }
  }
</style>
