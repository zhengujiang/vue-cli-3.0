<template>
  <div id="collectDetails" class="collect-details" ref="collectDetailsDom">
    <div class="collect-details-scroll">
      <!-- 收藏夹简介 -->
      <div class="collect-details-header" ref="headerDom">
        <div class="details-header-box" v-if="infoObject.introduction">
          <div class="xiaoan-divider">
            <div class="xiaoan-divider-left"><i></i></div>
            <div class="xiaoan-divider-middle-text">收藏简介</div>
            <div class="xiaoan-divider-right"><i></i></div>
          </div>
        </div>
        <div class="details-header-text" :class="{MaxHeight: openDosc}" v-if="infoObject.introduction">
          <p ref="doscTextDom">{{infoObject.introduction}}</p>
          <span class="opendosc" v-show="openDosc" @click="openDoscClick">...&ensp;<span>展开简介&ensp;</span><b
            class="icon iconfont icon-xiangxiajiantou"></b></span>
        </div>
        <div class="details-header-foo" v-if="infoObject.introduction"></div>
      </div>

      <div class="collect-details-container">
        <!--顶部 tab-->
        <div class="tab-box vux-1px-b" ref="tabDom">
          <tab :scroll-threshold=7 :line-width=2 :active-color="'#ffb148'" v-model="active" custom-bar-width="30px">
            <tab-item class="vux-center" @on-item-click="isActive" v-for="(item, index) in tabData" :key="index"
                      v-if="item.show">
              {{item.name}}
            </tab-item>
          </tab>
        </div>
        <!--内容-->
        <div class="tab-container" :style="{height:tabHeight+'px'}">
          <swiper v-model="active" loop :min-moving-distance="300" :height="'100%'" :show-dots="false">
            <swiper-item>
              <collect-det-item :key="'total'" :type="'total'" :share="shareUser" :height="tabHeight"
                                :active="active"></collect-det-item>
            </swiper-item>
            <swiper-item>
              <collect-det-item :key="'law'" :type="'law'" :share="shareUser" :height="tabHeight"
                                :active="active"></collect-det-item>
            </swiper-item>
            <swiper-item>
              <collect-det-item :key="'case'" :type="'case'" :share="shareUser" :height="tabHeight"
                                :active="active"></collect-det-item>
            </swiper-item>
            <swiper-item>
              <collect-det-item :key="'report'" :type="'report'" :share="shareUser" :height="tabHeight"
                                :active="active"></collect-det-item>
            </swiper-item>
            <swiper-item>
              <collect-det-item :key="'publish'" :type="'publish'" :share="shareUser" :height="tabHeight"
                                :active="active"></collect-det-item>
            </swiper-item>
            <swiper-item>
              <collect-det-item :key="'qa'" :type="'qa'" :share="shareUser" :height="tabHeight"
                                :active="active"></collect-det-item>
            </swiper-item>
          </swiper>
        </div>
        <transition name="fade">
          <div class="showPrompt" v-show="showPrompt">你也可以将喜欢的内容转存至自己的收藏夹</div>
        </transition>
        <xiaoan-warning v-show="warningTo.show" :imgSrc="warningTo.img" :hintBtn="warningTo.btnText" :isShowBtn="false"
                        :topHeight="warningTo.top" :message="warningTo.text"></xiaoan-warning>
      </div>
      <div class="collect-details-footer vux-1px-t" ref="tabbarDom">
        <div class="tabbar-items footer-home" @click="goHome">
          <div class="tabbar-icon">
            <img :src="footerHome.icon" alt="">
          </div>
          <p class="tabbar-value">{{footerHome.name}}</p>
        </div>
        <div class="tabbar-items" v-for="(list, index) in tabbarData" v-if="list.show" @click="footerClick(index)">
          <div class="tabbar-icon">
            <img :src="list.img" alt="">
          </div>
          <p class="tabbar-value">{{list.name}}</p>
        </div>
      </div>
    </div>
    <div class="popup-collect-details" v-transfer-dom>
      <!---->
      <popup v-model="popupShow.attribute">
        <div class="popupAttribute">
          <div class="title">基本信息</div>
          <ul class="ul-box">
            <li class="list">
              <div class="box vux-1px-b">
                <div class="cell left">适用范围：</div>
                <div class="cell right">
                  <span v-if="infoArr.length == 0 || infoArr == null">暂无</span>
                  <span v-for="list in infoArr" v-else>
                   <b v-if="list == '沪市主板'" class="SHColor">沪主板</b>
                   <b v-else-if="list == '深市主板'" class="SZColor">深主板</b>
                   <b v-else-if="list == '深市中小板'" class="SZColor">中小板</b>
                   <b v-else-if="list == '深市创业板'" class="SZColor">创业板</b>
                   <b v-else-if="list == '新三板'" class="XSBColor">新三板</b>
                 </span>
                </div>
              </div>
            </li>
            <li class="list">
              <div class="box vux-1px-b">
                <div class="cell left">清单名称：</div>
                <div class="cell right">
                  <span v-if="infoObject.favouriteName!==''&& infoObject.favouriteName!==null">
                    {{infoObject.favouriteName}}</span>
                  <span v-else>暂无</span>
                </div>
              </div>
            </li>
            <li class="list">
              <div class="box vux-1px-b">
                <div class="cell left">清单作者：</div>
                <div class="cell right">
                  <span v-if="infoObject.userName!==''&& infoObject.userName!==null">
                    {{infoObject.userName}}</span>
                  <span v-else>暂无</span>
                </div>
              </div>
            </li>
            <li class="list" v-show="infoObject.share==true">
              <div class="box vux-1px-b">
                <div class="cell left">订阅人数：</div>
                <div class="cell right">
                   <span v-if="infoObject.subscribers!==''&& infoObject.subscribers!==null ">
                     {{infoObject.subscribers}}</span>
                  <span v-else>0</span>
                </div>
              </div>
            </li>
            <li class="list">
              <div class="box vux-1px-b">
                <div class="cell left">发布日期：</div>
                <div class="cell right">
                  <span v-if="infoObject.createTime==null">暂无</span>
                  <span v-else>{{$const.formatText(infoObject.createTime)}}</span>
                </div>
              </div>
            </li>
            <li class="list">
              <div class="box">
                <div class="cell left">更新日期：</div>
                <div class="cell right">
                  <span v-if="infoObject.updateTime==null">暂无</span>
                  <span>{{$const.formatText(infoObject.updateTime)}}</span>
                </div>
              </div>
            </li>
          </ul>
          <div class="footer">
            <button type="button" @click="popupShow.attribute = false">{{cancelT}}</button>
          </div>
        </div>
      </popup>
    </div>
    <div class="popup-collect-details" v-transfer-dom>
      <!---->
      <popup v-model="popupShow.edit" :height="'100%'">
        <div class="popupEdit">
          <div class="editbox">
            <div class="infobox">
              <!-- 收藏名称 -->
              <div class="editList title">
                <label class="cell">{{ collectNames }}</label>
                <div class="cell">
                  <input type="text" :disabled="infoObject.isDefault == 1" class="editListTextarea"
                         :class="{disabled: infoObject.isDefault == 1}"
                         :placeholder="collectName" v-model="collectName" maxlength="40" @input="createVal1(40)">
                  <b class="icon iconfont icon-X" v-show="collectName !='' && infoObject.isDefault != 1"
                     @click="collectName=''"></b>
                </div>
              </div>
              <!--&lt;!&ndash; 适应范围 &ndash;&gt;-->
              <div class="editList range">
                <label class="cell">{{ rangeName }}</label>
                <div class="cell">
                  <ul>
                    <li v-for="(list,index) in rangeArr" @click="selectItem(index)">
                      <span :class="{selected:list.selectStatus}"></span>
                      <span>{{ list.name }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <!-- 收藏简介 -->
              <div class="editList collectDesc">
                <label class="cell">{{ collectdescname }}</label>
                <div class="cell">
                  <textarea cols="30" rows="6" v-model="collectDesc" :placeholder="descText"
                            maxlength="300"></textarea>
                </div>
              </div>
            </div>
            <div class="configBox">
              <div class="box vux-1px-t">
                <button @click="popupShow.edit=false">{{ cancelT }}</button>
                <button @click="commitChange">{{ sureT }}</button>
              </div>
            </div>
          </div>
        </div>
      </popup>
    </div>
    <div class="popup-collect-details" v-transfer-dom>
      <!---->
      <popup v-model="popupShow.unload">
        <div class="popupUnload">
          <h3 class="popup-bottom-title">收藏夹</h3>
          <div class="popup-bottom-content">
            <!---->
            <div class="collect_search">
              <div class="inputgle">
                <input v-model="addVal" type='text' @input="createInput(40)"
                       :placeholder='placeholders' class="createVal" @keyup.13="addFavourite()"/>
                <i class="icon iconfont icon-X closeInputVal" v-show="addVal !=''" @click="addVal = ''"></i>
              </div>
              <div class="inputbtn">
                <button class='createDom' @click="addFavourite()">创建</button>
              </div>
            </div>
            <div class="am-collect-sns">
              <ul>
                <li @click="morenzhuancun('default')">
                  <div class="box vux-1px-b">
                    <p>{{'默认收藏夹'}}</p>
                    <div class="bottom">
                      <ul>
                        <li>
                          <div><img :src="category.statute" alt=""><span>{{collectDefaultData.lawCount}}</span></div>
                          <div><img :src="category.notice" alt=""><span>{{collectDefaultData.caseCount}}</span></div>
                          <div><img :src="category.reportIcon"><span>{{collectDefaultData.reportCount}}</span></div>
                          <div><img :src="category.qaIcon" alt=""><span>{{collectDefaultData.qaCount}}</span></div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
                <li v-for="(list, index) in collectData" @click="linkRulesContent(index)">
                  <div class="box vux-1px-b">
                    <p>{{list.favouriteName}}</p>
                    <div class="bottom">
                      <ul>
                        <li>
                          <div><img :src="category.statute" alt=""><span>{{list.lawCount}}</span></div>
                          <div><img :src="category.notice" alt=""><span>{{list.caseCount}}</span></div>
                          <div><img :src="category.reportIcon" alt=""><span>{{list.reportCount}}</span></div>
                          <div><img :src="category.qaIcon" alt=""><span>{{list.qaCount}}</span></div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <footer class="popup-bottom-footer vux-1px-t">
            <button class="share_btn" @click="popupShow.unload = false">{{cancelT}}</button>
          </footer>
        </div>
      </popup>
    </div>
    <!--分享-->
    <transition name="bounce">
      <div class="testEndFenXiang" @click="popupShow.share = false" v-show="popupShow.share">
        <div></div>
      </div>
    </transition>
    <!---->
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="false"
                    :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
    <xiaoan-error v-show="error"></xiaoan-error>
    <v-loading v-show="isLoading"></v-loading>
  </div>
</template>

<script>
  import VReturnHome from "../../components/warning/returnHome.vue";
  import VLoading from "../../components/warning/loading.vue";
  import {
    Flexbox, FlexboxItem, Popup, Swipeout, SwipeoutButton, SwipeoutItem, Swiper, SwiperItem, Tab, Tabbar,
    TabbarItem, TabItem, TransferDom,
  } from 'vux'
  import CollectDetItem from './components/collect/collectDetItem';
  import XiaoanWarning from '@/components/warning/warning'
  export default {
    name: 'collectDetails',
    components: {
      CollectDetItem,
      VReturnHome, VLoading, XiaoanWarning,
      Tab,
      TabItem,
      Swiper,
      SwiperItem,
      Tabbar,
      TabbarItem,
      Popup,
      Swipeout, SwipeoutButton, SwipeoutItem, Flexbox, FlexboxItem,
    },
    directives: {
      TransferDom
    },
    watch: {
      active: function (index) {
        console.log(this.tabData[index]);
        let da = window.JSON.stringify({id: this.$route.query.id, active: index});
        window.sessionStorage.setItem('collect-details-id-active', da);
      }
    },
    data() {
      return {
        warningText: {
          top: '25%',
          show: false,
          img: this.$image.warning.warning3,
          text: '您暂时还没有收藏！',
          btnText: ''
        },
        category: {
          notice: this.$image.collect.statute,
          statute: this.$image.collect.notice,
          reportIcon: this.$image.report.reportCollect,
          qaIcon: this.$image.collect.qa
        },
        loading: true,
        error: false,
        warningTo: {
          top: '25%',
          show: false,
          img: this.$image.warning.warning3,
          text: '您暂时还没有收藏！',
          btnText: ''
        },
        warning: {
          top: '28%',
          show: false,
          img: this.$image.warning.shixiaolianjie,
          text: '该链接已失效！',
          btnText: '我的关注'
        },
        showPrompt: false, // 转存提示
        collectDefaultData: {},
        collectData: [],
        addVal: '',
        page: {
          index: 1,
          size: 20,
          total: 0
        },
        placeholders: '请输入新建收藏夹名称(最多40个字)',
        tabHeight: 0,
        tabData: [
          {show: true, name: "全部", type: "total"},
          {show: true, name: "法规", type: "law"},
          {show: true, name: "公告", type: "case"},
          // {name: "案例", type: "coses"},
          {show: true, name: "研报", type: "report"},
          {show: true, name: "IPO", type: "publish"},
          {show: true, name: "问答", type: "qa"},
        ],
        collectDetailsData: [],
        popupShow: {
          attribute: false,
          edit: false,
          unload: false,
          share: false,
          prompt: false
        },
        openDosc: false,
        footerHome: {id: 0, name: '主页', value: '', icon: this.$image.base.home, isshow: false},
        tabbarData: [
          {name: "基本信息", type: "attribute", show: true, selected: false, img: this.$image.rules.Attribute},
          {name: "分享", type: "share", show: true, selected: false, img: this.$image.rules.share},
          {name: "编辑", type: "edit", show: true, selected: false, img: this.$image.rules.editimg},
          {name: "取消订阅", type: "groom", show: false, selected: true, img: this.$image.personal.groomCl},
          {name: "转存", type: "unload", show: false, selected: false, img: this.$image.rules.editimg},
        ],
        active: 0,
        infoObject: "",//基本信息对象
        cancelT: "取消",
        sureT: "确定",
        collId: '',
        collectName: "收藏名称",//收藏夹名称
        collectDesc: "收藏简介",
        collectNames: "收藏名称",
        collectdescname: "收藏简介",
        descText: "介绍一下你的收藏夹...",
        editcollectName: "",//编辑收藏夹名称
        oldname: "",//原来收藏夹的名称
        rangeName: "适用范围",
        rangeArr: [
          {selectStatus: false, name: "沪市主板"},
          {selectStatus: false, name: "深市主板"},
          {selectStatus: false, name: "深市中小板"},
          {selectStatus: false, name: "深市创业板"},
          {selectStatus: false, name: "新三板"},
        ],
        user_id: "",
        shareUser: true, //是否为收藏夹创建者
        infoArr: [],//收藏夹适用范围
        newdingyue: "",//是否有新订阅
        uid: "",//随机数
        lastsuijishu: "",//上一次的随机数
        sharekey: "",
        isLoading: false,
        /* 编辑收藏夹 */
        testEndFenXiangs: false,//分享引导页显示状态

      }
    },
    created() {
      // 防止出错
      this.user_id = this.$cookie.getCookie("userId");
      if (this.$cookie.isLogin()) {
        // this.apiUserHome()
        // 有登陆
        if (this.$route.query.id !== undefined) {
          this.collId = this.$route.query.id;
        } else {
          this.$vux.toast.show({text: '详情页没有id，跳转到收藏页', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
        if (this.$route.query.show !== undefined) {
          if (this.$route.query.uuid !== undefined && this.$route.query.uuid !== '') {
            this.popupShow.edit = false;
          } else {
            this.popupShow.edit = true;
          }
        }
        if (this.$route.query.uuid !== undefined) {
          this.uid = this.$route.query.uuid;
        }
        if (window.sessionStorage.getItem('collect-details-id-active')) {
          let data = window.JSON.parse(window.sessionStorage.getItem('collect-details-id-active'));
          if (this.$route.query.id == data.id) {
            this.active = Number(data.active);
          }
        }
        //
        this.getCollect();
        //
        this.getDefault();
        this.getFavourite();
        //
      } else {
        this.$storage.loginStatus(this, '收藏', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        let head = this.$refs.headerDom.clientHeight;
        let tabDom = this.$refs.tabDom.clientHeight;
        let tabbarDom = this.$refs.tabbarDom.clientHeight;
        console.log('tabbarDom', tabbarDom);
        this.tabHeight = this.$refs.collectDetailsDom.clientHeight - head - tabDom - tabbarDom;
      });
    },
    methods: {
      // 获取登录信息
      apiUserHome() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            let isTestUser = data.testUser;
            if (isTestUser == false) {
              // 非测试用户
              this.tabData.forEach((item) => {
                if (item.type == 'qa') {
                  item.show = false;
                }
              })
            }
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      // 详情跳转到法规的主页
      goHome() {
        this.$nextTick(() => {
          this.$router.push({path: "/rule"});
        })
      },
      openDoscClick() {
        this.openDosc = false;
        //
        this.$nextTick(() => {
          let head = this.$refs.headerDom.clientHeight;
          let tabDom = this.$refs.tabDom.clientHeight;
          let tabbarDom = this.$refs.tabbarDom.clientHeight;
          console.log('tabbarDom', tabbarDom);
          this.tabHeight = this.$refs.collectDetailsDom.clientHeight - head - tabDom - tabbarDom;
        })
      },
      //
      onOffClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteCollectById(index);
            console.log(index);
          },
          onCancel() {
          }
        })
      },
      // 创建项目
      addFavourite() {
        if (this.addVal == '') {
          return false
        }
        let params = {
            favouriteName: this.addVal,
            isDefault: 0,
          }
        this.$axios.favourite.addFavourite(params).then(res => {
          if (res.data.returnCode == 1) {
            this.addVal = ''
            this.$vux.toast.show({text: '创建成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.getFavourite();
          } else if (res.data.returnCode == 3) {
            this.$vux.toast.show({text: '收藏夹不能相同', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else if (res.data.returnCode == 2) {
            this.$vux.toast.show({text: '最多只能创建十个收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.addVal = '';
          }
        }).catch((err) => {
          console.log(err)
        });
      },
      // 点击转存默认收藏夹
      morenzhuancun() {
        let collectId = this.collectDefaultData.id;
        this.savedSubscription(collectId)
      },
      //转存接口方法
      savedSubscription(id) {
        console.log(id)
        let params = {
            favouriteId: this.collId,
            toFavouriteId: id,
          }
        this.$axios.favourite.savedSubscription(params).then(res => {
          if (res.data.returnCode == 1) {
            this.popupShow.unload = false;
            this.$vux.toast.show({text: '转存成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$nextTick(() => {
              this.getDefault();
              this.getFavourite();
            })
          } else if (res.data.returnCode == 2) {
            this.popupShow.unload = false;
            this.$vux.toast.show({text: '已存入该收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err);
          this.popupShow.unload = false;
          this.$vux.toast.show({
            text: 'favourite.savedSubscription=>网络错误',
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
        })
      },
      //点击转存收藏夹
      linkRulesContent(index) {
        console.log(index);
        let collectId = this.collectData[index].id;
        this.savedSubscription(collectId)
      },
      // 默认收藏夹
      getDefault() {
        let params = {}
        this.$axios.favourite.getDefault(params).then(res => {
          this.collectDefaultData = res.data.returnObject;
        }).catch((err) => {
          console.log(err);
        })
      },
      // 获取我的收藏夹
      getFavourite() {
        let params = {
            pageSize: this.page.size,
            pageIndex: this.page.index
          }
        this.$axios.favourite.getFavourite(params).then(res => {
          this.collectData = [];
          if (res.data.returnCode == 1) {
            if (res.data.returnObject == "" || res.data.returnObject == null) {
              this.collectData = [];
            } else {
              this.$nextTick(() => {
                this.collectData = res.data.returnObject.list;
              })
            }
          } else {
          }
        }).catch((err) => {
          this.$vux.toast.show({text: '获取收藏夹失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      // 创建input
      createInput(maxlength) {
        this.addVal = this.$array.trim(this.addVal);
        if (this.addVal.length > maxlength) {
          this.addVal = this.addVal.substring(0, maxlength);
        }
      },
      //
      footerClick(index) {
        console.log(index, this.tabbarData[index]);
        let active = false;
        switch (this.tabbarData[index].type) {
          case 'attribute':
            this.popupShow.attribute = true;
            break;
          case 'share':
            active = false;
            this.tabbarData.forEach((item) => {
              if (item.type == 'share') {
                active = item.selected;
              }
            });
            if (active) {
              this.shareSwitch(false);
            } else {
              this.popupShow.share = true;
            }
            break;
          case 'edit':
            this.popupShow.edit = true;
            break;
          case 'groom':
            active = false;
            this.tabbarData.forEach((item) => {
              if (item.type == 'groom') {
                active = item.selected;
              }
            });
            if (active) {
              this.cancelSubscription();
            } else {
              this.addSubscription();
            }
            break;
          case 'unload':
            this.popupShow.unload = true;
            this.addVal = this.collectName;
            break;
        }
      },
      // 市场主板多选
      selectItem(index) {
        this.rangeArr[index].selectStatus ? this.rangeArr[index].selectStatus = false : this.rangeArr[index].selectStatus = true;
      },
      // 订阅接口
      addSubscription() {
        let params = {
            favouriteId: this.collId
          }
        this.$axios.favourite.addSubscription(params).then(res => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.tabbarData.forEach((item) => {
              if (item.type == 'groom') {
                item.selected = true;
                item.name = '取消订阅';
              }
            });
            this.$vux.toast.show({text: '订阅成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.showPrompt = true;
            setTimeout(() => {
              this.showPrompt = false;
            }, 3000)
            this.getCollect();
          } else if (res.data.returnCode == '-2') {
            this.$vux.toast.show({text: '已订阅过此收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$vux.toast.show({text: '添加订阅失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 取消订阅接口
      cancelSubscription() {
        let params = {
            id: this.collId
          }
        this.$axios.favourite.cancelSubscription(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.tabbarData.forEach((item) => {
              if (item.type == 'groom') {
                item.selected = false;
                item.name = '订阅';
              }
            });
            this.$vux.toast.show({text: '已取消订阅', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$vux.toast.show({text: '取消订阅失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 获取收藏夹内容
      getCollect() {
        let params = {
            favourableId: this.collId,
            page: this.page.index,
            rows: 2,
            shareKey: this.uid,
          }
        this.$axios.collect.getCollect(params).then(res => {
          this.warning.show = false;
          console.log('3453555555', res.data.returnCode);
          if (res.data.returnCode == 1 || res.data.returnCode == -1) {
            let nextShareKey = this.uuid(8, 16);
            // 如果有返回值就传出去到组件
            this.shareUser = res.data.returnObject.isOwner;
            // console.log('========>', typeof this.shareUser);
            this.infoObject = res.data.returnObject.favourite; // 基本信息
            // 处理收藏夹 文字描述
            this.$nextTick(() => {
              // 简介
              if (this.infoObject.introduction == null || this.infoObject.introduction === '') {
                return false
              }
              this.openDosc = false;
              let hei = this.$refs.doscTextDom.clientHeight;
              console.log('4535355', this.$refs.doscTextDom.clientHeight);
              console.log('4535355', hei / 20);
              if (hei / 20 > 2) {
                this.openDosc = true
              } else {
                this.openDosc = false
              }
            });
            // 分享的key
            this.lastsuijishu = res.data.returnObject.favourite.shareKey;
            // 开始的收藏夹名称
            this.oldname = this.infoObject.favouriteName;
            // 收藏夹名称
            this.collectName = res.data.returnObject.favourite.favouriteName;
            this.$route.meta.title = this.collectName;
            window.document.title = this.collectName;
            // 收藏夹描述
            this.collectDesc = this.infoObject.introduction;
            // 如果已分享取到的this.lastsuijishu = null 从新赋值this.lastsuijishu
            // cai for 9.29==>11:49
            if (this.lastsuijishu == null || this.lastsuijishu == "") {
              this.lastsuijishu = nextShareKey;
            }
            this.infoObject.share ? this.sharekey = this.lastsuijishu : this.sharekey = nextShareKey;

            if (this.shareUser) {
              // 我自己的
            } else {
              // 分享的
              this.tabbarData.forEach((item) => {
                item.show = true;
                if (item.type == 'share' || item.type == 'edit') {
                  item.show = false;
                }
              })
            }
            // 通过"isSubscribe" 判断是否订阅
            var isSubscribe = res.data.returnObject.isSubscribe;
            this.tabbarData.forEach((item) => {
              if (item.type == 'groom') {
                if (isSubscribe) {
                  item.selected = true;
                  item.name = '取消订阅';
                } else {
                  item.selected = false;
                  item.name = '订阅';
                }
              }
              if (item.type == 'share') {
                if (this.infoObject.share) {
                  item.selected = true;
                  item.name = '取消分享';
                } else {
                  item.selected = false;
                  item.name = '分享';
                }
              }
            });

            // 如果有新用户订阅 弹出提示
            this.newdingyue = res.data.returnObject.isNewAdd;
            if (this.newdingyue) {
              if (this.infoObject.subscribers !== null) {
                this.$vux.toast.show({
                  text: '已有' + this.infoObject.subscribers + '人订阅',
                  position: 'middle',
                  type: 'text',
                  width: 'auto',
                  time: 2500
                });
              }
            }
            // 适用范围
            if (res.data.returnObject.favourite.limitation !== '' && res.data.returnObject.favourite.limitation !== null) {
              this.infoArr = this.infoObject.limitation.split(',');
              this.rangeArr.forEach((k1) => {
                this.infoArr.forEach((k2) => {
                  if (k1.name == k2) {
                    k1.selectStatus = true;
                  }
                })
              })
            } else {
              this.infoArr = [];
            }
            //
            if (res.data.returnCode == -1) {
              this.warningTo.show = true;
            }
            //
            // 微信分享控制
            let adverttitle = this.collectName;
            let sharelink2 = '';
            let shareDesc = "";//描述
            if ((window.location.href).indexOf('uuid') >= 0) {
              sharelink2 = (window.location.href).substring(0, (window.location.href).indexOf('uuid')) + 'uuid=' + this.sharekey;
            } else {
              sharelink2 = window.location.href + "&uuid=" + this.sharekey; // 分享链接
            }
            if (this.collectDesc == null || this.collectDesc == "" || this.collectDesc == undefined || this.collectDesc.length == 0) {
              shareDesc = "上市公司、专业机构移动董办工具首选！";
            } else {
              shareDesc = this.collectDesc;
            }
            this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true, this.shareSuccess);
            /////////////////////////////dsfsdf
          } else if (res.data.returnCode == -2) {
            // 创建者已取消分享
            // alert(1);
            this.warning.show = true;
          } else {
            this.error = true;
          }
          // 动态处理数据
          setTimeout(() => {
            this.$nextTick(() => {
              let head = this.$refs.headerDom.clientHeight;
              let tabDom = this.$refs.tabDom.clientHeight;
              let tabbarDom = this.$refs.tabbarDom.clientHeight;
              console.log('tabbarDom', tabbarDom);
              this.tabHeight = this.$refs.collectDetailsDom.clientHeight - head - tabDom - tabbarDom;
            });
          }, 0);

        }).catch((err) => {
          this.error = true;
          console.log(err);
        });
      },
      // 生成uuid
      uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [], i;
        radix = radix || chars.length;

        if (len) {
          // Compact form
          for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
          // rfc4122, version 4 form
          var r;

          // rfc4122 requires these characters
          uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
          uuid[14] = '4';

          // Fill in random data.  At i==19 set the high bits of clock sequence as
          // per rfc4122, sec. 4.1.5
          for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
              r = 0 | Math.random() * 16;
              uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
          }
        }

        return uuid.join('');
      },
      //
      updateFavouriteName(str, cid, editCollectName) {
        let params = {
            id: cid,
            favouriteName: editCollectName,
            range: str,
            introduction: this.collectDesc,
          }
        this.$axios.favourite.updateFavouriteName(params).then(res => {
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '编辑收藏夹成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.getCollect();
            this.popupShow.edit = false;
          } else if (res.data.returnCode == 3) {
            this.$vux.toast.show({text: '该文件名已存在', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({
            text: 'favourite/updateFavouriteName=>' + err.message,
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
        });
      },
      // 提交修改
      commitChange() {
        let rangearr = [], str = '';
        this.rangeArr.forEach((item) => {
          if (item.selectStatus === true) {
            rangearr.push(item.name)
          }
        });
        str = rangearr.join(',');
        if (rangearr == [] || rangearr.length == 0) {
          str = '';
        }
        let cid = parseInt(this.collId);
        //
        this.editcollectName = this.editcollectName == '' ? this.collectName : this.editcollectName;
        //
        let editcollectName = this.editcollectName;
        //
        if (this.editcollectName == this.oldname) {
          editcollectName = null;
        } else {
          editcollectName = this.editcollectName;
        }
        //
        if (this.editcollectName == '' && this.collectDesc == '' && str == '') {
          this.$vux.toast.show({text: '请填写信息', position: 'middle', type: 'text', width: 'auto', time: 2500});
        } else {
          this.updateFavouriteName(str, cid, editcollectName)
        }
      },
      //
      shareSuccess() {
        let params = {
            favouriteId: this.collId,
            shareKey: this.sharekey,
            isShare: true
          }
        this.$axios.favourite.shareSwitch(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '分享成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$nextTick(() => {
              this.getCollect();
            })
          } else {
            this.$vux.toast.show({
              text: res.data.returnMsg + '分享失败-1',
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({
            text: err.message + 'shareSuccess',
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
        })
      },
      //
      testEndFen() {
        this.testEndFenXiangs = false; // close share's page
      },
      //
      shareSwitch(isShare) {
        let params = {
            favouriteId: this.collId,
            isShare: isShare
          }
        this.$axios.favourite.shareSwitch(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.isCollects = '0';
            this.$vux.toast.show({text: '已取消分享', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$nextTick(() => {
              this.getCollect();
            })
          } else {
            this.$vux.toast.show({text: '取消分享失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({
            text: '取消分享失败=>' + err.message,
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
        })
      },
      ///处理。。。
      nuwNumber(str) {
        var hei = document.body.clientWidth;
        var nowH = parseInt((hei - 39) / 15) * 2;
        if (str.length >= nowH) {
          return str.substring(0, nowH) + '...';
        } else {
          return str
        }
      }
    }
  }
</script>

<style lang="scss">
  .collect-details {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #f0f1f5;
    position: relative;
    .showPrompt {
      height: 45px;
      width: 100%;
      color: #ffffff;
      background-color: rgba(255, 153, 51, 0.85);
      position: absolute;
      bottom: 0;
      text-align: center;
      line-height: 45px;
      font-size: 15px;
    }
    .collect-details-scroll {
      height: 100%;
      width: 100%;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      background-color: #FFFFFF;
      /*  收藏夹简介*/
      .collect-details-header {
        height: auto;
        box-sizing: border-box;
        position: relative;
        z-index: 5;
        .details-header-box {
          box-sizing: border-box;
          padding: 17.5px 0 12.5px 0;
          position: relative;
          .xiaoan-divider {
            text-align: center;
            color: #ffb551;
            .xiaoan-divider-middle-text {
              padding: 0 6px 0 6px;
              font-size: 15px;
              max-width: 50%;
              display: inline-block;
              font-family: PingFangSC-Medium, sans-serif;
            }
            .xiaoan-divider-left, .xiaoan-divider-right {
              width: 60px;
              height: 2px;
              display: inline-block;
              box-sizing: border-box;
              border-bottom: 0.5px solid #ffb551;
              position: relative;
              top: -5px;
            }
            .xiaoan-divider-left i {
              height: 3px;
              width: 3px;
              background-color: #ffb551;
              border-radius: 50%;
              position: absolute;
              right: 0;
            }
            .xiaoan-divider-right i {
              height: 3px;
              width: 3px;
              background-color: #ffb551;
              position: absolute;
              border-radius: 50%;
              left: 0;
              top: 0;
            }
          }
        }
        .details-header-text {
          padding: 0 12px 0 12px;
          font-size: 13px;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          color: #8d8d8d;
          margin-bottom: 8px;
          p {
            width: 100%;
            word-break: break-all;
            text-align: justify;
            text-justify: auto;
            line-height: 20px;
          }
        }
        .details-header-text.MaxHeight {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          line-height: 20px;
          max-height: 40px;
          position: relative;
          .opendosc {
            position: absolute;
            bottom: -2px;
            background: #fff;
            right: 0;
            padding: 2px 12px 2px 7px;
            /* -moz-box-shadow: -5px 0px 0px #fff;
             -webkit-box-shadow: -5px 0px 0px #fff;*/
            filter: drop-shadow(-5px 0px 0px #fff);
            -webkit-filter: drop-shadow(-5px 0px 0px #fff);
            span {
              color: #ffb148;
            }
            b {
              color: #ffb148;
              font-size: 13px;
            }
          }
        }
        .details-header-foo {
          width: 100%;
          height: 7.5px;
          background-color: #f0f1f5;
        }
      }
      .collect-details-container {
        position: relative;
        .tab-container {
          position: relative;
          .vux-slider {
            height: 100%;
            width: 100%;
            overflow: hidden;
            .collect-det-item-scroll {
              height: 100%;
              width: 100%;
              overflow-y: scroll;
              -webkit-overflow-scrolling: touch;
            }
          }
        }
      }
      .collect-details-footer {
        position: absolute;
        z-index: 500;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        background-color: #F7F7FA;
        display: flex;
        //
        .tabbar-items:hover .tt-clue {
          opacity: 0.9;
          bottom: 70px;
        }
        .footer-home:active {
          background-color: #e3e3e3;
          -webkit-transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
        .tabbar-items.footer-home {
          text-align: center;
          border-right: 1px solid #e3e3e3;
          flex: 0 0 15%;
        }
        .tabbar-items {
          flex: 1;
          height: 100%;
          text-align: center;
          color: #767877;
          font-size: 12px;
          text-decoration: none;
          padding: 6px 0 5px 0;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          position: relative;
          .tabbar-icon {
            font-size: 0;
            img {
              height: 17px;
            }
          }
          .tabbar-value {
            font-size: 12px;
            color: #767877;
            padding-top: 3px;
          }
        }
        .tabbar-items.active {
          color: #f6900c;
        }
        .tabbar-items span {
          display: block;
          width: 100%;
        }
      }
    }
    /* 分享引导页 */
    .testEndFenXiang {
      z-index: 10000;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      background: rgba(0, 0, 0, 0.8);
    }
    .testEndFenXiang div {
      background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/fxscj.jpg");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 276.097px;
      height: 270px;
      margin: 35px auto 0 auto;
      margin-right: 25px;
    }

  }
  .popup-collect-details {
    background-color: #f0f1f5;
    .vux-popup-dialog.vux-popup-bottom {
      background-color: #f0f1f5;
      overflow: hidden;
    }
    .popupAttribute {
      .title {
        height: 45px;
        text-align: center;
        width: 100%;
        line-height: 45px;
        font-size: 16px;
        color: #323232;
        border-bottom: 1px solid #e3e3e3;
        font-family: PingFangSC-Medium, sans-serif;
        background-color: #FFFFFF;
      }
      .ul-box {
        background-color: #FFFFFF;
        font-size: 15px;
        .list {
          width: 100%;
          padding: 0 12px;
          .box {
            table-layout: fixed;
            word-wrap: break-word;
            display: table;
            width: 100%;
            padding: 10px 0;
            font-size: 15px;
            .cell {
              display: table-cell;
              vertical-align: top;
            }
            .cell.left {
              width: 23%;
            }
            .cell.right {
              width: 77%;
              span {
                b {
                  text-align: center;
                  display: inline-block;
                  padding: 0 5px;
                  border-radius: 20px;
                  font-size: 10px;
                  border: 1px solid #f0ad4e;
                  margin-right: 5px;
                }
                .SHColor {
                  color: #a9262c;
                  border-color: #a9262c;
                }
                .SZColor {
                  color: #174299;
                  border-color: #174299;
                }
                .XSBColor {
                  color: #f6900c;
                  border-color: #f6900c;
                }
              }
            }
          }
        }
      }
      .footer {
        width: 100%;
        height: 45px;
        background-color: #FFFFFF;
        color: #ffb148;
        font-size: 16px;
        border-top: 1px solid #e3e3e3;
        button {
          width: 100%;
          height: 100%;
          border: 0;
          background-color: #FFFFFF;
          color: #ffb148;
        }
      }
    }
    .popupEdit {
      height: 100%;
      width: 100%;
      /* 编辑收藏夹名称 */
      .editbox {
        width: 100%;
        height: 100%;
        background: #fff;
        padding-bottom: 51px;
        .infobox {
          width: 100%;
          height: 100%;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          .editList.range {
            height: auto;
          }
          .editList.title {
          }
          .editList.collectDesc {
            border: 0 solid #FFFFFF;
          }
          .editList {
            display: table;
            table-layout: fixed;
            width: 100%;
            height: auto;
            background: #fff;
            border-bottom: 7.5px solid #f0f1f5;
            padding: 20px 10px;
            .cell {
              display: table-cell;
              vertical-align: top;
            }
            label.cell {
              width: 21%;
              height: 100%;
              font-size: 15px;
              color: #323232;
            }
            div.cell {
              width: 75%;
              height: 100%;
              position: relative;
              color: #8d8d8d;
              .editListTextarea {
                width: 100%;
                height: 40px;
                border: 1px solid #e3e3e3;
                border-radius: 4px;
                font-size: 15px;
                color: #8d8d8d;
                padding: 0 3%;
                &:focus {
                  border: 1px solid #ffb148;
                  -webkit-transition: border 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                  transition: border 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                }
              }
              .editListTextarea.disabled {
                background-color: #f0f1f5;
                color: #000;
              }
              b {
                width: 15px;
                height: 15px;
                color: #c1c1c1;
                position: absolute;
                right: 10px;
                top: 0;
                bottom: 0;
                margin: auto;
              }
              ul {
                width: 100%;
                height: 100%;
                position: relative;
                list-style: none;
                font-size: 15px;
                color: #8d8d8d;
                li {
                  margin-bottom: 24px;
                  span {
                    vertical-align: middle;
                    &:last-child {
                      display: inline-block;
                      padding: 0 0 0 10px;
                    }
                    &:first-child {
                      width: 14px;
                      height: 14px;
                      border: 1px solid #8d8d8d;
                      border-radius: 2px;
                      display: inline-block;
                      box-sizing: border-box;
                    }
                  }
                  .selected {
                    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/chengseduigou.png");
                    background-size: contain;
                    border: 1px solid #ffb148 !important;
                  }
                }
              }
              textarea {
                width: 100%;
                text-align: justify;
                position: relative;
                padding: 2%;
                font-size: 15px;
                border-radius: 4px;
                resize: none;
                color: #8d8d8d;
                border: 1px solid #e3e3e3;
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch;
                &:focus {
                  border: 1px solid #ffb148;
                  -webkit-transition: border 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                  transition: border 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
                }
              }
            }
          }
        }
        .configBox {
          width: 100%;
          height: 50px;
          font-size: 18px;
          color: #ffb048;
          position: absolute;
          left: 0;
          bottom: 0;
          .box {
            display: flex;
            height: 100%;
            width: 100%;
            button {
              border: 0;
              font-size: 15px;
            }
            button:first-child, button:last-child {
              width: 50%;
              height: 100%;
              text-align: center;
              background: #fff;
              flex: 1;
            }
            button:last-child {
              background: #ffb048;
              color: #fff;
            }
          }
        }
      }

    }
    .popupUnload {
      background-color: #f0f1f5;
      .popup-bottom-title {
        width: 100%;
        height: 45px;
        background-color: #fff;
        color: #323232;
        margin: 0;
        font-size: 16px;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        text-align: center;
        line-height: 50px;
      }
      .popup-bottom-content {
        .rulesPlateHeader {
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 300px;
          -webkit-overflow-scrolling: touch;
          .rulesPlate {
            background-color: white;
            padding: 12px 12px 0 12px;
            font-size: 14px;
            text-align: left;
            color: #323232;
            .rulesGulop {
              padding-bottom: 12px;
              border-bottom: 0.5px solid #e3e3e3;
              .rulesfw {
                font-size: 15px;
                color: #323232;
              }
              .market {
                text-align: center;
                display: inline-block;
                padding: 0 5px;
                border-radius: 20px;
                font-size: 10px;
                border: 1px solid #ffb148;
                margin-right: 5px;
              }
            }
          }
          .smCaption {
            text-align: left;
            padding: 12px 12px 0 12px;
            color: #323232;
            .nounits {
              border-bottom: none !important;
            }
            .units {
              display: flex;
              flex-flow: row;
              color: #323232;
              font-size: 15px;
              padding-bottom: 12px;
              border-bottom: 0.5px solid #e3e3e3;
              .unitsTitle {
              }
              .unitsCont {
                text-align: justify;
                flex: 1;
                box-sizing: border-box;
                .unitsName {
                }
              }
            }
          }
        }
        .collect_search {
          width: 100%;
          height: 50px;
          background-color: #f0f1f5;
          padding: 7.5px 12px;
          .inputgle {
            height: 35px;
            width: 84%;
            background-color: #8d8d8d;
            border-radius: 2px;
            display: inline-block;
            float: left;
            border: 0;
            position: relative;
            &:active {
              background-color: #fff;
            }
            .createVal {
              border: 0;
              float: left;
              height: 35px;
              margin: 0;
              width: 100%;
              padding: 0 0 0 12px;
              border-radius: 2px;
              outline: none;
              box-sizing: border-box;
              font-size: 15px;
              &:active {
                background-color: transparent;
              }
            }
            .closeInputVal {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              right: 3%;
              width: 16px;
              height: 16px;
              color: #aeaeae;
            }
          }
          .inputbtn {
            height: 35px;
            width: 13%;
            border-radius: 2px;
            display: inline-block;
            float: right;
            vertical-align: middle;
            .createDom {
              float: right;
              border: 0;
              background-color: white;
              height: 35px;
              border-radius: 2px;
              font-size: 15px;
              width: 100%;
              padding: 0;
              color: #ffb148;
            }
          }
        }
        .am-collect-sns {
          background-color: #fff;
          width: 100%;
          max-height: 300px;
          margin: 0;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          list-style: none;
          overflow-y: scroll;
          -webkit-overflow-scrolling: touch;
          font-size: 15px;
          color: #323232;
        }
        ul {
          width: 100%;
          background-color: #FFFFFF;
          li {
            padding: 0 10px;
            div.box {
              padding: 5px 0;
              p {
                font-size: 15px;
                color: #323232;
              }
              .bottom {
                ul {
                  display: table;
                  width: 100%;
                  li {
                    display: table-cell;
                    vertical-align: middle;
                    text-align: right;
                    div {
                      padding-left: 7px;
                      display: inline-block;
                      img {
                        vertical-align: middle;
                        height: 14px;
                        font-size: 0;
                      }
                      span {
                        font-size: 12px;
                        vertical-align: middle;
                        color: #8d8d8d;
                        padding-left: 5px;
                      }
                    }
                  }
                  li.data {
                    text-align: right;
                    span {
                      color: #8d8d8d;
                    }
                  }
                }
              }
            }
          }
          li:last-child {
            div.box {
              &:after {
                border-color: transparent;
              }
            }
          }
        }
      }
      .popup-bottom-footer {
        width: 100%;
        height: 45px;
        font-size: 16px;
        .share_btn {
          display: block;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          text-align: center;
          line-height: 45px;
          background: white;
          color: #ffb148;
          font-size: 16px;
        }
      }
    }
  }
</style>
