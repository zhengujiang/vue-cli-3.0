<template>
  <div id="add-event">
    <el-dialog id="addEvent-dialog" :visible.sync="dialogVisible" width="620px" center :before-close="handleClose">
      <template slot="title" class="title">创建项目</template>
      <div class="addEvent-item">
        <el-steps class="add-steps" :finish-status="'success'" align-center :active="stepsActive"
                  process-status="now-status">
          <el-step v-for="(list ,index) of addStepsData" :key="index" :class="list.type">
            <template slot="title">{{list.label}}</template>
          </el-step>
        </el-steps>
      </div>
      <div class="body-content-one" v-if="stepsActive == 0">
        <div class="form-item">
          <el-form @submit.native.prevent="false" ref="formDom" label-position="left" :model="form" label-width="80px">
            <el-form-item label="事项名称:">
              <el-input v-model="form.name" placeholder="输入事项名称"></el-input>
            </el-form-item>
            <el-form-item label="事项模板:">
              <el-input readonly v-model="form.event" placeholder="请从系统模板或自定义模中选择模板"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="tabs-item">
          <el-tabs v-model="addTabsActive" @tab-click="handleClick">
            <el-tab-pane label="系统默认" name="default">
              <div class="tabs-item-input">
                <el-form @submit.native.prevent="false" size="small" ref="formDom" label-position="left" :model="form"
                         label-width="0">
                  <el-form-item>
                    <el-input prefix-icon="el-icon-search" size="small" v-model="selectForm.select" placeholder="输入事项名称"
                              @input="companyBtnsClick('company')"
                              :trigger-on-focus="false"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <el-collapse class="collapse-head-select" accordion v-model="activeNames" @change="handleChange">
                <el-collapse-item v-for="(list, index) in selectedData.company" :key="index" :name="list.checkedId">
                  <div class="title text-black1" slot="title">{{list.disclosureItemName}}</div>
                  <div class="collapse-select-list">
                    <ul>
                      <li v-for="(item,index2) of list.itemList" :class="{active: item.checked}"
                          @click="clickHandle('company',index,index2)">
                        <p>{{item.disclosureItemName}}</p>
                      </li>
                    </ul>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane label="自定义" name="define">
              <div class="tabs-item-input">
                <el-form @submit.native.prevent="false" size="small" ref="formDom" label-position="left" :model="form"
                         label-width="0">
                  <el-form-item>
                    <el-input @input="companyBtnsClick('user')" prefix-icon="el-icon-search" size="small"
                              v-model="selectForm.selectUser"
                              placeholder="输入事项名称"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <div class="selectUser-list">
                <ul>
                  <li v-for="(item, index) of selectedData.user" :key="index" :title="item.disclosureItemName"
                      @click="clickHandle('user',index, '')" :class="{active: item.checked}">
                    {{item.disclosureItemName}}
                  </li>
                </ul>
              </div>
              <!--<el-collapse class="collapse-head-select" accordion v-model="activeNames" @change="handleChange">-->
              <!--<el-collapse-item v-for="(list, index) of selectedData.user" :key="index" :name="list.id">-->
              <!--<div class="title text-black1" slot="title">{{list.disclosureItemName}}</div>-->
              <!--<div class="collapse-select-list">-->
              <!--<ul>-->
              <!--<li v-for="(item,index2) of list.itemList" :class="{active: item.checked}"-->
              <!--@click="clickHandle(index,index2)">-->
              <!--<p>{{item.disclosureItemName}}</p>-->
              <!--</li>-->
              <!--</ul>-->
              <!--</div>-->
              <!--</el-collapse-item>-->
              <!--</el-collapse>-->
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="body-content-two" v-if="stepsActive == 1">
        <div class="divider-box">
          <p class="vux-divider">填写相关信息，小安日历会帮你自动生成事项节点哦</p>
        </div>
        <div class="form-val-align">
          <el-form @submit.native.prevent="false" label-position="right" label-width="110px" :model="formValAlign">
            <el-form-item label="事件类型:">
              <el-input v-model="form.event" placeholder="事件类型"></el-input>
            </el-form-item>
            <el-form-item label="事件名称:">
              <el-input v-model="form.name" placeholder="事件名称"></el-input>
            </el-form-item>
            <el-form-item v-show="eventConfigValue.indexOf('T') > -1 || eventConfigValue.indexOf('P') > -1"
                          :label="eventConfigValue.indexOf('T') > -1 ? '会议日期:' : '披露日期:'"
                          :class="[{'is-success': errFrom.eventTDate == 1}, {'is-error': errFrom.eventTDate === 0}]">
              <el-date-picker popper-class="dateIndexInfo" v-model="form.eventTDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                              :editable="false"
                              @blur="onblur('eventTDate')" @focus="oninput('eventTDate')"
                              @change="checkSelectData"
                              style="width:100%;"></el-date-picker>
              <div v-show="errFrom.eventTDate===0 && !form.eventTDate" class="el-form-item__error">
                请选择{{ eventConfigValue.indexOf('T') > -1 ? '会议日期' : '披露日期'}}
              </div>
              <div v-show="errorTData && eventConfigValue.indexOf('T') > -1"
                   class="el-form-item__error" style="width: 450px;line-height: 16px">{{errorTData}}
              </div>
              <div v-show="errorTData && eventConfigValue.indexOf('P') > -1"
                   class="el-form-item__error" style="width: 450px;line-height: 16px">{{errorTData}}
              </div>
            </el-form-item>
            <el-form-item v-show="eventConfigValue.indexOf('R') > -1" label="股权登记日:"
                          :class="[{'is-success': errFrom.eventRDate === 1}, {'is-error': errFrom.eventRDate === 0}]">
              <el-date-picker popper-class="dateIndexInfo" v-model="form.eventRDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                              :editable="false" @blur="onblur('eventRDate')" @focus="oninput('eventRDate')"
                              @change="checkSelectData" style="width:100%;"></el-date-picker>
              <div v-show="errFrom.eventRDate===0" class="el-form-item__error">请选择股权登记日</div>
              <div v-show="errorRData && errFrom.eventRDate!==0" class="el-form-item__error"
                   style="width: 300px;line-height: 16px">{{errorRData}}
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="body-content-three" v-if="stepsActive == 2">
        <div class="check-all">
          <div class="title">
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
            <span class="label-name">
              <span>全选</span>
              <span class="right"><i class="el-icon-arrow-right"></i></span>
            </span>
            </el-checkbox>
          </div>
        </div>
        <div class="check-list">
          <el-checkbox-group v-model="checkedUserObj" @change="handleCheckedCitiesChange">
            <template v-for="(item,index) of customUser">
              <div class="check-item">
                <el-checkbox :label="item" :key="index">
                  <span class="label-name">
                     <img :src="item.userAvatar" alt=""><span>{{item.userName}}</span>
                  </span>
                </el-checkbox>
              </div>
            </template>
          </el-checkbox-group>
        </div>
      </div>
      <template slot="footer">
        <el-button v-if="stepsActive > 0" class="prev" @click="addEventPrev">上一步</el-button>
        <el-button v-if="stepsActive >= 0 && stepsActive < 2" class="next" type="primary" @click="addEventNext">下一步
        </el-button>
        <el-button type="primary" v-if="stepsActive >= 2" class="click" @click="handleSubmit">创&emsp;建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "add-event",
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        eventConfigValue: '',
        eventNamePlaceholder: '',
        eventTemplateConfig: '',
        errFrom: {
          eventTDate: '',
          eventRDate: ''
        },
        dataForm: {
          eventTDate: '',
          eventRDate: ''
        },
        errorRData: '', // 股权交易日
        errorTData: '', // 会议日期
        errorPData: '',  // 披露日期
        //
        checkAll: false,
        //
        customUser: [], // 获取到的企业用户
        //
        checkedUserObj: [],
        isIndeterminate: false,
        //
        formValAlign: {
          type: '',
          name: '',
          date: ''

        },
        restaurants: [],
        form: {
          name: '',
          calendarName: '',
          event: '',
          eventTDate: '',
          eventRDate: ''
        },
        selectForm: {
          selectEvent: {},
          select: '',
          selectUser: '',
          selectUserEvent: ''
        },
        listData: {
          company: [],
          user: []
        },
        selectedData: {
          company: [],
          user: []
        },
        activeNames: [],
        addStepsData: [
          {index: 1, type: 'steps-add', label: '创建项目', status: true},
          {index: 2, type: 'steps-calendar', label: '调用日历事件', status: false},
          {index: 3, type: 'steps-share', label: '共享事项给同事', status: false}
        ],
        addTabsActive: 'default',
        stepsActive: 0,
        dialogVisible: false,
        userInfo: {},
        allCloseDate: [],
        isCustom: false
      }
    },
    watch: {
      value: function (val) {
        console.log(val);
        if (val) {
          this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
          console.log(this.userInfo);
          //
          this.eventTemplateConfig = this.$config.eventTemplateConfig;
          //
          this.getInfoDisclosureEventByCompanyId();
          this.getCustomTemplateByUserId();
          this.getEnterpriseUserList();
        }
        this.dialogVisible = val;
      },
      stepsActive: function (val) {
        console.log(32423, val, '第' + (Number(val) + 1) + '步');
        this.addStepsData.forEach((item, index) => {
          if (val >= item.index) {
            this.$set(item, 'status', true);
          } else {
            this.$set(item, 'status', false);
          }
        })
      }
    },
    created() {
      // this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      // console.log(this.userInfo);
      // //
      // this.eventTemplateConfig = this.$config.eventTemplateConfig;
      // //
      // this.getInfoDisclosureEventByCompanyId();
      // this.getCustomTemplateByUserId();
      // this.getEnterpriseUserList();
      //
    },
    mounted() {
      this.editInfo();
    },
    methods: {
      //
      onblur(type) {

      },
      editInfo () {
        if (this.$route.query.value) {
          this.form.event = this.$route.query.value;
        }
      },
      //
      oninput(type) {

      },
      // 点击检索的按钮
      companyBtnsClick(type) {
        if (type == 'company') {

          let data = this.handleSelect(this.listData.company, this.selectForm.select, 'itemList', 'disclosureItemName');
          console.log(data);
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
          let data = this.handleSelect(this.listData.user, this.selectForm.selectUser, 'disclosureItemName');
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
      // 年报，季报，业绩预告返回错误信息
      checkTDataMsg(date) {
        // config 枚举id 判断提示文字
        let m = new Date(date).getMonth() + 1
        let t = new Date(date).toLocaleDateString()
        let week = new Date(date).getDay()

        if ([2, 3, 12, 13].indexOf(this.selectForm.selectEvent.templateType) > -1) {
          let disclosureItemName = this.selectForm.selectEvent.disclosureItemName // 报告，业绩名称
          if (disclosureItemName === '年度报告') {
            if (week === 0 || m > 4) {
              return '年度报告应在1月1日至4月30日披露，披露日应为交易日或周六。'
            }
          } else if (disclosureItemName === '一季度报告') {
            if (week === 0 || m != 4) {
              return '一季报应在4月1日至4月30日披露，披露日应为交易日或周六。'
            }
          } else if (disclosureItemName === '半年度报告') {
            if (week === 0 || (m != 8 && m != 7)) {
              return '半年报应在7月1日至8月31日披露，披露日应为交易日或周六。'
            }
          } else if (disclosureItemName === '三季度报告') {
            if (week === 0 || m != 10) {
              return '三季报应在10月1日至10月31日披露，披露日应为交易日或周六。'
            }
          }
//            else if (this.dataForm.reportType === 5) {
//              return '业绩预告披露日应为交易日或周六。'
//            } else if (this.dataForm.reportType === 6) {
//              return '业绩快报披露日应为交易日或周六。'
//            }

        }
        return ''
      },
      // 定期报告窗口期、业绩预告业绩快报窗口期，两个事件缺 T 日 月份 合法性判断
      /* checkTData(date) {
         let m = new Date(date).getMonth() + 1
         let t = new Date(date).toLocaleDateString()
         let week = new Date(date).getDay()
         if (week === 0) {
           return false
         }
         let templateType = this.selectForm.selectEvent.templateType
 //        if (this.allCloseDate.indexOf(t) > -1) {
 //          return false
 //        }
         if (templateType === 1) {
           if (m > 4) {
             return false
           }
         } else if (templateType === 2) {
           if (m != 4) {
             return false
           }
         } else if (templateType === 3) {
           if (m != 8) {
             return false
           }
         } else if (templateType === 4) {
           if (m != 10) {
             return false
           }
         }
         return true
       }, */
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
      //
      checkSelectData(val) {
        console.log('234234', val);
        if (!this.form.eventTDate) {
          this.form.eventRDate = '';
          this.errorRData = '';
          this.errFrom.eventRDate = 1
        }
        if (!this.form.eventRDate) {
          this.errorRData = '';
          this.errFrom.eventRDate = 1
        }

        // 检查季报，业绩预报时间正确性
        if (this.eventConfigValue.indexOf('P') > -1 && this.form.eventTDate) {
          let checkMsg = this.checkTDataMsg(this.form.eventTDate)
          if (checkMsg) {
            this.errorTData = checkMsg
            return
          } else {
            this.errorTData = ''
          }
        }
        if (this.form.eventTDate && this.form.eventRDate) {
          this.checkEventDate()
        } else if (this.eventConfigValue.indexOf('R') < 0 && this.form.eventTDate) {
          this.checkEventDate()
        }
      },
      // 检查股东大会召开日和股权登记日是否合法
      checkEventDate() {
        let eventTDate = this.$common.getTimestampms(this.form.eventTDate + ' 00:00:00')
        let eventRDate = 0
        if (this.eventConfigValue.indexOf('R') < 0) {
          eventRDate = 0
        } else {
          if (this.form.eventRDate) {
            eventRDate = this.$common.getTimestampms(this.form.eventRDate + ' 00:00:00')
          } else {
            eventRDate = ''
          }
        }
        this.$http({
          method: 'GET',
          url: this.$api.calendar.checkDate,
          params: {
            userId: this.$cookie.get('userId'),
            templateEventId: this.selectForm.selectEvent.calenderEventId,
            eventTDate: eventTDate,
            eventRDate: eventRDate == '' ? 0 : eventRDate
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            // this.eventContainList = res.data.returnObject
            this.errorRData = '';
            this.errorTData = '';
          } else {
            let returnMsg = res.data.returnObject
            this.errorRData = returnMsg.R
            this.errorTData = returnMsg.T
            this.reportDateErr = returnMsg.T
            // this.$message({showClose: true, type: 'error', message: res.data.returnMsg})
          }
        })
      },
      // 根据id获取对象名称
      getObjById(id, obj) {
        for (let i in obj) {
          if (obj[i].id === id) {
            return obj[i]
          }
        }
      },
      //
      addEventPrev() {
        if (this.selectForm.selectEvent.calenderEventId) {
          this.stepsActive -= 1;
        } else {
          this.stepsActive -= 2
        }
      },
      //
      handleSubmit() {
        this.addInfoClosureItemMain();
      },
      //
      addEventNext() {
        console.log('32432', this.stepsActive);
        // this.stepsActive += 1;
        if (this.stepsActive == 0) {
          // 第一步
          if (this.form.name == '') {
            this.$message({showClose: true, type: "error", duration: 3000, message: '请填写事项名称'});
            return false
          }
          if (this.form.event == '') {
            this.$message({showClose: true, type: "error", duration: 3000, message: '请选择事项模板'});
            return false
          }
          if (this.selectForm.selectEvent.calenderEventId) {
            this.stepsActive += 1;
            let type = this.selectForm.selectEvent.templateType;
            if (type || type == 0) {
              this.eventConfigValue = this.getObjById(type, this.eventTemplateConfig).valueList; // 枚举ID获取T,R配置
              this.eventNamePlaceholder = this.getObjById(type, this.eventTemplateConfig).nameSample.replace('20XX', (new Date().getFullYear()))
              this.form.calendarName = this.eventNamePlaceholder;
              console.log(this.eventConfigValue);
              console.log(this.eventNamePlaceholder);
            }
          } else {
            this.stepsActive += 2
          }

        } else if (this.stepsActive == 1) {
          //
          let eventCheck = false
          console.log(this.eventConfigValue);
          if (this.eventConfigValue.indexOf('T') > -1) {
            if (!this.form.eventTDate) {
              eventCheck = true;
            }
          }
          if (this.eventConfigValue.indexOf('R') > -1) {
            if (!this.form.eventRDate) {
              eventCheck = true;
            }
          }
          if (eventCheck) {
            this.$confirm('继续填写事件信息？', '提示', {
              confirmButtonText: '继续填写',
              cancelButtonText: '跳过',
              type: 'warning',
              showClose: false,
              closeOnClickModal: false,
              closeOnPressEscape: false
            }).then(() => {
              //
            }).catch(() => {
              this.stepsActive += 1;
              this.form.eventTDate = '';
              this.form.eventRDate = '';
            });
          } else {
            this.stepsActive += 1
          }
        } else {

        }
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
          console.log('23424', res.data.returnObject);
          if (res.data.returnCode == 200) {
            this.listData.company = res.data.returnObject;
            this.listData.company.forEach((item, index) => {
              this.$set(item, 'checkedId', 'index-' + index);
              if (item.itemList) {
                item.itemList.forEach((item2) => {
                  item2.checked = false;
                })
              }
            })
            this.selectedData.company = this.listData.company;
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
          console.log('23424', res.data.returnObject);
          if (res.data.returnCode == 200) {
            this.listData.user = res.data.returnObject;
            this.listData.user.forEach((item) => {
              if (item.itemList) {
                item.itemList.forEach((item2) => {
                  item2.checked = false;
                })
              }
            });
            this.selectedData.user = this.listData.user;
          }
        }).catch((err) => {

        })
      },
      // 获取企业级同事信息
      getEnterpriseUserList() {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getEnterpriseUserList,
          params: {
            companyId: this.userInfo.companyId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log('23424', res.data.returnObject);
          if (res.data.returnCode == 200) {
            this.customUser = res.data.returnObject;
            console.log(res.data.returnObject);
          }
        }).catch((err) => {

        })
      },
      // 添加事项
      addInfoClosureItemMain() {
        let userList = [], eventTDate = '', eventRDate = '';
        this.checkedUserObj.forEach((item) => {
          userList.push(item.userId);
        })
        if (this.form.eventTDate) {
          eventTDate = this.$common.getTimestampms(this.form.eventTDate);
        } else {
          eventTDate = '';
        }
        if (this.form.eventRDate) {
          eventRDate = this.$common.getTimestampms(this.form.eventRDate);
        } else {
          eventRDate = '';
        }

        this.$http({
          method: 'PUT',
          url: this.$api.disclosure.addInfoClosureItemMain,
          params: {
            isCustom: this.isCustom,
            parkaterIds: userList.toString(),
            itemName: this.form.name,
            itemTemplateName: this.selectForm.selectEvent.disclosureItemName,
            itemTemplateId: this.selectForm.selectEvent.id,
            meetingDate: eventTDate,
            stockCheckDate: eventRDate,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$router.push({path: '/loading', query: {url: '/disclosure/proceed?id=' + res.data.returnObject}});
            this.$message({showClose: true, type: 'success', duration: 3000, message: '创建事项成功！'});
          }
        }).catch(() => {

        })
      },
      // 公司 同事信息 checkbox
      handleCheckAllChange(val) {
        this.checkedUserObj = val ? this.customUser : [];
        this.isIndeterminate = false;
      },
      //
      handleCheckedCitiesChange(value) {
        this.checkedUserObj = value;
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.customUser.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.customUser.length;
      },
      //
      handleClose() {
        this.$emit('close', false);
        setTimeout(() => {
          this.stepsActive = 0
        }, 500)
      },
      //
      addEvents() {

      },
      //
      handleChange() {

      },
      //
      clickHandle(type, i1, i2) {
        if (type == 'company') {
          this.isCustom = false;
          this.selectedData.company.forEach((item1) => {
            item1.itemList.forEach((item) => {
              this.$set(item, 'checked', false);
            })
          });
          this.selectedData.user.forEach((item1) => {
            this.$set(item1, 'checked', false);
          });
          this.$set(this.selectedData.company[i1].itemList[i2], 'checked', true);
          //
          this.selectForm.selectEvent = this.selectedData.company[i1].itemList[i2];
          console.log(this.selectForm.selectEvent);
          this.form.event = this.selectedData.company[i1].itemList[i2].disclosureItemName;
        } else if (type == 'user') {
          this.isCustom = true;
          this.selectedData.company.forEach((item1) => {
            item1.itemList.forEach((item) => {
              this.$set(item, 'checked', false);
            })
          });
          this.selectedData.user.forEach((item1) => {
            this.$set(item1, 'checked', false);
          });
          this.$set(this.selectedData.user[i1], 'checked', true);
          this.selectForm.selectEvent = this.selectedData.user[i1];
          this.form.event = this.selectedData.user[i1].disclosureItemName;
        }
        //
        //
        this.form.eventTDate = ''
        this.form.eventRDate = ''
        this.errorTData = ''
        this.errorRData = ''
        this.errFrom.eventTDate = ''
        this.errFrom.eventRDate = ''
      },
      //
      handleClick() {
      }
    }
  }
</script>

<style lang="scss">
  .dateIndexInfo {
    z-index: 3000 !important;
  }
  #add-event {
    #addEvent-dialog {
      // z-index: 6666 !important;
      .el-dialog {
        position: absolute;
        margin-top: 0 !important;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .el-dialog__header {
        color: #ffb148;
        font-weight: bold;
        font-size: 16px;
        border-bottom: 1px solid #dcdfe6;
      }
      .el-dialog--center .el-dialog__body {
        padding: 0 0 0 0;
      }
      .el-dialog__footer {
        border-top: 1px solid #e3e3e3;
        padding: 15px 20px;
        .el-button {
          width: 125px;
          height: 35px;
          padding: 0;
          font-size: 16px;
          line-height: 35px;
          &.pev {
            border: 1px solid #ffb148;
            color: #ffb148;
            background-color: rgba(255, 177, 72, 0.1);
          }
        }
      }
      .addEvent-item {
        padding: 10px 0 5px 0;
        border-bottom: 1px solid #e3e3e3;
        .add-steps {
          .el-step {
            .el-step__title {
              font-size: 12px;
              color: #aeaeae;
              line-height: 28px;
            }
            .el-step__icon.is-text {
              border-width: 1px;
              background-color: #aeaeae;
              .el-step__icon-inner {
                color: white;
                font-weight: normal;
              }
            }
            &.is-horizontal .el-step__line {
              height: 1px;
            }
            .el-step__head.is-success {
              color: #ffb148;
              border-color: #ffb148;
              .el-step__icon {
                background-color: #ffb148;
                .el-step__icon-inner {
                  font-weight: bold;
                }
              }
              .el-step__line {
                background-color: #ffb148;
                .el-step__line-inner {
                  border-width: 0 !important;
                }
              }
            }
            .el-step__head.is-now-status {
              .el-step__line {
                background-color: #ffb148;
              }
              .el-step__icon {
                background-color: #ffb148;
                border-color: #ffb148;
                color: white;
              }
            }
          }
        }
      }
      .body-content-one {
        max-height: 420px;
        min-height: 420px;
        transition: .1s all;
        .el-input__inner {
          border-color: #e3e3e3;
        }
        .form-item {
          padding: 15px;
          border-bottom: 1px solid #e3e3e3;
          .el-form-item {
            margin-bottom: 15px;
            &:last-child {
              margin-bottom: 0;
            }
          }
        }
        .tabs-item {
          padding: 0 15px;
          .el-tabs {
            .el-tabs__header {
              margin-bottom: 0;
              .el-tabs__nav-wrap {
                &::after {
                  height: 1px;
                }
              }
            }
          }
          .selectUser-list {
            border-bottom: 0;
            max-height: 202px;
            min-height: 150px;
            overflow-y: auto;
            overflow-x: hidden;
            ul {
              li {
                font-size: 14px;
                height: 40px;
                line-height: 40px;
                border-bottom: 1px solid #e3e3e3;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                &:hover {
                  background-color: rgba(255, 177, 72, 0.1);
                }
                &.active {
                  background-color: #fff3e4;
                  color: #ffb148;
                }
              }
            }
          }
          .tabs-item-input {
            padding: 0 0;
            .el-form-item {
              margin: 10px 0;
              .el-input__inner {
                border-color: #e3e3e3;
              }
            }
            .el-autocomplete {
              width: 100%;
            }
          }
          .collapse-head-select {
            border-bottom: 0;
            max-height: 202px;
            min-height: 150px;
            overflow-y: auto;
            overflow-x: hidden;
            /*-webkit-overflow-scrolling: touch;*/
            .el-collapse-item {
              .el-collapse-item__header {
                &.is-active {
                  .title {
                    color: #ffb148;
                  }
                  color: #ffb148;
                  i {
                    color: #ffb148;
                  }
                }
                padding: 0 10px;
                i {
                  transition: .3s all;
                }
                &.is-active {
                  i {
                    color: #ffb148;
                  }
                }
                .el-collapse-item__arrow {
                  margin-right: 0;
                }
                .title {
                  font-size: 14px;
                }
              }
            }
            .el-collapse-item__content {
              padding-bottom: 0;
            }
            .collapse-select-list {
              /*border-top: 1px solid #e3e3e3;*/
              ul {
                li {
                  padding: 0 10px;
                  height: 40px;
                  line-height: 40px;
                  font-size: 14px;
                  color: #545454;
                  border-top: 1px solid #e3e3e3;
                  cursor: pointer;
                  p {
                    padding-left: 1em;
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
      }
      .body-content-two {
        max-height: 420px;
        min-height: 420px;
        transition: .1s all;
        overflow: auto;
        .divider-box {
          padding: 0 14%;
        }
        .form-val-align {
          padding: 0 20px 0 15px;
          .el-form-item {
            margin-bottom: 20px;
          }
          .el-form-item__label {
            font-size: 17px;
          }
        }
      }
      .body-content-three {
        /*padding: 0 20px;*/
        max-height: 420px;
        min-height: 420px;
        transition: .1s all;
        .check-all {
          padding: 0 20px;
          height: 50px;
          .title {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            border-bottom: 1px solid #e3e3e3;
          }
          &:hover {
            background-color: #f0f1f5;
          }
          .el-checkbox {
            width: 100%;
            display: flex;
            align-items: center;
          }
          .el-checkbox__input.is-indeterminate .el-checkbox__inner::before {
            top: 6px;
          }
          .el-checkbox__label {
            font-size: 14px;
            flex: 1;
            color: #aeaeae;
            .label-name {
              display: flex;
              align-items: center;
              width: 100%;
              span {
                font-size: 14px;
                flex: 1;
              }
              .right {
                text-align: right;
              }
            }
          }
          .el-checkbox__inner {
            height: 16px;
            width: 16px;
            &::after {
              height: 8px;
              left: 5px;
            }
          }
        }
        .check-list {
          max-height: 270px;
          overflow: auto;
          .check-item {
            padding: 0 20px;
            height: 50px;
            display: flex;
            align-items: center;
            transition: all .3s;
            &:hover {
              background-color: #f0f1f5;
            }
            .el-checkbox {
              width: 100%;
              display: flex;
              align-items: center;
              .el-checkbox__inner {
                height: 16px;
                width: 16px;
                &::after {
                  height: 8px;
                  left: 5px;
                }
              }
            }
            .el-checkbox__label {
              font-size: 14px;
              flex: 1;
              color: #aeaeae;
              .label-name {
                display: flex;
                align-items: center;
                img {
                  height: 35px;
                  width: 35px;
                  border-radius: 50%;
                }
                span {
                  font-size: 14px;
                  padding-left: 20px;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
