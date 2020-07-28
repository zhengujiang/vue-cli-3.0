<template>
  <div id="sentimentList">
    <div class="el-card company-card-nopadding">
      <div class="company-card-body">
        <!--筛选-->
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
        <div class="card-fold-list">
          <div class="fold-list-header">
            <!--排序-->
            <div class="sort">
              <div class="el-dropdown-link" v-for="(list,index) in sort.sortList" :key="index"
                   @click.prevent="selectSort(index)">
                                <span v-show="list.isShow">{{ list.name }}
                                    <i v-if="list.mode== ''" class="iconfont web-sort"></i>
                                    <i v-else-if="list.mode== 'desc'" class="iconfont web-sort-desc"></i>
                                    <i v-else-if="list.mode== 'asc'" class="iconfont web-sort-asc"></i>
                                </span>

              </div>
            </div>
            <!--翻页-->
            <span class="list-header-page">
                            <v-page v-show="!noInfo" :flip="page.flip" :total="page.total" v-on:addition="addition"
                                    v-on:subtraction="subtraction"></v-page>
                        </span>
          </div>

          <div class="fold-list-body">
            <ul>
              <li v-for="(info,index) in listInfo" :key="index" :class="{active: info.isDescribe}">
                <a>
                  <div class="list-title-block list-title-num">{{info.heat}}</div>

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
                                        <span class="list-tips-left">
                                            <span v-if="mediaState == false">{{info.media}}</span>
                                            <span v-if="mediaState == true" style="color: #FFB148">{{info.media}}</span>
                                            <a @click="openTimeAsisi(info.title, info.companyId)"><span>{{info.reprinted}}</span>条相似</a></span>
                      <span class="list-tips-right">{{$common.transTime(info.dateTime)[0]}}&nbsp;&nbsp;|&nbsp;&nbsp;
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
            <no-info v-show="noInfo"></no-info>
            <div class="pagination" v-show="!noInfo">
              <div class="block" style="width: 100%;padding: 20px;position: relative;">
                <el-pagination background
                               @current-change="selectPage"
                               layout="prev, pager, next"
                               :current-page="page.flip"
                               :page-count="page.total">
                </el-pagination>

                <div class="pageSizeBox" v-if="page.pageSize == '30'">
                  <a class="pageSizeBtn pageSizeLeft active" @click="changePageSize('30')">30条</a>
                  <a class="pageSizeBtn pageSizeRight" @click="changePageSize('50')">50条</a>
                </div>
                <div class="pageSizeBox" v-else-if="page.pageSize == '50'">
                  <a class="pageSizeBtn pageSizeLeft " @click="changePageSize('30')">30条</a>
                  <a class="pageSizeBtn pageSizeRight active" @click="changePageSize('50')">50条</a>
                </div>
                <div class="pageSizeBox" v-else="page.pageSize">
                  <a class="pageSizeBtn pageSizeLeft " @click="changePageSize('30')">30条</a>
                  <a class="pageSizeBtn pageSizeRight" @click="changePageSize('50')">50条</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--</template>-->
    </div>
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
    name: "sentimentList",
    mixins: [mixins],
    components: {
      VCompanyAnswerItem,
      VCompanyQuestionItem,
      VInvestorQuestionItem,
      NoInfo,
      VPage
    },
    props: {
      getSentimentListData: {
        type: [Object, String]
      },
      getId: {
        type: Number
      },
      deletesentimeAsidePlanId: {
        type: [Number, String]
      },
      page: {
        flip: '',
        total: '',
        pageSize: ''
      },
      sort: {
        sortType: '',
        sortMode: '',
        sortList: []
      },
      listInfo: {
        type: [Array, String],
        default: false
      },
      noInfo: {
        type: Boolean,
        default: false
      },
      condition: {
        "tendency": '',
        "mediaType": '',
        "inputKeyword": '',
        "media": '',
        "startDate": '',
        "endDate": '',
        "stockName": '',
        "value": ''
      },
      mediaState: false
    },
    data() {
      return {
        autoNo: ['重置', '确认', '搜索筛选条件'],
        // 筛选区
        screenListList: ['全部', '选择日期', '情感色彩', '来源类型', '关键词'], // 筛选默认显示的title格式
        screenList: [
          {id: 0, name: [], title: '全部', class: 'all', type: 'global', isSelect: true, list: []},
          {id: 1, name: [], title: '选择日期', class: 'time', type: 'date', isSelect: false, list: []},
          {id: 2, name: [], title: '情感色彩', class: '', type: 'tendency', isSelect: false, list: []},
          {id: 3, name: [], title: '来源类型', class: '', type: 'mediaType', isSelect: false, list: []}
//                    {id: 4, name: [], title: '关键词', class: '', type: 'keyWord', isSelect: false, list: []}
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
        dataIndencyCopy: [
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
        startDate: '',
        endDate: '',
        monthDate: '',
        monthEnd: '',
        describeText: '',
        keyWord: '',
        except: '',
        tendency: '',
        mediaType: '',
        stockName: '',
        media: '',
        userId: this.$cookie.get('userId'),
        // 获取公司股票代码
        companyCode: window.JSON.parse(this.$cookie.get('userInfo')).enterpriseCompanyCode,
        // 包含关键词
        include: '',
        // 不包含关键词
        noInclude: '',
        openTimeAsis: false
      }
    },
    watch: {
      page: {
        handler(newVal, oldVal) {
          var page = newVal.flip
          this.$emit('changePage', page)
        },
        deep: true
      },
      sort: {
        handler(newVal, oldVal) {
          var type = newVal.sortType
          var mode = newVal.sortMode
          this.$emit('changeSort', type, mode)
        },
        deep: true
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
      boxContent(val) {
        if (this.boxContent) {
        } else {
          this.screenList[0].isSelect = true
        }
        this.$emit('boxContent', val)
        this.itemStyle()
      },
      filterText(val) {
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
      isStatus(val) {
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
    created() {
      this.tendency = this.condition.tendency;
      this.mediaType = this.condition.mediaType;
      this.keyWord = this.condition.inputContentText;
      this.stockName = this.condition.searchName;
      this.startDate = this.condition.startDate;
      this.endDate = this.condition.endDate;
      this.media = this.condition.media;
      console.log('this.condition.startDate', this.condition.startDate)
      console.log('this.condition.endDate', this.condition.endDate)
      if (this.condition.startDate) {
        this.screenList[1].title = this.startDate + '-' + this.endDate;
      }

      if (this.condition.tendency) {
        this.screenList[2].title = this.tendency;
      }

      if (this.condition.value == 2) {
        this.screenList[3].title = "手机新闻,网络新闻,报纸";
      } else {
        if (this.condition.mediaType) {
          this.screenList[3].title = this.mediaType;
        }
        this.screenList[0].isSelect = false;
      }

      // console.log(this.defaultCheckedKeys)
    },
    methods: {
      openTimeAsisi(data, code) {
        // console.log(data)
        data = data.replace(/<\/?.+?>/g, "");
        var res = {
          "data": data,
          "code": code
        }
        this.$emit('openTimeAsis', res);
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
          this.boxContent = false
          this.screenList.forEach((item, index) => {
            console.log('item_III', item)
            item.list = []
            item.name = []
            item.title = this.screenListList[index];
          });
          this.startDate = '';
          this.endDate = '';
          this.tendency = '';
          this.mediaType = '';

          this.submitAll()
        } else {
          // 其他
          if (this.screenList[index].type == 'date') {
            this.boxContentTi = false
          }
          if (this.screenList[index].type == 'tendency') {
            if (this.tendency == '正面') {
              this.defaultCheckedKeys = [0]
              this.screenList[2].list = [0]
              this.screenList[2].name = [{"id": 0, "label": "正面"}]
              this.screenList[2].title = "正面"
            } else if (this.tendency == '中性') {
              this.defaultCheckedKeys = [1]
              this.screenList[2].list = [1]
              this.screenList[2].name = [{"id": 1, "label": "中性"}]
              this.screenList[2].title = "中性"
            } else if (this.tendency == '负面') {
              this.defaultCheckedKeys = [2]
              this.screenList[2].list = [2]
              this.screenList[2].name = [{"id": 2, "label": "负面"}]
              this.screenList[2].title = "负面"
            }
            this.screenData = this.dataIndency
          } else if (this.screenList[index].type == 'mediaType') {
            if (this.condition.value == 2) {
              this.defaultCheckedKeys = [1, 2, 3]
              this.screenList[3].list = [1, 2, 3]
              this.screenList[3].name = [{"id": 1, "label": "手机新闻"}, {"id": 2, "label": "网络新闻"}, {
                "id": 3,
                "label": "报纸"
              }]
              this.screenList[3].title = '手机新闻,网络新闻,报纸'
            } else if (this.mediaType == '论坛') {
              this.defaultCheckedKeys = [0]
              this.screenList[3].list = [0]
              this.screenList[3].name = [{"id": 0, "label": "论坛"}]
              this.screenList[3].title = '论坛'
            } else if (this.mediaType == '手机新闻') {
              this.defaultCheckedKeys = [1]
              this.screenList[3].list = [1]
              this.screenList[3].name = [{"id": 1, "label": "手机新闻"}]
              this.screenList[3].title = '手机新闻'
            } else if (this.mediaType == '网络新闻') {
              this.defaultCheckedKeys = [2]
              this.screenList[3].list = [2]
              this.screenList[3].name = [{"id": 2, "label": "网络新闻"}]
              this.screenList[3].title = '网络新闻'
            } else if (this.mediaType == '报纸') {
              this.defaultCheckedKeys = [3]
              this.screenList[3].list = [3]
              this.screenList[3].name = [{"id": 3, "label": "报纸"}]
              this.screenList[3].title = '报纸'
            }
            this.screenData = this.dataMediaType
          }
//                    else if (this.screenList[index].type == 'keyWord') {
//                        this.screenData = this.dataKeyWord
//                    }
//                    this.screenDate = this.allMapping[index];
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
        if (this.isStatus == 2) {
          this.screenList[2].title = ''
          this.tendency = '';
        }

        if (this.isStatus == 3) {
          this.screenList[3].title = ''
          this.mediaType = '';
        }

        this.page.index = 1
        let newObject = this.screenList[this.isStatus];
        let newIndex = this.screenListList[this.isStatus];
        let name = []
        console.log('[this.isStatus]', newObject)
        console.log('[this.isStatus]', newIndex)
        // 当前的object
        this.screenList.forEach((item) => {
          this.$set(item, 'isSelect', false)
        });
        if (newObject.list.length !== 0) {
          name = newObject.name.map(item => {
            return item.label
          });

          if (this.isStatus == 2) {
            this.tendency = name.join(',');
          }
          if (this.isStatus == 3) {
            if (this.condition.value == 2) {
              this.condition.value = 1
            }

            this.mediaType = name.join(',');
          }

          this.$set(this.screenList[this.isStatus], 'title', name.join(','))
        } else {
          //
          if (newIndex.indexOf('选择日期') > -1) {
            if (!this.startDate && !this.endDate) {
              this.$set(this.screenList[this.isStatus], 'title', '选择日期')
            } else {
              this.$set(this.screenList[this.isStatus], 'title', this.startDate + '-' + this.endDate)
            }
          } else {
            this.$set(this.screenList[this.isStatus], 'title', newIndex);
          }

          if (this.isStatus == 3) {
            this.condition.value = 1
          }
        }

        this.boxContent = false;
        // 用户状态保存
        this.synchronizationRouter()
        // this.searchList()
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
        if (this.screenList[this.isStatus].type == 'tendency') {
          this.tendency = ''
          this.screenList[this.isStatus].title = '情感色彩'
          this.defaultCheckedKeys = []
          this.screenData = this.dataIndencyCopy
        }
        if (this.screenList[this.isStatus].type == 'mediaType') {
          if (this.condition.value == 2) {
            this.condition.value = 1
          }
          this.mediaType = ''
          this.screenList[this.isStatus].title = '来源类型'
          this.defaultCheckedKeys = []
          this.screenData = this.dataMediaTypeCopy
        }

      },
      synchronizationRouter() {
        var all;
        if (this.isStatus == 0) {
          all = 1;
        } else {
          all = 2;
        }
        // 获取筛选开始时间
        var startDate = this.startDate;
        // 获取筛选结束时间
        var endDate = this.endDate;

        // 获取感情色彩
        var feeling = '';
        if (this.tendency) {
          feeling = this.tendency
        } else {
          var feelingObject = this.screenList[2].name;
          feelingObject.forEach(function (a) {
            feeling += a.label + ',';
          })
          feeling = feeling.slice(0, -1);
        }

        // 获取来源类型
        var source = '';
        if (this.mediaType) {
          source = this.mediaType
        } else {
          var sourceObject = this.screenList[3].name;
          sourceObject.forEach(function (a) {
            source += a.label + ',';
          })
          source = source.slice(0, -1);
        }

        var filterScreenData = {
          'startDate': startDate,
          'endDate': endDate,
          'feeling': feeling,
          'source': source,
          'all': all
//                    'keyWord': keyWord
        }

        this.$emit("clickScreenData", filterScreenData);
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
      // 选择排序
      selectSort(index) {
        if (this.sort.sortList[index].mode == '') {
          for (let i in this.sort.sortList) {
            this.sort.sortList[i].mode = ''
          }
          this.sort.sortList[index].mode = 'desc'
          this.sort.sortType = this.sort.sortList[index].name
        } else if (this.sort.sortList[index].mode == 'desc') {
          for (let i in this.sort.sortList) {
            this.sort.sortList[i].mode = ''
          }
          this.sort.sortList[index].mode = 'asc'
          this.sort.sortType = this.sort.sortList[index].name
        } else if (this.sort.sortList[index].mode == 'asc') {
          for (let i in this.sort.sortList) {
            this.sort.sortList[i].mode = ''
          }
          this.sort.sortType = ''
        }

        this.sort.sortMode = this.sort.sortList[index].mode
        // console.log('排序方法', this.sortType, this.sortMode)
      },
      selectCode(e) {
        this.inputCode = this.gridData[e].code
      },
      selectText(e) {
        this.inputText = this.gridText[e]
      },
      inputFocus() {
        this.boxContClick()
      },
      showAll(sort) {
        if (sort == 'show') {
          for (var i = 0; i < this.listInfo.length; i++) {
            this.listInfo[i].isDescribe = true
          }
        } else {
          for (var j = 0; j < this.listInfo.length; j++) {
            this.listInfo[j].isDescribe = false
          }
        }
      },
      showDescribe(index) {
        if (!this.listInfo[index].isDescribe) {
          this.listInfo[index].isDescribe = true
        } else {
          this.listInfo[index].isDescribe = false
        }
      },
      // 选择页数
      selectPage(e) {
        this.page.flip = e
        this.loading = true
      },
      // 页数加一
      addition() {
        if (this.page.flip < this.page.total) {
          this.page.flip += 1
        }
      },
      // 页数减一
      subtraction() {
        if (this.page.flip > 1) {
          this.page.flip -= 1
        }
      },
      changePageSize(page) {
        this.page.pageSize = page;
        this.page.flip = 1;
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
          /*padding-right: 16px;*/
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

  .company-card-nopadding {
    margin: 10px;
    padding: 0 0 20px;
    border-radius: 8px;
    border: none;
    &:hover {
      -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
    }
    .company-card-header {
      padding: 0 15px 10px;
      overflow: hidden;
    }
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
      font-size: 16px;
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
      font-size: 14px;
      text-overflow: ellipsis;
      line-height: 1.5;
      max-height: 3em;
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
    /*margin-right: 5px;*/
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
</style>
