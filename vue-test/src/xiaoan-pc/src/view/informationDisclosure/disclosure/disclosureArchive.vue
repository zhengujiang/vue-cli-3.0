<template>
  <div class="disclosure-archive" id="disclosure-archive">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card proceed" shadow="never" body-style="padding:0">
          <div class="item">
            <el-input prefix-icon="el-icon-search" clearable placeholder="搜索事项" class="addSelect" size="small"
                      v-model="searchWord" @input="searchWardInput">
              <!--<el-button type="primary" size="small" slot="append" icon="el-icon-search"></el-button>-->
            </el-input>
          </div>
          <div v-if="selectDisclosureItemList.length >0">
            <el-collapse accordion class="collapse-head-select" v-model="activeNames" @change="handleChange">
              <el-collapse-item :name="list.id" v-for="(list, index1) in selectDisclosureItemList" :key="index1">
                <div class="title" slot="title">{{list.date}}</div>
                <div class="collapse-select-list">
                  <div class="list-type-item" :class="{'is-active':item.checked}" v-for="(item, index2) in list.data">
                    <ul class="year-ul">
                      <li class="title" :title="item.itemName" @click="clickHandle(index1, index2)">{{item.itemName}}
                      </li>
                      <li class="icon-all">
                        <i @click="cancelArchivedItemMain(item.id)" title="撤销归档" class="iconfont web-archive"></i>
                      </li>
                      <li class="about">{{item.nodeCount}}项</li>
                    </ul>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <div class="no text-black3" v-else>暂无数据</div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card id="disclosureItemBox" class="box-card proceed right-content" shadow="never" body-style="padding:20px"
                 v-if="this.disclosureItemList.length>0">
          <el-row class="title-flex">
            <el-col :span="24">
              <div>{{disclosureItem.itemName}}</div>
            </el-col>
            <!-- <el-col :span="3">共享事项 <i class="icon iconfont icon-share"></i></el-col>
             <el-col :span="3" @click="addCalendarShow = true">添加到日历 <i class="icon iconfont icon-calendar"></i></el-col>-->
          </el-row>
          <div class="title-flex">
            <div class="falde-item about">
              <span class="name">创建者：{{decodeURIComponent(decodeURIComponent(disclosureItem.createUserName))}}</span>
              <span>创建日期：{{$common.transTime(disclosureItem.createTime)[1]}}</span>
              <span>更新日期：{{$common.transTime(disclosureItem.updateTime)[1]}}</span>
            </div>
            <div class="falde-item fun">
              <span @click="cancelArchivedItemMain(disclosureItem.id)">撤回归档</span>
              <span @click="printf">打印清单</span>
              <span @click="saveToTemplate">存为信披模板</span>
              <!--<span @click="deleteClosureItemMain">删除</span>-->
            </div>
          </div>
          <el-table class="box-table-proceed" :data="itemNodeList" style="width: 100%">
            <!--<el-table-column prop="id" label="id"></el-table-column>-->
            <el-table-column label="序号" header-align="left" align="left" width="50">
              <template slot-scope="scope">
                <div class="indexBox">
                  <div>{{ scope.$index + 1 }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="itemNodeStartDate" label="起止时间">
              <template slot-scope="scope">
                <!--<span
                  v-if="scope.row.itemNodeStartDate != 0">{{$common.transTime(scope.row.itemNodeStartDate)[1]}}</span>
                <span
                  v-if="!(scope.row.itemNodeStartDate == 0 || scope.row.itemNodeEndDate == 0 || !scope.row.itemNodeStartDate || !scope.row.itemNodeEndDate)">~</span>
                <span v-if="scope.row.itemNodeEndDate != 0">{{$common.transTime(scope.row.itemNodeEndDate)[1]}}</span>-->
                {{scope.row.startEndDate}}
              </template>
            </el-table-column>
            <el-table-column prop="itemNodeName" label="节点名称" width="400">
              <template slot-scope="scope">
                <el-popover placement="bottom-start" width="660" trigger="hover"
                            @show="getPointByTemplateId(scope.row)">
                  <div class="itemNodeNameHoverInfo">
                    <div class="addEventDialog" width="660px">
                      <div class="el-dialog__header title">{{scope.row.itemNodeName}}</div>
                      <el-row>
                        <el-col :span="4" class="title">合规要点</el-col>
                        <el-col :span="20" class="desc">{{showNodeInfo.hegui}}</el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="4" class="title">相关法规</el-col>
                        <el-col :span="20" class="desc" v-if="showNodeInfo.relationList.length>0">
                          <a :href="'/rule/details?id='+item.relationLawId" target="_blank"
                             v-for="(item,index) in showNodeInfo.relationList">{{item.relationLawName}}</a>
                        </el-col>
                        <el-col :span="20" class="desc" v-else>
                          暂无
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <!--<el-button slot="reference">click 激活</el-button>-->
                  <div slot="reference" @click="getPointByTemplateId(scope.row)" class="pointer">
                    {{scope.row.itemNodeName}}
                  </div>
                </el-popover>

                <!--<div @click="getPointByTemplateId(scope.row)" class="pointer">{{scope.row.itemNodeName}}</div>-->
              </template>
            </el-table-column>
            <el-table-column prop="updateDate" label="编辑记录" width="270" header-align="center" align="center">
              <template slot-scope="scope">
                <div>{{scope.row.updateUserName + '编辑于'}}</div>
                <div>{{$common.transTime(scope.row.updateDate)[2]}}</div>
              </template>
            </el-table-column>

          </el-table>
        </el-card>
        <el-card class="box-card proceed right-content" shadow="never" style="padding-top:10%;" v-else>
          <v-noInfo :altText="'暂时没有事项'" :imgSrc="noneImg"></v-noInfo>
          <div class="center">
            <el-button class="addEvent" type="primary" @click="dialogVisible = true">
              <i class="icon iconfont web-editor"></i>&ensp;创建事项
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--弹出框-->
    <!--<el-dialog id="addEventDialog" top="35vh" :visible.sync="centerDialogVisible" width="620px">
      <span slot="title">{{showNodeInfo.nodeName}}</span>
      <el-row>
        <el-col :span="4" class="title">合规要点</el-col>
        <el-col :span="20" class="desc">{{showNodeInfo.hegui}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="4" class="title">相关法规</el-col>
        <el-col :span="20" class="desc" v-if="showNodeInfo.relationList.length>0">
          <a :href="'/rule/details?id='+item.id" target="_blank" v-for="(item,index) in showNodeInfo.relationList">{{item.relationLawName}}</a>
        </el-col>
        <el-col :span="20" class="desc" v-else>
          暂无
        </el-col>
      </el-row>
    </el-dialog>-->
    <add-event v-model="dialogVisible" @close="closeAddEvent"></add-event>
  </div>
</template>

<script>
  import AddEvent from './components/addEvent.vue'
  import ElRow from "element-ui/packages/row/src/row";
  export default {
    name: "disclosure-archive",
    data() {
      return {
        id: '',
        searchWord: '',
        activeNames: [],
        dialogVisible: false,
        noneImg: this.$image.disclosure.default,
        centerDialogVisible: false,
        disclosureItemList: [], // 左侧事项列表
        selectDisclosureItemList: [], // 左侧事项列表
        itemNodeList: [], // 右侧表格节点列表
        disclosureItem: {},  // 当前选中项
        showNodeInfo: {
          nodeName: '',
          hegui: '暂无',
          relationList: []
        }
      }
    },
    components: {
      ElRow,
      AddEvent
    },
    created() {
      this.id = this.$route.query.id
      this.userId = this.$cookie.get('userId')
      this.getArchivedItemMain()

    },
    watch: {
      '$route': function () {
        this.id = this.$route.query.id
        // this.getArchivedItemMain()
      }
    },
    methods: {
      resetData(id) {
        // this.$router.push({path: '/disclosure/archive', query: {id: this.disclosureItemList[i1].data[i2].id}})
        // this.$router.push({path: '/loading', query: {url: '/disclosure/archive?id=' + this.disclosureItemList[i1].data[i2].id}});
        this.$router.push({path: '/loading', query: {url: '/disclosure/archive?id=' + id}});
      },
      searchWardInput(val) {
        // console.log(val);
        let data = this.handleSelect(this.disclosureItemList, val, 'data', 'itemName');
        this.selectDisclosureItemList = data.data;
        //
        this.activeNames = data.activeNames;
        if (data.activeNames.length == 0) {
          this.selectDisclosureItemList.forEach((item1) => {
            item1.data.forEach((item2) => {
              this.$set(item2, 'checked', false);
              if (item2.id == this.disclosureItem.id) {
                this.$set(item2, 'checked', true);
                this.activeNames.push(item1.id);
              }
            })
          })
        }
      },
      // 左侧事项点击事件
      clickHandle(i1, i2) {
        this.disclosureItemList.forEach((item1) => {
          item1.data.forEach((item2) => {
            this.$set(item2, 'checked', false);
          })
        })
        //
        this.$set(this.disclosureItemList[i1].data[i2], 'checked', true);
        this.disclosureItem = this.disclosureItemList[i1].data[i2];
        this.getItemNodeList(this.disclosureItemList[i1].data[i2].id);
        // this.resetData(this.disclosureItemList[i1].data[i2].id)
      },
      //
      closeAddEvent(val) {
        this.dialogVisible = false
      },
      handleChange(val) {
        console.log(val);
      },
      // 获取事项列表
      getArchivedItemMain() {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getArchivedItemMain,
          params: {
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject) {
              let disclosureItemList = res.data.returnObject ? res.data.returnObject : []
              disclosureItemList.forEach((item1, index) => {
                this.$set(item1, 'id', item1.date);
                item1.data.forEach((item2) => {
                  this.$set(item2, 'search', true);
                  this.$set(item2, 'checked', false);

                })
              });
              //
              this.activeNames = [];
              this.activeNames.push(disclosureItemList[0].id);
              this.$set(disclosureItemList[0].data[0], 'checked', true);
              //
              this.selectDisclosureItemList = disclosureItemList;
              this.disclosureItemList = disclosureItemList;
              //
              this.disclosureItem = this.disclosureItemList[0].data[0]
              this.getItemNodeList(this.disclosureItem.id)
            } else {
              this.selectDisclosureItemList = [];
              this.disclosureItemList = [];
            }
          } else {
            this.disclosureItemList = []
            this.selectDisclosureItemList = []
          }
        })
      },
      // 获取节点列表
      getItemNodeList(itemId) {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getItemNodeList,
          params: {
            itemId: itemId,
            pageNum: 1,
            pageSize: 100,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.itemNodeList = res.data.returnObject
            this.itemNodeList.forEach((item) => {
              let startDate = item.itemNodeStartDate
              let endDate = item.itemNodeEndDate
              if (!startDate || startDate == 0) {
                startDate = ''
              } else {
                startDate = this.$common.transTime(startDate)[1]
              }
              if (!endDate || endDate == 0) {
                endDate = ''
              } else {
                endDate = this.$common.transTime(endDate)[1]
              }
              if (startDate && endDate) {
                if (startDate != endDate) {
                  item.startEndDate = startDate + '~' + endDate
                } else {
                  item.startEndDate = startDate
                }
              } else {
                item.startEndDate = startDate + endDate
              }
            })
          } else {
            this.itemNodeList = []
          }
        })
      },
      // 打印
      printf() {
        let newWindow = window.open('_blank')   // 打开新窗口
        let codestr = document.querySelector('#disclosureItemBox').innerHTML   // 获取需要生成pdf页面的div代码
        let cssStr = `<style>
          .title-flex{display:flex; line-height:30px }
          .fun {display:none}
          .about {line-height:40px }
          .el-col-18 {font-size: 16px;font-weight: 600;}
          .el-col-3 {display:none}
          td,th{border:solid #e3e3e3; border-width:0px 1px 1px 0px; padding:10px 0px;text-align: left;}
          th {border-bottom: 0;}
          table{border:solid #e3e3e3; border-width:1px 0px 0px 1px;}
          img {display:none;}
          .el-col-18 {color: #323232}
          table {border-left:1px solid #e3e3e3;}
          .is-left {text-align: left;}
        </style>`
        newWindow.document.write(codestr + cssStr)   // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
        newWindow.print()   // 打印当前窗口
      },
      //
      //
      handleSelect(data, queryString, itemListOne, itemListTwo) {
        // 需要处理的数据集合 // 模糊查询的关键词 // 一级的字段 // 二级的字段
        let selectedData = [];
        let returnSelectData = [];
        let activeNames = []; // 选中的id
        let restaurantsStr = JSON.stringify(data);
        let restaurants = JSON.parse(restaurantsStr);
        //
        if (queryString.trim()) {
          if (itemListTwo) {
            // 如果有二级的关键词 就检索
            restaurants.forEach((item) => {
              item[itemListOne] = queryString ? item[itemListOne].filter(this.createFilter(queryString, itemListTwo)) : item[itemListOne];
              selectedData.push(item);
              //
            });
            selectedData.forEach((item) => {
              if (item[itemListOne].length > 0) {
                item.show = true;
                console.log('item.id', item.id);
                activeNames.push(item.id);
                returnSelectData.push(item);
              }
            })
          } else {
            // 如果没有二级的关键词
            restaurants = queryString ? restaurants.filter(this.createFilter(queryString, itemListOne)) : restaurants;
            activeNames = [];
            returnSelectData = restaurants;
          }
          // // // // // // //
        } else {
          returnSelectData = data;
        }
        //
        return ({activeNames: activeNames, data: returnSelectData})
      },
      // 过滤获取到的
      createFilter(queryString, itemList) {
        return (string) => {
          return (string[itemList].toLowerCase().indexOf(queryString.toLowerCase()) > -1);
        };
      },
      // ---------顶部按钮事件----------- //
      // 撤回归档
      cancelArchivedItemMain(disclosureItemId) {
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.cancelArchivedItemMain,
          params: {
            itemId: disclosureItemId,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '撤回成功'});
            this.getArchivedItemMain()
          } else {
            this.$message({showClose: true, type: "error", duration: 3000, message: '撤回失败'});
          }
        })
      },
      // 存为信披模板
      saveToTemplate() {
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.saveToTemplate,
          params: {
            mainId: this.disclosureItem.id,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '存为信披模板成功'});
          } else {
            this.$message({showClose: true, type: "error", duration: 3000, message: '存为信披模板失败'});
          }
        })
      },
      // 删除事项
      deleteClosureItemMain() {
        this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'delete',
            url: this.$api.disclosure.deleteClosureItemMain,
            params: {
              itemId: this.disclosureItem.id,
              userId: this.userId
            }
          }).then((res) => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'});
            } else {
              this.$message({showClose: true, type: "error", duration: 3000, message: '删除失败'});
            }
          })
        }).catch(() => {
        })
      },
      // 点击节点名称获取要点信息
      getPointByTemplateId(item) {
        this.centerDialogVisible = true
        this.showNodeInfo.nodeName = item.itemNodeName
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getPointByTemplateId,
          params: {
            itemId: this.disclosureItem.itemTemplateId,
            nodeName: item.itemNodeName
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            // this.itemNodeList = res.data.returnObject
            this.showNodeInfo.hegui = res.data.returnObject.compliancePoint
            this.showNodeInfo.relationList = res.data.returnObject.relationList ? res.data.returnObject.relationList : []
          } else {
            // this.itemNodeList = []
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .el-popover {
    padding: 0;
  }
  .addEventDialog {
    .el-dialog__header {
      color: #323232;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 1px solid #dcdfe6;
      /*padding-right: 30px;*/
      padding: 10px 20px;
    }
    .el-row {
      padding: 5px 20px;
    }
    .el-dialog--center {
      padding: 20px;
    }
    .el-dialog__body {
      padding: 20px;
    }
    .title {
      font-weight: bold;
      font-size: 14px;
      line-height: 25px;
    }
    .desc {
      color: #aeaeae;
      font-size: 14px;
      line-height: 25px;
      a {
        display: block;
        color: #aeaeae;
        font-size: 14px;
        line-height: 25px;
        &:hover {
          color: #ffb148;
        }
      }
    }
  }
  #disclosure-archive {
    .box-card {
      margin-top: 20px;
      min-height: 100px;
      &.proceed {
        min-height: 785px;
        margin-bottom: 20px;
        .no {
          text-align: center;
          font-size: 14px;
        }
        .collapse-head-select {
          .el-collapse-item {
            .el-collapse-item__header {
              padding: 0 10px;
              transition: all .3s;
              &.is-active {
                .title {
                  color: #ffb148;
                }
                i {
                  color: #ffb148;
                }
              }
              .el-collapse-item__arrow {
                margin-right: 0;
              }
              .title {
                font-size: 16px;
              }
            }
          }
          .el-collapse-item__content {
            padding-bottom: 0;
          }
          .collapse-select-list {
            border-top: 1px solid #ebeef5;
            .list-type-item {
              &.is-active {
                background-color: rgba(255, 177, 72, 0.1);
                color: #ffb148;
                .title {
                  color: #ffb148;
                }
              }
              .year-ul {
                display: flex;
                align-items: center;
                height: 40px;
                li {
                  flex: 1;
                  &.title {
                    text-align: left;
                    font-size: 14px;
                    cursor: pointer;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    flex: 0 0 80%;
                  }
                  &.icon-all {
                    display: none;
                    i {
                      font-size: 14px;
                      cursor: pointer;
                    }
                  }
                }
              }
              &:hover {
                background-color: rgba(255, 177, 72, 0.1);
                color: #323232;
                .year-ul {
                  display: flex;
                  height: 40px;
                  align-items: center;
                  li {
                    &.icon-all {
                      display: block;
                      text-align: right;
                      i {
                        margin-left: 6px;
                        color: #ffb148;
                        font-size: 14px;
                      }
                    }
                    &.about {
                      display: none;
                    }
                  }
                }
              }
              ul {
                display: flex;
                align-items: center;
                padding: 10px 10px;
                li {
                  flex: 1;
                  &:last-child {
                    text-align: right;
                    color: #aeaeae;
                  }
                  &:first-child {
                    color: #323232;
                    text-align: left;
                  }
                }
              }
            }
            ul {
              li {
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #545454;
              }
            }
          }
        }
      }
      .item {
        padding: 15px 10px;
        .addEvent {
          width: 100%;
          height: 35px;
          padding: 0;
          background-color: #ffb148;
          border-color: #ffb148;
          color: white;
        }
        .addSelect {
          width: 100%;
          .el-input__inner {
            //  border-color: #ffb148;
            /*border-right-color: transparent;*/
          }
          .el-input-group__append {
            border-color: #ffb148;
            border-left-color: transparent;
            background-color: #ffb148;
            i {
              color: white;
            }
          }
        }
      }
    }
    .right-content {
      .title-flex {
        display: flex;
        align-items: center;
        padding-bottom: 10px;
        .falde-item {
          flex: 1;
          font-size: 14px;
          color: #aeaeae;
          &.title {
            font-size: 16px;
            font-weight: bold;
            color: #323232;
          }
          &.about {
            flex: 0 0 60%;
            align-items: center;
            display: flex;
            span {
              margin-right: 5px;
            }
            .name {
              display: inline-block;
              max-width: 240px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
          &.fun {
            text-align: right;
            span {
              margin-left: 5px;
              color: #ffb148;
              cursor: pointer;
              &:hover {
                /*text-decoration: ;*/
              }
            }

          }
          &:last-child {
            font-size: 14px;
            text-align: right;
            cursor: pointer;
          }
        }
      }
      .box-table-proceed {
        border-top: 1px solid #ebeef5;
        .table-operate-box {
          width: 100%;
          text-align: right;
          .table-operate-icon {
            height: 24px;
            width: 24px;
            margin-left: 10px;
            display: inline-block;
            text-align: center;
            background-color: rgba(120, 139, 251, 0.1);
            cursor: pointer;
            &.color {
              background-color: rgba(255, 177, 72, 0.1);
              i {
                color: #ffb148;
              }
            }
            i {
              color: #788bfb;
            }
          }
        }
      }
      .el-table thead {
        tr {
          th {
            background-color: #f8f8f8;
          }
        }
        background-color: #f8f8f8;
      }
      .addEvent {
        width: 220px;
        height: 35px;
        padding: 0 0;
        font-size: 16px;
        text-align: center;
        i {
          font-size: 15px;
        }
      }
    }
    .noInfo {
      min-height: 260px;
      height: 260px;
    }
  }

</style>
