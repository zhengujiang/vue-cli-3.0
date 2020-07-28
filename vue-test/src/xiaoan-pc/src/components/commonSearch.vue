<template>
  <div id="commonSearch">
    <div class="topbg"></div>
    <div class="ruleContent">
      <p class="title">
        <slot name="title"></slot>
      </p>
      <p class="info">
        <slot name="info"></slot>
      </p>
      <div>
        <el-row :gutter="15">
          <el-col :span="18" style="padding-right: 6px">
            <el-card shadow='never' style="margin-bottom: 10px; overflow: visible;" class="topCard">
              <div class="line left" :class="{'showHight': showPanel}"></div>
              <div class="line right" :class="{'showHight': showPanel}"></div>
              <div class="header" :class="{'headerHight': showPanel}">
                <div class="search" :class="{ searchAuto:showPanel,searchHeight:!showPanel&&showPanel!=='' }">
                  <div class="searchCode" style="margin-right: 20px" :class="{ searchAuto:showPanel }" v-show="showPanel || stockCode">
                    <div class="codeBox" :class="{'stockColor': showPanel}" v-show="stockCode" style="border-radius: 4px;">
                      <el-popover ref="popover4" placement="bottom" width="180" trigger="click" popper-class="inputCode"
                            :popper-options="{boundariesElement: 'body'}" v-on:click="selectCode" v-model="showPopover">
                        <ul>
                          <li v-for="(list,index) in gridData" :key="index" @click="selectCode(index)">
                            <span v-html="$common.highlight(inputCode,list.code)"></span>
                            <span>{{ list.name }}</span>
                          </li>
                        </ul>
                        <el-input style="padding-left: 48px" slot="reference" type="text" :placeholder="autoNo[6]" v-popover:popover @focus="loadCode" @input="loadCode"
                                  v-model="inputCode" @keyup.13.native="searchMethod"></el-input>
                      </el-popover>
                      <v-safeWordTip v-show="tipShow[7]"></v-safeWordTip>
                      <el-dropdown @command="dropDown" placement="bottom" class="dropGroup">
                        <el-button type="primary">组合<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item command="company">本公司</el-dropdown-item>
                          <el-popover
                            placement="right-start"
                            width="250"
                            popper-class="companyCode"
                            trigger="hover">
                            <div>
                              <ul>
                                <li v-for="(item, index) in followCompany" :key="index">
                                  <span class="item">{{item.code}}</span>
                                  <span class="item" style="text-align: right">{{item.name}}</span>
                                </li>
                                <li style="text-align:center" v-if="followCompany.length == 0">暂未设置关注公司</li>
                                <li class="button" style="padding-top:5px">
                                  <el-button @click="$router.push('/follow/companies')" style="padding: 0px 20px;width: 121px;height: 24px;line-height: 20px;border-color:#FFB148;background-color:#FFF0DB;color:#FFB148">设置关注公司</el-button>
                                </li>
                              </ul>
                            </div>
                            <el-dropdown-item slot="reference" command="attention">关注公司</el-dropdown-item>
                          </el-popover>
                          <el-popover
                            placement="right-start"
                            width="250"
                            popper-class="companyCode"
                            trigger="hover">
                            <div>
                              <ul :class="{'compareWord': compareCompany.length == 0 && !isRootUser}">
                                <template v-if="compareCompany.length > 0">
                                  <li v-for="(item, index) in compareCompany" :key="index">
                                    <span class="item">{{item.code}}</span>
                                    <span class="item" style="text-align: right">{{item.name}}</span>
                                  </li>
                                </template>
                                <template v-else>
                                  <li class="setcompare" v-if="isRootUser">暂未设置可比公司</li>
                                  <li class="setcompare" v-else>您的企业管理员未设置可比公司</li>
                                </template>
                                <li class="button" v-if="compareCompany.length > 0 || isRootUser">
                                  <el-button @click="$router.push('/admin/application/compare')" style="padding: 0px 20px;width: 121px;height: 24px;line-height: 22px;border-color:#FFB148;background-color:#FFF0DB;color:#FFB148">设置可比公司</el-button>
                                </li>
                              </ul>
                            </div>
                            <el-dropdown-item slot="reference" command="compare">可比公司</el-dropdown-item>
                          </el-popover>
                          <!-- <el-dropdown-item command="attention">关注公司</el-dropdown-item>
                          <el-dropdown-item command="compare">可比公司</el-dropdown-item> -->
                        </el-dropdown-menu>
                      </el-dropdown>
                    </div>
                    <!-- 高级搜索panel -->
                    <div class="seniorPanel" :class="{ seniorPanelA:showPanel}" v-show="showPanel">
                      <div class="start">
                        <span>自</span>
                        <el-date-picker
                          v-model="startDate"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          :editable="false"
                          :clearable="true"
                          :picker-options="pickerOptions1"> <!-- :default-value="this.$common.getNowDate()" -->
                        </el-date-picker>
                      </div>
                      <div class="end">
                        <span>到</span>
                        <el-date-picker
                          v-model="startEnd"
                          type="date"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          :editable="false"
                          :clearable="true"
                          :picker-options="pickerOptions2"> <!-- :default-value="this.$common.getNowDate()" -->
                        </el-date-picker>
                      </div>
                    </div>
                  </div>

                  <div class="searchText" :class="{ searchAuto:showPanel, 'stockCode':!stockCode && !showPanel, 'searchTextCode': stockCode && !showPanel}">
                    <div class="codeBox" v-show="!showPanel">
                      <template v-if="!rule">
                        <el-input v-if="!changeSearch" type="text" :placeholder="placeholder" v-model="inputText" @focus='inputFocus' @keyup.13.native="searchMethod">
                          <el-select v-model="selectType" slot="prepend">
                            <el-option label="全文" value="全文"></el-option>
                            <el-option label="标题" value="标题"></el-option>
                          </el-select>
                        </el-input>
                        <el-input v-else type="text" :placeholder="placeholder" style="border-left: 1px solid #8d8d8d;border-radius: 4px;" v-model="inputText" @focus='inputFocus'
                          @keyup.13.native="searchMethod">
                        </el-input>
                      </template>
                      <template v-else>
                        <div>
                          <el-popover ref="popoverauto" placement="bottom" width="700" trigger="focus" popper-class="ele-popover"
                            v-on:click="selectText">
                            <ul class="popul">
                              <li v-for="(list,index) in prestrain" :key="index" @click="selectText(index)"
                                  v-if="prestrain.length !== 0">
                                <span v-html="$common.highlight(inputText,list.title)"></span>
                              </li>
                            </ul>
                            <el-input slot="reference" style="padding-left: 70px" type="text" :placeholder="placeholder" v-model="inputText"
                                      @change="inputFocus" @input="inputFocus" @focus="inputFocus" @keyup.13.native="searchMethod">
                              <!-- <el-select v-model="selectType" slot="prepend">
                                <el-option label="全文" value="全文"></el-option>
                                <el-option label="标题" value="标题"></el-option>
                              </el-select> -->
                            </el-input>
                          </el-popover>
                          <el-dropdown @command="selectDown" placement="bottom" class="dropGroupRule">
                            <el-button type="primary">{{selectType}}<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                            <el-dropdown-menu slot="dropdown">
                              <el-dropdown-item command="全文">全文</el-dropdown-item>
                              <el-dropdown-item command="标题">标题</el-dropdown-item>
                            </el-dropdown-menu>
                          </el-dropdown>
                        </div>
                      </template>
                      <el-button style="position:absolute;top:0;right:0" class="searchButton" @click="searchMethod" :class="{buttonFlag:showPanel}">
                        <i class="el-icon-search"></i>
                      </el-button>
                      <v-safeWordTip v-show="tipShow[0]"></v-safeWordTip>
                    </div>
                    <!-- 高级搜索panel -->
                    <div class="seniorPanel-2" :class="{seniorShow:showPanel}" v-show="showPanel">
                      <div class="mustTitle">
                        <span>标题</span>
                        <el-input v-model="titleIncludes" placeholder="匹配全部关键字"
                                  @keyup.enter.native="searchMethod"></el-input>
                        <v-safeWordTip v-show="tipShow[1]" style="position: absolute"></v-safeWordTip>
                      </div>
                      <div class="mustTitle">
                        <span>标题</span>
                        <el-input v-model="titleMaybeIncludes" placeholder="匹配至少一个关键字"
                                  @keyup.enter.native="searchMethod"></el-input>
                        <v-safeWordTip v-show="tipShow[2]" style="position: absolute"></v-safeWordTip>
                      </div>
                      <div class="mustTitle">
                        <span>标题</span>
                        <el-input v-model="titleExcludes" placeholder="不匹配任何关键字"
                                  @keyup.enter.native="searchMethod"></el-input>
                        <v-safeWordTip v-show="tipShow[3]" style="position: absolute"></v-safeWordTip>
                      </div>
                    </div>
                    <div class="seniorPanel-3" :class="{seniorShow:showPanel}" v-show="showPanel">
                      <div class="mustContent">
                        <span>正文</span>
                        <el-input v-model="contentIncludes" placeholder="匹配全部关键字"
                                  @keyup.enter.native="searchMethod"></el-input>
                        <v-safeWordTip v-show="tipShow[4]" style="position: absolute"></v-safeWordTip>
                      </div>
                      <div class="mustTitle">
                        <span>正文</span>
                        <el-input v-model="contentMaybeIncludes" placeholder="匹配至少一个关键字"
                                  @keyup.enter.native="searchMethod"></el-input>
                        <v-safeWordTip v-show="tipShow[5]" style="position: absolute"></v-safeWordTip>
                      </div>
                      <div class="mustTitle">
                        <span>正文</span>
                        <el-input v-model="contentExcludes" placeholder="不匹配任何关键字"
                                  @keyup.enter.native="searchMethod"></el-input>
                        <v-safeWordTip v-show="tipShow[6]" style="position: absolute"></v-safeWordTip>
                      </div>
                    </div>
                  </div>
                  <div class="searchSenior">
                    <span @click="seniorMethod" style="cursor: pointer" v-if="!showPanel">
                      <span class="seniorIcon">高级</span>
                      <!-- <i class="web-sanjiaoxing el-icon-arrow-down"></i> -->
                      <i class="iconfont web-xiangxiajiantou" style="color: #AEAEAE"></i>
                    </span>
                    <span @click="seniorMethod" style="cursor: pointer" v-else>
                      <span class="seniorIcon">默认</span>
                      <!-- <i class="web-sanjiaoxing el-icon-arrow-up"></i> -->
                      <i class="iconfont web-xiangshangjiantou" style="color: #AEAEAE"></i>
                    </span>
                  </div>
                  <el-button v-show="showPanel" class="searchButton" @click="searchMethod" :class="{buttonFlag:showPanel}">
                    <i class="el-icon-search"></i>
                  </el-button>
                  <div class="seniorReset" :class="{ seniorResetA:showPanel }" v-show="showPanel" @click="resetSenior(1)">
                    <span style="margin-right: 5px;font-weight: normal;">重置</span>
                    <i class="iconfont web-huanyipi2" style="color: #AEAEAE;font-size: 14px;margin-right: 1px"></i>
                  </div>
                </div>
              </div>
              <div class="screen">
                <!-- 筛选模块 -->
                <ul class="screen-box">
                  <li v-for="(list,index) in titleList" :key="index" @click="screenIsActive(index)">
                    <div :class="{isActive: list.isSelect, 'screen-li': index != 0 && index != titleList.length-1}">
                      <span>{{list.titleName}}</span>
                      <i class="iconfont web-sanjiaoxing" v-if="index !== 0" style="font-size: 10px;"></i>
                    </div>
                  </li>
                </ul>
              <div class="screen_type" :class="{'screen_type_bottom': screenList.length > 2}" v-if="screenList.length > 0"> 
                <transition-group tag="ul" name="slide">
                    <template v-for="(item, index) in screenList"  >
                      <div v-if="index < listIndex" class="vxa-flax-box" :key="index + '?'">
                      <!-- <div class="vxa-flax-box" :key="index + '?'"> -->
                          <div class="screen_type_title"><span style="margin-top: 2px;display:inline-block">{{item.title}}：</span></div>
                          <div class="screen_type_content">
                            <div class="screen_type_info">
                              <span class="screen_type_item" v-for="option in item.typeArr" :key="option">
                                <template v-if="allMapping">
                                  <template v-if="item.title != '时效性' && item.title != '发布日期'">
                                    <span v-for="(map, i) in allMapping[item.title]" :key="i + '-'">
                                      <i v-if="map['id'] == option">{{map['label']}}</i>
                                    </span>
                                  </template>
                                  <template v-else>
                                    <span>{{option}}</span>
                                  </template>
                                </template>
                                <template v-else>
                                  <span>{{option}}</span>
                                </template>
                                <i @click="deleteType(option, item)" class="el-icon-close"></i>
                              </span>
                            </div>
                            <div @click="deleteTypeAll(item,index)" class="screen_type_del" style="line-height: 22px"><i class="el-icon-close"></i></div>
                          </div>
                      </div>
                    </template>
                </transition-group>
                  </div>
                <div @click="showAll" class="showType" v-if="screenList.length > 2 && listIndex <= 2">展开全部 <i class="el-icon-arrow-down"></i></div>
                <div @click="retract" class="showType" v-if="screenList.length > 2 && listIndex > 2">收起 <i class="el-icon-arrow-up"></i></div>
                <!-- 筛选下拉框 -->
                <slot name="transition"></slot>
              </div>
            </el-card>
            <div class="slotList">
              <slot name="list"></slot>
            </div>
          </el-col>
          <el-col :span="6" style="padding-left: 6px">
            <slot name="adv"></slot>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>
<script>
  import mixins from '@/service/sensitiveWord'
  export default {
    name: "commonSearch",
    mixins: [mixins],
    data () {
      return {
        showPanel: '', // isShow panel
        inputCode: '', // user inpput code
        inputText: '', // user inpput affiche text
        startDate: '',
        startEnd: '',
        titleIncludes: '', // 标题必含关键字
        titleMaybeIncludes: '', // 标题可含关键字
        titleExcludes: '', // 标题不含关键字
        contentIncludes: '', // 全文必含关键字
        contentMaybeIncludes: '', // 全文可含关键字
        contentExcludes: '', // 全文不含关键字
        gridData: [],  // code autocomplete
        autoNo: ['换一个关键词吧！', '高级', '重置', '确认', '请输入法规关键词，多关键词用空格隔开，如：股东 减持', '请输入公告名称，多关键词用空格隔开', '证券代码/简称', '搜索筛选条件'],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          }, {
            text: '一月前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }]
        },
        pickerOptions2: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '前天',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 2)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          }, {
            text: '一月前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }, {
            text: '一年前',
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', date)
            }
          }]
        },
        selectType: '全文', // 搜索类别
        screenList: [],
        listIndex: 2,
        // placeholder: '',
        prestrain: [], // autoComplete的数据
        rule: true,
        showPopover: false,
        followCompany: [], // 关注公司
        compareCompany: [],
        isRootUser: false
      };
    },
    /**
     * @param {Boolean} stockCode 是否展示股票代码选择框
     * @param {Array} titleList 选中的需要筛选的选项
     * @param {Array} allMapping 筛选框内所有选项的集合
     * @param {Number} senior 监控是否打开高级选项
     * @param {Boolean} changeSearch 是否显示全文与标题按钮切换
     * @param {Boolean} auto 是否显示autocomplete
     */
    props: ['stockCode', 'titleList', 'allMapping', 'senior', 'placeholder', 'changeSearch', 'auto'],
    created() {
      this.stateful();
      this.userId = this.$cookie.get('userId');
      if (this.userId && this.inputCode == '本公司') {
        let userInfo = JSON.parse(this.$cookie.get('userInfo'));
        if (userInfo.enterpriseUser) {
          this.inputCode = userInfo.enterpriseCompanyCode
        } else if (userInfo.companyCode) {
          this.inputCode = userInfo.companyCode
        } else if (!userInfo.companyCode) {
          this.inputCode = '本公司'
        }
      }
      this.auto ? this.rule = true : this.rule = false;
      if (this.userId) {
        let userInfo = JSON.parse(this.$cookie.get('userInfo'));
        this.getMyAttentionCodes();
        this.getCompanyCompare(userInfo);
        this.rootUser();
      }
    },
    watch: {
      'titleList': {
        deep: true,
        handler: function() {
          this.screenList = this.filterType(this.titleList);
          if (this.listIndex > 2) {
            this.listIndex = this.screenList.length;
          }
        }
      },
      'senior': function() {
        this.seniorMethod();
      }
    },
    methods: {
      rootUser() {
        this.userId = this.$cookie.get('userId')
        let isTrue = false
        if (this.userId) {
          this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
          this.companyCode = this.userInfo.companyCode
          if (this.userInfo.companyId) {
            if (this.userInfo.rootUserId == this.userId) {
              isTrue = true
            }
          }
        }
        this.isRootUser = isTrue
      },
      getMyAttentionCodes() {
        this.$http({
          method: 'GET',
          url: this.$api.stock.getMyAttentions,
          params: {
            userId: this.userId,
            pageNum: 1,
            pageSize: 1000
          }
        }).then((res) => {
          // res.data.returnObject = [
          //   {obj: '00000', zhongWenJianCheng: 'hahah', hhh: '888'},
          //   {obj: '00000', zhongWenJianCheng: 'hahah', hhh: '888'},
          //   {obj: '00000', zhongWenJianCheng: 'hahah', hhh: '888'},
          //   {obj: '00000', zhongWenJianCheng: 'hahah', hhh: '888'},
          // ]
          this.followCompany = res.data.returnObject.map(e => {
            e.obj = e.obj.replace('SZ', '').replace('SH', '')
            return {code: e.obj, name: e.zhongWenJianCheng}
          })
        }).catch((err) => {
          
        })
      },
      getCompanyCompare(userInfo) {
        this.$http({
          method: 'GET',
          url: this.$api.enterpriseCompany.getCompanyCompare,
          params: {
            companyId: userInfo.companyId,
            pageNum: 1,
            pageSize: 1000
          }
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.compareCompany = res.data.returnObject
            }
          }
        }).catch((err) => {
          
        })
      },
      selectDown(type) {
        this.selectType = type;
      },
      dropDown(type) {
        let obj = {
          company: '本公司',
          attention: '关注公司',
          compare: '可比公司'
        }
        let path = this.$route.path;
        location.href = `${path}?inputCode=${encodeURIComponent(obj[type])}`
      },
      /* autoComplete */
      autoComplete(value) {
        this.inputText = this.inputText ? this.inputText : ''
        this.$http({
          method: 'GET',
          url: this.$api.rule.autoComplete,
          params: {
            title: this.inputText == '' ? '上市' : this.inputText
          }
        }).then((res) => {
          if (res.data.returnObject.length == 0) {
            this.prestrain = []
          } else {
            this.prestrain = res.data.returnObject
          }
        }).catch((err) => {
          
        })
      },
      selectText(i) {
        this.inputText = this.prestrain[i].title
        var tit = document.getElementsByClassName('ele-popover')[0]
        tit.style.display = 'none'
        // this.submitAll()
      },
      showAll() {
        this.listIndex = this.screenList.length;
      },
      // 收起
      retract() {
        this.listIndex = 2;
      },
      // 删除单个选项
      deleteType(data, item) {
        let index = this.optionType(item);
        let obj = {id: data, label: data, status: index};
        this.$emit('deleteType', obj);
      },
      deleteTypeAll(item) {
        let index = this.optionType(item);
        let obj = {status: index}
        this.$emit('deleteType', obj, 'all');
      },
      // 判断点击的是哪一项
      optionType(data) {
        let index = 0;
        this.titleList.forEach((e, i) => {
          if (data.title == e.titleName || data == e.titleName) {
            index = i;
          }
        })
        return index
      },
      // 筛选已选择的选项
      filterType(data) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
          let obj = {title: '', typeArr: []}
          if (data[i].titleName != '全部' && (data[i].title != data[i].titleName) && data[i].list.length > 0) {
            obj.title = data[i].titleName;
            obj.typeArr = data[i].list;
            arr.push(obj);
          }
        }
        return arr
      },
      // 展开选项下拉框
      screenIsActive(index) {
        this.$emit('screenIsActive', index)
      },
      // 打开高级搜索
      seniorMethod() {
        this.tipShow.forEach((item, index) => {
          this.$set(this.tipShow, index, false)
        })
        this.showPanel ? this.showPanel = false : this.showPanel = true
        this.boxContClick()
        // this.resetSenior(2)
        this.stateful();
        /* if (!this.showPanel) {
          this.resetSenior(2)
        } */
      },
      boxContClick() {
        this.boxContent = false
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
      },
      selectCode(e) {
        this.showPopover = false;
        this.inputCode = this.gridData[e].code
      },
      // 公司代码 autocomplete
      loadCode() {
        this.boxContClick()
        this.inputCode = this.inputCode ? this.inputCode : ''
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: this.inputCode
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.gridData = res.data.returnObject
          }
        }).catch((err) => {
          this.$message({
            showClose: true,
            type: 'success',
            duration: 3000,
            message: err.message
          })
        })
      },
      inputFocus() {
        this.boxContClick()
        if (this.$route.path == '/rule') {
          this.autoComplete()
        }
      },
      // 点击执行搜索方法
      searchMethod() {
        // 敏感词检测
        this.tipShow.forEach((item, index) => {
          this.$set(this.tipShow, index, false)
        })
        if (this.checkWordSearch(this.inputCode)) {
          this.$set(this.tipShow, 7, true)
          return false
        } else {
          this.$set(this.tipShow, 7, false)
        }
        if (this.checkWordSearch(this.inputText)) {
          this.$set(this.tipShow, 0, true)
          return false
        } else {
          this.$set(this.tipShow, 0, false)
        }
        if (this.checkWordSearch(this.titleIncludes)) {
          this.$set(this.tipShow, 1, true)
          return false
        } else {
          this.$set(this.tipShow, 1, false)
        }
        if (this.checkWordSearch(this.titleMaybeIncludes)) {
          this.$set(this.tipShow, 2, true)
          return false
        } else {
          this.$set(this.tipShow, 2, false)
        }
        if (this.checkWordSearch(this.titleExcludes)) {
          this.$set(this.tipShow, 3, true)
          return false
        } else {
          this.$set(this.tipShow, 3, false)
        }
        if (this.checkWordSearch(this.contentIncludes)) {
          this.$set(this.tipShow, 4, true)
          return false
        } else {
          this.$set(this.tipShow, 4, false)
        }
        if (this.checkWordSearch(this.contentMaybeIncludes)) {
          this.$set(this.tipShow, 5, true)
          return false
        } else {
          this.$set(this.tipShow, 5, false)
        }
        if (this.checkWordSearch(this.contentExcludes)) {
          this.$set(this.tipShow, 6, true)
          return false
        } else {
          this.$set(this.tipShow, 6, false)
        }

        this.startDate = this.startDate ? this.startDate : ''
        this.startEnd = this.startEnd ? this.startEnd : ''
        
        if (this.showPanel) {
          this.inputText = '';
        } else {
          this.titleIncludes = '';
          this.titleMaybeIncludes = '';
          this.titleExcludes = '';
          this.contentIncludes = '';
          this.contentMaybeIncludes = '';
          this.contentExcludes = '';
        }
        if (this.contentIncludes.length == 1 || this.titleExcludes.length == 1 || this.titleMaybeIncludes.length == 1 || this.inputText.length == 1 || this.contentMaybeIncludes.length == 1 || this.contentExcludes.length == 1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'})
        } else {
          let title = false;
          if (this.showPanel) {
            title = false
          } else {
            this.selectType == '标题' ? title = true : title = false;
          }
          let obj = {
            startDate: this.startDate,
            startEnd: this.startEnd,
            inputCode: this.inputCode, // user inpput code
            inputText: this.inputText, // user inpput affiche text
            titleIncludes: this.titleIncludes, // 标题必含关键字
            titleMaybeIncludes: this.titleMaybeIncludes, // 标题可含关键字
            titleExcludes: this.titleExcludes, // 标题不含关键字
            contentIncludes: this.contentIncludes, // 全文必含关键字
            contentMaybeIncludes: this.contentMaybeIncludes, // 全文可含关键字
            contentExcludes: this.contentExcludes, // 全文不含关键字
            isTitle: title, // 是否搜索的为标题
            sortType: '',
            dataType: 'mix'
          }
          /**
           * reset  重置flip 页码置为1
           */
          this.$emit('submitAll', obj, 'reset')
        }
      },
      // 重置高级条件
      resetSenior(index) {
        this.startDate = ''
        this.startEnd = ''
        this.titleIncludes = '' // 标题必含关键字
        this.titleMaybeIncludes = '' // 标题可含关键字
        this.titleExcludes = '' // 标题不含关键字
        this.contentIncludes = '' // 全文必含关键字
        this.contentMaybeIncludes = '' // 全文可含关键字
        this.contentExcludes = '' // 全文不含关键字
        this.inputText = ''
        if (index == 1) {
          this.inputCode = ''
        }

      },
      /* 保存状态 */
      stateful() {
        this.titleIncludes = (this.$route.query.titleIncludes == undefined || this.$route.query.titleIncludes == '') ? '' : this.$common.transComma(this.$route.query.titleIncludes)
        this.titleExcludes = (this.$route.query.titleExcludes == undefined || this.$route.query.titleExcludes == '') ? '' : this.$common.transComma(this.$route.query.titleExcludes)
        this.titleMaybeIncludes = (this.$route.query.titleMaybeIncludes == undefined || this.$route.query.titleMaybeIncludes == '') ? '' : this.$common.transComma(this.$route.query.titleMaybeIncludes)
        
        this.contentIncludes = (this.$route.query.contentIncludes == undefined || this.$route.query.contentIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentIncludes)
        this.contentExcludes = (this.$route.query.contentExcludes == undefined || this.$route.query.contentExcludes == '') ? '' : this.$common.transComma(this.$route.query.contentExcludes)
        this.contentMaybeIncludes = (this.$route.query.contentMaybeIncludes == undefined || this.$route.query.contentMaybeIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentMaybeIncludes)
        if (this.$route.path == '/rule') {
          this.inputText = (this.$route.query.fullTextIncludes == undefined || this.$route.query.fullTextIncludes == '') ? '' : this.$route.query.fullTextIncludes
        } else if (this.$route.path == '/affiche') {
          this.inputText = (this.$route.query.keys == undefined || this.$route.query.keys == '') ? '' : this.$route.query.keys
        } else if (this.$route.path == '/ipo/search' || this.$route.path == '/kechuangban/kechuangbanIpo') {
          this.inputText = (this.$route.query.keyword == undefined || this.$route.query.keyword == '') ? '' : this.$route.query.keyword
        }
        /**/
        // this.contentIncludes = (this.$route.query.contentIncludes == undefined || this.$route.query.contentIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentIncludes)

        // this.contentExcludes = (this.$route.query.contentExcludes == undefined || this.$route.query.contentExcludes == '') ? '' : this.$common.transComma(this.$route.query.contentExcludes)

        // this.contentMaybeIncludes = (this.$route.query.contentMaybeIncludes == undefined || this.$route.query.contentMaybeIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentMaybeIncludes)

        // this.inputText = (this.$route.query.keys == undefined || this.$route.query.keys == '') ? '' : this.$route.query.keys
        this.inputCode = (this.$route.query.code == undefined || this.$route.query.code == '') ? this.$route.query.inputCode : this.$route.query.code
      }
    }
  }
</script>
<style lang="scss">
.companyCode {
  max-height: 300px;
  min-height: 60px;
  overflow: auto;
  ul {
    li {
      height: 35px;
      line-height: 35px;
      .item {
        display: inline-block;
        width: 45%;
      }
    }
    .setcompare {
      font-size: 14px;
      text-align: center;
    }
    .button {
      text-align: center;
      padding-top: 8px;
      border-top: 1px solid #E3E3E3;
    }
  }
  .compareWord {
    width: 230px;
  }
}
#commonSearch {
  .span-ellipsis, .el-tree-node__label {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    font-size: 14px;
    color: #424345;
  }
  .slotList {
    .el-card__body {
      padding: 0;
      .list {
        li {
          .title-default {
            align-items: baseline;
          }
        }
      }
    }
  }
  .topCard {
    .el-card__body {
      padding-bottom: 0;
    }
  }
  .el-card__body {
    // padding: 0;
    padding: 15px;
    padding-bottom: 5px;
    position: relative;
  }
  .line {
    height: 68px;
    width: 2px;
    background-color: #FFB148;
    position: absolute;
    top: 0;
    transition: height .5s;
    &.left {
      left: -1px;
      border-top-left-radius: 4px;
    }
    &.right {
      right: -1px;
      border-top-right-radius: 4px;
    }
  }
  .showHight {
    height: 175px;
    transition: height .5s;
  }
  #noInfo {
    width: 100%;
    height: 550px;
    text-align: center;
    font-size: 30px;
    color: #ffb148;
    border: 0;
    box-shadow: none;
    position: relative;
    img {
      margin: auto;
      margin-top: 140px;
      width: auto;
      display: block;
      height: auto;
    }
    p {
      margin: auto;
      margin-top: 20px;
      width: auto;
      line-height: 1;
      height: auto;
      font-size: 14px;
      color: #f4b55c;
    }
    .el-button {
      margin-top: 25px;
      background: #ffb148;
      color: #fff;
      /*text-decoration: underline;*/
      font-size: 14px;
      border: 0;
    }
  }
  #noInfo:hover {
    background: #fff;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
  .no-list {
    position: relative;
    min-height: 700px;
    width: 100%;
  }
  .foot-pagination {
    padding: 30px 16px;
    display: flex;
    align-items: center;
    text-align: inherit;
    .row {
      flex: 1;
      &:last-child {
        flex: inherit;
        .el-radio-button--mini .el-radio-button__inner {
          padding: 8px;
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
    .btn-prev, .btn-next, li {
      margin-right: 10px;
      width: auto;
      height: 30px;
      border-radius: 4px;
      border: 1px solid #e3e3e3;
      box-sizing: border-box;
      padding: 0 8px;
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
  .inputCode {
    // top: 300px !important;
    border-radius: 4px !important;
    li {
      width: auto;
      height: auto;
      overflow: hidden;
      padding: 10px 0;
      box-sizing: border-box;
      span {
        float: left;
        width: 50%;
      }
      &:hover {
        background: rgba(240, 241, 245, .6);
      }
    }
  }
  .el-input-group__prepend {
    border: none;
    width: 80px;
    border-top-left-radius: 3px;
    border-bottom-left-radius: 3px;
    background-color: #ffb148;
    input {
      color: #fff !important;
    }
    .el-select__caret {
      color: #fff;
    }
  }
  .stockCode {
    width: 790px !important;
  }
  .searchTextCode {
    width: 590px !important;
  }
  .header {
    width: 100%;
    height: auto;
    position: relative;
    background-size: cover;
    padding: 1px 0 8px;
    // padding-bottom: 10px;
    overflow: hidden;
    border-bottom: 1px solid #e3e3e3;
    height: 54px;
    transition: height .5s;
    .search {
      // width: 1200px;
      width: 100%;
      height: 44px;
      margin: auto;
      position: relative;
      z-index: 300;
      input {
        text-align: left !important;
      }
      .searchCode, .searchText {
        float: left;
        width: 180px;
        height: 36px;
        &.searchAuto {
          .codeBox {
            margin-bottom: 16px;
          }
        }
        .codeBox {
          position: relative;
          width: 100%;
          height: 36px !important;
          // border: 1px solid #ccc;
          box-shadow: 0px 0px 2px #8D8D8D;
          border-right: none;
          // border-left: none;
          // border-top-left-radius: 4px;
          // border-bottom-left-radius: 4px;
          border-radius: 4px;
          // -moz-box-shadow: 0px 0px 2px #8D8D8D;
          // -webkit-box-shadow: 0px 0px 2px #8D8D8D;
          // box-shadow: 0px 0px 2px #8D8D8D;
          /*overflow: hidden;*/
          input {
            width: 100%;
            height: 36px !important;
            border: 0;
            font-size: 20px;
            line-height: 36px;
            color: #5a5e66;
            outline: none;
            padding: 0 15px;
            box-sizing: border-box;
            font-size: 16px;
          }
          :-moz-placeholder { /* Mozilla Firefox 4 to 18 */
            color: #aeaeae;
            opacity: 1;
          }
          ::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #aeaeae;
            opacity: 1;
          }
          input:-ms-input-placeholder {
            color: #aeaeae;
            opacity: 1;
          }
          input::-webkit-input-placeholder {
            color: #aeaeae;
            opacity: 1;
          }
          .el-autocomplete {
            .el-input {
              .el-input__inner {
                width: 100%;
                height: 36px;
                border: 0;
                font-size: 20px;
                line-height: 36px;
              }
            }
          }
          .dropGroup {
            position: absolute;
            top: 0px;
            left: 0px;
            .el-button {
              height: 36px;
              // border-radius: 3px 0 0 3px;
              border-top-right-radius: 0 !important;
              border-bottom-right-radius: 0 !important;
              padding: 8px 5px;
              border-top-left-radius: 3px;
              border-bottom-left-radius: 3px;
            }
          }
          .dropGroupRule {
            width: 70px;
            height: 35px;
            position: absolute;
            top: 0;
            left: 0;
            .el-button {
              padding: 10px 12px;
              height: 36px;
            }
          }
        }
        .stockColor {
          box-shadow: 0px 0px 2px #FFB148;
          border: none;
        }
      }
      .searchText {
        float: left;
        // float: none;
        vertical-align: middle;
        // width: 530px !important;
        width: 530px;
        height: 36px;
        // margin-left: 20px;
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;

        .el-autocomplete {
          width: 100%;
          height: 36px;
        }
        .seniorShow {
          animation: contentShow .5s forwards;
          -moz-animation: contentShow .5s forwards;
          -webkit-animation: contentShow .5s forwards;
          -o-animation: contentShow .5s forwards;
        }
        .seniorShow:last-child {
          margin-left: 20px;
          animation: titleShow .5s forwards;
          -moz-animation: titleShow .5s forwards;
          -webkit-animation: titleShow .5s forwards;
          -o-animation: titleShow .5s forwards;
        }
      }
      .searchButton {
        width: 59px;
        height: 36px;
        background: #ffb148;
        vertical-align: middle;
        // float: right;
        float: left;
        border: 0;
        border-radius: 0;
        padding: 0 !important;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        -moz-box-shadow: 0px 0px 2px #FFB148;
        -webkit-box-shadow: 0px 0px 2px #FFB148;
        box-shadow: 0px 0px 2px #FFB148;
        i {
          font-size: 24px;
          color: #fff;
        }
        &:active {
          background: #f9e9d5;
        }
      }
      .searchSenior {
        float: right;
        margin-left: 15px;
        height: 36px;
        line-height: 36px;
        .seniorIcon {
          color: #545454;
          margin-right: 4px;
          font-size: 14px;
          // opacity: 0.3;
        }
      }
      .buttonFlag {
        border-radius: 4px !important;
      }
      .seniorPanel, .seniorPanel-2, .seniorPanel-3 {
        width: 180px;
        height: auto;
        float: left;
        .start, .end, .mustTitle, .mustContent {
          width: 100%;
          height: 36px;
          display: table;
          margin-bottom: 16px;
          border-radius: 4px;
          -moz-box-shadow: 0px 0px 2px #FFB148;
          -webkit-box-shadow: 0px 0px 2px #FFB148;
          box-shadow: 0px 0px 2px #FFB148;
          overflow: hidden;
          span, input {
            width: 58px;
            display: table-cell;
            height: 36px;
            /*line-height: 36px;*/
            vertical-align: middle;
            text-align: center;
            font-size: 16px;
            color: #fff;
          }
          .el-input {
            display: table;
          }
          span {
            background: #ffb148;
          }
          input {
            width: 135px;
            border: 0;
            border-radius: 0;
          }
          .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 100%;
            .el-input__prefix {
              display: none;
            }
            .el-input__suffix {
              background: rgba(255, 255, 255, 0);
              .el-input__suffix-inner {
                text-align: right;
                .el-input__icon {
                  color: #aeaeae
                }
                .el-icon-circle-close {
                  color: #aeaeae
                }
              }
              span {
                background: rgba(255, 255, 255, 0)
              }
            }
            input {
              width: 100%;
              padding: 0 0 0 8px;
            }
          }
        }
      }
      .seniorPanel-2, .seniorPanel-3 {
        width: 250px;
        margin-left: 20px;
        .mustTitle, .mustContent {
          width: 250px;
          span {
            width: 56px;
          }
          input {
            width: 190px;
          }
        }
      }
      .seniorPanelA {
        animation: dateShow .5s forwards;
        -moz-animation: dateShow .5s forwards;
        -webkit-animation: dateShow .5s forwards;
        -o-animation: dateShow .5s forwards;
      }
      .seniorReset {
        color:#545454;
        font-size: 14px;
        font-weight: bold;
        margin-right: 0px;
        margin-top: 25px;
        float: right;
        cursor: pointer;
        user-select: none;
        -moz-user-select: none;
        -webkit-user-select: none;
      }
      .seniorResetA {
        animation: seniorResetA .5s forwards;
        -moz-animation: seniorResetA .5s forwards;
        -webkit-animation: seniorResetA .5s forwards;
        -o-animation: seniorResetA .5s forwards;
      }
    }
    .searchAuto {
      animation: searchAuto .5s forwards;
      -moz-animation: searchAuto .5s forwards;
      -webkit-animation: searchAuto .5s forwards;
      -o-animation: searchAuto .5s forwards;
    }
    .searchHeight {
      animation: searchHeight .5s forwards;
      -moz-animation: searchHeight .5s forwards;
      -webkit-animation: searchHeight .5s forwards;
      -o-animation: searchHeight .5s forwards;
    }
  }
  .headerHight {
    height: 160px;
    transition: height .5s;
  }
  .screen {
    // width: 1200px;
    box-sizing: border-box;
    margin: 0 auto;
    height: auto;
    padding: 0 0 0 0;
    position: relative;
    z-index: 1000;
    border: 0;
    .xiaoan-box-content {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      -ms-box-sizing: border-box;
      box-sizing: border-box;
      width: 100%;
      height: auto;
      position: absolute;
      top: 50px;
      left: 0;
      background: #ffffff;
      z-index: 120;
      padding: 0 45px;
      border: 1px solid #e3e3e3;
      // border-top: 0;
      box-shadow: 0 4px 8px #e3e3e3;
      -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      .cont-button {
        margin-top: 15px;
        margin-bottom: 15px;
        width: 100%;
        display: table;
        font-size: 0;
        div {
          display: table-cell;
          width: 50%;
          font-size: 18px;
          margin: 0 auto;
          .el-button {
            width: 250px;
            height: 44px;
            font-size: 18px;
          }
        }
        div:first-child {
          text-align: right;
          .el-button {
            margin-right: 15px;
            background-color: white;
            color: #FFAC38;
          }
          .el-button:active {
            border-color: white;
            background-color: rgba(255, 172, 56, 0.4);
            color: #fff;
          }
        }
        div:last-child {
          text-align: left;
          .el-button {
            margin-left: 15px;
          }
        }

      }
      .cont-containerDate {
        width: 100%;
        .tableDate {
          display: inline-block;
          width: 48%;
          margin-right: 1%;
          .start, .end {
            width: 100%;
            height: 35px;
            display: table;
            margin-top: 20px;
            border-radius: 4px;
            -moz-box-shadow: 0px 0px 2px #FFB148;
            -webkit-box-shadow: 0px 0px 2px #FFB148;
            box-shadow: 0px 0px 2px #FFB148;
            overflow: hidden;
            span, input {
              width: 45px;
              display: table-cell;
              height: 35px;
              line-height: 35px;
              text-align: center;
              font-size: 14px;
              color: #636363;
            }
            span {
              color: white;
              background: #FFB148;
            }
            input {
              width: 100%;
              border: 0;
              border-radius: 0;
            }
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
              width: 100%;
              .el-input__prefix {
                display: none;
              }
              .el-input__suffix {
                background: rgba(255, 255, 255, 0);
                .el-input__suffix-inner {
                  text-align: right;
                  .el-input__icon {
                    color: #aeaeae
                  }
                  .el-icon-circle-close {
                    color: #aeaeae
                  }
                }
                span {
                  background: rgba(255, 255, 255, 0)
                }
              }
              input {
                padding: 0 0 0 15px;
                text-align: left;
              }
            }
          }
        }
        .dateArr {
          width: 140%;
          height: auto;
          padding: 10px 0 20px 0;
          overflow: hidden;
          li {
            list-style: none;
            float: left;
            font-size: 12px;
            color: #323232;
            margin-right: 30px;
            padding: 0px 5px;
            border: 1px solid #fff;
            &:hover {
              color: #ffb148;
            }
          }
          li:last-child {
            margin-right: 0;
          }
          .selectStatus {
            border: 1px solid #ffb148;
            color: #ffb148;
            padding: 0 5px;
            border-radius: 2px;
          }
        }
      }
      .cont-container {
        .cont-tree {
          margin-top: 10px;
          /* margin-bottom: 20px;*/
          max-height: 300px;
          height: auto;
          overflow-y: auto;
          overflow-x: hidden;
          .filter-tree {
            .el-tree-node {
              .el-tree-node__content {
                height: 40px;
                border-radius: 2px;
                &:hover {
                  background: rgba(240, 241, 245, .6);
                }
                .el-checkbox {
                  .el-checkbox__input {
                    .el-checkbox__inner {
                      height: 20px;
                      width: 20px;
                    }
                    .el-checkbox__inner::after {
                      width: 4.28px;
                      height: 10px;
                      top: 1.6px;
                      left: 6px;
                    }
                    .el-checkbox__inner::before {
                      top: 8px;
                    }
                  }
                }
                .el-tree-node__label {
                  //font-size: 14px;
                  color: #424345;
                }
                .el-tree-node__expand-icon {
                  font-size: 0;
                  padding: 0;
                }
              }
            }
          }
        }
        .cont-search {
          margin-top: 16px;
          display: table;
          width: 100%;
          div {
            display: table-cell;
          }
          .el-input {
            .el-input__inner {
              border: #FFAC38;
              -moz-box-shadow: 0px 0px 2px #FFB148;
              -webkit-box-shadow: 0px 0px 2px #FFB148;
              box-shadow: 0px 0px 2px #FFB148;
              height: 35px;
              border-bottom-right-radius: 0;
              border-top-right-radius: 0;
              border-right-width: 0;
            }
          }
          .ruleBtn {
            display: table-cell;
            vertical-align: middle;
            border: 0;
            color: #fff;
            font-size: 15px;
            button {
              -moz-box-shadow: 0px 0px 2px #FFB148;
              -webkit-box-shadow: 0px 0px 2px #FFB148;
              box-shadow: 0px 0px 2px #FFB148;
              height: 35px;
              font-size: 20px;
              padding: 0;
              width: 60px;
              border-bottom-left-radius: 0;
              border-top-left-radius: 0;
            }
          }
        }
      }
    }
    .screen-box {
      width: 100%;
      // height: 50px;
      height: 45px;
      display: table;
      box-sizing: border-box;
      vertical-align: middle;
      border: none;
      position: relative;
      z-index: 199;
      li {
        display: table-cell;
        text-align: center;
        vertical-align: middle;
        box-sizing: border-box;
        border: none;
        width: 16.5%;
        font-size: 0;
        div {
          box-sizing: border-box;
          // width: 120px;
          margin: 0 auto;
          height: 41px;
          padding-top: 8px;
          margin-top: 8px;
          // border: 1px solid #fff;
          // border-bottom: 1px solid #e3e3e3;
          -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          span {
            font-size: 16px;
            vertical-align: middle;
            color: #323232;
            outline: none;
          }
          i {
            color: #FFAC38;
            vertical-align: middle;
            display: inline-block;
            transition: transform .3s, -webkit-transform .3s;
            transform: rotate(0deg);
            line-height: 20px;
            margin-left: 8px;
          }
          .web-sanjiaoxing:before {
            font-size: 14px !important;
            display: block;
            transform: scale(0.7, 0.7);
            -ms-transform: scale(0.7, 0.7); /* IE 9 */
            -moz-transform: scale(0.9, 0.9); /* Firefox */
            -webkit-transform: scale(0.7, 0.7); /* Safari 和 Chrome */
            -o-transform: scale(0.7, 0.7); /* Opera */
          }
          .el-icon-arrow-down:before {
            content: "\E60B";
          }
        }
        .screen-li {
          width: 120px;
        }
        div:hover {
          color: #FFAC38;
          span {
            color: #FFAC38;
          }
        }
        .isActive {
          box-sizing: border-box;
          height: 43px;
          padding-top: 8px;
          margin-top: 8px;
          text-align: center;
          border: 1px solid #e3e3e3;
          border-bottom: 1px solid #fff;
          border-top-left-radius: 4px;
          border-top-right-radius: 4px;
          -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          .focusing {
            outline: none;
          }
          i {
            transition: transform .3s, -webkit-transform .3s;
            transform: rotate(180deg);
          }
          * {
            color: #FFAC38;
          }
        }
      }
      li:first-child {
        border-bottom-color: #e3e3e3;
        text-align: left;
        border-right: 0;
        width: 6%;
        border-left: 1px solid #fff;
        .isActive {
          color: #FFAC38;
          box-sizing: border-box;
          height: 41px;
          padding-top: 8px;
          margin-top: 8px;
          // padding-right: 20px;
          text-align: left;
          border: 1px solid #fff;
          // border-bottom: 1px solid #e3e3e3;
          -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
      li:last-child {
        width: 12%;
        text-align: right;
      }
    }
    .screen_type {
      // height: 100px;
      // padding: 13px 0;
      // padding-bottom: 13px;
      border-top: 1px solid rgba(0,0,0,0.08);
      // border-bottom: 1px solid rgba(0,0,0,0.08);
      .vxa-flax-box {
        margin-top: 10px;
        .screen_type_title {
          flex: 1;
          font-size: 12px;
          color: rgba(0,0,0,0.6);
        }
        .screen_type_content {
          flex: 11;
          padding-bottom: 2px;
          border-bottom: 1px solid rgba(0,0,0,0.08);
          div {
            display: inline-block;
          }
          .screen_type_info {
            width: 740px
          }
          .screen_type_item {
            display: inline-block;
            height: 22px;
            line-height: 20px;
            padding: 2px 8px;
            font-size: 12px;
            background: rgba(0,0,0,0.05);
            border-radius: 4px;
            color: rgba(0,0,0,0.4);
            margin-right: 8px;
            margin-bottom: 10px;
            cursor: pointer;
            .el-icon-close {
              width: 16px;
              height: 16px;
              display: inline-block;
              line-height: 16px;
              text-align: center;
              cursor: pointer;
              border-radius: 50%;
              &:hover {
                background-color: #aeaeae;
                color: #fff;
              }
            }
          }
          .screen_type_del {
            width: 40px;
            float: right;
            text-align: right;
            cursor: pointer;
          }
        }
        &:last-child {
          .screen_type_content {
            border-bottom: none;
          }
        }
      }
    }
    .screen_type_bottom {
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .showType {
      font-size: 12px;
      color: rgba(0,0,0,0.4);
      text-align: center;
      padding-top: 10px;
      padding-bottom: 10px;
      cursor: pointer;
    }
  }
}
</style>

<style lang='scss' scoped>
#commonSearch {
  background-color: #f6f6f6;
}
#commonSearch .topbg {
  width: 100%;
  height: 200px;
  background: url('https://oss.in-hope.cn/xiaoan/web_static/rulebg.png') no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
}
#commonSearch .ruleContent {
  width: 1200px;
  margin: 0 auto;
  margin-top: -168px;
  padding-bottom: 40px;
}
// #commonSearch .topbg .box {
//   width: 1200px;
//   margin: 0 auto;
//   margin-top: 32px;
// }
#commonSearch .ruleContent p {
  color: #FFFFFF;
}
#commonSearch .ruleContent .title {
  font-size: 30px;
  line-height: 42px;
  font-weight: 600;
  margin-bottom: 8px;
}
#commonSearch .ruleContent .info {
  width: 896px;
  font-size: 12px;
  line-height: 20px;
  margin-bottom: 30px;
}

</style>