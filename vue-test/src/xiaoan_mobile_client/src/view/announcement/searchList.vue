<template>
  <transition name="bounce">
    <div class="ruleslist xiaoan-box affiche-search-list" id="affiche">
      <div class="affiche-search-list-scroll" ref="afficheSearchListDom">
        <div class="searchs">
          <div class="SIMbox" @click="goSearchCode()">
            <input type="text" placeholder="证券简称/代码" :value="titleCompanyCode">
          </div>
          <div class="seabox">
            <div class="searchPrompt" @click="searchPro()"></div>
            <ul class="searchScroll">
              <li class="searchScrollSpan" v-for="(list,index) in Newarr" id="searchScrollSpan">
                {{newBtnArr(list)}}
                <span class="searchClose" @click="searchClose(index)">
                <img :src="$image.base.searchDelete">
              </span>
              </li>
            </ul>
            <div class="goSearch" @click="goSearch()">
              <div class="rulesNum" v-show="num">{{num+numtext}}</div>
            </div>
          </div>
          <button @click="popupShow()" class="expert_s" id="experts">{{experts}}</button>
          <i class="smx_item"></i>
        </div>
        <!--筛选栏-->
        <div class="searchBox">
          <div class="search-s" style="position: relative">
            <div class="search-mrpx search1 afficheSearch1" :class="{pass:xianshi}" @click="show">
              <span>板块类别</span>
              <p class="imgBox"></p>
            </div>
            <div class="search-mrpx search3 afficheSearch3" :class="{pass:xianshi2}" @click="show2">
              <span>行业类别</span>
              <p class="imgBox"></p>
            </div>
          </div>
          <div class="search-sx search4 afficheSearch4" style="position: relative">
            <div class="redCircle"></div>      <!-- //筛选栏选中条件状态标识-->
            <mt-button @click="SXshow" class="expert_s">筛选</mt-button>
            <!--筛选-->
          </div>
        </div>
        <!---->
        <div class="listGroup" id="listGroup">
          <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
              :infinite-scroll-distance="20">
            <li class="anList" v-for="(list,index) in ruleslist" @click="goCount(index)">
              <div class="anListState vux-1px-b" style="width: 100%">
                <p class="content-text" v-html="key(list.title)"></p>
                <!--<p style="float: right">{{format(list.releaseDate)}}</p>-->
                <p class="releaseDate">
                  <span>{{format(list.releaseDate)}}&nbsp;&nbsp;信披评级：</span>
                  <span v-if="list.threeYearLevel.length > 0">
                    <span class="m-r" v-for="(val, index) in list.threeYearLevel" :key="index">
                      {{val.key}}:
                      <span :class="{firstItem: index==0}" v-if="val.value">{{val.value}}</span>
                    </span>
                  </span>
                  <span v-else>该上市公司尚无信披评级</span>
                </p>
              </div>
            </li>
            <li class="anList seniorText">
              <span class="trytext" @click="showSenior" style=" text-decoration: none;border-bottom: 0.5px solid;">搜索不到想要的内容，试试看全文检索吧!</span>
              <span class="tryimg"></span>
            </li>
          </ul>
          <!--9yue 25日 cai 改-->
          <p v-show="infLoading" class="infinite-loading">
            <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
          </p>
          <!---->
          <div class="trySenior">
            <img :src="$image.rules.trySenior" alt="全文检索">
            <div class="tryText" @click="showSenior">
              <span class="trytext text">搜索不到想要的内容，试试看全文检索吧！</span>
              <span class="tryimg"></span>
            </div>
          </div>
          <!---->
          <div class="noInfo" v-show="noInfoShow">
            <div class="trySenior" :class="{show:noInfoShow}" style="width:100%">
              <img :src="$image.rules.trySenior" alt="全文检索">
              <div class="tryText" style="display: flex;justify-content: center;width:100%;">
                <span class="trytext" style="margin-left:0;">搜索不到相关内容，试试别的</span>
              </div>
              <div class="tryText" style="margin-top:-2px">
                <span class="trytext" style="margin-left:0;">关键字或使用高级搜索吧！</span>
              </div>
              <div class="seniorButton" @click="showSenior">
                高级搜索
              </div>
            </div>
          </div>
          <!---->
          <div class="noInfo" v-show="noInfoShow500">
            <div class="trySenior" :class="{show:noInfoShow500}" style="width:100%">
              <img :src="$image.warning.warnin" alt="网络连接失败">
              <div class="tryText" style="display: flex;justify-content: center;width:100%;">
                <span class="trytext" style="margin-left:0;">服务器错误，请刷新重试！</span>
              </div>
              <div class="seniorButton" @click="reload500">
                刷新
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 板块类别 -->
      <div class="showSearch">
        <div class="itembox">
          <div class="item" @click="MRselect($event)" v-for="v in selectItems[0].item[0]">
            <!--this.selectItems[0]-->
            <div class="itemTip aaa" select='true'></div>
            <div class="itemText bbb">{{ v }}</div>
            <div class="itemHline"></div>
          </div>
        </div>
        <div class="bottomBox">
          <div class="reset" @click="MRreset($event)">重置</div>
          <div class="yeah" @click="shaixuanY">确认</div>
        </div>
      </div>       <!----正面各筛选条件---->
      <!-- 行业类别 -->
      <div class="showSearch2">
        <div class="itembox">
          <div class="item" @click="GZselect($event)" v-for="v in sxlistItem[2].item[0]">
            <div class="itemTip aaa" select='true'></div>
            <div class="itemText bbb">{{ v }}</div>
            <div class="itemHline"></div>
          </div>
        </div>
        <div class="bottomBox">
          <div class="reset" @click="GZreset($event)">重置</div>
          <div class="yeah" @click="shaixuanY">确认</div>
        </div>
      </div>
      <!--右滑高级-->
      <mt-popup v-model="popupVisible" position="right" class="mint-popup-3" :modal="false">
        <div class="rulExpert" @click.native="popupVisible = false">
          <i @click="popupVisible= false" class="icon iconfont icon-x expert_g"></i>
          <span>高级搜索</span>
        </div>
        <div class="rangeGkipt sxListsScroller">
          <div class="range">{{range}}</div>
          <div class="rangeBtn">
            <div>
              <button class="rangeBtn1 colorBtn" @click="sea1()">标题</button>
            </div>
            <div>
              <button class="rangeBtn2" @click="sea2()">全文</button>
            </div>
          </div>
          <div class="range">{{accuracy}}</div>
          <div class="rangeBtn_2">
            <div>
              <button class="rangeBtn3 colorBtn" @click="sea3()">精确</button>
            </div>
            <div>
              <button class="rangeBtn4" @click="sea4()">模糊</button>
            </div>
          </div>
          <div class="rangeMoregl">
            <div class="rangeMore" @click="matter()">{{More}}
              <i class="icon iconfont icon-xiangyoujiantou rangeMoreTop" v-show="this.sw == 0"></i>
              <i class="icon iconfont icon-xiangxiajiantou rangeMoreButton" v-show="this.sw != 0"></i>
            </div>
          </div>
          <div class="rulesMatter">
            <div class="serachTitle">
              <div class="searchTitle">标题关键字</div>
              <div class="inputA">必须包含
                <input type="text" v-model="titleIncludes" @focus="editFocus($event)" class="inputTil"
                       id="inputTil1">
                <i class="Expert_close Expert_5"></i>
              </div>
              <div class="inputB">可能包含
                <input type="text" v-model="titleMaybeIncludes" @focus="editFocus($event)" class="inputTil"
                       id="inputTil2">
                <i class="Expert_close Expert_5"></i>
              </div>
              <div class="inputC">不包含
                <input type="text" v-model="titleExcludes" @focus="editFocus($event)" class="inputTil"
                       id="inputTil3">
                <i class="Expert_close Expert_5"></i>
              </div>
            </div>
            <div class="serachCont">
              <div class="searchCont">全文关键字</div>
              <div class="inputA">必须包含
                <input type="text" v-model="contentIncludes" @focus="editFocus($event)" class="inputCont"
                       id="inputTil4">
                <i class="Expert_close Expert_5"></i>
              </div>
              <div class="inputB">可能包含
                <input type="text" v-model="contentMaybeIncludes" @focus="editFocus($event)"
                       class="inputCont" id="inputTil5">
                <i class="Expert_close Expert_5"></i>
              </div>
              <div class="inputC">不包含
                <input type="text" v-model="contentExcludes" @focus="editFocus($event)" class="inputCont"
                       id="inputTil6">
                <i class="Expert_close Expert_5"></i>
              </div>
            </div>
          </div>
        </div>
        <div class="footBtn">
          <button type="button" @click="goReset">重置</button>
          <mt-button @click.native="searchMany">确认</mt-button>
        </div>
        <!---->
      </mt-popup>
      <!---->
      <button @click="popupVisible1Show" class="shadow"></button>  <!--筛选 阴影隐藏-->
      <mt-popup v-model="popupVisible1" position="right" class="mint-popup-3" :modal="false">
        <div class="sxHeader">
          <i @click="SXhide" class="icon iconfont icon-x expert_g"></i>
          <div class="sxHeaderText">筛选</div>
        </div>
        <div class="sxListsScroller">
          <div class="sxLists ruleList">           <!----侧边栏各筛选条件---->
            <!-- 板块类别 -->
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(0)">
                <div>板块类别</div>
                <div class="tipText tip"></div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <div class="itemContent" v-for="vv in sxlistItem[0].item[0]">
                  <div class="itemList" @click="MarketSH($event)">
                    <div class="listText">{{ vv }}</div>
                    <div class="itemTip" select="true"></div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 行业类别 -->
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(1)">
                <div>行业类别</div>
                <div class="tipText tip2"></div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <div class="itemContent" v-for="vv in sxlistItem[2].item[0]">
                  <div class="itemList" @click="SortSH($event)">
                    <div class="listText">{{ vv }}</div>
                    <div class="itemTip" select="true"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(2)">
                <div>发布日期</div>
                <div class="tipText tip4" style="width:auto;">{{ dateARR+''+dateARR1 }}</div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <!--max-height: 250px;overflow: scroll-->
                <div class="itemContent">
                  <div class="itemList">
                    <div class="listText">起始日期</div>
                    <div class="inputBox aa">
                      <input type="date" required min="1991-11-15" :max="todate" v-model="timesDate1"
                             placeholder="年 / 月 / 日" @input="times1">
                      <b class="closeDate closeDate1" @click="timesClose1"></b>
                    </div>
                  </div>
                  <div class="itemList">
                    <div class="listText">结束日期</div>
                    <div class="inputBox bb">
                      <input type="date" required :min="dateStart" :max="todate" v-model="timesDate2"
                             placeholder="年 / 月 / 日" @input="times2">
                      <b class="closeDate closeDate2" @click="timesClose2"></b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- </scroller>-->
        <div class="sxFooter">           <!----侧边栏确认重置按钮---->
          <div class="sxReset" @click="SXReset($event)">重置</div>
          <div class="sxYeah" @click="shaixuanY">确认</div>
        </div>
      </mt-popup>
      <div class="ceshadow" style="display: none">          <!--侧边栏加载中-->
        <div class="snake-circle"></div>
      </div>
      <!--内容页-->
      <button @click="popupHide" class="showOp"></button>  <!--高级 阴影隐藏-->
      <div class="showPrompt">上滑加载更多内容</div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'searchList',
    data() {
      return {
        timesDate1: '',
        timesDate2: '',
        More: '更多搜索选项',
        accuracy: '搜索精度',
        range: '搜索范围',
        right: this.$image.rules.right,
        button: this.$image.rules.bottom,
        experts: '高级',
        num: 0,
        numtext: '条',
        values: '',
        placeholder: "搜索法规名称，多个关键字空格隔开",
        popupVisible: false,
        top: 1,
        bottom: 15,
        sortType: '',
        ruleslist: [],  //搜索结果列表数组
        prompting: [],
        sw: 0,
        titleCompanyCode: "",//公司代码/简称
        titleIncludes: "",//标题包含
        titleMaybeIncludes: "",//标题可能包含
        titleExcludes: "",//标题不包含
        contentIncludes: "",
        contentMaybeIncludes: "",
        contentExcludes: "",
        nuwUrl: '',
        popupVisible1: false,
        noInfoShow: false,//没有搜到内容的提示信息
        noInfoShow500: false,//网络错误500
        //正面筛选栏数组
        selectItems: [
          {
            name: "板块类别",
            item: []
          },
          {
            name: "公告类别",
            item: []
          },
          {
            name: "行业类别",
            item: []
          }
        ],
        //侧面筛选栏数组
        sxlistItem: [
          {
            name: '板块类别',
            item: []
          }, {
            name: '公告类别',
            item: []
          }, {
            name: '行业类别',
            item: []
          }, {
            name: '时效性',
            item: []
          }
        ],
        xianshi: false,//默认排序筛选条件下拉是否弹出
        xianshi1: false,//公告类别筛选条件下拉是否弹出
        xianshi2: false,//行业类别筛选条件下拉是否弹出
        frontStatus: false,//加一个状态判断是否是正面筛选栏出来的条件
        value0: [],//板块类别arr
        value1: [],//公告类别arr
        value2: [],//行业类别Name arr
        value3: [],//时效性arr
        dateStart: '',//发布日期arr
        dateEnd: "",//发布日期
        idarr1: [],//公告类别idarr
        idarr2: [],//行业类别idarr
        idarr3: [],//时效性idarr
        paixuid: '',//排序ID
        guizeArr: [],//规则数组 四个类别idarr
        gzObjarr: [],//选中状态行业类别arr
        Newarr: [], /* Newarrs: ["上市规则", '规则规则规则', "海洋规则规则规则规则"],*/
        titleKey: [],
        newTitleKey: [],
        onloadOpen: true, //加载更多的开关  上滑加载的时候让它关闭 内容加载完成后让它开启
        yeahFlag: false, //点击确认提交筛选条件开关  选择完筛选条件后 点击确认yeahFlag为true 没有点击则为false 此时选中状态的样式是不应该有的 重置后再次设为false
        marketStatus: [],//保存板块类别的筛选条件
        markerStr: [],//确认提交后需要设置状态的筛选条件
        trueMarketWord: [],//保存的板块类别的筛选条件文字
        fawenStatus: [],//保存公告类别的筛选条件
        fawenIdStatus: [],
        trueFawenWord: [],//保存公告类别的筛选条件文字
        hangyeStatus: [],//保存行业类别的筛选条件
        hangyeStr: [],//保存行业类别的筛选条件
        guizeIdStatus: [],
        timeStatus: [],//保存时效性的筛选条件
        timeIdStatus: [],//保存时效性的筛选条件文字
        trueTimeWord: [],
        keys: '',
        routerKeys: "",
        gunflag: true,//滚动触发 1->10
        toright: this.$image.rules.toright,
        tobutton: this.$image.rules.tobutton,
        dateARR: '',
        dateARR1: '',
        todate: "2017-08-24",
        bottomStatus: '', //下拉状态
        searchscope: "title",  //搜索范围 title标题 content全文
        searchtype: "exact", //搜索精度 exact 精确 like 模糊
        rulesListNum: 0,
        gaojiJQ: true,
        onlyOne: false,//只有一个筛选条件
        infLoading: true,
        loading: false,
        allLoaded: true,
        wrapperHeight: 0,
      }
    },
    watch: {
      xianshi: function (val, old) {
        if (old == false) {
          console.log("板块类别展开******* 1-2", "此时已经确认提交的筛选条件 板块类别 为", this.markerStr)
          var arr = [];
          for (var i in this.marketStatus) {
            for (var j in this.markerStr) {
              if (this.markerStr[j] == this.marketStatus[i]) {
                arr.push(this.marketStatus[i])
              }
            }
          }
          for (var i in $(".showSearch").find('.aaa')) {       //关闭当前筛选条件栏后 首先重置所有的选中样式
            $(".showSearch").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
          this.value0 = arr;
          this.trueMarketWord = arr;
          console.log("此时板块类别的文字arr为", this.value0, this.idarr0)
          //为点击确认按钮后的选中筛选条件显示
          for (var i = 0; i < this.value0.length; i++) {
            $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...')
            $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
          }
          if (this.value0.length == 0) {
            $(".search1").find('span').text('板块类别')
            $(".tip").text('')
          }
          for (var i = 0; i < this.value0.length; i++) {       //然后 板块类别条件选中状态 只有确认提交过的条件才能显示
            for (var j in $(".showSearch").find('.bbb')) {
              if (this.value0[i] == $(".showSearch").find('.bbb').eq(j).text()) {
                $(".showSearch").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
              }
            }
          }
        } else if (old == true && val == false) {
          console.log('板块类别关闭******* 11-22', "此时已经确认提交的筛选条件 板块类别 为", this.markerStr, this.marketStatus, this.markerStr)
          var arr = [];
          for (var i in this.marketStatus) {
            for (var j in this.markerStr) {
              if (this.markerStr[j] == this.marketStatus[i]) {
                arr.push(this.marketStatus[i])
              }
            }
          }
          for (var i in $(".showSearch").find('.aaa')) {       //关闭当前筛选条件栏后 首先重置所有的选中样式
            $(".showSearch").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
          this.value0 = arr;
          this.trueMarketWord = arr;
          console.log("此时板块类别的文字arr为", this.value0, this.idarr0)
          //为点击确认按钮后的选中筛选条件显示
          for (var i = 0; i < this.value0.length; i++) {
            $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...')
            $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
          }
          if (this.value0.length == 0) {
            $(".search1").find('span').text('板块类别')
            $(".tip").text('')
          }
          for (var i = 0; i < this.value0.length; i++) {       //然后 板块类别条件选中状态 只有确认提交过的条件才能显示
            for (var j in $(".showSearch").find('.bbb')) {
              if (this.value0[i] == $(".showSearch").find('.bbb').eq(j).text()) {
                $(".showSearch").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
              }
            }
          }
        }
      },
      xianshi1: function (val, old) {
        if (old == false) {     //公告类别筛选条件栏展开
          console.log("公告类别展开******* 1-2")
        } else if (old == true && val == false) {  //公告类别筛选条件栏关闭 隐藏
          console.log("公告类别关闭******* 11-22")
          console.log('公告类别需要设置选中状态的条件id值', this.fawenIdStatus)
          console.log("要和公告类别的筛选条件比较id值相同的为需要设置选中状态的条件", this.fawenStatus)
          var arr = [];
          var idarr = [];
          for (var i in this.fawenStatus) {
            for (var j in this.fawenIdStatus) {
              if (this.fawenIdStatus[j] == this.fawenStatus[i]['id']) {
                console.log(i, this.fawenStatus[i]['name'])
                arr.push(this.fawenStatus[i]['name'])
                idarr.push(this.fawenStatus[i]['id'])
              }
            }
          }

          for (var i in $(".showSearch1").find('.aaa')) {       //关闭当前筛选条件栏后 首先重置所有的选中样式
            $(".showSearch1").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }

          this.value1 = arr;
          this.trueFawenWord = arr;
          this.idarr1 = idarr;
          console.log("此时公告类别的文字arr为", this.value1, this.idarr1)
          //为点击确认按钮后的选中筛选条件显示
          for (var i = 0; i < this.value1.length; i++) {
            $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...')
            $(".tip1").text(this.value1.join(',').substring(0, 8) + '...')
          }
          if (this.value1.length == 0) {
            $(".search2").find('span').text('公告类别')
            $(".tip1").text('')
          }

          for (var i = 0; i < this.value1.length; i++) {       //然后 公告类别条件选中状态 只有确认提交过的条件才能显示
            for (var j in $(".showSearch1").find('.bbb')) {
              if (this.value1[i] == $(".showSearch1").find('.bbb').eq(j).text()) {
                $(".showSearch1").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
              }
            }
          }

          var idArr = [];
          for (var i = 0; i < this.value1.length; i++) {
            $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...')
            $(".tip1").text(this.value1.join(',').substring(0, 8) + '...')
            for (var j = 0; j < this.sxlistItem[1].item.length; j++) {
              if (this.value1[i] == this.sxlistItem[1].item[j].name) {
                idArr.push(this.sxlistItem[1].item[j].id)
              }
            }
          }
        }
      },
      xianshi2: function (val, old) {
        if (old == false) {
          console.log("行业类别展开******* 1-2")
          var arr = [];
          for (var i in this.hangyeStatus) {
            for (var j in this.hangyeStr) {
              if (this.hangyeStr[j] == this.hangyeStatus[i]) {
                arr.push(this.hangyeStatus[i])
              }
            }
          }
          for (var i in $(".showSearch2").find('.aaa')) {       //关闭当前筛选条件栏后 首先重置所有的选中样式
            $(".showSearch2").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
          this.value2 = arr;
          //console.log("此时行业类别的文字arr为this.value2", this.value2, this.idarr2)
          //为点击确认按钮后的选中筛选条件显示
          for (var i = 0; i < this.value2.length; i++) {
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...')
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
          }
          if (this.value2.length == 0) {
            $(".search3").find('span').text('行业类别')
            $(".tip2").text('')
          }
          for (var i = 0; i < this.value2.length; i++) {//然后 行业类别条件选中状态 只有确认提交过的条件才能显示
            for (var j in $(".showSearch2").find('.bbb')) {
              //console.log('5555',$(".showSearch2").find('.bbb').eq(j).text())
              if (this.value2[i] == $(".showSearch2").find('.bbb').eq(j).text()) {
                $(".showSearch2").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
              }
            }
          }
        } else if (old == true && val == false) {
          console.log("行业类别关闭******* 11-22")
          console.log('行业类别需要设置选中状态的条件值---this.hangyeStatus', this.hangyeStatus)
          //console.log("要和行业类别的筛选条件比较值相同的为需要设置选中状态的条件---this.hangyeStr", this.hangyeStr)
          var arr = [];
          for (var i in this.hangyeStatus) {
            for (var j in this.hangyeStr) {
              if (this.hangyeStr[j] == this.hangyeStatus[i]) {
                arr.push(this.hangyeStatus[i])
              }
            }
          }
          for (var i in $(".showSearch2").find('.aaa')) {       //关闭当前筛选条件栏后 首先重置所有的选中样式
            $(".showSearch2").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
          this.value2 = arr;
          //为点击确认按钮后的选中筛选条件显示
          for (var i = 0; i < this.value2.length; i++) {
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...')
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
          }
          if (this.value2.length == 0) {
            $(".search3").find('span').text('行业类别')
            $(".tip2").text('')
          }
          for (var i = 0; i < this.value2.length; i++) {//然后 行业类别条件选中状态 只有确认提交过的条件才能显示
            for (var j in $(".showSearch2").find('.bbb')) {
              //console.log('5555',$(".showSearch2").find('.bbb').eq(j).text())
              if (this.value2[i] == $(".showSearch2").find('.bbb').eq(j).text()) {
                $(".showSearch2").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
              }
            }
          }
        }
      }
    },
    created() {
      console.log(this.$route.query, $(".anListName").length);
      this.routerKeys = this.$route.query.inputVal;
    },
    components: {},
    updated() {
      if (this.popupVisible1 == false) {
        setTimeout(() => {
          $('.shadow').hide();
          $('#wrapper').css({'overflow': 'scroll'});
        }, 300);
      } else {
        setTimeout(() => {
          $('.shadow').show();
          $('#wrapper').css({'overflow': 'hidden'});
        }, 200);
        return
      }

      var hei = this.$refs.afficheSearchListDom.clientHeight;
      var SXpup = (hei - 90) + "px";
      var hgt = (hei - (document.querySelector('.searchs').clientHeight) - (document.querySelector('.searchBox').clientHeight)) + 'px';
      $('.listGroup').css({'height': hgt});
      $('.sxListsScroller').css({'height': SXpup});
      $(".ruleList").css('height', $('body').outerHeight() - $(".sxHeader").outerHeight() - $(".sxFooter").outerHeight())
      /**/
      if (this.popupVisible == false) {
        setTimeout(() => {
          $('.showOp').hide();
          $('#wrapper').css({'overflow': 'scroll'});
        }, 300);
      } else {
        setTimeout(() => {
          $('.showOp').show();
          $('#wrapper').css({'overflow': 'hidden'});
        }, 300);
        return
      }

    },
    mounted() {
      //页面加载完调用
      this.multipleKeyRetrieval();//第一个字符串，第二个生成的新字符串
      this.titleCompanyCode = this.$route.query.inputCode;
      //高级默认状态
      this.sea();
      if (window.localStorage.getItem('全文') !== null) {
        this.searchscope = 'content';
        this.contentIncludes = this.routerKeys;
        this.routerKeys = '';
        this.gaojiJQ = true;
        this.sea2();
        window.localStorage.removeItem("全文");
      } else {
        this.searchscope = ''
      }
      if (window.localStorage.getItem('模糊') !== null) {
        this.searchtype = 'like';
        /*this.contentIncludes=this.routerKeys;
                 this.routerKeys='';*/
        this.keys = this.$route.query.inputVal;
        this.gaojiJQ = true;
        this.sea4();
        window.localStorage.removeItem("模糊");
      } else {
        this.searchtype = ''
      }
      //获取筛选
      this.prompting = this.newTitleKey;
      this.Newarr = this.prompting;
      if (window.localStorage.getItem('板块类别') !== null) {
        this.value0 = window.localStorage.getItem('板块类别').split(',');
        this.value0text();
        window.localStorage.removeItem("板块类别");
      } else {
        //console.log('没有板块类别')
      }
      if (window.localStorage.getItem('行业类别') !== null) {
        this.value2 = window.localStorage.getItem('行业类别').split(',');
        //console.log('从localStorage获取到行业类别this.value2', window.localStorage.getItem('行业类别'), this.value2)
        this.value2text();
        window.localStorage.removeItem("行业类别");
      } else {
        //console.log('没有行业类别')
      }
      if (window.localStorage.getItem('dateStart') !== null) {
        var str = window.localStorage.getItem('dateStart');
        this.timesDate1 = str;
        this.times1();
        //console.log("dates", this.timesDate1);
        window.localStorage.removeItem("dateStart");
      }
      /**/
      if (window.localStorage.getItem('dateEnd') !== null) {
        var str = window.localStorage.getItem('dateEnd');
        this.timesDate2 = str;
        this.times2();
        window.localStorage.removeItem("dateEnd");
      }

      $(".is-fixed").css("z-index", '100')
      this.$nextTick(() => {
        this.anlist();
        this.todate = this.$const.getNewDate();
      })
      this.titleIncludes = this.noep(this.routerKeys);
      this.yeah();
      //console.log('行业类别hangyeList',this.hangyeStatus)
    },
    methods: {
      editFocus(event) {
        var el = event.currentTarget;
        var id = $(el)[0].id;
        this.$const.androidTop(id);
      },
      //数组去重
      unique(arr) {
        var result = [];
        var obj = {};
        for (let i = 0; i < arr.length; i++) {
          if (!obj.hasOwnProperty(arr[i])) {
            result.push(arr[i]);
            obj[arr[i]] = 0;
          }
        }
        return result
      },
      //关键字高亮
      key(str) {
        if (str.length >= 44) {
          str = str.substring(0, 44) + '...';
        } else {
          str
        }
        var arr = "";
        var ar = this.Newarr.join(",");
        var strin = ar + "," + this.contentIncludes + "," + this.titleIncludes;
        var array = strin.split(",");
        this.ImpArr(array);//数组去除空元素
        array = this.unique(array);
        for (var i = 0; i < array.length; i++) {
          var fen = str.split(array[i]);
          str = fen.join('<span style="color: #ffc051;">' + array[i] + '</span>');
        }
        return str;
      },
      noep(texts) {
        if (texts.indexOf(" ") == -1) {
          return texts;
        } else {
          var textss = [];
          textss = texts.split(' ');
          for (var i = 0; i < textss.length; i++) {
            if (textss[i] == "" || typeof(textss[i]) == "undefined") {
              textss.splice(i, 1);
              i = i - 1;
            }
          }
          return texts = textss.join(",");
        }
      },
      handleBottomChange(status) {
        this.bottomStatus = status;
      },
      loadMore() {
        $('.ceshadow').hide();
        let lastValue = this.rulesListNum;
        if (lastValue < this.num) {
          this.loading = true;
          this.allLoaded = true;
        } else {
          this.loading = false;
          this.allLoaded = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.num) {
            this.top += 1;
            this.yeah();
            this.yeahFlag = false; //滚动触发的确认方法 开关为fals
            this.onloadOpen = false;
          }
          setTimeout(() => {
            this.allLoaded = false;
            this.loading = false;
          }, 5000);
        }, 300);
      },
      //网络错误报500
      reload500() {
        window.location.reload();
      },
      value0text() {
        $(".searchBox").css('display', 'flex')
        if (this.value0.length == 1 && this.value0[0].length == 0) {
          $(".search1").find('span').text('板块类别')
          $(".tip").text('')
        } else {
          console.log('.......>', this.value0)
          for (var i = 0; i < this.value0.length; i++) {       //然后 板块类别条件选中状态 只有确认提交过的条件才能显示
            $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...')
            $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
            for (var j in $(".showSearch").find('.bbb')) {
              if (this.value0[i] == $(".showSearch").find('.bbb').eq(j).text()) {
                $(".showSearch").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
              }
            }
          }
        }
      },
      value2text() {
        $(".searchBox").css('display', 'flex')
        if (this.value2.length == 1 && this.value2[0].length == 0) {
          $(".search3").find('span').text('行业类别')
          $(".tip2").text('')
        } else {
          console.log('gonggaoleibie', this.value2)
          for (var i = 0; i < this.value2.length; i++) {       //然后 板块类别条件选中状态 只有确认提交过的条件才能显示
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...')
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
          }
        }
      },
      /**************处理时间戳****************/
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      format(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(parseInt(shijianchuo));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y + '年' + this.add0(m) + '月' + this.add0(d) + '日';
      },
      /*************************************/
      anlist() {
        //筛选 时间控件
        var user = "";
        if (/android/i.test(navigator.userAgent)) {
          user = "1";//  android
          $(".inputBox").css('width', '70%');
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          user = "0"//  ios
          $(".inputBox").css('width', '60%');
        }
      },
      popupVisible1Show() {        //高级筛选阴影隐藏
        this.popupVisible1 = false;
        this.SXhide();
      },
      //路由传值多个关键词拆分搜索
      multipleKeyRetrieval() {
        this.strKey = this.$route.query.inputVal;
        /*console.log(this.strKey);*/
        this.titleKey = this.strKey.split(" ");
        /*console.log(this.titleKey);*/
        /*删除空元素*/
        for (let i = 0; i < this.titleKey.length; i++) {
          if (this.titleKey[i] === "" || typeof(this.titleKey[i]) === "undefined") {
            this.titleKey.splice(i, 1);
            i = i - 1;
          }
        }
        this.newTitleKey = this.titleKey;
        this.titleIncludes = this.titleKey.join(",");
        /*console.log(this.titleIncludes);*/
      },
      //控制字块长度
      strLength(read, Newarr, num) {
        //传入的数组，//处理后的数组
        let sArr = '';
        for (let i = 0; i < read.length; i++) {
          if (read[i].length > num) {
            sArr = read[i].substring(0, num) + "...";
          } else {
            sArr = read[i];
          }
          Newarr.push(sArr);
        }
      },
      /* //控制 默认排序筛选栏 显示隐藏 */
      newBtnArr(str) {
        if (str.length >= 5) {
          return str = str.substring(0, 5) + '...';
        } else {
          return str
        }
      },
      showSenior() {   //点击推荐使用高级搜索 弹出高级搜索侧边栏
        this.popupVisible = true;
      },
      entrybug() {     //安卓弹起输入框时 隐藏确定重置按钮 footBtn
        var user = "";
        var h = document.body.scrollHeight;
        if (/android/i.test(navigator.userAgent)) {
          //  android
          user = "1";
          window.onresize = function () {
            if (document.body.scrollHeight < h) {
              $('.footBtn').hide();
            } else {
              $('.footBtn').show();
            }
          };
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          //  ios
          user = "0"

        }
      },
      hideMarket() {  //关闭侧边栏后公告类别筛选设置样式
        var marketText = $('.sxitemBox:nth-child(1)').find(".listText");
        var arr = [];
        var idarr = [];
        for (var i in this.marketStatus) {
          for (var j in this.marketIdStatus) {
            if (this.marketIdStatus[j] == this.marketStatus[i]['id']) {
              arr.push(this.marketStatus[i]['name'])
              idarr.push(this.marketStatus[i]['id'])
            }
          }
        }
//        this.value0 = arr;
//        /*this.idarr0=idarr;*/
//        for (var i in marketText) {
//          for (var j in arr) {   //unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
//            if (marketText.eq(i).text() == arr[j]) {
//              marketText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false');
//              /* console.log('+++++++++++++',marketText.eq(i).text(),'应该是有样式的')*/
//            } else {
//              /*console.log('-----------',marketText.eq(i).text(),'应该是没样式的')*/
//              marketText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
//            }
//          }
//        }
      },
      hideFawen() {
        var unitsText = $('.sxitemBox:nth-child(2)').find(".listText");
        var arr = [];
        var idarr = [];
        for (var i in this.fawenStatus) {
          for (var j in this.fawenIdStatus) {
            if (this.fawenIdStatus[j] == this.fawenStatus[i]['id']) {
              /* console.log(i,this.fawenStatus[i]['name'])*/
              arr.push(this.fawenStatus[i]['name'])
              idarr.push(this.fawenStatus[i]['id'])
            }
          }
        }
//        this.value1 = arr;
//        console.log('this.value1关闭侧边筛选栏', this.value1)
//        this.idarr1 = idarr;
//        for (var i in unitsText) {
//          for (var j in arr) {   //unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
//            if (unitsText.eq(i).text() == arr[j]) {
//              unitsText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false'); //marketText.eq(i).text(),'应该是有样式的'
//            } else {
//              unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');// unitsText.eq(i).text(),'应该是没样式的'
//            }
//          }
//        }
      },
      hideGuize() {
        var guizeText = $('.sxitemBox:nth-child(3)').find(".listText");
        var arr = [];
        var idarr = [];
        var guizeStr = '';
        console.log(this.guizeIdStatus, this.hangyeStatus)
        for (var i = 0; i < this.guizeIdStatus.length; i++) {
          for (var j = 0; j < this.hangyeStatus.length; j++) {
            guizeStr = this.hangyeStatus[j];
            if (guizeStr.split(',').length > 1) {     //如果一个id值里面有好几个id
              guizeStr.split(',')
              for (var x in guizeStr.split(',')) {
                if (this.guizeIdStatus[i] == guizeStr.split(',')[x]) {
                  /* console.log('guizeStr[x]',guizeStr.split(',')[x])*/
                  arr.push(this.hangyeStatus[j]['name'])
                  idarr.push(this.hangyeStatus[j]['id'])
                }
              }
            } else {
              if (this.guizeIdStatus[i] == this.hangyeStatus[j]['id']) {
                arr.push(this.hangyeStatus[j]['name'])
                idarr.push(this.hangyeStatus[j]['id'])
              }
            }
          }
        }

        /* 1017 此处注释修改关闭筛选以后清除选项的bug
                this.value2 = arr;
                this.trueGuizeWord = arr;
                this.idarr2 = idarr;
                for (var i in guizeText) {
                  for (var j in arr) {   //unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
                    if (guizeText.eq(i).text() == arr[j]) {
                      guizeText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false'); //marketText.eq(i).text(),'应该是有样式的'
                    } else {
                      guizeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');// unitsText.eq(i).text(),'应该是没样式的'
                    }
                  }
                }*/
        console.log('================>', this.value0, this.value1, this.value2, this.value3)
      },
      hideTime() {
        var timeText = $('.sxitemBox:nth-child(4)').find(".listText");
        var arr = [];
        var idarr = [];
        for (var i in this.timeStatus) {
          for (var j in this.timeIdStatus) {
            if (this.timeIdStatus[j] == this.timeStatus[i]['id']) {
              arr.push(this.timeStatus[i]['name'])
              idarr.push(this.timeStatus[i]['id'])
            }
          }
        }
        this.value3 = arr;
        /*console.log('时效性选中选项',arr)*/
        this.idarr3 = idarr;
        /*console.log('时效性选项',timeText)*/
        for (var i in timeText) {
          for (var j in arr) {   //timeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            if (timeText.eq(i).text() == arr[j]) {
              timeText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false'); //marketText.eq(i).text(),'应该是有样式的'
              /*console.log('have i',i)*/
              /*console.log('相同的时效性选项',)*/
            } else {
              timeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');// unitsText.eq(i).text(),'应该是没样式的'
              /*console.log('no i ', i)*/
            }
          }
        }
      },
      hideDate() {
        if (this.dateStart == '') {
          this.timesClose1();
        }
        if (this.dateEnd == '') {
          this.timesClose2();
        }
      },
      timesClose1() {
        this.timesDate1 = undefined;
        this.dateARR = "";
      },
      timesClose2() {
        this.timesDate2 = undefined;
        this.dateARR2 = "";
      },
      //关闭侧边筛选栏
      SXhide() {
        //筛选侧边栏hide
        this.popupVisible1 = false;
        this.hideDate();
        /*var stausArr = [];
                stausArr.push(this.value0);
                stausArr.push(this.value1);
                stausArr.push(this.value2);
                stausArr.push(this.value3);
                stausArr.push(this.dateStart);
                stausArr.push(this.dateEnd);
                console.log('--筛选条件--',stausArr,'this.value0',this.value0,'this.value2',this.value2);*/
        var guizeText = $('.sxitemBox:nth-child(2)').find(".listText");
        var marketText = $('.sxitemBox:nth-child(1)').find(".listText");
        if (this.markerStr.length == 1 && this.markerStr[0] == '') {
          this.value0 = [];
          $(".search1").find('span').text("板块类别")
          for (var i = 0; i < marketText.length; i++) {        //多余的数组元素 去掉选中状态
            marketText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
          }
        }
        if (this.hangyeStr.length == 1 && this.hangyeStr[0] == '') {
          this.value2 = [];
          $(".search3").find('span').text("行业类别")
          for (var i = 0; i < guizeText.length; i++) {        //多余的数组元素 去掉选中状态
            guizeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
          }
        }
        /*if(!this.yeahFlag){
                    this.timesDate1='';
                    this.timesDate2='';
                    this.dateARR='';
                    this.dateARR1='';
                }*/
        console.log('>>>>>', this.markerStr, this.yeahFlag)
        /*this.dateStart='';
                this.dateEnd='';*/
        /*this.hideMarket();
                this.hideFawen();
                this.hideGuize();
                this.hideTime();
                /!*筛选按钮红点状态显示*!/
                var stausArr = [];
                stausArr.push(this.value0);
                stausArr.push(this.value1);
                stausArr.push(this.value2);
                stausArr.push(this.value3);
                stausArr.push(this.dateStart);
                stausArr.push(this.dateEnd);
                console.log('筛选条件',stausArr);*/
      },
      // 打开筛选
      SXshow() {
        this.xianshi = false;
        this.xianshi1 = false;
        this.xianshi2 = false;
        /* $(".shadow").show();*/
        this.frontStatus = false; //当侧边筛选栏显示出来之后，重置正面筛选栏状态
        this.popupVisible1 = true;//筛选侧边栏show
        $(".search-mrpx").removeClass('pass')
        $(".showSearch1").hide();
        $(".showSearch").hide();
        $(".showSearch2").hide();

        var unitsText = $('.sxitemBox:nth-child(3)').find(".listText");
        var guizeText = $('.sxitemBox:nth-child(2)').find(".listText");
        var marketText = $('.sxitemBox:nth-child(1)').find(".listText");

        this.$nextTick(() => {
          if (this.hangyeStr.length !== 1 && this.hangyeStr[0] !== '') {
            this.value2 = this.hangyeStr;
          }
          var trueArr2 = [];            //侧边栏 行业类别属性select=false选中的数组
          for (var i = 0; i < guizeText.length; i++) {
            if (guizeText.eq(i).parent().find('.itemTip').attr('select') == 'false') {
              trueArr2.push(guizeText.eq(i).text())
            }
          }
          var a3 = this.value2;
          var a4 = trueArr2;
          var shao1 = [];
          var duo1 = [];
          var hebing1 = a3.concat(a4);
          hebing1.sort();
          hebing1.reverse();
          var quchong1 = $.unique(hebing1);
          //console.info('行业类别a3',a3,'行业类别a4',a4,'行业类别quchong',quchong1);
          quchong1.forEach(function (qitem, index, array) {
            if (a3.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              duo1.push(qitem)
            }
            if (a4.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              shao1.push(qitem)
            }
          });
          console.info("a4比a3多的元素" + duo1, "少的元素" + shao1);

          for (var i = 0; i < guizeText.length; i++) {        //多余的数组元素 去掉选中状态
            if (guizeText.eq(i).text() == duo1) {
              guizeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
          }
          if (this.value2.length == 0) {        //行业类别数组为空时 去掉选中状态
            for (var i = 0; i < guizeText.length; i++) {
              guizeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
            $(".tip2").text('');  //行业类别数组为空时 去掉提示信息
          }

          for (var i = 0; i < this.value2.length; i++) {      //行业类别同步状态
            for (var j = 0; j < guizeText.length; j++) {
              if (this.value2[i] == guizeText.eq(j).text()) {
                guizeText.eq(j).parent().find('.itemTip').addClass('selected').attr('select', 'false')
              }
            }
          }
        })

        this.$nextTick(() => {
          /*console.log("公告类别数组--------", this.value1)*/

          for (var i = 0; i < this.value1.length; i++) {       //公告类别同步状态
            for (var j = 0; j < unitsText.length; j++) {
              if (this.value1[i] == unitsText.eq(j).text()) {
                unitsText.eq(j).parent().find('.itemTip').addClass('selected').attr('select', 'false');
              }
            }
          }
          var trueArr = [];             //侧边栏 公告类别属性select=false选中的数组
          for (var i = 0; i < unitsText.length; i++) {
            if (unitsText.eq(i).parent().find('.itemTip').attr('select') == 'false') {
              trueArr.push(unitsText.eq(i).text())
            }
          }
          /*console.log('a1赋值的this.value1',this.value1)*/
          var a1 = this.value1;
          var a2 = trueArr;
          var shao = [];
          var duo = [];
          var hebing = a1.concat(a2);
          hebing.sort();
          hebing.reverse();
          var quchong = $.unique(hebing);
          console.info('公告类别a1', a1, '公告类别a2', a2, '公告类别quchong', quchong);

          quchong.forEach(function (qitem, index, array) {

            if (a1.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              duo.push(qitem);
            }

            if (a2.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              shao.push(qitem);
            }
          });
          /*console.info("a2比a1多的元素" + duo);
                     console.info("少的元素" + shao);*/
          /*console.log('筛选打开这里的this.value1是',this.value1)*/
          for (var i = 0; i < unitsText.length; i++) {        //多余的数组元素 去掉选中状态
            if (unitsText.eq(i).text() == duo) {
              unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
          }
          if (this.value1.length == 0) {
            for (var i = 0; i < unitsText.length; i++) {
              unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
            $(".tip1").text('');
          }
        })

        this.$nextTick(() => {
          if (this.markerStr.length !== 1 && this.markerStr[0] !== '') {
            this.value0 = this.markerStr;
          }
          for (var i = 0; i < this.value0.length; i++) {       //公告类别同步状态
            for (var j = 0; j < marketText.length; j++) {
              if (this.value0[i] == marketText.eq(j).text()) {
                marketText.eq(j).parent().find('.itemTip').addClass('selected').attr('select', 'false');
              }
            }
          }
          var trueArr = [];             //侧边栏 公告类别属性select=false选中的数组
          for (var i = 0; i < marketText.length; i++) {
            if (marketText.eq(i).parent().find('.itemTip').attr('select') == 'false') {
              trueArr.push(marketText.eq(i).text())
            }
          }
          //console.log('=====>a1赋值的this.value0',this.value0)
          console.log('--markerStr板块--', this.markerStr, 'hangyeStr行业', this.value0, this.hangyeStr.length);
          console.log("板块类别数组--------", this.markerStr, 'value0', this.value0);
          var a1 = this.value0;
          var a2 = trueArr;
          var shao = [];
          var duo = [];
          var hebing = a1.concat(a2);
          hebing.sort();
          hebing.reverse();
          var quchong = $.unique(hebing);
          console.info('板块类别a1', a1, '板块类别a2', a2, '板块类别quchong', quchong);

          quchong.forEach(function (qitem, index, array) {

            if (a1.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              duo.push(qitem);
            }

            if (a2.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              shao.push(qitem);
            }
          });
          /*console.info("a2比a1多的元素" + duo);
                     console.info("少的元素" + shao);
                     console.log('筛选打开这里的this.value0是',this.value0)*/
          for (var i = 0; i < unitsText.length; i++) {        //多余的数组元素 去掉选中状态
            if (marketText.eq(i).text() == duo) {
              marketText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
          }
          if (this.value0.length == 0) {
            for (var i = 0; i < marketText.length; i++) {
              marketText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
            $(".tip").text('');
          }
        })
        this.hideTime();
        this.$nextTick(() => {
          this.value0text();
          this.value2text();
        })
      },
      timesClose1() {
        this.timesDate1 = '';
        this.dateStart = '';//开始日期
        if (this.dateARR.indexOf(',') !== -1) {
          var aa = this.dateARR.split(',');
          this.dateARR = aa[1];
          console.log("243", this.dateARR, aa);
        } else {
          this.dateARR = '';
        }

        this.$nextTick(() => {
          this.times1();
        }, 1000);
      },
      times1() {
        this.dateStart = this.timesDate1;
        var time2 = [];
        var strtime2 = "";
        var time1 = [];
        var strtime1 = "";
        if (this.timesDate1.indexOf('-') !== -1) {
          time1 = this.timesDate1.split('-');
          strtime1 = time1.join('');
          $(".closeDate1").show();
          if (this.timesDate2.indexOf('-') !== -1) {
            time2 = this.timesDate2.split('-');
            strtime2 = time2.join('');
            this.dateARR = strtime1 + "," + strtime2;
          } else {
            this.dateARR = strtime1;
          }
          console.log('you', this.timesDate1, time1, strtime1);
        } else {
          $(".closeDate1").hide();

        }
      },
      timesClose2() {
        this.timesDate2 = '';
        this.dateEnd = "";//结束日期
        if (this.dateARR.indexOf(',') !== -1) {
          var aa = this.dateARR.split(',');
          this.dateARR = aa[0];
        } else {
          this.dateARR = '';
        }
        this.$nextTick(() => {
          this.times2();
        }, 1000);
      },
      times2() {
        this.dateEnd = this.timesDate2;
        var time2 = [];
        var strtime2 = "";
        var time1 = [];
        var strtime1 = "";
        if (this.timesDate2.indexOf('-') !== -1) {
          $(".closeDate2").show();
          time2 = this.timesDate2.split('-');
          strtime2 = time2.join('');
          if (this.timesDate1.indexOf('-') !== -1) {
            time1 = this.timesDate1.split('-');
            strtime1 = time1.join('');
            this.dateARR = strtime1 + "," + strtime2;
          } else {
            this.dateARR = strtime2;
          }
        } else {
          $(".closeDate2").hide();
        }
      },
      //筛选栏重置按钮
      SXReset(event) {
        var el = event.currentTarget;
        this.value0 = [];
        this.value1 = [];
        this.value2 = [];
        this.value3 = [];
        /*this.idarr0 = [];*/
        this.idarr1 = [];
        this.idarr2 = [];
        this.idarr3 = [];
        this.guizeArr = [];
        this.gzObjarr = [];
        this.dateStart = '';
        this.dateEnd = '';
        /*console.log($(".sxLists").find('.itemTip').length);*/
        $(".sxLists").find('.itemTip').attr('select', 'true').removeClass('selected');
        $(".sxLists").find('.tipText').text('');
        $(".search3").find('span').text('行业类别')
        $(".search2").find('span').text('公告类别')
        $(".search1").find('span').text('板块类别')
        $("input[type=date]").val('')
      },
      //筛选侧边栏 板块类别 选中
      MarketSH(event) {
        var el = event.currentTarget;
        $(el).find('.itemTip').addClass('selected');
        if ($(el).find('.itemTip').attr('select') == 'true') {
          this.value0.push($(el).find('.listText').text())
          $(el).find('.itemTip').attr("select", 'false')
        } else if ($(el).find('.itemTip').attr('select') == 'false') {
          $(el).find('.itemTip').removeClass('selected');
          $(el).find('.itemTip').attr("select", 'true')
          for (var i = 0; i < this.value0.length; i++) {
            if ($(el).find('.listText').text() == this.value0[i]) {
              this.value0.splice(i, 1)
            }
          }
        }
        for (var i in this.value0) {
          $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...')
          $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
        }
        if (this.value0.length == 0) {
          $(".tip").text('')
        }
        //console.log("》》》》》shichangleixing", this.value0,this.markerStr)
      },
      TimeSH(event) {
        var el = event.currentTarget;
        /* console.log(this.sxlistItem[3].item)*/
        $(el).find('.itemTip').addClass('selected');
        /*console.log('1111', $(el).find('.itemTip').attr('select'))*/
        if ($(el).find('.itemTip').attr('select') == 'true') {
          this.value3.push($(el).find('.listText').text())
          $(el).find('.itemTip').attr("select", 'false')
        } else if ($(el).find('.itemTip').attr('select') == 'false') {
          /*console.log('2222', $(el).find('.itemTip').attr('select'));*/
          $(el).find('.itemTip').removeClass('selected');
          $(el).find('.itemTip').attr("select", 'true')
          for (var i = 0; i < this.value3.length; i++) {
            if ($(el).find('.listText').text() == this.value3[i]) {
              this.value3.splice(i, 1)
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < this.value3.length; i++) {
          $(".tip3").text(this.value3.join(',').substring(0, 8) + '...')
          for (var j = 0; j < this.sxlistItem[3].item.length; j++) {
            if (this.value3[i] == this.sxlistItem[3].item[j].name) {
              idArr.push(this.sxlistItem[3].item[j].id)
            }
          }
        }
        if (this.value3.length == 0) {
          $(".tip3").text('')
        }
        this.idarr3 = idArr;
        /*console.log('时效性idArr', idArr)*/
      },
      //筛选侧边栏 行业类别 选中
      SortSH(event) {
        var el = event.currentTarget;
        $(el).find('.itemTip').addClass('selected');
        if ($(el).find('.itemTip').attr('select') == 'true') {
          this.value2.push($(el).find('.listText').text())
          $(el).find('.itemTip').attr("select", 'false')
        } else if ($(el).find('.itemTip').attr('select') == 'false') {
          $(el).find('.itemTip').removeClass('selected');
          $(el).find('.itemTip').attr("select", 'true')
          for (var i = 0; i < this.value2.length; i++) {
            if ($(el).find('.listText').text() == this.value2[i]) {
              this.value2.splice(i, 1)
            }
          }
        }
        var idArr = [];
        if (this.value0.length == 0) {
          for (var i = 0; i < this.value2.length; i++) {
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...')
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
            for (var j = 0; j < this.guizeArr.length; j++) {
              for (var x = 0; x < this.guizeArr[j].length; x++) {
                if (this.value2[i] == this.guizeArr[j][x].name) {
                  var obj = {id: this.guizeArr[j][x].id, name: this.guizeArr[j][x].name};
                  this.gzObjarr.push(obj)
                  idArr.push(this.guizeArr[j][x].id)
                }
              }
            }
          }
          console.log('不选筛选条件this.value2', this.value2)
          if (this.value2.length == 0) {
            $(".search3").find('span').text('行业类别')
            $(".tip2").text('')
          }
          this.idarr2 = idArr;
        } else {                                              //选中板块类别情况下 行业类别的id数组
          /*console.log('选中状态开启!')*/
          for (var i = 0; i < this.value2.length; i++) { //首先循环选中状态的行业类别值
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...');
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
            for (var q = 0; q < this.sxlistItem[0].item.length; q++) {  //循环板块类别数组
              for (var n = 0; n < this.value0.length; n++) {      //循环是否选中的板块类别
                if (this.value0[n] == this.sxlistItem[0].item[q].name) {    //若选中板块类别则返回其在guizeArr中的下标值
                  for (var j = 0; j < this.guizeArr[q].length; j++) { //然后循环选中的板块类别下的行业类别数组
                    if (this.value2[i] == this.guizeArr[q][j].name) {   //若选中行业类别值等于选中板块类别下行业类别数组的name值 返回其id值
                      var obj = {id: this.guizeArr[q][j].id, name: this.guizeArr[q][j].name}
                      this.gzObjarr.push(obj)
                      idArr.push(this.guizeArr[q][j].id)
                    }
                  }
                }
              }
            }
          }
          if (this.value2.length == 0) {
            $(".search3").find('span').text('行业类别')
            $(".tip2").text('')
          }
          this.idarr2 = idArr;
        }
      },
      UnitSH(event) {
        var el = event.currentTarget;
        //console.log($(el))
        $(el).find('.itemTip').addClass('selected');
        console.log('1111', $(el).find('.itemTip').attr('select'))
        if ($(el).find('.itemTip').attr('select') == 'true') {
          this.value1.push($(el).find('.listText').text())
          $(el).find('.itemTip').attr("select", 'false')
        } else if ($(el).find('.itemTip').attr('select') == 'false') {
          //console.log('2222', $(el).find('.itemTip').attr('select'));
          $(el).find('.itemTip').removeClass('selected');
          $(el).find('.itemTip').attr("select", 'true')
          for (var i = 0; i < this.value1.length; i++) {
            if ($(el).find('.listText').text() == this.value1[i]) {
              this.value1.splice(i, 1)
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < this.value1.length; i++) {
          $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...')
          $(".tip1").text(this.value1.join(',').substring(0, 8) + '...')
          for (var j = 0; j < this.sxlistItem[1].item.length; j++) {
            if (this.value1[i] == this.sxlistItem[1].item[j].name) {
              idArr.push(this.sxlistItem[1].item[j].id)
            }
          }
        }
        if (this.value1.length == 0) {
          $(".search2").find('span').text('公告类别')
          $(".tip1").text('')
        }
        this.idarr1 = idArr;
        //console.log('公告类别idArr', idArr)
      },
      showItem(i) {
        if ($(".itemconBOX[isOpen]").eq(i).attr('isOpen') == 'close') {
          $(".itemconBOX[isOpen]").eq(i).show().parent().siblings().find(".itemconBOX[isOpen]").hide();
          $(".itemconBOX[isOpen]").eq(i).attr('isOpen', 'open')
        } else {
          $(".itemconBOX[isOpen]").eq(i).hide();
          $(".itemconBOX[isOpen]").eq(i).attr('isOpen', 'close')
        }
      },
      MRselect(event) {
        var el = event.currentTarget;
        $(el).find('.aaa').addClass('selected')
        if ($(el).find('.aaa').attr("select") == 'true') {
          this.value0.push($(el).find('.bbb').text())
          $(el).find('.aaa').attr("select", 'false')
          /* console.log('此时select值', $(el).find('.aaa').attr("select"))*/
        } else if ($(el).find('.aaa').attr("select") == 'false') {
          $(el).find('.aaa').removeClass('selected')
          /*console.log('当前点击项', $(el).find('.bbb').text())
                     console.log('此时select值', $(el).find('.aaa').attr("select"))*/
          for (var i = 0; i < this.value0.length; i++) {
            if ($(el).find('.bbb').text() == this.value0[i]) {
              this.value0.splice(i, 1)
            }
          }
          $(el).find('.aaa').attr("select", 'true')
        }
        /*console.log('选中数组', this.value0);*/
        //给选中项筛选栏换名字
        for (var i = 0; i < this.value0.length; i++) {
          $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...')
          $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
        }
        if (this.value0.length == 0) {
          $(".search1").find('span').text('板块类别')
          $(".tip").text('')
        }
      },
      MRreset(event) {
        var el = event.currentTarget;
        var father = $(el).parent().parent();
        for (var i in father.find('.aaa')) {
          if (father.find('.aaa').eq(i).attr('select') == 'false') {
            father.find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
        }
        this.value0 = [];
        /*this.idarr0 = [];//重置板块类别数组*/
        $(".search1").find('span').text('板块类别')
        console.log('12', this.guizeStatus)
      },
      GZselect(event) {
        /*this.frontStatus=true; */ //状态判断是正面筛选栏出来的条件 公告类别
        console.log('GZselect', this.value2)
        var el = event.currentTarget;
        $(el).find('.aaa').addClass('selected')
        if ($(el).find('.aaa').attr("select") == 'true') {
          this.value2.push($(el).find('.bbb').text())
          $(el).find('.aaa').attr("select", 'false')
          console.log('此时GZselect值', $(el).find('.aaa').attr("select"))
        } else if ($(el).find('.aaa').attr("select") == 'false') {
          $(el).find('.aaa').removeClass('selected')
          console.log('当前GZ点击项', $(el).find('.bbb').text())
          console.log('此时GZselect值', $(el).find('.aaa').attr("select"))
          for (var i = 0; i < this.value2.length; i++) {
            if ($(el).find('.bbb').text() == this.value2[i]) {
              this.value2.splice(i, 1)
            }
          }
          $(el).find('.aaa').attr("select", 'true')
        }
        console.log('选中数组', this.value2)
        //给选中项筛选栏换名字
        for (var i = 0; i < this.value2.length; i++) {
          $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...')
          $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
        }
        if (this.value2.length == 0) {
          $(".search3").find('span').text('行业类别')
          $(".tip2").text('')
        }
      },
      GZreset(event) {
        this.yeahFlag = false; //重置后确认按钮恢复为false
        var el = event.currentTarget;
        var father = $(el).parent().parent();
        for (var i in father.find('.aaa')) {
          if (father.find('.aaa').eq(i).attr('select') == 'false') {
            father.find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
        }
        this.value2 = [];
        this.idarr2 = [];//重置行业类别数组
        $(".search3").find('span').text('行业类别')
        this.redCircleStatus();
      },
      // 没有筛选条件的时候让小红点消失
      redCircleStatus() {
        var stausArr = [];
        stausArr.push(this.value0);
        stausArr.push(this.value1);
        stausArr.push(this.value2);
        stausArr.push(this.value3);
        stausArr.push(this.dateStart);
        stausArr.push(this.dateEnd);

        /*let stausArr1 = this.value0.concat(this.value1);
                let stausArr2 = this.value2.concat(this.value3);
                stausArr = stausArr1.concat(stausArr2);
                stausArr.push(this.dateStart);
                stausArr.push(this.dateEnd);
                console.log('666===>',statusArr)*/

        for (var i = 0; i < stausArr.length; i++) {
          if (stausArr[i].length == 0) {
            console.log('没有筛选条件')
            $(".redCircle").hide();
          } else if (stausArr[i].length !== 0) {
            // && this.frontStatus== false 加上这个条件是区别正面筛选条件和侧边栏筛选条件
            console.log('筛选条件', stausArr[i]);
            $(".redCircle").show();
            return;
          }
        }
      },
      select(event) {
        /*this.frontStatus=true; */ //状态判断是正面筛选栏出来的条件 公告类别
        var el = event.currentTarget;
        $(el).find('.aaa').addClass('selected')
        if ($(el).find('.aaa').attr("select") == 'true') {
          this.value1.push($(el).find('.bbb').text())
          $(el).find('.aaa').attr("select", 'false')
          console.log('此时select值', $(el).find('.aaa').attr("select"))
        } else if ($(el).find('.aaa').attr("select") == 'false') {
          $(el).find('.aaa').removeClass('selected')
          console.log('当前点击项', $(el).find('.bbb').text())
          console.log('此时select值', $(el).find('.aaa').attr("select"))
          for (var i = 0; i < this.value1.length; i++) {
            if ($(el).find('.bbb').text() == this.value1[i]) {
              this.value1.splice(i, 1)
            }
          }
          $(el).find('.aaa').attr("select", 'true')
        }
        console.log('选中数组', this.value1)
        var idArr = [];
        for (var i = 0; i < this.value1.length; i++) {
          $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...')
          $(".tip1").text(this.value1.join(',').substring(0, 8) + '...')
          for (var j = 0; j < this.sxlistItem[1].item.length; j++) {
            if (this.value1[i] == this.sxlistItem[1].item[j].name) {
              idArr.push(this.sxlistItem[1].item[j].id)
            }
          }
        }
        if (this.value1.length == 0) {
          $(".search2").find('span').text('公告类别')
          $(".tip1").text('')
        }
        this.idarr1 = idArr;
        console.log('公告类别idArr', idArr)
      },
      reset(event) {  //重置公告类别筛选条件
        this.fawenStatus = [],//重置保存公告类别的筛选条件
          this.fawenIdStatus = [],

          this.yeahFlag = false; //重置后确认按钮恢复为false
        var el = event.currentTarget;
        var father = $(el).parent().parent();
        for (var i in father.find('.aaa')) {
          if (father.find('.aaa').eq(i).attr('select') == 'false') {
            father.find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
        }
        this.value1 = [];
        this.idarr1 = [];//重置公告类别数组
        $(".search2").find('span').text('公告类别')
        this.redCircleStatus();
      },
      // 筛选确认调用接口
      shaixuanY() {
        this.ruleslist = [];
        this.top = 1;
        $(".ceshadow").show();//加载中出现
        this.yeah();
      },
      // 筛选\高级\初始化\控制的ajax
      yeah() {        //点击确定发送请求数据
        this.gunflag = false;
        this.yeahFlag = true; //点击确认按钮后 yeahFlag开关打开 此时还有一种情况为加载更多的触发情况
        /*  $(".ceshadow").show();//加载中出现*/
        var unitIds = this.idarr1.join(',');
        // 行业类别id值 如果只选了板块类别 cateIds就填板块类别的id  如果板块类别和行业类别都填了 cateIds只写行业类别的id
        var cateIds = '';
        var timelinessIds = this.idarr3.join(',');
        var releaseStart = this.dateStart;
        var releaseEnd = this.dateEnd;
        // 2018 1月 24日 cai for get
        if (releaseStart) {
          releaseStart = releaseStart + ' 00:00:00';
        }
        if (releaseEnd) {
          releaseEnd = releaseEnd + ' 00:00:00';
        }
        //
        if (Array.isArray(this.titleIncludes)) {
          this.titleIncludes = this.titleIncludes.join(",");
        }
        // 板块类别数组处理字符串
        var marketString = this.value0.join(',');
        // 行业类别数组处理字符串
        var hangyeString = this.value2.join(',');
        $(".afficheSearch3").css('border-left', '0.5px solid #e3e3e3')
        $(".afficheSearch4").css('border-left', '0.5px solid #e3e3e3')
        /*高级选项*/
        this.contentIncludesText();
        let  params = {
          //id:"",  //索引ID
          //parentId:"",  //文档第一页索引ID
          sort: 'releaseDate',
          searchType: this.searchtype,  //搜索精度 like模糊 exact精确
          searchScope: "",  //搜索范围 title标题 content全文
          tradeType: hangyeString,//行业类别
          marketType: marketString,//板块类别
          announcementType: "",  //公告类别
          releaseStart: releaseStart,// 发布日期（起）
          releaseEnd: releaseEnd,// 发布日期（止）
          title: this.titleIncludes,//公告标题（一定包含）
          content: this.contentIncludes,//正文包含 公告正文（一定包含）
          possibleTitle: this.titleMaybeIncludes,//公告标题可能包含
          possibleContent: this.contentMaybeIncludes,//公告正文可能包含
          exceptTitle: this.titleExcludes,//公告标题（一定不包含）
          exceptContent: this.contentExcludes,//公告正文（一定不包含）
          pageNum: this.top,//当前页码
          pageSize: this.bottom,//每页条数
          keyword: this.keys, //搜索关键字
          dispatchUnit: "",//发文单位
          companyCode: this.titleCompanyCode,//公司代码
        }
        /*this.$http ({
          method: "GET",
          url: this.$api.disclosure.search,
          params: {
            //id:"",  //索引ID
            //parentId:"",  //文档第一页索引ID
            sort: 'releaseDate',
            searchType: this.searchtype,  //搜索精度 like模糊 exact精确
            searchScope: "",  //搜索范围 title标题 content全文
            tradeType: hangyeString,//行业类别
            marketType: marketString,//板块类别
            announcementType: "",  //公告类别
            releaseStart: releaseStart,// 发布日期（起）
            releaseEnd: releaseEnd,// 发布日期（止）
            title: this.titleIncludes,//公告标题（一定包含）
            content: this.contentIncludes,//正文包含 公告正文（一定包含）
            possibleTitle: this.titleMaybeIncludes,//公告标题可能包含
            possibleContent: this.contentMaybeIncludes,//公告正文可能包含
            exceptTitle: this.titleExcludes,//公告标题（一定不包含）
            exceptContent: this.contentExcludes,//公告正文（一定不包含）
            pageNum: this.top,//当前页码
            pageSize: this.bottom,//每页条数
            keyword: this.keys, //搜索关键字
            dispatchUnit: "",//发文单位
            companyCode: this.titleCompanyCode,//公司代码
          }
        })*/
        this.$axios.disclosure.search(params).then((res) => {
          console.log('返回结果', res);
//          console.log('是否进行在此？<-------333------->')
//          console.log('--------------->yeah', this.searchscope)
          this.selectItems[0].item = [];
          this.sxlistItem[0].item = [];
          this.selectItems[0].item.push(res.data.returnObject.conditions.market)
          this.sxlistItem[0].item.push(res.data.returnObject.conditions.market)//板块类别
          this.selectItems[2].item = [];
          this.sxlistItem[2].item = [];
          this.selectItems[2].item.push(res.data.returnObject.conditions.tradeType)
          this.sxlistItem[2].item.push(res.data.returnObject.conditions.tradeType)//行业类别
          //console.log('------------>>>????this.selectItems[0]', this.selectItems[0], this.sxlistItem[0].item[1], this.selectItems[0].item)
          //console.log('this.selectItems[0].item--->', this.selectItems[0].item, this.sxlistItem[0].item)
          this.marketStatus = res.data.returnObject.conditions.market;//获取到的板块类别的信息
          this.hangyeStatus = res.data.returnObject.conditions.tradeType;//获取到行业类别的信息
          //console.log('获取到行业类别的信息+++', this.hangyeStatus)

          //保存筛选条件状态
          this.fawenIdStatus = unitIds.split(',');     // 保存 提交的公告类别的筛选条件
          this.guizeIdStatus = cateIds.split(',');  //保存 提交的行业类别的筛选条件
          this.timeIdStatus = timelinessIds.split(','); //保存 提交的时效性的筛选条件
          /*this.marketIdStatus=markerIds.split(','); //保存 提交的板块类别的筛选条件*/
          this.markerStr = marketString.split(',');//保存 提交的板块类别的筛选条件
          this.hangyeStr = hangyeString.split(',');//保存 提交的行业类别的筛选条件
          this.yeahFlag = false; //点击确认按钮获取到内容后 yeahFlag开关关闭false
          //console.log('??????markerStr',this.markerStr,'marketStatus',this.marketStatus);
          //console.log('??????hangyeStr',this.hangyeStr,'hangyeStatus',this.hangyeStatus);
          if (res.data.returnCode == 1) {
            $(".ceshadow").hide();//加载中出现
            this.onloadOpen = true;//返回内容后 打开上滑加载的开关
            this.noInfoShow = false;//有筛选结果的提示页面消失
            if (res.data.returnObject.list == null || res.data.returnObject.list == []) {
              this.noInfoShow = true;
            } else {
              this.noInfoShow = false;//有筛选结果的提示页面消失
            }
            this.num = res.data.returnObject.count;
            if (this.num >= 30) {
              $('.showPrompt').css('display', "block")
              setTimeout(() => {
                $('.showPrompt').animate({bottom: "-10px", display: "none"});
              }, 2500);
            }
            //console.log('总共有多少条呢？--->', this.num)
            if (this.num <= 3 && this.searchscope !== 'content') {         //如果筛选的结果小于3条 显示提示高级搜索
              $('.seniorText').css('display', 'flex');
            } else if (3 < this.num < 1000) {
              $('.seniorText').css('display', 'none');
            } else if (this.num > 10) {
              $('.seniorText').css('display', 'none');
            }
            $(".ceshadow").hide();//加载中消失

            if (this.ruleslist.length > 0 && res.data.returnObject.list !== null) {
              for (var i in res.data.returnObject.list) {
                this.ruleslist.push(res.data.returnObject.list[i]);
              }
            } else if (this.ruleslist.length == 0 && res.data.returnObject.list !== null) {
              this.ruleslist = res.data.returnObject.list;
            } else {
              this.ruleslist = [];
            }
            this.rulesListNum = this.ruleslist.length;
            for (var i in this.ruleslist) {
              if (this.ruleslist[i].title.length >= 36) {
                this.ruleslist[i].title = this.ruleslist[i].title.substring(0, 35) + '...';
              }
            }
            /*this.$nextTick(() => {
                          this.divMaxHeight();
                        })*/
            //关闭当前栏目
            $(".search-mrpx").removeClass('pass')
            $(".showSearch1").hide();
            this.xianshi1 = false;
            $(".showSearch2").hide();
            this.xianshi2 = false;
            $(".showSearch").hide();
            this.xianshi = false;
            this.popupVisible1 = false;
            /* $(".shadow").hide();*/
            /*筛选按钮红点状态显示*/
            var stausArr = [];
            stausArr.push(this.value0);
            stausArr.push(this.value1);
            stausArr.push(this.value2);
            stausArr.push(this.value3);
            stausArr.push(this.dateStart);
            stausArr.push(this.dateEnd);
            for (var i = 0; i < stausArr.length; i++) {
              if (stausArr[i].length == 0 || stausArr[i] == '') {
                $(".redCircle").hide();
              } else if (stausArr[i].length !== 0) {    // && this.frontStatus== false  加上这个条件是区别正面筛选条件和侧边栏筛选条件
                $(".redCircle").show();
                return;
              }
            }
            $(".searchBox").css('display', 'flex')
            // 加载完成以后显示筛选栏
            if (this.bottom >= 30) {
              /*console.log(this.bottom, 'this.bottom', this.num, 'this.num')*/
              $(".searchBox").css('display', 'flex')
            } else {
              $(".searchBox").css('display', 'flex')//none
            }

          } else if (res.data.returnCode == -1) {
            $(".ceshadow").hide();//加载中消失
            //关闭当前栏目
            $(".search-mrpx").removeClass('pass')
            $(".showSearch1").hide();
            this.xianshi1 = false;
            $(".showSearch2").hide();
            this.xianshi2 = false;
            $(".showSearch").hide();
            this.xianshi = false;
            this.popupVisible1 = false;
            /* $(".shadow").hide();*/
            this.noInfoShow = true;//没有筛选结果的提示页面显示
            $('.seniorText').css('display', 'none'); // "flex"  6.1版本苹果机上 文字提示信息 上拉出现bug
            this.num = 0;
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
          //this.noInfoShow500 = true;//网络错误的提示页面显示
        })
        //同步筛选栏 公告类别-行业类别 数据
        this.popupVisible1 = false;
        /*console.log('公告类别数组---', this.value1)*/
        var showText = $(".showSearch1").find('.bbb');
        for (var i = 0; i < this.value1.length; i++) {
          for (var j = 0; j < showText.length; j++) {
            if (this.value1[i] == showText.eq(j).text()) {
              showText.eq(j).parent().find('.aaa').addClass('selected').attr('select', 'false')
            }
          }
        }
        var trueArr = [];
        for (var i = 0; i < showText.length; i++) {
          if (showText.eq(i).parent().find('.aaa').attr('select') == 'false') {
            trueArr.push(showText.eq(i).text())
          }
        }
        var a1 = this.value1;
        var a2 = trueArr;
        var shao = [];
        var duo = [];
        var hebing = a1.concat(a2);
        hebing.sort();
        hebing.reverse();
        var quchong = $.unique(hebing);

        quchong.forEach(function (qitem, index, array) {
          if (a1.every(function (item, qindex, array) {
            return qitem != item;
          })) {
            duo.push(qitem);
          }
          if (a2.every(function (item, qindex, array) {
            return qitem != item;
          })) {
            shao.push(qitem);
          }
        });
        for (var i = 0; i < showText.length; i++) {
          for (var j = 0; j < duo.length; j++) {
            if (showText.eq(i).text() == duo[j]) {
              showText.eq(i).parent().find('.aaa').removeClass('selected').attr('select', 'true');
            }
          }
        }
        var guizeText = $(".showSearch2").find('.bbb');
        for (var i = 0; i < this.value2.length; i++) {
          for (var j = 0; j < guizeText.length; j++) {
            if (this.value2[i] == guizeText.eq(j).text()) {
              guizeText.eq(j).parent().find('.aaa').addClass('selected').attr('select', 'false')
            }
          }
        }
        var trueArr2 = [];            //侧边栏 行业类别属性select=false选中的数组
        for (var i = 0; i < guizeText.length; i++) {
          //console.log('侧边栏板块类别', guizeText.eq(i).parent().find('.aaa').attr('select'), guizeText.eq(i).parent().find('.aaa').text())
          if (guizeText.eq(i).parent().find('.aaa').attr('select') == 'false') {
            trueArr2.push(guizeText.eq(i).text())
          }
        }
        var a3 = this.value2;
        var a4 = trueArr2;
        var shao1 = [];
        var duo1 = [];
        var hebing1 = a3.concat(a4);
        hebing1.sort();
        hebing1.reverse();
        var quchong1 = $.unique(hebing1);
//        console.info(a3);
//        console.info(a4);
//        console.info(quchong1);
        quchong1.forEach(function (qitem, index, array) {
          if (a3.every(function (item, qindex, array) {
            return qitem != item;
          })) {
            duo1.push(qitem)
          }
          if (a4.every(function (item, qindex, array) {
            return qitem != item;
          })) {
            shao1.push(qitem)
          }
        });
        //console.info("-*-----a4比a3多的元素" + duo1, "-*-----少的元素" + shao1);
        for (var i = 0; i < guizeText.length; i++) {        //多余的数组元素 去掉选中状态
          for (var j = 0; j < duo1.length; j++) {
            if (guizeText.eq(i).text() == duo1[j]) {
              guizeText.eq(i).parent().find('.aaa').removeClass('selected').attr('select', 'true');
            }
          }
        }
      },
      contentIncludesText() {
        if (this.contentIncludes.trim().length === 0) {
          console.log("必填");
        } else {
          document.querySelector(".smx_item").style.display = 'block';
          console.log("1461" + this.keys + this.titleIncludes + this.titleMaybeIncludes + this.titleExcludes);
          console.log("全文,精确");
          ////
          if (this.contentIncludes.trim().indexOf(" ") !== -1) {
            console.log("全文必包含" + "有空格");
            var contIn = this.contentIncludes.split(" ");
            this.ImpArr(contIn);
            this.contentIncludes = contIn.join(",");
            console.log('点击确认前的this.contentIncludes', this.contentIncludes);
          }
          ////
          if (this.contentMaybeIncludes.trim().indexOf(" ") !== -1) {
            console.log("全文可能包含" + "有空格");
            var contMaBe = this.contentMaybeIncludes.split(" ");
            this.ImpArr(contMaBe);
            this.contentMaybeIncludes = contMaBe.join(",");
            console.log(this.contentMaybeIncludes);
          }
          //////
          if (this.contentExcludes.trim().indexOf(" ") !== -1) {
            console.log("全文不包含" + "有空格");
            var contEx = this.contentExcludes.split(" ");
            this.ImpArr(contEx);
            this.contentExcludes = contEx.join(",");
            console.log(this.contentExcludes);
          }
          this.titleExcludes = this.contentExcludes;
          console.log(this.titleExcludes);
          this.titleMaybeIncludes = this.contentMaybeIncludes;
          console.log(this.titleMaybeIncludes);
        }
      },
      show() {    //控制 默认排序筛选栏 显示隐藏
        console.log('筛选条件---------->', this.hangyeStatus);
        if (this.xianshi == true) {
          this.xianshi = false
          $(".showSearch").hide();
          $(".search3").css('border-left', '0.5px solid #e3e3e3')
        } else if (this.xianshi == false) {
          this.xianshi = true;
          this.xianshi1 = false;
          this.xianshi2 = false;
          var showHei = ($('body').outerHeight()) - ($('.searchs').outerHeight()) - ($('.searchBox').outerHeight()) + 'px'
          $(".showSearch").height(showHei).show();
          $(".showSearch1").hide();  //隐藏公告类别
          $(".showSearch2").hide();   //隐藏行业类别
          $(".search3").css('border', '0')
          $(".search4").css('border-left', '0.5px solid #e3e3e3')
          var user = "";
          if (/android/i.test(navigator.userAgent)) {
            user = "1";//  android
            $(".bottomBox").css('bottom', '9px')
            $(".sxFooter").css('bottom', '9px')
          }
        }
        console.log(this.xianshi);
        $('.itembox .item:last-child').find('.itemHline').hide();
        console.log('--][][][][]此时this.selectItems[0].item[1]', this.selectItems[0].item[0], this.selectItems[0].item[0].length)
        if ((this.selectItems[0].item[0]).length % 2 !== 0) {
          $('.showSearch .item').css('width', '50%')
          $('.showSearch .item:last-child').css('width', '100%')
        } else {
          $('.showSearch .item').css('width', '50%')
        }
      },
      show2() {        //控制 行业类别筛选栏  显示隐藏
        if (this.xianshi2 == true) {
          this.xianshi2 = false;
          $(".showSearch2").hide();
          $(".search3").css('border-left', '0.5px solid #e3e3e3')
          $(".search4").css('border-left', '0.5px solid #e3e3e3')
        } else if (this.xianshi2 == false) {
          this.xianshi2 = true;
          this.xianshi = false;
          this.xianshi1 = false;
          var showHei = ($('body').outerHeight()) - ($('.searchs').outerHeight()) - ($('.searchBox').outerHeight()) + 'px'
          $(".showSearch2").height(showHei).show();  //发文单位筛选条件显示  默认排序规则类别筛选条件隐藏
          $(".showSearch").hide();    // 隐藏默认排序
          $(".showSearch1").hide();   //隐藏公告类别
          $(".search4").css('border-left', '0')
          var user = "";
          if (/android/i.test(navigator.userAgent)) {
            user = "1";//  android
            $(".bottomBox").css('bottom', '9px')
            $(".sxFooter").css('bottom', '9px')
          }
        }
        $('.itembox .item:last-child').find('.itemHline').hide();
        if ((this.sxlistItem[2].item[0]).length % 2 !== 0) {
          $('.showSearch2 .item').css('width', '50%')
          $('.showSearch2 .item:last-child').css('width', '100%')
        } else {
          $('.showSearch2 .item').css('width', '50%')
        }
      },
//+++++++++++++++++++++++++++++++++++++++++//
      //高级默认状态
      sea() {
        if ($('.rangeBtn div .colorBtn').text() === '标题' && $('.rangeBtn_2 div .colorBtn').text() === '精确') {
          $(".titleTip1").hide();
          /*this.sw = 0;*/
          $('.searchCont').css('color', '#8d8d8d');
          $('.serachCont input').css("border-color", "#8d8d8d");
          $('.serachCont').css('opacity', '0.5');
          $('.serachCont .inputCont').attr('disabled', true);
          $('.serachTitle').css('opacity', '1');
          $('.serachTitle .inputTil').attr('disabled', false);
          $(".rangeBtn4").addClass("rangeBtnHide");
          $('.serachTitle input').css("border-color", "#8d8d8d");
        }
      },
      //标题
      sea1() {
        this.searchscope = 'title';
        this.searchtype = '';//exact
        let colorBtn2 = $('.rangeBtn_2 div .colorBtn');
        //console.log($('.rangeBtn div .colorBtn').text());
        //console.log(colorBtn2.text());
        $(".titleTip1").hide();
        if (colorBtn2.text() == '精确') {
          this.keys = '';
          this.searchscope = 'title';
          if (this.contentIncludes.trim().length !== 0) {
            this.titleIncludes = this.contentIncludes;
          }
          if (this.contentMaybeIncludes.trim().length !== 0) {
            this.titleMaybeIncludes = this.contentMaybeIncludes;
          }
          if (this.contentExcludes.trim().length !== 0) {
            this.titleExcludes = this.contentExcludes;
          }
          this.keys = '';
          $('.serachTitle input').css("border-color", "#8d8d8d");
          $('.serachCont input').css("border-color", "#8d8d8d");
          $('.searchCont').css('color', '#8d8d8d');
          $('.rangeBtn1').addClass('colorBtn');
          $('.rangeBtn2').removeClass('colorBtn');

          $('.serachCont').css('opacity', '0.5');
          $('.serachCont .inputCont').attr('disabled', true);
          $('.serachTitle').css('opacity', '1');
          $('.serachTitle .inputTil').attr('disabled', false);
          $(".rangeBtn4").addClass("rangeBtnHide");
          /**/
          this.contentIncludes = "";
          this.contentMaybeIncludes = "";
          this.contentExcludes = "";
          /**/
        } else if (colorBtn2.text() == '模糊') {
          this.searchscope = 'title';
          if (this.contentIncludes.trim().length !== 0) {
            this.titleIncludes = this.contentIncludes;
          } else {
            var titleIncludes = this.Newarr.join(" ");
            this.titleIncludes = titleIncludes;
          }
          this.keys = "";
          $(".rangeBtn4").addClass("rangeBtnHide");
          $('.rangeBtn1').addClass('colorBtn');
          $('.rangeBtn2').removeClass('colorBtn');
          $('.rangeBtn3').addClass('colorBtn');
          $('.rangeBtn4').removeClass('colorBtn');
          $('.serachTitle').css('opacity', '1');
          $('.serachTitle .inputTil').attr('disabled', false);
          $('.serachCont').css('opacity', '0.5');
          $('.serachCont .inputCont').attr('disabled', true);
        }
      },
      //全文
      sea2() {
        this.searchscope = 'content';
        this.keys = '';
        let colorBtn2 = $('.rangeBtn_2 div .colorBtn');
        $('.rangeBtn2').addClass('colorBtn');
        $('.rangeBtn1').removeClass('colorBtn');
        if (colorBtn2.text() == '精确' || this.gaojiJQ == true) {
          this.keys = '';
          if (this.titleIncludes.trim().length !== 0) {
            this.contentIncludes = this.titleIncludes;
          }
          this.titleIncludes = '';//标题必须包含
          this.titleMaybeIncludes = ""; //标题可能包含
          this.titleExcludes = ""; //标题不包含
          this.keys = '';
          $('.searchTitle').css('color', '#8d8d8d');
          $(".rangeBtn4").removeClass("rangeBtnHide");
          $('.serachCont').css('opacity', '1');
          $('.serachCont .inputCont').attr('disabled', false);
          $('.serachTitle').css('opacity', '0.5');
          $('.serachTitle .inputTil').attr('disabled', true);
          document.querySelector('.smx_item').style.display = 'block';
        } else if (colorBtn2.text() == '模糊') {
          $('.searchTitle').css('color', '#8d8d8d');
          $('.searchCont').css('color', '#8d8d8d');
          $(".rangeBtn4").removeClass("rangeBtnHide");
          $('.serachCont').css('opacity', '0.5');
          $('.serachCont .inputCont').attr('disabled', true);
          $('.serachTitle').css('opacity', '0.5');
          $('.serachTitle .inputTil').attr('disabled', true);
          $('.serachTitle input').css("border-color", "#8d8d8d");
          $('.serachCont input').css("border-color", "#8d8d8d");
        }
      },
      sea3() {
        let colorBtn = $('.rangeBtn div .colorBtn');
        $('.rangeBtn3').addClass('colorBtn');
        $('.rangeBtn4').removeClass('colorBtn');
        this.searchtype = 'exact';
        console.log(colorBtn.text());
        console.log($('.rangeBtn_2 div .colorBtn').text());
        if (colorBtn.text() == '标题') {
          this.keys = '';
          var nsw = this.Newarr.join(" ");
          this.titleIncludes = nsw;
          $('.searchCont').css('color', '#8d8d8d');
          $('.serachCont').css('opacity', '0.5');
          $('.serachCont .inputCont').attr('disabled', true);
          $('.serachTitle').css('opacity', '1');
          $('.serachTitle .inputTil').attr('disabled', false);
          $('.serachTitle input').css("border-color", "#8d8d8d");
          $('.serachCont input').css("border-color", "#8d8d8d");
        } else if (colorBtn.text() == '全文') {
          this.keys = '';
          var nsw = this.Newarr.join(" ");
          this.contentIncludes = nsw;
          this.titleIncludes = '';//标题必须包含
          this.titleMaybeIncludes = ""; //标题可能包含
          this.titleExcludes = ""; //标题不包含
          this.keys = '';
          $('.searchTitle').css('color', '#8d8d8d');
          $(".rangeBtn4").removeClass("rangeBtnHide");
          $('.serachCont').css('opacity', '1');
          $('.serachCont .inputCont').attr('disabled', false);
          $('.serachTitle').css('opacity', '0.5');
          $('.serachTitle .inputTil').attr('disabled', true);
          $('.serachTitle input').css("border-color", "#8d8d8d");
          $('.serachCont input').css("border-color", "#8d8d8d");
        }
      },
      sea4() {
        let colorBtn = $('.rangeBtn div .colorBtn');
        this.searchtype = 'like';
        console.log(colorBtn.text());
        console.log($('.rangeBtn_2 div .colorBtn').text());
        $(".titleTip").hide();
        $(".titleTip1").hide();
        if (colorBtn.text() === '全文') {
          $('.rangeBtn4').addClass('colorBtn');
          $(".rangeBtn4").removeClass("rangeBtnHide");
          $('.rangeBtn3').removeClass('colorBtn');
          this.sw = 1;
          this.matter();
          $('.serachCont').css('opacity', '0.5');
          $('.serachCont .inputCont').attr('disabled', true);
          $('.serachTitle').css('opacity', '0.5');
          $('.serachTitle .inputTil').attr('disabled', true);
          this.titleIncludes = '';
          this.contentIncludes = "";
          this.titleMaybeIncludes = ""; //标题可能包含
          this.titleExcludes = ""; //标题不包含
          this.contentMaybeIncludes = "";
          this.contentExcludes = "";
          $('.serachTitle input').css("border-color", "#8d8d8d");
          $('.serachCont input').css("border-color", "#8d8d8d");
        } else if (colorBtn.text() === '标题') {
          $('.serachCont').css('opacity', '0.5');
          $('.serachCont .inputCont').attr('disabled', true);
          $('.serachTitle').css('opacity', '1');
          $('.serachTitle .inputTil').attr('disabled', false);
          $('.serachTitle input').css("border-color", "#8d8d8d");
          $('.serachCont input').css("border-color", "#8d8d8d");
        }
      },
      //高级的确认提交
      searchMany() {
        this.ruleslist = [];
        this.top = 1;
        $(".ceshadow").show();//加载中出现
        var topBtn = $('.rangeBtn div .colorBtn').text();
        var buttonBtn = $('.rangeBtn_2 div .colorBtn').text();
        //////
        if (topBtn === '标题' && buttonBtn === '精确') {
          //console.log("标题,精确：" + this.titleIncludes);
          if (this.titleIncludes.trim().length === 0) {
            //console.log("必须包含项必填");
          } else {
            if (this.titleMaybeIncludes.trim().length !== 0 || this.titleExcludes.trim().length !== 0) {
              document.querySelector('.smx_item').style.display = 'block';
            }
            if (this.titleIncludes.trim() !== this.$route.query.inputVal) {
              document.querySelector('.smx_item').style.display = 'block';
            } else {
              document.querySelector('.smx_item').style.display = 'none';
            }
            if (this.titleIncludes.trim().indexOf(" ") !== -1 || this.titleMaybeIncludes.trim().indexOf(" ") !== -1 || this.titleExcludes.trim().indexOf(" ") !== -1) {
              //console.log("有空格" + "三个都不符合");
              ////转换成数组后去除空元素在用逗号拼接
              var tilIn = this.titleIncludes.split(' ');
              this.ImpArr(tilIn);
              this.titleIncludes = tilIn.join(",");
              //console.log(this.titleIncludes);
              //转换成数组后去除空元素在用逗号拼接
              var tilMaBe = this.titleMaybeIncludes.split(" ");
              this.ImpArr(tilMaBe);
              this.titleMaybeIncludes = tilMaBe.join(",");
              //console.log(this.titleMaybeIncludes);
              //转换成数组后去除空元素在用逗号拼接
              var tilEx = this.titleExcludes.split(" ");
              this.ImpArr(tilEx);
              this.titleExcludes = tilEx.join(',');
              //console.log(this.titleExcludes);

              this.popupVisible = false;
              /*document.querySelector('.showOp').style.display = 'none';*/
              this.Newarr = [];
              this.Newarr = this.titleIncludes.split(',');//转数组
              //console.log(this.Newarr);
              this.yeah();
            } else {
              //console.log("三个有一个符合就执行");
              this.titleMaybeIncludes = this.titleMaybeIncludes.split(" ").join(",");
              //console.log(this.titleMaybeIncludes);

              this.titleExcludes = this.titleExcludes.split(" ").join(",");
              //console.log(this.titleExcludes);

              if (this.titleIncludes.trim().indexOf(" ") !== -1) {
                this.Newarr = [];
                this.titleIncludes = this.titleIncludes.split(' ');
                this.Newarr = this.titleIncludes;
                //console.log("1435" + this.titleIncludes);
              } else {
                this.Newarr = [];
                this.Newarr.unshift(this.titleIncludes);
              }
              //console.log(this.Newarr);
              //console.log("有标题：" + this.titleIncludes);
              this.yeah();
              this.popupVisible = false;
              /*document.querySelector('.showOp').style.display = 'none';*/
            }
          }
          //全文\模糊\触发
          //
        } else if (topBtn === '全文' && buttonBtn === '模糊') {
          document.querySelector(".smx_item").style.display = 'block';
          //console.log("全文,模糊" + this.titleIncludes);
          this.keys = this.$route.query.inputVal;
          this.titleIncludes = '';
          //console.log("值" + this.keys);
          this.yeah();
          this.popupVisible = false;
          //全文\精确\触发
        } else if (topBtn === '全文' && buttonBtn === '精确') {
          if (this.contentIncludes.trim().length === 0) {
            //console.log("必填");
          } else {
            document.querySelector(".smx_item").style.display = 'block';
            //console.log("1461" + this.keys + this.titleIncludes + this.titleMaybeIncludes + this.titleExcludes);
            //console.log("全文,精确", this.contentIncludes);//
            //this.contentIncludes=this.titleIncludes;
            ////
            if (this.contentIncludes.trim().indexOf(" ") !== -1) {
              //console.log("全文必包含" + "有空格");
              var contIn = this.contentIncludes.split(" ");
              this.ImpArr(contIn);
              this.contentIncludes = contIn.join(",");
              this.Newarr = [];
              this.Newarr = this.contentIncludes.split(',');//转数组
              //console.log('点击确认前的this.contentIncludes', this.contentIncludes);
            }
            ////
            if (this.contentMaybeIncludes.trim().indexOf(" ") !== -1) {
              //console.log("全文可能包含" + "有空格");
              var contMaBe = this.contentMaybeIncludes.split(" ");
              this.ImpArr(contMaBe);
              this.contentMaybeIncludes = contMaBe.join(",");
              //console.log(this.contentMaybeIncludes);
            }
            //////
            if (this.contentExcludes.trim().indexOf(" ") !== -1) {
              //console.log("全文不包含" + "有空格");
              var contEx = this.contentExcludes.split(" ");
              this.ImpArr(contEx);
              this.contentExcludes = contEx.join(",");
              //console.log(this.contentExcludes);
            }
            /////
            this.titleExcludes = this.contentExcludes;
            //console.log(this.titleExcludes);
            this.titleMaybeIncludes = this.contentMaybeIncludes;
            //console.log(this.titleMaybeIncludes);
            /* this.titleIncludes = this.contentIncludes;*/
            this.yeah();
            this.popupVisible = false;
            /*document.querySelector('.showOp').style.display = 'none';*/
          }
        }
        /************************************************************************/
      },
      //去除空数组
      ImpArr(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === "" || typeof(array[i]) === "undefined") {
            array.splice(i, 1);
            i = i - 1;
          }
        }
      },
      //高级里的重置
      goReset() {
        $('.rangeBtn1').addClass('colorBtn');
        $('.rangeBtn2').removeClass('colorBtn');
        $('.rangeBtn3').addClass('colorBtn');
        $('.rangeBtn4').removeClass('colorBtn');
        this.sea();
        this.sw = 0;
        this.matter();
        this.titleIncludes = this.$route.query.inputVal; //标题包含
        this.titleMaybeIncludes = ""; //标题可能包含
        this.titleExcludes = ""; //标题不包含
        this.contentIncludes = "";
        this.contentMaybeIncludes = "";
        this.contentExcludes = "";
        document.querySelector('.smx_item').style.display = 'none';
      },
      //高级里的input显示隐藏
      matter() {
        if (this.sw == 0) {
          document.querySelector('.rulesMatter').style.display = 'block';
          this.sw++
        } else if (this.sw != 0) {
          this.sw = 0;
          document.querySelector('.rulesMatter').style.display = 'none';
        }
      },
      //高级显示
      popupShow() {
        /* this.searchscope = 'title';*/
        console.log(window.screen.height);
        var couHeight = window.screen.height - 120;
        //alert(couHeight);
        var contop = couHeight / window.screen.height * 100;
        $(".rangeGkipt").css('height', contop + "%");
        this.popupVisible = true;
        /* document.querySelector('.showOp').style.display = 'block';*/
        console.log(this.titleIncludes);
        if (Array.isArray(this.titleIncludes)) {
          console.log('是数组');
          this.titleIncludes = this.titleIncludes.join(" ");
        } else if (this.titleIncludes.indexOf(",") !== -1) {
          console.log("有逗号");
          var arr = this.titleIncludes.split(',').join(" ");
          this.titleIncludes = arr;
          console.log(arr);
          console.log(this.titleIncludes);
        } else {
          console.log("没逗号");
        }
        //标题可能包含
        if (this.titleMaybeIncludes.indexOf(",") !== -1) {
          this.titleMaybeIncludes = this.titleMaybeIncludes.split(",").join(" ");
        }
        //标题不包含
        if (this.titleExcludes.indexOf("," !== -1)) {
          this.titleExcludes = this.titleExcludes.split(",").join(" ");
        }
        //正文必须包含
        if (this.contentIncludes.indexOf("," !== -1)) {
          this.contentIncludes = this.contentIncludes.split(",").join(" ");
        }
        //正文可能包含
        if (this.contentMaybeIncludes.indexOf("," !== -1)) {
          this.contentMaybeIncludes = this.contentMaybeIncludes.split(",").join(" ");
        }
        //正文不包含
        if (this.contentExcludes.indexOf("," !== -1)) {
          this.contentExcludes = this.contentExcludes.split(",").join(" ");
        }

        if (this.searchscope == 'content') {
          console.log('-----------------------', this.searchscope)
          $(".rangeBtn1").removeClass('colorBtn')
          $(".rangeBtn2").addClass('colorBtn')
          document.querySelector('.smx_item').style.display = 'block';
        } else if (this.searchscope == 'title') {
          $(".rangeBtn2").removeClass('colorBtn')
          $(".rangeBtn1").addClass('colorBtn')
          document.querySelector('.smx_item').style.display = 'none';
        }
        if (this.searchtype == 'like') {
          $(".rangeBtn1").removeClass('colorBtn')
          $(".rangeBtn2").addClass('colorBtn')
          //document.querySelector('.smx_item').style.display = 'block';
        } else if (this.searchtype == 'exact') {
          this.sea2();
          $(".rangeBtn2").addClass('colorBtn')
          $(".rangeBtn1").removeClass('colorBtn')
          // document.querySelector('.smx_item').style.display = 'none';
        }

      },
      //高级隐藏
      popupHide() {
        this.popupVisible = false;
      },
      /**************************************************/
      goCount(index) {
        window.sessionStorage.setItem("afficheContentId", this.ruleslist[index].mainId);
        /* this.$router.push({path:"/afficheContent"});*/
        this.$router.push({path: '/afficheContent', query: {id: this.ruleslist[index].mainId}});
        window.localStorage.setItem("板块类别", this.value0);
        window.localStorage.setItem("行业类别", this.value2);
        window.localStorage.setItem("dateEnd", this.dateEnd);//结束时间
        window.localStorage.setItem("dateStart", this.dateStart);//开始时间
        console.log('--------------->', this.searchscope)
        if (this.searchscope == 'content') {
          window.localStorage.setItem("全文", 'content');
        }
        if (this.searchtype == 'like') {
          window.localStorage.setItem("模糊", 'like');
        }
      },
      searchClose(index) {
        if (this.Newarr.length > 1) {
          if (isNaN(index) || index >= this.Newarr.length) {
            return false;
          }
          for (var i = 0, n = 0; i < this.Newarr.length; i++) {
            if (this.Newarr[i] != this.Newarr[index]) {
              this.Newarr[n++] = this.Newarr[i];
            }
          }
          this.Newarr.length -= 1;
          console.log("还有：" + this.Newarr);
          var neway = this.Newarr.join(",");
          this.titleIncludes = neway;
          console.log(this.titleIncludes);
          this.ruleslist = [];
          this.yeah();
        } else {
          console.log('证券代码/简称---》', this.titleCompanyCode)
          if (this.titleCompanyCode !== undefined) {
            this.$router.push({path: '/afficheSearch', query: {code: this.titleCompanyCode}});
          } else {
            this.$router.push({path: '/afficheSearch'});
          }

        }
      },
      searchPro() {
      },
      //点击返回搜索页面
      goSearch() {
        this.$router.push({path: '/afficheSearch', query: {valuess: this.titleIncludes, code: this.titleCompanyCode}});
      },
      goSearchCode() {
        this.$router.push({
          path: '/afficheSearch',
          query: {valuess: this.titleIncludes, code: this.titleCompanyCode, inputCode: 1}
        });
      }
    }
  }
</script>

<style>
  input[type="date"]::-webkit-clear-button {
    display: none;
  }
  #affiche .listGroup {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  #affiche .mint-spinner-snake {
    display: inline-block;
    vertical-align: middle;
    border: 2px solid transparent;
    border-top-color: rgb(252, 199, 127) !important;
    border-left-color: rgb(252, 199, 127) !important;
    border-bottom-color: rgb(252, 199, 127) !important;
    height: 14px !important;
    width: 14px !important;
    -webkit-animation: mint-spinner-rotate 0.8s infinite linear !important;
    animation: mint-spinner-rotate 0.8s infinite linear !important;
    border-radius: 50%;
  }
  #affiche .snake {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #535353;
    height: 50px;
    box-sizing: border-box;
    text-align: center;
  }
  .anList div > span > span > span {
    margin-right: 0 !important;
  }

</style>

<style scoped lang="scss">
  .xiaoan-box.affiche-search-list {
    padding-bottom: 50px;
    position: relative;
    .affiche-search-list-scroll {
      height: 100%;
      width: 100%;
      overflow: hidden;
      background-color: #FFFFFF;
    }
  }
  .ExpertScroll {
    top: 52px !important;
    height: 83.8% !important;
  }
  .show {
    display: block !important;
  }
  ._listCloo {
    height: 100% !important;
  }
  .ruleslist {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .search {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  .searchs {
    width: 100%;
    height: 50px;
    background: #f0f1f5;
    padding: 7.5px 12px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ruleslist .seabox {
    width: 52%;
    height: 100%;
    position: relative;
    background: white;
    border-radius: 2px;
    overflow: hidden;
  }
  .ruleslist .SIMbox {
    width: 33%;
    height: 100%;
    background: white;
    position: relative;
    border-radius: 2px;
  }
  .ruleslist .SIMbox input, .ruleslist .seabox input {
    width: 100%;
    height: 100%;
    background: #fff;
    color: #8d8d8d;
    display: inline-block;
    box-sizing: border-box;
    -webkit-appearance: none;
    border-radius: 2px;
    border: 0;
    font-size: 15px;
    padding: 8px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .goSearch .rulesNum {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #8d8d8d;
    font-size: 12px;
    font-weight: normal;
  }
  .listGroup { /*//内容div父元素*/
    height: 92%; /*background: red;*/
    overflow: scroll;
    position: relative;
    .firstItem {
      background-color: #F1F0F5;
      border-radius:2px;
      padding: 0 3px;
      color: #8D8D8D;
    }
  }
  .noInfo {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    padding: 0 12.5px;
    box-sizing: border-box;
    background: #fff;
  }
  .trySenior {
    position: absolute;
    left: 0;
    top: 100px;
    right: 0;
    margin: auto;
    width: 262px;
    height: 125px;
    display: none;
    text-align: center;
  }
  .trySenior img {
    display: block;
    width: 110px;
    height: 95px;
    margin: 0 auto 25px;
  }
  .seniorButton {
    background: #ffb148;
    position: absolute;
    left: 0;
    top: 175px;
    right: 0;
    margin: auto;
    width: 90px;
    height: 30px;
    border-radius: 2px;
    font-size: 15px;
    color: #fff;
    line-height: 30px;
  }
  .trytext {
    font-size: 15px;
    color: #ffb148;
    margin-left: -12.5px;
  }
  .trytext.text {
    text-decoration: none;
    border-bottom: 0.5px solid;
  }
  .tryimg {
    width: 8px;
    height: 14px;
    display: inline-block;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/rightOrange.png");
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: -2px;
    margin-left: 10px;
  }
  .anList {
    width: 100%;
    padding: 0 12px;
    font-size: 15px;
    color: #323232;
    line-height: 18px;
    letter-spacing: 0.2px;
    display: flex;
    align-items: center;
    .anListState {
      font-size: 12px;
      padding: 10px 0 10px 0;
      color: #8d8d8d;
      .content-text {
        font-size: 15px;
        color: #323232;
      }
    }
  }
  #affiche .seniorText {
    width: 100%;
    height: 70px;
    display: none;
    align-items: center;
    justify-content: center;
    border-bottom: 0;
  }
  #affiche .anList:active {
    background-color: #f0f1f5;
  }
  .textbox {
    width: 100%;
    height: 100%;
    border-bottom: 0.5px solid #e3e3e3;
    box-sizing: border-box;
    display: flex;
    align-items: center;
  }
  .anListName {
    font-size: 15px;
    font-weight: 600;
    background-color: white;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    /*font-family: " PingFangSC-Medium, sans-serif", Microsoft Yahei, Helvetica;*/
    position: relative;
    width: 100%;
    min-height: 40px;
    line-height: 19px;
  }
  .anListName .anListNum {
    position: absolute;
    right: 0;
    bottom: 0;
    font-size: 14px;
    color: #8d8d8d;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-weight: normal;
  }
  .anList p {
    margin: 0;
    padding: 0;
    margin-right: 0.5px;
    display: inline-block;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 12px;
    color: #ababab;
  }
  .anListState {
  }
  .mint-popup-3 {
    z-index: 3400 !important;
    width: 72%;
    height: 100%;
    background-color: #fff;
    border-left: 0.5px solid #e3e3e3;
    box-shadow: 4px 2px 2px 1px #B9ADAD;
  }
  .mint-popup-3 .expert_g img {
    height: 15px;
    padding: 0;
    margin: 0;
  }
  .rulExpert .expert_D img {
    height: 15px;
    padding: 17px 0 17px 12px;
    position: fixed;
    top: 0;
    left: 0;
  }
  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/
  .rulExpert {
    height: 45px;
    border-bottom: 0.5px solid #e3e3e3;
    text-align: center;
    line-height: 45px;
    position: relative;
  }
  .rulExpert span {
    color: #535353;
    font-size: 15px;
  }
  .range {
    height: 35px;
    line-height: 35px;
    padding: 0 12px;
    font-size: 15px;
    color: #535353;
    margin-top: 5px;
  }
  .rangeBtn, .rangeBtn_2 {
    height: 25px;
    padding: 0 12px;
  }
  .rangeBtn div, .rangeBtn_2 div {
    width: 50%;
    float: left;
  }
  .rangeBtn button, .rangeBtn_2 button {
    height: 25px;
    width: 60px;
    border: 0;
    border-radius: 2px;
    font-size: 14px;
    background-color: #f0f1f5;
    color: #8d8d8d;
    outline: none;
  }
  .rangeBtn div .rangeBtn1 {
    float: right;
    margin-right: 10px;
  }
  .rangeBtn_2 div .rangeBtn3 {
    float: right !important;
    margin-right: 10px !important;
  }
  .colorBtn {
    background-color: #fef3e4 !important;
    color: #ffb148 !important;
  }
  .rangeBtn div .rangeBtn2, .rangeBtn_2 div .rangeBtn4 {
    margin-left: 10px;
  }
  .rangeMoregl {
    padding: 12.5px 12px;
  }
  .rangeMore {
    height: 33px;
    border-bottom: 0.5px solid #e3e3e3;
    border-top: 0.5px solid #e3e3e3;
    line-height: 33px;
    color: #535353;
    font-size: 14px;
  }
  .rangeMoreTop {
    float: right;
  }
  .rangeMoreButton {
    float: right;
  }
  .searchTitle, .searchCont {
    color: #535353;
    padding-bottom: 5px;
    display: inline-block;
    font-size: 14px;
  }
  .serachTitle, .serachCont {
    padding: 0 12px;
    display: inline-block;
    font-size: 14px;
  }
  .serachTitle input, .serachCont input {
    -webkit-appearance: none;
    outline: none;
    border: 0.5px solid #e3e3e3;
    border-radius: 2px;
    height: 25px;
    margin: 5px 0 5px 5px;
    width: 140px;
    padding: 0 10px;
    box-sizing: border-box;
    color: #8d8d8d;
  }
  .inputA, .inputB, .inputC {
    float: right;
    color: #8d8d8d;
  }
  .footBtn {
    height: 50px;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 0.5px solid #e3e3e3;
    width: 100%;
    font-size: 0;
  }
  .footBtn button {
    width: 50%;
    height: 50px;
    border: 0;
    color: #ffb148;
    background-color: white;
    outline: none;
    font-size: 18px;
    border-radius: 0px;
  }
  .footBtn button:active {
    background-color: #ffb148;
    color: white;
  }
  .footBtn button + button {
    color: white;
    background-color: #ffb148;
  }
  .footBtn button + button:active {
    color: #ffb148;
    background-color: white;
  }
  .showOp {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 3334;
    display: none;
    border-radius: 0;
    border: 0;
  }
  .rulesMatter {
    display: none;
  }
  /******************************************************************************************/
  .searchBox {
    width: 100%;
    height: 40px;
    border-bottom: 0.5px solid #e3e3e3;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;
    position: relative;
    z-index: 200;
    background-color: white;
  }
  .search-s {
    width: 76.6667%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-s .search-mrpx {
    width: 50%;
    height: 14px;
    text-align: center;
    line-height: 14px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #535353;
    border-left: 0.5px solid #e3e3e3;
  }
  /*筛选以及筛选弹出框*/
  .search-sx {
    width: 33.33%;
    height: 14px;
    line-height: 14px;
    text-align: center;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #535353;
    border-left: 0.5px solid #e3e3e3;
    border-right: 0.5px solid #e3e3e3; /*overflow: hidden;*/
  }
  .redCircle {
    width: 8px;
    height: 8px;
    background: #fb4319;
    border-radius: 50%;
    position: absolute;
    right: 28px;
    top: -5px;
    z-index: 1000;
    display: none;
  }
  .search-sx .expert_s {
    -webkit-appearance: none;
    font-size: 15px;
    color: #535353;
    background-color: white;
    border: 0;
    box-shadow: none;
    border-radius: 0;
    letter-spacing: 0;
    padding: 0;
    padding-top: -5px;
    margin-top: -7px;
    height: auto;
  }
  .closeShaixuan {
    width: 15px !important;
    height: 15px !important;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/x.jpg");
    background-size: contain;
    background-repeat: no-repeat;
    background-color: white;
  }
  .sxHeader {
    width: 100%;
    height: 45px;
    border-bottom: 0.5px solid #e3e3e3;
    position: relative;
  }
  .sxHeaderText {
    width: 100%;
    height: 100%;
    line-height: 45px;
    text-align: center;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
  }
  .sxLists {
    width: 100%;
    height: 80%;
    padding: 0 10px;
    box-sizing: border-box;
    overflow: scroll;
  }
  .itemList {
    border-bottom: 0.5px solid #e3e3e3;
    height: 40px;
    line-height: 40px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #8d8d8d;
    position: relative;
  }
  .itemList .itemTip {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    right: 0;
  }
  .inputBox {
    width: 60%;
    height: 25px;
    border-radius: 2px;
    position: absolute;
    top: 0;
    bottom: 0;
    overflow: hidden;
    margin: auto 0;
    right: 0;
    border: 0.5px solid #e3e3e3;
    box-sizing: border-box;
    padding-left: 2%;
    background: white;
  }
  .itemList input {
    width: 100%;
    height: 100%;
    border-radius: 2px;
    display: block;
    padding-right: -15px;
    padding-right: 10px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    line-height: 25px;
    font-size: 14px;
    color: #b6b6b6;
    background: #fff;
    padding: 0;
    border: 0;
    -webkit-appearance: none;
  }
  .itemContent .itemList:last-child {
    border: 0;
  }
  .sxitemBox {
    width: 100%;
    height: auto;
  }
  .sxlistItem {
    width: 100%;
    height: 40px;
    border-bottom: 0.5px solid #e3e3e3;
    line-height: 40px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #535353;
    padding: 0;
    position: relative;
  }
  .sxlistItem .tipText {
    position: absolute;
    overflow: hidden;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    width: 50%;
    height: 100%;
    line-height: 40px;
    font-size: 13px;
    color: #8d8d8d;
    padding-right: 15px;
    box-sizing: border-box;
    text-align: right;
  }
  .itemContent {
    width: 100%;
    padding-left: 15px;
    box-sizing: border-box;
    border-bottom: 0.5px solid #e3e3e3;
  }
  .toLeft {
    display: block;
    font-size: 14px;
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto 0;
  }
  .search-mrpx {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .pass {
    width: 50% !important;
    height: 36px !important;
    background: #fff !important;
    margin-top: 5px !important;
    line-height: 30px !important;
    border: 0.5px solid #e3e3e3 !important;
    border-bottom: 0 !important;
    box-sizing: border-box !important;
    text-align: center !important;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #ffb048 !important;
    display: block !important;
  }
  .search-s .pass p {
    margin-bottom: 3px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/selectImgUp.png");
  }
  .search-mrpx .imgBox {
    margin: 0;
    padding: 0;
    display: inline-block;
    width: 9px;
    height: 4.5px;
    margin-left: 5px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/selectImg.png");
    background-size: contain;
  }
  .showSearch, .showSearch1, .showSearch2 {
    display: none;
    position: absolute;
    left: 0;
    top: 90px;
    background: #fff;
    width: 100%;
    height: 86%;
    z-index: 3200
  }
  .bottomBox, .sxFooter {
    width: 100%;
    height: 50px;
    border-top: 0.5px solid #e3e3e3;
    display: flex;
    justify-content: space-between;
    position: absolute;
    left: 0;
    bottom: 0px;
  }
  .bottomBox div, .sxFooter div {
    width: 50%;
    height: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica !important;
  }
  .bottomBox .reset, .sxFooter .sxReset {
    color: #ffb048 !important;
  }
  .bottomBox .yeah, .sxFooter .sxYeah {
    background: #ffb048 !important;
    color: #fff !important;
  }
  .itembox {
    width: 100%;
    height: 85%;
    overflow: scroll;
    /*display: flex;justify-content: space-between;flex-wrap: wrap;*/
  }
  .itemTip {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    margin-right: 7px;
    border: 0.5px solid #e3e3e3;
    background-color: #f6f7f9;
  }
  .selected {
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/chengseduigou.png");
    background-size: contain;
    background-repeat: no-repeat;
    border: 0;
    border: 0.5px solid #fff;
  }
  .itemHline {
    width: 1px;
    height: 17.5px;
    background: #e3e3e3;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto 0;
  }
  .itembox .item {
    width: 50%;
    height: 40px;
    border-bottom: 0.5px solid #e3e3e3;
    line-height: 40px;
    padding-left: 12.5px;
    box-sizing: border-box;
    position: relative;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #535353;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    float: left;
  }
  .shadow {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 3334;
    background: rgba(0, 0, 0, .5);
    display: none;
    overflow: hidden;
    border-radius: 0;
    border: 0;
  }
  .mint-popup-3 {
    width: 72%;
    height: 100%;
    background-color: #fff;
    border-left: 0.5px solid #e3e3e3;
    box-shadow: 4px 2px 2px 1px #B9ADAD;
  }
  .mint-popup-3 .expert_g {
    position: absolute;
    top: 50%;
    left: 0;
    padding-left: 12px;
    transform: translateY(-50%);
    box-shadow: none;
    border-radius: 0;
  }
  img[src=''] {
    opacity: 0 !important;
  }
  input:focus {
    outline: none !important;
    -webkit-appearance: none;
  }
  .ceshadow { /*内容加载中。。。*/
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 3333;
    background: rgba(0, 0, 0, .4);
  }
  /***********加载动画****************/
  .snake-circle {
    height: 20px;
    width: 20px;
    -webkit-animation: snake-rotate 0.8s infinite linear;
    animation: snake-rotate 0.8s infinite linear;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: rgb(252, 199, 127);
    border-left-color: rgb(252, 199, 127);
    border-bottom-color: rgb(252, 199, 127);
    margin: 0 auto;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
  }
  @keyframes snake-rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  /**********************************/
  /*搜索栏关键字样式*/
  .searchPrompt {
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 35px;
    line-height: 35px;
  }
  .searchScroll {
    margin: 0;
    padding: 0;
    background-color: white;
    display: inline;
    white-space: nowrap;
    overflow-x: scroll;
    float: left;
    overflow-y: hidden;
    max-width: 98%;
    height: 35px;
    z-index: 150;
    -webkit-overflow-scrolling: touch;
  }
  .searchScroll .searchScrollSpan {
    background-color: #fff2e1;
    border-radius: 2px;
    color: #8d8d8d;
    font-weight: lighter !important;
    display: inline-block !important;
    margin: 5px 0 5px 8px;
    height: 25px;
    font-size: 15px;
    line-height: 25px;
    padding-left: 5px;
    padding-right: 5px;
    z-index: 170;
  }
  /*.searchScroll .promptClose {*/
  /*height: 15px;*/
  /*position: relative;*/
  /*color: #c1c1c1;*/
  /*top: 0;*/
  /*background-color: #ffffff;*/
  /*border-radius: 100%;*/
  /*}*/
  .expert_s {
    height: 100%;
    padding: 0 5px;
    border: 0;
    background-color: white;
    color: #8d8d8d;
    font-size: 15px;
    border-radius: 2px;
  }
  .smx_item {
    height: 8px;
    width: 8px;
    background-color: red;
    border-radius: 50%;
    position: absolute;
    top: 5px;
    right: 9px;
    display: none;
  }
  .searchClose {
    display: inline-block;
    height: 25px;
    position: relative;
    top: 0;
    width: 16px;
    z-index: 200;
  }
  .searchClose img {
    position: relative;
    width: 100%;
    height: 64%;
    top: 8%;
  }
  .goSearch {
    display: flex;
    width: auto;
    height: 35px
  }
  /*.rangeGkipt{
        top: 50.5px !important;
    }*/
  .rangeBtnHide {
    background-color: rgba(240, 241, 245, 0.3) !important;
    color: rgba(141, 141, 141, 0.3) !important;
  }
  .closeDate { /*清除时期x按钮*/
    position: absolute;
    right: 2%;
    top: 0;
    bottom: 0;
    margin: auto;
    line-height: 23px;
    font-size: 15px;
    display: none;
    z-index: 22;
    width: 15px;
    height: 15px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/base/searchDelete.png");
    background-repeat: no-repeat;
    background-size: contain;
  }
  .sxListsScroller {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  #expertss {
    border-radius: 2px;
    overflow: hidden;
    border: 0;
    height: 100%;
    box-shadow: none;
    padding: 0 6px;
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    margin: 0;
    background-color: white;
    color: #535353;
  }
  .showPrompt {
    height: 45px;
    width: 100%;
    color: #ffffff;
    background-color: rgba(255, 153, 51, 0.85);
    position: absolute;
    bottom: 49.5px;
    text-align: center;
    line-height: 45px;
    font-size: 15px;
    display: none;
  }
  #affiche #loadmorecon {
    margin-bottom: 30px;
  }
  /**/
  #affiche .mint-spinner-snake {
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    border: 2px solid transparent;
    border-top-color: rgb(252, 199, 127) !important;
    border-left-color: rgb(252, 199, 127) !important;
    border-bottom-color: rgb(252, 199, 127) !important;
    height: 14px !important;
    width: 14px !important;
    -webkit-animation: mint-spinner-rotate 0.8s infinite linear !important;
    animation: mint-spinner-rotate 0.8s infinite linear !important;
  }
  .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
</style>
