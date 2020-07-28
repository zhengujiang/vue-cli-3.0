<template>
  <div id="cases" v-loading.fullscreen.lock="loading">
    <!-- search area -->
    <div class="header vxa-image-bg-affiche">
      <div class="search" :class="{ searchAuto:showPanel,searchHeight:!showPanel&&showPanel!=='' }">
        <div class="searchCode" :class="{ searchAuto:showPanel }">
          <div class="codeBox">
            <el-popover ref="popoverCases" placement="bottom" width="180" trigger="focus" popper-class="inputCode"
                        :popper-options="{boundariesElement: 'body'}" v-on:click="selectCode">
              <ul>
                <li v-for="(list,index) in gridData" :key="index" @click="selectCode(index)">
                  <span v-html="$common.highlight(inputCode,list.code)"></span>
                  <span>{{ list.name }}</span>
                </li>
              </ul>
              <el-input type="text" slot="reference" :placeholder="autoNo[6]" @focus="loadCode" @input="loadCode"
                        v-model="inputCode" @keyup.13.native="searchMethod"></el-input>
            </el-popover>
            <v-safeWordTip v-show="tipShow[7]" style="position: absolute"></v-safeWordTip>
          </div>
          <!-- 高级搜索panel -->
          <div class="seniorPanel" :class="{ seniorPanelA:showPanel}" v-show="showPanel">
            <div class="start">
              <span>自</span>
              <el-date-picker v-model="startDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                              :editable="false" :picker-options="pickerOptions1">
              </el-date-picker> <!-- :default-value="this.$common.getNowDate()" -->
            </div>
            <div class="end">
              <span>到</span>
              <el-date-picker v-model="startEnd" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"
                              :editable="false" :picker-options="pickerOptions2">
              </el-date-picker>  <!-- :default-value="this.$common.getNowDate()" -->
            </div>
          </div>
        </div>
        <div class="searchText" :class="{ searchAuto:showPanel}">
          <div class="codeBox" v-show="!showPanel">
            <el-popover ref="popover3searchText" placement="bottom" width="700" trigger="click"
                        popper-class="popover-inputText inputText" @click="selectText" v-model="inputTextPop">
              <ul>
                <li v-for="(list,index) in gridText" :key="index" @click="selectText(index)">
                  <span v-html="$common.highlight(inputText,list.title)"></span>
                  <!-- $common.highlight(inputText,list.title) -->
                </li>
              </ul>
              <el-input slot="reference" type="text" @focus="loadText" @input="loadText" :placeholder="autoNo[5]"
                        v-model="inputText" @keyup.13.native="searchMethod"></el-input>
            </el-popover>
            <v-safeWordTip v-show="tipShow[0]"></v-safeWordTip>
          </div>
          <!-- 高级搜索panel -->
          <div class="seniorPanel-2" :class="{seniorShow:showPanel}" v-show="showPanel">
            <div class="mustTitle">
              <span>标题</span>
              <el-input v-model="titleIncludes" placeholder="匹配全部关键字" @keyup.enter.native="searchMethod"></el-input>
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
          <el-button type="primary" class="seniorButton" @click="seniorMethod" v-if="!showPanel">
            高级<i class="icon iconfont web-sanjiaoxing searchSanjiao"></i>
          </el-button>
          <el-button type="primary" class="seniorButton" @click="seniorMethod" v-else>
            默认<i class="icon iconfont web-sanjiaoxing searchSanjiao"></i>
          </el-button>
        </div>
        <el-button class="searchButton" @click="searchMethod" :class="{buttonFlag:showPanel}">
          <i class="el-icon-search"></i>
        </el-button>
        <div class="seniorReset" :class="{ seniorResetA:showPanel }" v-show="showPanel" @click="resetSenior(1)">
          <span style="margin-right: 4px;font-weight: normal">重置</span>
          <i class="icon iconfont web-huanyipi2" style="font-weight: 600"></i>
        </div>
      </div>
    </div>
    <!-- container -->
    <div class="container">
      <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
      <div class="content">
        <!-- 筛选 -->
        <div class="screen" style="margin-bottom: 20px;">
          <!-- 筛选模块 -->
          <ul class="screen-box">
            <li v-for="(list,index) in screenList" :key="index" @click="screenIsActive(index)">
              <div :class="{isActive: list.isSelect}">
                <el-tooltip content="Bottom center" placement="bottom" effect="light" popper-class="screen-tooltip-case"
                            visible-arrow="false" :open-delay="hideAfter">
                  <span>{{$common.number(list.title, '5')}}</span>
                  <span slot="content">{{list.title}}</span>
                </el-tooltip>
                <i class="icon iconfont web-sanjiaoxing arrowColor" v-if="index !== 0"></i>
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
                  <el-tree
                    class="filter-tree"
                    :data="data4"
                    :props="props1"
                    :filter-node-method="filterNode"
                    :default-checked-keys="defaultCheckedKeys"
                    node-key="id"
                    accordion show-checkbox
                    ref="tree2"
                    expand-on-click-node
                    @node-click="handleNodeClick"
                    @check-change="handleCheckChange"
                    highlight-current :indent="indent">
                  </el-tree>
                </div>
              </div>
              <!-- 确认or重置 -->
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
        <div class="sort" v-show="!isInfo" @click="boxContClick" v-if="showSort">
          <!-- 排序 -->
          <div class="el-dropdown-link" v-for="(list,index) in sort" :key="index" @click="selectSort(index)">
            <span>{{ list.name }}</span>
            <i class="icon iconfont web-sanjiaoxing" :class="{ up:list.up, hide: !list.isActive }"></i>
          </div>
          <totalNum :totalNum="totalNum"></totalNum>
          <div @click="allShow" class="el-dropdown-link" style="float: right;margin-right: -5px;"
               v-if="describeText !== ''">
            <span>{{ describeText }}</span>
          </div>
        </div>
        <!-- list -->
        <!-- <v-list :info="this.info" :noInfo="this.isInfo" sort="caseDetail" @seniorButton="seniorMethod"
                :inputCode="inputCode"
                :loading='this.loading'></v-list> -->
        <!-- <div class="no-list" v-if="info.length == 0">
          <v-noInfo></v-noInfo>
        </div> -->
        <div>
          <div class="no-list" id="noInfo" v-if="info.length == 0">
            <!-- <v-noInfo></v-noInfo> -->
            <img :src="$image.prompt.noInfo" alt="" class="defaultImg">
            <template v-if="inputCode == '本公司' && userId && !companyCode">
              <p>暂无内容,你还未设置公司信息。</p>
              <el-button @click="$router.push('/manage/person')">去设置</el-button>
            </template>
            <template v-else-if="inputCode == '关注公司'">
              <p>暂无内容</p>
              <el-button @click="$router.push('/follow/companies')">关注公司</el-button>
            </template>
            <template v-else-if="inputCode == '可比公司'">
              <p>暂无内容</p>
              <el-button @click="$router.push('/admin/application/compare')" v-if="isRootUser">设置可比公司</el-button>
              <p v-else style="top:300px;">等待管理员设置同行业</p>
            </template>
            <template v-else>
              <p v-if="sort !== 'reportDetail'">搜索不到相关内容，试试别的关键字或使用高级搜索吧！</p>
              <p v-else-if="sort == 'reportDetail'">搜索不到相关内容，试试别的关键字吧!</p>
              <el-button @click="seniorMethod" v-if="sort !== 'reportDetail'">高级搜索</el-button>
            </template>
          </div>
          <div class="no-list" v-else>
            <v-list :data="info"></v-list>
            <div class="vxa-flax-box align foot-pagination" v-if="total>1">
              <div class="col row t-left block">
                <el-pagination class="vxa-footer-page-pagination" @current-change="selectPage"
                               layout="prev, pager, next"
                               :current-page="flip" :page-count="total">
                </el-pagination>
              </div>
              <div class="row col t-right">
                <el-radio-group class="vxa-footer-page-radio" size="mini" v-model="page.size"
                                @change="handlePageChange">
                  <el-radio-button :label="30">30条</el-radio-button>
                  <el-radio-button :label="50">50条</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="pagination" v-show="!isInfo">
      <div class="block" style="width: 100%">
        <el-pagination
          @current-change="selectPage"
          layout="prev, pager, next"
          :current-page="flip"
          :page-count="total">
        </el-pagination>
      </div>
    </div> -->
    <v-regulatorDialog :regulatorDialog="regulatorDialog"></v-regulatorDialog>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  import list from './components/list.vue'
  import page from '@/components/customPage.vue'
  import totalNum from '@/components/totalNum.vue'

  export default {
    mixins: [mixins],
    data() {
      return {
        defaultCheckedKeys: [],
        page: {
          index: 1,
          size: 30,
          total: 1000
        },
        hideAfter: 500,  // hover 筛选框的预提示
        info: [
          // {
          //   title: '业绩快报与实际财务数据差异较大收到深交所监管函',
          //   describe: '案情简介：2016年10月31日，纳思达（002180）披露2016年第三季度报告，预计2016年度归属于上市公司股东的净利润案情简介：2016年10月31日，纳思达（002180）披露2016年第三季度报告，预计2016年度归属于上市公司股东的净利润案情简介：2016年10月31日，纳思达（002180）披露2016年第三季度报告，预计2016年度归属于上市公司股东的净利润案情简介：2016年10月31日，纳思达（002180）披露2016年第三季度报告，预计2016年度归属于上市公司股东的净利润',
          //   issued: '',
          //   date: '2017年11月1日',
          //   timeliness: '',
          //   isDescribe: false,
          //   plate: ['深市中小板']
          // }
        ],
        loading: true,
        restaurants: [],
        state: '',
        timeout: null,
        inputCode: '', // user inpput code
        inputText: '', // user inpput affiche text
        inputTextPop: false,
        gridData: [],  // code autocomplete
        gridText: [],  // affiche autocomplete
        sort: [
          {id: '0', name: '默认排序', isActive: true, up: true},
          // {id: '1', name: '阅读量', isActive: false, up: true},
          {id: '1', name: '发布日期', isActive: false, up: true}
        ],
        sortMethod: '',
        sortFlag: false,
        flip: 1,
        total: 50,
        showPanel: '', // isShow panel
        startDate: '',
        startEnd: '',
        titleIncludes: '', // 标题必含关键字
        titleMaybeIncludes: '', // 标题可含关键字
        titleExcludes: '', // 标题不含关键字
        contentIncludes: '', // 全文必含关键字
        contentMaybeIncludes: '', // 全文可含关键字
        contentExcludes: '', // 全文不含关键字
        // 筛选区
        screenListList: ['全部', '违规类型', '适用范围', '所属行业', '所属地区', '监管机构', '监管类型', '涉及对象', '申辩情况'], // 筛选默认显示的title格式
        screenList: [
          {id: 0, name: [], title: '全部', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], title: '违规类型', type: 'case', isSelect: false, list: []},
          {id: 2, name: [], title: '适用范围', type: 'market', isSelect: false, list: []},
          {id: 3, name: [], title: '所属行业', type: 'industry', isSelect: false, list: []},
          {id: 4, name: [], title: '所属地区', type: 'area', isSelect: false, list: []},
          {id: 5, name: [], title: '监管机构', type: 'supervise', isSelect: false, list: []},
          {id: 6, name: [], title: '监管类型', type: 'supervisionType', isSelect: false, list: []},
          {id: 7, name: [], title: '涉及对象', type: 'object', isSelect: false, list: []},
          {id: 8, name: [], title: '申辩情况', type: 'Situation', isSelect: false, list: []}
        ],
        allMapping: [],
        boxContent: false,
        filterText: '',
        defaultProps: {
          children: 'elemeTreeNodeChildList',
          label: 'treeNodeLabel'
        },
        props1: {
          children: 'elemeTreeNodeChildList',
          label: function (data, node) {
            return data.treeNodeLabel
          }
        },
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
        indent: 23,
        dataArr: [],
        data4: [
          {id: '1', treeNodeLabel: '沪市主板', smartTreeNodeChildList: {}},
          {id: '2', treeNodeLabel: '沪市主板', smartTreeNodeChildList: {}},
          {id: '3', treeNodeLabel: '沪市主板', smartTreeNodeChildList: {}},
          {id: '4', treeNodeLabel: '沪市主板', smartTreeNodeChildList: {}}
        ],
        isStatus: 0,
        autoNo: ['换一个关键词吧！', '高级', '重置', '确认', '请输入法规名称，多关键词用空格隔开，如：上市', '请输入案例名称，多关键词用空格隔开', '证券代码/简称', '搜索筛选条件'],
        activeName: '1',
        value1: '',
        value2: '',
        boxContentTi: true,
        monthDate: '',
        monthEnd: '',
        describeText: '全部显示',
        showSort: false,
        isInfo: false, // 是否存在搜索结果
        userId: '',
        userInfo: {},
        regulatorDialog: false,
        isRootUser: false,
        totalNum: ''
      }
    },
    // 使用其它组件
    components: {
      'v-list': list,
      'v-page': page,
      totalNum: totalNum
    },
    // 方法
    computed: {},
    filters: {
      subStr: function (val) {
        if (val.length > 5) {
          return val.substring(0, 6) + '...'
        } else {
          return val
        }
      }
    },
    watch: {
      info() {
        this.describeText = ''
      },
      flip() {
        this.$common.returnTop()
        if (this.$route.fullPath !== '/case') {
          this.submitAll()
        } else {
          this.afficheSearch()
        }
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
          var tree = document.getElementsByClassName('el-tree-node')
          this.$nextTick(() => {
            if (this.isStatus == '4' || this.isStatus == '5') {
              k = '20%'
            } else if (this.isStatus == '7' || this.isStatus == '1' || this.isStatus == '6') {
              k = '100%'
            } else if (this.isStatus == '3' || this.isStatus == '8' || this.isStatus == '2') {
              k = '33%'
            } else {
              k = '50%'
            }
            for (var i = 0; i < tree.length; i++) {
              tree[i].style.display = 'inline-block'
              tree[i].style.width = k
            }
          })
        }
      },
      gridText: function (val) {
        // var tit = document.getElementsByClassName('inputText')[0]
        // if (val.length == 0) {
        //   tit.style.display = 'none'
        // } else {
        //   tit.style.display = 'block'
        // }
      },
      '$route': function (val) {
        // console.log('$route---watch', val.fullPath)
        if (val.fullPath == '/case') {
//          this.monthDate = this.$common.getBeforeDate(30)
//          this.monthEnd = this.$common.getBeforeDate(0)
          this.monthDate = ''
          this.monthEnd = ''
          this.showSort = false
        } else {
          this.monthDate = ''
          this.monthEnd = ''
          this.showSort = true
        }
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
        var tree = document.getElementsByClassName('el-tree-node')
        if (this.isStatus == '4' || this.isStatus == '5') {
          k = '20%'
        } else if (this.isStatus == '7' || this.isStatus == '1' || this.isStatus == '6') {
          k = '100%'
        } else if (this.isStatus == '3' || this.isStatus == '8' || this.isStatus == '2') {
          k = '33%'
        } else {
          k = '50%'
        }
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
        if (index == 1) {
          this.sortMethod = '处理日期'
        } else {
          this.sortMethod = ''
        }
        this.afficheSearch()

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
        if (index == 1) {
          this.inputCode = ''
          this.inputText = ''
        }
        this.inputText = ''
      },
      /* 保存状态 */
      stateful() {
        this.screenList[1].list = this.$route.query.case == undefined ? [] : this.$route.query.case.split('##')
        this.screenList[2].list = this.$route.query.plate == undefined ? [] : this.$route.query.plate.split('##')
        this.screenList[3].list = this.$route.query.industry == undefined ? [] : this.$route.query.industry.split('##')
        this.screenList[4].list = this.$route.query.area == undefined ? [] : this.$route.query.area.split('##')
        this.screenList[5].list = this.$route.query.regulator == undefined ? [] : this.$route.query.regulator.split('##')
        this.screenList[6].list = this.$route.query.supervisionType == undefined ? [] : this.$route.query.supervisionType.split('##')
        this.screenList[7].list = this.$route.query.object == undefined ? [] : this.$route.query.object.split('##')
        this.screenList[8].list = this.$route.query.situation == undefined ? [] : this.$route.query.situation.split('##')

        this.titleIncludes = (this.$route.query.titleIncludes == undefined || this.$route.query.titleIncludes == '') ? '' : this.$common.transComma(this.$route.query.titleIncludes)
        this.titleExcludes = (this.$route.query.titleExcludes == undefined || this.$route.query.titleExcludes == '') ? '' : this.$common.transComma(this.$route.query.titleExcludes)
        this.titleMaybeIncludes = (this.$route.query.titleMaybeIncludes == undefined || this.$route.query.titleMaybeIncludes == '') ? '' : this.$common.transComma(this.$route.query.titleMaybeIncludes)
        /**/
        this.contentIncludes = (this.$route.query.contentIncludes == undefined || this.$route.query.contentIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentIncludes)
        this.contentExcludes = (this.$route.query.contentExcludes == undefined || this.$route.query.contentExcludes == '') ? '' : this.$common.transComma(this.$route.query.contentExcludes)
        this.contentMaybeIncludes = (this.$route.query.contentMaybeIncludes == undefined || this.$route.query.contentMaybeIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentMaybeIncludes)
        /**/
        this.flip = (this.$route.query.flip == undefined || this.$route.query.flip == '') ? 1 : Number(this.$route.query.flip)
        this.sortMethod = (this.$route.query.sortType == undefined || this.$route.query.sortType == '') ? '' : this.$route.query.sortType
        /**/
        this.startDate = (this.$route.query.releaseStart == undefined || this.$route.query.releaseStart == '') ? '' : this.$route.query.releaseStart
        this.startEnd = (this.$route.query.releaseEnd == undefined || this.$route.query.releaseEnd == '') ? '' : this.$route.query.releaseEnd
        /**/
        this.keys = (this.$route.query.keys == undefined || this.$route.query.keys == '') ? this.$route.query.inputVal : this.$route.query.keys
        this.code = (this.$route.query.code == undefined || this.$route.query.code == '') ? this.$route.query.inputCode : this.$route.query.code
        /**/
        let cases = [], plate = [], industry = [], area = [], regulator = [], object = [], supervision = [],
          situation = []
        this.labelText(cases, 1)
        this.labelText(plate, 2)
        this.labelText(industry, 3)
        this.labelText(area, 4)
        this.labelText(regulator, 5)
        this.labelText(supervision, 6)
        this.labelText(object, 7)
        this.labelText(situation, 8)
        this.inputText = this.keys
        this.inputCode = this.code
        if (this.$route.fullPath == '/case') {
          this.selectSort('1')
        } else {
          if (this.sortMethod !== '') {
            this.selectSort('1')
          } else {
            this.selectSort('0')
          }
        }
      },
      labelText(arr, num) {
        for (var i in this.allMapping[num]) {
          for (var j in this.screenList[num].list) {
            if (this.allMapping[num][i].id == this.screenList[num].list[j]) {
              arr.push(this.allMapping[num][i].treeNodeLabel)

            } else if (this.allMapping[num][i].elemeTreeNodeChildList) {
              if (this.allMapping[num][i].elemeTreeNodeChildList.length > 0) {
                let elemeTreeNodeChildList = this.allMapping[num][i].elemeTreeNodeChildList
                elemeTreeNodeChildList.forEach((item) => {
                  if (item.id == this.screenList[num].list[j]) {
                    arr.push(item.treeNodeLabel)
                  }
                })
              }

            } else {

            }
          }
        }
        if (arr.length !== 0) {
          this.screenList[num].title = arr.join(',')
        }
      },
      // 点击确认筛选
      submitAll() {
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
        let name = []
        if (this.screenList[this.isStatus].name.length !== 0) {
          for (let i = 0; i < this.screenList[this.isStatus].name.length; i++) {
            name.push(this.screenList[this.isStatus].name[i].treeNodeLabel)
          }
          this.screenList[this.isStatus].title = name.join('，') // this.$common.subString(, 5)
        } else {
          this.screenList[this.isStatus].title = this.screenListList[this.isStatus]
        }
        this.boxContent = false
        // 用户状态保存
        this.$router.push({
          path: 'case', query: {
            keys: this.inputText,
            code: this.inputCode,
            case: this.screenList[1].list.join('##'),
            plate: this.screenList[2].list.join('##'),
            industry: this.screenList[3].list.join('##'),
            area: this.screenList[4].list.join('##'),
            regulator: this.screenList[5].list.join('##'),
            supervisionType: this.screenList[6].list.join('##'),
            object: this.screenList[7].list.join('##'),
            situation: this.screenList[8].list.join('##'),
            titleIncludes: this.$common.transStr(this.titleIncludes),
            titleExcludes: this.$common.transStr(this.titleExcludes),
            titleMaybeIncludes: this.$common.transStr(this.titleMaybeIncludes),
            contentIncludes: this.$common.transStr(this.contentIncludes),
            contentExcludes: this.$common.transStr(this.contentExcludes),
            contentMaybeIncludes: this.$common.transStr(this.contentMaybeIncludes),
            flip: this.flip,
            sortType: this.sortMethod,
            releaseStart: this.startDate,
            releaseEnd: this.startEnd
          }
        })
        if (this.$route.fullPath == '/case') {
          this.selectSort('1')
        } else {
          console.log('zzzzzz = ', this.sortMethod)
          if (this.sortMethod !== '') {
            this.selectSort('1')
          } else {
            this.selectSort('0')
          }
        }
      },
      // 重置筛选项
      resetAll() {
        for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
          this.$refs.tree2.setChecked(this.screenList[this.isStatus].list[i], false, false)
        }
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.treeNodeLabel.indexOf(value) !== -1
      },
      // 选择筛选条件
      handleNodeClick(data) {
        this.$refs.tree2.setChecked(data.id, true, false)
        for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
          if (this.screenList[this.isStatus].list[i] == data.id) {
            this.$refs.tree2.setChecked(data.id, false, false)
          }
        }
      },
      handleCheckChange() {
        this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
        this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
      },
      /* 获取筛选的类 */
      preparation() {
        let data0 = [], data = [], data1 = [], data2 = [], data3 = [], data4 = [], data5 = [], data6 = []
        this.$http({
          method: 'GET',
          url: this.$api.cases.getFilter
        }).then((res) => {
          // console.log('====cases===', res)
          if (res.data.returnCode == 1) {
            var content = res.data.returnObject
            // 违规类型
            var violation = content.violationTypes
            data0 = violation
            // 所属板块
            data = content.marketType
            // 所属行业
            var industry = content.industryList
            for (var i in industry) {
              data1.push({
                id: i,
                treeNodeLabel: industry[i]
              })
            }
            // 所属地区
            var area = content.areaList
            for (var i1 in area) {
              if (area[i1]) {
                data2.push({
                  id: i1,
                  treeNodeLabel: area[i1]
                })
              }
            }
            // 监管机构
            data3 = content.supervisionOrgans
            // 监管类型
            data4 = content.supervisionTypes
            // 涉及对象
            data5 = content.involveObject
            // 申辩情况
            data6 = content.avermentTypes

            this.allMapping = [[], data0, data, data1, data2, data3, data4, data5, data6]
            this.stateful()
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message + '???'})
        })
      },
      // 选择筛选模块
      screenIsActive(index) {
        this.isStatus = index
        this.filterText = ''
        // console.log('isStatus= ', this.isStatus)
        if (this.screenList[index].title == this.screenListList[index]) {
          this.screenList[index].list = []
          this.screenList[index].name = []
        }
        this.$refs.tree2.setCheckedKeys(this.screenList[index].list, false)
        for (let i in this.screenList) {
          if (i == index) {
          } else {
            this.screenList[i].isSelect = false
          }
        }
        this.boxContentTi = true
        if (index == 0) {
          this.boxContent = false
          this.screenList[1].list = []
          this.screenList[2].list = []
          this.screenList[3].list = []
          this.screenList[4].list = []
          this.screenList[5].list = []
          this.screenList[6].list = []
          this.screenList[7].list = []
          this.screenList[8].list = []
          this.screenList[1].title = '违规类型'
          this.screenList[2].title = '适用范围'
          this.screenList[3].title = '所属行业'
          this.screenList[4].title = '所属地区'
          this.screenList[5].title = '监管机构'
          this.screenList[6].title = '监管类型'
          this.screenList[7].title = '涉及对象'
          this.screenList[8].title = '申辩情况'
          this.submitAll()
        } else {
          this.data4 = this.allMapping[index]
          if (this.screenList[index].isSelect === true) {
            this.screenList[index].isSelect = false
            this.boxContent = this.screenList[index].isSelect
          } else {
            this.screenList[index].isSelect = true
            this.boxContent = this.screenList[index].isSelect
          }
        }
        this.$nextTick(() => {
          this.itemStyle()
        })
      },
      // 选择页数
      selectPage(e) {
        this.flip = e;
        this.$common.returnTop()
        // this.submitAll()
        if (this.$route.fullPath !== '/report') {
          this.submitAll()
        } else {
          this.afficheSearch()
        }
      },
      handlePageChange(val) {
        this.page.size = val;
        this.flip = 1;
        this.afficheSearch()
      },
      // 选择页数
      // selectPage(e) {
      //   this.flip = e
      //   this.loading = true
      // },
      // 打开高级搜索
      seniorMethod() {
        this.tipShow.forEach((item, index) => {
          this.$set(this.tipShow, index, false)
        })
        this.showPanel ? this.showPanel = false : this.showPanel = true
        this.boxContClick()
//        if (!this.showPanel) {
//          this.resetSenior(2)
//        }
        this.resetSenior(2)
      },
      // 页数加一
      addition() {
        if (this.flip < this.total) {
          this.flip += 1
        }
      },
      // 页数减一
      subtraction() {
        if (this.flip > 1) {
          this.flip -= 1
        }
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
      // 获取所有监管公司
      getAllSuperviseCompanyByUser() {
        return new Promise((resolve, reject) => {
          this.$http({
            url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
            method: "GET",
            params: {
              userId: this.userId
            }
          }).then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              resolve(res.data.returnObject.map(e => e.companyCode))
            }
            resolve([])
          }).catch(reject)
        })
      },
      afficheSearch() {
        this.inputCode = this.inputCode ? this.inputCode : ''

        if (this.inputCode == '本公司') {
          // this.handleAfficheSearch(this.userInfo.enterpriseCompanyCode)
          if (this.userInfo.enterpriseUser) {
            this.handleAfficheSearch(this.userInfo.enterpriseCompanyCode)
          } else if (this.userInfo.companyCode) {
            this.handleAfficheSearch(this.userInfo.companyCode)
          } else if (!this.userInfo.companyCode) {
            this.handleAfficheSearch('本公司')
          }
        } else if (this.inputCode == '关注公司') {
          this.getMyAttentionCodes().then(codes => {
            if (codes.length > 0) {
              this.handleAfficheSearch(codes.join(',').replace(/[a-zA-Z]/g, ''))
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
            this.handleAfficheSearch(codes.join(',').replace(/[a-zA-Z]/g, ''))
          }).catch(err => {
            this.isInfo = true
            this.loading = false
            // this.$message({showClose: true, type: 'warning', duration: 3000, message: '暂无可比公司！'})
          })
        } else if (this.inputCode == '监管公司') {
          this.getAllSuperviseCompanyByUser().then(codes => {
            if (codes.toString() != '') {
              this.handleAfficheSearch(codes.join(',').replace(/[a-zA-Z]/g, ''))
            } else {
              this.regulatorDialog = true
              this.isInfo = true
              this.loading = false
            }
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
            // console.log('loadCode', res)
            let searchInputCode = this.inputCode
            if (res.data.returnCode == 1) {
              this.gridData = res.data.returnObject
              if (this.gridData.length === 1) {
                if (this.inputCode === this.gridData[0].name) {
                  searchInputCode = this.gridData[0].code
                }
              }
            }
            this.handleAfficheSearch(searchInputCode)
          }).catch((err) => {
            console.log(err)
            this.handleAfficheSearch(this.inputCode)
          })
        } else {
          this.handleAfficheSearch(this.inputCode)
        }
      },

      // 案例搜索方法
      handleAfficheSearch(searchInputCode) {
        this.loading = true
        this.inputText = this.inputText ? this.inputText : ''
        this.inputCode = this.inputCode ? this.inputCode : ''
        var dateStart = '', dateEnd = ''
        var sortTypeMethod = ''
        if (this.$route.fullPath !== '/case') {
          if (this.inputCode == '' && this.inputText == '' && this.titleIncludes == '' && this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '') {
            dateStart = this.startDate
            dateEnd = this.startEnd
            sortTypeMethod = '处理日期'
            for (let i in this.sort) {
              this.sort[i].isActive = false
            }
            this.sort[1].isActive = true
          } else {
            sortTypeMethod = this.sortMethod
            dateStart = this.startDate
            dateEnd = this.startEnd
          }
        } else {
          dateStart = this.monthDate
          dateEnd = this.monthEnd
          sortTypeMethod = this.sortMethod
        }
        this.info = []
        // console.log('././', this.screenList[2].list, this.screenList[4])
        var market = [], industry = [], area = [], obj = []
        for (let i in this.screenList[4].name) {
          area.push(this.screenList[4].name[i].treeNodeLabel)
        }
        for (let i in this.screenList[3].name) {
          industry.push(this.screenList[3].name[i].treeNodeLabel)
        }
        // console.log('screenList[3]', industry, this.screenList[3])
        console.log('session sortType = 2 = ', this.sortMethod, window.sessionStorage.getItem('sortType'))
        this.$http({
          method: 'POST',
          url: this.$api.cases.searchC,
          data: {
            cateIds: this.screenList[1].list.join(','),
            companyMarketId: this.screenList[2].list.join(','),
            companyTrade: industry.join(','),
            companyArea: area.join(','),
            supervisionOrganId: this.screenList[5].list.join(','),
            supervisionTypeId: this.screenList[6].list.join(','),
            involveObjectId: this.screenList[7].list.join(','),
            avermentId: this.screenList[8].list.join(','),
            // sortType: this.sortMethod,
            sortType: sortTypeMethod,
            userId: this.$cookie.get('userId'),

            processStart: dateStart, // this.startDate
            processEnd: dateEnd, // this.startEnd
            fullTextIncludes: this.$common.transStr(this.inputText),
            titleIncludes: this.$common.transStr(this.titleIncludes), // this.titleIncludes,
            titleMaybeIncludes: this.$common.transStr(this.titleMaybeIncludes),
            titleExcludes: this.$common.transStr(this.titleExcludes),
            contentIncludes: this.$common.transStr(this.contentIncludes),
            contentMaybeIncludes: this.$common.transStr(this.contentMaybeIncludes),
            contentExcludes: this.$common.transStr(this.contentExcludes),

            pageNo: this.flip,
            pageSize: this.page.size,
            companyCode: this.$common.transStr(searchInputCode)

          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1) {
            this.total = Math.ceil(res.data.returnObject.count / this.page.size)
            this.totalNum = res.data.returnObject.count;
            // total数量超过1w条 控制显示
            if (this.total > 1000) {
              this.total = 1000
            }
            // 没有搜索结果
            if (this.total == 0) {
              this.isInfo = true
              this.info = []
            } else {
              this.isInfo = false // debugger
              this.info = []
              this.info = res.data.returnObject.list;
              //
              this.info.forEach((item, index) => {
                if (item.companyMarketName == null) {
                  item.companyMarketName = '';
                }
                //
                let plate = [];
                if (item.companyMarketName && item.companyMarketName.indexOf(',') > -1) {
                  plate = item.companyMarketName.split(',').map((e) => {
                    return {treeNodeValue: e}
                  })
                } else {
                  plate = [{treeNodeValue: item.companyMarketName}]
                }
                //
                let highColorTitle = this.inputText + ' ' + this.titleIncludes + ' ' + this.titleMaybeIncludes
                let highColorContent = this.inputText + ' ' + this.contentIncludes + ' ' + this.contentMaybeIncludes
                let contentTitle = this.$common.key(highColorTitle, item.docTitle ? item.docTitle : '') // this.inputText 监管 监管函
                //
                let describe = false
                if (this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '') {
                  describe = false
                } else {
                  describe = true
                  this.describeText = ''
                }
                //
                // item.title = contentTitle;
                // item.issued = '';
                // item.listTitle = item.docTitle;
                // item.date = this.$common.transTime(item.processDate)[0];
                // item.timeliness = '';
                // item.isDescribe = describe;
                // item.plate = plate;
                this.$set(item, 'title', contentTitle)
                this.$set(item, 'issued', '')
                this.$set(item, 'listTitle', item.docTitle)
                this.$set(item, 'date', this.$common.transTime(item.processDate)[0])
                this.$set(item, 'timeliness', '')
                this.$set(item, 'isDescribe', describe)
                this.$set(item, 'show', false)
                this.$set(item, 'plate', plate)
                //
                let content = '';
                if (item.docContent) {
                  content = '<p>' + item.docContent.replace(/<[^>]+>/g, '') + '</p>'
                }
                if (this.$common.browserSort() == 'Chrome') {
                  this.$set(item, 'describe', this.$common.key(highColorContent, content))
                  //  item.describe = this.$common.key(highColorContent, content);
                } else {
                  let strs = this.$common.key(highColorContent, content) // this.inputText
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                  // item.describe = strs;
                  this.$set(item, 'describe', strs)
                }
              });
            }
          } else {
            this.isInfo = true
            this.info = []
            this.$message({
              showClose: true,
              type: 'warning',
              duration: 3000,
              message: res.data.returnMsg
            })
          }
        }).catch((err) => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'success',
            duration: 3000,
            message: err.message + ' -- case/search'
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
        this.startEnd = this.startEnd ? this.startEnd : ''

        if (this.inputCode == '' && this.inputText == '' && this.titleIncludes == '' && this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '') {
        } else {
          this.sortMethod = ''
          for (let i in this.sort) {
            this.sort[i].isActive = false
          }
          this.sort[0].isActive = true
        }

        if (this.contentIncludes.length == 1 || this.titleExcludes.length == 1 || this.titleMaybeIncludes.length == 1 || this.inputText.length == 1 || this.contentMaybeIncludes.length == 1 || this.contentExcludes.length == 1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '关键词至少填写两个字！'})
        } else {
          this.flip = 1
          this.submitAll()
        }
      },
      // autocomplete click
      selectCode(e) {
        this.inputCode = this.gridData[e].code
      },
      // autocomplete affiche click
      selectText(e) {
        this.inputText = this.gridText[e].title
        this.inputTextPop = false
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
          // console.log('loadCode', res)
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
        this.boxContClick()
        this.inputText = this.inputText ? this.inputText : ''
        if (this.inputText) {
          this.inputTextPop = true
        } else {
          this.inputTextPop = false
          return false
        }
        this.$http({
          methods: 'GET',
          url: this.$api.cases.autoCompleteC,
          params: {
            title: this.inputText
          }
        }).then((res) => {
          // console.log('loadText', res.data.returnObject)
          if (res.data.returnCode == 1) {
            this.gridText = res.data.returnObject
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
      }
    },
    // 生命周期函数
    created() {
      this.rootUser();
      this.userId = this.$cookie.get('userId')
      if (this.userId) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
      }
      if (this.$route.query.inputVal) {
        this.inputCode = this.$route.query.inputCode
        this.inputText = this.$route.query.inputVal
        this.startEnd = ''
        this.startDate = ''
      } else {
        this.startEnd = this.$common.getNowDate()
        this.startDate = this.$common.getLastDate()
      }
      if (this.$route.fullPath == '/case') {
        this.monthDate = ''
        this.monthEnd = ''
      }
    },
    mounted() {
      this.preparation()
      this.itemStyle()
    }
  }
</script>

<style lang="scss">
  .screen-tooltip-case {
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
  .bounce-enter-active {
    animation: bounce-in .4s;
  }
  .bounce-leave-active {
    animation: bounce-in .4s reverse;
  }
  @-moz-keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  @-webkit-keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  @-o-keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  @keyframes bounce-in {
    0% {
      z-index: -1000;
      margin-top: -50px;
      opacity: 0
    }
    100% {
      z-index: 200;
      opacity: 1
    }
  }
  .inputCode {
    // top: 135px !important;
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
  .popover-inputText {
    padding: 0 10px;
    width: 730px !important;
    box-sizing: border-box;
    border-radius: 4px !important;
    left: 225px;
    ul {
      li {
        width: auto;
        height: auto;
        overflow: hidden;
        padding: 10px 0;
        box-sizing: border-box;
        span {
          float: left;
          width: 100%;
        }
        &:hover {
          background: rgba(240, 241, 245, .6);
        }
      }
    }
  }
  #cases {
    width: 100%;
    height: auto;
    .header {
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
            background: #f9e9d5;
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
              color: #636363;
              font-size: 16px;
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
      width: 1200px;
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
          min-height: 264px;
          .tableDate {
            display: inline-block;
            margin-right: 20px;
            width: 24%;
            .start, .end {
              width: 100%;
              height: 35px;
              display: table;
              margin-top: 35px;
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
                font-size: 18px;
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
                white-space: normal !important;
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
                    // font-size: 0;
                    // padding: 0;
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
          // width: 14%;
          width: 12%;
          font-size: 0;
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
              line-height: 20px;
              margin-left: 8px;
              transition: transform .3s, -webkit-transform .3s;
              transform: rotate(0deg);
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
        li:first-child {
          border-bottom-color: #e3e3e3;
          text-align: left;
          border-right: 0;
          width: 6%;
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
        li:last-child {
          width: 10%;
          text-align: right;
        }
      }
    }
    .sort {
      width: 1200px;
      height: 40px;
      border-radius: 4px;
      background: #f6f6f6;
      margin: 15px auto;
      cursor: pointer;
      line-height: 40px;
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
      padding: 30px 0;
    }
    @import "../../../static/css/animate";
  }
</style>
