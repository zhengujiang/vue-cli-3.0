<template>
  <div id="relationshipResearch">
    <div class="title">
      <p class="returnDatabase" @click="goBack"><i class="el-icon-arrow-left"></i> 返回投资者数据库管理</p>
    </div>
    <div>
      <el-row :gutter="15">
        <el-col :span="18">
          <div class="survey-records">
            <p class="survey">{{userInfo.enterpriseCompanyName}}公司投资者关系调研记录</p>
          </div>
          <el-form :model="ruleForm" ref="ruleForm" label-width="90px" class="investor">
            <el-form-item class="record-theme" label="记录主题" required>
              <el-radio-group @change="selectTheme" v-model="ruleForm.theme">
                <el-radio class="first-row" label="特定对象调研"></el-radio>
                <el-radio class="first-row" label="分析师会议"></el-radio>
                <el-radio class="first-row" label="媒体采访"></el-radio>
                <el-radio label="业绩说明会"></el-radio>
                <el-radio class="second-row" label="新闻发布会"></el-radio>
                <el-radio class="second-row" label="路演活动"></el-radio>
                <el-radio class="second-row" label="现场参观"></el-radio>
                <el-radio label="其他主题">其他
                  <div class="other-topics">
                    <el-input :disabled="inputBox" :class="[{'is-success': errFrom.otherTheme === 1}, {'is-error': errFrom.otherTheme === 0}]"
                     @focus="oninput('otherTheme')" placeholder="其他主题"
                      v-model="ruleForm.otherTheme"></el-input>
                    <div v-show="errFrom.otherTheme===0" class="el-form-item__error">请至少选择一个记录主题或填写其他主题</div>
                  </div>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="option activeDate" label="活动时间" required>
              <el-col :span="11" class="activityTime" style="padding-left: 0px;">
                <el-form-item :class="[{'is-success': errFrom.activiteTime === 1}, {'is-error': errFrom.activiteTime === 0}]">
                  <el-date-picker @blur="onblur('activiteTime')" @focus="oninput('activiteTime')" type="date"
                                  placeholder="选择日期" v-model="ruleForm.activiteTime"></el-date-picker>
                  <div v-show="errFrom.activiteTime===0" class="el-form-item__error">请选择活动时间</div>
                </el-form-item>
              </el-col>
              <el-col :span="11" class="activityTime" style="padding-left: 7px;">
                <el-form-item>
                  <el-input v-model="ruleForm.activiteDetailedTime" placeholder="请输入详细时间"></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="活动地址" required class="option">
              <el-col :span="8" class="space" style="padding-left:0px;">
                <el-form-item
                  :class="[{'is-success': errFrom.activiteAddressProvince === 1}, {'is-error': errFrom.activiteAddressProvince === 0}]">
                  <el-select v-model="ruleForm.activiteAddressProvince" placeholder="请选择" no-data-text="请选择"
                             @change="getCitylistOnChang">
                    <el-option v-for="item in areaData.pro" :key="item.id" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                  <div v-show="errFrom.activiteAddressProvince===0" class="el-form-item__error">请选择活动地址</div>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="space" style="padding-left:5px;">
                <el-form-item>
                  <el-select v-model="ruleForm.activiteAddressCity" placeholder="请选择" no-data-text="请选择"
                             @change="getTownList">
                    <el-option v-for="item in cityList" :key="item.id" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="space region">
                <el-form-item>
                  <el-select v-model="ruleForm.activiteAddressTown" placeholder="请选择" no-data-text="请选择">
                    <el-option v-for="item in townList" :key="item.id" :label="item.name"
                               :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item class="textarea-address">
              <el-input type="textarea" placeholder="请输入详细地址" v-model="ruleForm.activiteAddressStreet"></el-input>
            </el-form-item>

            <el-form-item :class="[{'is-success': errFrom.investors === 1}, {'is-error': errFrom.investors === 0}]"
                          class="option textarea participants" required label="参与人">
              <div class="visited">
                <el-button type="primary" plain v-model="ruleForm.investors" v-show="ruleForm.investors" round
                           size="mini" v-for="(list, i) in ruleForm.investors" :key="i">
                  <template v-if="list.investType == '11'">
                    <span v-if="list.contactMan === '' || list.contactMan == null">{{list.investorName}}/自然人</span>
                    <span v-else>{{list.contactMan}}<span v-if="!(list.position === '' || list.position == null)">/{{list.position}}</span></span>
                  </template>
                  <template v-else>
                    <span><span v-if="!(list.contactMan === '' || list.contactMan == null)">{{list.contactMan}}/</span>{{list.investorName}}<span
                      v-if="!(list.position === '' || list.position == null)">/{{list.position}}</span></span>
                  </template>
                  <i class="el-icon-error el-icon--right" @click="remove(list.id,i)"></i>
                </el-button>
                <el-popover popper-class="participantName" placement="right" width="250" :visible-arrow="false"
                            v-model="visible">
                  <div class="search-name">
                    <input class="search-shareholder" v-model="searchWord" type="text" placeholder="搜索参与人姓名">
                    <button @click="searchCheckInvestor"><i class="el-icon-search"></i></button>
                  </div>
                  <div class="vux-1px-b all">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                  </div>
                  <div class="register-added vux-1px-b">
                    <el-checkbox-group v-model="joinMan" @change="handleCheckedChange">
                      <el-checkbox v-for="(list, i) in checkList" :label="list.id" :key="list.id">
                        <span>{{list.contactMans}}</span>
                      </el-checkbox>
                      <infinite-loading :on-infinite="onInfinite1" ref="infiniteLoading" style="width:250px;">
                        <span class="no-more" slot="no-more"></span>
                        <span class="no-more" slot="no-results"></span>
                      </infinite-loading>
                    </el-checkbox-group>
                    <div v-if="checkList.length == 0" class="noInfo">暂无可选参与人</div>
                  </div>
                  <span class="dialog-footer">
                    <el-button type="primary" plain @click="searchInvestors">新增参与人</el-button>
                    <el-button type="primary" @click="ensureAdd">确定</el-button>
                  </span>
                  <span slot="reference" class="addperson" @click="addParticipants">添加参与人</span>
                </el-popover>
              </div>
              <div v-show="errFrom.investors===0" class="el-form-item__error">请添加参与人</div>
            </el-form-item>

            <el-form-item class="textarea-address" label="接待人">
              <el-input type="textarea" placeholder="请输入接待人姓名" v-model="ruleForm.receiver"></el-input>
            </el-form-item>
            <el-form-item label="编号">
              <el-input v-model="ruleForm.number" placeholder="请输入存档编号"></el-input>
            </el-form-item>
            <el-form-item class="meeting-summary" label="会议纪要">
              <el-input maxlength="5000" :change="meetingInfo(ruleForm.meetingMinutes.length)" type="textarea" placeholder="请输入会议纪要" v-model="ruleForm.meetingMinutes"></el-input>
            </el-form-item>
            <el-form-item class="buttonGroup">
              <el-button type="primary" plain @click="delete1">取消</el-button>
              <el-button type="primary" @click="submitForm">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="6">
          <v-adv :pageName="'股东名册'" style="margin-bottom:16px;"></v-adv>
        </el-col>
      </el-row>
    </div>
    <el-dialog class="dialog-research" :title="newOrEdit" :visible.sync="searchInvestor" width="620px" top="15vh">
      <div class="research">
        <el-form :model="form" label-width="90px">

          <el-form-item class="participator" label="参与人" required>
            <el-col :span="11">
              <el-form-item :class="[{'is-success': errFrom1.contactMan === 1}, {'is-error': errFrom1.contactMan === 0}]">
                <el-input @blur="onblur('contactMan')" @focus="oninput('contactMan')" v-model="form.contactMan"
                          class="contactInfo" placeholder="请输入参与人姓名"></el-input>
              </el-form-item>
              <div v-show="errFrom1.contactMan === 0" class="el-form-item__error">请输入参与人姓名</div>
            </el-col>
            <el-col :span="11">
              <el-input class="input-class" v-model="form.position" placeholder="请输入参与人职务"></el-input>
            </el-col>
          </el-form-item>

          <div class="auto">
            <el-form-item label="对应股东"
                          :class="[{'is-success': errFrom1.investorName === 1}, {'is-error': errFrom1.investorName === 0}]"
                          required>
              <el-input @blur="onblur('investorName')" @focus="oninput('investorName')" class="investor-information"
                        v-model="form.investorName" placeholder="请输入参与人所代表的股东名称，或从股东名册添加" clearable>
                <div slot="append">
                  <el-popover
                    popper-class="addPopover"
                    placement="bottom"
                    width="250"
                    :visible-arrow="false"
                    v-model="visible2">
                    <div class="search-name">
                      <input class="search-shareholder" v-model="searchInvestorName" type="text" placeholder="搜索股东名称">
                      <button @click="request"><i class="el-icon-search"></i></button>
                    </div>
                    <div class="register-added vux-1px-b">
                      <el-radio-group v-model="checks">
                        <el-radio v-for="(list, i) in checkList1" :label="list" :key="i">
                          {{list.possessorName}}/{{list.possessorAmount}}
                        </el-radio>
                        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading1"
                                          style="width:250px;">
                          <span class="no-more" slot="no-more"></span>
                          <span class="no-more" slot="no-results"></span>
                        </infinite-loading>
                      </el-radio-group>
                    </div>
                    <div class="dialog-footer">
                      <el-button type="primary" plain @click="visible2 = false">取消</el-button>
                      <el-button type="primary" @click="confirmAdd">确定</el-button>
                    </div>
                    <el-button slot="reference" class="fromShare" @click="addShareholder">从股东名册添加</el-button>
                  </el-popover>
                </div>
              </el-input>
              <ul class="autoComplate" v-show="showAutoComplate && form.investorName">
                <li v-for="(item, index) in autocompleteList" @click="goQuestionDetaile(item)">
                  <p v-html="item.possessor"></p>
                </li>
              </ul>
              <div v-show="errFrom1.investorName === 0" class="el-form-item__error">请输入股东名称，或从股东名册添加</div>
            </el-form-item>
          </div>

          <el-form-item
            :class="[{'is-error': errFrom1.shareholdingNum === 1}, {'is-error': errFrom1.shareholdingNum === 0}]"
            label="持股情况" required>
            <el-input @blur="onblur('shareholdingNum')" @focus="oninput('shareholdingNum')" class="investor-information"
                      v-model="form.shareholdingNum" placeholder="请输入持股情况，如果没有，可以填写0"></el-input>
            <div v-show="errFrom1.shareholdingNum===0" class="el-form-item__error">
              请输入持股情况
            </div>
            <div v-show="errFrom1.shareholdingNum===1" class="el-form-item__error">
              持股情况必须是数字
            </div>
          </el-form-item>

          <el-form-item label="股东性质" :class="[{'is-error': errFrom1.investType === 0}]" required>
            <el-select @focus="oninput('investType')" class="investor-information" size="mini" v-model="form.investType"
                       placeholder="请选择股东性质">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <div v-show="errFrom1.investType === 0" class="el-form-item__error">请选择股东性质</div>
          </el-form-item>

          <el-form-item label="联系电话" required class="hiddenreqired">
            <el-col :span="11">
              <el-input v-model="form.mobile" placeholder="请输入手机号码"></el-input>
              <!-- <div v-show="errFrom1.mobile===0" class="el-form-item__error">请输入正确的手机号码</div> -->
            </el-col>
            <el-col :span="11">
              <el-input class="input-class" v-model="form.contactPhone" placeholder="请输入固定电话"></el-input>
            </el-col>
          </el-form-item>

          <el-form-item label="电子邮件" :class="[{'is-success': errFrom1.email === 1}, {'is-error': errFrom1.email === 0}]" required class="hiddenreqired">
            <el-input @blur="onblur('email')" @focus="oninput('email')" class="investor-information" v-model="form.email" placeholder="请输入电子邮件"></el-input>
            <div v-show="errFrom1.email===0" class="el-form-item__error">{{form.email ===''?'请输入邮箱':'邮箱格式错误'}}</div>
          </el-form-item>

          <el-form-item label="地址" required class="hiddenreqired">
            <el-col :span="8" class="space">
              <el-form-item>
                <el-select v-model="form.contactAddressProvince" placeholder="请选择" no-data-text="请选择"
                           @change="getCitylistOnChang1">
                  <el-option v-for="item in areaData.pro" :key="item.id" :label="item.name"
                             :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="space">
              <el-form-item>
                <el-select v-model="form.contactAddressCity" placeholder="请选择" no-data-text="请选择"
                           @change="getTownList1">
                  <el-option v-for="item in cityList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8" class="space">
              <el-form-item>
                <el-select v-model="form.contactAddressTown" placeholder="请选择" no-data-text="请选择">
                  <el-option v-for="item in townList" :key="item.id" :label="item.name" :value="item.name"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="">
            <el-input v-model="form.contactAddressStreet" class="investor-information textarea" placeholder="请输入详细地址"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="confirm" type="primary" @click="submitForm1">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog center title="小安提示" :visible.sync="cancel">
      <span slot="footer" class="dialog-footer">
        <el-button @click="abandon">您将放弃新建投资者信息</el-button>
        <el-button @click="cancel = false">继续填写</el-button>
        <el-button type="primary" @click="abandon">放弃</el-button>
      </span>
    </el-dialog>
    <el-dialog class="dialog-research" title="新增完成" :visible.sync="newCompletion" width="620px" top="30vh">
      <div class="new-completion">
        <p class="message">新增调研记录完成！</p>
        <el-button class="confirmButton" type="primary" @click="finished">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import areaData from '@/service/area_data.js'
  import InfiniteLoading from 'vue-infinite-loading'
  export default {
    data() {
      return {
        inputBox: true,
        userInfo: {},
        newOrEdit: '新增参与人信息',
        searchInvestor: false,
        visible2: false,
        newCompletion: false,
        showAutoComplate: false,
        // otherThemeInfo: true,
        autocompleteList: [],
        form: {
          investorName: '',
          shareholdingNum: '', // 持股情况
          investType: '',
          contactMan: '',
          position: '',
          mobile: '',
          contactPhone: '',
          email: '',
          contactAddressProvince: '',
          contactAddressCity: '',
          contactAddressTown: '',
          contactAddressStreet: ''
        },
        errFrom1: {
          investorName: '',
          shareholdingNum: '', // 持股情况
          investType: '',
          contactMan: '',
          position: '',
          mobile: '',
          contactPhone: '',
          email: '',
          contactAddressProvince: '',
          contactAddressCity: '',
          contactAddressTown: '',
          contactAddressStreet: ''
        },
        value: [],
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '公募基金'
        }, {
          value: '2',
          label: '私募基金'
        }, {
          value: '3',
          label: '证券公司资管产品'
        }, {
          value: '4',
          label: '香港结算公司'
        }, {
          value: '5',
          label: 'QFII'
        }, {
          value: '6',
          label: 'RQFII'
        }, {
          value: '7',
          label: '汇金公司'
        }, {
          value: '8',
          label: '中证金'
        }, {
          value: '9',
          label: '社保基金'
        }, {
          value: '10',
          label: '一般机构或产品'
        }, {
          value: '11',
          label: '自然人'
        }
        ],
        ruleForm: {
          theme: '',
          otherTheme: '',
          activiteTime: '',
          activiteDetailedTime: '',
          activiteAddressProvince: '',
          activiteAddressCity: '',
          activiteAddressTown: '',
          activiteAddressStreet: '',
          investors: [],
          receiver: '',
          number: '',
          meetingMinutes: ''
        },
        errFrom: {
          theme: '',
          otherTheme: '',
          activiteTime: '',
          activiteDetailedTime: '',
          activiteAddressProvince: '',
          activiteAddressCity: '',
          activiteAddressTown: '',
          activiteAddressStreet: '',
          investors: '',
          receiver: '',
          number: '',
          meetingMinutes: ''
        },
        areaData: areaData,
        cityList: '',
        townList: '',
        searchName: false,
        cancel: false,
        rulesForm: '',
        searchWord: '',
        checks: [],
        joinMan: [],
        checkAll: false,
        isIndeterminate: false,
        recordTheme: '',
        time: '',
        checkList: [],
        checkList1: [],
        visible: false,
        searchInvestorName: '',
        editRecord: {},
        rollOfficial: {
          pageNum: 1,
          pageSize: 30,
          total: 1
        },
        rollOfficial1: {
          pageNum: 1,
          pageSize: 30,
          total: 1
        },
        newMan: '',
        onePasswordAccount: '',
        recordDate: ''
      }
    },
    // 使用其它组件
    components: {
      InfiniteLoading
    },
    computed: {
      searchWord1() {
        return this.form.investorName
      }
    },
    watch: {
      searchWord1: function (val) {
        setTimeout(() => {
          this.searchInput()
        }, 500)
      }
    },
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      if (this.userInfo.companyCode == '888888') {
        this.userInfo.enterpriseCompanyName = '信公小安'
      }
      // 获取参与人信息
      // this.getInvestor();
    },
    mounted() {
      // 从股东名册添加
      this.getNewRollOfficial();
      this.edit();
      document.addEventListener('click', () => {
        this.showAutoComplate = false
      })
    },
    // 方法
    methods: {
      verification (item) {
        if (item == 30) {
          this.$message({message: '抱歉，您已达到最大字数限制', showClose: true, type: 'warning', duration: 3000});
        }
      },
      meetingInfo (item) {
        if (item == 5000) {
          this.$message({message: '抱歉，您已达到最大字数限制', showClose: true, type: 'warning', duration: 3000});
        }
      },
      searchInvestors() {
        this.visible = false;
        this.searchInvestor = true;
        for (var key in this.form) {
          this.form[key] = '';
        }
        for (var key1 in this.errFrom1) {
          this.errFrom1[key1] = '';
        }
      },
      request() {
        this.checkList1 = [];
        this.rollOfficial.pageNum = 1;
        this.rollOfficial.pageSize = 30;
        this.rollOfficial.total = 1;
        this.getNewRollOfficial();
      },
      goQuestionDetaile(item) {
        this.form.investorName = item.possessorName;
        this.form.shareholdingNum = item.possessorAmount;
        this.form.investType = item.possessorType;
        this.form.mobile = item.messagePhone;
        this.form.contactAddressStreet = item.messageAddress;
        if (this.form.investorName !== '') {
          this.errFrom.investorName = 2;
        }
        if (this.form.shareholdingNum !== '') {
          this.errFrom.shareholdingNum = 2;
        }
        if (this.form.investType !== '') {
          this.errFrom.investType = 2;
        }
        this.visible2 = false;
      },
      searchInput() {
        let userId = this.$cookie.get('userId');
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getNewRollOfficial,
          params: {
            pageNum: 1,
            pageSize: 10,
            userId: userId,
            keyWord: this.form.investorName
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.total > 0) {
              this.showAutoComplate = true
              let obj = res.data.returnObject
              obj.forEach((t, i) => {
                if (t.possessorName) {
                  t.possessor = this.hightLignt(t.possessorName)
                }
              });
              this.autocompleteList = obj
            } else {
              this.showAutoComplate = false
              this.autocompleteList = []
            }
          } else {
            this.autocompleteList = []
          }
        }).catch((err) => {
        })
      },
      hightLignt(value) {
        let searchWord1 = this.form.investorName.split(' ').join(',')
        if (searchWord1.indexOf(',') > -1) {
          let searchWordArr = searchWord1.split(',')
          for (let i in searchWordArr) {
            if (searchWordArr[i]) {
              let reg = new RegExp('(' + searchWordArr[i].replace('*', '') + ')', 'gmi')
              value = value.replace(reg, '<span class="hightLight">$1</span>')
            }
          }
          return value
        } else {
          let reg = new RegExp('(' + searchWord1.replace('*', '') + ')', 'gmi')
          return value.replace(reg, '<span class="hightLight">$1</span>')
        }
      },
      edit() {
        // this.$route.query.id && this.getOneInvestor();
        if (this.$route.query.id) {
          this.getOneInvestor();
        }
      },
      onInfinite() {
        this.rollOfficial.pageNum += 1
        this.getNewRollOfficial()
      },
      onInfinite1() {
        this.rollOfficial1.pageNum += 1
        this.getInvestor()
      },
      assignment() {
        let themeOptions = ['特定对象调研', '分析师会议', '媒体采访', '业绩说明会', '新闻发布会', '路演活动', '现场参观'];
        let key = '';
        // 查找其他主题的字段，赋值给otherTheme
        for (let index = 0; index < themeOptions.length; index++) {
          if (this.editRecord.theme == themeOptions[index]) {
            key = true;
          }
        }
        if (key == true) {
          this.ruleForm.theme = this.editRecord.theme;
        } else {
          this.ruleForm.otherTheme = this.editRecord.theme;
          this.ruleForm.theme = "其他主题";
          this.inputBox = false;
        }
        this.ruleForm.activiteTime = this.editRecord.activiteTime;
        this.ruleForm.activiteDetailedTime = this.editRecord.activiteDetailedTime;
        this.ruleForm.activiteAddressProvince = this.editRecord.activiteAddressProvince;
        this.ruleForm.activiteAddressCity = this.editRecord.activiteAddressCity;
        this.ruleForm.activiteAddressTown = this.editRecord.activiteAddressTown;
        this.ruleForm.activiteAddressStreet = this.editRecord.activiteAddressStreet;
        this.ruleForm.investors = this.editRecord.manageList;
        this.ruleForm.receiver = this.editRecord.receiver;
        this.ruleForm.number = this.editRecord.number;
        this.ruleForm.meetingMinutes = this.editRecord.meetingMinutes;
      },
      getOneInvestor() {
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getOneInvestor,
          params: {
            id: this.$route.query.id
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.editRecord = res.data.returnObject;
            this.assignment();
          }
        })
      },
      finished() {
        this.newCompletion = false;
        this.$router.push({path: '/stockholder/surveyRecords'});
      },
      addParticipants() {
        if (this.checkList.length == 0) {
          this.getInvestor();
        }
      },
      confirmAdd() {
        this.onePasswordAccount = this.checks.onePasswordAccount;
        this.recordDate = this.checks.recordDate;
        this.form.investorName = this.checks.possessorName;
        this.form.shareholdingNum = this.checks.possessorAmount;
        this.form.investType = this.checks.possessorType;
        if (this.checks.messagePhone) {
          this.form.mobile = this.checks.messagePhone;
        }
        if (this.checks.messageAddress) {
          this.form.contactAddressStreet = this.checks.messageAddress;
        }
        if (this.form.investorName !== '') {
          this.errFrom1.investorName = 2;
        }
        if (this.form.shareholdingNum !== '') {
          this.errFrom1.shareholdingNum = 2;
        }
        if (this.form.investType !== '') {
          this.errFrom1.investType = 2;
        }
        this.visible2 = false;
      },
      addInvestor() {
        let userId = this.$cookie.get('userId');
        if (this.form.contactAddressCity == '请选择') {
          this.form.contactAddressCity = '';
        }
        if (this.form.contactAddressTown == '请选择') {
          this.form.contactAddressTown = '';
        }
        if (this.form.contactAddressProvince == '请选择') {
          this.form.contactAddressProvince = '';
        }
        let contactAddress = this.form.contactAddressProvince + this.form.contactAddressCity + this.form.contactAddressTown + this.form.contactAddressStreet;
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.addInvestor,
          params: {
            id: '',
            investorName: this.form.investorName,
            investType: this.form.investType,
            shareholdingNum: this.form.shareholdingNum,
            contactMan: this.form.contactMan,
            mobile: this.form.mobile,
            position: this.form.position,
            contactPhone: this.form.contactPhone,
            email: this.form.email,
            contactAddress: contactAddress,
            contactAddressProvince: this.form.contactAddressProvince,
            contactAddressCity: this.form.contactAddressCity,
            contactAddressTown: this.form.contactAddressTown,
            contactAddressStreet: this.form.contactAddressStreet,
            createUserId: userId,
            updateUserId: userId,
            rollOfficialId: '',
            onePasswordAccount: this.onePasswordAccount,
            recordDate: this.recordDate
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.newMan = res.data.returnObject.id;
            this.$message({message: '信息提交成功', showClose: true, type: 'success', duration: 3000});
            this.searchInvestor = false;
            this.rollOfficial1.pageNum = 1;
            this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
            this.checkList = [];
            this.getInvestor();
            // this.openList();
          }
        }).catch((err) => {
        })
      },
      openList () {
        this.visible = true;
        // this.joinMan = [];
        this.getInvestor();

      },
      addInvestorResearchRecord() {
        let investorsArray = [];
        for (let index = 0; index < this.ruleForm.investors.length; index++) {
          investorsArray[index] = this.ruleForm.investors[index].id;
        }
        let investors = investorsArray.join(",");
        let investorsArrayName = [];
        // 参与人就是联系人
        for (let index = 0; index < this.ruleForm.investors.length; index++) {
          // if (this.ruleForm.investors[index].contactMan) {
          //   investorsArrayName.push(this.ruleForm.investors[index].contactMan);
          // } else {
          //   investorsArrayName.push(this.ruleForm.investors[index].contactMans);
          // }
          investorsArrayName.push(this.ruleForm.investors[index].contactMans);
        }
        let investorsName = investorsArrayName.join(",");
        let userId = this.$cookie.get('userId');
        let form = new FormData();
        form.append('id', '');
        form.append('theme', this.recordTheme);
        form.append('activiteTime', this.time);
        form.append('activiteDetailedTime', this.ruleForm.activiteDetailedTime);
        form.append('activiteAddressProvince', this.ruleForm.activiteAddressProvince);
        form.append('activiteAddressCity', this.ruleForm.activiteAddressCity);
        form.append('activiteAddressTown', this.ruleForm.activiteAddressTown);
        form.append('activiteAddressStreet', this.ruleForm.activiteAddressStreet);
        form.append('createUserId', userId);
        form.append('updateUserId', userId);
        form.append('investors', investors);
        form.append('investorsName', investorsName);
        form.append('receiver', this.ruleForm.receiver);
        form.append('number', this.ruleForm.number);
        form.append('meetingMinutes', this.ruleForm.meetingMinutes);
        form.append('pageNum', '');
        form.append('pageSize', '');

        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.addInvestorResearchRecord,
          data: form
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.searchInvestor = false;
            setTimeout(() => {
              this.newCompletion = true;
            }, 300);
          }
        }).catch((err) => {
          // console.log(err, '错误')
        })
      },
      searchCheckInvestor() {
        this.checkList = []
        this.rollOfficial1.pageNum = 1
        this.joinMan = []
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
        this.getInvestor()
      },
      getInvestor() {
        let userId = this.$cookie.get('userId');
        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.getInvestor,
          params: {
            userId: userId,
            investorName: this.searchWord,
            pageNum: this.rollOfficial1.pageNum,
            pageSize: this.rollOfficial1.pageSize
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let total = res.data.total
            let tPage = Math.ceil(parseInt(total) / parseInt(this.rollOfficial1.pageSize));
            if (this.checkList.length < total) {
              let returnArr = res.data.returnObject;
              for (let i = returnArr.length - 1; i >= 0; i--) {
                if (returnArr[i].investType != 11 && !returnArr[i].contactMan) {
                  returnArr.splice(i, 1);
                }
              }
              this.checkList = this.checkList.concat(returnArr);
              
              this.checkList.forEach((item, index) => {
                if (item.mobile == null) {
                  item.mobile = ''
                }
                if (item.position == null) {
                  item.position = ''
                }
                if (item.contactMan == null) {
                  item.contactMan = ''
                }
                //
                if (item.investType == 11) {
                  if (item.contactMan) {
                    item.contactMans = `${item.contactMan}/${item.position}`;
                  } else {
                    item.contactMans = `${item.investorName}/自然人`;
                  }
                }
                if (item.investType != 11) {
                  item.contactMans = `${item.contactMan}/${item.investorName}/${item.position}`;
                }
                //
                item.contactMans = item.contactMans.replace(/(^\/*)|(\/*$)/g, '')
              });
            }
            //
            this.joinMan = this.ruleForm.investors.map((e) => {
              return e.id
            })
            if (this.newMan) {
              this.joinMan.push(this.newMan);
              this.visible = true;
            }
            //
            if (this.rollOfficial1.pageNum >= tPage) {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            } else {
              this.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            }
          }
        }).catch((err) => {

        })
      },
      addShareholder() {
        this.checks = [];
      },
      //
      getNewRollOfficial() {
        let userId = this.$cookie.get('userId');
        if (!userId) {
          userId = ''
        }
        this.$http({
          method: 'GET',
          url: this.$api.gxfApi.getNewRollOfficial,
          params: {
            pageNum: this.rollOfficial.pageNum,
            pageSize: this.rollOfficial.pageSize,
            userId: userId,
            keyWord: this.searchInvestorName
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.checkList1 = this.checkList1.concat(res.data.returnObject);
            let total = res.data.total
            let tPage = this.$common.totalPage(total, this.rollOfficial.pageSize)
            if (this.rollOfficial.pageNum >= tPage) {
              this.$refs.infiniteLoading1.$emit('$InfiniteLoading:complete');
            } else {
              this.$refs.infiniteLoading1.$emit('$InfiniteLoading:loaded');
            }
          }
        }).catch((err) => {
        })
      },
      //
      handleCheckAllChange(val) {
        // this.checks = val ? [...this.checkList] : [];
        this.joinMan = val ? this.checkList.map(e => e.id) : []
        this.isIndeterminate = false;
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.checkList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.checkList.length;
      },
      /*
      * todo 确认添加
      * */
      ensureAdd() {
        this.ruleForm.investors = [];
        // console.log('this.ruleForm', this.ruleForm);
        this.checkList.forEach((item) => {
          for (let index = 0; index < this.joinMan.length; index++) {
            if (item.id == this.joinMan[index]) {
              this.ruleForm.investors.push(item);
            }
          }
        })
        // this.ruleForm.investors = [...this.checks];
        this.onblur('investors');
        this.visible = false;
      },
      goBack() {
        this.$router.push('/stockholder/investorManage');
      },
      getCitylistOnChang(proName, cityName, townName) {
        this.onblur('activiteAddressProvince')
        this.getCityList(proName, cityName, townName)
      },
      getCitylistOnChang1(proName, cityName, townName) {
        this.onblur('contactAddressProvince')
        this.getCityList1(proName, cityName, townName)
      },
      getCityList(proName, cityName, townName) {
        // this.onblur('companyProvince')
        let proId = this.getProId(proName)
        this.cityList = this.areaData.city[proId]
        if (!cityName || cityName === '请选择') {
          cityName = this.cityList[0].name
          this.ruleForm.activiteAddressCity = cityName
        }
        this.getTownList(cityName, townName)
      },
      getCityList1(proName, cityName, townName) {
        // this.onblur('companyProvince')
        let proId = this.getProId1(proName)
        this.cityList = this.areaData.city[proId]
        if (!cityName || cityName === '请选择') {
          cityName = this.cityList[0].name
          this.form.contactAddressCity = cityName
        }
        this.getTownList1(cityName, townName)
      },
      selectTheme () {
        this.errFrom.otherTheme = 1;
        if (this.ruleForm.theme == '其他主题') {
          this.inputBox = false;
        } else {
          this.inputBox = true;
          this.ruleForm.otherTheme = '';
        }
      },
      onblur(key) {
        if (key === 'activiteTime') {
          if (this.empty(this.ruleForm.activiteTime)) {
            this.errFrom.activiteTime = 0
          } else {
            this.errFrom.activiteTime = 1
          }
        } else if (key === 'investors') {
          if (this.empty(this.ruleForm.investors)) {
            this.errFrom.investors = 0
          } else {
            this.errFrom.investors = 1
          }
        } else if (key === 'activiteAddressProvince') {
          if (this.ruleForm.activiteAddressProvince == '请选择' || this.empty(this.ruleForm.activiteAddressProvince)) {
            this.errFrom.activiteAddressProvince = 0
          } else {
            this.errFrom.activiteAddressProvince = 1
          }
        } else if (key === 'contactMan') {
          if (this.empty(this.form.contactMan)) {
            this.errFrom1.contactMan = 0
          } else {
            this.errFrom1.contactMan = 1
          }
        } else if (key === 'investorName') {
          if (this.empty(this.form.investorName)) {
            this.errFrom1.investorName = 0
          } else {
            this.errFrom1.investorName = 1
          }
        } else if (key === 'shareholdingNum') {
          if (this.empty(this.form.shareholdingNum)) {
            this.errFrom1.shareholdingNum = 0;
          } else if (!this.empty(this.form.shareholdingNum) && isNaN(this.form.shareholdingNum)) {
            this.errFrom1.shareholdingNum = 1;
          }
        } else if (key === 'contactAddressProvince') {
          if (this.form.contactAddressProvince == '请选择' || this.empty(this.form.contactAddressProvince)) {
            this.errFrom1.contactAddressProvince = 0
          } else {
            this.errFrom1.contactAddressProvince = 1
          }
        } else if (key === 'email') {
          if (!this.$regx.mail(this.form.email) && this.form.email !== '') {
            this.errFrom1.email = 0
          } else {
            this.errFrom1.email = 1
          }
        }
      },
      oninput(key) {
        if (key === 'otherTheme') {
          this.errFrom.otherTheme = 2
        } else if (key === 'activiteTime') {
          this.errFrom.activiteTime = 2
        } else if (key === 'activiteAddressProvince') {
          this.errFrom.activiteAddressProvince = 2
        } else if (key === 'investors') {
          this.errFrom.investors = 2
        } else if (key === 'contactMan') {
          this.errFrom1.contactMan = 2
        } else if (key === 'investorName') {
          this.errFrom1.investorName = 2
        } else if (key === 'shareholdingNum') {
          this.errFrom1.shareholdingNum = 2
        } else if (key === 'contactAddressProvince') {
          this.errFrom1.contactAddressProvince = 2
        } else if (key === 'investType') {
          this.errFrom1.investType = 2
        } else if (key === 'email') {
          this.errFrom1.email = 2
        }
      },
      empty(value) {
        if (!value) {
          return true
        } else {
          return this.$regx.blank(value)
        }
      },
      checkAlldata() {
        let allkey = ['activiteTime', 'activiteAddressProvince', 'investors']
        for (let i = 0; i < allkey.length; i++) {
          this.onblur(allkey[i]);
        }
        if (this.errFrom.otherTheme === 0 || this.errFrom.investors === 0 || this.errFrom.activiteTime === 0 || this.errFrom.activiteAddressProvince === 0) {
          return false
        } else {
          return true
        }
      },
      checkAlldata1() {
        let allkey = ['contactMan', 'investorName', 'shareholdingNum', 'email'];
        if (this.form.investType === '') {
          this.errFrom1.investType = 0
        }
        for (let i = 0; i < allkey.length; i++) {
          this.onblur(allkey[i]);
        }
        if (this.errFrom1.contactMan === 0 || this.errFrom1.investorName === 0 || this.errFrom1.shareholdingNum === 0 || this.errFrom1.shareholdingNum === 1 || this.errFrom1.investType === 0 || this.errFrom1.email === 0) {
          return false
        } else {
          return true
        }
      },
      getProId(proName) {
        let proId = ''
        for (let i in this.areaData.pro) {
          if (this.areaData.pro[i].name === proName) {
            proId = this.areaData.pro[i].id
          }
        }
        return proId
      },
      getProId1(proName) {
        let proId = ''
        for (let i in this.areaData.pro) {
          if (this.areaData.pro[i].name === proName) {
            proId = this.areaData.pro[i].id
          }
        }
        return proId
      },
      getTownList(cityName, townName) {
        let cityId = this.getCityId(cityName)
        this.townList = this.areaData.county[cityId]
        if (!townName || townName === '请选择') {
          townName = this.townList[0].name
          this.ruleForm.activiteAddressTown = townName
        }
      },
      getTownList1(cityName, townName) {
        let cityId = this.getCityId1(cityName)
        this.townList = this.areaData.county[cityId]
        if (!townName || townName === '请选择') {
          townName = this.townList[0].name
          this.form.contactAddressTown = townName
        }
      },
      getCityId(cityName) {
        let cityId = ''
        for (let i in this.cityList) {
          if (this.cityList[i].name === cityName) {
            cityId = this.cityList[i].id
          }
        }
        return cityId
      },
      getCityId1(cityName) {
        let cityId = ''
        for (let i in this.cityList) {
          if (this.cityList[i].name === cityName) {
            cityId = this.cityList[i].id
          }
        }
        return cityId
      },
      submitForm() {
        if ((this.empty(this.ruleForm.theme) && this.empty(this.ruleForm.otherTheme)) ||
        (this.ruleForm.theme == '其他主题' && this.empty(this.ruleForm.otherTheme))) {
          this.errFrom.otherTheme = 0
        } else {
          this.errFrom.otherTheme = 1
        }
        this.time = new Date(this.ruleForm.activiteTime).getTime();
        if (this.ruleForm.theme && this.ruleForm.theme != '其他主题') {
          this.recordTheme = this.ruleForm.theme;
        } else if (this.ruleForm.otherTheme) {
          this.recordTheme = this.ruleForm.otherTheme;
        } else {
          this.recordTheme = this.ruleForm.theme;
        }
        if (this.$route.query.id) {
          if (this.checkAlldata()) {
            this.editInvestorResearchRecord();
          }
        } else {
          if (this.checkAlldata()) {
            this.addInvestorResearchRecord();
          }
        }
      },
      submitForm1() {
        if (this.checkAlldata1()) {
          this.addInvestor();
        }
      },
      editInvestorResearchRecord() {
        let investorsArray = [];
        for (let index = 0; index < this.ruleForm.investors.length; index++) {
          investorsArray[index] = this.ruleForm.investors[index].id;
        }
        let investors = investorsArray.join(",");
        let investorsArrayName = [];
        // 参与人就是联系人
      //   <template v-if="list.investType == '11'">
      //   <span v-if="list.contactMan === '' || list.contactMan == null">{{list.investorName}}/自然人</span>
      //   <span v-else>{{list.contactMan}}<span v-if="!(list.position === '' || list.position == null)">/{{list.position}}</span></span>
      // </template>
      // <template v-else>
      //   <span><span v-if="!(list.contactMan === '' || list.contactMan == null)">{{list.contactMan}}/</span>{{list.investorName}}<span
      //     v-if="!(list.position === '' || list.position == null)">/{{list.position}}</span></span>
      // </template>

        for (let index = 0; index < this.ruleForm.investors.length; index++) {
          if (this.ruleForm.investors[index].investType == '11') {
            if (this.ruleForm.investors[index].contactMan === '' || this.ruleForm.investors[index].contactMan == null) {
              investorsArrayName.push(this.ruleForm.investors[index].investorName + '/自然人')
            } else {
              if (!(this.ruleForm.investors[index].position === '' || this.ruleForm.investors[index].position == null)) {
                investorsArrayName.push(this.ruleForm.investors[index].contactMan + "/" + this.ruleForm.investors[index].position) 
              } else {
                investorsArrayName.push(this.ruleForm.investors[index].contactMan) 
              }
            }
          } else {
            if (!(this.ruleForm.investors[index].contactMan === '' || this.ruleForm.investors[index].contactMan == null)) {
              if (!(this.ruleForm.investors[index].position === '' || this.ruleForm.investors[index].position == null)) {
                investorsArrayName.push(this.ruleForm.investors[index].contactMan + '/' + this.ruleForm.investors[index].investorName + '/' + this.ruleForm.investors[index].position)
              } else {
                investorsArrayName.push(this.ruleForm.investors[index].contactMan + '/' + this.ruleForm.investors[index].investorName)
              }
            } else {
              if (!(this.ruleForm.investors[index].position === '' || this.ruleForm.investors[index].position == null)) {
                investorsArrayName.push(this.ruleForm.investors[index].investorName + '/' + this.ruleForm.investors[index].position)
              } else {
                investorsArrayName.push(this.ruleForm.investors[index].investorName) 
              }
            }
          }
          // if (this.ruleForm.investors[index].contactMan) {
          //   investorsArrayName.push(this.ruleForm.investors[index].contactMan);
          // } else {
          //   investorsArrayName.push(this.ruleForm.investors[index].contactMans);
          // }
        }
        let investorsName = investorsArrayName.join(",");
        let userId = this.$cookie.get('userId');
        let form = new FormData();
        form.append('id', this.$route.query.id);
        form.append('theme', this.recordTheme);
        form.append('activiteTime', this.time);
        form.append('activiteDetailedTime', this.ruleForm.activiteDetailedTime);
        form.append('activiteAddressProvince', this.ruleForm.activiteAddressProvince);
        form.append('activiteAddressCity', this.ruleForm.activiteAddressCity);
        form.append('activiteAddressTown', this.ruleForm.activiteAddressTown);
        form.append('activiteAddressStreet', this.ruleForm.activiteAddressStreet);
        form.append('createUserId', this.$route.query.createUserId);
        form.append('updateUserId', userId);
        form.append('investors', investors);
        form.append('investorsName', investorsName);
        form.append('receiver', this.ruleForm.receiver);
        form.append('number', this.ruleForm.number);
        form.append('meetingMinutes', this.ruleForm.meetingMinutes);
        form.append('pageNum', '');
        form.append('pageSize', '');

        this.$http({
          method: 'POST',
          url: this.$api.gxfApi.editInvestorResearchRecord,
          data: form
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({message: '完成编辑', showClose: true, type: 'success', duration: 3000})
            this.$router.push({path: '/stockholder/surveyRecords'});
          }
        })
      },
      delete1() {
        this.$confirm('您将放弃 ' + '新建投资者信息 ', '小安提示', {
          confirmButtonText: '放弃',
          cancelButtonText: '继续填写',
          type: 'warning'
        }).then(() => {
          for (var key in this.ruleForm) {
            if (key == 'theme') {
              this.ruleForm[key] = [];
            } else {
              this.ruleForm[key] = '';
            }
          }
          for (var k in this.errFrom) {
            if (k == 'theme') {
              this.errFrom[k] = [];
            } else {
              this.errFrom[k] = '';
            }
          }
          if (this.$route.query.id) {
            this.$router.push('/stockholder/surveyRecords');
          } else {
            this.$router.push('/stockholder/investorManage');
          }
        }).catch(() => {
        })
      },
      abandon() {
        this.cancel = false;
        this.$refs[this.rulesForm].resetFields();
      },
      remove(id, i) {
        this.ruleForm.investors.splice(i, 1);
        this.joinMan.forEach((item, index) => {
          if (item == id) {
            this.joinMan.splice(index, 1);
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .participantName {
    .all {
      padding: 9px;
      padding-left: 0px;
      margin-bottom: 8px;
    }
    .search-name {
      height: 26px;
      width: 226px;
      .search-shareholder {
        width: 190px;
        height: 26px;
        box-shadow: 0px 1px 1px 0px rgba(255, 177, 72, 0.26);
        border-radius: 4px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border: 1px solid #FFB148;
        float: left;
        font-size: 12px;
        font-weight: 400;
        color: rgba(141, 141, 141, 1);
        line-height: 26px;
        border-right: none;
        margin-bottom: 9px;
        padding-left: 6px;
      }
      button {
        width: 36px;
        height: 26px;
        background: #FFB148;
        float: left;
        font-size: 16px;
        border: 0;
        outline: none;
        font-size: 16px;
        border-radius: 0;
        color: #ffffff;
        padding: 0 !important;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        box-shadow: 0px 0px 2px #FFB148;
      }
    }
    .register-added {
      height: 252px;
      width: 226px;
      overflow: auto;
      padding-bottom: 30px;
      .el-checkbox {
        margin-left: 0;
        margin-right: 60px;
        line-height: 0;
        display: block;
        padding: 0 0 7px 0;
        .el-checkbox__inner {
          top: 1px;
        }
        .el-checkbox__label {
          padding-left: 8px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(84, 84, 84, 1);
          line-height: 17px;
        }
      }
      .noInfo {
        height: 100%;
        display: flex;
        justify-content:center;  //水平居中
        align-items:Center;      //垂直居中
      }
    }
    .dialog-footer {
      button {
        float: left;
        text-align: center;
        width: 106px;
        height: 35px;
        padding: 0;
        margin-top: 15px;
        span {
          font-size: 12px;
          display: inline-block;
          height: 35px;
          width: 106px;
          text-align: center;
          line-height: 35px;
        }
      }
    }
  }
  .addPopover {
    width: 250px;
    .search-name {
      width: 226px;
      height: 26px;
      .search-shareholder {
        width: 190px;
        height: 26px;
        box-shadow: 0px 1px 1px 0px rgba(255, 177, 72, 0.26);
        border-radius: 4px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
        border: 1px solid #FFB148;
        float: left;
        font-size: 12px;
        font-weight: 400;
        color: rgba(141, 141, 141, 1);
        line-height: 26px;
        border-right: none;
        margin-bottom: 9px;
        padding-left: 6px;
      }
      button {
        width: 36px;
        height: 26px;
        background: #FFB148;
        float: left;
        font-size: 16px;
        border: 0;
        outline: none;
        font-size: 16px;
        border-radius: 0;
        color: #ffffff;
        padding: 0 !important;
        border-top-right-radius: 2px;
        border-bottom-right-radius: 2px;
        box-shadow: 0px 0px 2px #FFB148;
      }
    }
    .register-added {
      height: 289px;
      width: 226px;
      overflow: auto;
      padding-bottom: 30px;
      .el-radio-group {
        .el-radio {
          display: block;
          margin-left: 0;
          line-height: 0;
          padding: 0 0 8px 0;
          .el-radio__label {
            padding-left: 8px;
            font-size: 12px;
            font-weight: 400;
            color: rgba(84, 84, 84, 1);
            line-height: 17px;
          }
        }
      }
    }
    .dialog-footer {
      padding: 15px 0 16px 0;
      text-align: center;
      button {
        float: left;
        text-align: center;
        width: 106px;
        height: 35px;
        padding: 0;
        span {
          font-size: 12px;
          display: inline-block;
          height: 35px;
          width: 106px;
          text-align: center;
          line-height: 35px;
        }
      }
    }
  }
  #relationshipResearch {
    .title {
      width: 100%;
      .returnDatabase {
        font-size: 14px;
        font-weight: 400;
        color: rgba(174, 174, 174, 1);
        line-height: 20px;
        margin-bottom: 16px;
      }
      .returnDatabase:hover {
        cursor: pointer;
      }
    }
    .survey-records {
      border-bottom: 1px solid #E3E3E3;
      border-top: 1px solid #E3E3E3;
      margin-bottom: 15px;
      .survey {
        font-size: 14px;
        font-weight: 600;
        color: rgba(0, 0, 0, 1);
        line-height: 20px;
        margin-bottom: 14px;
        margin-top: 16px;
      }
    }
    .investor {
      .participants .el-form-item__content {
        line-height: 36px;
        font-size: 14px;
      }
      .record-theme {
        .el-form-item__label {
          padding: 0;
          position: relative;
          top: -13px;
        }
      }
      .el-radio {
        margin-left: 0;
      }
      .first-row {
        margin-right: 129px;
        margin-bottom: 15px;
        width: 100px;
      }
      .other-topics {
        display: inline-block;
        vertical-align: middle;
        margin-left: 9px;
        .el-input {
          width: 741px;
        }
        .is-error .el-input__inner {
          border-color: #fb4319;
        }
      }
      .second-row {
        margin-right: 129px;
        margin-bottom: 15px;
        width: 100px;
      }
      .visited {
        height: 72px;
        overflow-y: scroll;
        border: 1px solid rgba(227, 227, 227, 1);
        border-radius: 4px;
        padding-left: 6px;
        .el-button--mini {
          padding: 5px 7px;
        }
        .addperson {
          color: rgba(174, 174, 174, 1);
          margin-left: 3px;
          cursor: pointer;
          font-size: 14x;
        }
        button {
          margin: 2px;
          border: none;
        }
        .el-form-item__content {
          line-height: 38px;
        }
      }
      .activeDate {
        height: 40px;
      }
      .el-input__inner {
        font-size: 14px;
        padding-left: 8px;
      }
      .el-form-item {
        margin-bottom: 16px;
      }
      .activityTime {
        width: 403px;
        .el-date-editor {
          width: 395px;
        }
        .el-input__inner {
          font-size: 14px;
          width: 395px;
        }
        .el-input__prefix {
          display: none;
        }
      }
      .textarea {
        .el-input__inner {
          font-size: 14px;
          height: 72px;
        }
      }
      .meeting-summary {
        .el-textarea__inner {
          height: 150px;
          padding: 8px;
        }
      }
      .textarea-address {
        .el-textarea__inner {
          height: 72px;
          padding: 8px;
        }
      }
      .buttonGroup {
        padding-top: 10px;
        text-align: center;
        .el-button {
          width: 200px;
          height: 35px;
          padding-top: 9px;
        }
      }
      .el-form-item.is-required .el-form-item__label:before {
        margin-left: 4px;
        float: right;
        position: relative;
        top: -10px;
      }
      .hiddenreqired .el-form-item__label:before {
        visibility: hidden;
      }
      .option {
        .el-form-item__label {
          padding-right: 1px;
        }
        .el-date-picker {
          width: 390px;
          height: 40px;
          .el-input__prefix {
            display: none;
          }
        }
        .space {
          .el-select {
            width: 275px;
            padding-right: 16px;
          }
        }
        .region {
          position: relative;
          right: -2px;
        }
      }
      .el-form-item.is-error .el-input__inner {
        border-color: #fb4319;
      }
      .el-form-item.is-error .visited {
        border-color: #fb4319;
      }
      .el-form-item__error {
        color: #fb4319;
        padding-top: 2px;
      }
    }
    .dialog-search {
      .el-dialog {
        width: 226px;
        height: 400px;
        padding: 15px 12px 16px 12px;
        .el-dialog__header {
          height: 0;
          padding: 0;
        }
        .el-dialog__body {
          padding: 0;
        }
        .all {
          padding: 9px;
          padding-left: 0px;
          margin-bottom: 8px;
        }
        .search-name {
          height: 26px;
          .search-shareholder {
            width: 190px;
            height: 26px;
            box-shadow: 0px 1px 1px 0px rgba(255, 177, 72, 0.26);
            border-radius: 4px;
            border-top-right-radius: 0px;
            border-bottom-right-radius: 0px;
            border: 1px solid #FFB148;
            float: left;
            font-size: 12px;
            font-weight: 400;
            color: rgba(141, 141, 141, 1);
            line-height: 26px;
            border-right: none;
            margin-bottom: 9px;
            padding-left: 6px;
          }
          button {
            width: 36px;
            height: 26px;
            background: #FFB148;
            float: left;
            font-size: 16px;
            border: 0;
            outline: none;
            font-size: 16px;
            border-radius: 0;
            color: #ffffff;
            padding: 0 !important;
            border-top-right-radius: 2px;
            border-bottom-right-radius: 2px;
            box-shadow: 0px 0px 2px #FFB148;
          }
        }
        .register-added {
          height: 248px;
          width: 226px;
          /*overflow-y: scroll;*/
          overflow: auto;
          padding-bottom: 30px;
          .el-checkbox {
            margin-left: 0;
            margin-right: 60px;
            line-height: 0;
            padding: 0 0 8px 0;
            .el-checkbox__inner {
              top: 1px;
            }
            .el-checkbox__label {
              padding-left: 8px;
              font-size: 12px;
              font-weight: 400;
              color: rgba(84, 84, 84, 1);
              line-height: 17px;
            }
          }
        }
        .el-dialog__footer {
          padding: 15px 0 16px 1px;
          text-align: center;
          .dialog-footer {
            button {
              float: left;
              text-align: center;
              width: 106px;
              height: 35px;
              padding: 0;
              span {
                font-size: 12px;
                display: inline-block;
                height: 35px;
                width: 106px;
                text-align: center;
                line-height: 35px;
              }
            }
          }
        }
      }
    }
    .dialog-research {
      .el-dialog__header {
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 14px;
        .el-dialog__title {
          font-size: 16px;
          font-weight: 600;
          color: rgba(255, 177, 72, 1);
        }
        .el-dialog__headerbtn {
          top: 18px;
        }
      }
      .el-input__inner {
        padding-left: 6px;
      }
      .el-dialog__body {
        padding: 0;
      }
      .new-completion {
        border-top: 1px solid #E3E3E3;
        height: 119px;
        .message {
          font-size: 16px;
          font-weight: 400;
          color: rgba(50, 50, 50, 1);
          line-height: 22px;
          margin: 20px 234px 20px 242px;
        }
        .confirmButton {
          width: 200px;
          height: 35px;
          font-size: 16px;
          margin: 0px 210px 22px 210px;
          padding-top: 8px;
        }
      }
      .research {
        border-top: 1px solid #E3E3E3;
        height: 554px;
        .el-input {
          font-size: 15px;
        }
        .participator {
          .el-form-item {
            margin-bottom: 0px;
          }
        }
        .el-form-item__label {
          font-size: 16px;
          padding: 0;
        }
        .investor-information {
          width: 514px;
          .list-added {
            font-size: 16px;
            text-decoration: underline;
            color: #ffb148;
            line-height: 22px;
            cursor: pointer;
          }
          .el-input__inner {
            height: 40px;
          }
        }
        .el-input-group__append, .el-input-group__prepend {
          background-color: rgba(255, 255, 255, 1);
          padding: 0 10px;
        }
        .el-form-item {
          font-size: 16px;
          margin-bottom: 16px;
        }
        .el-form {
          margin-top: 16px;
        }
        .input-class {
          margin-left: 22px;
          width: 249px;
        }
        .contactInfo {
          width: 249px;
        }
        .textarea {
          .el-input__inner {
            height: 70px;
            padding: 9px 0 39px 6px;
          }
        }
        .confirm {
          width: 200px;
          height: 35px;
          margin-left: 120px;
          // margin-bottom: 30px;
          margin-top: 4px;
          padding-top: 7px;
          font-size: 16px;
        }
        .el-form-item.is-required .el-form-item__label:before {
          margin-left: 4px;
          float: right;
          position: relative;
          top: -6px;
        }
        .hiddenreqired .el-form-item__label:before {
          visibility: hidden;
        }
        .space {
          .el-select {
            width: 177px;
            padding-right: 16px;
          }
        }
        .el-form-item.is-error .el-input__inner {
          border-color: #fb4319;
        }
        .el-form-item__error {
          color: #fb4319;
          padding-top: 2px;
        }
        .auto {
          position: relative;
          .autoComplate {
            position: absolute;
            z-index: 100 !important;
            top: 50px;
            left: 0;
            width: 380px;
            min-height: 48px;
            background-color: #fff;
            li {
              padding: 0 12px;
              list-style-type: none;
              width: 100%;
              height: 35px;
              line-height: 1;
              font-size: 15px;
              background-color: white;
              box-sizing: border-box;
              p {
                display: inline-block;
                float: left;
                height: 35px;
                line-height: 35px;
                width: 100%;
                box-sizing: border-box;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: justify;
                border-bottom: 1px solid #e3e3e3;
                .hightLight {
                  color: #ff9933;
                }
              }
            }
          }
        }
        .hiddenreqired .is-error .el-input__inner {
          border-color: #fb4319;
        }
      }
      .fromShare {
        color: rgba(255, 177, 72, 1);
        text-decoration: underline;
      }
    }
  }
</style>

