<template>
  <div id="header">
    <el-row class="content">
      <el-col :span="3" class="logo" v-if="!enterpriseUser">
        <img class='xiaoan-logo' src="../assets/image/header/logo.png" title="信公小安" @click="backs('index')">
        <div class="beta">Beta</div>
      </el-col>
      <el-col :span="3" class="companyInfo" v-else>
        <img class="index-img" src="../assets/image/index/index.png" :title="companyName" @click="backs('dashboard')">
        <span class="companyName-title" @click="backs('dashboard')">{{companyName}}</span>
        <!--<div class="beta">Beta</div>-->
      </el-col>
      <el-col :span="15" class="nav">
        <ul>
          <li v-for="(list,index) in menu" :key="index" :class="{active:(activeId == list.id || list.act)}"
              @click="goMenuLink(list)" @mouseenter="enter(index)" @mouseleave="leave(index)">
            <!--@click="selectMethod(index)" -->
            {{ list.name }}
            <!--<img alt="new" id="newTip" src="../assets/image/header/new.png" v-if="list.name == '投资者关系'">-->
            <img alt="new" class="newTip" src="../assets/image/header/new.png" v-if="list.new">
            <img alt="new" class="newTip" src="../assets/image/header/beta.png" v-if="list.beta">
            <img alt="new" class="newTip" src="../assets/image/header/competition.png" v-if="list.competition">
            <i class="el-icon-caret-top iActive" v-show="list.act && list.children.length>0"></i>
          </li>
        </ul>
      </el-col>
      <el-col :span="6" class="user userName" v-if="!isLogin">
        <span class="menuSpan friend" @click="$router.push('/manage/purchase')">开通企业版</span>
        <el-button class="login" size="mini" @click="login">登录</el-button>
        <div class="split"></div>
        <el-button class="reg" size="mini" type="primary" @click="register">注册</el-button>
      </el-col>
      <el-col :span="6" class="user userName" v-else>
        <!--<template v-if="isRootUser">
          <span class="menuSpan friend" @click="$router.push('/admin/members/invite')">
             <span class="text">邀请好友</span>
            <i class="iconfont icon-yaoqinghaoyou"></i>
          </span>
          <div class="split"></div>
        </template>-->

        <template v-if="enterpriseUser">
          <span class="menuSpan friend" @click="inviteDialog=true">邀请注册</span>
          <div class="split"></div>
        </template>
        <template v-else>
          <span class="menuSpan friend" @click="$router.push('/manage/purchase')">开通企业版</span>
          <div class="split"></div>
        </template>
        <el-popover v-model="messageTop" :visible-arrow="false" popper-class="popover-message" @show="popoverShow"
                    ref="popover" :open-delay="0" placement="top-end" width="390" trigger="click">
          <div class="popover-content">
            <message-item @set-fallback="messageActive" :setUpdate="setUpdate"></message-item>
          </div>
          <el-badge :hidden="allUserData.readMsgCount <= 0" :value="allUserData.readMsgCount" :max="99" class="item"
                    :slot="'reference'">
            <span class="menuSpan" title="通知">
              <span class="text">通知</span>
              <i class="iconfont icon-xiaoxi"></i>
            </span>
          </el-badge>
        </el-popover>
        <div class="split"></div>
        <!---->
        <el-dropdown @command="handleCommand" class="downUser" @visible-change="hideMenu">
          <span class="el-dropdown-link">
            <span class="vxa-user-name">{{userName}}</span><i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="userMenu">
            <el-dropdown-item command="manage">账号管理</el-dropdown-item>
            <el-dropdown-item command="works">我的创作</el-dropdown-item>
            <el-dropdown-item command="follow/users">我的关注</el-dropdown-item>
            <el-dropdown-item command="favorite">我的收藏</el-dropdown-item>
            <el-dropdown-item command="share">我的分享</el-dropdown-item>
            <el-dropdown-item command="admin/members/manage" style="border-top: 1px solid #6d6e6f;" v-if="isRootUser">
              企业管理
            </el-dropdown-item>
            <!--<el-dropdown-item command="subscribe">我的订阅</el-dropdown-item>-->
            <!--<el-dropdown-item command="lookupTables">我的权限速查表</el-dropdown-item>-->
            <!--<el-dropdown-item command="calendar">我的日历</el-dropdown-item>-->
            <el-dropdown-item command="exit">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <!---->
    <div class="head-pull-down">
      <div class="forData" v-for="(list,index) in menu" v-show="list.children.length>0">
        <!--<transition name="el-zoom-in-top">-->
        <div class="zoom" v-show="list.act" @mouseleave="pullLeave(index)">
          <!--<div class="zoom" @mouseleave="pullLeave(index)">-->
          <div class="menuBox content" :class="list.class">
            <ul class="menuItem" v-for="(item,index) in list.children">
              <!--二级导航，有子菜单，不可点击-->
              <li class="menu1" v-if="item.children.length>0">
                {{item.name}}
                <img alt="new" class="newTip" src="../assets/image/header/new.png" v-if="item.new">
              </li>
              <!--二级导航，无菜单，可点击-->
              <li class="menu2" @click="goMenuLink(item)" v-else :class="[{actMenu:activeIdAll == item.id}]">
                {{item.name}}
                <img alt="new" class="newTip" src="../assets/image/header/new.png" v-if="item.new">
                <img alt="new" class="newTip" src="../assets/image/header/beta.png" v-if="item.beta">
              </li>
              <!--三级菜单-->
              <template v-if="item.children.length>0">
                <!--<li class="menu3" @click="goMenuLink(item2)" v-for="(item2,index2) in item.children" :class="{actMenu:activeIdAll == item2.id}" v-if="(enterpriseUser && !item2.supervise) || (superviseUser && !item2.enterprise)">
                  {{item2.name}}
                  <img alt="new" class="newTip" src="../assets/image/header/new.png" v-if="item2.new">
                  <img class="enterprise-icon" src="../assets/image/header/enterprise.png" v-if="item2.level == 2">
                </li>-->
                <template v-if="superviseUser">
                  <li class="menu3" @click="goMenuLink(item2)" v-for="(item2,index2) in item.children"
                      :class="{actMenu:activeIdAll == item2.id}" v-if="superviseUser && !item2.enterprise">
                    {{item2.name}}
                    <img alt="new" class="newTip" src="../assets/image/header/new.png" v-if="item2.new">
                    <img class="enterprise-icon" src="../assets/image/header/enterprise.png" v-if="item2.level == 2">
                  </li>
                </template>
                <template v-else>
                  <li class="menu3" @click="goMenuLink(item2)" v-for="(item2,index2) in item.children"
                      :class="{actMenu:activeIdAll == item2.id}" v-if="!item2.supervise">
                    {{item2.name}}
                    <img alt="new" class="newTip" src="../assets/image/header/new.png" v-if="item2.new">
                    <img class="enterprise-icon" src="../assets/image/header/enterprise.png" v-if="item2.level == 2">
                  </li>
                </template>

              </template>
            </ul>
          </div>
          <div class="clearBoth"></div>
        </div>
        <!--</transition>-->
      </div>
    </div>

    <el-dialog class="authDialog" title="企业版本专享功能" :visible.sync="authDialog" width="620px" center top="28vh">
      <div class="message">该功能为企业版用户专享功能，前往查看企业版专享功能吧！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goEnterprise">查看企业版</el-button>
      </span>
    </el-dialog>

    <!--<el-dialog class="authDialog" title="监管版本专享功能" :visible.sync="authDialog" width="620px" center top="28vh">
      <div class="message">该功能为监管版用户专享功能，请设置监管公司！</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="goEnterprise">设置</el-button>
      </span>
    </el-dialog>-->

    <el-dialog class="inviteDialog" :visible.sync="inviteDialog" width="20%" center :show-close="false"
               :close-on-click-modal="false">
      <img class="inviteclose" src="../assets/image/header/invite-close.png" @click="inviteDialog=false">
      <v-headerInvite :num="inviteNum"></v-headerInvite>
    </el-dialog>

  </div>
</template>
<script>
  import MessageItem from '../components/message/messageItem'
  import headerInvite from '@/components/header/invite'
  export default {
    components: {
      MessageItem,
      'v-headerInvite': headerInvite
    },
    name: 'header',
    data() {
      return {
        messageTop: false,
        getMyInfoData: {},
        // companyName: '',
        activeId: '',  // 一级导航id
        activeIdAll: '', // 导航id
        /* column: [
          {show: false, item: '首页', isSelect: true, to: 'index'},
          {show: false, item: '法规', isSelect: false, to: 'rule'},
          {show: false, item: '公告', isSelect: false, to: 'affiche'},
          {show: false, item: '案例', isSelect: false, to: 'cases'},
          {show: false, item: '研报', isSelect: false, to: 'report'},
          {show: false, item: '权限速查表', isSelect: false, to: 'lookuptables'},
          {show: false, item: '日历', isSelect: false, to: 'calendar'}
        ], */
        menu: [
          {
            id: '0', name: '首页', act: false, link: 'dashboard', children: [], level: 0
          },
          {
            id: '1', name: '信公大数据', act: false, link: '', new: 'true',
            children: [
              {
                id: '1_1', name: '法规', act: false, link: '', new: true,
                children: [
                  {id: '1_1_1', name: '法规检索', act: false, link: 'rule'},
                  {id: '1_1_2', name: '法规汇编', act: false, link: 'ruleCollect'},
                  // {id: '1_1_2', name: '法规汇编', act: false, link: 'follow/regulations'},
                  // {id: '1_1_3', name: '法规收藏', act: false, link: 'favorite-rule'},
                  {id: '1_1_3', name: '法规解读', act: false, link: 'business/swift#3'},
                  {id: '1_1_4', name: '小安读法规', act: false, new: 'true', link: 'rule?havenote=1', level: 1}
                ]
              },
              {
                id: '1_2', name: '公告', act: false, link: '',
                children: [
                  {id: '1_2_1', name: '公告检索', act: false, link: 'affiche'},
                  {
                    id: '1_2_2',
                    name: '本公司公告',
                    act: false,
                    link: 'affiche?inputCode=' + encodeURIComponent('本公司'),
                    level: 1,
                    enterprise: true,
                    supervise: false
                  },
                  {
                    id: '1_2_4',
                    name: '监管公司公告',
                    act: false,
                    link: 'affiche?inputCode=' + encodeURIComponent('监管公司'),
                    level: 2,
                    enterprise: false,
                    supervise: true
                  },
                  {
                    id: '1_2_3',
                    name: '关注公司公告',
                    act: false,
                    link: 'affiche?inputCode=' + encodeURIComponent('关注公司'),
                    level: 1
                  },
                  {
                    id: '1_2_5',
                    name: '可比公司公告',
                    act: false,
                    link: 'affiche?inputCode=' + encodeURIComponent('可比公司'),
                    level: 2,
                    enterprise: true,
                    supervise: false
                  } // ,
                  // {id: '1_2_5', name: '补充或更正公告', act: false, link: 'affiche'},
                  // {id: '1_2_6', name: '定期报告', act: false, link: 'affiche'}
                  // ,{id: '1_2_7', name: '公告收藏 ', act: false, link: 'favorite-affiche'}
                ]
              },
              {
                id: '1_3', name: '行情及交易数据', act: false, link: '',
                children: [
                  {id: '1_3_1', name: '市场行情', act: false, link: 'market-condition'},
                  {
                    id: '1_3_2',
                    name: '本公司行情',
                    act: false,
                    link: 'company-condition',
                    enterprise: true,
                    supervise: false
                  },
                  {
                    id: '1_2_5',
                    name: '监管公司行情',
                    act: false,
                    link: 'market-condition?index=supervise',
                    level: 1,
                    enterprise: false,
                    supervise: true
                  },
                  {id: '1_3_3', name: '异常波动报告', act: false, link: 'abnormal-condition', level: 2}
                ]
              },
              {
                id: '1_4', name: 'IPO', act: false, link: '', new: 'true',
                children: [
                  {id: '1_4_1', name: 'IPO检索', act: false, link: 'ipo/search'},
                  {id: '1_4_2', name: 'IPO在审公司统计', act: false, link: 'ipo/retrial/overview'},
                  {id: '1_4_3', name: 'IPO上会公司统计', act: false, link: 'ipo/will/overview'}
                ]
              },
              {
                id: '1_5', name: '违规案例', act: false, link: '',
                children: [
                  {id: '1_5_1', name: '违规案例检索', act: false, link: 'cases'},
                  {
                    id: '1_5_2',
                    name: '本公司违规案例',
                    act: false,
                    link: 'cases?inputCode=' + encodeURIComponent('本公司'),
                    enterprise: true,
                    supervise: false
                  },
                  {id: '1_5_3', name: '关注公司违规案例', act: false, link: 'cases?inputCode=' + encodeURIComponent('关注公司')},
                  {
                    id: '1_5_4',
                    name: '可比公司违规案例',
                    act: false,
                    link: 'cases?inputCode=' + encodeURIComponent('可比公司'),
                    level: 2,
                    enterprise: true,
                    supervise: false
                  },
                  {
                    id: '1_5_5',
                    name: '监管公司违规案例',
                    act: false,
                    link: 'cases?inputCode=' + encodeURIComponent('监管公司'),
                    level: 2,
                    enterprise: false,
                    supervise: true
                  },
                  {id: '1_5_6', name: '公开谴责及通报批评', act: false, link: 'cases?supervisionType=812%23%23813'},
                  {id: '1_5_7', name: '典型违规案例剖析', act: false, link: 'business/library#0'}
                  // ,{id: '1_5_7', name: '每周违规案例剖析', act: false, link: 'cases'}
                  //, {id: '1_5_8', name: '违规案例统计', act: false, link: 'cases'}
                  //  {id: '1_3_2', name: '案例收藏', act: false, link: 'favorite-cases'},
                  // {id: '1_3_3', name: '案例解读', act: false, link: ''}
                ]
              },
              {
                id: '1_6', name: '监管动态', act: false, link: '',
                children: [
                  {id: '1_6_1', name: '最新监管动态', act: false, link: 'activities?index=0'},
                  {id: '1_6_2', name: '证监会监管动态', act: false, link: 'activities?index=1'},
                  {id: '1_6_3', name: '上交所监管动态', act: false, link: 'activities?index=2'},
                  {id: '1_6_4', name: '深交所监管动态', act: false, link: 'activities?index=3'}
                  // ,{id: '1_7_5', name: '每周监管动态', act: false, link: 'activities'}
                ]
              }
            ]
          },
          {
            id: '2', name: '信披工具箱', act: false, link: '', children: [
              {
                id: '2_1', name: '权限速查', act: false, link: '', children: [
                  {id: '2_1_1', name: '权限速查表', act: false, link: 'lookuptables', children: []}
                ]
              },
              {
                id: '2_2', name: '财务分析', act: false, link: '', children: [
                  {id: '2_2_1', name: '主要财务数据', act: false, link: 'finance/main', children: [], level: 2},
                  {id: '2_2_2', name: '本公司财务报告', act: false, link: 'finance/financials', children: [], level: 2},
                  {id: '2_2_3', name: '同业财务数据比较', act: false, link: 'finance/comparison', children: [], level: 2},
                  {id: '2_2_4', name: '年度财务分析报告', act: false, link: 'finance/analyse', children: [], level: 2}
                ]
              },
              /* {id: '2_4', name: '股权激励', act: false, link: 'index', children: []},
              {id: '2_5', name: '权益变动', act: false, link: 'index', children: []},
              {id: '2_6', name: '定期报告', act: false, link: 'index', children: []},
              {id: '2_7', name: '董办事项', act: false, link: 'index', children: []}, */
              {
                id: '2_3', name: '信息披露清单', act: false, link: '', children: [
                  {id: '2_3_1', name: '信息披露清单', act: false, link: 'disclosure/checklist', children: [], level: 2},
                  {id: '2_3_2', name: '进行中的事项', act: false, link: 'disclosure/proceed', children: [], level: 2},
                  {id: '2_3_3', name: '已归档事项', act: false, link: 'disclosure/archive', children: [], level: 2}
                ]
              }, // 新增
              {
                id: '2_4', name: '公司规章制度', act: false, link: '', children: [
                  {id: '2_4_1', name: '治理制度清单库', act: false, link: 'regulation/library', children: [], level: 2},
                  {id: '2_4_2', name: '本公司规章制度', act: false, link: 'regulation/manage', children: [], level: 2}
                ]
              },  // 新增
              {
                id: '2_5', name: '小安日历', act: false, link: '', children: [
                  {id: '2_5_1', name: '小安日历', act: false, link: 'calendar/index', children: []}
                ]
              }
            ]
          },
          {
            id: '3', name: '信公e投关', act: false, link: '', new: 'true',
            children: [
              {
                id: '3_1', name: '舆情监控', act: false, link: '', new: 'false',
                children: [
                //  {id: '3_1_1', name: '本公司舆情', act: false, link: 'supervise', children: [], level: 2}
                  {id: '3_1_2', name: '公司舆情', act: false, link: 'sentiment/companySentiment', children: [], level: 2},
                  {id: '3_1_3', name: '市场舆情', act: false, link: 'sentiment/marketSentiment', children: [], level: 2},
                  {id: '3_1_4', name: '舆情实时搜索', act: false, link: 'sentiment/sentimentSearch', children: [], level: 2},
                  {id: '3_1_5', name: '自定义舆情监控', act: false, link: 'sentiment/sentimentMonitor', children: [], level: 2}
                ]
              },
              {
                id: '3_2', name: 'e互动', act: false, link: '',
                children: [
                  {id: '3_2_2', name: '投资者问答检索', act: false, link: 'investor/search', children: [], level: 2},
                  {
                    id: '3_2_3', name: '市场概览', act: false, link: 'investor/leaderboard/overview', children: [], level: 0
                  },
                  {id: '3_2_4', name: '公司e互动', act: false, link: 'investor/company/overview', children: [], level: 2}
                ]
              },
              {
                id: '3_3', name: '研报', act: false, link: '',
                children: [
                  {id: '3_3_1', name: '研报检索', act: false, link: 'report'},
                  {
                    id: '3_3_2',
                    name: '本公司研报',
                    act: false,
                    link: 'report?inputCode=' + encodeURIComponent('本公司'),
                    enterprise: true,
                    supervise: false
                  },
                  {
                    id: '3_3_3',
                    name: '关注公司研报',
                    act: false,
                    link: 'report?inputCode=' + encodeURIComponent('关注公司')
                  },
                  {
                    id: '3_3_4',
                    name: '可比公司研报',
                    act: false,
                    link: 'report?inputCode=' + encodeURIComponent('可比公司'),
                    level: 2,
                    enterprise: true,
                    supervise: false
                  },
                  {
                    id: '3_3_5',
                    name: '监管公司研报',
                    act: false,
                    link: 'report?inputCode=' + encodeURIComponent('监管公司'),
                    level: 2,
                    enterprise: false,
                    supervise: true
                  }
                ]
              },
              {
                id: '3_4', name: '股东行为分析', act: false, link: '', new: 'true',
                children: [
                  {id: '3_4_1', name: '最新股东分析', act: false, link: 'stockholder/importantStock', level: 2},
                  {id: '3_4_2', name: '股东对比分析', act: false, link: 'stockholder/stockholderComparison', level: 2},
                  {id: '3_4_3', name: '股东趋势分析', act: false, link: 'stockholder/trendAnalysis', level: 2},
                  {id: '3_4_4', name: '股东信息检索', act: false, link: 'stockholder/historyStockholder', level: 2},
                  {id: '3_4_5', name: '股东数据管理', act: false, link: 'stockholder/rosterExport', level: 2}
                ]
              }
            ]
          },
          {
            id: '4', name: '信公商学院', act: false, link: '', children: [
              {
                id: '4_1', name: '在线课堂', act: false, link: 'business/school', children: [
                  {id: '4_1_1', name: '规则解读系列课', act: false, link: 'business/school#0', level: 0},
                  {id: '4_1_2', name: '信息披露系列课', act: false, link: 'business/school#1', level: 0},
                  {id: '4_1_3', name: '资本运作系列课', act: false, link: 'business/school#2', level: 0},
                  {id: '4_1_4', name: '财务会计系列课', act: false, link: 'business/school#3', level: 0},
                  {id: '4_1_5', name: '信公会员', act: false, link: 'business/school#4', level: 0}
                ]
              },

              {
                id: '4_4', name: '信公图书馆', act: false, link: 'business/library', children: [
                  {id: '4_4_1', name: '典型违规案例剖析', act: false, link: 'business/library#0', level: 0},
                  {id: '4_4_2', name: '信息披露活页问答', act: false, link: 'business/library#1', level: 0},
                  {id: '4_4_3', name: '季度监管案例汇编', act: false, link: 'business/library#2', level: 0}

                ]
              },
              {
                id: '4_5', name: '信公精选', act: false, link: 'business/swift', new: true,
                children: [
                  {id: '4_5_1', name: '信公干货', act: false, link: 'business/swift#0', level: 0},
                  {id: '4_5_2', name: '高能问答', act: false, link: 'business/swift#1', level: 0},
                  {id: '4_5_3', name: '行业分析', act: false, link: 'business/swift#2', level: 0},
                  {id: '4_5_4', name: '信公新知', act: false, link: 'business/swift#3', level: 0},
                  {id: '4_5_5', name: '小安读法规', act: false, new: 'true', link: 'rule?havenote=1#swift', level: 1}
                ]
              },
              {
                id: '4_2', name: '培训信息', act: false, link: 'business/training', children: [
                  {id: '4_2_1', name: '培训信息', act: false, link: 'business/training', level: 0}
                ]
              },
              {
                id: '4_3', name: '董秘测试', act: false, link: 'business/test', children: [
                  {id: '4_3_1', name: '董秘测试', act: false, link: 'business/test', level: 0}
                ]
              }
            ]
          },
          {
            id: '5', name: '信乎社区', act: false, link: 'xhList', children: []
          },
          {
            id: '6', name: '董办知识大赛', act: false, competition: true, link: 'competition', children: []
          }
          // ,
          // {
          //   id: '6', class: 'audit-center', name: '小安实验室', act: false, beta: 'true', link: '',
          //   children: [
          //     {
          //       id: '6_1',
          //       class: 'audit-center',
          //       beta: 'true',
          //       name: '定期报告AI检测',
          //       act: false,
          //       link: 'audit',
          //       children: []
          //     }
          //   ]
          // }
        ],
        messageVal: false,
        allUserData: {},
        setUpdate: 0,
        authDialog: false,
        inviteDialog: false,
        inviteNum: 1,
        userInfo: '',
        superviseCompany: []
      }
    },
    deactivated() {
      this.messageTop = false;
    },
    computed: {
      isLogin: function () {
        return this.$store.state.isLogin
      },
      info: function () {
        return this.$store.state.userData
      },
      userName: function () {
        let uName = this.info.userName
        if (uName === '' || uName === null) {
          uName = this.info.weixinUsername
        }
        if (uName.length > 8) {
          uName = uName.substring(0, 8) + '...'
        }
        return uName
      },
      isRootUser: function () {
        let isTrue = false
        let companyId = this.info.companyId
        if (this.info.companyId) {
          if (this.info.rootUserId == this.info.id) {
            isTrue = true
          }
        }
        return isTrue
      },
      enterpriseUser: function () {
        return this.info.enterpriseUser
      },
      superviseUser: function () {
        return this.info.superviseUser
      },
      companyName: function () {
        if (this.info.companyCode == '888888') {
          return '信公小安'
        } else {
          return this.info.enterpriseCompanyName
        }
      },
      enterpriseCompanyCode: function () {
        return this.info.enterpriseCompanyCode
      }
    },
    watch: {
      isLogin: function () {
        setTimeout(() => {
          this.isIPOUser();
        })
        console.log(32423432);
      },
      '$route': function (val, old) {
        this.$store.commit('COLUMN', old.meta.tabName)
        this.activeMenu()
        this.checkDomain()
      },
      enterpriseCompanyCode(val) {
        if (val) {
          this.checkDomain()
        }
      }
    },
    created() {
      this.inviteNum = this.getRandomNum(1, 3)
      this.menu[3].children[1].name = this.$config.eName();
      this.menu[3].children[1].children[0].name = this.$config.eName() + '检索';
      this.menu[3].children[1].children[1].name = this.$config.eName() + this.menu[3].children[1].children[1].name;
      this.menu[3].children[1].children[2].name = '本公司' + this.$config.eName();
      /* this.isActive = this.$route.meta.tabName
      for (var i in this.column) {
        if (this.isActive == this.column[i].to) {
          this.column[i].isSelect = true
        } else {
          this.column[i].isSelect = false
        }
      } */
      this.activeMenu()
      this.getMyInfo()
      this.searchUserData()
      this.checkDomain()
      // this.getTypes()
      // this.getAllSuperviseCompanyByUser()
      // this.checkIsGxfUser()
    },
    mounted() {
      // document.body.addEventListener('mouseleave', function (e) {
      //   console.log(e);
      // })
      // window.onbeforeunload = function (e) {
      //   var el = window.event || e;
      // };
      this.isIPOUser();
      //
      this.timer = setInterval(() => {
        this.searchUserData();
      }, 120 * 1000)
    },
    methods: {
      // 获取信公商学院信息
      getTypes () {
        this.$http({
          method: 'GET',
          url: this.$api.business.getTypes,
          params: {
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {

          }
        }).catch(() => {
        })
      },
      // 最新的gio 的统计
      isIPOUser() {
        if (this.$cookie.get('userId')) {
          // 登陆
          this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
          var IsVIP = this.userInfo.enterpriseUser ? 'vip' : 'normal';
          if (window._hmt) {
            window._hmt.push(['_setCustomVar', 1, 'customer', IsVIP, 3]);
          }
        } else {
          // 没登陆
          // from 2018.8.23号 百度统计 增加没登陆的用户访问记录  设置为（null）
          window._hmt.push(['_setCustomVar', 1, 'customer', 'null', 3]);
        }
      },
      //
      getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
      },
      showInviteDialog() {
        this.inviteDialog = true
        this.inviteNum = this.getRandomNum(1, 3)
      },
      hideMenu() {
        this.menu.forEach((item) => {
          item.act = false
        })
      },
      // 检测股票代码是否是本公司,切换路由
      checkDomain() {
        if (this.$cookie.get('userId')) {
          let domain = document.domain
          let urlCode = domain.split('.')[0]
          if (/\d{3,6}/.test(urlCode)) {
            if (this.enterpriseCompanyCode) {
              if (this.info.enterpriseCompanyCode != urlCode) {
                location.href = location.href.replace(urlCode, this.enterpriseCompanyCode)
              }
            }
          }
        }
      },
      searchUserData() {
        if (this.$cookie.get('userId')) {
          this.$http({
            method: 'GET',
            url: this.$api.user.searchUserData,
            message: 'none',
            params: {
              isEnterprise: true,
              selectUserId: '',
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.allUserData = res.data.returnObject;
              window.localStorage.setItem('SEARCHUSERDATA', window.JSON.stringify(this.allUserData));
            }
          }).catch((err) => {

          })
        }
      },
      // 获取所有监管公司
      getAllSuperviseCompanyByUser() {
        if (this.$cookie.get('userId')) {
          this.$http({
            url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
            method: "GET",
            params: {
              userId: this.userId
            }
          }).then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              this.superviseCompany = res.data.returnObject
              alert(this.superviseCompany.length)
            }
          })
        }
      },
      popoverShow() {
        this.setUpdate += 1;
        console.log('erwerwerwe');
      },
      messageActive(val, isShow) {
        console.log('234234234', val);
        if (isShow) {
          this.messageTop = false;
        }
        this.searchUserData();
      },
      goEnterprise() {
        this.authDialog = false
        this.$router.push('/manage/purchase')
      },
      selectMessageType(val) {
        console.log(val);
      },
      //
      activeMenu() {
        // console.log(this.$route)
        let tabName = this.$route.meta.tabName
        this.activeId = ''  // 一级导航id
        this.activeIdAll = '' // 导航id
        this.menu.forEach((item) => {
          console.log('this.activeIdAll' + this.activeIdAll)
          if (item.link.split('?')[0] == tabName) {
            this.activeId = item.id  // 一级导航id
            this.activeIdAll = item.id // 导航id
          } else if (item.children.length > 0) {
            item.children.forEach((item2) => {
              if (item2.link.split('?')[0] == tabName) {
                this.activeId = item2.id.split('_')[0]  // 一级导航id
                this.activeIdAll = item2.id // 导航id
              } else if (item2.children.length > 0) {
                item2.children.forEach((item3) => {
                  if (decodeURIComponent(this.$route.fullPath) == '/' + item3.link || this.$route.fullPath == '/' + item3.link || this.$route.fullPath.indexOf(item3.link) > -1 || tabName == item3.link || item3.link.replace(/\//g, '-') == tabName) {
                    this.activeId = item3.id.split('_')[0]  // 一级导航id
                    this.activeIdAll = item3.id // 导航id
                  }
                  /* else if (item3.link.split('?')[0] == tabName) {
                    this.activeId = item3.id.split('_')[0]  // 一级导航id
                    this.activeIdAll = item3.id // 导航id
                  } else if (tabName === 'favorite') {
                    // favorite对应，法规，公告，案例，研报，IPO多个菜单，单独处理
                    if ('/' + item3.link == this.$route.path) {
                      this.activeId = item3.id.split('_')[0]  // 一级导航id
                      this.activeIdAll = item3.id // 导航id
                    }
                  } */
                })
              }
            })
          }
        })
        // 管理设置，邀请伙伴，通知路由判断
        if (!this.activeId) {
          if (tabName === 'userManage') {
            this.activeId = '6_m'
          }
        }
        if (this.$route.name == 'login') {
          this.activeId = ''  // 一级导航id
          this.activeIdAll = '' // 导航id
        }
        if (!this.activeId) {
          if (this.$route.name == 'rule') {
            this.activeId = '1'  // 一级导航id
            this.activeIdAll = '1_1_1' // 导航id
          }
          if (this.$route.name == 'report') {
            this.activeId = '1_4'  // 一级导航id
            this.activeIdAll = '1_4_1' // 导航id
          }
          if (this.$route.name == 'cases') {
            this.activeId = '1_5'  // 一级导航id
            this.activeIdAll = '1_5_1' // 导航id
          }
          if (this.$route.name == 'index') {
            this.activeId = '0'  // 一级导航id
            this.activeIdAll = '0' // 导航id
          }
        }

      },
      //
      enter(index) {
        this.menu.forEach((item) => {
          item.act = false
        })
        this.menu[index].act = true;

        console.log(index);
      },
      //
      pullLeave(index) {
        this.menu[index].act = false;
      },
      //
      leave(index) {
        if (index == 0 || index == 5) {
          this.menu[index].act = false
        }
      },
      //
      getMyInfo() {
        if (this.$cookie.islogin()) {
          // 登录状态
          this.searchUserData();
          let userId = this.$cookie.get('userId')
          this.$http({
            method: 'GET',
            url: this.$api.user.getMyInfo,
            autoLogin: 'autologin',
            params: {userId: userId}
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.getMyInfoData = res.data.returnObject;
              console.log("userInfo ----------", res.data.returnObject)
              this.$auth.setStore(this, res.data.returnObject);
              this.$auth.checkAuth(this);
            } else if (res.data.returnCode == 100 || (res.data.returnCode === -1 && res.data.returnMsg === '用户未登录')) {
              // 自动登陆
              this.autologin(userId);
            } else {
              this.$auth.clearAuth(this)
            }
          })
        } else {
          this.$auth.clearAuth(this)
        }
        this.isIPOUser()
      },
      // cookie存在，session失效，自动登陆
      autologin(userId) {
        this.$http({
          method: 'POST',
          url: this.$api.user.autologin,
          params: {
            userkey: userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$auth.setStore(this, res.data.returnObject)
            this.$auth.checkAuth(this)
          } else {
            this.$auth.clearAuth(this)
//            this.$cookie.remove('userId')
//            this.$cookie.remove('xa_u')
//            this.$cookie.remove('userInfo')
//            this.$store.commit('ISLOGIN', false)
//            this.$store.commit('USERDATA', {})
            // this.$router.push('/login?redirect_url=' + location.href)
          }
        })
      },
      //
      handleCommand(command) {
        this.activeId = ''  // 一级导航id
        this.activeIdAll = '' // 导航id
        if (command == 'exit') {
          // 退出登录
          this.$http({
            method: 'POST',
            url: this.$api.user.logout,
            params: {
              userid: this.$cookie.get('userId')
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.$auth.clearAuth(this)
              // this.$auth.authRedirect(this, '/login', '退出成功！', '登录页')
              if (process.env.XA_ENV === 'dev') {
                this.$router.push('/login')
              } else {
                let host = this.$api.host.split('://')
                location.href = host[0] + '://' + host[1] + 'index'
              }

              // this.companyName = ''
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
            }
          })
        } else {
          this.$router.push('/' + command)
        }
      },
      //
      backs(path) {
//        this.reset()
//        this.column[0].isSelect = true
        // this.$router.push('/index')
        this.activeId = '0'
        this.activeIdAll = '0'
        this.$router.push('/' + path)
      },
      //
      reset() {
//        for (var i in this.column) {
//          this.column[i].isSelect = false
//        }
      },
      //
      login() {
        this.$auth.clearAuth(this)
        if (this.$route.path == '/login') {
          location.href = '/login'
        } else {
          this.$router.push('/login')
        }
      },
      //
      register() {
        this.reset()
        this.$router.push('/register')
      },
      //
      selectMethod(index) {
        // this.$emit('selectItem', index)
        // 登录状态不匹配，刷新页面
//        if (this.isLogin !== this.$cookie.islogin()) {
//          location.href = '/' + this.column[index].to
//        } else {
//          for (let i in this.column) {
//            this.column[i].isSelect = false
//          }
//          this.column[index].isSelect = true
//          if (this.$route.meta.tabName === this.column[index].to) {
//            location.href = '/' + this.column[index].to
//          } else {
//            this.$router.push('/' + this.column[index].to)
//          }
//
//        }
      },
      //
      goMenuLink(item) {
        console.log(this.$router)
        console.log(this.$route)
        console.log('item.link:' + item.link + '---router.link:' + this.$route.name)
        let userId = this.$cookie.get('userId')
        // 已登陆，非用户弹窗提示企业用户
        if (!this.enterpriseUser && !this.superviseUser && item.level == 2 && this.$cookie.get('userId')) {
          this.authDialog = true
          return false
        }
        // 未登录用户权限判断
        if (item.level == 1 && !userId) {
          location.href = '/login?redirect_url=/' + item.link
          return false
        }
        if (item.id == 0 && !this.$cookie.get('userId')) {
          this.$router.push('/index')
          this.activeIdAll = 0
          this.activeId = 0
          return false
        }

        if (item.link) {
          let link = item.link
          if (link.indexOf('rule') > -1 || link.indexOf('affiche') > -1 ||
            link.indexOf('report') > -1 ||
            link.indexOf('cases') > -1 ||
            link.indexOf('inputCode') > -1 ||
            '/' + item.link == this.$route.path ||
            link.indexOf('?') > -1) {
            // link = link.replace('enterpriseCompanyCode', this.info.enterpriseCompanyCode)
            // this.$router.push('/' + link)
            location.href = '/' + link
          } else {
            this.$router.push('/' + item.link)
          }
          // location.href = '/' + item.link
          this.activeIdAll = item.id
          let idArr = item.id.split('_')
          this.activeId = idArr[0]
          this.menu.forEach((item) => {
            item.act = false
          })
        }
      },
      //
      goMenuLinkRight(path, id) {
        this.activeId = id
        this.$router.push(path)
      },
      checkIsGxfUser() {
        let userId = this.$cookie.get('userId')
        if (userId) {
          this.$http({
            method: 'GET',
            url: this.$api.gxfApi.checkIsGxfUser,
            params: {
              userId: this.$cookie.get('userId')
            }
          }).then((res) => {
            if (res.data.returnCode != 200 && res.data.returnCode != 1) {
              this.menu[3].children.splice(3, 1)
            }
          }).catch((err) => {
            this.menu[3].children.splice(3, 1)
          })
        } else {
          this.menu[3].children.splice(3, 1)
        }
      }
      /* ,getLastedRecordDate() {
        let params = {userId: this.$cookie.get('userId')}
        this.$axios.gxfApi.getLastedRecordDate(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.recordDate = res.data.returnObject

            let needDateCount = this.$route.meta.needDateCount
            if (needDateCount == undefined) {
              needDateCount = 1
            }
            if (this.recordDate.length < needDateCount) {
              if (this.$route.name != 'rosterExport') {
                this.$router.push('/stockholder/rosterExport');
              }
            }
          }
        })
      } */
      //
      /* ,getByCompanyId(companyId) {
          if (companyId) {
            this.$http({
              method: 'GET',
              url: this.$api.manage.getByCompanyId,
              params: {
                companyId: companyId
              }
            }).then((res) => {
              if (res.data.returnCode === 1) {
                this.companyName = res.data.returnObject.companyName
              }
            })

          }
        } */
    }
  }
</script>
<style lang="scss">
  @import "../assets/css/theme-style";
  .el-popover.popover-message {
    margin-top: 2px;
    padding: 0;
    .popover-content {
      max-height: 685px;
    }
  }
  .userMenu {
    top: 58px !important;
    width: 150px; // 134px;
    background: #424345;
    border: 0;
    opacity: .95;
    li {
      line-height: 38px;
      height: 38px;
      font-size: 14px;
      color: #aeaeae;
      text-align: center;
      &:hover {
        color: #ffffff !important;
        background: #5e5f61 !important;
      }
    }
    .popper__arrow::after {
      display: none;
    }
    .popper__arrow {
      width: 0;
      height: 0;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid red;
    }
  }
  .el-dropdown-link {
    cursor: pointer;
    .vxa-user-name {
      width: 63px;
      display: inline-block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    /*padding: 10px 20px;*/
  }
  #header {
    width: 100%;
    height: 60px;
    background: #333437;
    min-width: 1200px;
    position: relative;
    left: 0;
    top: 0;
    z-index: 10000;
    .content {
      .nav {
        ul {
          height: 100%;
          position: relative;
          .active {
            color: #ffaf47;
            /*font-weight: bolder;*/
            line-height: 60px;
            /*border-bottom: 2px solid #ffaf47;*/
          }
          .iActive {
            position: absolute;
            color: #fff !important;
            bottom: -10px;
            font-size: 28px;
            left: 50%;
            margin-left: -14px;
            /*display: none;*/
          }
          li {
            float: left;
            margin-left: 10px;
            margin-right: 20px;
            height: 60px;
            line-height: 60px;
            color: #fff;
            font-size: 16px;
            position: relative;
            cursor: pointer;
            &:hover {
              color: #ffaf47;
            }
            .newTip {
              width: 30px;
              position: absolute;
              top: 8px;
              right: -30px;
            }
          }
        }
      }

      .logo {
        position: relative;
        padding-top: 10px;
        cursor: pointer;
        .xiaoan-logo {
          height: 40px;
        }

        .companyName-title {
          color: #ffaf47;
        }
        .beta {
          position: absolute;
          right: 24px;
          top: 7px;
          font-size: 12px;
          color: #919191;
          font-weight: bold;
        }
      }
      .companyInfo {
        display: flex;
        align-items: center;
        height: 60px;
        cursor: pointer;
        .index-img {
          position: relative;
          top: -1px;
          left: 1px;
          height: 18px;
        }
        .companyName-title {
          display: inline-block;
          margin-left: 5px;
          color: #ffaf47;
          font-size: 16px;
        }
      }
      .user {
        font-size: 16px;
        text-align: right;
        height: 60px;
        line-height: 60px;
        .el-button {
          font-size: 16px !important;
        }
        .login {
          background: rgba(0, 0, 0, 0);
          color: #ffb148;
          border: 1px solid #ffb148;
        }
        .split {
          width: 1px;
          height: 16px;
          background: #6d6e6f;
          display: inline-block;
          vertical-align: middle;
        }
        .reg {
          background: #ffb148;
        }
      }
      .userName {
        color: #fff;
        height: 60px;
        line-height: 60px;
        .downUser {
          padding-left: 5px;
          color: #fff;
          font-size: 16px;
          line-height: 1;
          .el-icon--right {
            color: #ffb148 !important;
          }
        }
        .el-badge__content.is-fixed {
          top: 18px;
          right: 20px;
          border: 0;
          font-size: 12px;
        }
        .menuSpan {
          cursor: pointer;
          height: 100%;
          display: inline-block;
          width: 55px;
          text-align: center;
          transition: 0.3s all;
          &.friend {
            width: auto;
            padding-right: 10px;
          }
          .text {
            display: none;
          }
          &:hover {
            transition: 0.3s all;
            // background-color: rgba(0, 0, 0, 0.1);
            color: #ffb148;
            i {
              display: none;
            }
            .text {
              display: inline-block;
              color: #ffb148;
              font-size: 16px;
            }
          }
        }
        .activeSpan {
          color: #ffb148;
        }
      }
    }
    .head-pull-down {
      .forData {
        .zoom {
          min-height: 170px;
          position: absolute;
          left: 0;
          width: 100%;
          /*height: 200px;*/
          background-color: #fff;
          border-bottom: 1px solid #e3e3e3;
          box-shadow: 0 1px 2px rgba(227, 227, 227, .1);
        }
      }
      .newTip {
        width: 30px;
      }
    }
    .menuBox {
      padding: 0 0 30px 0;
      display: flex;
      flex-wrap: nowrap;
      &.audit-center {
        justify-content: flex-end;
        .menuItem {
          margin-right: 17%;
        }

      }
      .menuItem {
        width: 15%;
        margin-left: 6%;
        float: left;
        font-size: 14px;
        &:first-child {
          margin-left: 0;
        }

        .menu1, .menu2 {
          color: #323232;
          font-weight: 700;
          width: 100%;
          border-bottom: 1px solid #e3e3e3;
          line-height: 30px;
          margin-top: 30px;
          margin-bottom: 6px;
        }
        .menu2 {
          cursor: pointer;
        }
        .menu3 {
          line-height: 25px;
          color: #8d8d8d;
          font-weight: 400;
          width: 100%;
          cursor: pointer;
          .enterprise-icon {
            display: inline-block;
            height: 12px;
            position: relative;
            top: 1px;
          }
        }
        .menu2:hover, .menu3:hover {
          color: #ffb148;
        }
        .actMenu {
          color: #ffb148;
        }
      }
    }
    .authDialog {
      .el-dialog__header {
        border-bottom: 1px solid #e3e3e3;
        .el-dialog__title {
          color: #ffb148;
        }
        .el-dialog__body {
          padding: 25px;
        }
      }
      .message {
        text-align: center;
      }
    }
    .inviteDialog {
      .el-dialog {
        background: transparent;
      }
      .el-dialog__header {
        display: none;
      }
      .el-dialog__body {
        padding: 0
      }
      .inviteclose {
        position: absolute;
        top: 0;
        right: 0;
        cursor: pointer;
      }
    }
  }
</style>
