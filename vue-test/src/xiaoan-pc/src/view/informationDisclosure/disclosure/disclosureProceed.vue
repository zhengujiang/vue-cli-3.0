<template>
  <div class="disclosure-proceed" id="disclosure-proceed">
    <el-row :gutter="20">
      <el-col :span="5">
        <el-card class="box-card proceed" shadow="never" body-style="padding:0">
          <div class="item">
            <el-input class="addSelect" size="small" placeholder="请输入内容" v-model="searchWord"
                      prefix-icon="el-icon-search" clearable>
              <!--<el-button type="primary" size="small" slot="append" icon="el-icon-search"></el-button>-->
            </el-input>
          </div>
          <div class="list-type-item" :class="{'list-type-item-active': item.select}" v-show="item.search"
               v-for="(item, index) in disclosureItemList" :key="index" @click="disclosureItemHandle(item,index)">
            <ul class="year-ul">
              <li class="title" :title="item.itemName">
                <i v-show="item.isShared" class="iconfont web-yaoqinghaoyou"></i>{{item.itemName}}
              </li>
              <li class="icon-all">
                <i title="归档事项" class="iconfont web-archive" @click="archivedItemMain"></i>
                <i title="编辑事项名称" class="iconfont web-editor" @click="editorEvent(index)"></i>
                <i title="删除事项" class="iconfont web-close" @click="deleteClosureItemMain(item)"></i>
              </li>
              <li class="about">{{item.nodeCount}}项</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="19">
        <el-card id="disclosureItemBox" class="box-card proceed right-content" shadow="never" body-style="padding:20px"
                 v-if="this.disclosureItemList.length>0">
          <el-row class="title-flex">
            <el-col :span="17">
              <div style="word-break: break-all;">{{disclosureItem.itemName}}</div>
            </el-col>
            <el-col :span="7" class="text-right">
              <span class="" @click="shareAllShow = true">共享事项&ensp;<i class="iconfont web-share"></i></span>&ensp;&ensp;
              <span class="disabled" v-if="disclosureItem.addCalender" @click="handleEdit('calendar')">
                <span class="show">已添加到日历&ensp;<i class="iconfont web-addyet"></i></span>
                <span class="hover">编辑添加到日历&ensp;<i class="iconfont web-calendar"></i></span>
              </span>
              <span @click="handleEdit('calendar')" v-else>添加到日历&ensp;<i class="iconfont web-calendar"></i></span>
            </el-col>
          </el-row>
          <div class="title-flex">
            <div class="falde-item about">
              <span class="name">创建者：{{disclosureItem.createUserName}}</span>
              <span>创建日期：{{$common.transTime(disclosureItem.createTime)[1]}}</span>
              <span>更新日期：{{$common.transTime(disclosureItem.updateTime)[1]}}</span>
            </div>
            <div class="falde-item fun">
              <span @click="archivedItemMain">归档清单</span>
              <span @click="printf">打印清单</span>
              <span @click="saveToTemplate">存为信披模板</span>
              <span @click="deleteClosureItemMain(disclosureItem)">删除</span>
            </div>
          </div>
          <el-table class="box-table-proceed" :data="itemNodeList" style="width: 100%">
            <!--<el-table-column prop="id" label="id"></el-table-column>-->
            <el-table-column label="序号" header-align="left" align="left" width="50">
              <template slot-scope="scope">
                <div class="indexBox">
                  <div>{{ scope.$index + 1 }}</div>
                  <div class="ibox">
                    <img :src="$image.disclosure.up" v-if="scope.$index != 0"
                         @click="moveNode (scope.row.id, 'UP')"/>
                    <img :src="$image.disclosure.down" :class="{'top': scope.$index==0}"
                         v-if="scope.$index + 1 != itemNodeList.length" @click="moveNode(scope.row.id, 'DOWN')"/>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="itemNodeStartDate" label="起止时间">
              <template slot-scope="scope">
                <!--<span v-if="scope.row.itemNodeStartDate!=0">{{$common.transTime(scope.row.itemNodeStartDate)[1]}}</span>
                <span
                  v-if="!(scope.row.itemNodeStartDate==0 || scope.row.itemNodeEndDate==0 || !scope.row.itemNodeStartDate || !scope.row.itemNodeEndDate)">~</span>
                <span v-if="scope.row.itemNodeEndDate!=0">{{$common.transTime(scope.row.itemNodeEndDate)[1]}}</span>-->
                {{scope.row.startEndDate}}
              </template>
            </el-table-column>
            <el-table-column prop="itemNodeName" label="节点名称" width="320"></el-table-column>
            <el-table-column prop="updateDate" label="编辑记录" width="160" header-align="center" align="center">
              <template slot-scope="scope">
                <div>{{scope.row.updateUserName + '编辑于'}}</div>
                <div>{{$common.transTime(scope.row.updateDate)[2]}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="tag" label="操作" width="180" header-align="center" align="center"
                             cell-class-name="printHidden">
              <template slot-scope="scope">
                <div class="table-operate-box">
                  <span title="编辑节点" class="table-operate-icon" @click="handleEdit('bianji',scope)">
                     <i class="iconfont web-editor"></i>
                  </span>
                  <span title="添加节点" class="table-operate-icon" @click="handleEdit('addItemNode',scope)">
                    <i class="iconfont web-jia1"></i>
                  </span>
                  <span title="节点已添加到日历" class="table-operate-icon no-addyet" @click="handleEdit('calendarNode',scope)"
                        v-if="scope.row.calendar">
                   <i class="iconfont web-addyet"></i>
                  </span>
                  <span title="添加节点到日历" class="table-operate-icon" @click="handleEdit('calendarNode',scope)" v-else>
                   <i class="iconfont web-calendar"></i>
                  </span>
                  <span title="删除节点" class="table-operate-icon color" @click="handleEdit('shanchu',scope)">
                    <i class="iconfont web-close"></i>
                  </span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
        <el-card class="box-card proceed right-content" shadow="never" style="padding-top:10%;" v-else>
          <v-noInfo :altText="'暂时没有事项'" :imgSrc="noneImg"></v-noInfo>
          <div class="center">
            <el-button class="addEvent" type="primary" @click="dialogVisible = true">
              <i class="iconfont web-editor"></i>&ensp;创建事项
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!--共享事项-->
    <el-dialog id="share-all-show" :visible.sync="shareAllShow" width="620px" center>
      <template slot="title">共享事项</template>
      <div class="body-content-three">
        <div class="check-all">
          <div class="title">
            <el-checkbox :indeterminate="isIndeterminateShare" v-model="checkAllShare"
                         @change="handleCheckAllChangeShare">
            <span class="label-name">
              <span>全选</span>
              <span class="right"><i class="el-icon-arrow-right"></i></span>
            </span>
            </el-checkbox>
          </div>
        </div>
        <div class="check-list">
          <el-checkbox-group v-model="checkedUserObj" @change="handleCheckedCitiesChangeShare">
            <template v-for="(item, index) of customUser">
              <div class="check-item">
                <el-checkbox :label="item.userId" :key="index">
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
        <el-button class="submit" size="small" type="primary" @click="updateItemSharedDetail">保 存</el-button>
      </template>
    </el-dialog>
    <!--编辑节点-->
    <el-dialog top="30vh" id="addEventDialog-two" :visible.sync="editItemNodeShow" width="620px" center>
      <template slot="title">编辑节点</template>
      <div class="addEventDialog-two-body">
        <el-form ref="formDom" :model="formEditItemNode" label-width="80px">
          <el-form-item class="input-def-item" label="节点名称:">
            <el-input :disabled="false" clearable v-model="formEditItemNode.itemNodeName" placeholder="节点名称"></el-input>
          </el-form-item>
          <el-form-item class="input-def-item" label="节点日期:">
            <el-date-picker :editable="false" popper-class="dateIndexInfo" class="addEvent-date-picker" @change="changePicker"
                            v-model="formEditItemNode.itemNodeDate" type="daterange" align="right" unlink-panels
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer">
        <el-button type="primary" @click="editItemNode">保 存</el-button>
      </template>
    </el-dialog>
    <!--编辑事项名称-->
    <el-dialog top="30vh" id="addEventDialog-two" :visible.sync="editItemShow" width="620px" center>
      <template slot="title">编辑自定义模板名称</template>
      <div class="addEventDialog-two-body">
        <el-form ref="formDom" :model="formEditItem" label-width="80px">
          <el-form-item class="input-def-item" label="模板名称:">
            <el-input :disabled="false" clearable v-model="formEditItem.disclosureItemName"
                      placeholder="模板名称"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer">
        <el-button type="primary" @click="editItemClear">保 存</el-button>
      </template>
    </el-dialog>
    <!--插入节点-->
    <el-dialog top="30vh" id="addEventDialog-two" :visible.sync="addItemNodeShow" width="620px" center>
      <template slot="title">插入节点</template>
      <div class="addEventDialog-two-body">
        <el-form ref="formDom" :model="formAddItemNode" label-width="80px">
          <el-form-item class="input-def-item" label="节点名称:">
            <el-input :disabled="false" v-model="formAddItemNode.itemNodeName" placeholder="请输入节点名称"></el-input>
          </el-form-item>
          <el-form-item class="input-def-item" label="节点日期:">
            <el-date-picker class="addEvent-date-picker" popper-class="dateIndexInfo"
                            v-model="formAddItemNode.itemNodeDate" type="daterange" align="right" unlink-panels
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            value-format="yyyy-MM-dd"
                            :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <template slot="footer">
        <el-button type="primary" @click="addItemNode">保 存</el-button>
      </template>
    </el-dialog>
    <!--添加节点到日历-->
    <el-dialog id="addEventDialog-two" :visible.sync="calendarNodeShow" width="620px" center>
      <template slot="title">添加节点到日历</template>
      <div class="add-event-calendar" v-if="calendarFormData.nextNode == 0">
        <el-form ref="form" label-width="80px">
          <el-form-item class="input-def-item" label="节点类型:">
            <el-input :disabled="true" v-model="calendarFormData.node.itemName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item class="input-def-item" label="节点名称:">
            <el-input :disabled="true" v-model="calendarFormData.node.itemNodeName" placeholder=""></el-input>
          </el-form-item>
          <el-form-item class="input-def-item" label="节点日期">
            <el-date-picker class="addEvent-date-picker" readonly disabled popper-class="dateIndexInfo"
                            v-model="calendarFormData.nodeDate" type="daterange" align="right" unlink-panels
                            range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                            :picker-options="pickerOptions">
            </el-date-picker>
          </el-form-item>
          <el-form-item class="input-def-item" label="我的日历:">
            <el-select v-model="calendarId" placeholder="请选择" no-data-text="请选择">
              <el-option v-for="item in myCalendarList" :key="item.id" :label="item.calendarName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="add-event-calendar event-calendar" v-else-if="calendarFormData.nextNode == 1">
        <el-tabs v-model="activeCalendarName" @tab-click="handleClick">
          <el-tab-pane label="邀请对象" name="second">
            <div class="body-content-three">
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
                <el-checkbox-group v-model="checkedUserObjNode" @change="handleCheckedCitiesChange">
                  <template v-for="(item,index) of enterpriseUserList">
                    <div class="check-item">
                      <el-checkbox :label="item.userId" :key="index">
                        <span class="label-name">
                           <img :src="item.userAvatar" alt=""><span>{{item.userName}}</span>
                        </span>
                      </el-checkbox>
                    </div>
                  </template>
                </el-checkbox-group>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!---->
      <div class="add-event-calendar" v-else-if="calendarFormData.nextNode == 2">
        <div class="event-text">该清单已添加到团队日历，即团队所有成员均可共享该日历！</div>
      </div>
      <template slot="footer">
        <el-button type="primary" @click="nextEventCalendar('node')" v-if="calendarFormData.nextNode == 0">下一步
        </el-button>
        <el-button type="primary" @click="calendarEventSub('node', 1)"
                   v-else-if="calendarFormData.nextNode == 1">完成
        </el-button>
        <el-button type="primary" @click="calendarEventSub('node', 2)" v-else>完成</el-button>
      </template>
    </el-dialog>
    <!--添加事项到日历-->
    <el-dialog id="addEventDialog-two" :visible.sync="calendarEventShow" width="620px" center>
      <template slot="title">添加事项到日历</template>
      <!---->
      <div class="add-event-calendar" v-if="calendarFormData.nextEvent == 0">
        <el-form ref="formDom" label-width="80px">
          <el-form-item class="input-def-item" label="事件名称:">
            <el-input :disabled="true" v-model="calendarFormData.event.itemName" placeholder="事件名称"></el-input>
          </el-form-item>
          <el-form-item class="input-def-item" label="我的日历:">
            <el-select v-model="calendarId" placeholder="请选择" no-data-text="请选择">
              <el-option v-for="item in myCalendarList" :key="item.id" :label="item.calendarName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <!---->
      <div class="add-event-calendar event-calendar" v-else-if="calendarFormData.nextEvent == 1">
        <el-tabs v-model="activeCalendarName" @tab-click="handleClick">
          <el-tab-pane label="邀请对象" name="second">
            <div class="body-content-three">
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
                <el-checkbox-group v-model="checkedUserObjEvent" @change="handleCheckedCitiesChange">
                  <template v-for="(item,index) of enterpriseUserList">
                    <div class="check-item">
                      <el-checkbox :label="item.userId" :key="index">
                        <span class="label-name">
                           <img :src="item.userAvatar" alt=""><span>{{item.userName}}</span>
                        </span>
                      </el-checkbox>
                    </div>
                  </template>
                </el-checkbox-group>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!---->
      <div class="add-event-calendar" v-else-if="calendarFormData.nextEvent == 2">
        <div class="event-text">该清单已添加到团队日历，即团队所有成员均可共享该日历！</div>
      </div>
      <template slot="footer">
        <el-button type="primary" @click="nextEventCalendar('event')" v-if="calendarFormData.nextEvent == 0">下一步
        </el-button>
        <el-button type="primary" @click="calendarEventSub('event',calendarFormData.nextEvent)" v-else>完成</el-button>
      </template>
    </el-dialog>
    <!---->
    <add-event v-model="dialogVisible" @close="closeAddEvent"></add-event>
  </div>
</template>

<script>
  import AddEvent from './components/addEvent.vue'

  export default {
    components: {
      AddEvent
    },
    name: "disclosure-proceed",
    data() {
      return {
        editItemShow: false,
        formEditItem: {
          disclosureItemName: '',
          id: ''
        },
        //
        checkedUserObj: [],
        isIndeterminate: false,
        isIndeterminateShare: false,
        shareAllShow: false,
        checkAll: false,
        checkAllShare: false,
        customUser: [], // 获取到的企业用户
        //
        editNodeData: {},
        editItemNodeShow: false,
        // 编辑节点窗口
        formEditItemNode: {
          itemNodeId: '',
          itemNodeName: '',
          itemNodeDate: ['-', '-']
        },
        // 插入节点弹窗
        formAddItemNode: {
          itemId: '',
          itemName: '',
          itemNodeNo: '',
          itemNodeName: '',
          itemNodeDate: ''
        },
        //
        calendarEventShow: false,
        calendarNodeShow: false,
        //
        calendarList: [
          {id: 1, calendarName: '团队日历'},
          {id: 0, calendarName: '个人日历'}
        ],
        calendarFormData: {
          event: {
            itemName: ''
          },
          // 控制下一步
          nextEvent: 0,
          //
          nodeDate: ['-', '-'],
          node: {
            itemNodeName: '',
            itemName: ''
          },
          // 控制下一步
          nextNode: 0,
          //
          selectCalendar: {}
        },
        //
        dialogVisible: false,
        noneImg: this.$image.disclosure.default,
        myCalendarList: [],
        calendarId: '',
        userId: '',
        userName: '',
        companyId: '',
        activeName: 'default',
        activeNames: [0],
        addCalendarShow: false,
        addItemNodeShow: false,
        addCalendarShowNext: false,
        activeCalendarName: 'second',
        //
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        searchWord: '',
        itemNodeList: [], // 右侧表格节点列表
        disclosureItemList: [], // 左侧事项列表
        disclosureItem: {},  // 当前选中项
        itemShareInfo: {},
        checkedUserObjEvent: [],
        checkedUserObjNode: [],
        enterpriseUserList: [] // 该公司企业用户信息
      }
    },
    watch: {
      calendarEventShow: function (val) {
        if (!val) {
          this.calendarFormData.nextEvent = 0;
        }
      },
      calendarNodeShow: function (val) {
        if (!val) {
          this.calendarFormData.nextNode = 0;
        }
      },
      shareAllShow: function (val) {
        if (val) {
          this.getDisClosureItemSharedUserInfo(this.disclosureItem.id);
        }
      },
      searchWord: function (val) {
        console.log(val)
        this.disclosureItemList.forEach((item) => {
          if (item.itemName.indexOf(val) > -1) {
            item.search = true
          } else {
            item.search = false
          }
        })
      },
      '$route': function () {
        this.id = this.$route.query.id
        this.getInfoDisclosureItemMain()
      }
    },
    created() {
      this.id = this.$route.query.id
      this.userId = this.$cookie.get('userId')
      let userInfo = JSON.parse(this.$cookie.get('userInfo'));
      this.companyId = userInfo.companyId
      this.userName = userInfo.userName;
      this.getCalendarByUserId(); // 日历获取到的信息
      this.getEnterpriseUserList();  // 企业用户

      this.getInfoDisclosureItemMain();
      //
    },
    methods: {
      // 编辑事项保存
      editItemClear() {
        this.updateInfoClosureItemMain();
      },
      // 编辑事项 打开
      editorEvent(index) {
        console.log(this.disclosureItemList[index]);
        this.formEditItem.disclosureItemName = this.disclosureItemList[index].itemName;
        this.formEditItem.id = this.disclosureItemList[index].id;
        this.editItemShow = true;
      },
      // update 事项
      updateInfoClosureItemMain() {
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.updateInfoClosureItemMain,
          params: {
            itemName: this.formEditItem.disclosureItemName,
            itemId: this.formEditItem.id,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.getInfoDisclosureItemMain();
            this.editItemShow = false;
          }
        }).catch((err) => {

        })
      },
      //
      calendarEventSub(type, index) {
        if (type == 'event') {
          if (this.calendarFormData.nextEvent == 1) {
            this.addItemMainToCalender(0);
          } else if (this.calendarFormData.nextEvent == 2) {
            this.calendarEventShow = false;
          }
        } else if (type == 'node') {
          if (this.calendarFormData.nextNode == 1) {
            this.addNodeToCalender(0);
          } else if (this.calendarFormData.nextNode == 2) {
            this.calendarNodeShow = false;
          }
        }
      },
      //
      nextEventCalendar(type) {
        let calendarEl = {}
        switch (type) {
          case 'node':
            this.myCalendarList.forEach((item) => {
              if (item.id == this.calendarId) {
                calendarEl = item;
              }
            });
            if (calendarEl.team) {
              // 团队日历
              this.addNodeToCalender(1);
            } else {
              this.calendarFormData.nextNode += 1;
              //   非团队日历
            }
            break;
          case 'event':
            console.log(this.calendarId);
            console.log(this.myCalendarList);
            this.myCalendarList.forEach((item) => {
              if (item.id == this.calendarId) {
                calendarEl = item;
              }
            })
            if (calendarEl.team) {
              // 团队日历
              this.addItemMainToCalender(1);
            } else {
              this.calendarFormData.nextEvent += 1;
            }
            break
        }
      },
      //
      addNodeToCalender(calenderType) {
        let parkaterIds = [];
        this.checkedUserObjNode.forEach((item) => {
          parkaterIds.push(item);
        })
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.addNodeToCalender,
          params: {
            nodeId: this.calendarFormData.node.id,
            calenderType: calenderType,
            parkaterIds: parkaterIds.toString(),
            inviteId: '', // 添加不填
            isAccept: '', // 添加不填
            calenderId: this.calendarId,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            if (this.calendarFormData.nextNode == 1) {
              this.calendarNodeShow = false;
              this.$message({showClose: true, type: "success", duration: 3000, message: '添加完成'});
            } else {
              this.calendarFormData.nextNode = 2;
            }
            this.getItemNodeList(this.disclosureItem.id)
          } else if (res.data.returnCode == -1) {
            // this.$message({showClose: true, type: "success", duration: 3000, message: res.data.returnMsg});
          }
        }).catch((err) => {

        })
      },
      // disclosureItemMain/addItemMainToCalender
      addItemMainToCalender(calenderType) {
        let parkaterIds = [];
        this.checkedUserObjEvent.forEach((item) => {
          parkaterIds.push(item);
        })
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.addItemMainToCalender,
          params: {
            itemId: this.disclosureItem.id,
            calenderType: calenderType,
            parkaterIds: parkaterIds.toString(),
            inviteId: '', // 添加不填
            isAccept: '', // 添加不填
            calenderId: this.calendarId,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            if (this.calendarFormData.nextEvent == 1) {
              this.$message({showClose: true, type: "success", duration: 3000, message: '添加完成'});
              this.calendarEventShow = false;
            } else {
              this.calendarFormData.nextEvent = 2;
            }
            this.getInfoDisclosureItemMain();
            // this.getItemNodeList(this.disclosureItem.id)
          } else if (res.data.returnCode == -1) {
            this.$message({showClose: true, type: "success", duration: 3000, message: res.data.returnMsg});
          }
        }).catch((err) => {

        })
      },
      //
      changePicker(val) {
        console.log(val);
      },
      //
      updateItemSharedDetail() {
        let parkaterIds = [];
        this.checkedUserObj.forEach((item) => {
          parkaterIds.push(item);
        })
        console.log(this.disclosureItem);
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.updateItemSharedDetail,
          params: {
            userId: this.userId,
            itemId: this.disclosureItem.id,
            itemName: this.disclosureItem.itemName,
            parkaterIds: parkaterIds.toString()
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            console.log(324234234);
            this.getInfoDisclosureItemMain();
            this.shareAllShow = false
            this.$message({showClose: true, type: "success", duration: 3000, message: '共享事项成功'});
          } else {
            console.log(324234234);
            this.$message({showClose: true, type: "success", duration: 3000, message: '共享事项失败，请稍后重试'});
          }
        }).catch((err) => {

        })
      },
      // 获取节点 共享的人
      getDisClosureItemSharedUserInfo(itemId) {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getDisClosureItemSharedUserInfo,
          params: {
            userId: this.userId,
            itemId: itemId,
            companyId: this.companyId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.customUser = res.data.returnObject;
            this.checkedUserObj = [];
            this.customUser.forEach((item) => {
              if (item.shared) {
                this.checkedUserObj.push(item.userId);
              }
            })
          }
        }).catch((err) => {

        })
      },
      // 更新节点
      editItemNode() {
        if (this.formEditItemNode.itemNodeName.trim() == '') {
          this.$message({showClose: true, type: "success", duration: 2000, message: '请输入节点名称'});
          return
        }
        console.log('==========>', this.formEditItemNode.itemNodeDate);
        let itemNodeStartDate = '', itemNodeEndDate = '';
        if (this.formEditItemNode.itemNodeDate == null || this.formEditItemNode.itemNodeDate.length == 0) {
          itemNodeStartDate = '';
          itemNodeEndDate = '';
        } else {
          let startDate = this.formEditItemNode.itemNodeDate[0]
          let endDate = this.formEditItemNode.itemNodeDate[1]
          if (startDate != '-') {
            startDate = this.$moment(this.formEditItemNode.itemNodeDate[0]).format('YYYY/MM/DD')
            itemNodeStartDate = this.$common.getTimestampms(startDate + ' 00:00:00')
          }
          if (endDate != '-') {
            endDate = this.$moment(this.formEditItemNode.itemNodeDate[1]).format('YYYY/MM/DD')
            itemNodeEndDate = this.$common.getTimestampms(endDate + ' 00:00:00')
          }
        }
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.editItemNode,
          params: {
            nodeId: this.formEditItemNode.itemNodeId,
            nodeName: this.formEditItemNode.itemNodeName,
            itemNodeStartDate: itemNodeStartDate,
            itemNodeEndDate: itemNodeEndDate,
            userId: this.userId,
            userName: this.userName
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '事项节点修改成功'});
            this.getItemNodeList(this.disclosureItem.id);
            this.editItemNodeShow = false
          }
        }).catch((err) => {

        })
      },
      //
      closeAddEvent(val) {
        this.dialogVisible = false
      },
      // 筛选
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
      //  /************* type, scope *************/
      handleEdit(type, scope) {
        console.log(type, scope);
        this.editNodeData = scope;
        let StaDate = '', endDate = '';
        switch (type) {
          //
          case 'bianji':
            this.formEditItemNode.itemNodeName = this.editNodeData.row.itemNodeName;
            this.formEditItemNode.itemNodeId = this.editNodeData.row.id;
            console.log(this.formEditItemNode);
            if (this.editNodeData.row.itemNodeStartDate == 0 || this.editNodeData.row.itemNodeStartDate == null) {
              StaDate = '-';
            } else {
              StaDate = this.$common.transTime(this.editNodeData.row.itemNodeStartDate)[1];
            }
            if (this.editNodeData.row.itemNodeEndDate == 0 || this.editNodeData.row.itemNodeEndDate == null) {
              endDate = '-';
            } else {
              endDate = this.$common.transTime(this.editNodeData.row.itemNodeEndDate)[1];
            }
            if (StaDate == '-' && endDate == '-') {
              this.formEditItemNode.itemNodeDate = [];
            } else {
              this.formEditItemNode.itemNodeDate = [StaDate, endDate];
            }
            this.editItemNodeShow = true;
            break;
          //
          case 'calendarNode':
            // 添加节点到日历
            this.calendarId = this.myCalendarList[0].id;
            this.calendarFormData.node = scope.row;
            if (this.editNodeData.row.itemNodeStartDate == 0 || this.editNodeData.row.itemNodeStartDate == null) {
              StaDate = '-';
            } else {
              StaDate = this.$common.transTime(this.editNodeData.row.itemNodeStartDate)[1];
            }
            if (this.editNodeData.row.itemNodeEndDate == 0 || this.editNodeData.row.itemNodeEndDate == null) {
              endDate = '-';
            } else {
              endDate = this.$common.transTime(this.editNodeData.row.itemNodeEndDate)[1];
            }
            //
            if (scope.row.calendar) {
              this.checkNodeInCalendar(scope.row.id);
            }
            //
            if (StaDate == '-' && endDate == '-') {
              this.calendarFormData.nodeDate = [];
              this.$message({showClose: true, type: "success", duration: 3000, message: '请先添加节点起止日期'});
            } else {
              this.calendarFormData.nodeDate = [StaDate, endDate];
              this.calendarNodeShow = true;
            }
            //
            break;
          //
          case 'calendar':
            // 添加项目到日历
            this.calendarId = this.myCalendarList[0].id;
            if (this.disclosureItem.addCalender) {
              // 如果是已添加项目到日历
              console.log('this', this.enterpriseUserList);
              console.log('this', this.myCalendarList);
              this.getItemMainSharedInfo(this.disclosureItem.id);
            }
            //
            this.calendarFormData.event = this.disclosureItem;
            this.calendarEventShow = true;
            break;
          case 'addItemNode':
            this.formAddItemNode.itemNodeName = ''
            this.formAddItemNode.itemNodeDate = ''
            this.formAddItemNode.itemId = scope.row.itemId
            this.formAddItemNode.itemName = scope.row.itemName
            this.formAddItemNode.itemNodeNo = scope.$index + 1
            this.addItemNodeShow = true;
            break;
          case 'shanchu':
            this.$confirm('确定删除吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.deleteItemNode(scope.row.id)
            }).catch(() => {
            })
            break;
        }
      },
      // 公司 同事信息 checkbox
      handleCheckAllChange(val) {
        console.log('34324', val);
        let userData = [];
        this.enterpriseUserList.forEach((item) => {
          userData.push(item.userId);
        })
        this.checkedUserObj = val ? userData : [];
        this.checkedUserObjEvent = val ? userData : [];
        this.checkedUserObjNode = val ? userData : [];
        this.isIndeterminate = false;
      },
      //
      handleCheckedCitiesChange(value) {
        console.log('val', value);
        this.checkedUserObj = value;
        this.checkedUserObjEvent = value;
        this.checkedUserObjNode = value;
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.enterpriseUserList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.enterpriseUserList.length;
      },
      // 公司 同事信息 checkbox
      handleCheckAllChangeShare(val) {
        console.log('34324', val);
        let userData = [];
        this.customUser.forEach((item) => {
          userData.push(item.userId);
        })
        this.checkedUserObj = val ? userData : [];
        this.isIndeterminateShare = false;
      },
      //
      handleCheckedCitiesChangeShare(value) {
        console.log('val', value, this.checkedUserObj);
        this.checkedUserObj = value;
        let checkedCount = value.length;
        this.checkAllShare = checkedCount === this.customUser.length;
        this.isIndeterminateShare = checkedCount > 0 && checkedCount < this.customUser.length;
      },
      //
      handleClick(row) {
        console.log(row);
      },
      //
      checkNodeInCalendar(nodeId) {
        this.$http({
          method: 'GET',
          url: this.$api.manage.checkNodeInCalendar,
          params: {
            nodeId: nodeId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            let itemShareInfo = res.data.returnObject;
            this.calendarId = this.myCalendarList[0].id
            this.myCalendarList.forEach((item) => {
              if (item.id == itemShareInfo.calendarId[0]) {
                this.calendarId = item.id;
              }
            });
            console.log('w435435634654645====>', this.calendarId);
            console.log('w435435634654645====>', this.myCalendarList);
            //
            this.checkedUserObjNode = [];
            //
            let dataArr = this.$common.unique(itemShareInfo.invitedUserIds);
            this.customUser = this.enterpriseUserList;
            this.enterpriseUserList.forEach((item1) => {
              dataArr.forEach((item2) => {
                if (item1.userId == item2) {
                  this.checkedUserObjNode.push(item1.userId);
                }
              })
            });
            console.log('23452354235=====>', this.checkedUserObjNode);
            // this.handleCheckAllChange(true);
            this.handleCheckedCitiesChange(this.checkedUserObjNode);

          }
        }).catch((err) => {

        })
      },
      // 获取事项到的回显状态
      getItemMainSharedInfo(itemId) {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getItemMainSharedInfo,
          params: {
            itemId: itemId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.itemShareInfo = res.data.returnObject;
            this.calendarId = this.myCalendarList[0].id
            this.myCalendarList.forEach((item) => {
              if (item.id == this.itemShareInfo.calenderId) {
                this.calendarId = item.id;
              }
            });
            //
            this.checkedUserObjEvent = [];
            //
            let parkaterIds = this.$common.ImpArr(this.itemShareInfo.parkaterIds);
            console.log(parkaterIds);
            // this.customUser = this.enterpriseUserList;
            this.enterpriseUserList.forEach((item1) => {
              parkaterIds.forEach((item2) => {
                if (item1.userId == item2) {
                  this.checkedUserObjEvent.push(item1.userId);
                }
              })
            });
            console.log('56546checkedUserObj', this.checkedUserObjEvent);
            // this.handleCheckAllChange(true);
            this.handleCheckedCitiesChange(this.checkedUserObjEvent);
          }
        }).catch((err) => {

        })
      },
      //
      handleChange(val) {
        console.log(val);
      },
      //
      resetData() {
        this.$router.push({path: '/disclosure/proceed'});
        this.getInfoDisclosureItemMain()
      },
      // 获取事项列表
      getInfoDisclosureItemMain() {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getInfoDisclosureItemMain,
          params: {
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let disclosureItemList = res.data.returnObject ? res.data.returnObject : []
            disclosureItemList.forEach((item) => {
              item.search = true;
              item.select = false;
            })
            this.disclosureItemList = disclosureItemList
            // 有参数根据参数id判断选中项，没有默认选中第一项
            if (this.id) {
              disclosureItemList.forEach((item) => {
                if (item.id == this.id) {
                  this.disclosureItem = item
                  this.getItemNodeList(item.id)
                  item.select = true;
                }
              })
            } else {
              disclosureItemList[0].select = true
              this.disclosureItem = this.disclosureItemList[0]
              this.getItemNodeList(this.disclosureItem.id)
              this.$router.push({path: '/disclosure/proceed', query: {id: this.disclosureItem.id}})
            }
          } else {
            this.disclosureItemList = []
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
            this.itemNodeList = res.data.returnObject;
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
      // 左侧事项点击事件
      disclosureItemHandle(item, index) {
        this.disclosureItemList.forEach((item) => {
          item.select = false
        })
        this.disclosureItem = item
        this.$set(this.disclosureItemList[index], 'select', true)
        this.getItemNodeList(this.disclosureItem.id)
        this.$router.push({path: '/disclosure/proceed', query: {id: this.disclosureItem.id}})
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
          .el-table_1_column_5 {display:none}
          .is-left {text-align: left;}
        </style>`
        newWindow.document.write(codestr + cssStr)   // 向文档写入HTML表达式或者JavaScript代码
        newWindow.document.close()     // 关闭document的输出流, 显示选定的数据
        newWindow.print()   // 打印当前窗口
      },
      // ---------顶部按钮事件----------- //
      // 归档
      archivedItemMain() {
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.archivedItemMain,
          params: {
            itemId: this.disclosureItem.id,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '归档成功'});
            this.resetData()
          } else {
            this.$message({showClose: true, type: "error", duration: 3000, message: '归档失败'});
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
      deleteClosureItemMain(item) {
        console.log(this.disclosureItem);
        console.log(this.$cookie.get('userId'));
        let userHome = '';
        if (this.$cookie.get('userId') == item.createUserId) {
          userHome = '确定删除“' + item.itemName + '”吗?';
        } else {
          userHome = '确定删除 “' + item.createUserName + '” 创建的“' + item.itemName + '”吗?';
        }
        this.$confirm(userHome, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'delete',
            url: this.$api.disclosure.deleteClosureItemMain,
            params: {
              itemId: item.id,
              userId: this.userId
            }
          }).then((res) => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.$message({showClose: true, type: "success", duration: 3000, message: '删除成功'});
              this.resetData()
            } else {
              this.$message({showClose: true, type: "error", duration: 3000, message: '删除失败'});
            }
          })
        }).catch(() => {
        })
      },
      // ---------表格事件-----------
      // 移动事项节点
      moveNode(id, moveType) {
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.moveNode,
          params: {
            nodeId: id,
            moveType: moveType  // UP DOWN
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '移动成功'});
            this.getItemNodeList(this.disclosureItem.id)
          } else {
            this.$message({showClose: true, type: "error", duration: 3000, message: '移动失败'});
          }
        })
      },
      // 删除节点
      deleteItemNode(nodeId) {
        this.$http({
          method: 'delete',
          url: this.$api.disclosure.deleteItemNode,
          params: {
            nodeId: nodeId,
            userId: this.userId  // UP DOWN
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '成功'});
            this.getItemNodeList(this.disclosureItem.id)
          } else {
            this.$message({showClose: true, type: "error", duration: 3000, message: '移动失败'});
          }
        })
      },
      // 往下插入事项节点
      addItemNode() {
        let itemNodeStartDate = this.$common.getTimestampms(this.formAddItemNode.itemNodeDate[0] + ' 00:00:00')
        let itemNodeEndDate = this.$common.getTimestampms(this.formAddItemNode.itemNodeDate[1] + ' 00:00:00')
        if (!this.formAddItemNode.itemNodeName) {
          this.$message({showClose: true, type: "error", duration: 3000, message: '节点名称不能为空'})
          return false
        }
        this.$http({
          method: 'POST',
          url: this.$api.disclosure.addItemNode,
          data: {
            createUserId: this.userId,
            createUserName: this.userName,
            itemId: this.formAddItemNode.itemId,
            itemName: this.formAddItemNode.itemName,
            itemNodeEndDate: itemNodeEndDate,
            itemNodeName: this.formAddItemNode.itemNodeName,
            itemNodeNo: this.formAddItemNode.itemNodeNo,
            itemNodeStartDate: itemNodeStartDate,
            updateUserId: this.userId,
            updateUserName: this.userName
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({showClose: true, type: "success", duration: 3000, message: '事项节点插入成功'});
            this.getItemNodeList(this.disclosureItem.id)
            this.addItemNodeShow = false
          } else {
            this.$message({showClose: true, type: "error", duration: 3000, message: '事项节点插入失败'});
          }
        })
      },
      // 获取日历
      getCalendarByUserId() {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getCalendarByUserId,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.myCalendarList = res.data.returnObject
            this.calendarId = this.myCalendarList[0].id
          } else {
            this.myCalendarList = []
            this.calendarId = ''
          }
        })
      },
      // 获取企业版用户信息
      getEnterpriseUserList() {
        this.$http({
          method: 'GET',
          url: this.$api.disclosure.getEnterpriseUserList,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: this.companyId
          }
        }).then((res) => {
          console.log(res.data.returnObject);
          if (res.data.returnCode == 200) {
            this.enterpriseUserList = res.data.returnObject;
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  .dateIndexInfo {
    z-index: 3000 !important;
  }
  #share-all-show {
    .el-dialog__header {
      border-bottom: 1px solid #e3e3e3;
    }
    .el-dialog--center .el-dialog__body {
      padding: 0 0;
    }
    .el-dialog__footer {
      padding: 15px;
      // border-top: 1px solid #e3e3e3;
      .submit {
        width: 175px;
        height: 35px;
        padding: 0;
        font-size: 14px;
      }
    }
    .body-content-three {
      /*padding: 0 20px;*/
      max-height: 320px;
      min-height: 320px;
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
  #addEventDialog {
    .el-dialog__header {
      color: #ffb148;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 1px solid #dcdfe6;
    }
    .el-dialog--center .el-dialog__body {
      padding: 20px 20px 0 20px;
    }
    .el-dialog__footer {
      .el-button {
        width: 175px;
        height: 35px;
        padding: 0;
        font-size: 16px;
        line-height: 35px;
      }
    }
  }
  #addEventDialog-two {
    .addEventDialog-two-body {
      padding: 20px 20px 0 20px;
      .addEvent-date-picker {
        width: 100%;
      }
      .el-form {
        .input-def-item {
          margin-bottom: 10px;
        }
      }
    }
    .el-dialog__header {
      color: #ffb148;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 1px solid #dcdfe6;
    }
    .el-dialog__body {
      padding: 0 0;
      .pane-scroll-default {
        max-height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
        .el-input__inner {
          border-color: #ebeef5;
        }
        .collapse-select {
          border-top: 0;
          .el-collapse-item__content {
            padding-bottom: 0;
          }
          .collapse-select-list {
            ul {
              li {
                height: 40px;
                line-height: 40px;
                text-indent: 2em;
                border-top: 1px solid #ebeef5;
                color: #8d8d8d;
                font-size: 14px;
                &:hover {
                  background-color: rgba(255, 177, 72, 0.1);
                }
              }
            }
          }
        }
      }
    }
    .add-event-calendar {
      padding: 20px 20px;
      transition: all 0.3s;
      &.event-calendar {
        padding: 0;
        .el-tabs__nav-scroll {
          padding: 0 20px;
        }
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__header {
        margin: 0;
      }
      .event-text {
        width: 100%;
        text-align: center;
        font-size: 14px;
      }
      .body-content-three {
        /*padding: 0 20px;*/
        max-height: 320px;
        min-height: 320px;
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
      .addMobile-box-scroll {
        min-height: 250px;
        max-height: 250px;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      .addMobile-box {
        .addMobileInput {
          font-size: 16px;
          height: 40px;
        }
        .addMobileBtn {
          background-color: #f0f1f5;
          border-color: #e3e3e3;
          color: #8d8d8d;
          font-size: 16px;
          padding: 0 12px;
          height: 40px;
        }
        .clearMobileBtn {
          color: #8d8d8d;
          font-size: 16px;
          padding: 0 0;
          height: 40px;
        }
      }
      .add-calendar-user-item {
        ul {
          li {
            display: flex;
            padding: 10px 0;
            align-items: center;
            border-bottom: 1px solid #f0f1f5;
            > div {
              flex: 1;
              &.img {
                flex: 0 0 50px;
                border-radius: 50%;
                img {
                  height: 50px;
                  width: 50px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
              }
              &.name {
                padding-left: 20px;
                font-size: 16px;
                overflow: hidden; /*超出部分隐藏*/
                white-space: nowrap; /*不换行*/
                text-overflow: ellipsis; /*超出部分文字以...显示*/
              }
              &.clear {
                flex: 0 0 20px;
                text-align: right;
                i {
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
      .input-def-item {
        margin-bottom: 10px;
        .el-select {
          width: 100%;
        }
        .picker-box {
          display: flex;
          li {
            flex: 1;
            &.middle {
            }
          }
        }
      }
      .addEvent-date-picker {
        width: 100%;
      }
      .input-def {
        .el-input__inner {
          border: transparent;
        }
      }
    }
    .el-dialog__footer {
      .el-button {
        width: 175px;
        height: 35px;
        padding: 0;
        font-size: 16px;
        line-height: 35px;
      }
    }
  }
  #disclosure-proceed {
    .box-card {
      margin-top: 20px;
      min-height: 100px;
      &.proceed {
        min-height: 785px;
        margin-bottom: 20px;
      }
      .item {
        padding: 15px 10px;
        border-bottom: 1px solid #f0f1f5;
        .addSelect {
          width: 100%;
          .el-input__inner {
            //  border-color: #ffb148;
            //  border-right-color: transparent;
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
              flex: 0 0 65%;
              text-align: left;
              font-size: 14px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              i {
                margin-right: 5px;
                font-size: 14px;
              }
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
    .noInfo {
      min-height: 260px;
      height: 260px;
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
            display: flex;
            align-items: center;
            flex: 0 0 70%;
            .name {
              display: inline-block;
              max-width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
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
        .text-right {
          text-align: right;
          span {
            cursor: pointer;
          }
          .disabled {
            transition: all 0.3s;
            .hover {
              display: none;
            }
            .show {
            }
            &:hover {
              color: #ffb148;
              .show {
                display: none;
              }
              .hover {
                display: inline-block;
              }
            }
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
            &.no-addyet {
              // cursor: auto;
            }
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
        .indexBox {
          display: flex;
          align-items: center;
          .ibox {
            margin-left: 4px;
            height: 13px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            img {
              cursor: pointer;
            }
            .top {
              margin-top: 6px;
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
  }
</style>
