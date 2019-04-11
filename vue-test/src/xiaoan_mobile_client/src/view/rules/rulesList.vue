<template>
  <div class="xiaoan-box rules-list" id="ruleslist" ref="rulesListBoxDom">
    <div class="rule-header">
      <div class="searchs">
        <div class="seabox">
          <div class="searchPrompt" @click="searchPro"></div>
          <ul class="searchScroll">
            <li class="searchScrollSpan" v-for="(list,index) in Newarr" id="searchScrollSpan">
              {{newBtnArr(list)}}
              <span class="searchClose" @click="searchClose(index)">
                 <img :src="$image.base.searchDelete">
              </span>
            </li>
          </ul>
          <div class="goSearch" @click='goSearch'>
            <div class="rulesNum" v-show="num>1">{{num+numtext}}</div>
          </div>
        </div>
        <button @click="popupShow" class="expert_s" id="experts">{{experts}}</button>
        <i class="smx_item" v-show="redCircleExpert"></i>
      </div>
      <!--筛选栏-->
      <div class="searchBox">
        <div class="search-s" style="position: relative">
          <div class="search-mrpx search1" :class="{pass:xianshi}" @click="show">
            <span>市场类型</span>
            <p class="imgBox"><i class="icon iconfont icon-xiangxiajiantou iconBottom"></i></p>
          </div>
          <div class="search-mrpx search2" :class="{pass:xianshi1}" @click="show2">
            <span>发文单位</span>
            <p class="imgBox"><i class="icon iconfont icon-xiangxiajiantou iconBottom"></i></p>
          </div>
          <div class="search-mrpx search3" :class="{pass:xianshi2}" @click="show3">
            <span>规则类别</span>
            <p class="imgBox"><i class="icon iconfont icon-xiangxiajiantou iconBottom"></i></p>
          </div>
        </div>
        <div class="search-sx search4">
          <div class="redCircle" v-show="redCircleDis"></div><!--筛选栏选中条件状态标识-->
          <button @click="SXshow" class="expert_s">筛选</button>
          <!--筛选-->
        </div>
        <div v-show="searchBoxTrue" class="searchBoxDis"></div>
      </div>
    </div>
    <div class="rules-list-scroll" ref="rulesListDom">
      <!--内容页-->
      <div class="wrapper" id="wrapper">
        <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
            :infinite-scroll-distance="50">
          <li class="anList" v-for="(list,index) in ruleslist" @click="goCount(index)">
            <div class="anListName" :style="{color: list.timeliness == '失效'?'#8d8d8d':'#323232'}">
              <div style="letter-spacing: 0;" v-html="key(list.name)"></div>
            </div>
            <div class="anListState vux-1px-b">
              <span v-show="list.referenceNumber && list.referenceNumber != '无'">{{list.referenceNumber}}</span>
              <span v-show="list.referenceNumber && list.referenceNumber != '无'">|</span>
              <span>{{list.timeliness}}</span>
              <span v-show="list.PublishDate">|</span>
              <span v-show="list.PublishDate">{{$const.format(list.PublishDate)}}</span>
            </div>
          </li>
          <li class="seniorText" v-show="seniorTextShow">
            <span class="trytext scroll-trytext" @click="showSenior">搜索不到想要的内容，试试看全文检索吧！</span>
            <span class="tryimg"></span>
          </li>
        </ul>
        <p v-show="infLoading" class="infinite-loading">
          <xiaoan-drop v-model="allLoadeded"></xiaoan-drop>
        </p>
      </div>
      <!---->
      <div class="noTrySenior" v-show="trySeniorDis">
        <div class="trySenior">
          <img :src="$image.rules.trySenior" alt="全文检索">
          <div class="tryText" @click="popupShow">
            <span class="trytext scroll-trytext">搜索不到想要的内容，试试看全文检索吧！</span>
            <span class="tryimg"></span>
          </div>
        </div>
      </div>
      <div class="noInfo" v-show="noInfoShow">
        <div class="trySenior" style="width:100%" :class="{trySeniorShow:noInfoShow}">
          <img :src="$image.rules.trySenior" alt="全文检索">
          <div class="tryText" style="display: flex;justify-content: center;width:100%;">
            <span class="trytext" style="margin-left:0;">搜索不到相关内容，试试别的</span>
          </div>
          <div class="tryText" style="margin-top:-2px">
            <span class="trytext" style="margin-left:0;">关键字或使用高级搜索吧！</span>
          </div>
          <div class="seniorButton" @click="popupShow">高级搜索</div>
        </div>
      </div>
    </div>
    <div class="checkbox-box">
      <!----正面 市场类型 筛选条件---->
      <div class="showSearch" v-show="showSearch">
        <div class="itembox">
          <div class="item" @click="MRselect($event)" v-for="list in sxlistItem[0].item">
            <div class="itemTip aaa" select='true'></div>
            <div class="itemText bbb">{{ list.name }}</div>
            <div class="itemHline"></div>
          </div>
        </div>
        <div class="bottomBox">
          <button class="reset" @click="MRreset($event)">重置</button>
          <button class="yeah" @click="shaixuanY">确认</button>
        </div>
      </div>
      <!----正面 发文单位 筛选条件---->
      <div class="showSearch1" v-show="showSearch1">
        <div class="itembox">
          <div class="item" @click="select($event)" v-for="list in sxlistItem[1].item">
            <div class="itemTip aaa" select='true'></div>
            <div class="itemText bbb">{{ list.name }}</div>
            <div class="itemHline"></div>
          </div>
        </div>
        <div class="bottomBox">
          <button class="reset" @click="reset($event)">重置</button>
          <button class="yeah" @click="shaixuanY">确认</button>
        </div>
      </div>
      <!----正面 规则类别 筛选条件---->
      <div class="showSearch2" v-show="showSearch2">
        <div class="itembox">
          <div class="item" @click="GZselect($event)" v-for="list in sxlistItem[2].item">
            <div class="itemTip aaa" select='true'></div>
            <div class="itemText bbb">{{ list.name }}</div>
            <div class="itemHline"></div>
          </div>
        </div>
        <div class="bottomBox">
          <button class="reset" @click="GZreset($event)">重置</button>
          <button class="yeah" @click="shaixuanY">确认</button>
        </div>
      </div>
    </div>
    <!--右滑高级-->
    <div class="rule-popup-right" v-transfer-dom>
      <popup v-model="popupVisible" position="right" :width="'72%'" popup-style="z-index: 2000">
        <div class="rule-popup-right-advanced" ref="advancededDom">
          <div class="rulExpert" ref="expertaTitleDom">
            <i @click="popupHide" class="icon iconfont icon-x expert_g"></i>
            <span>高级搜索</span>
          </div>
          <div class="rangeGkipt" :style="{height:advancedHeight+'px'}">
            <div class="range">{{range}}</div>
            <div class="rangeBtn">
              <div>
                <button class="rangeBtn1 colorBtn" @click="sea1">标题</button>
              </div>
              <div>
                <button class="rangeBtn2" @click="sea2">全文</button>
              </div>
            </div>
            <div class="range">{{accuracy}}</div>
            <div class="rangeBtn_2">
              <div>
                <button class="rangeBtn3 colorBtn" @click="sea3">精确</button>
              </div>
              <div>
                <button class="rangeBtn4" @click="sea4">模糊</button>
              </div>
            </div>
            <div class="rangeMoregl">
              <div class="rangeMore" @click="matter">{{More}}
                <i class="icon iconfont icon-xiangyoujiantou rangeMoreTop" v-show="this.sw == 0"></i>
                <i class="icon iconfont icon-xiangxiajiantou rangeMoreButton" v-show="this.sw != 0"></i>
              </div>
            </div>
            <div class="rulesMatter rules-matter">
              <div class="search-matter-title serachTitle">
                <div class="searchTitle">标题关键字</div>
                <div class="input-matter-box inputA">
                  <div class="text-left Matter-span">必须包含</div>
                  <div class="input-right">
                    <input type="text" id="mustInput" v-model="titleIncludes" @focus="entrybug($event)"
                           class="inputTil" @input="entryText" @keyup.13="Toblur">
                  </div>
                </div>
                <p class="titleTip">必须输入至少一个关键字</p>
                <div class="input-matter-box inputB">
                  <div class="text-left Matter-span">可能包含</div>
                  <div class="input-right">
                    <input type="text" id="titleMay" v-model="titleMaybeIncludes" @focus="entrybug($event)"
                           class="inputTil" @keyup.13="Toblur">
                  </div>
                </div>
                <div class="input-matter-box inputC">
                  <div class="text-left Matter-span">不包含</div>
                  <div class="input-right">
                    <input type="text" id="titleExc" v-model="titleExcludes" @focus="entrybug($event)"
                           class="inputTil" @keyup.13="Toblur">
                  </div>
                </div>
              </div>
              <div class="search-matter-content serachCont">
                <div class="searchCont">全文关键字</div>
                <div class="input-matter-box inputA">
                  <div class="text-left Matter-span">必须包含</div>
                  <div class="input-right">
                    <input type="text" id="contentInc" v-model="contentIncludes" @focus="entrybug($event)"
                           class="inputCont" @input="entryText1" @keyup.13="Toblur">
                  </div>
                </div>
                <p class="titleTip1">必须输入至少一个关键字</p>
                <div class="input-matter-box inputB">
                  <div class="text-left Matter-span">可能包含</div>
                  <div class="input-right">
                    <input type="text" id="contentMay" v-model="contentMaybeIncludes" @focus="entrybug($event)"
                           class="inputCont" @keyup.13="Toblur">
                  </div>
                </div>
                <div class="input-matter-box inputC">
                  <div class="text-left Matter-span">不包含</div>
                  <div class="input-right">
                    <input type="text" id="contentExc" v-model="contentExcludes" @focus="entrybug($event)"
                           class="inputCont" @keyup.13="Toblur">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="footBtn" ref="footeBtnDom">
            <button type="button" @click="goReset">重置</button>
            <button type="button" @click="searchMany">确认</button>
          </div>
        </div>
      </popup>
    </div>
    <!--右滑筛选-->
    <div class="rule-popup-right" v-transfer-dom>
      <popup v-model="popupVisible1" position="right" :width="'72%'" popup-style="z-index: 2000">
        <div class="rule-popup-right-sx" ref="advancedDom">
          <div ref="expertTitleDom" class="sxHeader">
            <i @click="SXhide" class="icon iconfont icon-x expert_g"></i>
            <div class="sxHeaderText">筛选</div>
          </div>
          <div class="sxLists ruleList" :style="{height:matterHeight+'px'}">
            <!----侧边栏各筛选条件---->
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(0)">
                <div>市场类型</div>
                <div class="tipText tip"></div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <!--max-height: 250px;overflow: scroll-->
                <div class="itemContent" v-for="list in sxlistItem[0].item">
                  <div class="itemList" @click="MarketSH($event)">
                    <div class="listText">{{ list.name }}</div>
                    <div class="itemTip" select="true"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(1)">
                <div>发文单位</div>
                <div class="tipText tip1"></div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <div class="itemContent" v-for="list in sxlistItem[1].item">
                  <div class="itemList" @click="UnitSH($event)">
                    <div class="listText">{{ list.name }}</div>
                    <div class="itemTip" select="true"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(2)">
                <div>规则类别</div>
                <div class="tipText tip2"></div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <!--max-height: 250px;overflow: scroll-->
                <div class="itemContent" v-for="list in sxlistItem[2].item">
                  <div class="itemList" @click="SortSH($event)">
                    <div class="listText">{{ list.name }}</div>
                    <div class="itemTip" select="true"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(3)">
                <div>时效性</div>
                <div class="tipText tip3"></div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <div class="itemContent" v-for="list in sxlistItem[3].item">
                  <div class="itemList" @click="TimeSH($event)">
                    <div class="listText">{{ list.name }}</div>
                    <div class="itemTip" select="true"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="sxitemBox">
              <div class="sxlistItem" @click="showItem(4)">
                <div>发布日期</div>
                <div class="tipText tip4" style="width:auto;">
                  <span v-show="dateARR != undefined">{{dateARR}}</span><span
                  v-show="dateARR2 !=''&& dateARR !=''">,</span><span v-show="dateARR2 != undefined">{{dateARR2}}</span>
                </div>
                <i class="icon iconfont icon-xiangyoujiantou toLeft"></i>
              </div>
              <div class="itemconBOX" isOpen="close" style="display: none;">
                <div class="itemContent">
                  <div class="itemList">
                    <div class="listText">起始日期</div>
                    <div class="inputBox aa">
                      <input type="date" required min="1991-11-15" :max="todate" v-model="timesDate1"
                             placeholder="年 / 月 / 日" @change="timeStart">
                      <b class="closeDate" @click="timesClose1"
                         v-show="timesDate1 !== ''"><i style="color: #c1c1c1"
                                                       class="icon iconfont icon-X"></i></b>
                    </div>
                  </div>
                  <div class="itemList">
                    <div class="listText">结束日期</div>
                    <div class="inputBox bb">
                      <input type="date" required :min="timesDate1" :max="todate" v-model="timesDate2"
                             placeholder="年 / 月 / 日" @change="timeEnd">
                      <b class="closeDate" @click="timesClose2"
                         v-show="timesDate2 !== ''"><i style="color: #c1c1c1"
                                                       class="icon iconfont icon-X"></i></b>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="footBtnDom" class="sxFooter">           <!----侧边栏确认重置按钮---->
            <button class="sxReset" @click="SXReset($event)">重置</button>
            <button class="sxYeah" @click="shaixuanY">确认</button>
          </div>
        </div>
      </popup>
    </div>
    <!---->
    <xiaoan-loading v-show="shadowLoading" bgColor="rgba(0,0,0,0.5)" borderWidth="2px"></xiaoan-loading>
    <transition name="bounce">
      <div @click="popupHide" class="xiaoan-box-shadow showOp" v-show="showPopup"></div><!--高级 阴影隐藏-->
    </transition>
    <transition name="bounce">
      <div @click="SXhide" class="xiaoan-box-shadow shadow" v-show="shadowPopup"></div>  <!--筛选 阴影隐藏-->
    </transition>
    <div class="showPrompt">上滑加载更多内容</div>
  </div>
</template>
<script>
  import loading from "@/components/warning/loading"
  import {Popup, TransferDom} from 'vux'

  export default {
    name: 'ruleslist',
    components: {
      "xiaoan-loading": loading,
      Popup,
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        matterHeight: 0,
        advancedHeight: 0,
        //
        timesDate1: "",
        timesDate2: "",
        More: '更多搜索选项',
        accuracy: '搜索精度',
        range: '搜索范围',
        right: this.$image.rules.right,
        button: this.$image.rules.bottom,
        experts: '高级',
        num: 1,
        numtext: '条',
        values: '',
        placeholder: "搜索法规名称，多个关键字空格隔开",
        popupVisible: false,
        top: 1,
        bottom: 20,
        sortType: '',
        ruleslist: [],  //搜索结果列表数组
        prompting: [],
        promptclose: this.$image.personal.close,
        sw: 0,
        titleIncludes: "",//标题包含
        titleMaybeIncludes: "",//标题可能包含
        titleExcludes: "",//标题不包含
        contentIncludes: "",
        contentMaybeIncludes: "",
        contentExcludes: "",
        nuwUrl: '',
        popupVisible1: false,
        shadowLoading: false,
        showPopup: false,
        shadowPopup: false,
        noInfoShow: false,
        selectItems: [
          {
            name: "市场类型",
            item: []
          },
          {
            name: "发文单位",
            item: []
          },
          {
            name: "规则类别",
            item: []
          },
          {
            name: '时效性',
            item: []
          }
        ],
        sxlistItem: [
          {
            name: '市场类型',
            item: []
          }, {
            name: '发文单位',
            item: []
          }, {
            name: '规则类别',
            item: []
          }, {
            name: '时效性',
            item: []
          }
        ],
        xianshi: false,//默认排序筛选条件下拉是否弹出
        xianshi1: false,//发文单位筛选条件下拉是否弹出
        xianshi2: false,//规则类别筛选条件下拉是否弹出
        frontStatus: false,//加一个状态判断是否是正面筛选栏出来的条件
        value0: [],//市场类型arr
        value1: [],//发文单位arr
        value2: [],//规则类别Name arr
        value3: [],//时效性arr
        dateStart: '',//发布日期arr
        dateEnd: "",//发布日期
        idarr0: [],//市场类型idarr
        idarr1: [],//发文单位idarr
        idarr2: [],//规则类别idarr
        idarr3: [],//时效性idarr
        paixuid: '',//排序ID
        guizeArr: [],//规则数组 四个类别idarr
        gzObjarr: [],//选中状态规则类别arr
        Newarr: [], /* Newarrs: ["上市规则", '规则规则规则', "海洋规则规则规则规则"],*/
        titleKey: [],
        newTitleKey: [],
        onloadOpen: true, //加载更多的开关  上滑加载的时候让它关闭 内容加载完成后让它开启
        yeahFlag: false, //点击确认提交筛选条件开关  选择完筛选条件后 点击确认yeahFlag为true 没有点击则为false 此时选中状态的样式是不应该有的 重置后再次设为false
        marketStatus: [],//保存市场类型的筛选条件
        marketIdStatus: [],
        trueMarketWord: [],//保存的市场类型的筛选条件文字
        fawenStatus: [],//保存发文单位的筛选条件
        fawenIdStatus: [],
        trueFawenWord: [],//保存发文单位的筛选条件文字
        guizeStatus: [],//保存规则类别的筛选条件
        guizeSortAll: [],//保存所有规则类别
        guizeHu: [],//保存沪市主板的规则类别
        guizeShen: [],//保存深市主板的规则类别
        guizeSGem: [],//保存深市中小板的规则类别
        guizeSSme: [],//保存深市创业板的规则类别
        guizeIdStatus: [],
        guizeStatusA: [],
        timeStatus: [], // 保存时效性的筛选条件
        timeIdStatus: [], // 保存时效性的筛选条件文字
        trueTimeWord: [],
        inputDateS: [], // 保存点击确认后的起始时间
        inputDateE: [], // 保存点击确认后的终止时间
        keys: '',
        gunflag: true,//滚动触发 1->10
        toright: this.$image.rules.toright,
        tobutton: this.$image.rules.tobutton,
        dateARR: '',
        dateARR2: '',
        valInput: '',
        todate: '',
        bottomStatus: '', //下拉状态
        Number: '',
        infLoading: true,
        loading: false,
        allLoaded: false,
        allLoadeded: true,
        wrapperHeight: 0,
        redCircleDis: false,//筛选的小红点显示
        redCircleExpert: false,
        showSearch: false,
        showSearch1: false,
        showSearch2: false,
        trySeniorShow: false,//没有搜索结果时候
        seniorTextShow: false,//没有搜索结果时候
        trySeniorDis: false,//没有搜索结果时候
        searchBoxTrue: false,
      }
    },

    watch: {
      xianshi: function (val, old) {
        console.log("xianshi", val, old);
        if (old == false) {
          $(".search2").css('border-color', '#fff');
          ////console.log("市场类型展开******* 1-2")
          ////console.log("此时已经确认提交的筛选条件 市场类型 为", this.marketStatus)
        } else if (old == true && val == false) {
          $(".search2").css('border-color', '#e3e3e3');
          ////console.log('市场类型关闭******* 11-22')
          ////console.log("市场类型需要设置选中状态的条件id值", this.marketIdStatus)
          ////console.log("此时已经确认提交的筛选条件 市场类型 为", this.marketStatus)
        }
        this.xianshiOne();
      },
      xianshi1: function (val, old) {
        //console.log("xianshi1",val, old);
        if (old == false) {     //发文单位筛选条件栏展开
          ////console.log("发文单位展开******* 1-2")
          $(".search3").css('border-color', '#fff')
        } else if (old == true && val == false) {  //发文单位筛选条件栏关闭 隐藏
          $(".search3").css('border-color', '#e3e3e3');
          ////console.log("发文单位关闭******* 11-22")
          ////console.log('发文单位需要设置选中状态的条件id值', this.fawenIdStatus)
          ////console.log("要和发文单位的筛选条件比较id值相同的为需要设置选中状态的条件", this.fawenStatus)
          //$(".search1").css('border-right', '0.5px solid #e3e3e3')
        }
        this.xianshiTwo();
      },
      xianshi2: function (val, old) {
        console.log("xianshi2", val, old);
        if (old == false) {
          ////console.log("规则类别展开******* 1-2")
          $(".search4").css('border-left-color', '#fff');
        } else if (old == true && val == false) {
          $(".search4").css('border-left-color', '#e3e3e3');
          ////console.log("规则类别关闭******* 11-22")
          ////console.log('规则类别需要设置选中状态的条件id值---', this.guizeIdStatus)
          ////console.log("要和规则类别的筛选条件比较id值相同的为需要设置选中状态的条件---", this.guizeStatusA)
          //$(".search2").css('border-right', '0.5px solid #e3e3e3');
        }
        this.xianshiThree();
      },
      popupVisible1: function (val) {
        if (val) {
          this.$nextTick(() => {
            this.matterHeight = this.$refs.advancedDom.clientHeight - 1 - this.$refs.expertTitleDom.clientHeight - this.$refs.footBtnDom.clientHeight;
          })
          $('#wrapper').css({'overflow-y': 'hidden'});
        } else {
          $('#wrapper').css({'overflow-y': 'auto'});
        }
      },
      popupVisible: function (val) {
        if (val) {
          this.$nextTick(() => {
            // 高级默认状态
            this.sea();
            this.gaoji("colorBtn");
            this.advancedHeight = this.$refs.advancededDom.clientHeight - 1 - this.$refs.expertaTitleDom.clientHeight - this.$refs.footeBtnDom.clientHeight;
          })
          $('#wrapper').css({'overflow-y': 'hidden'});
        } else {
          $('#wrapper').css({'overflow-y': 'auto'});
        }
      },
      idarr0: function () {
        //console.log(this.idarr0);
      },//市场类型idarr
      idarr1: function () {
        //console.log(this.idarr1);
      },//发文单位idarr
      idarr2: function () {
        //console.log(this.idarr2);
      },//规则类别idarr
    },
    created() {
      this.valInput = this.$route.query.inputVal;
      console.log('=============>', this.noep(this.valInput));
      if (window.localStorage.getItem('titleIME')) {
        let title = window.localStorage.getItem('titleIME');
        let arr = title.split('$#');
        let newArr = this.noep(this.valInput) + '$#' + arr[1] + '$#' + arr[2];
        window.localStorage.setItem('titleIME', newArr);
        if (window.localStorage.getItem('colorBtn')) {
          console.log(3223);
        } else {
          window.localStorage.setItem('colorBtn', "标题$#精确");
        }
      } else {
        let newArr = this.noep(this.valInput) + '$#' + '$#';
        window.localStorage.setItem('titleIME', newArr);
        if (window.localStorage.getItem('colorBtn')) {
          console.log(3223);
        } else {
          window.localStorage.setItem('colorBtn', "标题$#精确");
        }
      }
      var date = new Date();
      var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
      this.todate = str;
      // 页面加载完调用

      this.multipleKeyRetrieval(); // 第一个字符串，第二个生成的新字符串
      // 高级默认状态
      this.sea();
      this.gaoji("colorBtn"); // 调用localS
      // 获取筛选
      this.Newarr = this.newTitleKey;
      this.preparation();
      this.newgaoji();
      this.localstrol();
      this.lawScarch();
    },
    mounted() {
      this.$nextTick(() => {
        $(".is-fixed").css("z-index", '100');
        this.lineHeight();
        this.anlist();
      });
    },
    methods: {
      //数据回显
      localstrol() {
        /*板块*/
        this.idarr0 = this.$storage.localStorageAll("marketIdStatus");
        this.value0 = this.$storage.localStorageAll("value0");
        this.value0text();
        /*发文单位*/
        this.idarr1 = this.$storage.localStorageAll("fawenIdStatus");
        this.value1 = this.$storage.localStorageAll("value1");
        console.log("this.value1", this.value1);
        this.value1text();
        /*规则*/
        this.idarr2 = this.$storage.localStorageAll("guizeIdStatus");
        this.value2 = this.$storage.localStorageAll("value2");
        this.value2text();
        /*有效期*/
        this.idarr3 = this.$storage.localStorageAll("timeIdStatus");
        this.value3 = this.$storage.localStorageAll("value3");
        this.value3text();
        /*开始时间结束时间*/
        let DateStartEnd = this.$storage.localStorageAll("DateStartEnd");
        if (DateStartEnd == [] || DateStartEnd == null || DateStartEnd.length == 0) {
          this.timesDate1 = '';
          this.timesDate2 = '';
        } else {
          this.timesDate1 = DateStartEnd[0];
          this.timesDate2 = DateStartEnd[1];
          if (this.timesDate1 == '' || this.timesDate1 == '') {
          } else {
            let data1 = DateStartEnd[0].split("-").join("");
            this.dateARR = data1;
          }
          if (this.timesDate2 == '') {
          } else {
            let data2 = DateStartEnd[1].split("-").join("");
            this.dateARR2 = data2;
          }
        }
        let localAdd = ["marketIdStatus", "guizeIdStatus", "fawenIdStatus", "value0", "value1", "value2", "value3",
          "timeIdStatus", "DateStartEnd"];
        this.$storage.localStorageRemove(localAdd);
      },
      lineHeight() {
        var hei = this.$refs.rulesListDom.clientHeight;
        var searchs = document.querySelector(".searchs").clientHeight;
        var searchBox = document.querySelector(".searchBox").clientHeight;
        var heig = (hei - (searchs + searchBox)) + "px";
        var couHeight = (hei - (searchs + searchBox)) + "px";
        $(".rangeGkipt").css('height', couHeight);
        $('.itembox').css({'height': heig});
        $(".ruleList").css('height', couHeight);
      },
      //初始高级赋值
      newgaoji() {
        var colorBtn2 = $('.rangeBtn_2 div .colorBtn').text();
        var colorBtn = $('.rangeBtn div .colorBtn').text();
        if (colorBtn2 == "模糊" && colorBtn == "全文") {
          if (window.localStorage.getItem("keyIME") == null) {
          } else {
            this.keys = window.localStorage.getItem("keyIME");
          }
        } else if (colorBtn2 == "精确" && colorBtn == "全文") {
          if (window.localStorage.getItem("titleIME") == null && window.localStorage.getItem("contentIME") == null) {
          } else {
            var titlea = window.localStorage.getItem("titleIME");
            var contenta = window.localStorage.getItem("contentIME");
            var titleb = titlea.split("$#");
            var contentb = contenta.split("$#");
            this.titleIncludes = titleb[0];
            this.titleMaybeIncludes = titleb[1];
            this.titleExcludes = titleb[2];
            this.contentIncludes = contentb[0];
            this.contentMaybeIncludes = contentb[1];
            this.contentExcludes = contentb[2];
          }
        } else {
          if (window.localStorage.getItem("titleIME") == null) {
            this.titleIncludes = this.noep(this.valInput);
          } else {
            var titlea = window.localStorage.getItem("titleIME");
            var titleb = titlea.split("$#");
            this.titleIncludes = titleb[0];
            this.titleMaybeIncludes = titleb[1];
            this.titleExcludes = titleb[2];
          }
        }
      },
      //全文状态
      quanwen() {
        var titleI = [], contentI = [];
        if (window.localStorage.getItem("titleIME") == null) {
          //console.log("titleIME");
          this.titleIncludes = this.noep(this.valInput);
        } else {
          titleI = window.localStorage.getItem("titleIME").split("$#");
          this.titleIncludes = titleI[0];
          this.titleMaybeIncludes = titleI[1];
          this.titleExcludes = titleI[2];
        }
        /**/
        if (window.localStorage.getItem("contentIME") == null) {
          //console.log("contentIME");
          this.contentIncludes = "";
          this.contentMaybeIncludes = "";
          this.contentExcludes = "";
        } else {
          contentI = window.localStorage.getItem("contentIME").split("$#");
          this.contentIncludes = contentI[0];
          this.contentMaybeIncludes = contentI[1];
          this.contentExcludes = contentI[2];
        }
      },
      //高级状态
      gaoji(colorBtn) {
        if (window.localStorage.getItem(colorBtn) !== null) {
          var co = window.localStorage.getItem(colorBtn);
          var costr = co.split('$#');
          if (costr[0] == "标题" && costr[1] == "精确") {
            $('.rangeBtn1').addClass('colorBtn');
            $('.rangeBtn2').removeClass('colorBtn');
            $('.rangeBtn3').addClass('colorBtn');
            $('.rangeBtn4').removeClass('colorBtn').addClass('rangeBtnHide');
            this.redCircleExpert = false;
            this.sea1();
            //console.log("11111111111111", 1, costr[0], costr[1]);
          } else if (costr[0] == "全文" && costr[1] == "精确") {
            $('.rangeBtn2').addClass('colorBtn');
            $('.rangeBtn1').removeClass('colorBtn');
            $('.rangeBtn3').addClass('colorBtn');
            $('.rangeBtn4').removeClass('colorBtn').removeClass('rangeBtnHide');
            this.redCircleExpert = true;
            /* this.sea2();*/
            this.seaColor2_1();
            this.quanwen();
            //console.log("22222222222222222", 2, costr[0], costr[1]);
          } else {
            $('.rangeBtn2').addClass('colorBtn');
            $('.rangeBtn1').removeClass('colorBtn');
            $('.rangeBtn3').removeClass('colorBtn');
            $('.rangeBtn4').addClass('colorBtn').removeClass('rangeBtnHide');
            this.redCircleExpert = true;
            this.sea4();
            //console.log("22222222222222222", 2, costr[0], costr[1]);
          }
        } else {
          this.sea();
        }
      },
      //规则类别正面筛选框 确认后保存状态
      xianshiThree() {
        var arr = [];
        var idarr = [];
        for (var i in this.guizeStatus) {
          for (var j in this.guizeIdStatus) {
            if (this.guizeIdStatus[j] == this.guizeStatus[i]['id']) {
              //console.log(i, this.fawenStatus[i]['name'])
              arr.push(this.guizeStatus[i]['name']);
              idarr.push(this.guizeStatus[i]['id']);
            }
          }
        }
        console.log("console.log(idArr);", this.guizeIdStatus, this.guizeStatus);
        for (var i in $(".showSearch2").find('.aaa')) {
          //关闭当前筛选条件栏后 首先重置所有的选中样式
          $(".showSearch2").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
        }
        this.value2 = arr;
        this.trueGuizeWord = arr;
        this.idarr2 = idarr;
        ////console.log("此时发文单位的文字arr为", this.value1, this.idarr1)
        //为点击确认按钮后的选中筛选条件显示
        for (var i = 0; i < this.value1.length; i++) {
          $(".search3").find('span').text(this.value1[0].substring(0, 3) + '...')
          $(".tip2").text(this.value1.join(',').substring(0, 8) + '...')
        }
        if (this.value2.length == 0) {
          $(".search3").find('span').text('规则类别');
          $(".tip2").text('')
        }

        for (var i = 0; i < this.value2.length; i++) {       //然后 发文单位条件选中状态 只有确认提交过的条件才能显示
          for (var j in $(".showSearch2").find('.bbb')) {
            if (this.value2[i] == $(".showSearch2").find('.bbb').eq(j).text()) {
              $(".showSearch2").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < this.value2.length; i++) {
          $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...');
          $(".tip2").text(this.value2.join(',').substring(0, 8) + '...');
          for (var j = 0; j < this.sxlistItem[2].item.length; j++) {
            if (this.value1[i] == this.sxlistItem[2].item[j].name) {
              idArr.push(this.sxlistItem[2].item[j].id)
            }
          }
        }
      },
      //发文单位正面筛选框 确认后保存状态
      xianshiTwo() {
        var arr = [];
        var idarr = [];
        for (var i in this.fawenStatus) {
          for (var j in this.fawenIdStatus) {
            if (this.fawenIdStatus[j] == this.fawenStatus[i]['id']) {
              //console.log(i, this.fawenStatus[i]['name'])
              arr.push(this.fawenStatus[i]['name']);
              idarr.push(this.fawenStatus[i]['id']);
            }
          }
        }
        for (let i in $(".showSearch1").find('.aaa')) {       //关闭当前筛选条件栏后 首先重置所有的选中样式
          $(".showSearch1").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
        }
        this.value1 = arr;
        this.trueFawenWord = arr;
        this.idarr1 = idarr;
        ////console.log("此时发文单位的文字arr为", this.value1, this.idarr1)
        //为点击确认按钮后的选中筛选条件显示
        for (var i = 0; i < this.value1.length; i++) {
          $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...');
          $(".tip1").text(this.value1.join(',').substring(0, 8) + '...');
        }
        if (this.value1.length == 0) {
          $(".search2").find('span').text('发文单位');
          $(".tip1").text('');
        }
        for (var i = 0; i < this.value1.length; i++) {       //然后 发文单位条件选中状态 只有确认提交过的条件才能显示
          for (var j in $(".showSearch1").find('.bbb')) {
            if (this.value1[i] == $(".showSearch1").find('.bbb').eq(j).text()) {
              $(".showSearch1").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < this.value1.length; i++) {
          $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...');
          $(".tip1").text(this.value1.join(',').substring(0, 8) + '...');
          for (var j = 0; j < this.sxlistItem[1].item.length; j++) {
            if (this.value1[i] == this.sxlistItem[1].item[j].name) {
              idArr.push(this.sxlistItem[1].item[j].id)
            }
          }
        }
      },
      //市场类型正面筛选框 确认后保存状态
      xianshiOne() {
        var arr = [];
        var idarr = [];
        for (var i in this.marketStatus) {
          for (var j in this.marketIdStatus) {
            if (this.marketIdStatus[j] == this.marketStatus[i]['id']) {
              //console.log('name++name', i, this.marketStatus[i]['name']);
              arr.push(this.marketStatus[i]['name']);
              idarr.push(this.marketStatus[i]['id']);
            }
          }
        }
        for (var i in $(".showSearch").find('.aaa')) {       //关闭当前筛选条件栏后 首先重置所有的选中样式
          $(".showSearch").find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
        }
        this.value0 = arr;
        this.trueMarketWord = arr;
        this.idarr0 = idarr;
        //console.log("此时市场类型的文字arr为", this.value0, this.idarr0);
        //为点击确认按钮后的选中筛选条件显示
        for (var i = 0; i < this.value0.length; i++) {
          $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...')
          $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
        }
        if (this.value0.length == 0) {
          $(".search1").find('span').text('市场类型');
          $(".tip").text('')
        }
        for (var i = 0; i < this.value0.length; i++) {       //然后 市场类型条件选中状态 只有确认提交过的条件才能显示
          for (var j in $(".showSearch").find('.bbb')) {
            if (this.value0[i] == $(".showSearch").find('.bbb').eq(j).text()) {
              $(".showSearch").find('.aaa').eq(j).attr('select', 'false').addClass('selected');
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < this.value0.length; i++) {
          $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...')
          $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
          for (var j = 0; j < this.sxlistItem[0].item.length; j++) {
            if (this.value0[i] == this.sxlistItem[0].item[j].name) {
              idArr.push(this.sxlistItem[0].item[j].id)
            }
          }
        }
      },
      // 路由传值 去空格加逗号
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
      // 筛选确认调用接口
      shaixuanY() {
        this.ruleslist = [];
        this.top = 1;
        this.shadowLoading = true;//加载中出现
        this.targetStr();
        this.allLoaded = true;
        this.lawScarch();
        this.value0text();
        this.value1text();
        this.value2text();
        this.value3text();
        console.log("00012301", this.value0.length, this.value2, this.value3, this.idarr0, this.idarr1, this.idarr2);
      },
      //
      loadMore() {
        this.shadowLoading = false;
        let lastValue = this.rulesListNum;
        if (lastValue < this.num) {
          this.loading = true;
          this.allLoadeded = true;
        } else {
          this.loading = false;
          this.allLoadeded = false;
          return
        }
        if (lastValue < this.num) {
          this.top += 1;
          this.targetStr();//防止参数错误
          this.lawScarch();
          this.yeahFlag = false; //滚动触发的确认方法 开关为fals
          this.onloadOpen = false;
          this.searchBoxTrue = true;
        }
        setTimeout(() => {
          this.allLoadeded = false;
          this.loading = false;
          this.searchBoxTrue = false;
        }, 1000)
      },
      // 时效性 回显状态
      value3text() {
        console.log("this.value3", this.value3);
        //console.log('sldkj', this.value3);
        if (this.value3 == [] && this.value3.length == 0) {
          $(".tip3").text('');
        } else {
          for (var i = 0; i < this.value3.length; i++) {
            $(".tip3").text(this.value3.join(',').substring(0, 8) + '...')
          }
        }
      },
      // 规则类别 回显状态
      value2text() {
        console.log("this.value2", this.value2);
        if (this.value2 == [] && this.value2.length == 0) {
          $(".search3").find('span').text('规则类别');
          $(".tip2").text('');
        } else {
          for (var i = 0; i < this.value2.length; i++) {
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...');
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...');
          }
        }
        //console.log("value2text", this.value2, idArr);
      },
      // 发文单位 回显状态
      value1text() {
        console.log("this.value1", this.value1);
        if (this.value1 == [] && this.value1.length == 0) {
          $(".search2").find('span').text('发文单位');
          $(".tip1").text('');
        } else {
          for (var i = 0; i < this.value1.length; i++) {
            $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...');
            $(".tip1").text(this.value1.join(',').substring(0, 8) + '...');
          }
        }
      },
      // 市场类型 回显状态
      value0text() {
        console.log("this.value0", this.value0);
        if (this.value0 == [] && this.value0.length == 0) {
          $(".search1").find('span').text('市场类型');
          $(".tip").text('');
          //console.log("-===----==>", this.value0);
        } else {
          for (var i = 0; i < this.value0.length; i++) {
            $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...');
            $(".tip").text(this.value0.join(',').substring(0, 8) + '...');
          }
        }
        // console.log("-----==>", this.value0, $(".search1").find('span').text());
      },
      //
      anlist() {
        //筛选 时间控件
        var user = "";
        if (/android/i.test(navigator.userAgent)) {
          //  android
          user = "1";
          $(".inputBox").css('width', '70%');
        }
        if (/ipad|iphone|mac/i.test(navigator.userAgent)) {
          //  ios
          user = "0";
          $(".inputBox").css('width', '65%');
        }
      },
      // 路由传值多个关键词拆分搜索
      multipleKeyRetrieval() {
        var titleI = [], contentI = [], key = "";
        if (window.localStorage.getItem("titleIME") == null) {
          //console.log("titleIME");
        } else {
          titleI = window.localStorage.getItem("titleIME").split("$#");
        }
        /**/
        if (window.localStorage.getItem("contentIME") == null) {
          //console.log("contentIME");
        } else {
          contentI = window.localStorage.getItem("contentIME").split("$#");
        }
        /**/
        if (window.localStorage.getItem("keyIME") == null) {
          //console.log("keyIME");
        } else {
          key = window.localStorage.getItem("keyIME");
        }
        /**/
        //console.log(titleI, contentI, key);
        /**/
        if (window.localStorage.getItem("colorBtn") == null) {
          //console.log("123colorBtn", 2132432523);
        } else {
          var colorBt = window.localStorage.getItem("colorBtn");
          var scolorBtn = colorBt.split("$#");
          if (scolorBtn[0] == "标题" && scolorBtn[1] == "精确") {
            if (titleI[0].indexOf(",") == -1) {
              this.titleKey = titleI[0].split(',');
            } else {
              this.titleKey = titleI[0].split(",");
            }
            //console.log("675657657", titleI[0]);
          } else if (scolorBtn[0] == "全文" && scolorBtn[1] == "精确") {
            if (contentI[0].indexOf(",") == -1) {
              this.titleKey = contentI[0].split(',');
            } else {
              this.titleKey = contentI[0].split(",");
            }
            //console.log("675657657", contentI[0]);
          } else {
            this.titleKey = key.split(",");
            //console.log("675657657", key.split(" "));
          }
        }
        //console.log("");
        var newTitleKey = this.titleKey.join(",").split(",");
        this.newTitleKey = newTitleKey;
        this.ImpArr(this.newTitleKey);//数组去除空元素
        /*this.titleIncludes = this.titleKey.join(",");*/
        //console.log(newTitleKey, "-------------", this.newTitleKey, this.titleKey, "=====", this.titleIncludes);
      },
      // 控制字块长度
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
      // 获取筛选
      preparation() {
        this.$axios.law.getalllmappingrules({}).then(res => {
          //this.fawenStatus //发文单位
          //this.guizeStatus  //规则类别筛选
          //this.marketStatus //板块
          //this.timeStatus  //有效期
          let content = res.data.returnObject;
          this.fawenStatus = content.filter((item) => {
            return item.mappingTypeLable === "organization";
          });
          this.guizeStatus = content.filter((item) => {
            return item.mappingTypeLable === "range";
          });
          this.marketStatus = content.filter((item) => {
            return item.mappingTypeLable === "market";
          });
          for (let i = 0; i < this.fawenStatus.length; i++) {
            let name = this.fawenStatus[i].mapplingVaule;
            if (name.length > 9) {
              name = name.substring(0, 9) + '...';
            }
            let obj = {id: this.fawenStatus[i].mappingOriginalItems[0].id, name: name};
            this.selectItems[1].item.push(obj);    //发文单位
            this.sxlistItem[1].item.push(obj)//筛选栏 发文单位
          }
          this.fawenStatus = this.sxlistItem[1].item;
          //
          for (let i = 0; i < this.marketStatus.length; i++) {
            let obj = {
              id: this.marketStatus[i].mappingOriginalItems[0].id,
              name: this.marketStatus[i].mapplingVaule
            };
            this.selectItems[0].item.push(obj);
            this.sxlistItem[0].item.push(obj)//规则类别
          }
          this.marketStatus = this.sxlistItem[0].item;
          //
          var sss = [];
          for (let i = 0; i < this.guizeStatus.length; i++) {
            sss.push(this.guizeStatus[i].mappingOriginalItems)
          }
          var strarr = [];
          for (let i = 0; i < sss.length; i++) {
            var idarr = [];
            for (let j = 0; j < sss[i].length; j++) {
              idarr.push(sss[i][j].id)
            }
            strarr.push(idarr.join(','));
          }
          var mappingOriginalItems = [], GZLBMapping = [];
          for (let j = 0; j < strarr.length; j++) {
            let obj = {
              "id": strarr[j],
              "name": this.guizeStatus[j].mapplingVaule,
            };
            mappingOriginalItems.push(obj);
            GZLBMapping.push(obj);
          }
          this.selectItems[2].item = mappingOriginalItems;
          this.sxlistItem[2].item = mappingOriginalItems;
          //
          var objy = [
            {"id": "现行有效", "name": "现行有效"},
            {"id": "部分失效", "name": "部分失效"},
            {"id": "待生效", "name": "待生效"},
            {"id": "失效", "name": "失效"},
          ];
          //因为新版没有有效期的参数
          this.selectItems[3].item = objy;
          this.sxlistItem[3].item = objy;
          this.timeStatus = objy;
          //console.log('<====筛选条件======>', this.marketStatus, this.fawenStatus, this.guizeStatus, this.selectItems[1].item, this.sxlistItem[2].item);
          //基础数据处理完成
          this.guizeStatus = mappingOriginalItems;
          this.guizeArr.push((GZLBMapping).splice(0, 14));
          this.guizeArr.push(GZLBMapping);
          this.guizeArr.push(GZLBMapping);
          this.guizeArr.push(GZLBMapping);
          //console.log('沪市主板规则类别', this.guizeArr[0]);
          this.guizeHu = mappingOriginalItems;
          this.guizeShen = mappingOriginalItems;
          this.guizeSGem = mappingOriginalItems;
          this.guizeSSme = mappingOriginalItems;
          this.guizeStatusA = mappingOriginalItems; //规则类别筛选匹配ShangHaiBoard(1/4)
          //console.log("=====>", this.guizeStatus, this.guizeStatusA);
        }).catch((err) => {
          //console.log(err);
        })
      },
      // 点击推荐使用高级搜索 弹出高级搜索侧边栏
      showSenior() {
        this.popupVisible = true;
      },
      //
      entryText() {
        let colorBtn = $('.rangeBtn div .colorBtn');
        let colorBtn2 = $('.rangeBtn_2 div .colorBtn');
        if (colorBtn.text() == "全文" && colorBtn2.text() == "精确") {
          $(".titleTip").hide();
        } else {
          if (this.titleIncludes.trim() == "" || this.titleIncludes.trim().length == 0) {
            $(".titleTip").show();
          } else {
            $(".titleTip").hide();
          }
        }
      },
      entryText1() {
        if (this.contentIncludes.trim() == "" || this.contentIncludes.trim().length == 0) {
          $(".titleTip1").show();
        } else {
          $(".titleTip1").hide();
        }
      },
      entrybug(event) {     //安卓弹起输入框时 隐藏确定重置按钮 footBtn
        var el = event.currentTarget;
        var elId = $(el)[0].id;
        this.$const.androidTop(elId);
      },
      hideMarket() {  //关闭侧边栏后发文单位筛选设置样式
        var marketText = $('.sxitemBox:nth-child(1)').find(".listText");
        var arr = [];
        var idarr = [];
        for (var i in this.marketStatus) {
          for (var j in this.marketIdStatus) {
            if (this.marketIdStatus[j] == this.marketStatus[i]['id']) {
              arr.push(this.marketStatus[i]['name']);
              idarr.push(this.marketStatus[i]['id']);
            }
          }
        }
        this.value0 = arr;
        if (arr.length == 0) {
          $(".search1").find('span').text('市场类型');
        }
        this.idarr0 = idarr;
        for (var i in marketText) {
          for (var j in arr) {
            if (marketText.eq(i).text() == arr[j]) {
              marketText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false');
            } else {
              marketText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
          }
        }
        console.log("this.marketIdStatus", this.marketStatus, this.marketIdStatus);
      },
      hideFawen() {
        var unitsText = $('.sxitemBox:nth-child(2)').find(".listText");
        var arr = [];
        var idarr = [];
        for (var i in this.fawenStatus) {
          for (var j in this.fawenIdStatus) {
            if (this.fawenIdStatus[j] == this.fawenStatus[i]['id']) {
              //console.log(i, this.fawenStatus[i]['name']);
              arr.push(this.fawenStatus[i]['name']);
              idarr.push(this.fawenStatus[i]['id']);
            }
          }
        }
        //console.log("this.fawenIdStatus==>", this.fawenStatus, this.fawenIdStatus);
        this.value1 = arr;
        if (arr.length == 0) {
          $(".search2").find('span').text('发文单位');
        }
        this.idarr1 = idarr;
        for (var i in unitsText) {
          for (var j in arr) {   //unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            if (unitsText.eq(i).text() == arr[j]) {
              unitsText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false'); //marketText.eq(i).text(),'应该是有样式的'
            } else {
              unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');// unitsText.eq(i).text(),'应该是没样式的'
            }
          }
        }
      },
      hideGuize() {
        var guizeText = $('.sxitemBox:nth-child(3)').find(".listText");
        var arr = [];
        var idarr = [];
        for (var i in this.guizeStatus) {
          for (var j in this.guizeIdStatus) {
            if (this.guizeIdStatus[j] == this.guizeStatus[i]['id']) {
              console.log("===123123===>", i, this.guizeStatus[i]['name']);
              arr.push(this.guizeStatus[i]['name']);
              idarr.push(this.guizeStatus[i]['id']);
            }
          }
        }
        //console.log("", guizeText,);
        this.value2 = arr;
        this.trueGuizeWord = arr;
        this.idarr2 = idarr;
        if (arr.length == 0) {
          $(".search3").find('span').text('规则类别')
        }
        for (var i in guizeText) {
          for (var j in arr) {   //unitsText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            if (guizeText.eq(i).text() == arr[j]) {
              guizeText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false'); //marketText.eq(i).text(),'应该是有样式的'
            } else {
              guizeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');// unitsText.eq(i).text(),'应该是没样式的'
            }
          }
        }
      },
      hideTime() {
        var timeText = $('.sxitemBox:nth-child(4)').find(".listText");
        var arr = [];
        var idarr = [];
        //console.log('时效性条件', this.timeStatus, this.timeIdStatus)
        for (var i in this.timeStatus) {
          for (var j in this.timeIdStatus) {
            if (this.timeIdStatus[j] == this.timeStatus[i]['id']) {
              arr.push(this.timeStatus[i]['name']);
              idarr.push(this.timeStatus[i]['id']);
            }
          }
        }
        this.value3 = arr;
        this.idarr3 = idarr;
        for (var i in timeText) {
          if (arr.length !== 0) {
            for (var j in arr) {
              if (timeText.eq(i).text() == arr[j]) {
                timeText.eq(i).parent().find('.itemTip').addClass('selected').attr('select', 'false'); //marketText.eq(i).text(),'应该是有样式的'
              }
            }
          } else {
            timeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            $(".tip3").text('');
          }
        }
        console.log("", this.value3, this.idarr3);
      },
      hideDate() {
        if (this.inputDateS == '') {
          this.timesClose1();
        }
        if (this.inputDateE == '') {
          this.timesClose2();
        }
      },
      //开始日期
      timeStart() {
        //console.log(this.timesDate1);
        if (this.timesDate1 != '' && this.timesDate1.indexOf("/") < -1) {
          console.log("==123", this.timesDate1);
        } else {
          var data1 = this.timesDate1.split("-").join("");
          this.dateARR = data1;
          console.log("this.timesDate1", this.timesDate1, data1);
        }
        //this.dateARR =
      },
      //结束日期
      timeEnd() {
        // console.log(this.timesDate2);
        if (this.timesDate2 != '' && this.timesDate2.indexOf("/") < -1) {
          console.log("==123", this.timesDate2);
        } else {
          var data2 = this.timesDate2.split("-").join("");
          this.dateARR2 = data2;
          console.log("this.timesDate2", this.timesDate2, data2);
        }
      },
      //
      timesClose1() {
        this.timesDate1 = '';
        this.dateARR = "";
      },
      //
      timesClose2() {
        this.timesDate2 = '';
        this.dateARR2 = "";
      },
      //关闭侧边筛选
      SXhide() {
        //筛选侧边栏hide
        this.popupVisible1 = false;
        /**/
        let stausArr1 = this.value0.concat(this.value1);
        let stausArr2 = this.value2.concat(this.value3);
        let stausArr = stausArr1.concat(stausArr2);
        if (stausArr.length == 0 && this.inputDateS == '' && this.inputDateE == '') {
          //console.log('没有筛选条件');
          this.redCircleDis = false;
        } else if (stausArr.length !== 0 || this.inputDateS !== '' || this.inputDateE !== '') {
          //console.log('筛选条件', stausArr[i]);
          this.redCircleDis = true;
        } else {
          this.redCircleDis = true;
        }
        /**/
        this.$nextTick(() => {
          this.value0text();
          this.value1text();
          this.value2text();
          this.value3text();

        });
        /*筛选按钮红点状态显示*/

        /**/
        console.log("===!", $(".search1").find('span').text(), $(".search2").find('span').text(), $(".search3").find('span').text());
      },
      //打开侧边筛选
      SXshow() {
        this.xianshi = false;
        this.xianshi1 = false;
        this.xianshi2 = false;
        this.frontStatus = false; //当侧边筛选栏显示出来之后，重置正面筛选栏状态
        this.popupVisible1 = true;//筛选侧边栏show
        $(".search-mrpx").removeClass('pass');
        this.showSearch = false;
        this.showSearch1 = false;
        this.showSearch2 = false;
        if (this.value3.length == 0) {
          $(".tip3").text('');
        } else {
          for (let i = 0; i < this.value3.length; i++) {
            $(".tip3").text(this.value3.join(',').substring(0, 8) + '...');
          }
        }
        console.log("=====>", this.value3);
        var unitsText = $('.sxitemBox:nth-child(2)').find(".listText");
        var guizeText = $('.sxitemBox:nth-child(3)').find(".listText");
        var marketText = $('.sxitemBox:nth-child(1)').find(".listText");
        this.$nextTick(() => {
          //console.log("规则类别数组--------", this.value2)
          for (let i = 0; i < this.value2.length; i++) {      //规则类别同步状态
            for (var j = 0; j < guizeText.length; j++) {
              if (this.value2[i] == guizeText.eq(j).text()) {
                guizeText.eq(j).parent().find('.itemTip').addClass('selected').attr('select', 'false');
              }
            }
          }
          var trueArr2 = [];            //侧边栏 规则类别属性select=false选中的数组
          for (let i = 0; i < guizeText.length; i++) {
            if (guizeText.eq(i).parent().find('.itemTip').attr('select') == 'false') {
              trueArr2.push(guizeText.eq(i).text());
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
          console.info(a3, a4, quchong1);
          quchong1.forEach(function (qitem, index, array) {
            if (a3.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              duo1.push(qitem);
            }
            if (a4.every(function (item, qindex, array) {
              return qitem != item;
            })) {
              shao1.push(qitem);
            }
          });
          console.info("a4比a3多的元素" + duo1, "少的元素" + shao1);
          for (let i = 0; i < guizeText.length; i++) {        //多余的数组元素 去掉选中状态
            if (guizeText.eq(i).text() == duo1) {
              guizeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
          }
          if (this.value2.length == 0) {        //规则类别数组为空时 去掉选中状态
            for (let i = 0; i < guizeText.length; i++) {
              guizeText.eq(i).parent().find('.itemTip').removeClass('selected').attr('select', 'true');
            }
            $(".tip2").text('');  //规则类别数组为空时 去掉提示信息
          }
        });
        this.$nextTick(() => {
          //console.log("发文单位数组--------", this.value1)
          for (var i = 0; i < this.value1.length; i++) {       //发文单位同步状态
            for (var j = 0; j < unitsText.length; j++) {
              if (this.value1[i] == unitsText.eq(j).text()) {
                unitsText.eq(j).parent().find('.itemTip').addClass('selected').attr('select', 'false');
              }
            }
          }
          var trueArr = [];             //侧边栏 发文单位属性select=false选中的数组
          for (var i = 0; i < unitsText.length; i++) {
            if (unitsText.eq(i).parent().find('.itemTip').attr('select') == 'false') {
              trueArr.push(unitsText.eq(i).text());
            }
          }
          //console.log('a1赋值的this.value1', this.value1);
          var a1 = this.value1;
          var a2 = trueArr;
          var shao = [];
          var duo = [];
          var hebing = a1.concat(a2);
          hebing.sort();
          hebing.reverse();
          var quchong = $.unique(hebing);
          console.info(a1, a2, quchong);
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
          console.info("a2比a1多的元素" + duo, "少的元素" + shao);
          //console.log('筛选打开这里的this.value1是', this.value1);
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
        });
        this.$nextTick(() => {
          for (var i = 0; i < this.value0.length; i++) {       //发文单位同步状态
            for (var j = 0; j < marketText.length; j++) {
              if (this.value0[i] == marketText.eq(j).text()) {
                marketText.eq(j).parent().find('.itemTip').addClass('selected').attr('select', 'false');
              }
            }
          }
          var trueArr = [];             //侧边栏 发文单位属性select=false选中的数组
          for (var i = 0; i < marketText.length; i++) {
            if (marketText.eq(i).parent().find('.itemTip').attr('select') == 'false') {
              trueArr.push(marketText.eq(i).text());
            }
          }
          var a1 = this.value0;
          var a2 = trueArr;
          var shao = [];
          var duo = [];
          var hebing = a1.concat(a2);
          hebing.sort();
          hebing.reverse();
          var quchong = $.unique(hebing);
          console.info(a1, a2, quchong);
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
          console.info("a2比a1多的元素" + duo, "少的元素" + shao);
          //console.log('筛选打开这里的this.value0是', this.value0)
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
        });
        this.hideTime();
      },
      SXReset(event) {     //筛选栏重置按钮
        var el = event.currentTarget;
        /**/
        this.value0 = [];
        this.value1 = [];
        this.value2 = [];
        this.value3 = [];
        this.idarr0 = [];
        this.idarr1 = [];
        this.idarr2 = [];
        this.idarr3 = [];
        this.guizeArr = [];
        this.gzObjarr = [];
        this.timesDate1 = '';
        this.timesDate2 = '';
        //console.log($(".sxLists").find('.itemTip').length);
        $(".sxLists").find('.itemTip').attr('select', 'true').removeClass('selected');
        $(".sxLists").find('.tipText').text('');
        $(".search3").find('span').text('规则类别');
        $(".search2").find('span').text('发文单位');
        $(".search1").find('span').text('市场类型');
        $("input[type=date]").val('');
      },
      //
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
        var idArr = [];
        for (var i = 0; i < this.value0.length; i++) {
          $(".tip").text(this.value0.join(',').substring(0, 8) + '...')
          for (var j = 0; j < this.sxlistItem[0].item.length; j++) {
            if (this.value0[i] == this.sxlistItem[0].item[j].name) {
              idArr.push(this.sxlistItem[0].item[j].id)
            }
          }
        }
        if (this.value0.length == 0) {
          $(".tip").text('')
        }
        this.idarr0 = idArr;
        //console.log('市场类型idArr', idArr)

        //若是在没有填写市场类型的情况下 先行填写了规则类别
        if (this.value0.length == 1) {
          var newidarr = [];
          //console.log("之前没填过市场类型")
          console.log("之前没填过市场类型", this.idarr2);
          for (var i = 0; i < this.value0.length; i++) {
            for (var j = 0; j < this.sxlistItem[0].item.length; j++) {
              if (this.value0[i] == this.sxlistItem[0].item[j].name) {
                for (var x = 0; x < this.guizeArr[j].length; x++) {
                  for (var y = 0; y < this.idarr2.length; y++) {
                    if (this.idarr2[y] == this.guizeArr[j][x].id) {
                      newidarr.push(this.idarr2[y]);
                    }
                  }
                }
              }
            }
          }
          this.idarr2 = newidarr;
          //console.log("经过市场类型筛选后的规则类别", this.idarr2)
        } else if (this.value0.length > 1) {
          var selectText = $(el).find('.listText').text()
          //console.log("增加市场类型,此时的规则类别id数组", this.idarr2)
          for (var i = 0; i < this.sxlistItem[0].item.length; i++) {
            if (selectText == this.sxlistItem[0].item[i].name) {
              for (var x = 0; x < this.guizeArr[i].length; x++) {
                for (var j = 0; j < this.value2.length; j++) {
                  if (this.guizeArr[i][x].name == this.value2[j]) {
                    this.idarr2.push(this.guizeArr[i][x].id)
                  }
                }
              }
            }
          }
        }
      },
      // 侧边筛选 时效性
      TimeSH(event) {
        var el = event.currentTarget;
        $(el).find('.itemTip').addClass('selected');
        if ($(el).find('.itemTip').attr('select') == 'true') {
          this.value3.push($(el).find('.listText').text());
          $(el).find('.itemTip').attr("select", 'false');
        } else if ($(el).find('.itemTip').attr('select') == 'false') {
          $(el).find('.itemTip').removeClass('selected');
          $(el).find('.itemTip').attr("select", 'true');
          for (var i = 0; i < this.value3.length; i++) {
            if ($(el).find('.listText').text() == this.value3[i]) {
              this.value3.splice(i, 1);
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < this.value3.length; i++) {
          $(".tip3").text(this.value3.join(',').substring(0, 8) + '...');
          for (var j = 0; j < this.sxlistItem[3].item.length; j++) {
            if (this.value3[i] == this.sxlistItem[3].item[j].name) {
              idArr.push(this.sxlistItem[3].item[j].id);
            }
          }
        }
        if (this.value3.length == 0) {
          $(".tip3").text('');
        }
        this.idarr3 = idArr;
        console.log('时效性idArr', this.value3, this.idarr3, idArr);
      },
      // 侧边栏规则类别选中
      SortSH(event) {
        var el = event.currentTarget;
        $(el).find('.itemTip').addClass('selected');
        //console.log('1111', $(el).find('.itemTip').attr('select'))
        if ($(el).find('.itemTip').attr('select') == 'true') {
          this.value2.push($(el).find('.listText').text());
          $(el).find('.itemTip').attr("select", 'false');
        } else if ($(el).find('.itemTip').attr('select') == 'false') {
          $(el).find('.itemTip').removeClass('selected');
          $(el).find('.itemTip').attr("select", 'true');
          for (var i = 0; i < this.value2.length; i++) {
            if ($(el).find('.listText').text() == this.value2[i]) {
              this.value2.splice(i, 1);
            }
          }
        }
        var idArr = [];
        ////console.log('市场类型', this.value0, '-----------', '规则类别数组', this.guizeArr);
        if (this.value0.length == 0) {
          ////console.log('并未选中市场类型')
          for (var i = 0; i < this.value2.length; i++) {
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...')
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
            for (var j = 0; j < this.guizeArr.length; j++) {
              for (var x = 0; x < this.guizeArr[j].length; x++) {
                if (this.value2[i] == this.guizeArr[j][x].name) {
                  var obj = {id: this.guizeArr[j][x].id, name: this.guizeArr[j][x].name};
                  this.gzObjarr.push(obj);
                  idArr.push(this.guizeArr[j][x].id);
                }
              }
            }
          }
          if (this.value2.length == 0) {
            $(".search3").find('span').text('规则类别');
            $(".tip2").text('');
          }
          ////console.log('未选中市场类型情况下', this.gzObjarr);
          this.idarr2 = idArr;
          ////console.log('规则类别idArr', this.idarr2);       //未选中市场类型情况下 规则类别的id数组
        } else {                                              //选中市场类型情况下 规则类别的id数组
          for (var i = 0; i < this.value2.length; i++) {
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...')
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...')
            for (var j = 0; j < this.guizeArr.length; j++) {
              for (var x = 0; x < this.guizeArr[j].length; x++) {
                if (this.value2[i] == this.guizeArr[j][x].name) {
                  var obj = {id: this.guizeArr[j][x].id, name: this.guizeArr[j][x].name};
                  this.gzObjarr.push(obj);
                  idArr.push(this.guizeArr[j][x].id);
                }
              }
            }
          }
          if (this.value2.length == 0) {
            $(".search3").find('span').text('规则类别');
            $(".tip2").text('');
          }
          ////console.log('未选中市场类型情况下', this.gzObjarr);
          this.idarr2 = idArr;
          ////console.log('选中状态开启!');
          for (var i = 0; i < this.value2.length; i++) { //首先循环选中状态的规则类别值
            $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...');
            $(".tip2").text(this.value2.join(',').substring(0, 8) + '...');
            for (var q = 0; q < this.sxlistItem[0].item.length; q++) {  //循环市场类型数组
              for (var n = 0; n < this.value0.length; n++) {      //循环是否选中的市场类型
                if (this.value0[n] == this.sxlistItem[0].item[q].name) {    //若选中市场类型则返回其在guizeArr中的下标值
                  ////console.log('选中的市场类型的下标值', q);
                  for (var j = 0; j < this.guizeArr[q].length; j++) { //然后循环选中的市场类型下的规则类别数组
                    if (this.value2[i] == this.guizeArr[q][j].name) {   //若选中规则类别值等于选中市场类型下规则类别数组的name值 返回其id值
                      var obj = {id: this.guizeArr[q][j].id, name: this.guizeArr[q][j].name};
                      this.gzObjarr.push(obj);
                      idArr.push(this.guizeArr[q][j].id);
                    }
                  }
                }
              }
            }
          }
          if (this.value2.length == 0) {
            $(".search3").find('span').text('规则类别');
            $(".tip2").text('');
          }
          ////console.log('-----------', this.gzObjarr);
          this.idarr2 = idArr;
          ////console.log('规则类别idArr:', this.idarr2);
          ////console.log('选中市场类型下的规则类别idArr', this.idarr2);
        }
      },
      //
      UnitSH(event) {
        var el = event.currentTarget;
        //console.log($(el));
        $(el).find('.itemTip').addClass('selected');
        //console.log('1111', $(el).find('.itemTip').attr('select'));
        if ($(el).find('.itemTip').attr('select') == 'true') {
          this.value1.push($(el).find('.listText').text());
          $(el).find('.itemTip').attr("select", 'false');
        } else if ($(el).find('.itemTip').attr('select') == 'false') {
          //console.log('2222', $(el).find('.itemTip').attr('select'));
          $(el).find('.itemTip').removeClass('selected');
          $(el).find('.itemTip').attr("select", 'true');
          for (var i = 0; i < this.value1.length; i++) {
            if ($(el).find('.listText').text() == this.value1[i]) {
              this.value1.splice(i, 1);
            }
          }
        }
        var idArr = [];
        for (var i = 0; i < this.value1.length; i++) {
          $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...');
          $(".tip1").text(this.value1.join(',').substring(0, 8) + '...');
          for (var j = 0; j < this.sxlistItem[1].item.length; j++) {
            if (this.value1[i] == this.sxlistItem[1].item[j].name) {
              idArr.push(this.sxlistItem[1].item[j].id);
            }
          }
        }
        if (this.value1.length == 0) {
          $(".search2").find('span').text('发文单位');
          $(".tip1").text('');
        }
        this.idarr1 = idArr;
        //console.log('发文单位idArr', idArr);
      },
      //
      showItem(i) {
        //let itemCon = $(".itemconBOX[isOpen]").eq(index);
        //console.log(itemCon.parent().find("i"));
        if ($(".itemconBOX[isOpen]").eq(i).attr('isOpen') == 'close') {
          $(".itemconBOX[isOpen]").eq(i).show().parent().siblings().find(".itemconBOX[isOpen]").hide();
          $(".itemconBOX[isOpen]").eq(i).attr('isOpen', 'open');
        } else {
          $(".itemconBOX[isOpen]").eq(i).hide();
          $(".itemconBOX[isOpen]").eq(i).attr('isOpen', 'close');
        }
        console.log($(".itemconBOX[isOpen]").eq(i).attr('isOpen'));
      },
      // 正面筛选条件 市场类型
      MRselect(event) {
        var el = event.currentTarget;
        $(el).find('.aaa').addClass('selected');
        if ($(el).find('.aaa').attr("select") == 'true') {
          this.value0.push($(el).find('.bbb').text());
          $(el).find('.aaa').attr("select", 'false');
        } else if ($(el).find('.aaa').attr("select") == 'false') {
          $(el).find('.aaa').removeClass('selected');
          for (var i = 0; i < this.value0.length; i++) {
            if ($(el).find('.bbb').text() == this.value0[i]) {
              this.value0.splice(i, 1);
            }
          }
          $(el).find('.aaa').attr("select", 'true');
        }
        var idArr = [];
        for (var i = 0; i < this.value0.length; i++) {
          $(".search1").find('span').text(this.value0[0].substring(0, 3) + '...');
          $(".tip").text(this.value0.join(',').substring(0, 8) + '...');
          for (var j = 0; j < this.sxlistItem[0].item.length; j++) {
            if (this.value0[i] == this.sxlistItem[0].item[j].name) {
              idArr.push(this.sxlistItem[0].item[j].id);
            }
          }
        }
        if (this.value0.length == 0) {
          $(".search1").find('span').text('市场类型');
          $(".tip").text('');
        }
        this.idarr0 = idArr;
        //console.log('市场类型idArr', idArr, this.value0, this.sxlistItem[0].item);

      },
      // 正面筛选条件 市场类型 重置
      MRreset(event) {
        var el = event.currentTarget;
        var father = $(el).parent().parent();
        for (var i in father.find('.aaa')) {
          if (father.find('.aaa').eq(i).attr('select') == 'false') {
            father.find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
        }
        this.value0 = [];
        this.idarr0 = [];//重置市场类型数组
        $(".search1").find('span').text('市场类型')
        ////console.log('12', this.guizeStatus);
      },
      // 正面筛选条件 规则类别
      GZselect(event) {
        /*this.frontStatus=true; */ //状态判断是正面筛选栏出来的条件 发文单位
        var el = event.currentTarget;
        $(el).find('.aaa').addClass('selected');
        if ($(el).find('.aaa').attr("select") == 'true') {
          this.value2.push($(el).find('.bbb').text());
          $(el).find('.aaa').attr("select", 'false');
        } else if ($(el).find('.aaa').attr("select") == 'false') {
          $(el).find('.aaa').removeClass('selected');
          for (var i = 0; i < this.value2.length; i++) {
            if ($(el).find('.bbb').text() == this.value2[i]) {
              this.value2.splice(i, 1);
            }
          }
          $(el).find('.aaa').attr("select", 'true');
        }
        //console.log('选中数组', this.value2);
        var idArr = [];
        for (var i = 0; i < this.value2.length; i++) {
          $(".search3").find('span').text(this.value2[0].substring(0, 3) + '...');
          $(".tip").text(this.value2.join(',').substring(0, 8) + '...');
          for (var j = 0; j < this.sxlistItem[2].item.length; j++) {
            if (this.value2[i] == this.sxlistItem[2].item[j].name) {
              idArr.push(this.sxlistItem[2].item[j].id);
            }
          }
        }
        if (this.value2.length == 0) {
          $(".search3").find('span').text('规则类别');
          $(".tip2").text('');
        }
        this.idarr2 = idArr;
        this.idarr2 = $.unique(this.idarr2);
        //console.log('点击选择的规则类别idArr:', idArr, this.sxlistItem[2].item, this.value2, this.idarr2);
      },
      // 正面筛选条件 规则类别 重置
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
        this.idarr2 = [];//重置规则类别数组
        $(".search3").find('span').text('规则类别');
        this.redCircleStatus();
      },
      // 没有筛选条件的时候让小红点消失
      redCircleStatus() {
        let stausArr1 = this.value0.concat(this.value1);
        let stausArr2 = this.value2.concat(this.value3);
        let stausArr = stausArr1.concat(stausArr2);
        if (stausArr.length == 0 && this.inputDateS == '' && this.inputDateE == '') {
          this.redCircleDis = false;
        } else {
          this.redCircleDis = true;
        }
        //console.log("redCircleStatus===>",stausArr,this.inputDateS,this.inputDateE);
      },
      // 正面筛选条件 发文单位
      select(event) {
        /*this.frontStatus=true; */ //状态判断是正面筛选栏出来的条件 发文单位
        var el = event.currentTarget;
        $(el).find('.aaa').addClass('selected');
        if ($(el).find('.aaa').attr("select") == 'true') {
          this.value1.push($(el).find('.bbb').text());
          $(el).find('.aaa').attr("select", 'false');
        } else if ($(el).find('.aaa').attr("select") == 'false') {
          $(el).find('.aaa').removeClass('selected');
          for (var i = 0; i < this.value1.length; i++) {
            if ($(el).find('.bbb').text() == this.value1[i]) {
              this.value1.splice(i, 1);
            }
          }
          $(el).find('.aaa').attr("select", 'true');
        }
        var idArr = [];
        for (var i = 0; i < this.value1.length; i++) {
          $(".search2").find('span').text(this.value1[0].substring(0, 3) + '...');
          $(".tip1").text(this.value1.join(',').substring(0, 8) + '...');
          for (var j = 0; j < this.sxlistItem[1].item.length; j++) {
            if (this.value1[i] == this.sxlistItem[1].item[j].name) {
              idArr.push(this.sxlistItem[1].item[j].id);
            }
          }
        }
        if (this.value1.length == 0) {
          $(".search2").find('span').text('发文单位');
          $(".tip1").text('');
        }
        this.idarr1 = idArr;
        //console.log('发文单位', this.value1, idArr, this.sxlistItem[1].item);
      },
      // 正面筛选条件 发文单位 重置
      reset(event) {  //重置发文单位筛选条件
        this.fawenStatus = [];//重置保存发文单位的筛选条件
        this.fawenIdStatus = [];
        this.yeahFlag = false; //重置后确认按钮恢复为false
        var el = event.currentTarget;
        var father = $(el).parent().parent();
        for (var i in father.find('.aaa')) {
          if (father.find('.aaa').eq(i).attr('select') == 'false') {
            father.find('.aaa').eq(i).attr('select', 'true').removeClass('selected');
          }
        }
        this.value1 = [];
        this.idarr1 = [];//重置发文单位数组
        $(".search2").find('span').text('发文单位');
        this.redCircleStatus();
      },
      // 筛选\高级\初始化\控制的ajax
      lawScarch() {        //点击确定发送请求数据
        this.noInfoShow = false;
        $("#LoadScroll").css("margin-bottom", "0.8rem");
        this.gunflag = false;
        this.yeahFlag = true; //点击确认按钮后 yeahFlag开关打开 此时还有一种情况为加载更多的触发情况
        var markerIds = this.idarr0.join(',');
        var unitIds = this.idarr1.join(','); //发文单位
        this.idarr2 = this.$array.unique(this.idarr2);
        var cateIds = this.idarr2.join(',');
        var idarr3Id = this.$array.ImpArr(this.idarr3);
        var timelinessIds = idarr3Id.join(',');
        //console.log("====", idarr3Id, this.idarr3, timelinessIds);
        //规则类别id值 如果只选了市场类型 cateIds就填市场类型的id  如果市场类型和规则类别都填了 cateIds只写规则类别的id
        //console.log('this.idarr0', this.idarr0,"this.idarr1",this.idarr1, 'this.idarr2', this.idarr2);
        /**/
        let releaseStart = this.timesDate1;
        let releaseEnd = this.timesDate2;
        this.timesDate1 ? releaseStart = this.timesDate1 : releaseStart = "";
        this.timesDate2 ? releaseEnd = this.timesDate2 : releaseEnd = "";
        if (releaseStart.indexOf("-") > -1) {
          console.log("====1=>");
        } else {
          releaseStart = "";
        }
        if (releaseEnd.indexOf("-") > -1) {
          console.log("====2=>");
        } else {
          releaseEnd = "";
        }
        //console.log("=====>", this.timesDate1, this.timesDate2, releaseStart, releaseEnd);
        if (Array.isArray(this.titleIncludes)) {
          this.titleIncludes = this.titleIncludes.join(",");
        }
        let params = {
            pageNo: this.top,//页码
            pageSize: this.bottom,//每页行数
            unitIds: unitIds,//发文单位
            timelinessIds: timelinessIds,//时效性
            sortType: this.sortType,//搜索排序，时间排序time
            releaseStart: releaseStart,//发布日期（起）
            releaseEnd: releaseEnd,//发布日期（止）
            scopeId: markerIds,
            cateIds: cateIds,//分类ID
            titleIncludes: this.titleIncludes,//标题包含
            titleExcludes: this.titleExcludes,//标题不包含
            titleMaybeIncludes: this.titleMaybeIncludes,//标题可能包含
            fullTextIncludes: this.contentIncludes,//正文包含
            fullTextExcludes: this.contentExcludes,//正文不包含
            fullTextMaybeIncludes: this.contentMaybeIncludes,//正文可能包含
            type: "law",//类型, law, case, qa, 默认是law
            key: this.keys,
          }
        /**/
        /*********************高级选项*************************/
        this.$axios.law.search(params).then(res => {
          //console.log('返回结果', res);
          //保存筛选条件状态
          this.fawenIdStatus = this.idarr1;     // 保存 提交的发文单位的筛选条件
          this.guizeIdStatus = this.idarr2;  //保存 提交的规则类别的筛选条件
          this.timeIdStatus = timelinessIds.split(','); //保存 提交的时效性的筛选条件
          this.marketIdStatus = this.idarr0; //保存 提交的市场类型的筛选条件
          releaseStart ? this.inputDateS = releaseStart : this.inputDateS = "";
          releaseEnd ? this.inputDateE = releaseEnd : this.inputDateE = "";
          //this.inputDateE = releaseEnd;
          this.yeahFlag = false; //点击确认按钮获取到内容后 yeahFlag开关关闭false
          if (res.data.returnCode == 1) {
            this.onloadOpen = true;//返回内容后 打开上滑加载的开关
            if (res.data.returnObject.list == null || res.data.returnObject.list == []) {
              this.noInfoShow = true;
            } else {
              this.noInfoShow = false;//有筛选结果的提示页面消失
            }
            if (res.data.returnObject.count == "" || res.data.returnObject.count == null) {
              this.num = 0;
            } else {
              this.num = res.data.returnObject.count;
            }
            //res.data.returnObject.count ? this.num = res.data.returnObject.count : this.num = 0;
            if (this.num < 5) {
              this.allLoaded = false;
              this.infLoading = false;
            } else {
              this.infLoading = true;
            }
            this.Number = res.data.returnObject.count;
            if (this.Number >= 30) {
              $('.showPrompt').css('opacity', 1);
              setTimeout(() => {
                $('.showPrompt').animate({bottom: "0px", opacity: 0});
              }, 2500);
            } else {
              $('.showPrompt').css('opacity', 0);
              setTimeout(() => {
                $('.showPrompt').animate({bottom: "0px", opacity: 0});
              }, 1000);
            }
            /**/
            let colorBtn = $('.rangeBtn div .colorBtn').text();
            if (this.Number <= 3 && colorBtn == '标题') {
              //如果筛选的结果小于3条 显示提示高级搜索
              this.seniorTextShow = true;
            } else if (this.Number <= 3 && colorBtn == '全文') {
              this.seniorTextShow = false;
            } else {
              this.seniorTextShow = false;
            }
            console.log(this.num, colorBtn);
            this.shadowLoading = false;//加载中消失
            this.allLoaded = true;
            let content = res.data.returnObject.list;
            this.ruleslist = this.$array.loadMore(this.ruleslist, content); //数据push
            if (this.seniorTextShow === false && content == null) {
              this.noInfoShow = true;
            }
            /**/
            this.rulesListNum = this.ruleslist.length;
            //关闭当前栏目
            $(".search-mrpx").removeClass('pass');
            this.showSearch1 = false;//发文单位的显示
            this.xianshi1 = false;
            this.showSearch2 = false;//规则类别的显示
            this.xianshi2 = false;
            this.showSearch = false; //市场类型的显示
            this.xianshi = false;
            this.popupVisible1 = false;
            /*筛选按钮红点状态显示*/
            let stausArr1 = this.value0.concat(this.value1);
            let stausArr2 = this.value2.concat(this.value3);
            let stausArr = stausArr1.concat(stausArr2);
            console.log("=2=1=", this.value0, this.value1, this.value2, this.value3);

            if (stausArr.length == 0 && this.inputDateS == '' && this.inputDateE == '') {
              this.redCircleDis = false;
            } else {
              // && this.frontStatus== false  加上这个条件是区别正面筛选条件和侧边栏筛选条件
              this.redCircleDis = true;
              this.xianshiOne();
              this.xianshiTwo();
              this.xianshiThree();
              this.SXhide();
            }
          } else if (res.data.returnCode == -1) {
            this.shadowLoading = false;//加载中消失
            //关闭当前栏目
            $(".search-mrpx").removeClass('pass');
            this.showSearch1 = false;
            this.xianshi1 = false;
            this.showSearch2 = false;
            this.xianshi2 = false;
            this.showSearch = false;
            this.xianshi = false;
            this.popupVisible1 = false;
            /* $(".shadow").hide();*/
            this.noInfoShow = true;//没有筛选结果的提示页面显示
            this.seniorTextShow = false; // "flex"  6.1版本苹果机上 文字提示信息 上拉出现bug
            this.num = 0;
          }
        }).catch((err) => {
          setTimeout(() => {
            this.shadowLoading = false;
          }, 500);
          this.noInfoShow = true;
        });
        //同步筛选栏 发文单位-规则类别 数据
        this.popupVisible1 = false;
        this.InsideAndOutside();
      },
      //筛选数据
      InsideAndOutside() {
        var showText = $(".showSearch1").find('.bbb');
        for (var i = 0; i < this.value1.length; i++) {
          for (var j = 0; j < showText.length; j++) {
            if (this.value1[i] == showText.eq(j).text()) {
              showText.eq(j).parent().find('.aaa').addClass('selected').attr('select', 'false');
            }
          }
        }
        var trueArr = [];
        for (var i = 0; i < showText.length; i++) {
          if (showText.eq(i).parent().find('.aaa').attr('select') == 'false') {
            trueArr.push(showText.eq(i).text());
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
              guizeText.eq(j).parent().find('.aaa').addClass('selected').attr('select', 'false');
            }
          }
        }
        var trueArr2 = [];            //侧边栏 规则类别属性select=false选中的数组
        for (var i = 0; i < guizeText.length; i++) {
          if (guizeText.eq(i).parent().find('.aaa').attr('select') == 'false') {
            trueArr2.push(guizeText.eq(i).text());
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
        quchong1.forEach(function (qitem, index, array) {
          if (a3.every(function (item, qindex, array) {
            return qitem != item;
          })) {
            duo1.push(qitem);
          }
          if (a4.every(function (item, qindex, array) {
            return qitem != item;
          })) {
            shao1.push(qitem);
          }
        });
        for (var i = 0; i < guizeText.length; i++) {        //多余的数组元素 去掉选中状态
          for (var j = 0; j < duo1.length; j++) {
            if (guizeText.eq(i).text() == duo1[j]) {
              guizeText.eq(i).parent().find('.aaa').removeClass('selected').attr('select', 'true');
            }
          }
        }
      },
      /* //控制 默认排序筛选栏 显示隐藏*/
      newBtnArr(str) {
        if (str.length >= 10) {
          return str = str.substring(0, 10) + '...';
        } else {
          return str
        }
      },
      //搜索时候将关键词用逗号拼接
      targetStr() {
        if (this.titleIncludes.trim().indexOf(" ") !== -1) {
          this.titleIncludes = this.titleIncludes.split(" ").join(",");
        }
        if (this.titleMaybeIncludes.trim().indexOf(" ") !== -1) {
          this.titleMaybeIncludes = this.titleMaybeIncludes.split(" ").join(",");
        }
        if (this.titleExcludes.trim().indexOf(" ") !== -1) {
          this.titleExcludes = this.titleExcludes.split(" ").join(",");
        }
        if (this.contentIncludes.trim().indexOf(" ") !== -1) {
          this.contentIncludes = this.contentIncludes.split(" ").join(",");
        }
        if (this.contentMaybeIncludes.trim().indexOf(" ") !== -1) {
          this.contentMaybeIncludes = this.contentMaybeIncludes.split(" ").join(",");
        }
        if (this.contentExcludes.trim().indexOf(" ") !== -1) {
          this.contentExcludes = this.contentExcludes.split(" ").join(",");
        }
      },
      key(str) {
        var hei = this.$refs.rulesListBoxDom.clientWidth;
        var nowH = parseInt((hei - 39) / 16) * 2;
        if (str.length >= nowH) {
          str = str.substring(0, nowH) + '...';
        }
        var ar = this.Newarr.join(",");
        var strin = ar + "," + this.contentIncludes + "," + this.titleIncludes;
        var array = strin.split(",");
        this.ImpArr(array);//数组去除空元素
        array = this.$array.unique(array);
        for (var i = 0; i < array.length; i++) {
          var fen = str.split(array[i]);
          str = fen.join('<span style="color: #ffc051;">' + array[i] + '</span>');
        }
        return str;
      },
      unique(arr) {//数组去重
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
      show() {
        //console.log('LLLLLLLLLLLLLL', this.selectItems);
        /*if (this.loading == false) { ////加载完成点击生效 evans for 10，11 15：16*/
        if (this.xianshi == true) {
          this.xianshi = false;
          this.showSearch = false;
          //console.log(this.xianshi);
        } else if (this.xianshi == false) {
          this.xianshi = true;
          this.xianshi1 = false;
          this.xianshi2 = false;
          var showHei = (this.$refs.rulesListBoxDom.clientHeight) - ($('.searchs').outerHeight()) - ($('.searchBox').outerHeight()) + 'px'
          $(".showSearch").height(showHei);  //默认排序显示
          this.showSearch = true;
          this.showSearch1 = false;  //隐藏发文单位
          this.showSearch2 = false;   //隐藏规则类别
        }
        $('.itembox .item:last-child').find('.itemHline').hide();
        if ((this.selectItems[0].item).length % 2 !== 0) {
          $('.showSearch .item:last-child').css('width', '100%')
        }
        /*}*/
      },
      show2() {          //控制 发文单位筛选栏 显示隐藏
        /*if (this.loading == false) { ////加载完成点击生效 evans for 10，11 15：16*/
        if (this.xianshi1 == true) {
          this.xianshi1 = false
          this.showSearch1 = false; //发文单位筛选栏 隐藏
        } else if (this.xianshi1 == false) {
          this.xianshi1 = true;
          this.xianshi = false;
          this.xianshi2 = false;
          var showHei = (this.$refs.rulesListBoxDom.clientHeight) - ($('.searchs').outerHeight()) - ($('.searchBox').outerHeight()) + 'px'
          $(".showSearch1").height(showHei);
          this.showSearch1 = true;
          //发文单位筛选条件显示  默认排序规则类别筛选条件隐藏
          this.showSearch = false;   //隐藏默认排序
          this.showSearch2 = false;  //隐藏规则类别
        }
        $('.itembox .item:last-child').find('.itemHline').hide();
        if ((this.sxlistItem[1].item).length % 2 !== 0) {
          $('.showSearch1 .item:last-child').css('width', '100%')
        }
        /*}*/
      },
      show3() {        //控制 规则类别筛选栏  显示隐藏
        /*if (this.loading == false) { //加载完成点击生效 evans for 10，11 15：16*/
        if (this.xianshi2 == true) {
          this.xianshi2 = false;
          this.showSearch2 = false;
        } else if (this.xianshi2 == false) {
          this.xianshi2 = true;
          this.xianshi = false;
          this.xianshi1 = false;
          var showHei = ((this.$refs.rulesListBoxDom.clientHeight) - ($('.searchs').outerHeight()) - ($('.searchBox').outerHeight())) + 'px';
          $(".showSearch2").height(showHei);//显示规则类别
          this.showSearch2 = true;
          this.showSearch = false;    // 隐藏默认排序
          this.showSearch1 = false;   //隐藏发文单位
        }
        $('.itembox .item:last-child').find('.itemHline').hide();
        if ((this.sxlistItem[2].item).length % 2 !== 0) {
          $('.showSearch2 .item:last-child').css('width', '100%')
        }
        /*}*/
      },
//+++++++++++++++++++++++++++++++++++++++++//
      //高级默认状态
      sea() {
        if ($('.rangeBtn div .colorBtn').text() === '标题' && $('.rangeBtn_2 div .colorBtn').text() === '精确') {
          this.seaColor_();
          var aas = this.Newarr.join(' ');
          this.titleIncludes = aas;
          //console.log(aas, this.titleIncludes);
        }
      },
      //默认
      seaColor_() {
        $(".titleTip1").hide();
        $('.searchCont').css('color', '#8d8d8d');
        $('.serachCont input').css("border-color", "#8d8d8d");
        $('.serachCont').css('opacity', '0.5');
        $('.serachCont .inputCont').attr('disabled', true);
        $('.serachTitle').css('opacity', '1');
        $('.serachTitle .inputTil').attr('disabled', false);
        $(".rangeBtn4").addClass("rangeBtnHide");
        $('.serachTitle input').css("border-color", "#8d8d8d");
      },
      sea1() {
        this.seaColor_1();
        let colorBtn2 = $('.rangeBtn_2 div .colorBtn');
        if (colorBtn2.text() == '精确') {
          if (this.contentIncludes.trim().length !== 0) {
            this.titleIncludes = this.contentIncludes;
          } else {
            var titleIncludes = this.Newarr.join(" ");
            this.titleIncludes = titleIncludes;
          }
          /**/
          if (this.contentMaybeIncludes.trim().length !== 0) {
            this.titleMaybeIncludes = this.contentMaybeIncludes;
          }
          /**/
          if (this.contentExcludes.trim().length !== 0) {
            this.titleExcludes = this.contentExcludes;
          }
          /**/
          this.contentIncludes = "";
          this.contentMaybeIncludes = "";
          this.contentExcludes = "";
          /**/
        } else {
          //console.log('错误');
        }
        /**/
        //console.log("1232131231231", colorBtn2.text(), $('.rangeBtn div .colorBtn').text());
      },
      seaColor_1() {
        $('.serachTitle input').css("border-color", "#8d8d8d");
        $('.serachCont input').css("border-color", "#8d8d8d");
        $('.searchCont').css('color', '#8d8d8d');
        $('.rangeBtn1').addClass('colorBtn');
        $('.rangeBtn2').removeClass('colorBtn');
        $('.rangeBtn3').addClass('colorBtn');
        $(".rangeBtn4").addClass("rangeBtnHide").removeClass("colorBtn");
        $('.serachCont').css('opacity', '0.5');
        $('.serachCont .inputCont').attr('disabled', true);
        $('.serachTitle').css('opacity', '1');
        $('.serachTitle .inputTil').attr('disabled', false);

        $(".titleTip1").hide();
      },
      sea2() {
        $('.rangeBtn2').addClass('colorBtn');
        $('.rangeBtn1').removeClass('colorBtn');
        let colorBtn2 = $('.rangeBtn_2 div .colorBtn');
        let colorBtn = $('.rangeBtn div .colorBtn');
        if (colorBtn2.text() == '精确') {
          if (this.titleIncludes.trim().length !== 0) {
            this.contentIncludes = this.titleIncludes.trim();
          } else {
            var aa = this.Newarr.join(' ');
            this.contentIncludes = aa.trim();
          }
          /**/
          if (this.titleMaybeIncludes.trim().length !== 0) {
            this.contentMaybeIncludes = this.titleMaybeIncludes.trim();
          }
          /**/
          if (this.titleExcludes.trim().length !== 0) {
            this.contentExcludes = this.titleExcludes.trim();
          }
          /**/
          this.titleIncludes = "";//标题必须包含
          this.titleMaybeIncludes = ""; //标题可能包含
          this.titleExcludes = ""; //标题不包含
          this.seaColor2_1();
        } else if (colorBtn2.text() == '模糊') {
          this.seaColor2_2();
        }
        this.entryText();
        //console.log(colorBtn2.text(), colorBtn.text());
      },
      seaColor2_1() {
        $('.searchTitle').css('color', '#8d8d8d');
        $(".rangeBtn4").removeClass("rangeBtnHide");
        $('.serachCont').css('opacity', '1');
        $('.serachCont .inputCont').attr('disabled', false);
        $('.serachTitle').css('opacity', '1');
        $('.serachTitle .inputTil').attr('disabled', false);
      },
      seaColor2_2() {
        $('.searchTitle').css('color', '#8d8d8d');
        $('.searchCont').css('color', '#8d8d8d');
        $(".rangeBtn4").removeClass("rangeBtnHide");
        $('.serachCont').css('opacity', '0.5');
        $('.serachCont .inputCont').attr('disabled', true);
        $('.serachTitle').css('opacity', '0.5');
        $('.serachTitle .inputTil').attr('disabled', true);
        $('.serachTitle input').css("border-color", "#8d8d8d");
        $('.serachCont input').css("border-color", "#8d8d8d");
      },
      sea3() {
        let colorBtn = $('.rangeBtn div .colorBtn');
        $('.rangeBtn3').addClass('colorBtn');
        $('.rangeBtn4').removeClass('colorBtn');
        if (colorBtn.text() == '标题') {
          var nsw = this.Newarr.join(" ");
          this.titleIncludes = nsw;
          this.seaColor3_1();
        } else if (colorBtn.text() == '全文') {
          if (this.titleIncludes.trim().length !== 0) {
            this.contentIncludes = this.titleIncludes;
          } else {
            var aa = this.Newarr.join(' ');
            this.contentIncludes = aa;
          }
          this.titleIncludes = "";//标题必须包含
          this.titleMaybeIncludes = ""; //标题可能包含
          this.titleExcludes = ""; //标题不包含
          this.seaColor3_2();
        }
        this.entryText();
        //console.log(colorBtn.text());
        //console.log($('.rangeBtn_2 div .colorBtn').text());
      },
      seaColor3_1() {
        $('.searchCont').css('color', '#8d8d8d');
        $('.serachCont').css('opacity', '0.5');
        $('.serachCont .inputCont').attr('disabled', true);
        $('.serachTitle').css('opacity', '1');
        $('.serachTitle .inputTil').attr('disabled', false);
        $('.serachTitle input').css("border-color", "#8d8d8d");
        $('.serachCont input').css("border-color", "#8d8d8d");
      },
      seaColor3_2() {
        $('.searchTitle').css('color', '#8d8d8d');
        $(".rangeBtn4").removeClass("rangeBtnHide");
        $('.serachCont').css('opacity', '1');
        $('.serachCont .inputCont').attr('disabled', false);
        $('.serachTitle').css('opacity', '1');
        $('.serachTitle .inputTil').attr('disabled', false);
        $('.serachTitle input').css("border-color", "#8d8d8d");
        $('.serachCont input').css("border-color", "#8d8d8d");
      },
      sea4() {
        let colorBtn = $('.rangeBtn div .colorBtn');
        if (colorBtn.text() == "标题") {
          //console.log("标题没模糊");
        } else {
          this.titleIncludes = "";
          this.contentIncludes = "";
          this.titleMaybeIncludes = ""; //标题可能包含
          this.titleExcludes = ""; //标题不包含
          this.contentMaybeIncludes = "";
          this.contentExcludes = "";
          this.sw = 1;
          this.matter();
          this.seaColor4_();
        }
        //console.log("模糊");
      },
      seaColor4_() {
        $(".titleTip").hide();
        $(".titleTip1").hide();
        $('.rangeBtn4').addClass('colorBtn').removeClass("rangeBtnHide");
        $('.rangeBtn3').removeClass('colorBtn');
        $('.rangeBtn1').removeClass('colorBtn');
        $('.rangeBtn2').addClass('colorBtn');
        $('.serachCont').css('opacity', '0.5');
        $('.serachCont .inputCont').attr('disabled', true);
        $('.serachTitle').css('opacity', '0.5');
        $('.serachTitle .inputTil').attr('disabled', true);
        $('.serachTitle input').css("border-color", "#8d8d8d");
        $('.serachCont input').css("border-color", "#8d8d8d");
      },
      //高级的确认提交
      searchMany() {
        $('input').blur();
        var topBtn = $('.rangeBtn div .colorBtn').text();
        var buttonBtn = $('.rangeBtn_2 div .colorBtn').text();
        //console.log("(的撒大苏打);", topBtn, buttonBtn);
        this.redCircleExpert = false;
        window.localStorage.setItem("BtnMany", topBtn + "$#" + buttonBtn);
        //
        if (topBtn === '标题' && buttonBtn === '精确') {
          this.keys = "";
          //console.log("标题,精确：" + this.titleIncludes);
          if (this.titleIncludes.trim().length === 0) {
            //console.log("必须包含项必填");
            $(".titleTip").show();
            $('#mustInput').focus();
          } else {
            this.shadowLoading = true;//加载中出现
            $(".titleTip").hide();
            if (this.titleIncludes.trim().indexOf(" ") !== -1 || this.titleMaybeIncludes.trim().indexOf(" ") !== -1 || this.titleExcludes.trim().indexOf(" ") !== -1) {
              //console.log("有空格" + "三个都不符合");
              ////转换成数组后去除空元素在用逗号拼接
              var tilIn = this.titleIncludes.trim().split(' ');
              this.ImpArr(tilIn);
              this.Newarr = [];
              this.Newarr = tilIn;
              this.titleIncludes = tilIn.join(",");
              //console.log(this.titleIncludes);
              //转换成数组后去除空元素在用逗号拼接
              var tilMaBe = this.titleMaybeIncludes.trim().split(" ");
              this.ImpArr(tilMaBe);
              this.titleMaybeIncludes = tilMaBe.join(",");
              //console.log(this.titleMaybeIncludes);
              //转换成数组后去除空元素在用逗号拼接
              var tilEx = this.titleExcludes.trim().split(" ");
              this.ImpArr(tilEx);
              this.titleExcludes = tilEx.join(',');
              //console.log(this.titleExcludes);
              //
              /* this.popupVisible = false;*/
              //document.querySelector('.showOp').style.display = 'none';
              this.Newarr = [];
              this.Newarr = this.titleIncludes.trim().split(',');//转数组
            } else {
              //console.log("三个有一个符合就执行");
              this.titleMaybeIncludes = this.titleMaybeIncludes.trim().split(" ").join(",");
              //console.log(this.titleMaybeIncludes);
              this.titleExcludes = this.titleExcludes.trim().split(" ").join(",");
              //console.log(this.titleExcludes);
              if (this.titleIncludes.trim().indexOf(" ") !== -1) {
                this.Newarr = [];
                this.titleIncludes = this.titleIncludes.trim().split(' ');
                this.Newarr = this.titleIncludes;
                //console.log("1435" + this.titleIncludes);
              } else {
                this.Newarr = [];
                this.Newarr.unshift(this.titleIncludes);
              }
            }
            if (this.titleMaybeIncludes !== '' || this.titleExcludes !== '') {
              this.redCircleExpert = true;
            }
            this.FSAjax();
          }
          // 全文\模糊\触发
        } else if (topBtn === '全文' && buttonBtn === '模糊') {
          this.redCircleExpert = true;
          this.shadowLoading = true;//加载中出现
          //console.log("全文,模糊" + this.titleIncludes);
          var thnews = this.Newarr.join(",");
          this.keys = thnews;
          this.titleIncludes = '';
          //console.log("值" + this.keys);
          this.FSAjax();
          //全文\精确\触发
          //
        } else if (topBtn === '全文' && buttonBtn === '精确') {
          this.keys = "";
          if (this.contentIncludes.trim().length === 0) {
            //console.log("必填");
            $('.titleTip1').show();
          } else {
            this.redCircleExpert = true;
            //console.log("1461", this.keys, this.titleIncludes, this.titleMaybeIncludes, this.titleExcludes);
            //////
            this.shadowLoading = true;//加载中出现
            if (this.titleIncludes) {

            }
            // this.contentIncludes
            var contIn = '';
            if (this.contentIncludes.trim().indexOf(" ") !== -1) {
              //console.log("全文必包含" + "有空格");
              contIn = this.contentIncludes.trim().split(" ");
              this.ImpArr(contIn);//去除空格
              this.Newarr = [];//
              this.Newarr = contIn;
              this.contentIncludes = contIn.join(",");
              //console.log("this.contentIncludes", this.contentIncludes);
            } else {
              contIn = this.contentIncludes.trim().split(" ");
              this.ImpArr(contIn);
              this.Newarr = [];
              this.Newarr = contIn;
            }
            // this.contentMaybeIncludes
            if (this.contentMaybeIncludes.trim().indexOf(" ") !== -1) {
              //console.log("全文可能包含" + "有空格");
              var contMaBe = this.contentMaybeIncludes.trim().split(" ");
              this.ImpArr(contMaBe);
              this.contentMaybeIncludes = contMaBe.join(",");
              //console.log(this.contentMaybeIncludes);
            }
            // this.contentExcludes
            if (this.contentExcludes.trim().indexOf(" ") !== -1) {
              //console.log("全文不包含" + "有空格");
              var contEx = this.contentExcludes.trim().split(" ");
              this.ImpArr(contEx);
              this.contentExcludes = contEx.join(",");
              //console.log(this.contentExcludes);
            }
            // *this.titleIncludes*/
            if (this.titleIncludes.trim().indexOf(" ") !== -1) {
              //console.log("全文可能包含" + "有空格");
              var contMaBeInc = this.titleIncludes.trim().split(" ");
              this.ImpArr(contMaBeInc);
              this.titleIncludes = contMaBeInc.join(",");
              //console.log(this.titleIncludes);
            }
            // *this.titleMaybeIncludes*/
            if (this.titleMaybeIncludes.trim().indexOf(" ") !== -1) {
              //console.log("全文可能包含" + "有空格");
              var contMaBeMay = this.titleMaybeIncludes.trim().split(" ");
              this.ImpArr(contMaBeMay);
              this.titleMaybeIncludes = contMaBeMay.join(",");
              //console.log(this.titleMaybeIncludes);
            }
            // *this.titleExcludes*/
            if (this.titleExcludes.trim().indexOf(" ") !== -1) {
              //console.log("全文可能包含" + "有空格");
              var contMaBeEx = this.titleExcludes.trim().split(" ");
              this.ImpArr(contMaBeEx);
              this.titleExcludes = contMaBeEx.join(",");
              //console.log(this.titleExcludes);
            }
            this.FSAjax();
          }
        }
      },
      //
      FSAjax() {
        this.titleIncludes = this.titleIncludes.trim();
        this.titleMaybeIncludes = this.titleMaybeIncludes.trim();
        this.titleExcludes = this.titleExcludes.trim();
        this.contentIncludes = this.contentIncludes.trim();
        this.contentMaybeIncludes = this.contentMaybeIncludes.trim();
        this.contentExcludes = this.contentExcludes.trim();
        this.zhuangtai();
        setTimeout(() => {
          this.$nextTick(() => {
            this.ruleslist = [];
            this.top = 1;
            this.lawScarch();
            this.popupVisible = false;
          })
        }, 500)
      },
      // 去除空数组
      ImpArr(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === "" || typeof(array[i]) === "undefined") {
            array.splice(i, 1);
            i = i - 1;
          }
        }
      },
      // 高级里的重置
      goReset() {
        $('.rangeBtn1').addClass('colorBtn');
        $('.rangeBtn2').removeClass('colorBtn');
        $('.rangeBtn3').addClass('colorBtn');
        $('.rangeBtn4').removeClass('colorBtn');
        if (this.Newarr.length > 1) {
          var arr = this.Newarr.join(" ");
        } else {
          var arr = this.Newarr[0];
        }
        this.titleIncludes = arr; //标题包含
        this.titleMaybeIncludes = ""; //标题可能包含
        this.titleExcludes = ""; //标题不包含
        this.contentIncludes = "";
        this.contentMaybeIncludes = "";
        this.contentExcludes = "";
        /**/
        this.sea();
        this.sw = 0;
        this.matter();
        this.redCircleExpert = false;
        $('.titleTip').hide();
        $('.titleTip1').hide();
      },
      //高级里的input显示隐藏
      matter() {
        if (this.sw == 0) {
          $('.rulesMatter').show();
          this.sw++
        } else if (this.sw != 0) {
          this.sw = 0;
          $('.rulesMatter').hide();
        }
      },
      //高级显示
      popupShow() {
        this.popupVisible = true;
        this.showSearch = false;
        this.showSearch1 = false;
        this.showSearch2 = false;
        $('.titleTip1').hide();
        $('.titleTip').hide();
        $('.search-mrpx').removeClass("pass");
        if (Array.isArray(this.titleIncludes)) {
          //console.log('是数组');
          this.titleIncludes = this.titleIncludes.trim().join(" ");
        } else if (this.titleIncludes.trim().indexOf(",") !== -1) {
          //console.log("有逗号");
          var arr = this.titleIncludes.trim().split(',').join(" ");
          this.titleIncludes = arr;
          //console.log(arr);
          //console.log(this.titleIncludes);
        } else {
          //console.log("没逗号");
        }
        //标题可能包含
        if (this.titleMaybeIncludes.indexOf(",") != -1) {
          this.titleMaybeIncludes = this.titleMaybeIncludes.trim().split(",").join(" ");
        }
        //标题不包含
        if (this.titleExcludes.indexOf("," != -1)) {
          this.titleExcludes = this.titleExcludes.trim().split(",").join(" ");
        }
        //正文必须包含
        if (this.contentIncludes.indexOf("," != -1)) {
          this.contentIncludes = this.contentIncludes.trim().split(",").join(" ");
        }
        //正文可能包含
        if (this.contentMaybeIncludes.indexOf("," != -1)) {
          this.contentMaybeIncludes = this.contentMaybeIncludes.trim().split(",").join(" ");
        }
        //正文不包含
        if (this.contentExcludes.indexOf("," != -1)) {
          this.contentExcludes = this.contentExcludes.trim().split(",").join(" ");
        }
      },
      //高级隐藏
      popupHide() {
        this.sw = 0;
        this.matter();
        this.popupVisible = false;
        this.gaoji("BtnMany");
        //console.log("BtnManyBtnManyBtnManyBtnManyBtnMany");
      },
      Toblur() {
        $('input').blur();
        //window.document.activeElement.blur;
      },
      /**/
      zhuangtai() {
        this.$storage.localStorageSystem("guizeIdStatus", this.idarr2, false);
        this.$storage.localStorageSystem("fawenIdStatus", this.idarr1, false);
        this.$storage.localStorageSystem("marketIdStatus", this.idarr0, false);
        this.$storage.localStorageSystem("timeIdStatus", this.timeIdStatus, false);
        this.$storage.localStorageSystem("value0", this.value0, false);
        this.$storage.localStorageSystem("value1", this.value1, false);
        this.$storage.localStorageSystem("value2", this.value2, false);
        this.$storage.localStorageSystem("value3", this.value3, false);
        let DateArr = (this.timesDate1 + "yymmdd" + this.timesDate2).split("yymmdd");
        this.$storage.localStorageSystem("DateStartEnd", DateArr, false); //开始 和结束
        console.log("==this.value1==", DateArr, this.timeIdStatus, this.value1, this.value0, this.value2, this.value3);
        window.localStorage.setItem("pageSize", this.bottom);
        window.localStorage.setItem("pageTop", this.top);
        /*高级存储到localStorage*/
        let colorBtn = $('.rangeBtn div .colorBtn').text();
        let colorBtn2 = $('.rangeBtn_2 div .colorBtn').text();
        if (colorBtn == "标题" && colorBtn2 == "精确") {
          var coa = this.titleIncludes.split(",").join(",") + "$#" + this.titleMaybeIncludes.split(",").join(",") + "$#" + this.titleExcludes.split(",").join(",");
          window.localStorage.setItem("titleIME", coa);
        } else if (colorBtn == "全文" && colorBtn2 == "精确") {
          var coa = this.titleIncludes.split(",").join(",") + "$#" + this.titleMaybeIncludes.split(",").join(",") + "$#" + this.titleExcludes.split(",").join(",");
          var cob = this.contentIncludes.split(",").join(",") + "$#" + this.contentMaybeIncludes.split(",").join(",") + "$#" + this.contentExcludes.split(",").join(",");
          window.localStorage.setItem("titleIME", coa);
          window.localStorage.setItem("contentIME", cob);
        } else {
          var arr = this.Newarr.join(",");
          window.localStorage.setItem("keyIME", arr);
        }
        window.localStorage.setItem("colorBtn", (colorBtn + "$#" + colorBtn2));//开始时间
      },
      //点击详情 存储状态
      goCount(index) {
        this.zhuangtai();
        this.$router.push({
          path: '/rule/details',
          query: {id: this.ruleslist[index].id}
        })
      },
      searchClose(index) {
        let colorBtn = $('.rangeBtn div .colorBtn');
        let colorBtn2 = $('.rangeBtn_2 div .colorBtn');
        //console.log('去除关键词');
        //console.log(this.Newarr.length);
        if (this.Newarr.length > 1) {
          if (isNaN(index) || index >= this.Newarr.length) {
            return false;
          }
          for (var i = 0, n = 0; i < this.Newarr.length; i++) {
            if (this.Newarr[i] != this.Newarr[index]) {
              this.Newarr[n++] = this.Newarr[i];//
            }
          }
          this.Newarr.length -= 1;
          var neway = this.Newarr.join(",");
          //console.log("还有：" + this.Newarr, neway);
          if (colorBtn.text() == "标题" && colorBtn2.text() == "精确") {
            this.titleIncludes = neway;
            ////console.log(this.titleIncludes);
          } else if (colorBtn.text() == "全文" && colorBtn2.text() == "精确") {
            this.contentIncludes = neway;
          } else {
            //console.log("this.newTitleKeythis.newTitleKey", this.Newarr);
            this.keys = neway;
          }
          this.ruleslist = [];
          this.lawScarch();
        } else {
          this.$router.push({path: '/rule/search'});
        }
      },
      searchPro() {
        //console.log('123213213');
      },
      //点击返回搜索页面
      goSearch() {
        //console.log("sadsadsadsa");
        var arr = this.Newarr.join(" ");
        this.zhuangtai();
        this.$router.push({path: '/rule/search', query: {valuess: arr}});
      }
    }
  }
</script>
<style lang="scss">
  .rule-popup-right {
    .vux-popup-dialog {
      overflow: hidden;
      z-index: 3000;
    }
    .rule-popup-right-sx {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-left: 0.5px solid #e3e3e3;
      box-shadow: 4px 2px 2px 1px #B9ADAD;
    }
    .rule-popup-right-advanced {
      width: 100%;
      height: 100%;
      background-color: #fff;
      border-left: 0.5px solid #e3e3e3;
      box-shadow: 4px 2px 2px 1px #B9ADAD;
      .rulExpert {
        height: 44px;
        border-bottom: 0.5px solid #e3e3e3;
        text-align: center;
        line-height: 44px;
        position: relative;
        span {
          color: #535353;
          font-size: 15px;
        }
        i.expert_g {
          position: absolute;
          padding: 0 12px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
      .rangeGkipt {
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
        .range {
          padding: 10px 12px 7px 12px;
          font-size: 15px;
          color: #535353;
        }
        .rangeBtn, .rangeBtn_2 {
          height: 25px;
          padding: 0 12px;
          div {
            width: 50%;
            float: left;
            .rangeBtn1, .rangeBtn3 {
              float: right;
              margin-right: 10px;
            }
            .rangeBtn2, .rangeBtn4 {
              margin-left: 10px;
            }
          }
          button {
            height: 25px;
            width: 60px;
            border: 0;
            border-radius: 2px;
            font-size: 14px;
            background-color: #f0f1f5;
            color: #8d8d8d;
            outline: none;
          }
        }
        .rangeMoregl {
          padding: 12px 12px;
          .rangeMore {
            height: 33px;
            border-bottom: 0.5px solid #e3e3e3;
            border-top: 0.5px solid #e3e3e3;
            line-height: 33px;
            color: #535353;
            font-size: 15px;
            i {
              font-size: 10px;
            }
            .rangeMoreTop {
              float: right;
              font-weight: 600;
            }
            .rangeMoreButton {
              float: right;
              font-weight: 600;
            }
          }
        }
        /**/
        .rules-matter {
          .search-matter-content, .search-matter-title {
            .searchCont, .searchTitle {
              padding: 5px 10px;
              font-size: 15px;
              text-align: left;
              color: #545454;
            }
            .input-matter-box {
              display: table;
              table-layout: fixed;
              width: 100%;
              padding: 5px 10px;
              .text-left {
                display: table-cell;
                font-size: 15px;
                width: 38%;
                padding-right: 10px;
                text-align: right;
              }
              .input-right {
                display: table-cell;
                position: relative;
                width: 62%;
                input {
                  -webkit-appearance: none;
                  box-sizing: border-box;
                  outline: none;
                  font-size: 15px;
                  display: inline-block;
                  border: 0.5px solid #e3e3e3;
                  border-radius: 2px;
                  padding: 0 5px;
                  height: 25px;
                  width: 100%;
                  color: #8d8d8d;
                }
              }
            }
            .titleTip1, .titleTip {
              font-size: 12px;
              box-sizing: border-box;
              padding-left: 40%;
              color: red;
              display: none;
            }
          }
        }
        .rulesMatter {
          display: none;
        }
      }
      .footBtn {
        height: 50px;
        position: absolute;
        bottom: 0;
        left: 0;
        border-top: 0.5px solid #e3e3e3;
        width: 100%;
        font-size: 0;
        button {
          width: 50%;
          height: 50px;
          border: 0;
          color: #ffb148;
          background-color: white;
          outline: none;
          font-size: 18px;
        }
        button:active {
          /*background-color: #f0f1f5;*/
          opacity: 0.6;
        }
        button + button {
          color: white;
          border-radius: 0;
          background-color: #ffb148;
        }
        button + button:active {
          /* background-color: #fcc77f;*/
          opacity: 0.6;
        }
      }
    }
  }
  .xiaoan-box.rules-list {
    .rules-list-scroll {
      height: 100%;
      width: 100%;
      background-color: #FFFFFF;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      .wrapper {
        padding-top: 90px;
        padding-bottom: 50px;
        position: relative;
        width: 100%;
        height: auto !important;
        overflow: hidden;
      }
    }
    .rule-header {
      position: absolute;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 400;
      .searchs {
        width: 100%;
        height: 50px;
        background-color: #f0f1f5;
        padding: 7.5px 12px;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        z-index: 400;
        .seabox {
          width: 86%;
          height: 100%;
          position: relative;
          overflow: hidden;
          background: white;
          border-radius: 2px;
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
            .searchScrollSpan {
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
          .goSearch {
            display: flex;
            width: auto;
            height: 35px;
            .rulesNum {
              position: absolute;
              top: 10px;
              right: 10px;
              color: #8d8d8d;
              font-size: 12px;
              font-weight: normal;
            }
          }
        }
        #experts {
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
        .smx_item {
          height: 8px;
          width: 8px;
          background-color: red;
          border-radius: 50%;
          position: absolute;
          top: 5px;
          right: 9px;
        }
      }
    }

  }
  input[type="date"]::-webkit-clear-button {
    display: none;
  }
  .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
  .anListName div span > span {
    margin-right: 0 !important;
  }
  .anListName div span > span > span {
    margin-right: 0 !important;
  }
  #LoadScroll {
    margin-bottom: 30px;
  }

</style>
<style scoped lang="scss">
  .snake {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #535353;
    padding-top: 20px;
    box-sizing: border-box;
  }
  .snake-circle {
    height: 14px;
    width: 14px;
    -webkit-animation: snake-rotate 0.8s infinite linear;
    animation: snake-rotate 0.8s infinite linear;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: rgb(252, 199, 127);
    border-left-color: rgb(252, 199, 127);
    border-bottom-color: rgb(252, 199, 127);
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
  /***********************/
  #ruleslist .show {
    display: block;
  }
  .noInfo, .noTrySenior {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 90px;
    left: 0;
    /* z-index: 5;*/
    padding: 0 12.5px;
    box-sizing: border-box;
    background: #fff;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  .trySenior {
    position: absolute;
    left: 0;
    top: 90px;
    right: 0;
    margin: auto;
    width: 100%;
    height: 125px;
    text-align: center;
    background-color: white;
    img {
      display: block;
      width: 110px;
      height: 95px;
      margin: 0 auto 25px;
    }
    .trytext {
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      font-size: 15px;
      color: #ffb148;
      margin-left: -12.5px;
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
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      color: #fff;
      line-height: 30px;
    }
  }
  #ruleslist .scroll-trytext {
    text-decoration: none;
    border-bottom: 0.5px solid;
    color: #ffb148;
    font-size: 15px;
  }
  .tryimg {
    width: 8px;
    height: 14px;
    display: inline-block;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/rightOrange.png");
    background-repeat: no-repeat;
    background-size: contain;
    margin-bottom: -2px;
    margin-left: 8px;
  }
  #ruleslist .anList {
    padding: 0 12px;
    font-size: 0;
    text-align: justify;
    background-color: white;
  }
  #ruleslist .anList:active {
    background-color: #f0f1f5;
    /*opacity: 0.6;*/
  }
  .anListName {
    font-size: 15px;
    padding: 18px 0 0 0;
    margin-bottom: 10px;
    /* background-color: white;*/
    box-sizing: border-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: clip;
    line-height: 19px;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  .anListName div {
    width: 100%;
    word-spacing: normal;
  }
  .anListName span:first-child {
    margin-right: -0.4em;
  }
  .anListName > div > span {
    margin-right: -0.4em;
  }
  .anListState {
    font-size: 12px;
    padding: 0 0 18px 0;
    color: #aeaeae;
    margin-top: -3px;
  }
  #ruleslist .seniorText {
    padding: 0 12px;
    display: flex;
    text-align: justify;
    background-color: white;
    width: 100%;
    height: 70px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  #ruleslist .seniorText span:active {
    /*color: white;*/
    border-bottom-color: white;
  }
  .rulExpert .expert_D img {
    height: 15px;
    padding: 17px 0 17px 12px;
    position: fixed;
    top: 0;
    left: 0;
    display: table-cell;
    vertical-align: middle;
    text-align: center;
  }
  /*++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++*/

  .colorBtn {
    background-color: #fef3e4 !important;
    color: #ffb148 !important;
  }
  #ruleslist .searchCont {
    padding: 5px 0;
  }
  #ruleslist .Matter-span {
    display: inline-block;
    font-size: 15px;
    width: 40%;
    text-align: right;
    box-sizing: border-box;
    padding-right: 10px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #ruleslist .titleTip, #ruleslist .titleTip1 {
    font-size: 12px;
    box-sizing: border-box;
    padding-left: 40%;
    color: red;
    display: none;
  }
  .inputA, .inputB, .inputC {
    box-sizing: border-box;
    font-size: 0;
    padding: 5px 0;
    color: #8d8d8d;
  }
  .xiaoan-box-shadow, .showOp {
    height: 100%;
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1100;
    border-radius: 0;
  }
  /******************************************************************************************/
  .searchBox {
    width: 100%;
    height: 40px;
    display: flex;
    border-bottom: 0.5px solid #e3e3e3;
    justify-content: center;
    align-items: center;
    padding: 0 12px;
    box-sizing: border-box;
    position: relative;
    z-index: 300;
    background-color: white;
  }
  .searchBox .searchBoxDis {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(255, 255, 255, 0);
    z-index: 10;
    box-sizing: border-box;
  }
  .search-s {
    width: 85.5%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .search-s .search-mrpx {
    width: 33.33%;
    text-align: center;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #535353;
    border-left: 0.5px solid #e3e3e3;
  }
  /*筛选以及筛选弹出框*/
  .search-sx {
    width: 14.5%;
    text-align: center;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #535353;
    box-sizing: border-box;
    border-left: 0.5px solid #e3e3e3;
    border-right: 0.5px solid #e3e3e3; /*overflow: hidden;*/
    position: relative;
  }
  .search-sx:active {
    background-color: #f0f1f5;
  }
  .redCircle {
    width: 8px;
    height: 8px;
    background: #fb4319;
    border-radius: 50%;
    position: absolute;
    right: 3px;
    top: -5px;
    z-index: 1000;
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
    height: auto;
  }
  .search-sx .expert_s:active {
    background-color: #f0f1f5;
  }
  .closeShaixuan {
    width: 15px !important;
    height: 15px !important;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/x.jpg");
    background-size: contain;
    background-repeat: no-repeat;
  }
  .sxHeader {
    width: 100%;
    height: 45px;
    border-bottom: 0.5px solid #e3e3e3;
    position: relative;
  }
  .sxHeader .expert_g {
    position: absolute;
    padding-left: 12px;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
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
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
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
  .ruleList .sxlistItem {
    padding: 0;
  }
  .itemList .itemTip {
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto 0;
    right: 0;
  }
  .inputBox {
    width: 65%;
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
    background: white;
  }
  .itemList input {
    -webkit-appearance: none;
    width: 100%;
    height: 100%;
    border-radius: 2px;
    display: block;
    font-size: 14px;
    color: #b6b6b6;
    background: #fff;
    border: 0;
    text-align: center;
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
    position: relative;
  }
  /*.sxlistItem:active {
        background-color: #f0f1f5;
    }*/
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
  }
  .search-mrpx {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  .pass {
    width: 33.5% !important;
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
    display: block !important;
  }
  .search-s .pass p {
    margin-left: 0;
    transform: rotate(180deg);
    -ms-transform: rotate(180deg); /* IE 9 */
    -moz-transform: rotate(180deg); /* Firefox */
    -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
    -o-transform: rotate(180deg); /* Opera */
  }
  .search-s .pass p .iconBottom {
    color: #ffb148;
    margin-left: 0;
  }
  .search-mrpx .imgBox {
    margin: 0;
    padding: 0;
    display: inline-block;
  }
  .search-mrpx .imgBox .iconBottom {
    font-size: 10px;
    margin-left: 6px;
  }
  .checkbox-box {
    position: absolute;
    left: 0;
    top: 90px;
    z-index: 3333;
    .showSearch, .showSearch1, .showSearch2 {
      background: #fff;
      width: 100%;
      height: 100%;
    }
  }
  .bottomBox, .sxFooter {
    width: 100%;
    height: 50px;
    border-top: 0.5px solid #e3e3e3;
    position: absolute;
    left: 0;
    bottom: 0;
    font-size: 0;
  }
  .bottomBox button, .sxFooter button {
    width: 50%;
    height: 100%;
    border: 0;
    line-height: 50px;
    text-align: center;
    font-size: 18px;
    float: left;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica !important;
    color: #ffb048 !important;
    background-color: white;
    outline: none;
  }
  .bottomBox button:active, .sxFooter button:active {
    background-color: #f0f1f5;
  }
  .bottomBox button + button, .sxFooter button + button {
    background: #ffb048 !important;
    color: #fff !important;
    outline: none;
  }
  .bottomBox button + button:active, .sxFooter button + button:active {
    background-color: #f0f1f5;
  }
  .itembox {
    width: 100%;
    height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
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
    border: 0.5px solid #fff;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/rules/chengseduigou.png");
    background-size: contain;
    background-repeat: no-repeat;
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
    /*font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;*/
    font-size: 14px;
    color: #535353;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    float: left;
    &:nth-of-type(even) {
      .itemHline {
        display: none;
      }
    }
  }
  .ruleslist .shadow {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1550;
    background: rgba(0, 0, 0, .5);
    overflow: hidden;
    border-radius: 0;
    box-shadow: none;
  }
  img[src=''] {
    opacity: 0 !important;
  }
  input:focus {
    outline: none !important;
    -webkit-appearance: none;
  }
  /*搜索栏关键字样式*/
  /* .showSearch1 .item:last-child {
         width: 100%;
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
    background-color: white;
    color: #c1c1c1;
    z-index: 22;
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
    opacity: 0;
  }
</style>
