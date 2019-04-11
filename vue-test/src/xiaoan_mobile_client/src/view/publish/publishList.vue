<template>
  <div id="publishList" class="xiaoan-box publishList" ref="publishListDom">
    <div class="publishList-box">
      <div ref="searchHeadDom" class="searchs">
        <div class="seabox">
          <div class="iconTripsousuo"><i class="icon iconfont icon-tripsousuo"></i></div>
          <ul class="searchScroll" @click="goSearchroute">
            <template v-if="keyWordArray.length == 0">{{placeholder}}</template>
            <li class="searchScrollSpan" v-for="(list,index) in keyWordArray" id="searchScrollSpan">{{newBtnArr(list)}}
              <span class="searchClose" @click.stop="searchClose(index)"><img :src="$image.base.searchDelete"></span>
            </li>
          </ul>
          <div class="goSearch">
            <div class="rulesNum" v-show="num>=1">{{num+"条"}}</div>
          </div>
        </div>
      </div>
      <!----------------------------------------筛选------------------------------------>
      <div class="select-search-box vux-1px-b" ref="searchSreenDom">
        <div class="select-flex">
          <div v-for="(item, index) in selectedData" class="row" v-if="item.type !='time'" :class="{pass:item.popover}"
               @click="selectedChange(index)">
            <span>{{nameClass(item.name, 4, item.type)}}</span><i
            class="icon iconfont icon-xiangxiajiantou iconBottom"></i>
          </div>
          <div class="row right">
            <badge v-show="isHighlight" class="vxa-badge"></badge>
            <button type="button" class="select-btn" @click="isRightPopup = true">筛选</button>
          </div>
        </div>
      </div>
      <!----------------------->
      <div class="select-box-content" :style="{height:selectBoxContent+'px'}" v-for="(item,i) in selectedData"
           v-if="item.popover">
        <div class="item-box" :class="{'no-item': item.list.length % 2 != 0}">
          <div class="item vux-1px-b" :class="{'is-right': index % 2 != 0}" v-for="(list,index) in item.list"
               @click="checkboxChange(i,index)">
            <vxa-checkbox :key="index+Math.random()" :show="list.show"></vxa-checkbox>
            <span class="item-title">{{list.name}}</span>
            <span class="item-line"></span>
          </div>
        </div>
        <!---->
        <div class="select-box-bottom vux-1px-t">
          <button type="button" class="reset" @click="selectReset(i)">重置</button>
          <button type="button" class="yeah" @click="selectSubmit(i)">确认</button>
        </div>
      </div>
      <!--------------------------------------列表--------------------------------------->
      <div ref="contTextDom" class="wrapper wrapper-scroller v-content" id="wrapper"
           :style="{height: listHeight+'px' }">
        <vxa-li @loadMore="loadMore" :listData="listData" :loading="loading"></vxa-li>
        <div v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="hasNext"></xiaoan-drop>
        </div>
        <xiaoan-warning v-show="contentShow" :imgSrc="$image.rules.trySenior"
                        :message="'搜索不到想关内容，试试别的关键词吧'" style="z-index: 100" :isShowBtn="false"></xiaoan-warning>

      </div>
      <!----------------------------------->
      <div class="show-prompt">移动端仅支持IPO检索，更多功能请前往PC端查看！</div>
      <!---------------------------------------------->
      <xiaoan-loading v-show="fullLoading" bgColor="rgba(255,255,255,0.8)"></xiaoan-loading>
    </div>
    <!---->
    <div class="vxa-popup-transfer-dom" v-transfer-dom>
      <popup v-model="isRightPopup" position="right" :width="'72%'" @on-hide="popupHide">
        <div class="popup-box">
          <div class="box-header vux-1px-b">
            <button @click="isRightPopup = false"><i class="icon iconfont icon-x"></i></button>
            <span class="title">筛选</span>
          </div>
          <div class="box-content">
            <group gutter="0" class="box-group">
              <template v-for="(item, index) in selectedData">
                <cell :key="index" :title="nameClass(item.name,14, item.type)" class="is-transition-active"
                      :class="{'is-active vux-1px-b': item.popup}"
                      is-link :border-intent="true" :arrow-direction="item.popup ? 'up' : 'down'"
                      @click.native="optionChange(index)"></cell>
                <div class="cell-content slide" :class="item.popup?'animate':''">
                  <ul v-if="item.type =='time'">
                    <li class="not-active">
                      <div class="li-box vux-1px-b">
                        <x-input class="li-box-input" disabled readonly v-model="initialDate.start"
                                 title="起始日期" placeholder="请输入起始日期"></x-input>
                      </div>
                      <div class="box-shadow">
                        <span class="row" @click="startPlugin"></span>
                        <span class="clear" v-if="initialDate.start!=''"
                              @click="initialDate.start = ''"><i
                          class="icon iconfont icon-X"></i></span>
                      </div>
                    </li>
                    <li class="not-active">
                      <div class="li-box vux-1px-b">
                        <x-input class="li-box-input" disabled readonly v-model="initialDate.end"
                                 title="截止日期" placeholder="请输入截止日期"></x-input>
                      </div>
                      <div class="box-shadow">
                        <span class="row" @click="endPlugin"></span>
                        <span class="clear" v-if="initialDate.end!=''"
                              @click="initialDate.end = ''"><i
                          class="icon iconfont icon-X"></i></span>
                      </div>
                    </li>
                  </ul>
                  <ul v-else>
                    <li class="is-transition-active" v-for="(list, j) of item.list" @click="checkboxChange(index,j)">
                      <div class="li-box" :class="{'vux-1px-b': item.list.length-1 != j}">
                        <vxa-checkbox :show="list.show"></vxa-checkbox>
                        <span class="item-title">{{list.name}}</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </template>
            </group>
          </div>
          <div class="box-footer vux-1px-t">
            <button type="button" class="is-transition-active" @click="popupReset">重置</button>
            <button type="button" class="is-transition-active" @click="popupSubmit">确认</button>
          </div>
        </div>
      </popup>
    </div>
    <return-top v-model="returnTop" @click="return_Top"></return-top>
  </div>
</template>

<script>
  import VxaLi from './components/list'
  import {Badge, TransferDom, XButton, Popup, Datetime, Cell, XInput, Group} from 'vux'
  export default {
    name: "publish-ipo-list",
    // 使用其它组件
    components: {
      VxaLi, XButton, Popup, Group, Cell, Datetime, XInput, Badge
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        returnTop: false,
        warningText: false,
        selectedData: [
          {
            list: [],
            initialList: [],
            class: '',
            selected: [],
            show: false,
            popover: false,
            popup: false,
            type: 'market',
            initialName: '所属板块',
            name: '所属板块',
            nodeName: []
          },
          {
            list: [],
            initialList: [],
            class: '',
            selected: [],
            show: false,
            popover: false,
            popup: false,
            type: 'industry',
            initialName: '所属行业',
            name: '所属行业',
            nodeName: []
          },
          {
            list: [],
            initialList: [],
            class: '',
            selected: [],
            show: false,
            popover: false,
            popup: false,
            type: 'confitions',
            initialName: '文件类别',
            name: '文件类别',
            nodeName: []
          },
          {
            list: [],
            initialList: [],
            class: 'time',
            selected: [],
            show: false,
            popover: false,
            popup: false,
            type: 'time',
            initialName: '发布日期',
            name: '发布日期',
            initialDate: ['', ''],
            nodeName: []
          }
        ],
        initialDate: {
          start: '',
          end: ''
        },
        isHighlight: false,
        selectBoxContent: 0,
        paramsData: {
          releaseStartTime: '',
          releaseEndTime: '',
          keyword: '',
          industryCodeLevelOne: '',
          publishEnum: '',
          marketTypeEnum: ''
        },
        fullLoading: true,
        listData: [],
        hasNext: true,
        pageNum: 1,
        pageSize: 20,
        filterConditionsLoading: false,
        isRightPopup: false,
        showContent004: false,
        //
        user_id: '',
        listHeight: 0,
        //
        contentShow: false,
        loading: true,
        infLoading: true,
        placeholder: '',
        keyWordArray: []
      }
    },
    computed: {},
    filters: {},
    watch: {
      isRightPopup: function (val) {
        if (val) {
          this.selectedData.forEach((item) => {
            item.popover = false;
          })
        }
      },
      $route: function (to, form) {
        if (form.name == 'publishSearch') {
          this.routeInit();
        }
      }
    },
    activated() {
      this.setTimeInit();
    },
    deactivated() {
      this.$vux.datetime.hide();
      this.isRightPopup = false;
      this.selectedData.forEach((item) => {
        item.popover = false;
        item.popup = false;
      })
    },
    created() {
      this.routeInit();
    },
    mounted() {
      console.log('mounted');
      this.$nextTick(() => {
        this.listHeight = this.$refs.publishListDom.clientHeight - this.$refs.searchHeadDom.clientHeight - this.$refs.searchSreenDom.clientHeight
        //
        this.$refs.contTextDom.addEventListener('scroll', (e) => {
          // e.stopPropagation();
          let isScrollTop = this.$refs.contTextDom.scrollTop;
          // console.log(isScrollTop);
          if (isScrollTop > 600) {
            this.returnTop = true;
          } else if (isScrollTop <= 600) {
            this.returnTop = false;
          }
        });
      });
      let advertTitle = '收录全网IPO案例，巧避IPO审核雷区';
      let shareDesc = ''; // 描述
      let shareLink = window.location.href; // 分享链接
      this.$weixin.wxshare(advertTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
      setTimeout(() => {
        this.fullLoading = false;
      }, 300)
    },
    // 方法
    methods: {
      setTimeInit() {
        this.$nextTick(() => {
          setTimeout(() => {
            $('.show-prompt').css({'opacity': 1, bottom: '49.5px'});
            setTimeout(() => {
              $('.show-prompt').animate({bottom: "0px", opacity: 0});
            }, 3000);
          })
        })
      },
      routeInit() {
        this.user_id = this.$cookie.getCookie("userId");
        if (this.$cookie.isLogin()) {
          // 已登录调用的接口处
          this.infLoading = true;
          this.$MTAmethod.mtaClick('8hs98u7gje', {'62uzds5vge': 'true'})
        } else {
          this.$storage.loginStatus(this, 'IPO', window.location.href);
        }

        if (this.$route.query.inputVal == "" || this.$route.query.inputVal == undefined) {
          this.placeholder = "搜索关键词,多个关键词空格隔开"
        } else {
          this.keyWordArray = this.$array.ImpArr(this.$route.query.inputVal.split(' '))
          console.log(this.keyWordArray);
        }
        //
        this.keyWordArray = this.keyWordArray ? this.keyWordArray : [];
        this.paramsData.keyword = this.keyWordArray.toString();
        this.pageNum = 1;
        this.listData = [];
        this.hasNext = true;
        this.filterConditions();
      },
      return_Top() {
        $(".wrapper-scroller.v-content").animate({scrollTop: 0});
      },
      //
      checkboxChange(i, index) {
        this.selectedData[i].list[index].show = !this.selectedData[i].list[index].show
      },
      //
      popupHide() {
        console.log('hide');
        setTimeout(() => {
          this.inverseSynchronization();
        }, 300)
      },
      //
      selectedChange(index) {
        this.$nextTick(() => {
          this.listHeight = this.$refs.publishListDom.clientHeight - this.$refs.searchHeadDom.clientHeight - this.$refs.searchSreenDom.clientHeight
          this.selectBoxContent = this.listHeight;
        })
        if (this.selectedData[index].popover) {
        } else {
          this.inverseSynchronization();
        }
        //
        this.selectedData.forEach((item, i) => {
          if (i != index) {
            item.popover = false;
          }
        })
        this.selectedData[index].popover = !this.selectedData[index].popover;
      },
      //
      optionChange(index) {
        this.selectedData.forEach((item, i) => {
          if (i != index) {
            item.popup = false;
          }
        })
        this.selectedData[index].popup = !this.selectedData[index].popup;
      },
      //
      popupReset() {
        this.selectedData.forEach((item, i) => {
          item.list.forEach((list, j) => {
            list.show = false;
          })
        });
        this.initialDate.start = '';
        this.initialDate.end = '';
        this.fullLoading = true;
        this.pageNum = 1;
        this.listData = [];
        //
        this.synchronization();
        //
        this.isRightPopup = false;
      },
      //
      popupSubmit() {
        this.fullLoading = true;
        this.pageNum = 1;
        this.listData = [];
        this.synchronization();
        this.isRightPopup = false;
      },
      // 反向同步
      inverseSynchronization() {
        this.selectedData.forEach((item, i) => {
          if (item.type == 'time') {

          }
          if (item.type == 'market') {
            item.selected = this.$array.ImpArr(this.paramsData.marketTypeEnum.split(','));
          }
          if (item.type == 'confitions') {
            item.selected = this.$array.ImpArr(this.paramsData.publishEnum.split(','));
          }
          if (item.type == 'industry') {
            item.selected = this.$array.ImpArr(this.paramsData.industryCodeLevelOne.split(','));
          }
          item = setItem(item);
        })
        function setItem(ItemData) {
          let Item = ItemData;
          for (let i = 0; i < Item.list.length; i++) {
            Item.list[i].show = false;
            for (let j = 0; j < Item.selected.length; j++) {
              if (Item.selected[j] == Item.list[i].id) {
                Item.list[i].show = true;
              }
            }
          }
          return Item
        }
      },
      // 同步选项
      synchronization() {
        this.isHighlight = false;
        this.selectedData.forEach((item, i) => {
          item.selected = item.list.map(e => {
            if (e.show) {
              return e.id
            }
          });
          item.nodeName = item.list.map(e => {
            if (e.show) {
              return e.name
            }
          });
          if (item.type == 'time') {
            //
            this.paramsData.releaseStartTime = this.initialDate.start;
            this.paramsData.releaseEndTime = this.initialDate.end;
            //
            item.nodeName.push(this.paramsData.releaseStartTime);
            item.nodeName.push(this.paramsData.releaseEndTime);

            if (this.paramsData.releaseStartTime != '' || this.paramsData.releaseEndTime != '') {
              this.isHighlight = true;
            }
          }
          item.name = item.initialName;
          item.selected = this.$array.ImpArr(item.selected);
          item.nodeName = this.$array.ImpArr(item.nodeName);
          if (item.nodeName.length != 0) {
            item.name = item.nodeName.toString();
          }
          if (item.selected.toString() != '') {
            this.isHighlight = true;
          }
          if (item.type == 'market') {
            this.paramsData.marketTypeEnum = item.selected.toString()
          }
          if (item.type == 'confitions') {
            this.paramsData.publishEnum = item.selected.toString()
          }
          if (item.type == 'industry') {
            this.paramsData.industryCodeLevelOne = item.selected.toString()
          }
        })
        //
        this.searchInput();
      },
      //
      selectSubmit(i) {
        this.fullLoading = true;
        this.pageNum = 1;
        this.listData = [];
        this.synchronization();
        this.selectedData[i].popover = false;
        console.log(this.selectedData[i]);
      },
      //
      selectReset(i) {
        this.fullLoading = true;
        this.pageNum = 1;
        this.listData = [];
        this.selectedData[i].list.forEach((item) => {
          item.show = false;
        })
        this.synchronization();
        this.selectedData[i].popover = false;
        console.log(this.selectedData[i]);
      },
      //
      startPlugin() {
        // 组件内使用
        const that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          startDate: '1970-01-01',
          endDate: that.$const.getNewDate(),
          value: that.initialDate.start, // 其他参数同 props
          onConfirm(val) {
            that.initialDate.start = val;
            console.log(that.initialDate);
          },
          onHide() {
            const _this = this
          },
          onShow() {
            const _this = this
          }
        })
      },
      //
      endPlugin() {
        const that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          startDate: that.initialDate.start,
          endDate: that.$const.getNewDate(),
          value: that.initialDate.end, // 其他参数同 props
          onConfirm(val) {
            that.initialDate.end = val;
            // console.log(that.initialDate);
            // console.log('plugin confirm', val)
          },
          onHide() {

          },
          onShow() {
          }
        })
      },
      //
      goSearchroute() {
        this.$router.push({
          path: "/ipo/search",
          query: {inputVal: this.keyWordArray.join(" ")}
        })
      },
      //
      loadMore() {
        console.log(123);
        if (!!!this.filterConditionsLoading) {
          return false
        }
        //
        if (this.hasNext) {
          this.loading = true
          this.searchInput()
        }
      },
      //
      searchClose(index) {
        if (this.keyWordArray.length > 1) {
          if (isNaN(index) || index >= this.keyWordArray.length) {
            return false;
          }
          this.keyWordArray.splice(index, 1)
          this.reLoadingData()
          // this.keyWordArray.length -= 1;
          // var neway = this.keyWordArray.join(",");
          console.log("3323232", this.keyWordArray)
        } else {
          this.$router.push({path: '/ipo/search'});
        }
      },
      // 清除数据，重新加载
      reLoadingData() {
        this.listData = []
        this.hasNext = true
        this.pageNum = 1
        this.num = 0
        this.loading = true
        this.searchInput()
      },
      //
      searchInput() {
        let paramsData = Object.assign({}, this.paramsData, {pageNum: this.pageNum, pageSize: this.pageSize});
        //
        if (paramsData.releaseStartTime) {
          console.log(this.$const.transFormat(paramsData.releaseStartTime));
          paramsData.releaseStartTime = this.$const.getTimestamp(paramsData.releaseStartTime);
        }
        if (paramsData.releaseEndTime) {
          paramsData.releaseEndTime = this.$const.getTimestamp(paramsData.releaseEndTime);
        }
        let params = paramsData
        this.$axios.publish.listPublish(params).then(res => {
          setTimeout(() => {
            this.fullLoading = false;
          }, 300)
          if (res.data.returnCode == 200 && res.data.returnObject.list) {
            let data = res.data.returnObject.list;
            this.num = res.data.returnObject.count
            //
            let set = data.map((item, index) => {
              let title = '', count = '';
              if (item.title) {
                title = item.title.replace(/\s/gmi, "")
              }
              if (item.content) {
                count = item.content.replace(/\s/gmi, "")
              }
              return {
                id: item.id,
                title: title,
                content: count,
                industryLevelOne: item.industryLevelOne,
                typeName: item.typeName,
                releaseDate: item.releaseDate
              }
            });
            //
            for (let i = 0; i < set.length; i++) {
              if (this.keyWordArray.length > 0) {
                for (let j = 0; j < this.keyWordArray.length; j++) {
                  let val = this.keyWordArray
                  let reg = new RegExp('(' + val[j] + ')', 'gm');
                  set[i].content = set[i].content.replace(reg, "<span class='highlight'>$1</span>");
                  set[i].title = set[i].title.replace(reg, "<span class='highlight'>$1</span>");
                }
              }
            }
            this.listData = this.listData.concat(set);
            //
            this.contentShow = false
            this.infLoading = true
            setTimeout(() => {
              this.loading = false
            }, 300)
            let allCount = res.data.returnObject.count
            let page = Math.ceil(allCount / 10);
            if (this.pageNum >= page) {
              this.hasNext = false
            } else {
              this.pageNum = this.pageNum + 1
            }
          } else {
            this.contentShow = true
            this.infLoading = false
            this.hasNext = false
          }

        }).catch((err) => {
          this.hasNext = false;
          this.fullLoading = false;
        })
      },
      // 获取分类
      filterConditions() {
        this.$axios.publish.filterConditions().then(res => {
          let classify = res.data.returnObject;
          this.industrytype = classify.industryConditions;
          this.filetype = classify.ipoTypeConfitions;
          this.selectedData.forEach((item) => {
            if (item.type == 'market') {
              item.list = classify.marketTypeConditions.map(e => {
                return Object.assign({}, e, {show: false})
              })
              item.initialList = classify.marketTypeConditions.map(e => {
                return Object.assign({}, e, {show: false})
              })
            }
            if (item.type == 'confitions') {
              item.list = classify.ipoTypeConfitions.map(e => {
                return Object.assign({}, e, {show: false})
              })
              item.initialList = classify.ipoTypeConfitions.map(e => {
                return Object.assign({}, e, {show: false})
              })
            }
            if (item.type == 'industry') {
              item.list = classify.industryConditions.map(e => {
                return Object.assign({}, e, {show: false})
              })
              item.initialList = classify.industryConditions.map(e => {
                return Object.assign({}, e, {show: false})
              })
            }
          })
          //
          setTimeout(() => {
            this.filterConditionsLoading = true;
            this.searchInput()
          })
        })
      },
      //
      newBtnArr(str) {
        if (str.length >= 10) {
          return str.substring(0, 10) + '...';
        } else {
          return str
        }
      },
      //
      nameClass(str, number, type) {
        if (type == 'time') {
          return str.replace(',', ' 至 ')
        }
        number = number ? number : 4;
        if (str.length > number) {
          return str.substring(0, number) + '...';
        } else {
          return str
        }
      }
    }
  }
</script>

<style lang="scss">
  .vxa-popup-transfer-dom {
    .position-vertical-text {
    }
    .vux-popup-dialog {
      background-color: #fff;
      overflow: hidden;
      .popup-box {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        .box-header {
          height: 45px;
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #fff;
          z-index: 1000;
          .title {
            flex: 1;
            text-align: center;
            font-size: 15px;
            font-weight: bold;
          }
          button {
            border: 0;
            padding: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            vertical-align: center;
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
          }
        }
        .box-content {
          padding-top: 45px;
          height: 100%;
          width: 100%;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          .box-group {
            margin-bottom: 50px;
            .weui-cell {
              &.is-active {
                color: #ffb148;
                background-color: rgba(255, 177, 72, 0.1);
                &.weui-cell_access .weui-cell__ft:after {
                  color: #ffb148;
                  border-color: #ffb148;
                }
              }

            }
            .cell-content {
              ul {
                li {
                  padding: 0 0 0 15px;
                  &:not(.not-active):active {
                    background-color: #f0f1f5;
                  }
                  &.not-active {
                    width: 100%;
                    height: auto;
                    position: relative;
                    .box-shadow {
                      width: 100%;
                      height: 100%;
                      position: absolute;
                      top: 0;
                      left: 0;
                      background-color: transparent;
                      z-index: 1000;
                      display: flex;
                      align-items: center;
                      span {
                        flex: 1;
                        &.row {
                          height: 100%;
                        }
                        &.clear {
                          flex: inherit;
                          width: 60px;
                          height: 40px;
                          line-height: 40px;
                          text-align: right;
                          padding-right: 15px;
                          i {
                            color: #aeaeae;
                          }
                        }
                      }
                    }
                  }
                  .li-box {
                    width: 100%;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    .li-box-input {
                      padding: 0;
                    }
                  }
                  .item-title {
                    padding-left: 10px;
                  }
                }
              }
            }
          }
          //
          .slide {
            padding: 0 0;
            overflow: hidden;
            max-height: 0;
            transition: max-height .5s cubic-bezier(0, 1, 0, 1) -.1s;
          }
          .animate {
            max-height: 9999px;
            transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
            transition-delay: 0s;
          }
        }
        .box-footer {
          background-color: #fff;
          width: 100%;
          height: 50px;
          position: absolute;
          left: 0;
          bottom: 0;
          font-size: 0;
          button {
            width: 50%;
            height: 100%;
            border: 0;
            line-height: 50px;
            text-align: center;
            font-size: 18px;
            float: left;
            font-weight: bold;
            color: #ffb048;
            background-color: white;
            outline: none;
            &:last-child {
              background-color: #ffb148;
              color: #fff;
              &:active {
                opacity: 0.5;
                background-color: #ffb148;
              }
            }
            &:active {
              background-color: #f0f1f5;
            }
          }
          button + button:active {
            background-color: #f0f1f5;
          }
        }
      }
    }
  }
  .publishList {
    padding-bottom: 50px;
    .publishList-box {
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
  #publishList {
    .searchs {
      width: 100%;
      height: 50px;
      background: #f0f1f5;
      padding: 7.5px 12px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .seabox {
        width: 100%;
        height: 35px;
        position: relative;
        background: white;
        overflow: hidden;
        border-radius: 2px;
        .iconTripsousuo {
          float: left;
          height: 35px;
          line-height: 35px;
          font-size: 18px;
          margin-left: 10px;
          i {
            color: #aeaeae;
          }
        }
        .searchScroll {
          width: 75%;
          height: 100%;
          line-height: 170%;
          float: left;
          background: #fff;
          color: #aeaeae;
          display: inline-block;
          box-sizing: border-box;
          -webkit-appearance: none;
          border-radius: 2px;
          border: 0;
          font-size: 15px;
          padding: 5px 8px;
          outline: none;
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          .searchScrollSpan {
            background-color: #fff2e1;
            border-radius: 2px;
            color: #8d8d8d;
            font-weight: lighter !important;
            display: inline-block !important;
            margin: 0 0 0 8px;
            height: 25px;
            font-size: 15px;
            line-height: 25px;
            padding-left: 5px;
            padding-right: 5px;
            z-index: 170;
            .searchClose {
              display: inline-block;
              height: 25px;
              position: relative;
              top: 0;
              width: 16px;
              z-index: 200;
              img {
                position: relative;
                width: 100%;
                height: 64%;
                top: 8%;
              }
            }
          }

        }
        /*input[type=search]::-webkit-search-cancel-button {*/
        /*-webkit-appearance: none; !*//*此处就是去掉默认的小×*!*/
        /*}*/
        /*input::-webkit-input-placeholder {*/
        /*font-weight: lighter !important;*/
        /*}*/
        .goSearch {
          float: right;
          width: 16%;
          text-align: center;
          line-height: 35px;
          color: #8d8d8d;
        }
      }
    }
    .select-search-box {
      width: 100%;
      height: auto;
      padding: 0 12px;
      position: relative;
      background-color: white;
      .select-flex {
        height: 40px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .row {
          flex: 1;
          text-align: center;
          line-height: 1;
          font-size: 15px;
          color: #535353;
          border: 0.5px solid transparent;
          border-left-color: #e3e3e3;
          &.right {
            flex: inherit;
            text-align: right;
            border-right-color: #e3e3e3;
            .select-btn {
              height: 100%;
              border: 0;
              border: none;
              padding: 0 10px;
            }
            .vxa-badge {
              position: absolute;
              right: 15px;
              top: 1px;
            }
          }
          .iconBottom {
            font-weight: bold;
            font-size: 10px;
            margin-left: 6px;
            display: inline-block;
            line-height: 1;
            transition: transform .3s;
            transform: rotate(0deg);
            -ms-transform: rotate(0deg); /* IE 9 */
            -moz-transform: rotate(0deg); /* Firefox */
            -webkit-transform: rotate(0deg); /* Safari 和 Chrome */
            -o-transform: rotate(0deg); /* Opera */
          }
          &.pass {
            height: 36px !important;
            background: #fff !important;
            margin-top: 5px !important;
            line-height: 30px !important;
            border: 0.5px solid #e3e3e3 !important;
            border-bottom: 0 !important;
            box-sizing: border-box !important;
            text-align: center !important;
            font-size: 15px;
            color: #ffb048 !important;
            z-index: 100;
            .iconBottom {
              color: #ffb148;
              transition: all .3s;
              transform: rotate(180deg);
              -ms-transform: rotate(180deg); /* IE 9 */
              -moz-transform: rotate(180deg); /* Firefox */
              -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
              -o-transform: rotate(180deg); /* Opera */
            }
            & + .row {
              border-left-color: transparent;
            }
          }
        }
      }
    }
    /**/
    .select-box-content {
      position: absolute;
      left: 0;
      top: 90px;
      background: #fff;
      width: 100%;
      height: 86%;
      z-index: 3400;
      .item-box {
        padding-bottom: 50px;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        &.no-item {
          .item:last-child {
            width: 100%;
            .item-line {
              display: none;
            }
          }
        }
        .item {
          width: 50%;
          height: 40px;
          line-height: 40px;
          padding-left: 12.5px;
          box-sizing: border-box;
          position: relative;
          font-size: 14px;
          color: #535353;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          float: left;
          transition: .1s all;
          &.no-active {
          }
          &:not(.no-active):active {
            transition: .1s all;
            background-color: #f0f1f5;
            border-radius: 4px;
          }
          &.is-right {
            .item-line {
              display: none;
            }
          }
          .item-title {
            padding-left: 10px;
          }
          .item-line {
            width: 1px;
            height: 17.5px;
            background: #e3e3e3;
            position: absolute;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto 0;
          }
        }
      }
      .select-box-bottom {
        width: 100%;
        height: 50px;
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: 0;
        button {
          width: 50%;
          height: 100%;
          border: 0;
          line-height: 50px;
          text-align: center;
          font-size: 18px;
          float: left;
          font-weight: bold;
          color: #ffb048;
          background-color: white;
          outline: none;
          &:last-child {
            background-color: #ffb148;
            color: #fff;
            &:active {
              opacity: 0.5;
              background-color: #ffb148;
            }
          }
          &:active {
            background-color: #f0f1f5;
          }
        }
        button + button:active {
          background-color: #f0f1f5;
        }
      }
    }
    .show-prompt {
      height: 45px;
      width: 100%;
      color: #ffffff;
      background-color: rgba(255, 153, 51, 0.85);
      position: absolute;
      bottom: 49.5px;
      text-align: center;
      line-height: 45px;
      font-size: 14px;
    }
    .wrapper-scroller {
      position: relative;
      overflow-y: auto;
      background: #ffffff;
      -webkit-overflow-scrolling: touch;
      .infinite-loading {
        text-align: center;
        height: 45px;
        line-height: 45px;
        margin-bottom: 50px;
      }

    }
    .pubList {
      background: #ffffff;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .infinite-loading {
        text-align: center;
        height: 50px;
        line-height: 50px;
      }
    }
  }
</style>
