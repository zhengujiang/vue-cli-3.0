<template>
  <div id="publish-ipo-details" class="publish-ipo-details">
    <div class="publish-ipo-details-box" :style="{height:contHeight+'px'}">
      <template v-if="contentSort=='pdf'">
        <vxa-pdf :src="ifromeUrl"></vxa-pdf>
      </template>
      <template v-else>
        <div class="publish-ipo-content-box" :style="{paddingTop: contentsTop+'px'}">
          <!---->
          <div class="details-box-header" ref="boxHeaderDom">
            <div class="searchs">
              <!--------ios--------------->
              <div class="seabox" v-show="IOSAn">
                <form action="" onsubmit=" return false;">
                  <input id="inputCount" type="text" class="text" :placeholder="placeholder" @focus="searchFocus"
                         @blur="searchBlur" v-model="values" @input="searchInput" @keyup.13="searchBlur">
                </form>
                <div class="nodeGroup">
                  <div class="nodesLen" v-show="nodesLenShow">{{index+1}}/{{nodessLen}}</div>
                  <div class="nodeslenText" v-show="nodeslenTextShow">无结果</div>
                  <img v-lazy="close" alt="" @click="closeCount()" class="closeCount" v-show="closeCountShow">
                </div>
              </div>
              <!---------安卓-------------->
              <div class="seabox-and" v-show="!IOSAn">
                <form action="" onsubmit=" return false;">
                  <input id="inputCount-an" type="text" class="text" :placeholder="placeholder" @focus="searchFocus"
                         @blur="searchBlur" v-model="values" @input="searchInput" @keyup.13="searchBlur">
                </form>
                <div class="nodeGroup">
                  <div class="nodesLen" v-show="nodesLenShow">{{index+1}}/{{nodessLen}}</div>
                  <div class="nodeslenText" v-show="nodeslenTextShow">无结果</div>
                  <img v-lazy="close" alt="" @click="closeCount()" class="closeCount" v-show="closeCountShow">
                </div>
              </div>
              <!---->
              <div class="icon" v-show="iconShow">
                <span class="rulesBtn">
                    <img :src="topImg" alt="" @click="topRules()" class="buttop"/>
                    <img :src="bottoms" alt="" @click="bottomRules()" class="butright"/>
                </span>
              </div>
              //
              <div class="icons" @click="searchList()" v-if="!IOSAn" v-show="AndroidShow"></div>
            </div>
            <div class="publishTitle vux-1px-b" ref="titleDom">{{publishTitle}}</div>
          </div>
          <!---->
          <div id="detail-contents" ref="contTextDom" v-html="contentHtmlDetails"></div>
        </div>
      </template>
    </div>
    <!---->
    <span class="tt-clue" :class="{clueActive: IsActive}">好内容点此收藏哟</span>
    <!--顶部-->
    <return-top v-show="returnTop" @click="return_Top()"></return-top>
    <!--基本信息 -- 收藏-->
    <footer class="show_footer" ref="footerDom">
      <div class="footer-home" @click="returnHome">
        <div class="tabbar-Icon">
          <img :src="footerHome.icon" alt="">
        </div>
        <p class="tabbar-value">{{footerHome.name}}</p>
      </div>
      <div class="show_items" :key="index" v-for="(list, index) in footerItem" v-if="list.show"
           @click="footerClick(index)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt="">
        </div>
        <p class="tabbar-value">{{list.name}}</p>
      </div>
    </footer>
    <!---->
    <div class="popup-publish-detaile" v-transfer-dom>
      <popup class="popup-bottom" v-model="rulePlate" position="bottom">
        <h3 class="popup-bottom-title">基本信息</h3>
        <div class="popup-bottom-content">
          <!---->
          <div class="rulesPlateHeader">
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">所属行业：</div>
                <div class="unitsCont">{{information.industry}}</div>
              </div>
            </div>
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">公司全称：</div>
                <div class="unitsCont">{{information.fullName?information.fullName:''}}</div>
              </div>
            </div>
            <div class="smCaption">
              <div class="units nounits">
                <div class="unitsTitle">发布日期：</div>
                <div class="unitsCont">{{$const.formatText(information.releaseDate)}}</div>
              </div>
            </div>
          </div>
        </div>
        <footer class="popup-bottom-footer" @click="rulePlate = false">
          <button class="share_btn">取消</button>
        </footer>
      </popup>
    </div>
    <!---->
    <div class="popup-publish-detaile" v-transfer-dom>
      <popup class="popup-bottom" v-model="ruleCollect" position="bottom">
        <h3 class="popup-bottom-title">收藏</h3>
        <div class="popup-bottom-content">
          <!---->
          <div class="collect_global">
            <div class="collect_shg">
              <div class="inputgle">
                <input v-model="inputVal" type='text' @input="createInput(40)" :placeholder='placeholders'
                       class="createVal"/>
                <i class="icon iconfont icon-X closeInputVal" v-show="inputVal !=''"
                   @click="closeVal()"></i>
              </div>
              <div class="inputbtn">
                <button class="createDom" @click="addFavourite()">创建</button>
              </div>
            </div>
            <div class="collect-sns am-collect-padding">
              <div class="collectMaxHeight">
                <ul class="default">
                  <li class="collect-list" @click="addCollect('default')">
                    <div class="collect-item vux-1px-b">
                      <span class="defaultText">默认收藏夹</span>
                    </div>
                  </li>
                  <li :key="index" class="collect-list create" v-for="(list,index) in collcell"
                      @click="addCollect(index)">
                    <div class="collect-item vux-1px-b">
                      <span class="defaultText">{{list.favouriteName}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <footer class="popup-bottom-footer" @click="ruleCollect=false">
          <button class="share_btn">取消</button>
        </footer>
      </popup>
    </div>
    <!---->
    <div class="popup-publish-detaile" v-transfer-dom>
      <popup class="popup-bottom" v-model="correlationShow" position="bottom">
        <h3 class="popup-bottom-title">IPO进程</h3>
        <div class="popup-bottom-content correlation">
          <div class="back-item-node">
            <ul>
              <template v-for="(item, i) in companyData">
                <li :key="j" class="back-node-box" v-for="(list, j) in item.children" @click="relevantLink(i, j)">
                  <div class="line"></div>
                  <div class="eventContent">
                    <div class="time">
                      <span class="row type">{{typeCourse[list.type].name}}&ensp;</span>
                      <span class="row">{{$const.format(list.releaseDate)}}</span>
                      <button class="row status" v-if="list.approveType" :class="approveType(list.approveType).class">
                        {{approveType(list.approveType).name}}
                      </button>
                    </div>
                    <p>{{list.title}}</p>
                  </div>
                </li>
              </template>
            </ul>
          </div>
        </div>
        <footer class="popup-bottom-footer" @click="correlationShow = false">
          <button class="share_btn">取消</button>
        </footer>
      </popup>
    </div>
    <!---->
    <xiaoan-loading v-show="loading"></xiaoan-loading>
    <xiaoan-error v-show="loadFalse"></xiaoan-error>
  </div>
</template>
<script>
  import returnHome from '../../components/warning/returnHome'
  import {Popup, TransferDom} from 'vux'

  export default {
    name: "publish-ipo-details",
    directives: {
      TransferDom
    },
    components: {
      Popup,
      'xiaoan-returnHome': returnHome
    },
    data() {
      return {
        information: {
          industry: '',
          fullName: '',
          releaseDate: '',
          title: ''
        },
        typeCourse: [
          {name: '', type: ''},
          {name: '预披露', type: ''},
          {name: '预披露更新', type: ''},
          {name: '反馈意见', type: ''},
          {name: '发审会', type: ''},
          {name: '核发', type: ''}
        ],
        contentDetailHeight: 0,
        adjunctList: [],
        correlationShow: false,
        correlation: [],
        ifromeUrl: '',
        rulePlate: false,
        ruleCollect: false,
        adjunctShow: false,
        returnTop: false,
        footerHome: {id: 0, name: '主页', value: '', icon: this.$image.base.home, isshow: false},
        footerItem: [
          {name: '基本信息', value: '0', show: true, icon: this.$image.rules.Attribute},
          {name: '收藏', value: '1', show: true, icon: this.$image.rules.celloctIcon},
          {name: 'IPO进程', value: '2', show: true, icon: this.$image.rules.linkIcon}
        ],
        boxShdow: false,
        IsActive: true,
        loadFalse: false,
        pdfIframe: "/static/pdf/web/viewer.html?file=",
        pdfUrl: "",
        contHeight: '',
        show: true,
        src: '',
        allLoaded: false,
        size: "",
        loading: true,//是否加载中状态
        confirmShow: false,
        IOSAn: true,
        values: '',
        refId: "",//索引id
        refType: "",
        user_id: "",//cookie userId
        //收藏相关
        getDefS: '',
        collcell: [],
        bottom: 15,
        pageTop: 1,
        //高亮
        close: this.$image.personal.close.png,
        inputVal: "",
        topImg: this.$image.rules.top,
        bottoms: this.$image.rules.bottom,
        placeholders: '请输入新建收藏夹名称(最多40个字)',
        placeholder: "搜索关键字，全文精确搜索",
        index: 0,
        nodessLen: 0,
        range: {},
        nodesLenShow: false,
        nodeslenTextShow: false,
        closeCountShow: false,
        iconShow: false,
        AndroidShow: true,
        //公告详情
        scopesName: [],//板块类别
        tradeSort: "",//所属行业
        releaseEnd: "",//发布时间
        unitss: "",//公告公司简称/代码
        html: "",//公告链接
        titleShow: "",//公告大小是否提示
        referenceNumber: '',
        detailContents: "",
        //
        publishTitle: "",
        contentSort: 'html',
        contentHtmlDetails: '',
        contentsTop: 50,
        companyData: []
      }
    },
    watch: {
      selected(n, o) {
        console.log(n);
      },
      $route: function () {
        window.location.reload();
      }
    },
    created() {
      this.refId = this.$route.query.id;
      this.user_id = this.$cookie.getCookie("userId");
      if (this.$cookie.isLogin()) {
        this.getDetails();
        this.$MTAmethod.mtaClick('8hs98u7gje', {'cfrc59uy7r': 'true'})
        this.getFavourite();
        this.getDefault();
      } else {
        this.$storage.loginStatus(this, 'IPO', window.location.href);
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.IOSAn = this.$const.userAgent().ios;
        this.contHeight = document.body.clientHeight - document.querySelector('.show_footer').clientHeight - 1;
        this.contentDetailHeight = this.contHeight - this.$refs.titleDom.clientHeight - document.querySelector('.searchs').clientHeight;
        //
        this.$refs.contTextDom.addEventListener('scroll', (e) => {
          let isScrollTop = this.$refs.contTextDom.scrollTop;
          if (isScrollTop > 300) {
            this.returnTop = true;
          } else if (isScrollTop <= 300) {
            this.returnTop = false;
          }
        })

      });
      if (this.user_id) {
        // 有this.user_id
      } else {
        setTimeout(() => {
          this.IsActive = false;
          setTimeout(() => {
            this.IsActive = true;
          }, 5000)
        }, 1000)
      }
    },
    methods: {
      //
      approveType(type) {
        if (type.indexOf('获通过') > -1 || type == '通过') {
          return {name: '通过', class: 'accept'}
        } else if (type.indexOf('未通过') > -1) {
          return {name: '未通过', class: 'no-accept'}
        } else if (type.indexOf('暂缓') > -1) {
          return {name: '暂缓表决', class: 'defer'}
        } else {
          return {name: '取消审核', class: 'close'}
        }
      },
      //
      return_Top() {
        $("#detail-contents").animate({scrollTop: 0});
      },
      //
      searchInput() {
        if (this.values.trim().length !== 0) {
          // $('.closeCount').show();
          this.closeCountShow = true
        } else {
          // $('.closeCount').hide();
          this.closeCountShow = false
        }
      },
      // 页面搜索获取焦点后  安卓输入法弹起底部选项按钮隐藏
      searchFocus() {
        // let user = "";
        this.nodesLenShow = false;
        this.nodeslenTextShow = false;
        this.iconShow = false
        /**/
        $('.seabox-and').css("width", '90%');
        this.AndroidShow = true;
        $('.seabox').width("100%");
      },
      //
      searchList() {
        this.searchBlur();
      },
      //
      searchBlur() {
        document.activeElement.blur();
        $('#inputCount').blur();
        // this.textHeight();
        if (this.values.trim().length != 0) {
          $('#detail-contents').each(function () {
            //找到所有highlight属性的元素；
            $(this).find('.highlight').each(function () {
              $(this).replaceWith($(this).html()); // 将他们的属性去掉；
            });
          });
          let con = document.getElementById("detail-contents");
          let val = this.values;
          val = val.replace(/\./g, "\\.");
          console.log(val);
          let reg = new RegExp('(' + val + ')', 'gm');
          let text = con.innerHTML.replace(reg, "<span class='highlight'>$1</span>");
          con.innerHTML = text;

          //读取页面所有满足要求的节点
          this.nodess = document.querySelectorAll("span[class='highlight']");
          //默认选择第一个
          console.log("=======", this.nodess.length);
          this.nodessLen = this.nodess.length;
          if (this.nodessLen >= 2) {
            // $('.nodesLen').show();//关键词条数
            this.nodesLenShow = true;
            $('.seabox').width("85%");
            // $(".icon").css("display", "inline-block");
            // $('.nodeslenText').hide();
            this.iconShow = true
            this.nodeslenTextShow = false;
            $('.seabox-and').css("width", '85%');
            this.AndroidShow = false;
          } else if (this.nodessLen == 1) {
            // $('.nodesLen').show();//关键词条数
            this.nodesLenShow = true;
            // $(".icon").hide();
            this.iconShow = false
          } else if (this.nodessLen == 0) {
            $('.seabox-and').css("width", '90%');
            this.AndroidShow = true;
            this.index = 0;
            // $(".icon").hide();
            this.iconShow = false
            // $('.nodesLen').hide();//关键词条数
            this.nodesLenShow = false;
            // $('.nodeslenText').show();
            this.nodeslenTextShow = true;
          }
          this.SelectText(this.nodess[0]);
          this.index = 0;
        } else {
          $('#detail-contents').each(function () {
            //找到所有highlight属性的元素；
            $(this).find('.highlight').each(function () {
              $(this).replaceWith($(this).html());//将他们的属性去掉；
            });
          });
        }
      },
      //
      SelectText(element) {
        //移除所有灰色背景
        $("span.highlight.graybg").removeClass("graybg");
        // let text = document.getElementById(element);
        let selection = window.getSelection();
        this.range = document.createRange();
        selection.removeAllRanges();
        selection.addRange(this.range);
        //检测是否要滚动展示
        this.scrollToElement("#detail-contents", element);
        $(element).addClass("graybg");
      },
      //
      scrollToElement(container, child) {
        container = $(container);
        let search = $(".searchs").outerHeight();
        let detailContentsHeight = $(".publishTitle").outerHeight();
        let tobeHeight = search + detailContentsHeight;
        child = $(child);
        if (child.length == 0) {
          console.log(0);
        } else {
          let conScrollTop = container.scrollTop();
          let childOffsetTop = child.position().top;
          container.animate({
            scrollTop: childOffsetTop + conScrollTop - tobeHeight - 5
          })
        }
      },
      //
      topRules() {
        console.log('上：' + this.index);
        if (this.index <= 0) {
          this.index = 0;
          this.$toast({message: '没有上一个了', position: 'middle', duration: 1500});
          return
        }
        this.SelectText(this.nodess[this.index - 1]);
        this.index--
      },
      ////下选择
      bottomRules() {
        console.log('下：' + this.index);
        if (this.index >= this.nodess.length - 1) {
          this.index = this.nodess.length - 1;
          this.searchBlur();
          console.log("加加加")
          return
        }
        this.SelectText(this.nodess[this.index + 1]);
        console.log("下标", this.index);
        this.index++
      },
      //
      closeCount() {
        this.values = '';
        // $('.icon').hide();
        this.iconShow = false
        // $('.nodeslenText').hide();
        // $('.nodesLen').hide();
        this.nodeslenTextShow = false;
        this.nodesLenShow = false;
        this.searchBlur();
        this.AndroidShow = true;
        console.log('input的值：' + this.values);
        $('.seabox-and').css("width", '90%');
        // $('#inputCount').focus();
        // $('#inputCount-an').focus();
        this.searchFocus()
        // $('.closeCount').hide();
        this.closeCountShow = false
        $('.seabox').width("100%");
      },
      //
      relevantLink(i, j) {
        this.$router.push({path: '/ipo/details', query: {id: this.companyData[i].children[j].id}});
        this.$MTAmethod.mtaClick('8hs98u7gje', {'77zhq8jgww': 'true'});
        window.location.reload();
      },
      //
      classify(array) {
        console.log('=======>', array);
        let dateArray = [];
        let tempType = "";
        const arrays = array;
        arrays.forEach((item, index) => {
          if (item.type == tempType) {
            dateArray[dateArray.length - 1].children.push(item);
          } else {
            dateArray.push({type: item.type, children: [item]});
            tempType = item.type;
          }
          console.log(dateArray);
        })
        return dateArray
      },
      //
      getDetails() {
        function checkHtml(htmlStr) {
          let reg = /<[^>]+>/g;
          return reg.test(htmlStr);
        }
        //
        let params = {
          publishId:this.refId
        }
        this.$axios.publish.getDetails(params).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            //
            this.publishTitle = data.title;
            var companyData = data.relatedContentList ? data.relatedContentList : null;
            if (companyData) {
              this.companyData = this.classify(companyData);
            } else {
              this.companyData = companyData;
            }
            data.content = data.content ? data.content : '';
            console.log('======>', this.companyData);
            //
            var textCountArray, textCount;
            if (data.type == 4 || data.type == 3) {
              // txt
              this.contentSort = 'html'
              // data.content = data.content.replace(/(^\s+)|(\s+$)/g, '')
              textCountArray = data.content.split('\n');
              textCountArray = this.$array.ImpArr(textCountArray);
              textCount = '';
              //
              if (textCountArray[0] != data.title.trim()) {
                textCountArray.unshift(data.title.trim());
              }
              for (var i = 0, len = textCountArray.length; i < len; i++) {
                if (textCountArray[i] == data.title.trim()) {
                  textCount += '<h1>' + textCountArray[i].trim() + '</h1>'
                } else if (textCountArray[i].charAt(textCountArray[i].length - 1) == '：') {
                  textCount += '<pre>' + textCountArray[i].trim() + '</pre>'
                } else {
                  textCount += '<p>' + textCountArray[i].trim() + '</p>'
                }
              }
              textCount += '<h5>' + this.$const.formatText(data.releaseDate) + '</h5>'
              this.contentHtmlDetails = textCount;
            } else if (data.type == 5) {
              // html
              this.contentSort = 'html';
              if (checkHtml(data.content)) {
                textCountArray = data.content.split("\n");
                textCountArray = this.$array.ImpArr(textCountArray);
                textCount = '';
                for (let j = 0, lena = textCountArray.length; j < lena; j++) {
                  textCount += textCountArray[j].trim();
                }
                this.contentHtmlDetails = textCount;
                this.$nextTick(() => {
                  var contDom = document.querySelectorAll('#detail-contents p');
                  console.log(contDom);
                  for (var k = 0; k < contDom.length; k++) {
                    if (contDom[k].getAttribute('align')) {
                      if (contDom[k].getAttribute('align') == 'left') {
                        contDom[k].style.textAlign = 'left';
                      } else if (contDom[k].getAttribute('align') == 'right') {
                        contDom[k].style.textAlign = 'right';
                      } else {
                        contDom[k].style.textAlign = 'right';
                      }
                    }
                  }
                })
              } else {
                textCountArray = data.content.trim().split('。');
                textCountArray = this.$array.ImpArr(textCountArray);
                textCount = '';
                textCount += '<h1>' + data.title + '</h1>'
                textCountArray.forEach((item) => {
                  textCount += '<p>' + item + '。</p>'
                })
                textCount += '<h5>' + this.$const.formatText(data.releaseDate) + '</h5>'
                this.contentHtmlDetails = textCount;
              }
            } else if (data.type == 2 || data.type == 1) {
              // pdf
              this.contentSort = 'pdf';
              let html = res.data.returnObject.fileUrl; // PDF链接
              let protocol = document.location.protocol == 'https:' ? 'https:' : 'https:';
              let url = html.replace('http:', protocol).replace('https:', protocol);
              if (data.big) {
                let _this = this;
                this.$vux.confirm.show({
                  title: '',
                  content: '点击查看全文' + data.fileSize + '？',
                  // 组件除show外的属性
                  onConfirm() {
                    _this.ifromeUrl = _this.$api.CURRENTIP.IP + 'static/pdf/web/viewer.html?file=' + url;
                  },
                  onCancel() {
                    _this.$router.go(-1);
                  }
                });
              } else {
                this.ifromeUrl = this.$api.CURRENTIP.IP + 'static/pdf/web/viewer.html?file=' + url;
              }
            }
            //
            this.$nextTick(() => {
              if (this.contentSort !== 'pdf') {
                this.contentsTop = this.$refs.boxHeaderDom.clientHeight;
              }
            })
            //
            if (data.industryLevelOne) {
              this.information.industry = data.industryLevelOne;
            } else {
              this.information.industry = '无';
            }
            //
            this.information.fullName = data.companyName;
            this.information.title = data.title;
            document.title = data.companyName;
            this.information.releaseDate = data.releaseDate;
            //
            setTimeout(() => {
              this.loading = false;
            }, 300);
            //
            this.$nextTick(() => {
              let advertTitle = data.title;
              let shareDesc = ""; // 描述
              let shareLink = window.location.href; // 分享链接
              this.$weixin.wxshare(advertTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
            })
          } else {

          }
        }).catch((err) => {
          setTimeout(() => {
            this.loading = false;
          }, 300);
        })
      },
      //
      footerClick(index) {
        console.log(index);
        switch (index) {
          case 0:
            this.rulePlate = true;
            break;
          case 1:
            this.ruleCollect = true;
            this.collectMethod();
            break;
          case 2:
            this.correlationShow = true;
            break;
        }
      },
      // 创建input
      createInput(maxlength) {
        this.inputVal = this.$array.trim(this.inputVal);
        if (this.inputVal.length > maxlength) {
          this.inputVal = this.inputVal.substring(0, maxlength);
        }
      },
      //
      closeVal() {
        if (this.inputVal.length != 0) {
          this.inputVal = '';
          document.querySelector('.createVal').focus();
        }
      },
      // 详情跳转到法规的主页
      returnHome() {
        console.log(',', this.$route);
        this.$router.push({path: "/rule"});
      },
      //
      collectMethod() {
        console.log('userId=' + this.user_id);
        if (this.$cookie.isLogin()) {
        } else {
          console.log(window.location.href);
          // 主逻辑业务
          let title = 'IPO详情';
          this.$storage.loginStatus(this, title, window.location.href);
        }
      },
      // 创建收藏夹
      addFavourite() {
        if (this.inputVal.trim().length != 0) {
          let params = {
              favouriteName: this.inputVal,
              isDefault: 0
            }
          this.$axios.favourite.addFavourite(params).then(res => {
            if (res.data.returnCode == 1) {
              this.inputVal = '';
              document.querySelector('.closeInputVal').style.display = 'none';
              this.getFavourite();
              this.$vux.toast.show({text: '创建收藏夹成功', position: 'middle', type: 'text', width: 'auto', time: 1000});
            } else if (res.data.returnCode == 3) {
              this.$vux.toast.show({text: '收藏夹不能相同', position: 'middle', type: 'text', width: 'auto', time: 1000});
            } else if (res.data.returnCode == 2) {
              this.$vux.toast.show({text: '最多只能创建十个收藏夹', position: 'middle', type: 'text', width: 'auto', time: 1000});
            }
          }).catch((err) => {
            console.error(err);
          });
        }
      },
      // 根据用户id获取收藏夹
      getFavourite() {
        let params = {
            pageSize: this.bottom,
            pageIndex: this.pageTop
          }
        this.$axios.favourite.getFavourite(params).then(res => {
          console.log(res);
          console.log(res.data.returnObject);
          if (res.data.returnCode == 1 && res.data.returnObject) {
            this.collcell = res.data.returnObject.list;
            this.num = res.data.returnObject.list.length;
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      // 获取默认收藏夹
      getDefault() {
        let params = {}
        this.$axios.favourite.getDefault(params).then(res => {
          this.getDefS = res.data.returnObject;
          console.log('3221321', this.getDefS);
        }).catch((err) => {
          console.error(err);
        })
      },
      // 根据收藏夹添加
      addCollect(index) {
        let addcollect = {};
        if (index === 'default') {
          addcollect = {
            refId: this.refId, // 文章id
            favourableId: this.getDefS.id, // 文件夹id
            title: this.information.title, // 标题名
            publishTime: this.information.releaseDate, // 发布时间
            type: "publish" // 类型
          }
        } else {
          addcollect = {
            refId: this.refId, // 文章id
            favourableId: this.collcell[index].id, // 文件夹id
            title: this.information.title, // 标题名
            publishTime: this.information.releaseDate, // 发布时间
            type: "publish" // 类型
          }
        }
        this.$nextTick(() => {
          this.$axios.collect.addCollect(addcollect).then(res => {
            console.log(res);
            if (res.data.returnCode == 2) {
              this.$vux.toast.show({text: '你已添加进此收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else if (res.data.returnCode == 1) {
              this.ruleCollect = false;
              this.$vux.toast.show({text: '收藏成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else {
              this.$vux.toast.show({text: '收藏失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          }).catch((err) => {
            console.error(err);
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .open-catalog {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background: rgba(0, 0, 0, .44);
    color: #fff;
    text-align: center;
    position: absolute;
    bottom: 15%;
    right: 15px;
    z-index: 10;
    font-size: 0;
    overflow: hidden;
    .catalog {
      line-height: 1;
      padding-top: 9px;
      width: 100%;
      text-align: center;
      img {
        height: 15px;
      }
    }
    .top {
      line-height: 1;
      padding-top: 8px;
      width: 100%;
      text-align: center;
      img {
        height: 10px;
      }
    }
    .home {
      line-height: 1;
      padding-top: 7px;
      width: 100%;
      text-align: center;
      img {
        height: 19px;
      }
    }
    .expert_s {
      box-shadow: none;
      width: 100%;
      font-size: 11px;
      padding-top: 5px;
      line-height: 1;
      color: white;
      box-sizing: border-box;
      border: 0;
      background: rgba(0, 0, 0, 0) !important;
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    }
  }
  .returnHome {
    bottom: 65px;
    line-height: 33px;
  }
  .popup-publish-detaile {
    .popup-bottom {
      max-height: 400px;
      background: white;
      font-size: 14px;
      text-align: center;
      border-radius: 0;
      width: 100%;
      .popup-bottom-title {
        width: 100%;
        height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #e3e3e3;
        color: #323232;
        margin: 0;
        font-size: 17px;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        text-align: center;
        line-height: 50px;
      }
      .popup-bottom-content.correlation {
        min-height: 300px;
        height: 300px;
        .back-item-node {
          height: 100%;
          width: 100%;
          position: relative;
          overflow-y: scroll;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          ul {
            width: 100%;
            padding: 0 12px 0 12px;
            background-color: #FFFFFF;
            .back-node-box {
              background-color: transparent;
              color: #545454;
              padding-left: 32px;
              border-radius: 5px;
              position: relative;
              &:last-child {
                margin-bottom: 0;
              }
              &:before {
                content: '';
                height: 200%;
                width: 1px;
                position: absolute;
                display: inline-block;
                left: 12px;
                top: -50%;
                transform: scale(0.5);
                background-color: #aeaeae;
              }
              .date-month {
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                display: none;
              }
              .line {
                display: inline-block;
                position: absolute;
                top: 50%;
                left: 12px;
                transform: translate(-45%, -50%);
                border-radius: 50%;
                width: 12px;
                height: 12px;
                border: 0.5px solid #aeaeae;
                &:before {
                  content: "";
                  border-radius: 50%;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translateY(-50%) translateX(-50%);
                  width: 3px;
                  height: 3px;
                  border: 0.5px solid #aeaeae;
                  background-color: #aeaeae;
                }
              }
              .eventContent {
                padding: 5px 0 10px 0;
                position: relative;
                .time {
                  padding-bottom: 5px;
                  text-align: left;
                  display: flex;
                  align-items: center;
                  .row {
                    flex: inherit;
                  }
                  .type {
                    font-weight: bold;
                  }
                  .status {
                    border-radius: 2px;
                    height: 18px;
                    font-size: 12px;
                    background-color: #ffb148;
                    color: white;
                    padding: 0 3px;
                    border: 0;
                    transform: scale(0.8);
                    cursor: default;
                    &.accept {
                      background: #ffb148;
                    }
                    &.no-accept {
                      background: #29DA89;
                    }
                    &.defer {
                      background: #B45E0B;
                    }
                    &.close {
                      background: #FB4319;
                    }
                  }
                }
                p {
                  padding: 5px 3px;
                  font-size: 14px;
                  -webkit-box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
                  box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
                  background-color: #f0f1f5;
                  text-align: left;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                }
              }
            }
          }
        }

      }
      .popup-bottom-content {
        //
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
                border: 1px solid #f0ad4e;
                margin-right: 5px;
              }
            }
          }
          .smCaption {
            background-color: #FFFFFF;
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
              box-sizing: border-box;
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
        //
        .collect_global {
          .collect_shg {
            overflow: hidden;
            width: 100%;
            height: 50px;
            background-color: #f0f1f5;
            padding: 7.5px 12px;
            vertical-align: middle;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            .inputgle {
              height: 35px;
              width: 84%;
              background-color: #8d8d8d;
              border-radius: 2px;
              display: inline-block;
              float: left;
              border: 0;
              vertical-align: middle;
              position: relative;
              .createVal {
                border: 0;
                float: left;
                height: 35px;
                margin: 0;
                width: 100%;
                padding: 0 10% 0 12px;
                border-radius: 2px;
                outline: none;
                box-sizing: border-box;
                font-size: 15px;
              }
              .closeInputVal {
                line-height: 1;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 3%;
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
          .collect-sns {
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
            .collectMaxHeight {
              width: 100%;
              max-height: 250px;
              box-sizing: border-box;
              .default {
                width: 100%;
                box-sizing: border-box;
                .collect-list {
                  width: 100%;
                  height: auto;
                  box-sizing: border-box;
                  padding: 0 12px;
                  font-size: 15px;
                  position: relative;
                  overflow: hidden;
                  text-align: left;
                  .collect-item {
                    padding: 10px 0;
                    height: 100%;
                    box-sizing: border-box;
                    .defaultText {
                      text-align: left;
                      color: #323232;
                    }
                  }

                }
                .collect-list:last-child {
                  .collect-item {
                    border-bottom: 0;
                  }
                }
                .collect-list:active {
                  background-color: #f0f1f5;
                }
              }
            }
          }
        }
        .am-relative-sns {
          background-color: #fff;
          width: 100%;
          max-height: 300px;
          min-height: 300px;
          overflow-y: scroll;
          margin: 0;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          list-style: none;
          -webkit-overflow-scrolling: touch;
          font-size: 15px;
          color: #323232;
          li {
            padding: 0 12.5px;
            box-sizing: border-box;
            div {
              padding: 12.5px 0;
              text-align: justify;
            }
          }
          li:last-child {
            border-bottom: 0;
          }
          li:active {
            background-color: #f0f1f5;
          }
        }
      }
      .popup-bottom-footer {
        width: 100%;
        height: 50px;
        font-size: 17px;
        font-family: PingFangSC-Medium, sans-serif;
        .share_btn {
          display: block;
          font-family: PingFangSC-Medium, sans-serif;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          text-align: center;
          line-height: 50px;
          background: white;
          color: #ffb148;
          border-top: 1px solid #eaeaea;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: 17px;
        }
      }
    }
  }
  #publish-ipo-details {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .clueActive {
      opacity: 0 !important;
      bottom: 55px !important;
    }
    .tt-clue {
      width: 120px;
      height: auto;
      line-height: 20px;
      left: 75%;
      transform: translateX(-75%);
      font-size: 14px;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      text-align: center;
      border: 4px solid rgba(255, 177, 72, 0.9);
      text-indent: 0;
      border-radius: 2px;
      position: absolute;
      pointer-events: none;
      background-color: rgba(255, 177, 72, 0.9);
      color: white;
      bottom: 62px;
      opacity: 1;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      -webkit-transition: all 1s ease-in-out;
      -moz-transition: all 1s ease-in-out;
      -o-transition: all 1s ease-in-out;
      -ms-transition: all 1s ease-in-out;
      transition: all 1s ease-in-out;
      &:before, &:after {
        content: '';
        position: absolute;
        bottom: -11px;
        left: 75%;
        transform: translateX(-75%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid rgba(255, 177, 72, 0.9);
      }
    }
    .publish-ipo-details-box {
      width: 100%;
      height: 100%;
      background: #808080;
      overflow: hidden;
      position: relative;
      .publish-ipo-content-box {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        .details-box-header {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
        }
        .searchs {
          width: 100%;
          height: 50px;
          background: #f0f1f5;
          padding: 7.5px 12px;
          box-sizing: border-box;
          vertical-align: middle;
          font-size: 0;
          .seabox {
            width: 100%;
            height: 100%;
            position: relative;
            border-radius: 2px;
            background-color: white;
            display: inline-block;
            float: left;
            i {
              width: 20px;
              height: 20px;
              text-align: center;
              line-height: 20px;
              position: absolute;
              top: 0;
              right: 6px;
              bottom: 0;
              margin: auto;
              border-radius: 50%;
              color: #ffb148;
              font-style: normal;
            }
            form {
              height: 100%;
              box-sizing: border-box;
              input.text {
                outline: none;
                width: 86%;
                height: 100%;
                background: #fff;
                color: #8d8d8d;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -webkit-appearance: none;
                border-radius: 2px;
                border: 0;
                padding: 0 8px 0 27px;
                font-size: 15px;
                background: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/search@3x.png");
                background-size: 15px 15px;
                background-position: 5px center;
                background-repeat: no-repeat;
              }
            }
            .nodeGroup {
              position: absolute;
              top: 9.5px;
              right: 10px;
              font-size: 0;
              display: -webkit-box;
              .nodesLen {
                background-color: white;
                z-index: 50;
                font-size: 13px;
                /*display: none;*/
                color: #8d8d8d;
              }
              .nodeslenText {
                background-color: white;
                z-index: 50;
                font-size: 13px;
                /*display: none;*/
                color: #8d8d8d;
                position: relative;
                top: 1px;
              }
              .closeCount {
                height: 16px;
                /*display: none;*/
                margin: 0 -3px 0 5px;
              }
            }
          }
          .seabox-and {
            height: 100%;
            width: 90%;
            position: relative;
            border-radius: 2px;
            background-color: white;
            display: inline-block;
            float: left;
            form {
              height: 100%;
              box-sizing: border-box;
              input {
                outline: none;
                width: 86%;
                height: 100%;
                background: #fff;
                color: #8d8d8d;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                -webkit-appearance: none;
                border-radius: 2px;
                padding: 0 0 0 8px;
                border: 0;
                font-size: 15px;
                line-height: 1;
              }
            }
            .nodeGroup {
              position: absolute;
              top: 9.5px;
              right: 10px;
              font-size: 0;
              display: -webkit-box;
              .nodesLen {
                background-color: white;
                z-index: 50;
                font-size: 13px;
                /*display: none;*/
                color: #8d8d8d;
              }
              .nodeslenText {
                background-color: white;
                z-index: 50;
                font-size: 13px;
                /*display: none;*/
                color: #8d8d8d;
                position: relative;
                top: 1px;
              }
              .closeCount {
                height: 16px;
                /*display: none;*/
                margin: 0 -3px 0 5px;
              }
            }
          }
          .icon {
            width: 15%;
            height: 35px;
            /*display: none;*/
            display: inline-block;
            .rulesBtn {
              box-sizing: border-box;
              -webkit-box-sizing: border-box;
              img {
                width: 15px;
                float: left;
                padding: 14px 0;
              }
              .buttop {
                /*padding-left: 10px;*/
                /*padding-right: 3px;*/
                margin-left: 10px;
              }
              .butright {
                float: right;
              }
            }
          }
          .icons {
            width: 23px;
            height: 23px;
            display: inline-block;
            background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/search@3x.png");
            background-size: contain;
            background-position: center;
            background-repeat: no-repeat;
            position: relative;
            top: 6px;
            float: right;
          }
        }
        .publishTitle {
          padding: 15px 12px;
          font-family: PingFangSC-Medium, sans-serif;
          background-color: white;
          font-size: 20px;
          text-align: justify;
          color: #323232 !important;
          text-indent: 0;
        }
      }
      #detail-contents {
        padding-bottom: 50px;
      }
      @import "../../styles/details-theme";
    }

    .show_footer {
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      display: flex;
      z-index: 300;
      background: #f0f1f5;
      border-top: 1px solid #e3e3e3;
      box-shadow: 0 -8px 13px rgba(0, 0, 0, .02);
      -webkit-box-sizing: border-box;
      .footer-home:active {
        background-color: #e3e3e3;
        -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .footer-home {
        height: 100%;
        padding: 5px 15px;
        text-align: center;
        border-right: 1px solid #e3e3e3;
        text-decoration: none;
        box-sizing: border-box;
        .tabbar-Icon {
          margin: 0 auto;
          img {
            height: 19px;
          }
        }
        p {
          font-size: 12px;
          color: #767877;
        }
      }
      .show_items {
        flex: 1;
        height: 100%;
        text-align: center;
        text-decoration: none;
        padding: 5px 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        .tabbar-Icon {
          margin: 0 auto;
          img {
            height: 19px;
          }
        }
        .tabbar-value {
          color: #767877;
          font-size: 12px;
        }
      }

      .show_items.active {
        color: #f6900c;
      }
      .show_items span {
        display: block;
        width: 100%;
      }
      .show_shareIcon, .show_collectIcon, .show_relativeIcon {
        height: 50%;
      }
    }
  }
  .sharebg {
    background-color: rgba(0, 0, 0, 0.6);
    height: 100%;
    width: 100%;
    overflow: hidden;
    opacity: 1;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    top: 0;
    z-index: 1000;
  }
</style>
