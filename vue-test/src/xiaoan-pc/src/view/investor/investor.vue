<template>
  <div id="investor-search">
    <div class="search-header vxa-image-bg-affiche">
      <div class="search" :class="{ searchAuto:showPanel,searchHeight:!showPanel&&showPanel!=='' }">
        <div class="searchCode" :class="{ searchAuto:showPanel }">
          <div class="codeBox">
            <el-popover ref="popover4" placement="bottom" width="180" trigger="focus" popper-class="inputCode"
                        :popper-options="{boundariesElement: 'body'}" @click="selectCode">
              <ul>
                <li v-for="(list,index) in gridData" :key="index" @click="selectCode(index)">
                  <span v-html="$common.highlight(inputCode,list.code)"></span>
                  <span>{{ list.name }}</span>
                </li>
              </ul>
              <el-input slot="reference" type="text" :placeholder="autoNo[6]" @focus="loadCode"
                        @input="loadCode" v-model="inputCode" @keyup.13.native="searchMethod"></el-input>
            </el-popover>

            <v-safeWordTip v-show="tipShow[7]" style="position: absolute"></v-safeWordTip>
          </div>
          <!-- 高级搜索panel -->
          <div class="seniorPanel" :class="{ seniorPanelA:showPanel}" v-show="showPanel">
            <div class="start">
              <span>自</span>
              <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                              :editable="false" :picker-options="pickerOptions1">
                <!-- :default-value="this.$common.getNowDate()" -->
              </el-date-picker>
            </div>
            <div class="end">
              <span>到</span>
              <el-date-picker v-model="endDate" type="date" value-format="yyyy-MM-dd"
                              placeholder="选择日期" :editable="false" :picker-options="pickerOptions2">
                <!-- :default-value="this.$common.getNowDate()" -->
              </el-date-picker>
            </div>
          </div>
        </div>
        <div class="searchText" :class="{ searchAuto:showPanel}">
          <div class="codeBox" v-show="!showPanel">
            <el-input type="text" :placeholder="autoNo[5]" v-model="inputText" @focus='inputFocus'
                      @keyup.13.native="searchMethod"></el-input>
            <v-safeWordTip v-show="tipShow[0]"></v-safeWordTip>
          </div>
          <!-- 高级搜索panel -->
          <div class="seniorPanel-2" :class="{seniorShow:showPanel}" v-show="showPanel">
            <div class="mustTitle">
              <span>问题</span>
              <el-input v-model="inputText" placeholder="必含关键字，多关键词用空格隔开" @keyup.enter.native="searchMethod"></el-input>
              <v-safeWordTip v-show="tipShow[1]" style="position: absolute"></v-safeWordTip>
            </div>
            <div class="mustTitle">
              <span>问题</span>
              <el-input v-model="titleMaybeIncludes" placeholder="可含关键字，多关键词用空格隔开"
                        @keyup.enter.native="searchMethod"></el-input>
              <v-safeWordTip v-show="tipShow[2]" style="position: absolute"></v-safeWordTip>
            </div>
            <div class="mustTitle">
              <span>问题</span>
              <el-input v-model="titleExcludes" placeholder="不含关键字，多关键词用空格隔开"
                        @keyup.enter.native="searchMethod"></el-input>
              <v-safeWordTip v-show="tipShow[3]" style="position: absolute"></v-safeWordTip>
            </div>
          </div>
          <div class="seniorPanel-3" :class="{seniorShow:showPanel}" v-show="showPanel">
            <div class="mustContent">
              <span>全文</span>
              <el-input v-model="contentIncludes" placeholder="必含关键字，多关键词用空格隔开"
                        @keyup.enter.native="searchMethod"></el-input>
              <v-safeWordTip v-show="tipShow[4]" style="position: absolute"></v-safeWordTip>
            </div>
            <div class="mustTitle">
              <span>全文</span>
              <el-input v-model="contentMaybeIncludes" placeholder="可含关键字，多关键词用空格隔开"
                        @keyup.enter.native="searchMethod"></el-input>
              <v-safeWordTip v-show="tipShow[5]" style="position: absolute"></v-safeWordTip>
            </div>
            <div class="mustTitle">
              <span>全文</span>
              <el-input v-model="contentExcludes" placeholder="不含关键字，多关键词用空格隔开"
                        @keyup.enter.native="searchMethod"></el-input>
              <v-safeWordTip v-show="tipShow[6]" style="position: absolute"></v-safeWordTip>
            </div>
          </div>
        </div>
        <div class="searchSenior">
          <el-button type="primary" class="seniorButton" @click="seniorMethod" v-if="!showPanel">
            高级<i class="iconfont web-sanjiaoxing searchSanjiao"></i>
          </el-button>
          <el-button type="primary" class="seniorButton" @click="seniorMethod" v-else>
            默认<i class="iconfont web-sanjiaoxing searchSanjiao"></i>
          </el-button>
        </div>
        <el-button class="searchButton" @click="searchMethod" :class="{buttonFlag:showPanel}">
          <i class="el-icon-search"></i>
        </el-button>
        <div class="seniorReset" :class="{ seniorResetA:showPanel }" v-show="showPanel" @click="resetSenior">
          <span style="margin-right: 4px;font-weight: normal">重置</span>
          <i class="icon iconfont web-huanyipi2" style="font-weight: 600"></i>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
      <div class="content">
        <el-row :gutter="15">
          <el-col :span="18">
            <!-- 筛选 -->
            <div class="screen">
              <!-- 筛选模块 -->
              <ul class="screen-box">
                <li v-for="(list,index) in screenList" :key="index" @click="screenIsActive(index)">
                  <div :class="{isActive: list.isSelect}">
                    <el-tooltip content="Bottom center" placement="bottom" effect="light" visible-arrow="false"
                                popper-class="screen-tooltip-affiche" :open-delay="hideAfter">
                      <span>{{$common.number(list.title)}}</span>
                      <span slot="content">{{list.title}}</span>
                      <!--<span slot="content" v-else>{{startDate}}&nbsp;&nbsp;&nbsp;{{endDate}}</span>-->
                    </el-tooltip>
                    <i class="iconfont web-sanjiaoxing" v-if="index !== 0" style="font-size: 10px;"></i>
                  </div>
                </li>
              </ul>
              <!-- 筛选各筛选项 -->
              <transition name="bounce" mode="out-in">
                <div class="xiaoan-box-content" v-show="boxContent">
                  <div class="cont-container" v-show="boxContentTi">
                    <div class="cont-search">
                      <div class="el-input">
                        <input class="el-input__inner" v-model="filterText" :placeholder="autoNo[7]"/>
                      </div>
                      <div class="ruleBtn">
                        <el-button type="primary" icon="el-icon-search"></el-button>
                      </div>
                    </div>
                    <div class="cont-tree">
                      <el-tree class="filter-tree" :data="data4" :props="defaultProps" :filter-node-method="filterNode"
                               node-key="id" accordion show-checkbox ref="tree2" expand-on-click-node
                               @node-click="handleNodeClick" @check-change="handleCheckChange" highlight-current
                               @check="currentChange"
                               :indent="indent">
                      </el-tree>
                    </div>
                  </div>
                  <div v-show="!boxContentTi" class="cont-containerDate">
                    <div class="tableDate">
                      <div class="start">
                        <span>自</span>
                        <el-date-picker v-model="startDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
                                        :default-value="$common.getNowDate()" :editable="false"
                                        :picker-options="pickerOptions1"></el-date-picker>
                      </div>
                    </div>
                    <div class="tableDate">
                      <div class="end">
                        <span>到</span>
                        <el-date-picker v-model="endDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
                                        :default-value="$common.getNowDate()" :editable="false"
                                        :picker-options="pickerOptions2"></el-date-picker>
                      </div>
                    </div>
                    <ul class="dateArr">
                      <li v-for="(list, index) in dateArr" @click="selectDate(index)"
                          :class="{selectStatus: list.selectStatus}">{{ list.column }}
                      </li>
                    </ul>
                  </div>
                  <div class="cont-button">
                    <div>
                      <el-button type="primary" class="timeButton" @click="resetAll">{{autoNo[2]}}</el-button>
                    </div>
                    <div>
                      <el-button type="primary" class="timeButton" @click="submitAll">{{autoNo[3]}}</el-button>
                    </div>
                  </div>
                </div>
              </transition>
            </div>
            <!-- 排序 -->
            <div class="sort" v-if="this.describeText !== ''"> <!--  style="display: none"  v-show="!isInfo" -->
              <div @click="allShow" class="el-dropdown-link" style="float: right;margin-right: -5px;"><span>{{ describeText }}</span>
              </div>
            </div>
            <!---->
            <div class="no-list" v-if="listInfo.length ==0">
              <v-noInfo></v-noInfo>
            </div>
            <div class="no-list" v-loading="loading" v-else>
              <v-list :data="listInfo"></v-list>
              <div class="vxa-flax-box foot-pagination align" v-if="page.total>1">
                <div class="col block t-left">
                  <el-pagination class="vxa-footer-page-pagination" @current-change="selectPage"
                                 layout="prev, pager, next"
                                 :current-page="page.index" :page-count="page.total"></el-pagination>
                </div>
                <div class="col t-right">
                  <el-radio-group class="vxa-footer-page-radio" size="mini" v-model="page.size"
                                  @change="handlePageChange">
                    <el-radio-button :label="30">30条</el-radio-button>
                    <el-radio-button :label="50">50条</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <!--广告-->
            <v-adv :pageName="'投关检索'" style="margin-top:15px;"></v-adv>
            <!--<el-card class="box-card" shadow="never" body-style="padding:0">
              &lt;!&ndash;<v-advertisement></v-advertisement>&ndash;&gt;
            </el-card>-->
            <!--提问公司排名-->
            <el-card class="box-card" shadow="never" body-style="padding:0 16px">
              <v-company-question-item></v-company-question-item>
            </el-card>
            <!--本月提问回答-->
            <el-card class="box-card" shadow="never" body-style="padding:0 16px">
              <v-company-answer-item></v-company-answer-item>
            </el-card>
            <!--本月提问最多投资者-->
            <el-card class="box-card" shadow="never" body-style="padding:0 16px">
              <v-investor-question-item></v-investor-question-item>
            </el-card>
            <br>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  import VCompanyAnswerItem from '@/view/investor/components/companyAnswerItem'
  import VCompanyQuestionItem from '@/view/investor/components/companyQuestionItem'
  import VInvestorQuestionItem from '@/view/investor/components/investorQuestionItem'
  //
  import VList from './components/list'
  import VPage from '@/components/customPage.vue'
  export default {
    mixins: [mixins],
    // 使用其它组件
    components: {
      VCompanyAnswerItem,
      VCompanyQuestionItem,
      VInvestorQuestionItem,
      VList,
      VPage
    },
    data() {
      return {
        hideAfter: 500,
        listInfo: [],
        loading: true,
        restaurants: [],
        state: '',
        timeout: null,
        inputCode: '', // user inpput code
        inputText: '', // user inpput affiche text
        gridData: [],  // code autocomplete
        gridText: [],  // affiche autocomplete
        sort: [
          {id: '0', name: '默认排序', isActive: true, up: true},
//          {id: '1', name: '阅读量', isActive: false, up: true},
          {id: '1', name: '提问日期', isActive: false, up: true}
        ],
        sortMethod: '默认排序',
        sortFlag: false,
        total: 50,
        showPanel: '', // isShow panel
        startDate: '1994-12-16',
        endDate: '2017-12-31',
        titleIncludes: '', // 标题必含关键字
        titleMaybeIncludes: '', // 标题可含关键字
        titleExcludes: '', // 标题不含关键字
        contentIncludes: '', // 全文必含关键字
        contentMaybeIncludes: '', // 全文可含关键字
        contentExcludes: '', // 全文不含关键字
        // 筛选区
        screenListList: ['全部', '适用范围', '所属行业', '提问日期', '回答状态'], // 筛选默认显示的title格式
        screenList: [
          {id: 0, name: [], title: '全部', class: 'all', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], title: '适用范围', class: '', type: 'market', isSelect: false, list: []},
          {id: 2, name: [], title: '所属行业', class: '', type: 'industry', isSelect: false, list: []},
          {id: 3, name: [], title: '提问日期', class: 'time', type: 'date', isSelect: false, list: []},
          {id: 4, name: [], title: '回答状态', class: 'status', type: 'status', isSelect: false, list: []}
        ],
        allMapping: [],
        boxContent: false,
        page: {
          index: 1,
          size: 30,
          total: 1000
        },
        //
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        indent: 23,
        data4: [
          {id: 1, label: '沪市主板'},
          {id: 2, label: '深市中小板'},
          {id: 3, label: '深市创业板'},
          {id: 4, label: '深市主板'}
        ],
        isStatus: 0,
        autoNo: ['换一个关键词吧！', '高级', '重置', '确认', '请输入法规名称，多关键词用空格隔开，如：上市', '请输入问题关键词，多关键词用空格隔开', '证券代码/简称', '搜索筛选条件'],
        activeName: '1',
        value1: '',
        value2: '',
        boxContentTi: true,
        isInfo: false, // 是否存在搜索结果
        monthDate: '',
        monthEnd: '',
        describeText: '',
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
        dateArr: [
          {id: 0, column: '今天', selectStatus: false},
          {id: 1, column: '昨天', selectStatus: false},
          {id: 2, column: '最近3天', selectStatus: false},
          {id: 3, column: '最近一周', selectStatus: false},
          {id: 4, column: '最近一月', selectStatus: false},
          {id: 5, column: '最近一年', selectStatus: false}
        ],
        userId: '',
        userInfo: {}
      }
    },
    // 方法
    computed: {},
    watch: {
      monthDate(val) {
        if (val == '' && this.monthEnd == '') {
          this.screenList[3].title = '提问日期'
        }
      },
      endDate(val) {
        for (var i in this.dateArr) {
          if (this.dateArr[i].selectStatus == true) {
            if (val !== this.$common.getBeforeDate('0')) {
              this.dateArr[i].selectStatus = false
            }
          }
        }
      },
      startDate(val) {
        // console.log('startDate = ', val, this.startDate)
        for (var i in this.dateArr) {
          if (this.dateArr[i].selectStatus == true) {
            console.log('现在筛选时间时间段显示的是 = ', i, val, this.$common.getBeforeDate(i))
            if (i < 3) {
              if (val !== this.$common.getBeforeDate(i)) {
                this.dateArr[i].selectStatus = false
              }
            } else if (i == 3) {
              if (val !== this.$common.getBeforeDate('6')) {
                this.dateArr[i].selectStatus = false
              }
            } else if (i == 4) {
              if (val !== this.$common.getBeforeDate('30')) {
                this.dateArr[i].selectStatus = false
              }
            } else if (i == 5) {
              if (val !== this.$common.getBeforeDate('365')) {
                this.dateArr[i].selectStatus = false
              }
            }
          }
        }
      },
      info() {
        this.describeText = ''
      },
      boxContent: function () {
        if (this.boxContent) {
        } else {
          this.screenList[0].isSelect = true
        }
        this.itemStyle()
      },
      filterText: function (val) {
        this.$refs.tree2.filter(val)
        if (val == '') {
          var k = '25%'
          var content = document.getElementsByClassName('xiaoan-box-content')[0]
          this.$nextTick(() => {
            if (this.isStatus == '3') {
              k = '20%'
              content.style.cssText = 'right:0;left:auto;width:auto;padding:0 20px;'
            } else if (this.isStatus == '1') {
              k = '50%'
              content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
            } else if (this.isStatus == '2') {
              k = '33%'
              content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
            } else {
              k = '50%'
            }
            var tree = document.getElementsByClassName('el-tree-node')
            for (var i = 0; i < tree.length; i++) {
              tree[i].style.display = 'inline-block'
              tree[i].style.width = k
            }
          })
        }
      },
      isStatus: function (val) {
        var button = document.getElementsByClassName('cont-button')[0]
        var date = document.getElementsByClassName('cont-containerDate')[0]
        var button1 = document.getElementsByClassName('timeButton')[0]
        var button2 = document.getElementsByClassName('timeButton')[1]
        if (val == '3') {
          date.style.cssText = 'float:left;width:70%;'
          button.style.cssText = 'float:left;width:30%;margin:0;'
          button1.style.cssText = 'width:90%;margin:20px 15px 20px 0;height:36px;line-height:36px;padding:0;font-size: 14px;'
          button2.style.cssText = 'width:90%;margin:20px 0;height:36px;line-height:36px;padding:0;font-size: 14px;'
        } else {
          date.style.cssText = 'display:none;'
          button.style.cssText = 'display: table;width:100%;margin-top: 15px;margin-bottom: 15px;'
          button1.style.cssText = 'width: 250px;height: 44px;font-size: 18px;line-height:1;padding:12px 20px;'
          button2.style.cssText = 'width: 250px;height: 44px;font-size: 18px;line-height:1;padding:12px 20px;'
        }
      },
      '$route': function (val) {
        // console.log('$route---watch', val.fullPath)
        if (val.fullPath == '/investor/search') {
          this.monthDate = this.$common.getBeforeDate(30)
          this.monthEnd = this.$common.getBeforeDate(0)
          this.monthDate = ''
          this.monthEnd = ''
        } else {
          this.monthDate = ''
          this.monthEnd = ''
        }
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
    },
    mounted() {
      this.preparation()
      this.itemStyle()
    },
    methods: {
      // 筛选处选择时间
      selectDate(index) {
        if (index == '0') {
          this.startDate = this.$common.getBeforeDate('0')
          this.endDate = this.$common.getBeforeDate('0')
        } else if (index == '1') {
          this.startDate = this.$common.getBeforeDate('1')
          this.endDate = this.$common.getBeforeDate('0')
        } else if (index == '2') {
          this.startDate = this.$common.getBeforeDate('2')
          this.endDate = this.$common.getBeforeDate('0')
        } else if (index == '3') {
          this.startDate = this.$common.getBeforeDate('6')
          this.endDate = this.$common.getBeforeDate('0')
        } else if (index == '4') {
          this.startDate = this.$common.getBeforeDate('30')
          this.endDate = this.$common.getBeforeDate('0')
        } else if (index == '5') {
          this.startDate = this.$common.getBeforeDate('365')
          this.endDate = this.$common.getBeforeDate('0')
        }
        this.dateArr.forEach((item) => {
          this.$set(item, 'selectStatus', false);
        })
        this.$set(this.dateArr[index], 'selectStatus', true);
      },
      allShow() {
        if (this.describeText == '全部显示') {
          this.describeText = '全部隐藏'
          for (var i = 0; i < this.info.length; i++) {
            this.info[i].isDescribe = true
          }
        } else {
          this.describeText = '全部显示'
          for (var j = 0; j < this.info.length; j++) {
            this.info[j].isDescribe = false
          }
        }
      },
      boxContClick() {
        this.boxContent = false
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
      },
      // 筛选项样式
      itemStyle() {
        var k = '25%'
        var content = document.getElementsByClassName('xiaoan-box-content')[0]
        if (this.isStatus == '3') {
          k = '20%'
          content.style.cssText = 'right:0;left:auto;width:auto;padding:0 20px;'
        } else if (this.isStatus == '1') {
          k = '50%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
        } else if (this.isStatus == '2') {
          k = '33%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 45px;'
        } else {
          k = '50%'
        }
        var tree = document.getElementsByClassName('el-tree-node')
        for (var i = 0; i < tree.length; i++) {
          tree[i].style.display = 'inline-block'
          tree[i].style.width = k
        }
      },
      // 选择排序
      selectSort(index) {
        for (let i in this.sort) {
          this.sort[i].isActive = false
        }
        this.sort[index].isActive = true
        this.sortMethod = this.sort[index].name
        this.searchList()
        console.log('排序方法', this.sort[index].name)
      },
      // 重置高级条件
      resetSenior() {
        this.startDate = ''
        this.endDate = ''
        this.titleIncludes = '' // 标题必含关键字
        this.titleMaybeIncludes = '' // 标题可含关键字
        this.titleExcludes = '' // 标题不含关键字
        this.contentIncludes = '' // 全文必含关键字
        this.contentMaybeIncludes = '' // 全文可含关键字
        this.contentExcludes = '' // 全文不含关键字
        this.inputCode = ''
        this.inputText = ''
      },
      // /  * 保存状态 */
      stateful() {
        this.screenList[1].list = this.$route.query.marketType == undefined ? [] : this.$route.query.marketType.split(',')
        this.screenList[2].list = this.$route.query.industry == undefined ? [] : this.$route.query.industry.split(',')
        this.titleIncludes = (this.$route.query.mustTitle == undefined || this.$route.query.mustTitle == '') ? '' : this.$common.transComma(this.$route.query.mustTitle)
        this.titleExcludes = (this.$route.query.exceptTitle == undefined || this.$route.query.exceptTitle == '') ? '' : this.$common.transComma(this.$route.query.exceptTitle)
        this.titleMaybeIncludes = (this.$route.query.possibleTitle == undefined || this.$route.query.possibleTitle == '') ? '' : this.$common.transComma(this.$route.query.possibleTitle)
        //
        this.contentIncludes = (this.$route.query.mustContent == undefined || this.$route.query.mustContent == '') ? '' : this.$common.transComma(this.$route.query.mustContent)
        this.contentExcludes = (this.$route.query.exceptContent == undefined || this.$route.query.exceptContent == '') ? '' : this.$common.transComma(this.$route.query.exceptContent)
        this.contentMaybeIncludes = (this.$route.query.possibleContent == undefined || this.$route.query.possibleContent == '') ? '' : this.$common.transComma(this.$route.query.possibleContent)
        //
        this.screenList[this.screenList.length - 1].list = (this.$route.query.isAnswer == '' || this.$route.query.isAnswer == undefined) ? [] : this.$route.query.isAnswer.split(',');
        this.page.index = (this.$route.query.pageNum == '' || this.$route.query.pageNum == undefined) ? 1 : Number(this.$route.query.pageNum)
        this.startDate = (this.$route.query.questionTimeStart == '' || this.$route.query.questionTimeStart == undefined) ? '' : this.$route.query.questionTimeStart
        this.endDate = (this.$route.query.questionTimeEnd == '' || this.$route.query.questionTimeEnd == undefined) ? '' : this.$route.query.questionTimeEnd
        this.code = (this.$route.query.companyCode == undefined || this.$route.query.companyCode == '') ? this.$route.query.companyCode : this.$route.query.companyCode
        this.inputText = this.titleIncludes;
        //
        // lert(this.page.index);
        let market = [], industry = [], isAnswer = [];
        console.log('------', this.startDate, this.endDate)
        this.allMapping[1].forEach((item, i) => {
          this.screenList[1].list.forEach((list, j) => {
            if (item.id == list) {
              market.push(item.label)
            }
          })
        });
        //
        this.allMapping[2].forEach((item, i) => {
          this.screenList[2].list.forEach((list, j) => {
            if (item.id == list) {
              industry.push(item.label)
            }
          })
        })
        this.allMapping[this.allMapping.length - 1].forEach((item, i) => {
          this.screenList[this.allMapping.length - 1].list.forEach((list, j) => {
            if (item.id == list) {
              isAnswer.push(item.label)
            }
          })
        });
        //
        if (this.startDate != '' || this.endDate != '') {
          //
          this.screenList[this.allMapping.length - 2].title = this.startDate + ' ' + this.endDate
        }
        //
        if (market.length != 0) {
          this.screenList[1].title = market.toString()
        }
        //
        if (industry.length != 0) {
          this.screenList[2].title = industry.toString()
        }
        if (isAnswer.length != 0) {
          this.screenList[this.allMapping.length - 1].title = isAnswer.toString()
        }
        console.log('====', this.screenList[1])
        //
        this.inputCode = this.code
        this.searchList()
      },
      // 点击确认筛选
      submitAll() {
        this.page.index = 1
        let newObject = this.screenList[this.isStatus];
        let newIndex = this.screenListList[this.isStatus];
        let name = []
        // 当前的object
        this.screenList.forEach((item) => {
          this.$set(item, 'isSelect', false)
        });
        //
        if (newObject.name.length !== 0) {
          name = newObject.name.map(item => {
            return item.label
          });
          this.$set(this.screenList[this.isStatus], 'title', name.join('，'))
        } else {
          //
          if (newIndex.indexOf('提问日期') > -1) {
            // console.log('this.startDate + \'\' + this.endDate', this.startDate + '-' + this.endDate);
            if (!this.startDate && !this.endDate) {
              this.$set(this.screenList[this.isStatus], 'title', '提问日期')
            } else {
              this.$set(this.screenList[this.isStatus], 'title', this.startDate + '-' + this.endDate)
            }
          } else {
            this.$set(this.screenList[this.isStatus], 'title', newIndex);
          }
        }

        this.boxContent = false;
        // 用户状态保存
        this.synchronizationRouter()
        this.searchList()
      },
      // 重置筛选项
      resetAll() {
        this.screenList[this.isStatus].list.forEach((item) => {
          this.$refs.tree2.setChecked(item, false, false)
        })
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
        if (this.screenList[this.isStatus].type == 'date') {
          this.endDate = ''
          this.startDate = ''
        }
      },
      //
      synchronizationRouter() {
        this.$router.push({
          path: '/investor/search', query: {
            mustTitle: this.$common.transStr(this.inputText), // this.titleIncludes,
            possibleTitle: this.$common.transStr(this.titleMaybeIncludes),
            exceptTitle: this.$common.transStr(this.titleExcludes),
            mustContent: this.$common.transStr(this.contentIncludes),
            possibleContent: this.$common.transStr(this.contentMaybeIncludes),
            exceptContent: this.$common.transStr(this.contentExcludes),
            questionTimeStart: this.startDate, // 起始时间
            questionTimeEnd: this.endDate, // 结束时间
            isAnswer: this.screenList[this.screenList.length - 1].list.toString(), // 是否回答
            marketType: this.screenList[1].list.toString(), // 板块
            industry: this.screenList[2].list.toString(), // 所属行业
            companyCode: this.inputCode.toString(), // code
            pageNum: this.page.index, // 页数
            pageSize: this.page.size // 每页条数
          }
        })
      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      currentChange(data, el) {
        console.log(32143543, data);
        console.log(321, el);
        console.log(321, this.screenList[this.isStatus]);
        if (this.screenList[this.isStatus].type == 'status') {
          this.$refs.tree2.setChecked(data.id, true, false);
          //
          if (this.screenList[this.isStatus].list.length > 1) {
            this.resetAll();
            this.$refs.tree2.setChecked(data.id, true, false);
          }
        }
      },
      // 选择筛选条件
      handleNodeClick(data) {
        console.log(data, this.screenList[this.isStatus].type);
        if (this.screenList[this.isStatus].type == 'status') {
          this.$refs.tree2.setChecked(data.id, true, false)
          if (this.screenList[this.isStatus].list.length > 0) {
            this.resetAll();
            for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
              if (this.screenList[this.isStatus].list[i] == data.id) {
                this.$refs.tree2.setChecked(data.id, false, false)
              }
            }
          }
        } else {
          if (data.children == undefined) {
            this.$refs.tree2.setChecked(data.id, true, false)
            for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
              if (this.screenList[this.isStatus].list[i] == data.id) {
                this.$refs.tree2.setChecked(data.id, false, false)
              }
            }
          }
        }
      },
      //
      handleCheckChange() {
        this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
        this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
        // console.log('sdf', this.screenList[this.isStatus].name)
      },
      // 获取筛选的类
      preparation() {
        let data = [], data1 = []
        this.$http({
          method: 'GET',
          url: this.$api.investor.conditions,
          params: {}
        }).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let content = res.data.returnObject;
            var market = content.market;
            var industry = content.industry;
            data1 = market.map(e => {
              return {id: e, label: e}
            });
            //
            data = industry.map((e) => {
              return {id: e, label: e}
            });
            //
            let isAnswer = [
              {id: '2', label: '全部'},
              {id: '1', label: '已回答'},
              {id: '0', label: '未回答'}
            ];
            //
            this.allMapping = [[], data1, data, [], isAnswer];
            console.log('allMapping = ', this.allMapping)
            this.stateful()
          }
        }).catch((err) => {
          console.log(err)
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 选择筛选模块
      screenIsActive(index) {
        this.isStatus = index;
        this.filterText = '';
        // console.log(index, '选择筛选模块', this.screenList[index].list, this.screenList);
        this.screenList.forEach((item, i) => {
          if (item.title == '适用范围' || item.title == '所属行业') {
            item.list = []
            item.name = []
          }
          if (item.title == '提问日期') {
            this.dateArr.forEach((b) => {
              this.$set(b, 'selectStatus', false)
            })
          }
          if (i != index) {
            this.$set(item, 'isSelect', false);
          }
        });
        //
        this.$refs.tree2.setCheckedKeys(this.screenList[index].list, false);
        console.log('32434', this.screenList[index]);
        this.boxContentTi = true
        //
        if (index == 0) {
          // 点击了全部
          this.boxContent = false
          this.screenList.forEach((item, index) => {
            item.list = []
            item.name = []
            item.title = this.screenListList[index];
          });
          this.submitAll()
        } else {
          // 其他
          if (this.screenList[index].type == 'date') {
            this.boxContentTi = false
          }
          this.data4 = this.allMapping[index];
          if (this.screenList[index].isSelect) {
            this.screenList[index].isSelect = false
            this.boxContent = false
          } else {
            this.screenList[index].isSelect = true
            this.boxContent = true
          }
        }
        this.$nextTick(() => {
          this.itemStyle()
        })
        console.log('this.screenList[this.isStatus]', this.screenList)
      },
      // 选择页数
      selectPage(e) {
        this.page.index = e;
        this.loading = true;
        this.synchronizationRouter();
        this.$common.returnTop();
        // 通过监听来切换数据
        if (this.$route.fullPath == '/investor/search') {
          this.submitAll()
        } else {
          this.searchList()
        }
      },
      handlePageChange() {
        this.loading = true;
        this.synchronizationRouter();
        // 通过监听来切换数据
        if (this.$route.fullPath == '/investor/search') {
          this.submitAll()
        } else {
          this.searchList()
        }
      },
      // 打开高级搜索
      seniorMethod() {
        this.tipShow.forEach((item, index) => {
          this.$set(this.tipShow, index, false)
        })
        this.showPanel ? this.showPanel = false : this.showPanel = true
        this.boxContClick()
      },
      // 获取我关注的公司代码
      getMyAttentionCodes() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.stock.getMyAttentions,
            params: {
              userId: this.userId,
              pageNum: 1,
              pageSize: 1000
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              resolve(res.data.returnObject.map(e => e.obj));
            }
            resolve([]);
          }).catch(reject);
        });
      },
      // 可比公司
      getCompanyCompare() {
        return new Promise((resolve, reject) => {
          this.$http({
            method: "GET",
            url: this.$api.enterpriseCompany.getCompanyCompare,
            params: {
              companyId: this.userInfo.companyId,
              pageNum: 1,
              pageSize: 1000
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              resolve(res.data.returnObject.map(e => e.code));
            }
            resolve([])
          }).catch(reject);
        });
      },
      // 搜索方法
      searchList() {
        this.inputCode = this.inputCode ? this.inputCode : ''
        if (this.inputCode == '本公司') {
          if (this.userInfo.enterpriseUser) {
            this.handlerSearchList(this.userInfo.enterpriseCompanyCode)
          } else if (this.userInfo.companyCode) {
            this.handlerSearchList(this.userInfo.companyCode)
          } else if (!this.userInfo.companyCode) {
            this.handlerSearchList('本公司')
          }
        } else if (this.inputCode == '关注公司') {
          this.getMyAttentionCodes().then(codes => {
            if (codes.length > 0) {
              this.handlerSearchList(codes.join(',').replace(/[a-zA-Z]/g, ''))
            } else {
              this.isInfo = true
              this.loading = false
            }
          }).catch(err => {
            this.isInfo = true
            this.loading = false
          })
        } else if (this.inputCode == '可比公司') {
          this.getCompanyCompare().then(codes => {
            this.handlerSearchList(codes.join(',').replace(/[a-zA-Z]/g, ''))
          }).catch(err => {
            this.isInfo = true
            this.loading = false
          })
        } else if (!/^\d{1,6}$/.test(this.inputCode)) {
          this.$http({
            methods: 'GET',
            url: this.$api.affiche.autoCompleteA,
            params: {
              key: this.inputCode
            }
          }).then((res) => {
            console.log('loadCode', res)
            let searchInputCode = this.inputCode
            if (res.data.returnCode == 1) {
              this.gridData = res.data.returnObject
              if (this.gridData.length === 1) {
                if (this.inputCode === this.gridData[0].name) {
                  searchInputCode = this.gridData[0].code
                }
              }
            }
            this.handlerSearchList(searchInputCode)
          }).catch((err) => {
            this.handlerSearchList(this.inputCode)
          })
        } else {
          this.handlerSearchList(this.inputCode)
        }
      },
      //
      handlerSearchList(searchInputCode) {
        this.inputText = this.inputText ? this.inputText : ''
        this.inputCode = this.inputCode ? this.inputCode : ''
        this.startDate = this.startDate ? this.startDate : ''
        this.endDate = this.endDate ? this.endDate : ''
        var dateStart = '', dateEnd = ''
        if (this.$route.fullPath !== '/investor/search') {
          if (this.inputCode == '' && this.inputText == '' && this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '' && this.startDate == '' && this.endDate == '') {
            dateStart = this.startDate
            dateEnd = this.endDate
            this.sortType = '提问日期'
          } else {
            dateStart = this.startDate
            dateEnd = this.endDate
          }
        } else {
          dateStart = this.monthDate
          dateEnd = this.monthEnd
        }
        if (dateStart !== '') {
          dateStart = new Date(dateStart + ' 00:00:00').getTime()
        }
        if (dateEnd !== '') {
          dateEnd = new Date(dateEnd + ' 00:00:00').getTime()
        }
        let isAnswer = '';
        if (this.screenList[this.screenList.length - 1].list.length > 0) {
          switch (this.screenList[this.screenList.length - 1].list.toString()) {
            case '2':
              isAnswer = '';
              break;
            case '1':
              isAnswer = true;
              break;
            case '0':
              isAnswer = false;
              break;
          }
        }
        console.log('this.screenList', this.screenList[this.screenList.length - 1].list.toString());
        // //
        // //
        this.$http({
          methods: 'GET',
          url: this.$api.investor.search,
          params: {
            mustTitle: this.$common.transStr(this.inputText), // this.titleIncludes,
            possibleTitle: this.$common.transStr(this.titleMaybeIncludes),
            exceptTitle: this.$common.transStr(this.titleExcludes),
            mustContent: this.$common.transStr(this.contentIncludes),
            possibleContent: this.$common.transStr(this.contentMaybeIncludes),
            exceptContent: this.$common.transStr(this.contentExcludes),
            questionTimeStart: dateStart,
            questionTimeEnd: dateEnd,
            isAnswer: isAnswer, // 是否回答
            marketType: this.screenList[1].list.toString(), // 板块
            industry: this.screenList[2].list.toString(), // 所属行业
            companyCode: this.$common.transStr(searchInputCode), // code
            pageNum: this.page.index, // 页数
            pageSize: this.page.size // 每页条数
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page.total = Math.ceil(res.data.returnObject.count / this.page.size)
            // total数量超过1000条 控制显示
            if (this.page.total > 1000) {
              this.page.total = 1000
            }
            // 没有搜索结果
            if (this.page.total == 0) {
              this.isInfo = true
              this.listInfo = []
            } else {
              this.isInfo = false;
              var arrList = res.data.returnObject.list;
              this.listInfo = [];
              var reg = /\s/g
              var content = '';
              arrList.forEach((item, i) => {
                content = '';// 每次循环都 重置 变量
                var strs = '', obj = {}, link = '', img = '';
                if (item.answer) {
                  content = item.answer.replace(reg, '')
                }
                // console.log(i, content);
                let highColorTitle = this.inputText + ' ' + this.titleMaybeIncludes + ' ' + this.contentIncludes + ' ' + this.contentMaybeIncludes
                let highColorContent = this.contentIncludes + ' ' + this.contentMaybeIncludes
                if (this.$common.browserSort() != 'Chrome') {
                  // 兼容 非chrome浏览器 只显示2行
                  strs = this.$common.key(highColorContent, content)
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                } else {
                  strs = this.$common.key(highColorContent, content)
                }
                link = '/investor/answer?id=' + item.id;
                img = 'http://oss.in-hope.cn/enterpriseApply/cd27274ef95c489687413e81fb1d51b2.png?' + Math.random();
                obj = {
                  id: item.id,
                  userName: item.userName,
                  userImage: item.userImage,
                  companyName: item.companyName,
                  companyCode: item.companyCode,
                  question: this.$common.key(highColorTitle, item.question),
                  questionTime: item.questionTime,
                  questionSource: item.questionSource,
                  answer: strs,
                  answerTime: item.answerTime,
                  answerSource: item.answerSource,
                  marketType: item.marketType,
                  industry: item.industry,
                  userId: item.userId,
                  isIndex: item.isIndex,
                  isAnswer: item.isAnswer,
                  link: link,
                  img: img
                };
                this.listInfo.push(obj)
              })
            }
          } else {
            this.listInfo = [];
          }
        }).catch((err) => {
          setTimeout(() => {
            this.listInfo = [];
            this.loading = false;
          }, 3000)
          this.$message({
            showClose: true,
            type: 'error',
            duration: 3000,
            message: err.message
          })
        })
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
          this.$set(this.tipShow, 1, true)
          return false
        } else {
          this.$set(this.tipShow, 0, false)
          this.$set(this.tipShow, 1, false)
        }
        /* if (this.checkWordSearch(this.titleIncludes)) {
          this.$set(this.tipShow, 1, true)
          return false
        } else {
          this.$set(this.tipShow, 1, false)
        } */
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
        this.endDate = this.endDate ? this.endDate : ''
        if (this.contentIncludes.length == 1 || this.titleExcludes.length == 1 || this.titleMaybeIncludes.length == 1 || this.inputText.length == 1 || this.contentMaybeIncludes.length == 1 || this.contentExcludes.length == 1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'})
        } else {
          this.submitAll()
        }
      },
      // autocomplete click
      selectCode(e) {
        this.inputCode = this.gridData[e].code
      },
      // autocomplete affiche click
      selectText(e) {
        this.inputText = this.gridText[e]
      },
      //
      inputFocus() {
        this.boxContClick()
      },
      // 公司代码 autocomplete
      loadCode() {
        this.boxContClick()
        this.inputCode = this.inputCode ? this.inputCode : ''
        console.log('key', this.inputCode)
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.autoCompleteA,
          params: {
            key: this.inputCode
          }
        }).then((res) => {
          console.log('loadCode', res)
          if (res.data.returnCode == 1) {
            this.gridData = res.data.returnObject
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            type: 'success',
            duration: 3000,
            message: err.message
          })
        })
      },
      // 公告名称 autocomplete
      loadText() {
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.hotSearch
        }).then((res) => {
          console.log('loadCode', res.data)
          // if (res.data.returnCode == 1) {
          this.gridText = res.data
          // }
        }).catch((err) => {
          console.log(err)
          this.$message({
            showClose: true,
            type: 'success',
            duration: 3000,
            message: err.message
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .screen-tooltip-affiche {
    padding: 5px;
    border-radius: 2px;
    margin-top: 5px !important;
    color: #8d8d8d !important;
    border: 1px solid #e3e3e3 !important;
    box-shadow: 0 1px 1px #f0f1f3 !important;
    span {
      font-size: 14px;
    }
    .popper__arrow, .popper__arrow:after {
      display: none;
      border: 0;
    }
  }
  .contentShadow {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0);
  }
  .inputCode {
    /*top: 135px !important;*/
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
  .inputText {
    padding: 0 10px;
    width: 730px !important;
    box-sizing: border-box;
    /*top: 135px !important;*/
    border-radius: 4px !important;
    ul {
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
          background: #f8ecde;
          color: #fff;
        }
      }
    }
  }
</style>

<style lang="scss">
  #investor-search {
    width: 100%;
    height: auto;
    background: #fff;
    .container {
      .box-card {
        margin-bottom: 15px;
      }
    }
    .search-header {
      width: 100%;
      height: auto;
      position: relative;
      background-size: cover;
      padding: 36px 0;
      overflow: hidden;
      .search {
        width: 1200px;
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
          height: 44px;
          &.searchAuto {
            .codeBox {
              margin-bottom: 16px;
            }
          }
          .codeBox {
            width: 100%;
            height: 44px;
            border-radius: 4px;
            -moz-box-shadow: 0px 0px 2px #FFB148;
            -webkit-box-shadow: 0px 0px 2px #FFB148;
            box-shadow: 0px 0px 2px #FFB148;
            /*overflow: hidden;*/
            input {
              width: 100%;
              height: 44px;
              border: 0;
              font-size: 20px;
              line-height: 44px;
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
                  height: 44px;
                  border: 0;
                  font-size: 20px;
                  line-height: 44px;
                }
              }
            }
          }
        }
        .searchText {
          float: left;
          width: 730px !important;
          height: 44px;
          margin-left: 20px;
          border-top-right-radius: 0px;
          border-bottom-right-radius: 0px;

          .el-autocomplete {
            width: 100%;
            height: 44px;
          }
          .seniorShow {
            animation: contentShow 1s forwards;
            -moz-animation: contentShow 1s forwards;
            -webkit-animation: contentShow 1s forwards;
            -o-animation: contentShow 1s forwards;
          }
          .seniorShow:last-child {
            margin-left: 20px;
            animation: titleShow 1s forwards;
            -moz-animation: titleShow 1s forwards;
            -webkit-animation: titleShow 1s forwards;
            -o-animation: titleShow 1s forwards;
          }
        }
        .searchButton {
          width: 125px;
          height: 44px;
          background: #ffb148;
          float: right;
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
            background: rgba(255, 177, 72, 0.72);
          }
        }
        .searchSenior {
          float: right;
          margin-left: 20px;
          .seniorButton {
            width: 125px;
            height: 44px;
            background: #f6debd;
            color: #ffb148;
            font-size: 18px;
            &:active {
              background: #f9e9d5;
            }
            .searchSanjiao {
              margin-left: 10px;
            }
            .web-sanjiaoxing:before {
              font-size: 14px !important;
            }
            .el-icon-arrow-down:before {
              content: "\E60B"
            }
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
            height: 44px;
            display: table;
            margin-bottom: 16px;
            border-radius: 4px;
            -moz-box-shadow: 0px 0px 2px #FFB148;
            -webkit-box-shadow: 0px 0px 2px #FFB148;
            box-shadow: 0px 0px 2px #FFB148;
            overflow: hidden;
            span, input {
              width: 45px;
              display: table-cell;
              height: 44px;
              /*line-height: 44px;*/
              vertical-align: middle;
              text-align: center;
              font-size: 16px;
              color: #636363;
            }
            .el-input {
              display: table;
            }
            span {
              background: #ffc87f;
            }
            input {
              width: 135px;
              border: 0;
              border-radius: 0;
            }
            .el-date-editor.el-input, .el-date-editor.el-input__inner {
              width: 100%;
              .el-input__prefix, .el-input__suffix {
                display: none;
              }
              input {
                width: 100%;
                padding: 0 0 0 15px;
              }
            }
          }
        }
        .seniorPanel-2, .seniorPanel-3 {
          width: 345px;
          margin-left: 20px;
          .mustTitle, .mustContent {
            width: 345px;
            span {
              width: 68px;
            }
            input {
              width: 277px;
            }
          }
        }
        .seniorPanelA {
          animation: dateShow 1s forwards;
          -moz-animation: dateShow 1s forwards;
          -webkit-animation: dateShow 1s forwards;
          -o-animation: dateShow 1s forwards;
        }
        .seniorReset {
          color: #ffb148;
          font-size: 18px;
          font-weight: bold;
          margin-right: 29px;
          margin-top: 30px;
          float: right;
          cursor: pointer;
          user-select: none;
          -moz-user-select: none;
          -webkit-user-select: none;
        }
        .seniorResetA {
          animation: seniorResetA 1s forwards;
          -moz-animation: seniorResetA 1s forwards;
          -webkit-animation: seniorResetA 1s forwards;
          -o-animation: seniorResetA 1s forwards;
        }
      }
      .searchAuto {
        animation: searchAuto 1s forwards;
        -moz-animation: searchAuto 1s forwards;
        -webkit-animation: searchAuto 1s forwards;
        -o-animation: searchAuto 1s forwards;
      }
      .searchHeight {
        animation: searchHeight 1s forwards;
        -moz-animation: searchHeight 1s forwards;
        -webkit-animation: searchHeight 1s forwards;
        -o-animation: searchHeight 1s forwards;
      }
    }
    .screen {
      width: 100%;
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
        top: 49px;
        left: 0;
        background: #ffffff;
        z-index: 120;
        padding: 0 45px;
        border: 1px solid #e3e3e3;
        border-top: 0;
        box-shadow: 0 1px 1px #e3e3e3;
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
                .el-input__prefix, .el-input__suffix {
                  display: none;
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
            margin-top: 35px;
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
        height: 50px;
        display: flex;
        align-items: center;
        vertical-align: middle;
        border: none;
        position: relative;
        z-index: 199;
        li {
          flex: 1;
          // margin-right: 30px;
          // display: table-cell;
          text-align: center;
          vertical-align: middle;
          box-sizing: border-box;
          border: none;
          // width: 20.5%;
          font-size: 0;
          &:last-child {
            flex: 0 0 15%;
            text-align: right;
            // margin-right: 0;
          }
          &:first-child {
            flex: 0 0 10%;
            border-bottom-color: #e3e3e3;
            text-align: left;
            border-right: 0;
            border-left: 1px solid #fff;
            .isActive {
              color: #FFAC38;
              box-sizing: border-box;
              height: 46px;
              padding-top: 8px;
              margin-top: 3px;
              padding-right: 20px;
              text-align: left;
              border: 1px solid #fff;
              border-bottom: 1px solid #e3e3e3;
              -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
            }
          }
          div {
            box-sizing: border-box;
            height: 46px;
            padding-top: 8px;
            margin-top: 3px;
            border: 1px solid #fff;
            border-bottom: 1px solid #e3e3e3;
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
          div:hover {
            color: #FFAC38;
            span {
              color: #FFAC38;
            }
          }
          .isActive {
            box-sizing: border-box;
            height: 46px;
            padding-top: 8px;
            margin-top: 3px;
            text-align: center;
            border: 1px solid #e3e3e3;
            border-bottom: 1px solid #fff;
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
      }
    }
    .no-list {
      position: relative;
      min-height: 800px;
      width: 100%;
    }
    .sort {
      width: 1200px;
      height: 40px;
      border-radius: 4px;
      background: #f6f6f6;
      margin: 15px auto;
      cursor: pointer;
      line-height: 20px;
      padding: 0 18px;
      box-sizing: border-box;
      user-select: none;
      -moz-user-select: none;
      -webkit-user-select: none;
      font-size: 13px;
      color: #8d8d8d;
      .flip {
        line-height: 40px;
      }
      div {
        display: inline-block;
        i {
          display: inline-block;
          transition: transform .3s, -webkit-transform .3s;
          transform: rotate(0deg);
          line-height: 20px;
          margin-left: 8px;
          color: #a6a6a6;
        }
        .web-sanjiaoxing:before {
          font-size: 5px !important;
          display: block;
          transform: scale(0.7, 0.7);
        }
        .el-icon-arrow-down:before {
          content: '\E60B'
        }
        .up {
          transition: transform .3s, -webkit-transform .3s;
          transform: rotate(180deg);
        }
        .hide {
          opacity: 0;
        }
      }
      .el-dropdown-link {
        margin-right: 95px;
      }
    }
    @import "../../../static/css/animate";
  }
</style>
