<template>
  <div class="disclosure-checklist" id="disclosure-checklist">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card archive" shadow="never" body-style="padding:0">
          <div class="tabs-header">
            <ul class="box-tabs">
              <li v-for="(list , index) in bar" :class="{active: list.active}">
                <span class="text" @click="tabHandleClick(index)">
                  {{list.name}}
                  <span class="tab-bar"></span>
                </span>
              </li>
            </ul>
          </div>
          <!--系统-->
          <div class="left-default" v-if="activeNameBar == 'default'">
            <div class="item">
              <el-input class="addSelect" @key.13="companyBtnsClick" size="small"
                        clearable placeholder="搜索事项" @input="companyBtnsClick('company')" prefix-icon="el-icon-search"
                        v-model="screenCompany" @focus="addSelectFocus('company')" @bulr="addSelectBlur('company')">
              </el-input>
            </div>
            <div v-if="selectedData.company.length > 0">
              <el-collapse class="collapse-head-select" accordion v-model="activeNames" @change="handleChange">
                <el-collapse-item v-for="(list, index) of selectedData.company" :key="index" :name="list.checkedId">
                  <div class="title text-black1" slot="title">{{list.disclosureItemName}}</div>
                  <div class="collapse-select-list">
                    <ul>
                      <li v-for="(item, index2) of list.itemList" :class="{active: item.checked}"
                          @click="clickHandle('company', index, index2)">
                        <p :title="item.disclosureItemName">{{item.disclosureItemName}}</p>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <div class="no text-black3" v-else>暂无数据</div>
          </div>
          <!--自定义-->
          <div class="left-customize" v-if="activeNameBar == 'customize'">
            <div class="item">
              <el-input class="addSelect" @key.13="companyBtnsClick" size="small"
                        clearable placeholder="搜索事项" @input="companyBtnsClick('user')" prefix-icon="el-icon-search"
                        v-model="screenUser" @focus="addSelectFocus('user')" @bulr="addSelectBlur('user')">
              </el-input>
            </div>
            <div class="customize-list-box">
              <div class="customize-list" v-if="selectedData.user.length > 0">
                <div class="list-type-item" v-for="(item, index) in selectedData.user"
                     :class="{'list-type-item-active':item.checked}">
                  <ul class="year-ul">
                    <li class="title" @click="clickHandle('user', index,'index')" :title="item.disclosureItemName">
                      {{item.disclosureItemName}}
                    </li>
                    <li class="icon-all">
                      <i title="编辑项目" class="iconfont web-editor" @click="editorEvent(index)"></i>
                      <i title="删除事项" class="iconfont web-close" @click="deleteEvent(index)"></i>
                    </li>
                  </ul>
                </div>
              </div>
              <ul class="customize-list" v-else>
                <li class="no">暂无自定义模板</li>
              </ul>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card class="box-card proceed right-content" shadow="never" body-style="padding:20px" v-loading="leading">
          <div>
            <div class="right-content-title">{{listData.disclosureItemName}}</div>
            <div class="btn-content-title" @click="dialogVisible = true">
              <div class="addButton">
                <i class="iconfont web-editor">&nbsp;创建事项</i>
              </div>
            </div>
          </div>
          <el-tabs class="right-content-tabs" v-model="activeTable" @tab-click="handleClick">
            <el-tab-pane label="流程要点" name="first">
              <el-table size="medium" class="box-table-proceed" :data="listData.pointDtoList" style="width: 100%">
                <el-table-column label="序号" align="left" width="60">
                  <template slot-scope="scope">
                    {{scope.$index+1}}
                  </template>
                </el-table-column>
                <el-table-column prop="flowPoint" width="240" label="节点名称">
                  <template slot-scope="scope">
                    <div class="scope-point">{{scope.row.flowPoint}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="compliancePoint" label="合规要点">
                  <template slot-scope="scope">
                    <div class="scope-point">{{scope.row.compliancePoint}}</div>
                  </template>
                </el-table-column>
                <el-table-column prop="address" label="相关规则">
                  <template slot-scope="scope">
                    <ul class="relationList" v-if="scope.row.show">
                      <li v-for="(list, index) in scope.row.relationList"
                          @click="relationListClick(scope.row.relationList, index)">
                        <span class="lawName">{{list.relationLawName}}</span>
                      </li>
                      <span class="floatDown" @click="scope.row.show = !scope.row.show">收起<i
                        class="el-icon-arrow-up"></i></span>
                    </ul>
                    <ul class="relationList" v-else>
                      <li v-if="scope.row.relationList.length > 0">
                        <span class="lawName" @click="relationListClick(scope.row.relationList,0)">
                          {{scope.row.relationList[0].relationLawName}}
                        </span>
                        <span class="floatDown" v-if="scope.row.relationList.length > 1"
                              @click="scope.row.show = !scope.row.show">展开<i
                          class="el-icon-arrow-down"></i></span>
                      </li>
                    </ul>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="审议程序" name="second">
              <el-table size="medium" class="box-table-proceed" :data="listData.reviewList" style="width: 100%">
                <el-table-column prop="billName" label="议案名称" width="350">
                  <template slot-scope="scope">{{scope.row.billName}}</template>
                </el-table-column>
                <el-table-column align="center" prop="directorApply" label="董事会"></el-table-column>
                <el-table-column align="center" prop="supervisorApply" label="监事会"></el-table-column>
                <el-table-column align="center" prop="stockholderApply" label="股东大会"></el-table-column>
                <el-table-column align="center" prop="commiteeApply" label="专门委员会"></el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="权限速查" name="fourth" v-if="listData.permissionName">
              <access-tables-item :activeName="listData.permissionName"
                                  :companyId="userInfo.companyId">
              </access-tables-item>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
    <!--编辑事项名称-->
    <el-dialog top="30vh" id="addEventDialog-two" :visible.sync="editItemNodeShow" width="620px" center>
      <template slot="title">编辑自定义模板名称</template>
      <div class="addEventDialog-two-body">
        <el-form ref="formDom" :model="formEditItemNode" label-width="80px">
          <el-form-item class="input-def-item" label="模板名称:">
            <el-input :disabled="false" clearable v-model="formEditItemNode.name"
                      placeholder="模板名称"></el-input>
          </el-form-item>
          <!--<el-form-item class="input-def-item" label="节点日期:">-->
          <!--<el-date-picker :editable="false" class="addEvent-date-picker" @change="changePicker"-->
          <!--v-model="formEditItemNode.itemNodeDate" type="daterange" align="right" unlink-panels-->
          <!--range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"-->
          <!--value-format="yyyy-MM-dd"-->
          <!--:picker-options="pickerOptions">-->
          <!--</el-date-picker>-->
          <!--</el-form-item>-->
        </el-form>
      </div>
      <template slot="footer">
        <el-button type="primary" @click="editItemNode">保 存</el-button>
      </template>
    </el-dialog>
    <add-event v-model="dialogVisible" @close="closeAddEvent"></add-event>
  </div>
</template>

<script>
  import AccessTablesItem from './components/accessTablesItem.vue'
  import AddEvent from './components/addEvent.vue'
  export default {
    name: "disclosure-checklist",
    components: {
      AccessTablesItem,
      AddEvent
    },
    data() {
      return {
        dialogVisible: false,
        leading: false,
        editItemNodeShow: false,
        formEditItemNode: {
          disclosureItemName: '',
          id: ''
        },
        bar: [
          {name: '系统默认', type: 'default', active: true},
          {name: '自定义', type: 'customize', active: false}
        ],
        activeNameBar: 'default', // tab 勾选的是哪项
        activeTable: 'first',
        activeNames: [],
        //
        activeCalendarName: 'second',
        //
        screenCompany: '', //  系统检索
        screenUser: '', // 自定义检索
        //
        userInfo: {},
        listData: {
          company: [],
          user: [],
          pointDtoList: [], // 公司 右面的 流程要点
          reviewList: [], // 公司 右边的审议程序
          disclosureItemName: '',
          permissionName: '',
          id: '' // 选中的事项id
        },
        selectedData: {
          company: [],
          user: []
        },
        selectForm: {
          selectEvent: {},
          select: '',
          selectUser: '',
          selectUserEvent: {}
        }
      }
    },
    watch: {
      'listData.permissionName': function () {
        this.activeTable = 'first'
      },
      activeNameBar: function (val) {
        this.bar.forEach((item, index) => {
          this.$set(item, 'active', false);
          if (item.type == val) {
            this.$set(this.bar[index], 'active', true);
          }
        })
      }
    },
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.getCustomTemplateByUserId();
      this.getInfoDisclosureEventByCompanyId();
    },
    mounted() {
      this.editInfo();
    },
    methods: {
      editInfo () {
        if (this.$route.query.value) {
          this.dialogVisible = true;
        }
      },
      closeAddEvent() {
        this.dialogVisible = false
      },
      //
      editItemNode() {
        this.updateCustomTemplate();
      },
      //
      editorEvent(index) {
        this.formEditItemNode.name = this.selectedData.user[index].disclosureItemName;
        this.formEditItemNode.id = this.selectedData.user[index].id;
        this.editItemNodeShow = true;
      },
      // 更新 update 事项模板名称
      updateCustomTemplate() {
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.updateCustomTemplate,
          params: {
            templateName: this.formEditItemNode.name,
            itemId: this.formEditItemNode.id,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.getCustomTemplateByUserId();
            this.editItemNodeShow = false;
          }
        }).catch((err) => {

        })
      },
      //
      deleteEvent(index) {
        console.log(this.selectedData.user[index]);
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteTemplate(index)
        }).catch(() => {
        })
      },
      //
      addSelectBlur(type) {

      },
      //
      addSelectFocus(type) {

      },
      // deleteClosureItemMain
      deleteTemplate(index) {
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.deleteTemplate,
          params: {
            itemId: this.selectedData.user[index].id,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.getCustomTemplateByUserId();
            this.$nextTick(() => {
              this.clickHandle('user', 0, 0)
            });
            this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'});
          } else {
            this.$message({showClose: true, type: "error", duration: 3000, message: '删除失败'});
          }
        })
      },
      // 点击检索的按钮
      companyBtnsClick(type) {
        if (type == 'company') {
          let data = this.handleSelect(this.listData.company, this.screenCompany, 'itemList', 'disclosureItemName');
          console.log('23432', data);
          this.activeNames = data.activeNames;
          this.selectedData.company = data.data;
          // 如果没有搜索到数据
          if (this.screenCompany == '') {
            this.activeNames = [];
            this.selectedData.company.forEach((item1) => {
              item1.itemList.forEach((item2) => {
                this.$set(item2, 'checked', false)
                if (item2.id == this.selectForm.selectEvent.id) {
                  this.$set(item2, 'checked', true);
                  this.activeNames.push(item1.checkedId);
                }
              })
            })
          }
        } else if (type == 'user') {
          let data = this.handleSelect(this.listData.user, this.screenUser, 'disclosureItemName');
          this.activeNames = data.activeNames;
          this.selectedData.user = data.data;
          if (this.screenUser == '') {
            this.activeNames = [];
            this.selectedData.user.forEach((item1) => {
              this.$set(item1, 'checked', false)
              if (item1.id == this.selectForm.selectUserEvent.id) {
                this.$set(item1, 'checked', true);
                this.activeNames.push(item1.checkedId);
              }
            })
          }
        }
      },
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
            });
            //
            selectedData.forEach((item2) => {
              if (item2[itemListOne].length > 0) {
                item2.show = true;
                activeNames.push(item2.checkedId);
                console.log(item2.checkedId);
                returnSelectData.push(item2);
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
      // 跳转到小安详情页
      relationListClick(data, index) {
        this.$common.openWindow('/rule/details?id=' + data[index].relationLawId);
        // console.log(data, index);
      },
      // 查询系统默认模板要点详情和审议程序
      getInfoByItemId(itemId) {
        this.leading = true;
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getInfoByItemId,
          params: {
            itemId: itemId
          }
        }).then((res) => {
          setTimeout(() => {
            this.leading = false
          }, 500)
          if (res.data.returnCode == 200) {
            this.listData.disclosureItemName = res.data.returnObject.disclosureItemName;
            this.listData.id = res.data.returnObject.id;
            this.listData.permissionName = res.data.returnObject.permissionName;
            this.listData.pointDtoList = res.data.returnObject.pointDtoList;
            this.listData.pointDtoList.forEach((item1) => {
              this.$set(item1, 'show', false);
            });
            this.listData.reviewList = res.data.returnObject.reviewList;
            //  如果能正常返回数据后将自定义选中 清除
            this.selectedData.user.forEach((item) => {
              this.$set(item, 'checked', false)
            });
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '获取查询系统默认模板要点详情和审议程序异常！'})
          }
        }).catch((err) => {
          setTimeout(() => {
            this.leading = false
          }, 500)
        })
      },
      // 系统模板
      getInfoDisclosureEventByCompanyId() {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getInfoDisclosureEventByCompanyId,
          params: {
            companyId: this.userInfo.companyId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let company = res.data.returnObject;
            company.forEach((item1, index1) => {
              this.$set(item1, 'checkedId', 'index-' + index1);
              if (item1.itemList) {
                item1.itemList.forEach((item2, index2) => {
                  this.$set(item2, 'checked', false);
                  if (index2 == 0) {
                    this.$set(item2, 'checked', true);
                  }
                })
              }
            })
            console.log('23424companycompanycompanycompany====》', company);
            //
            this.listData.company = company;
            this.selectedData.company = this.listData.company;
            this.selectForm.selectEvent = this.selectedData.company[0].itemList[0];
            // 进入页面默认选择系统的第一项 的第一个
            this.clickHandle('company', 0, 0)
          }
        }).catch((err) => {

        })
      },
      // 查询自定义模板要点详情和审议程序
      getCustomInfoByItemId(templateId) {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getCustomInfoByItemId,
          params: {
            itemMainId: templateId
          }
        }).then((res) => {
          console.log('自定义', res.data.returnObject);
          if (res.data.returnCode == 200) {
            this.listData.id = res.data.returnObject.id;
            this.listData.disclosureItemName = res.data.returnObject.disclosureItemName;
            this.listData.pointDtoList = res.data.returnObject.pointDtoList;
            this.listData.pointDtoList.forEach((item1) => {
              this.$set(item1, 'show', false);
            });
            this.listData.reviewList = res.data.returnObject.reviewList;
            // 如果能正常返回数据后将系统选中 清除
            this.selectedData.company.forEach((item1, index) => {
              item1.itemList.forEach((item2) => {
                this.$set(item2, 'checked', false);
              })
            })
            //
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: 'warning', duration: 3000, message: '获取查询自定义模板要点详情和审议程序异常！'})
            this.listData.user.forEach((item) => {
              this.$set(item, 'checked', false)
            })
            this.selectedData.user = this.listData.user;
          } else {
            this.selectedData.user = '';
          }
        }).catch((err) => {

        })
      },
      // 自定义模板
      getCustomTemplateByUserId() {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getCustomTemplateByUserId,
          params: {
            companyId: this.userInfo.companyId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log('自定义', res.data.returnObject);
          if (res.data.returnCode == 200) {
            this.listData.user = res.data.returnObject;
            this.listData.user.forEach((item, index) => {
              this.$set(item, 'checkedId', index + this.$common.uuid())
              this.$set(item, 'checked', false)
            })
            this.selectedData.user = this.listData.user;
          }
        }).catch((err) => {

        })
      },
      //
      tabHandleClick(index) {
        this.bar.forEach((item) => {
          this.$set(item, 'active', false);
        });
        this.$set(this.bar[index], 'active', true);
        this.activeNameBar = this.bar[index].type
      },
      //
      clickHandle(type, i1, i2) {
        switch (type) {
          case 'company':
            //
            this.selectedData.company.forEach((item1) => {
              item1.itemList.forEach((item2) => {
                this.$set(item2, 'checked', false);
              })
            });
            this.$set(this.selectedData.company[i1].itemList[i2], 'checked', true);
            this.activeNames = [];
            this.activeNames.push(this.selectedData.company[i1].checkedId);
            //
            this.selectForm.selectEvent = this.selectedData.company[i1].itemList[i2];
            this.getInfoByItemId(this.selectForm.selectEvent.id);
            //
            break;
          case 'user':
            this.selectedData.user.forEach((item) => {
              this.$set(item, 'checked', false)
            });
            this.$set(this.selectedData.user[i1], 'checked', true);
            this.selectForm.selectUserEvent = this.selectedData.user[i1];
            this.getCustomInfoByItemId(this.selectForm.selectUserEvent.id);
            //
            this.activeNames = [];
            break;
        }
        console.log(this.selectForm.selectEvent);
      },
      //
      handleClick(row) {
        console.log(row);
      },
      //
      handleChange(val) {
        console.log(val);
      }
    }
  }
</script>

<style lang="scss">
  #disclosure-checklist {
    .el-collapse-item__header {
      border-bottom-color: #f0f1f5;
    }
    .box-card {
      margin-top: 20px;
      min-height: 100px;
      &.archive {
        min-height: 785px;
        margin-bottom: 20px;
        .left-default {
          .no {
            text-align: center;
            font-size: 14px;
            color: #8d8d8d;
          }
        }
        .left-customize {
          .item {
            // border-bottom: 1px solid #e3e3e3;
          }
          .customize-list-box {
            height: auto;
            border-top: 1px solid #e3e3e3;
            .customize-list {
              .no {
                color: #8d8d8d;
                font-size: 15px;
                padding: 10px 0;
                text-align: center;
              }
              .list-type-item {
                cursor: pointer;
                &.list-type-item-active {
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
                      flex: 0 0 70%;
                      text-align: left;
                      font-size: 14px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    }
                    &.icon-all {
                      display: none;
                      i {
                        font-size: 14px;
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
            }
          }
        }
        .tabs-header {
          border-bottom: 1px solid #e3e3e3;
          .box-tabs {
            display: flex;
            height: 50px;
            align-items: center;
            li {
              flex: 1;
              text-align: center;
              line-height: 50px;
              position: relative;
              &.active {
                color: #ffb148;
                .tab-bar {
                  position: absolute;
                  bottom: -1px;
                  left: 0;
                  right: 0;
                  height: 2px;
                  width: 50px;
                  background-color: #ffb148;
                  margin: 0 auto;
                }
              }
            }
            li:first-child {
              &:after {
                content: "";
                position: absolute;
                right: 0;
                height: 20px;
                width: 2px;
                background-color: #f0f1f5;
                top: 50%;
                transform: translateY(-50%);
              }
            }
          }
        }
        .item {
          padding: 10px 10px;
          .addSelect {
            width: 100%;
            .el-input__inner {
              // border-right-color: transparent;
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
        .collapse-head-select {
          .el-collapse-item {
            .el-collapse-item__wrap {
              border-bottom-color: #f0f1f5;
            }
            .el-collapse-item__header {
              padding: 0 10px;
              * {
                transition: all .3s;
              }
              &.is-active {
                // background-color: rgba(255, 177, 72, 0.2);
                // color: #ffb148;
                * {
                  transition: all .3s;
                }
                .title, i {
                  color: #ffb148;
                }
              }
              .el-collapse-item__arrow {
                margin-right: 0;
              }
              .title {
                font-size: 15px;
                color: #323232;
              }
            }
          }
          .el-collapse-item__content {
            padding-bottom: 0;
          }
          .collapse-select-list {
            ul {
              li {
                padding: 0 10px;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color: #545454;
                p {
                  width: 100%;
                  overflow: hidden;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  cursor: pointer;
                  text-indent: 1em;
                }
                &.active {
                  background-color: #fff3e4;
                  color: #ffb148;
                }
                &:hover {
                  background-color: #fff3e4;
                }
              }
            }
          }
        }
      }
      &.proceed {
        min-height: 785px;
        margin-bottom: 20px;
        .item {
          padding: 15px 10px;
          border-bottom: 1px solid #f0f1f5;
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
              border-right-color: transparent;
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
        .list-type-item {
          .year-ul {
            display: flex;
            align-items: center;
            height: 40px;
            li {
              flex: 1;
              &.title {
                text-align: left;
                font-size: 14px;
                color: #323232;
              }
              &.icon-all {
                display: none;
                i {
                  font-size: 14px;
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
        &.right-content {
          .right-content-title {
            display: inline-block;
            font-weight: bold;
            line-height: 24px;
          }
          .btn-content-title {
            float: right;
            cursor: pointer;
            display: inline-block;
            .addButton {
              border:1px solid rgba(255,177,72,1);
              width:98px;
              height:23px;
              border-radius:3px;
              display: flex;
              justify-content:center;
              align-items:Center;
              .iconfont {
                font-size:14px;
                font-weight:400;
                color:rgba(255,177,72,1);
              }
            }
          }
          .right-content-tabs {
            .el-tabs__nav-wrap::after {
              height: 1px;
              background-color: #e3e3e3;
            }
            .el-tabs__item {
              color: #8d8d8d;
              font-size: 14px;
              &.is-active {
                color: #ffb148;
              }
            }
          }
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
                span {
                  margin-right: 5px;
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
            border-top: 1px solid #e3e3e3;
            .scope-point {
              line-height: 1.5;
              text-align: justify;
            }
            .relationList {
              li {
                cursor: pointer;
                text-align: justify;
                line-height: 1.5;
                padding-top: 10px;
                &:first-child {
                  padding: 0;
                }
                .lawName {
                  &:hover {
                    color: #ffb148;
                    text-decoration: underline;
                  }
                }
              }
              .floatDown {
                cursor: pointer;
                float: right;
                color: #ffb148;
                i {
                  color: #ffb148;
                }
              }
            }
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
          .box-table-proceed thead {
            tr {
              th {
                background-color: #f8f8f8;
              }
            }
            background-color: #f8f8f8;
          }
        }
      }
    }

  }
</style>
