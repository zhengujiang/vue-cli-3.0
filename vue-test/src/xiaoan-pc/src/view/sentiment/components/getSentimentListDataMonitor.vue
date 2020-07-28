<template>
  <div id="getSentimentListDataMonitor">
    <el-card class="company-card" body-style="padding:0;" shadow="hover" v-loading="loading" v-show="scarchIsShow"
             style="margin-bottom: 20px;">
      <div class="company-card-body">
        <div class="card-body-title">
          <span class="card-title-number">{{totalSentimentMonitor}}</span>
          <span class="card-title-name">舆情合计</span>
          <span class="card-title-date">报告日期：{{getReportNowDate}}</span>
          <template v-if="this.firstSentimentListData.id">
            <button class="card-title-btn" @click="updateSentimentData(firstSentimentListData)">编辑</button>
          </template>
        </div>
        <!-- 卡片搜索框-->
        <div class="card-search-box">
          <div class="search-content">
            <div class="search-input-block">
              <a class="search-input-title">全文</a>
              <button class="search-input-btn" @click="searchSentimentList(1)">
                <i class="iconfont web-tripsousuo"></i>
              </button>
              <input class="search-input" type="text" placeholder="请输入关键词，多关键词用空格隔开" v-model.trim="inputContentText"
                     @keyup.enter.self="searchSentimentList(1)">
            </div>
          </div>
        </div>
      </div>
    </el-card>
    <el-card body-style="padding:0;" shadow="hover" class="company-card-nopadding" v-loading="loading"
             ref="selfAdaption" style="padding-top: 0;">
      <!--筛选框-->
      <div class="screen" v-if="selectBounce">
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
              <i class="icon iconfont web-sanjiaoxing" v-if="index !== 0" style="font-size: 10px;"></i>
            </div>
          </li>
        </ul>
        <!-- 筛选各筛选项 -->
        <transition name="bounce" mode="out-in">
          <div v-show="boxContent" class="xiaoan-box-content">
            <!--多选框筛选-->
            <div v-show="boxContentTi" class="cont-container">
              <div class="cont-tree">

                <el-tree ref="treeScreen" class="filter-tree" :data="screenData" :props="defaultProps"
                         :filter-node-method="filterNode"
                         node-key="id" :default-checked-keys="defaultCheckedKeys" accordion show-checkbox
                         expand-on-click-node highlight-current
                         @node-click="handleNodeClick" @check-change="handleCheckChange" @check="currentChange"
                         :indent="indent">
                </el-tree>
              </div>
            </div>
            <!--日期筛选-->
            <div v-show="!boxContentTi" class="cont-containerDate">
              <div class="tableDate">
                <div class="start">
                  <span>自</span>
                  <el-date-picker v-model="startDate" value-format="yyyy-MM-dd" type="date" placeholder=""
                                  :default-value="$common.getNowDate()" :editable="false"
                                  :picker-options="pickerOptions1"></el-date-picker>
                </div>
              </div>
              <div class="tableDate">
                <div class="end">
                  <span>到</span>
                  <el-date-picker v-model="endDate" value-format="yyyy-MM-dd" type="date" placeholder=""
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
            <!--筛选按钮-->
            <div class="cont-button">
              <div>
                <el-button type="primary" class="timeButton" @click="resetAll">{{autoNo[0]}}</el-button>
              </div>
              <div>
                <el-button type="primary" class="timeButton" @click="submitAll">{{autoNo[1]}}</el-button>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <template class="box-card proceed right-content no-list" shadow="never" style="padding-top:15%;"
                v-if="companySentimentInfo == ''">
        <template v-if="contentAddButton">
          <v-noInfo :altText="'当前无自定义舆情方案'" :imgSrc="noneImg"></v-noInfo>
          <div class="center">
            <el-button class="addEvent" type="primary" @click='addPlans'>
              <i class="icon iconfont web-jia"></i>&ensp;自定义方案
            </el-button>
          </div>
        </template>
        <template v-else>
          <v-noInfo :altText="'暂时没有内容'" :imgSrc="noneImg"></v-noInfo>
          <p id="noInfoDefault" style="">尝试重新定义舆情方案</p>
        </template>

      </template>
      <template v-else>

        <div class="company-card-body">

          <div class="card-fold-list">
            <div class="fold-list-header">
              <!--排序-->
              <div class="sort">
                <div class="el-dropdown-link" v-for="(list,index) in sort" :key="index" @click="selectSort(index)">
                                <span v-show="list.isShow">{{ list.name }}
                                    <i v-if="list.mode== 'off'" class="iconfont web-sort"></i>
                                    <i v-else-if="list.mode== 'desc'" class="iconfont web-sort-desc"></i>
                                    <i v-else-if="list.mode== 'asc'" class="iconfont web-sort-asc"></i>
                                </span>

                </div>
              </div>
              <!--翻页-->
              <span class="list-header-page">
                            <v-page v-show="!noInfo" :flip="flip" :total="total" v-on:addition="addition"
                                    v-on:subtraction="subtraction"></v-page>
                        </span>
            </div>

            <div class="fold-list-body" v-loading="loading">

              <ul>
                <li v-for="(info,index) in companySentimentInfo" :key="index" :class="{active: info.isDescribe}">
                  <a>
                    <div class="list-title-block list-title-sm">{{info.heat}}</div>

                    <div v-if="info.tendency == '负面'" class="list-title-block list-title-xs list-content-highlight">
                      {{info.tendency}}
                    </div>
                    <div v-else="info.tendency" class="list-title-block list-title-xs">{{info.tendency}}</div>

                    <div class="list-content-block list-content-lg">
                      <div class="fold-list-title"><a class="a-link" :href="info.url" target="_blank"
                                                      v-html='info.title'></a></div>
                      <div class="fold-list-subtitle"><a class="a-link" :href="info.url" target="_blank"
                                                         v-html='info.summary'></a></div>
                      <div class="fold-list-tips">
                        <span class="list-tips-left"><span v-html='info.media'></span><a
                          @click="openTimeAsisi(info.title)"><span>{{info.reprinted}}</span>条相似</a></span>
                        <span class="list-tips-right">{{$common.transTime(info.dateTime)[0]}}丨
                                                <span v-if="info.isDescribe == false" class="showDescribe">
                                                    <i class="showDescribeText">显示摘要</i>
                                                    <i class="showDescribeNum">
                                                        <i @click.stop="showDescribe(index)">单条</i> | <i
                                                      @click.stop="showAll('show')">全部</i>
                                                    </i>
                                                </span>
                                                <span v-else-if="info.isDescribe == true" class="showDescribe"
                                                      @click.stop="showDescribe(index)">
                                                    <i class="hideDescribeText">隐藏摘要</i>
                                                    <i class="hideDescribeNum">
                                                        <i @click.stop="showDescribe(index)">单条</i> | <i
                                                      @click.stop="showAll('hide')">全部</i>
                                                    </i>
                                                </span>
                                            </span>

                      </div>
                    </div>
                  </a>
                </li>
                <!--<div class="list-uploade-tips">———— 以上为更新内容 ————</div>-->
                <div v-show="!noInfo" class="list-note-tips">* 标题相似的舆情已去重显示</div>
              </ul>
              <!-- <no-info v-show="noInfo"></no-info> -->
              <div class="pagination" v-show="!noInfo">
                <div class="block" style="width: 100%;padding: 20px;position: relative;">
                  <el-pagination background
                                 @current-change="selectPage"
                                 layout="prev, pager, next"
                                 :current-page="flip"
                                 :page-count="total">
                  </el-pagination>

                  <div class="pageSizeBox" v-if="pageSize == '30'">
                    <a class="pageSizeBtn pageSizeLeft active" @click="changePageSize('30')">30条</a>
                    <a class="pageSizeBtn pageSizeRight" @click="changePageSize('50')">50条</a>
                  </div>
                  <div class="pageSizeBox" v-else>
                    <a class="pageSizeBtn pageSizeLeft " @click="changePageSize('30')">30条</a>
                    <a class="pageSizeBtn pageSizeRight active" @click="changePageSize('50')">50条</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
  import mixins from '@/service/sensitiveWord'
  import VPage from '@/components/customPage.vue'
  import NoInfo from "../../../components/noInfo.vue";

  import VCompanyAnswerItem from '@/view/investor/components/companyAnswerItem'
  import VCompanyQuestionItem from '@/view/investor/components/companyQuestionItem'
  import VInvestorQuestionItem from '@/view/investor/components/investorQuestionItem'
  export default {
    name: "getSentimentListDataMonitor",
    mixins: [mixins],
    props: {
      // 从父组件获取自定义方案数据
      getSentimentListData: {
        type: [Object, String]
      },
      getId: {
        type: Number
      },
      deletesentimeAsidePlanId: {
        type: [Number, String]
      },
      noInfo: {
        type: Boolean,
        default: false
      },
      sentimentIsUrl: {
        type: [String, Number]
      }
    },
    components: {
      VCompanyAnswerItem,
      VCompanyQuestionItem,
      VInvestorQuestionItem,
      NoInfo,
      VPage
    },
    data() {
      return {
        contentAddButton: false,
        // 搜索栏是否显示
        scarchIsShow: true,
        loading: false,
        flip: 1, // 默认页码
        total: 50, // 总页数
        pageSize: 30, // 每页30条
        autoNo: ['重置', '确认', '搜索筛选条件'],
        // 筛选区
        screenListList: ['全部', '选择日期', '情感色彩', '来源类型'], // 筛选默认显示的title格式
        screenList: [
          {id: 0, name: [], title: '全部', class: 'all', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], title: '选择日期', class: 'time', type: 'date', isSelect: false, list: []},
          {id: 2, name: [], title: '情感色彩', class: '', type: 'tendency', isSelect: false, list: []},
          {id: 3, name: [], title: '来源类型', class: '', type: 'mediaType', isSelect: false, list: []}
        ],
        defaultCheckedKeys: [],
        screenData: [],
        hideAfter: 500,
        allMapping: [],
        boxContent: false,
        boxContentTi: true,
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        indent: 23,
        dataIndency: [
          {id: 0, label: '正面'},
          {id: 1, label: '中性'},
          {id: 2, label: '负面'}
        ],
        dataMediaType: [
          {id: 0, label: '论坛'},
          {id: 1, label: '手机新闻'},
          {id: 2, label: '网络新闻'},
          {id: 3, label: '报纸'}
        ],
        dataMediaTypeCopy: [
          {id: 0, label: '论坛'},
          {id: 1, label: '手机新闻'},
          {id: 2, label: '网络新闻'},
          {id: 3, label: '报纸'}
        ],
        dateArr: [
          {id: 0, column: '最近7天', selectStatus: false},
          {id: 1, column: '最近30天', selectStatus: false},
          {id: 2, column: '最近一年', selectStatus: false}
        ],
        pickerOptions1: {
          disabledDate(time) {
            return time.getTime() > Date.now()
          },
          shortcuts: [{
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
        isInfo: false, // 是否存在搜索结果
        sort: [
          {id: '0', name: '日期', type: 'date', mode: 'desc', isShow: true},
          {id: '1', name: '热度', type: 'heat', mode: 'off', isShow: true}
        ],
        startDate: '',
        endDate: '',
        monthDate: '',
        monthEnd: '',
        describeText: '',
        // ==================================分割
        sortType: 'desc', // 排序的方式[asc][desc]
        sortMode: '日期', // 排序的字段名称[日期][热度],
        // 显示的列表
        companySentimentInfo: '',
        keyWord: '',
        except: '',
        tendency: '',
        mediaType: '手机新闻,网络新闻,报纸',
        // 用户id
        userId: this.$cookie.get('userId'),
        // 获取公司股票代码
        companyCode: window.JSON.parse(this.$cookie.get('userInfo')).enterpriseCompanyCode,
        // 包含关键词
        include: '',
        // 不包含关键词
        noInclude: '',
        // 公司
        company: '',
        // 行业
        industry: '',
        // 地域
        area: '',
        // 人物
        manager: '',
        // 输入的关键词查找
        inputKeyword: '',
        // 高亮关键词
        newKeyword: '',
        // 搜索关键字
        inputContentText: '',
        // 舆情合计总数
        totalSentimentMonitor: 0,
        // 获取报告时间日期区间
        getReportNowDate: '',
        // 获取开时间
        startTime: '',
        // 获取结束时间
        endTime: '',
        noneImg: this.$image.disclosure.default,
        // 舆情方案的id
        sentimentPlansId: '',
        // 筛选框显示
        selectBounce: true,
        // 子主键第一次加载获取的对象
        firstSentimentListData: this.getSentimentListData,
        // 默认选择的来源类型
        defaultSource: [],
        defaultSourceType: false

        // fullHeight: document.documentElement.clientHeight
      }
    },
    created() {
      this.defaultSource = [1, 2, 3];
      this.screenList[3].title = "手机新闻,网络新闻,报纸";
      // this.defaultSourceTitle = "手机新闻, 网络新闻, 报纸";
      // this.defaultSourceArr = [{"id": 1, "label": "手机新闻"}, {"id": 2, "label": "网络新闻"}, {"id": 3, "label": "报纸"}];

      // alert(this.userId)
      // alert(this.changePageSize);
      // this.tendency = this.$route.query.tendency
      // this.mediaType = this.$route.query.mediaType
      // this.startDate = this.$route.query.startDate
      // this.endDate = this.$route.query.endDate

    },
    mounted() {
      // 获取最新的一条数据
      // 1代表是有GET参数上添加自定义舆情
      // 0代表是没有GET参数上添加自定义舆情
      this.getSentimeAsidePlan(this.sentimentIsUrl);
      // this.contentAddButton = false;
      // 获取报告时间日期区间
      this.getReportNowDate = this.GetDateStr(-6, '年', '月', '日') + '至' + this.GetDateStr(0, '年', '月', '日', false);
      // 获取开始时间
      this.startTime = this.GetDateStr(-6, '-', '-');
      // this.startTime = '';
      // 获取结束时间
      this.endTime = this.GetDateStr(0, '-', '-');
      // this.startTime = '';
      // const that = this
      // window.onresize = () => {
      //     return (() => {
      //         window.fullHeight = document.documentElement.clientHeight
      //         that.fullHeight = window.fullHeight
      //     })()
      // }
    },
    watch: {
      // fullHeight: function(val) {
      //     this.fullHeight = val;
      //     this.$refs.selfAdaption.style.minHeight = val - 382 + 'px';
      // },
      getSentimentListData: function (val) {
        if (val.id) {
          // 筛选区置空
          this.defaultSourceType = false;
          this.screenListList = ['全部', '选择日期', '情感色彩', '来源类型']; // 筛选默认显示的title格式
          this.screenList = [
            {id: 0, name: [], title: '全部', class: 'all', type: 'global', isSelect: true, list: []},
            {id: 1, name: [], title: '选择日期', class: 'time', type: 'date', isSelect: false, list: []},
            {id: 2, name: [], title: '情感色彩', class: '', type: 'tendency', isSelect: false, list: []},
            {id: 3, name: [], title: '来源类型', class: '', type: 'mediaType', isSelect: false, list: []}
          ];
          this.defaultSource = [1, 2, 3];
          this.screenList[3].title = "手机新闻,网络新闻,报纸";
          this.screenList[3].name = [{"id": 1, "label": "手机新闻"}, {"id": 2, "label": "网络新闻"}, {"id": 3, "label": "报纸"}]
          this.boxContent = false;
          this.inputKeyword = ''; // 搜索框值置空
          this.flip = 1;  // 页码重置
          this.startTime = this.GetDateStr(-6, '-', '-'); // 开始时间
          this.endTime = this.GetDateStr(0, '-', '-'); // 结束时间
          this.tendency = ''; // 情感色彩
          this.mediaType = '手机新闻,网络新闻,报纸'; // 来源类型
          // this.include = val.include + ' ' + val.company + ' ' + val.industry + ' ' + val.area + ' ' + val.manager;
          var a = '';
          if (val.include) {
            a += val.include + ',';
          }
          if (val.company) {
            a += val.company + ',';
          }
          if (val.industry) {
            a += val.industry + ',';
          }
          if (val.area) {
            a += val.area + ',';
          }
          if (val.manager) {
            a += val.manager + ',';
          }
          // 拼接关键词
          a = a.slice(',', -1);
          // 获取包含关键词
          this.include = a;
          // 获取不包含关键词
          this.noInclude = val.except;
          // 获取舆情方案ID
          this.sentimentPlansId = val.id;
          // 清空筛选框中的值
          this.inputContentText = '';
          // 获取舆情方案列表
          this.setsentimentList();
          this.firstSentimentListData = val;

          if (this.$route.query.SentimentPlanId) {
            this.scarchIsShow = true;
            this.selectBounce = true;
            this.contentAddButton = false
          }

        }
      },
      deletesentimeAsidePlanId: function (val) {
        this.deleteSentimePlan(val);
      },
      flip() {
        if (this.inputKeyword) {
          this.searchSentimentList();
        } else {
          this.setsentimentList();
        }

      },
      sortType() {
        if (this.inputKeyword) {
          this.searchSentimentList();
        } else {
          this.setsentimentList();
        }
      },
      sortMode() {
        if (this.inputKeyword) {
          this.searchSentimentList();
        } else {
          this.setsentimentList();
        }
      },
      monthDate(val) {
        if (val == '' && this.monthEnd == '') {
          this.screenList[3].title = '选择日期'
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
            // console.log('现在筛选时间时间段显示的是 = ', i, val, this.$common.getBeforeDate(i))
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
      boxContent: function (val) {
        if (this.boxContent) {
        } else {
          this.screenList[0].isSelect = true
        }
        this.$emit('boxContent', val)
        this.itemStyle()
      },
      filterText: function (val) {
        this.$refs.treeScreen.filter(val)
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
      }
    },
    methods: {
      openTimeAsisi(data) {
        console.log(data)
        this.$emit('openTimeAsis', data);
      },
      // 选择筛选模块
      screenIsActive(index) {
        this.isStatus = index;
        this.filterText = '';
        this.screenList.forEach((item, i) => {
          if (item.title == '选择日期') {
            this.dateArr.forEach((b) => {
              this.$set(b, 'selectStatus', false)
            })
          }
          if (i != index) {
            this.$set(item, 'isSelect', false);
          }
        });

        this.$refs.treeScreen.setCheckedKeys(this.screenList[index].list, false);

        this.boxContentTi = true

        if (index == 0) {
          // 点击了全部
          // 开始时间至当前开始时间
          this.startDate = this.GetDateStr(-6, '-', '-');
          // 结束时间至当前结束时间
          this.endDate = this.GetDateStr(0, '-', '-');

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
          if (this.screenList[index].type == 'tendency') {
            this.screenData = this.dataIndency
          } else if (this.screenList[index].type == 'mediaType') {

            if (!this.defaultSourceType) {
              this.defaultCheckedKeys = [1, 2, 3]
              this.screenList[3].list = [1, 2, 3]
              this.screenList[3].name = [{"id": 1, "label": "手机新闻"}, {"id": 2, "label": "网络新闻"}, {
                "id": 3,
                "label": "报纸"
              }]
              this.screenList[3].title = '手机新闻,网络新闻,报纸'
            }
            this.screenData = this.dataMediaType
          }

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
          k = '25%'
          content.style.cssText = 'right:0;left:auto;width:100%;padding:0 50px;'
        } else if (this.isStatus == '1') {
          k = '50%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 50px;'
        } else if (this.isStatus == '2') {
          k = '33%'
          content.style.cssText = 'right:auto;left:0;width:100%;padding:0 50px;'
        } else {
          k = '25%'
        }
        var tree = document.getElementsByClassName('el-tree-node')
        for (var i = 0; i < tree.length; i++) {
          tree[i].style.display = 'inline-block'
          tree[i].style.width = k
        }
      },
      // 筛选处选择时间
      selectDate(index) {
        if (index == '0') {
          this.startDate = this.$common.getBeforeDate('6')
          this.endDate = this.$common.getBeforeDate('0')
        } else if (index == '1') {
          this.startDate = this.$common.getBeforeDate('30')
          this.endDate = this.$common.getBeforeDate('0')
        } else if (index == '2') {
          this.startDate = this.$common.getBeforeDate('365')
          this.endDate = this.$common.getBeforeDate('0')
        }
        this.dateArr.forEach((item) => {
          this.$set(item, 'selectStatus', false);
        })
        this.$set(this.dateArr[index], 'selectStatus', true);
      },
      // 点击确认筛选
      submitAll() {
        // alert(this.isStatus);
        if (this.isStatus == 3) {
          this.screenList[3].title = ''
          this.mediaType = '';
        }

        let newObject = this.screenList[this.isStatus];
        let newIndex = this.screenListList[this.isStatus];
        let name = []
        // alert(newObject);
        // console.log(newObject);
        // 当前的object
        this.screenList.forEach((item) => {
          this.$set(item, 'isSelect', false)
        });
        //
        if (newObject.name.length !== 0) {
          name = newObject.name.map(item => {
            return item.label
          });
          if (this.isStatus == 3) {
            this.defaultSourceType = true;
            this.mediaType = name.join(',');
          }

          this.$set(this.screenList[this.isStatus], 'title', name.join(','))
        } else {
          this.defaultSourceType = true;

          if (newIndex.indexOf('选择日期') > -1) {
            if (!this.startDate && !this.endDate) {
              this.$set(this.screenList[this.isStatus], 'title', '选择日期')
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
      },
      // 重置筛选项
      resetAll() {
        this.screenList[this.isStatus].list.forEach((item) => {
          this.$refs.treeScreen.setChecked(item, false, false)
        })
        this.screenList[this.isStatus].list = []
        this.screenList[this.isStatus].name = []
        if (this.screenList[this.isStatus].type == 'date') {
          this.endDate = ''
          this.startDate = ''
        }

        if (this.screenList[this.isStatus].type == 'mediaType') {
          this.defaultSourceType = true;
          this.screenList[this.isStatus].title = '来源类型';
          this.defaultCheckedKeys = []
          this.defaultSource = []
          this.screenData = this.dataMediaTypeCopy
        }
      },
      synchronizationRouter() {
        // 获取筛选开始时间
        if (this.startDate) {
          this.startTime = this.startDate;
        } else {
          this.startTime = this.GetDateStr(-6, '-', '-');
        }

        // 获取筛选结束时间
        if (this.endDate) {
          this.endTime = this.endDate;
        } else {
          this.endTime = this.GetDateStr(0, '-', '-');
        }
        // 获取感情色彩
        var feeling = '';
        var feelingObject = this.screenList[2].name;
        feelingObject.forEach(function (a) {
          feeling += a.label + ',';
        })
        feeling = feeling.slice(0, -1);
        if (feeling) {
          this.tendency = feeling;
        } else {
          this.tendency = '';
        }
        // 获取来源类型
        var source = '';
        var sourceObject = this.screenList[3].name;
        sourceObject.forEach(function (a) {
          source += a.label + ',';
        })
        source = source.slice(0, -1);
        if (source) {
          this.mediaType = source;
        } else {
          this.mediaType = '';
        }

        // alert(this.mediaType);
        // return false;

        this.flip = 1;
        this.setsentimentList();

      },
      // 过滤选择项
      filterNode(value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      currentChange(data, el) {
        if (this.screenList[this.isStatus].type == 'status') {
          this.$refs.treeScreen.setChecked(data.id, true, false);
          //
          if (this.screenList[this.isStatus].list.length > 1) {
            this.resetAll();
            this.$refs.treeScreen.setChecked(data.id, true, false);
          }
        }
      },
      // 选择筛选条件
      handleNodeClick(data) {
        // console.log(data, this.screenList[this.isStatus].type);
        if (this.screenList[this.isStatus].type == 'status') {
          this.$refs.treeScreen.setChecked(data.id, true, false)
          if (this.screenList[this.isStatus].list.length > 0) {
            this.resetAll();
            for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
              if (this.screenList[this.isStatus].list[i] == data.id) {
                this.$refs.treeScreen.setChecked(data.id, false, false)
              }
            }
          }
        } else {
          if (data.children == undefined) {
            this.$refs.treeScreen.setChecked(data.id, true, false)
            for (let i = 0; i < this.screenList[this.isStatus].list.length; i++) {
              if (this.screenList[this.isStatus].list[i] == data.id) {
                this.$refs.treeScreen.setChecked(data.id, false, false)
              }
            }
          }
        }
      },
      handleCheckChange() {
        this.screenList[this.isStatus].list = this.$refs.treeScreen.getCheckedKeys()
        this.screenList[this.isStatus].name = this.$refs.treeScreen.getCheckedNodes()
      },
      // 获取日期区间
      GetDateStr(AddDayCount, year, month, day = '', isYear = true) {
        var dd = new Date();
        dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1); // 获取当前月份的日期，不足10补0
        var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
        if (isYear) {
          return y + year + m + month + d + day;
        } else {
          return m + month + d + day;
        }
      },
      deleteSentimePlan(planId) {
        var _this = this;
//                this.$http.delete('http://dev.in-hope.com.cn/v1/sentimentPlans', {
//                   params:{userId:_this.userId, id:planId}
        this.$axios.sentiment.sentimentDelPlans({
          userId: _this.userId,
          id: planId
        }).then(function (res) {
          _this.getSentimeAsidePlan(_this.sentimentIsUrl);
        }, function (response) {
        });
      },
      // 当没有ID时获取最新一条数据,有ID时取ID
      getSentimeAsidePlan(first = '') {
        // alert(this.getSentimentListData.id);
        this.loading = true;
        var _this = this;
        var planId = '';

        if (this.$route.query.SentimentPlanId) {
          // 当第一是查询的时候
          if (first != '') {
            if (first == 0 || first == 1) {
              planId = this.getSentimentListData.id ? this.getSentimentListData.id : '';
            } else {
              planId = this.$route.query.SentimentPlanId
            }
          } else {
            planId = this.$route.query.SentimentPlanId
          }

        } else {
          planId = this.getSentimentListData.id ? this.getSentimentListData.id : '';
        }

        // if (this.$route.query.SentimentPlanId) {
        //     if (this.getSentimentListData.id) {
        //         planId = this.getSentimentListData.id;
        //     } else {
        //         planId = this.$route.query.SentimentPlanId
        //     }
        // } else {
        //     planId = this.getSentimentListData.id ? this.getSentimentListData.id : '';
        // }

        // var planId = this.getSentimentListData.id ? this.getSentimentListData.id : '';
        // 查找数据用于存贮的数组
        var arr = [];
        var data = {};
        // 获取关键字存储的字符串
        var a = '';
//                this.$http.get('http://dev.in-hope.com.cn/zuul/sentimentPlans', {
//                   params:{userId:_this.userId, id:planId}
        this.$axios.sentiment.sentimentPlans({
          userId: _this.userId,
          id: planId
        }).then(function (res) {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            res.data.returnObject.forEach(function (a, index) {
              if (a.name != '') {
                arr.push(res.data.returnObject[index]);
                data = res.data.returnObject[0];
              }
            })
            if (arr.length) {
              // 获取第一条数据的对象
              _this.firstSentimentListData = data;

              _this.scarchIsShow = true;
              if (arr[0]['include']) {
                a += arr[0]['include'] + ',';
              }
              if (arr[0]['company']) {
                a += arr[0]['company'] + ',';
              }
              if (arr[0]['industry']) {
                a += arr[0]['industry'] + ',';
              }
              if (arr[0]['area']) {
                a += arr[0]['area'] + ',';
              }
              if (arr[0]['manager']) {
                a += arr[0]['manager'] + ',';
              }
              // 关键词拼接
              a = a.slice(',', -1);
              // 获取舆情方案ID
              _this.sentimentPlansId = arr[0]['id'];
              _this.include = a; // 关键词
              _this.noInclude = arr[0]['except']; // 不包含关键词
              _this.setsentimentList();
            } else {
              // var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
              // if (userAgent.indexOf("Chrome") > -1) {
              //   _this.$refs.selfAdaption.style.minHeight = document.documentElement.clientHeight - 229 + 'px';
              // } else {
              //   _this.$refs.selfAdaption.style.minHeight = document.documentElement.clientHeight - 301 + 'px';
              // }

              _this.totalSentimentMonitor = 0;
              _this.companySentimentInfo = '';
              _this.scarchIsShow = false;
              _this.contentAddButton = true;
              _this.loading = false;
              _this.selectBounce = false;
            }
          } else if (res.data.returnCode == 500) {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
            _this.totalSentimentMonitor = 0;
            _this.companySentimentInfo = '';
            _this.selectBounce = false;
          }
        }, function (response) {
        })

      },
      setsentimentList() {
        this.loading = true;
        var _this = this;
        // this.$http.get('http://dev.in-hope.com.cn/zuul/companySentiment/sentimentSearch', {
        //     params:{
        //         // stockCode: _this.companyCode, // 股票代码
        //         startDate: _this.startTime, // 开始时间
        //         endDate: _this.endTime, // 结束时间
        //         tendency: _this.tendency, // 情感色彩
        //         mediaType: _this.mediaType, // 来源类型
        //         pageNum: _this.flip, // 页码
        //         pageSize: _this.pageSize, // 每页显示数
        //         sortField: _this.sortMode, // 排序字段
        //         sortOrder: _this.sortType, // 排序
        //         // keyWord: _this.inputKeyword ? _this.include + ',' + _this.inputKeyword : _this.include, // 包含关键字
        //         // except: _this.noInclude, // 不包含关键字
        //         keyWord: _this.inputKeyword ? _this.inputKeyword : '', // 包含关键字
        //         except: '',
        //         sentimentPlansId: _this.sentimentPlansId,
        //         userId: _this.userId
        //     }
        this.$axios.sentiment.sentimentSearch({
          startDate: _this.startTime, // 开始时间
          endDate: _this.endTime, // 结束时间
          tendency: _this.tendency, // 情感色彩
          mediaType: _this.mediaType, // 来源类型
          pageNum: _this.flip, // 页码
          pageSize: _this.pageSize, // 每页显示数
          sortField: _this.sortMode, // 排序字段
          sortOrder: _this.sortType, // 排序
          // keyWord: _this.inputKeyword ? _this.include + ',' + _this.inputKeyword : _this.include, // 包含关键字
          // except: _this.noInclude, // 不包含关键字
          keyWord: _this.inputKeyword ? _this.inputKeyword : '', // 包含关键字
          except: '',
          sentimentPlansId: _this.sentimentPlansId,
          userId: _this.userId
        }).then(function (res) {
          _this.loading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            var arr = res.data.returnObject;
            for (let i in arr) {
              arr[i].isDescribe = false
            }

            var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
            // 判断当前右侧列表框中是否有数据
            // if (!arr.length) {
            //   if (userAgent.indexOf("Chrome") > -1) {
            //     _this.$refs.selfAdaption.style.minHeight = document.documentElement.clientHeight - 382 + 'px';
            //   } else {
            //     _this.$refs.selfAdaption.style.minHeight = document.documentElement.clientHeight - 372 + 'px';
            //   }
            // } else {
            //   if (arr.length < 7) {
            //     if (userAgent.indexOf("Chrome") > -1) {
            //       _this.$refs.selfAdaption.style.minHeight = document.documentElement.clientHeight - 382 + 'px';
            //     } else {
            //       _this.$refs.selfAdaption.style.minHeight = document.documentElement.clientHeight - 372 + 'px';
            //     }
            //   }
            // }

            // 判断当有搜索词市高亮
            if (_this.inputKeyword) {
              _this.changeColor(arr)
            } else {
              _this.companySentimentInfo = arr;
              if (arr.length) {
                // 默认第一条列表展开
                _this.showDescribe(0);
              }
            }
            _this.totalSentimentMonitor = res.data.total;
            _this.total = Math.ceil(res.data.total / _this.pageSize);

          } else if (res.data.returnCode == 500) {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
            _this.totalSentimentMonitor = 0;
            _this.companySentimentInfo = '';
            _this.selectBounce = false;
          }
        }, function (response) {
        })
      },
      searchSentimentList(val) {
        this.loading = true;
        // var sentimentMonitorkeyword = this.inputContentText;
        // 新关键词
        this.inputKeyword = this.inputContentText.replace(/\s+|&nbsp;/ig, ',');
        // 组合关键词
        // var finallyKeyword;
        // if (this.inputKeyword) {
        //     finallyKeyword = this.include + ',' + this.inputKeyword;
        // } else {
        //     finallyKeyword = this.include;
        // }
        var _this = this;
        // this.$http.get('http://dev.in-hope.com.cn/zuul/companySentiment/sentimentSearch', {
        //     params:{
        //         // stockCode: _this.companyCode, // 股票代码
        //         startDate: _this.startTime, // 开始时间
        //         endDate: _this.endTime, // 结束时间
        //         tendency: _this.tendency, // 情感色彩
        //         mediaType: _this.mediaType, // 来源类型
        //         pageNum: _this.flip, // 页码
        //         pageSize: _this.pageSize, // 每页显示数
        //         sortField: _this.sortMode, // 排序字段
        //         sortOrder: _this.sortType, // 排序
        //         keyWord: _this.inputKeyword, // 包含关键字
        //         except: '', // 不包含关键字
        //         // keyWord: finallyKeyword, // 包含关键字
        //         // except: _this.except, // 不包含关键字
        //         sentimentPlansId: _this.sentimentPlansId,
        //         userId: _this.userId
        //     }
        this.$axios.sentiment.sentimentSearch({
          startDate: _this.startTime, // 开始时间
          endDate: _this.endTime, // 结束时间
          tendency: _this.tendency, // 情感色彩
          mediaType: _this.mediaType, // 来源类型
          pageNum: _this.flip, // 页码
          pageSize: _this.pageSize, // 每页显示数
          sortField: _this.sortMode, // 排序字段
          sortOrder: _this.sortType, // 排序
          keyWord: _this.inputKeyword, // 包含关键字
          except: '', // 不包含关键字
          // keyWord: finallyKeyword, // 包含关键字
          // except: _this.except, // 不包含关键字
          sentimentPlansId: _this.sentimentPlansId,
          userId: _this.userId
        }).then(function (res) {
          _this.loading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            // 进行页码重置
            if (val == 1) {
              _this.flip = 1;
            }
            // 输入的关键词高亮
            _this.newKeyword = _this.inputKeyword;
            var arr = res.data.returnObject;
            for (let i in arr) {
              arr[i].isDescribe = false;
            }
            _this.changeColor(arr)
            _this.totalSentimentMonitor = res.data.total;
            _this.total = Math.ceil(res.data.total / _this.pageSize);

          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
            _this.totalSentimentMonitor = 0;
            _this.companySentimentInfo = '';
            _this.selectBounce = false;
          }

        }, function (response) {
        })
      },
      changeColor(resultsList) {
        resultsList.map((item, index) => {
          // console.log('item', item)
          if (this.newKeyword && this.newKeyword.length > 0) {

            // alert(typeof this.newKeyword.split(','));
            this.newKeyword.split(',').forEach(function (a) {
              // 匹配关键字正则
              // let replaceReg = new RegExp(a, 'g')
              // 高亮替换v-html值
              let replaceString = '<span style="color: #FFB148">' + a + '</span>'
              // 搜索展开所有列表
              resultsList[index].isDescribe = true
              resultsList[index].title = item.title.replace(a, replaceString)
              resultsList[index].summary = item.summary.replace(a, replaceString)
              resultsList[index].media = item.media.replace(a, replaceString)
            })
          }
        })
        // console.log(resultsList);
        this.companySentimentInfo = resultsList;
      },
      // 编辑界面
      updateSentimentData(dataObject) {
        this.$emit('updateSentimentData', dataObject);
      },
      // 选择排序
      selectSort(index) {
        this.loading = true;
        if (this.sort[index].mode == 'off' || this.sort[index].mode == 'asc') {
          for (let i in this.sort) {
            this.sort[i].mode = 'off'
          }
          this.sort[index].mode = 'desc'
        } else {
          for (let i in this.sort) {
            this.sort[i].mode = 'off'
          }
          this.sort[index].mode = 'asc'
        }
        // 排序方法
        this.sortType = this.sort[index].mode;
        // 排序字段
        this.sortMode = this.sort[index].name;
      },
      showAll(sort) {
        if (sort == 'show') {
          for (var i = 0; i < this.companySentimentInfo.length; i++) {
            this.companySentimentInfo[i].isDescribe = true
          }
        } else {
          for (var j = 0; j < this.companySentimentInfo.length; j++) {
            this.companySentimentInfo[j].isDescribe = false
          }
        }
      },
      showDescribe(index) {
        if (!this.companySentimentInfo[index].isDescribe) {
          this.companySentimentInfo[index].isDescribe = true
        } else {
          this.companySentimentInfo[index].isDescribe = false
        }
      },
      // 选择页数
      selectPage(e) {
        this.flip = e
        this.loading = true
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
      changePageSize(page) {
        this.pageSize = page;
        this.flip = 1;
        if (this.inputKeyword) {
          this.searchSentimentList();
        } else {
          this.setsentimentList();
        }
      },
      // 添加一个自定义方案
      addPlans() {
        this.$emit('addCustomPlans')
      }
    }
  }
</script>
<style lang="scss">
  .screen {
    width: 100%;
    margin: 0 auto;
    height: auto;
    padding: 0;
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
          flex: 0 0 25%;
          text-align: right;
          // margin-right: 0;
          .el-tooltip {
            padding-right: 15px;
          }
          .iconfont {
            position: relative;
            left: -14px;
          }
          .isActive {
            .iconfont {
              padding-right: 0;
            }
          }
        }
        &:first-child {
          flex: 0 0 15%;
          border-bottom-color: #e3e3e3;
          text-align: left;
          border-right: 0;
          border-left: 1px solid #fff;
          .el-tooltip {
            padding-left: 16px;
          }
          .isActive {
            color: #FFAC38;
            box-sizing: border-box;
            height: 46px;
            width: 132px;
            /*text-align: center;*/
            padding-top: 8px;
            margin-top: 3px;
            /*padding-right: 20px;*/
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
  @import "../../../../static/css/animate";
</style>

<style lang="scss" scoped>

  .company-card-nopadding-740 {
    min-height: 740px;
  }
  .company-card-nopadding-587 {
    min-height: 587px;
  }
  .company-card-body .card-fold-list {
    ul {
      padding: 0 15px;
    }
    .fold-list-header {
      background-color: #F8F8F8;
      margin-top: 0;
      height: 40px;
      line-height: 40px;
      font-size: 12px;
      color: #8D8D8D;
      padding: 0 15px;
    }
  }
  .card-fold-list {
    .fold-list-header .list-header-page {
      float: right;
      /*margin-right: 12px;*/
      span {
        color: #545454;
        margin: 0 6px;
        font-size: 14px;
        position: relative;
        top: 1px;
      }
    }
    li {
      width: 100%;
      overflow: hidden;
      border-bottom: 1px solid #D8D8D8;
      &:last-child {
        border-bottom: none;
      }
      &:hover {
        .list-title-xs, .list-title-num, .fold-list-title a {
          color: #FFB148;
        }
      }
    }
    .list-title-block {
      float: left;
      display: block;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      color: #323232;
    }
    .list-content-block {
      float: left;
      display: inline-block;
      line-height: 40px;
    }
    .list-title-num {
      width: 80px;
      text-align: right;
      /*padding-right: 10px;*/
    }
    .list-title-xs {
      width: 60px;
    }
    .list-title-sm {
      width: 80px;
    }
    .list-title-md {
      width: 120px;
    }
    .list-title-lg {
      width: 140px;
    }
    .list-content-lg {
      width: calc(100% - 140px);
      padding-right: 180px;
    }
    .fold-list-title {
      float: left;
      width: 100%;
      height: 40px;
      line-height: 40px;
      /*padding-right: 15px;*/
      overflow: hidden;
      -webkit-line-clamp: 1;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      font-size: 14px;
      color: #323232;
      .a-link {
        color: #323232;
        display: inline-block;
        height: 100%;
        width: 100%;
      }
    }
    .fold-list-subtitle {
      display: none;
      /*float: left;*/
      width: 100%;
      padding-top: 4px;
      font-size: 12px;
      text-overflow: ellipsis;
      line-height: 16px;
      max-height: 34px;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .fold-list-tips {
      position: relative;
      padding-top: 7px;
      color: #AEAEAE;
      font-size: 12px;
      a {
        font-size: 12px;
        color: #FFB148;
        margin-left: 5px;
        text-decoration: underline;
      }
      .list-tips-left {
        display: none;
      }
      .list-tips-right {
        display: inline-block;
        line-height: 40px;
        float: right;
        position: absolute;
        right: -180px;
        top: 0;
        a {
          text-decoration: none;
          font-size: 12px;
          color: #AEAEAE;
          margin-left: 0;
        }
      }
    }
    .list-content-highlight {
      color: #FF7844;
    }
    li.active {
      overflow: hidden;
      padding: 10px 0;
      .list-title-block {
        height: 20px;
        line-height: 20px;
      }
      .list-content-block {
        height: auto;
        line-height: 20px;
      }
      .fold-list-title {
        font-weight: 800;
        height: 20px;
        line-height: 20px;
        /*margin-bottom: 5px;*/
      }
      .list-content-lg {
        padding-right: 0;
      }
      .fold-list-subtitle, .fold-list-tips {
        display: flex; /* Chrome 29+, Firefox 22+, IE 11+, Opera 12.1/17/18, Android 4.4+ */
        display: -ms-flexbox; /* IE 10 */
        display: -moz-flex; /* Firefox 18+ */
        display: -webkit-flex; /* Chrome 21+, Safari 6.1+, iOS Safari 7+, Opera 15/16 */
        display: -moz-box; /* Firefox 17- */
        display: -webkit-box; /* Chrome 4+, Safari 3.1, iOS Safari 3.2+ */
      }
      .fold-list-tips {
        height: 25px;
      }
      .list-tips-left {
        display: inline-block;
      }
      .list-tips-right {
        line-height: 20px;
        right: 0;
        top: 6px;
      }
    }
    .list-note-tips {
      font-size: 12px;
      color: #8D8D8D;
      padding-left: 12px;
      padding-top: 8px;
    }
  }
  .sort {
    div {
      display: inline-block;
    }
    .el-dropdown-link {
      margin-right: 50px;
      cursor: pointer;
      float: left;
    }
    div i {
      display: inline-block;
      color: #a6a6a6;
      margin-left: 8px;
      font-size: 8px;
    }
  }
  .icon-sort {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../../assets/image/sentiment/icon/icon-sort.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-sort-desc {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../../assets/image/sentiment/icon/icon-sort-desc.svg) no-repeat center;
    background-size: 100%;
  }
  .icon-sort-asc {
    display: inline-block;
    width: 10px;
    height: 14px;
    position: relative;
    top: 2px;
    background: url(../../../assets/image/sentiment/icon/icon-sort-asc.svg) no-repeat center;
    background-size: 100%;
  }
  .showDescribe {
    /*margin-right: 15px;*/
    color: #8d8d8d;
    float: right;
    font-size: 12px;
  }
  .showDescribeText, .hideDescribeText {
    display: block;
  }
  .showDescribe:hover {
    .showDescribeNum, .hideDescribeNum {
      display: block;
    }
  }
  .showDescribeNum, .hideDescribeNum {
    display: none;
  }
  .showDescribe:hover {
    .showDescribeText, .hideDescribeText {
      display: none;
    }
  }
  .showDescribeNum i:hover, #hideDescribeNum i:hover {
    color: #ffb148;
  }
  .pageSizeBox {
    float: right;
    position: absolute;
    right: 30px;
    bottom: 20px;
    .pageSizeBtn {
      display: inline-block;
      width: 46px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 14px;
      color: #8D8D8D;
      border: 1px solid #E3E3E3;
      cursor: pointer;
      &.active {
        color: #ffffff;
        border: 1px solid #FFB148;
        background: #FFB148;
      }
    }
    .pageSizeLeft {
      position: relative;
      left: 6px;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .pageSizeRight {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
  #company-body {
    .el-row {
      margin: 0 -10px;
    }
    .company-card {
      margin: 10px 10px;
      padding: 10px 15px 20px;
      border-radius: 8px;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      }
    }

    .company-card-nopadding {
      margin: 10px;
      padding: 0 0 20px;
      border-radius: 8px;
      min-height: 443px;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      }
      .company-card-header {
        padding: 0 15px 10px;
        overflow: hidden;
      }
    }
    .company-card-header {
      border-bottom: 1px solid #E3E3E3;
      padding-bottom: 8px;
      overflow: hidden;
    }
    .company-card-nopadding .company-card-header {
      padding: 0 15px 10px;
    }
    .company-card-header {
      .company-card-title {
        float: left;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        font-weight: 800;
        color: #323232;
      }
      .company-card-link {
        float: right;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        font-weight: 400;
        color: #AEAEAE;
      }
      .company-card-select, .company-card-bth {
        float: right;
        height: 24px;
      }
      .el-input--small .el-input__inner {
        height: 24px;
        line-height: 24px;
      }
      .company-card-input {
        height: 30px;
        line-height: 30px;
        margin-bottom: 15px;
        input {
          width: 170px;
          height: 30px;
          background: #F8F8F8;
          border: 1px solid #E3E3E3;
          border-radius: 4px;
          margin-left: 8px;
          color: #323232;
          padding-left: 30px;
        }
        .iconfont {
          position: absolute;
          left: 110px;
          z-index: 99;
          color: #AEAEAE;
        }
      }
    }
    .company-card-body {
      overflow: hidden;
      padding-top: 10px;
    }
    .company-card-nopadding .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
  }
  .card-body-title {
    margin-top: -10px;
    .card-title-number {
      font-size: 36px;
      font-weight: 800;
      color: #FC6D40;
      margin-right: 5px;
    }
    .card-title-name {
      font-size: 16px;
      color: #323232;
      margin-right: 5px;
    }
    .card-title-date {
      font-size: 12px;
      color: #AEAEAE;
    }
    .card-title-btn {
      float: right;
      width: 70px;
      height: 30px;
      background: #FFB148;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      color: #fff;
    }
  }
  .card-search-box {
    margin-top: 12px;
    .search-content {
      height: 40px;
      .search-input-sm {
        float: left;
        width: 220px;
        height: 40px;
        position: relative;
        margin-right: 20px;
      }
      .search-input-lg {
        float: left;
        width: 620px;
        height: 40px;
        position: relative;
      }
      .search-input-block {
        float: left;
        width: 100%;
        height: 40px;
        position: relative;
      }
      .search-input {
        position: absolute;
        left: 0;
        height: 40px;
        border: 1px solid #E3E3E3;
        border-radius: 2px;
        padding: 0 12px 0 57px;
      }
      .search-input-title {
        position: absolute;
        left: 0;
        width: 45px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #545454;
        background: #F8F8F8;
        border: 1px solid #E3E3E3;
        z-index: 99;
      }
      .search-input-btn {
        position: absolute;
        right: 0;
        width: 125px;
        height: 40px;
        background: #ffb148;
        border: 0;
        outline: none;
        font-size: 22px;
        border-radius: 0;
        color: #fff;
        padding: 0;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        z-index: 99;
      }
    }
    .search-input-sm .search-input {
      width: 220px;
      padding: 0 57px;
    }
    .search-input-lg .search-input {
      width: 620px;
      padding: 0 12px 0 57px;
    }
    .search-input-block .search-input {
      width: 100%;
      padding: 0 12px 0 57px;
    }
    .search-input-title {
      &.search-input-title-left {
        left: 0;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      &.search-input-title-right {
        left: 175px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
    }
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
  .noInfo {
    min-height: 250px !important;
  }
  #noInfoDefault {
    margin-left: 370px;
    margin-top: -27px;
    width: auto;
    height: auto;
    font-size: 14px;
    /*color: #FFb148;*/
    color: #FBD9A6;
  }
</style>
