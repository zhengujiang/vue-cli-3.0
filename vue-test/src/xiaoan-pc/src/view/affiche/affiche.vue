<template>
  <div id="affiche" v-loading.fullscreen.lock="loading">
    <div class="contentShadow" v-show="boxContent" @click="boxContClick"></div>
    <search @submitAll="submitAll" @screenIsActive="screenIsActive" @deleteType='deleteType'
    :senior="senior" :placeholder="autoNo[5]" :stockCode="true" :titleList="screenList" :startTime="startDate" :endTime="startEnd">
      <template slot="title">公告</template>
      <template slot="info">小安为您整理的有关沪深交易所上市公司历年发布的公告。并按照公司所属行业分类，供您快速查阅。</template>
      <template slot="transition">
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
                        :indent="indent">
                        <span class="span-ellipsis" slot-scope="{ node, data }">
                          <span :title="node.label">{{ node.label }}</span>
                        </span>
                </el-tree>
              </div>
              <!-- @node-click="handleNodeClick" @check-change="handleCheckChange" -->
            </div>
            <div v-show="!boxContentTi" class="cont-containerDate">
              <div class="tableDate">
                <div class="start">
                  <span>自</span>
                  <el-date-picker v-model="startDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
                                  :default-value="this.$common.getNowDate()"
                                  :editable="false"
                                  :clearable="true"
                                  :picker-options="pickerOptions1"></el-date-picker>
                </div>
              </div>
              <div class="tableDate">
                <div class="end">
                  <span>到</span>
                  <el-date-picker v-model="startEnd" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"
                                  :default-value="this.$common.getNowDate()"
                                  :editable="false"
                                  :clearable="true"
                                  :picker-options="pickerOptions2"></el-date-picker>
                </div>
              </div>
              <ul class="dateArr">
                <li v-for="(list, index) in dateArr" :key="index" @click="selectDate(index)"
                    :class="{selectStatus: list.selectStatus}">{{ list.column }}
                </li>
              </ul>
            </div>
            <div class="cont-button">
              <div>
                <el-button type="primary" class="timeButton" @click="resetAll">{{autoNo[2]}}</el-button>
              </div>
              <div>
                <el-button type="primary" class="timeButton" @click="submitAll(false, 'reset')">{{autoNo[3]}}</el-button>
              </div>
            </div>
          </div>
        </transition>
      </template>
      <template slot="list">
        <el-card shadow='never'>
          <div v-if="toggle">
            <div class="sort" style="margin: 0; width: 100%" v-if="!isInfo && this.$route.fullPath !== '/affiche'">
              <div class="el-dropdown-link" v-for="(list,index) in sort" :key="index" @click="selectSort(index)">
                <span>{{ list.name }}</span>
                <i class=" iconfont web-sanjiaoxing up" :class="{hide: !list.isActive }"></i>
              </div>
              <!-- <v-page :flip="flip" :total="total" v-on:addition="addition" v-on:subtraction="subtraction"></v-page> -->
              <totalNum :totalNum="totalNum"></totalNum>
              <div @click="allShow" class="el-dropdown-link" style="float: right;margin-right: -5px;">
                <span>{{ describeText }}</span>
              </div>
            </div>
          </div>
          <div class="no-list" id="noInfo" v-if="info.length == 0">
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
            <div style="padding: 0 16px">
              <v-list :data="info" :loading='loading'></v-list>
            </div>
            <div class="foot-pagination" v-if="total>1">
              <div class="row block">
                <el-pagination @current-change="selectPage" layout="prev, pager, next, jumper"
                                :current-page="flip" :page-count="total">
                </el-pagination>
              </div>
              <div class="row">
                <el-radio-group size="mini" v-model="page.size" @change="handlePageChange">
                  <el-radio-button :label="30">30条</el-radio-button>
                  <el-radio-button :label="50">50条</el-radio-button>
                </el-radio-group>
              </div>
            </div>
          </div>
        </el-card>
      </template>
      <template slot="adv">
        <v-adv :pageName="'公告检索'"></v-adv>
      </template>
    </search>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  import list from './components/list.vue'
  import page from '@/components/customPage.vue'
  import search from '@/components/commonSearch.vue'
  import totalNum from '@/components/totalNum.vue'

  export default {
    mixins: [mixins],
    data() {
      return {
        toggle: true,
        page: {
          index: 1,
          size: 30,
          total: 1000
        },
        hideAfter: 500,
        info: [],
        loading: true,
        restaurants: [],
        state: '',
        timeout: null,
        inputCode: '', // user inpput code
        inputText: '', // user inpput affiche text
        gridData: [],  // code autocomplete
        gridText: [],  // affiche autocomplete
        sort: [
          {id: '0', name: '智能排序', type: 'mix', isActive: true, up: false},
          {id: '1', name: '相关度', type: 'es', isActive: false, up: true},
          {id: '2', name: '发布日期', type: 'releaseDate', isActive: false, up: true}
        ],
        sortMethod: '智能排序',
        dataType: 'mix',
        sortFlag: false,
        flip: 1,
        total: 50,
        showPanel: '', // isShow panel
        startDate: '1994-12-16',
        startEnd: '2017-12-31',
        titleIncludes: '', // 标题必含关键字
        titleMaybeIncludes: '', // 标题可含关键字
        titleExcludes: '', // 标题不含关键字
        contentIncludes: '', // 全文必含关键字
        contentMaybeIncludes: '', // 全文可含关键字
        contentExcludes: '', // 全文不含关键字
        // 筛选区
        screenListList: ['全部', '适用范围', '所属行业', '发布日期'], // 筛选默认显示的title格式
        // screenList: [
        //   {id: 0, name: [], titleName: '全部', title: '', type: 'global', isSelect: true, list: []},
        //   {id: 1, name: [], titleName: '适用范围', title: '', type: 'market', isSelect: false, list: []},
        //   {id: 2, name: [], titleName: '所属行业', title: '', type: 'industry', isSelect: false, list: []},
        //   {id: 3, name: [], titleName: '发布日期', title: '', type: 'date', isSelect: false, list: []}
        // ],
        screenList: [
          {id: 0, name: [], titleName: '全部', title: '全部', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], titleName: '适用范围', title: '适用范围', type: 'market', isSelect: false, list: []},
          {id: 2, name: [], titleName: '所属行业', title: '所属行业', type: 'industry', isSelect: false, list: []},
          {id: 3, name: [], titleName: '发布日期', title: '发布日期', type: 'date', isSelect: false, list: []}
        ],
        allMapping: [],
        boxContent: false,
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
        autoNo: ['换一个关键词吧！', '高级', '重置', '确认', '请输入法规名称，多关键词用空格隔开，如：上市', '请输入公告名称，多关键词用空格隔开', '证券代码/简称', '搜索筛选条件'],
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
        userInfo: {},
        regulatorDialog: false,
        isRootUser: false,
        isTitle: false, // 是否为搜索标题  组件传入匹配
        senior: 1, // 打开高级搜索 传给组件
        totalNum: ''  // 总条数
      }
    },
    // 使用其它组件
    components: {
      'v-list': list,
      'v-page': page,
      'totalNum': totalNum,
      search
    },
    // 方法
    computed: {},
    watch: {
      monthDate(val) {
        if (val == '' && this.monthEnd == '') {
          this.screenList[3].title = '发布日期'
        }
      },
      startEnd(val) {
        for (var i in this.dateArr) {
          if (this.dateArr[i].selectStatus == true) {
            if (val !== this.$common.getBeforeDate('0')) {
              this.dateArr[i].selectStatus = false
            }
          }
        }
      },
      startDate(val) {
        for (var i in this.dateArr) {
          if (this.dateArr[i].selectStatus == true) {
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
        // this.info[0].isDescribe = true
      //  if (this.inputText == '' && this.inputCode == '' && this.titleIncludes == '' && this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '' && this.startDate == '' && this.startEnd == '') {
      //    this.info[0].isDescribe = false
      //    this.describeText = ''
      //  } else {
      //    this.info[0].isDescribe = true
      //    this.describeText = ''
      //  }
        this.describeText = ''
      },
      flip() {
        this.$common.returnTop()
        // this.submitAll()
        if (this.$route.fullPath !== '/affiche') {
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
          var content = document.getElementsByClassName('xiaoan-box-content')[0]
          let calc = `width: 100%; width:-moz-calc(100% + 30px); width:-webkit-calc(100% + 30px); width: calc(100% + 30px);
                    left: 0; left:-moz-calc(0px - 15px); left: -webkit-calc(0px - 15px); left: calc(0px - 15px);`
          this.$nextTick(() => {
            if (this.isStatus == '3') {
              k = '20%'
              content.style.cssText = `right:0;padding:0 20px;${calc}`
            } else if (this.isStatus == '1') {
              k = '50%'
              content.style.cssText = `right:auto;padding:0 45px;${calc}`
            } else if (this.isStatus == '2') {
              k = '33%'
              content.style.cssText = `right:auto;padding:0 45px;${calc}`
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
        if (val.fullPath == '/affiche') {
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
      if (this.userId) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
      } else {
        let code = this.$route.query.inputCode
        if (code == '本公司' || code == '关注公司' || code == '可比公司') {
          this.$auth.logout_redirect()
        }
      }
      if (this.$route.query.inputVal) {
        this.inputCode = this.$route.query.inputCode
        this.inputText = this.$route.query.inputVal
        this.startEnd = ''
        this.startDate = ''
      } else {
        if (this.$route.query.releaseStart) {
          this.startDate = this.$route.query.releaseStart;
          this.startEnd = this.$route.query.releaseEnd;
        } else {
          this.startEnd = this.$common.getNowDate()
          this.startDate = this.$common.getLastDate()
          this.startEnd = ''
          this.startDate = ''
        }
      }
      if (this.$route.fullPath == '/affiche') {
        this.monthDate = this.$common.getBeforeDate(30)
        this.monthEnd = this.$common.getBeforeDate(0)
        this.monthDate = ''
        this.monthEnd = ''
      }
    },
    mounted() {
      this.preparation()
      this.itemStyle()
      this.rootUser()
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
      // 筛选处选择时间
      selectDate(index) {
        if (index == '0') {
          this.startDate = this.$common.getBeforeDate('0')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '1') {
          this.startDate = this.$common.getBeforeDate('1')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '2') {
          this.startDate = this.$common.getBeforeDate('2')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '3') {
          this.startDate = this.$common.getBeforeDate('6')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '4') {
          this.startDate = this.$common.getBeforeDate('30')
          this.startEnd = this.$common.getBeforeDate('0')
        } else if (index == '5') {
          this.startDate = this.$common.getBeforeDate('365')
          this.startEnd = this.$common.getBeforeDate('0')
        }
        for (var i in this.dateArr) {
          this.dateArr[i].selectStatus = false
        }
        this.dateArr[index].selectStatus = true
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
        let calc = `width: 100%; width:-moz-calc(100% + 30px); width:-webkit-calc(100% + 30px); width: calc(100% + 30px);
                    left: 0; left:-moz-calc(0px - 15px); left: -webkit-calc(0px - 15px); left: calc(0px - 15px);`
        if (this.isStatus == '3') {
          k = '20%'
          content.style.cssText = `right:0;padding:0 20px;${calc}`
        } else if (this.isStatus == '1') {
          k = '50%'
          content.style.cssText = `right:auto;padding:0 45px;${calc}`
        } else if (this.isStatus == '2') {
          k = '33%'
          content.style.cssText = `right:auto;padding:0 45px;${calc}`
        } else {
          k = '50%'
        }
        var tree = document.getElementsByClassName('el-tree-node')
        for (var i = 0; i < tree.length; i++) {
          tree[i].style.display = 'inline-block'
          tree[i].style.width = k
        }
      },
      //
      // 选择排序
      selectSort(index) {
        this.flip = 1
        for (let i in this.sort) {
          this.sort[i].isActive = false
        }
        this.sort[index].isActive = true
        this.sortMethod = this.sort[index].name
        this.dataType = this.sort[index].type
        this.sortType = this.sort[index].name
        if (index == '0') {
          this.sortType = ''
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
        this.inputText = ''
        if (index == 1) {
          this.inputCode = ''
        }

      },
      /* 保存状态 */
      stateful() {
        this.screenList[1].list = this.$route.query.market == undefined ? [] : this.$route.query.market.split('##')
        this.screenList[2].list = this.$route.query.unitIds == undefined ? [] : this.$route.query.unitIds.split('##')
        if (this.$route.query.releaseStart || this.$route.query.releaseEnd) {
          this.screenList[3].list = [];
          this.screenList[3].list.push(this.$route.query.releaseStart + '---' + this.$route.query.releaseEnd);
          this.screenList[3].title = this.$route.query.releaseStart + '---' + this.$route.query.releaseEnd;
        }
        this.titleIncludes = (this.$route.query.titleIncludes == undefined || this.$route.query.titleIncludes == '') ? '' : this.$common.transComma(this.$route.query.titleIncludes)
        this.titleExcludes = (this.$route.query.titleExcludes == undefined || this.$route.query.titleExcludes == '') ? '' : this.$common.transComma(this.$route.query.titleExcludes)
        this.titleMaybeIncludes = (this.$route.query.titleMaybeIncludes == undefined || this.$route.query.titleMaybeIncludes == '') ? '' : this.$common.transComma(this.$route.query.titleMaybeIncludes)
        /**/
        this.contentIncludes = (this.$route.query.contentIncludes == undefined || this.$route.query.contentIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentIncludes)

        this.contentExcludes = (this.$route.query.contentExcludes == undefined || this.$route.query.contentExcludes == '') ? '' : this.$common.transComma(this.$route.query.contentExcludes)

        this.contentMaybeIncludes = (this.$route.query.contentMaybeIncludes == undefined || this.$route.query.contentMaybeIncludes == '') ? '' : this.$common.transComma(this.$route.query.contentMaybeIncludes)

        /**/
        this.flip = (this.$route.query.flip == '' || this.$route.query.flip == undefined) ? 1 : Number(this.$route.query.flip)
        this.sortType = (this.$route.query.sortType == '' || this.$route.query.sortType == undefined) ? '' : this.$route.query.sortType
        this.startDate = (this.$route.query.releaseStart == '' || this.$route.query.releaseStart == undefined) ? '' : this.$route.query.releaseStart
        this.startEnd = (this.$route.query.releaseEnd == '' || this.$route.query.releaseEnd == undefined) ? '' : this.$route.query.releaseEnd

        this.keys = (this.$route.query.keys == undefined || this.$route.query.keys == '') ? this.$route.query.inputVal : this.$route.query.keys
        this.code = (this.$route.query.code == undefined || this.$route.query.code == '') ? this.$route.query.inputCode : this.$route.query.code
        /**/
        let market = [], unitIds = []
        for (let s in this.allMapping[1]) {
          for (let x in this.screenList[1].list) {
            if (this.allMapping[1][s].id == this.screenList[1].list[x]) {
              market.push(this.allMapping[1][s].label)
            }
          }
        }
        for (let s in this.allMapping[2]) {
          for (let x in this.screenList[2].list) {
            if (this.allMapping[2][s].id == this.screenList[2].list[x]) {
              unitIds.push(this.allMapping[2][s].label)
            }
          }
        }
        if (market.length != 0) {
          this.screenList[1].title = market.join(',')
        }
        if (unitIds.length != 0) {
          this.screenList[2].title = unitIds.join(',')
        }
        /**/
        this.inputText = this.keys
        this.inputCode = this.code
        this.afficheSearch()
      },
      // 点击确认筛选 type 是否为删除某个选项
      submitAll(type, reset) {
        if (reset == 'reset') {
          this.flip = 1;
        }
        console.log(this.screenList);
        if (!type) {
          if (this.screenList[this.isStatus].titleName == '发布日期') {
            this.screenList[this.isStatus].list = [];
            this.screenList[this.isStatus].list.push(this.startDate + '---' + this.startEnd)
          } else {
            this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
            this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
          }
        }
        if (type && typeof type == 'object') {
          for (let key in type) {
            if (key == 'startDate' || key == 'startEnd') {
              if (type[key]) {
                this[key] = type[key]
                for (let data of this.screenList) {
                  if (data.titleName == '发布日期') {
                    data.list = [];
                    data.list.push(this.startDate + '---' + this.startEnd)
                  }
                }
              }
            } else {
              this[key] = type[key];
            }
          }
        }
        for (let i in this.screenList) {
          this.screenList[i].isSelect = false
        }
        for (let i = 0; i < this.sort.length; i++) {
          this.sort[i].isActive = false;
          if (this.sort[i].type == this.dataType) {
            this.sort[i].isActive = true;
          }
        }
        // if (!type) {
          let names = []
          if (this.screenList[this.isStatus].name.length !== 0) {
            for (let i = 0; i < this.screenList[this.isStatus].name.length; i++) {
              names.push(this.screenList[this.isStatus].name[i].label)
            }
            this.screenList[this.isStatus].title = names.join(',') // this.$common.subString()
          } else {
            if (this.screenListList[this.isStatus] == '发布日期') {
              if (!this.startDate && !this.startEnd) {
                this.screenList[this.isStatus].title = '发布日期'
              } else {
                this.screenList[this.isStatus].title = this.startDate + '' + this.startEnd
              }
            } else {
              this.screenList[this.isStatus].title = this.screenListList[this.isStatus]
            }
          }
        // }
        this.boxContent = false
        // 用户状态保存
        this.$router.push({
          path: 'affiche', query: {
            keys: this.inputText,
            code: this.inputCode,
            market: this.screenList[1].list.join('##'),
            unitIds: this.screenList[2].list.join('##'),
            titleIncludes: this.$common.transStr(this.titleIncludes), // this.titleIncludes
            titleExcludes: this.$common.transStr(this.titleExcludes),
            titleMaybeIncludes: this.$common.transStr(this.titleMaybeIncludes),
            contentIncludes: this.$common.transStr(this.contentIncludes),
            contentExcludes: this.$common.transStr(this.contentExcludes),
            contentMaybeIncludes: this.$common.transStr(this.contentMaybeIncludes),
            flip: this.flip,
            sortType: this.sortType,
            releaseStart: this.startDate,
            releaseEnd: this.startEnd
          }
        })
        this.afficheSearch()
      },
      // 重置筛选项
      resetAll() {
        for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
          this.$refs.tree2.setChecked(this.screenList[this.isStatus].list[i], false, false)
        }
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
        // alert(this.screenList[this.isStatus].type)
        if (this.screenList[this.isStatus].type == 'date') {
          this.startEnd = ''
          this.startDate = ''
        }
        this.initTree(this.isStatus);
      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      deleteType(data, type) {
        this.isStatus = data.status;
        this.initTree(this.isStatus);
        this.boxContClick();
        if (type == 'all') {
          this.resetAll();
          this.screenList[this.isStatus].list = [];
        } else {
          this.handleNodeClick(data);
          for (let i = 0; i < this.screenList.length; i++) {
            for (let j = 0; j < this.screenList[i].list.length; j++) {
              if (data.id == this.screenList[i].list[j]) {
                this.screenList[i].list.splice(j, 1);
              }
            }
          }
        }
        if (this.screenList[this.isStatus].type == 'date') {
          this.startEnd = ''
          this.startDate = ''
        }
        this.submitAll(true);
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
      handleCheckChange(data) {
        // this.screenList[this.isStatus].list = this.$refs.tree2.getCheckedKeys()
        // this.screenList[this.isStatus].name = this.$refs.tree2.getCheckedNodes()
      },
      /* 获取筛选的类 */
      preparation() {
        let data = [], data1 = []
        console.log(222222222)
        this.$http({
          method: 'POST',
          url: this.$api.affiche.afficheSearch,
          params: {
            announcementType: "",
            companyCode: "",
            content: "",
            dispatchUnit: "",
            exceptContent: "",
            exceptTitle: "",
            fullText: "",
            informationRating: "",
            keyword: "",
            marketType: "",
            pageNum: 1,
            pageSize: 30,
            possibleContent: "",
            possibleTitle: "",
            searchScope: "",
            searchType: "",
            sort: "mix",
            title: "",
            tradeType: "",
            userId: null
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            let content = res.data.returnObject.conditions
            var market = content.market
            var industry = content.tradeType
            for (let i = 0; i < market.length; i++) {
              data1.push({
                id: market[i],
                label: market[i]
              })
            }
            for (let i = 0; i < industry.length; i++) {
              data.push({
                id: industry[i],
                label: industry[i]
              })
            }
            /* 发布日期 */
            this.allMapping = [[], data1, data, []]
            this.stateful()
          }
        }).catch((err) => {
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      initTree(index) {
        this.isStatus = index
        this.filterText = ''
        if (this.screenList[1].title == '适用范围') {
          this.screenList[1].list = []
          this.screenList[1].name = []
        }
        if (this.screenList[2].title == '所属行业') {
          this.screenList[2].list = []
          this.screenList[2].name = []
        }
        if (this.screenList[3].title == '发布日期') {
          this.startDate = ''
          this.startEnd = ''
          for (var ix in this.dateArr) {
            this.dateArr[ix].selectStatus = false
          }
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
          this.screenList[1].name = []
          this.screenList[2].list = []
          this.screenList[2].name = []
          for (var i in this.screenList) {
            this.screenList[i].title = this.screenListList[i]
          }
          this.submitAll()
        } else {
          if (index == this.screenList.length - 1) {
            this.boxContentTi = false
          }
          this.data4 = this.allMapping[index]
          if (this.screenList[index].isSelect === true) {
            this.screenList[index].isSelect = false
            this.boxContent = this.screenList[index].isSelect
          } else {
            this.screenList[index].isSelect = true
            this.boxContent = this.screenList[index].isSelect
          }
        }
      },
      // 选择筛选模块
      screenIsActive(index) {
        this.initTree(index);
        this.$nextTick(() => {
          this.itemStyle()
        })
      },
      // 打开高级搜索
      seniorMethod() {
        // 控制搜索条的开关
        this.toggle = !this.toggle
        if (this.showPanel) {
          this.dataType = 'mix'
        } else {
          this.dataType = 'releaseDate'
        }
        this.senior++;
        // this.tipShow.forEach((item, index) => {
        //   this.$set(this.tipShow, index, false)
        // })
        // this.showPanel ? this.showPanel = false : this.showPanel = true
        // this.boxContClick()
        // this.resetSenior(2)
        /* if (!this.showPanel) {
          this.resetSenior(2)
        } */
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
      // 公告搜索方法
      afficheSearch() {
        this.inputCode = this.inputCode ? this.inputCode : ''
        if (this.inputCode == '本公司') {
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
            this.handleAfficheSearch(this.inputCode)
          })
        } else {
          this.handleAfficheSearch(this.inputCode)
        }

      },
      handleAfficheSearch(searchInputCode) {
        this.loading = true
        this.inputText = this.inputText ? this.inputText : ''
        this.inputCode = this.inputCode ? this.inputCode : ''
        this.startDate = this.startDate ? this.startDate : ''
        this.startEnd = this.startEnd ? this.startEnd : ''
        var dateStart = '', dateEnd = ''
        if (this.$route.fullPath !== '/affiche') {
        //  dateStart = this.startDate
        //  dateEnd = this.startEnd
          if (this.inputCode == '' && this.inputText == '' && this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '' && this.startDate == '' && this.startEnd == '') {
          //  dateStart = this.$common.getBeforeDate(30)
          //  dateEnd = this.$common.getBeforeDate(0)
            dateStart = this.startDate
            dateEnd = this.startEnd
            // this.sortType = '发布日期'
          } else {
            dateStart = this.startDate
            dateEnd = this.startEnd
          }
        } else {
          dateStart = this.monthDate
          dateEnd = this.monthEnd
        }
        let dateStarts, dateEnds;

        if (dateStart !== '') {
          dateStarts = dateStart + ' 00:00:00'
        }
        if (dateEnd !== '') {
          dateEnds = dateEnd + ' 23:59:59'
        }
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.afficheSearch,
          params: {
            searchType: '',
            searchScope: '',
            tradeType: this.screenList[2].list.join(','),
            marketType: this.screenList[1].list.join(','),
            announcementType: '',
            releaseStart: dateStarts, // this.startDate
            releaseEnd: dateEnds, // this.startEnd
            fullText: this.isTitle ? '' : this.$common.transStr(this.inputText),
            title: this.isTitle ? this.$common.transStr(this.inputText) : this.$common.transStr(this.titleIncludes), // this.titleIncludes
            content: this.$common.transStr(this.contentIncludes),
            possibleTitle: this.$common.transStr(this.titleMaybeIncludes),
            possibleContent: this.$common.transStr(this.contentMaybeIncludes),
            exceptTitle: this.$common.transStr(this.titleExcludes),
            exceptContent: this.$common.transStr(this.contentExcludes),
            pageNum: this.flip,
            pageSize: this.page.size,
            keyword: '',
            dispatchUnit: '',
            companyCode: this.$common.transStr(searchInputCode),
            sort: this.dataType
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
              this.isInfo = false
              var arr = res.data.returnObject.list
              this.info = []
              var reg = /\s/g
              var content = ''
              for (let i in arr) {
                if (arr[i].content) {
                  content = arr[i].content.replace(reg, '')
                }
                var describe = false
                // this.inputText == '' && this.inputCode == '' && this.titleIncludes == '' &&
                if (this.contentIncludes == '' && this.contentExcludes == '' && this.contentMaybeIncludes == '') {
                  //  this.titleExcludes == '' && this.titleMaybeIncludes == '' && this.startDate == '' && this.startEnd == ''
                  describe = false
                } else {
                  describe = true
                  this.describeText = ''
                }
                //
                var plate = [];
                if (arr[i].marketType.indexOf(',') > -1) {
                  plate = arr[i].marketType.map((e) => {
                    return {treeNodeValue: e}
                  })
                } else {
                  plate = [{treeNodeValue: arr[i].marketType}]
                }
                //
                var obj = {}
                // var highColorTitle = this.inputText + ' ' + this.titleMaybeIncludes + ' ' + this.contentIncludes + ' ' + this.contentMaybeIncludes
                var highColorTitle = this.inputText + ' ' + this.titleMaybeIncludes + ' ' + this.titleIncludes
                var highColorContent = this.inputText + ' ' + this.contentIncludes + ' ' + this.contentMaybeIncludes
                if (this.$common.browserSort() == 'Chrome') {
                  obj = {
                    id: arr[i].mainId,
                    title: this.$common.highlight(this.inputCode, arr[i].companyCode) + '  ' + this.$common.key(highColorTitle, arr[i].title),
                    describe: this.isTitle ? content : this.$common.key(highColorContent, content),
                    issued: '',
                    listTitle: arr[i].title,
                    date: this.$common.transTime(arr[i].releaseDate)[0],
                    timeliness: '',
                    isDescribe: describe,
                    plate: plate,
                    show: false,
                    nowLevel: arr[i].nowLevel,
                    threeYearLevel: arr[i].threeYearLevel
                  }
                } else {
                  var strs = this.isTitle ? content : this.$common.key(highColorContent, content)
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                  obj = {
                    id: arr[i].mainId,
                    title: this.$common.highlight(this.inputCode, arr[i].companyCode) + '  ' + this.$common.key(highColorTitle, arr[i].title),
                    describe: strs,
                    issued: '',
                    listTitle: arr[i].title,
                    date: this.$common.transTime(arr[i].releaseDate)[0],
                    timeliness: '',
                    plate: plate,
                    isDescribe: describe,
                    show: false,
                    nowLevel: arr[i].nowLevel,
                    threeYearLevel: arr[i].threeYearLevel
                  }
                }
                this.info.push(obj)
              }
            }
          } else {
            this.$message({
              showClose: true,
              type: 'warning',
              duration: 3000,
              message: res.returnMsg
            })
          }
        }).catch((err) => {
          this.loading = false
          this.$message({
            showClose: true,
            type: 'error',
            duration: 3000,
            message: err.message
          })
        })
      },
      // autocomplete click
      selectCode(e) {
        this.inputCode = this.gridData[e].code
      },
      // autocomplete affiche click
      selectText(e) {
        this.inputText = this.gridText[e]
      },
      inputFocus() {
        this.boxContClick()
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
      // 公告名称 autocomplete
      loadText() {
        this.$http({
          methods: 'GET',
          url: this.$api.affiche.hotSearch
        }).then((res) => {
          // if (res.data.returnCode == 1) {
          this.gridText = res.data
          // }
        }).catch((err) => {
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
    z-index: 100;
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
  .inputText {
    padding: 0 10px;
    width: 730px !important;
    box-sizing: border-box;
    top: 135px !important;
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
  .sort {
    width: 100%;
    height: 40px;
    border-radius: 4px;
    background: #f6f6f6;
    // margin: 15px auto;
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
      height: 40px;
    }
  }
  .foot-pagination {
    padding: 30px 0;
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
  @import "../../../static/css/animate";
</style>
