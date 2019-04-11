<template>
  <transition name="bounce">
    <div id="afficheList" class="xiaoan-box affiche-list">
      <div class="affiche-list-scroll" ref="scrollDom">
        <div ref="searchDom" class="searchs">
          <div class="seabox">
            <div class="inputone" @click="searchCode">证券简称/代码</div>
            <span class="inputLine"></span>
            <div class="inputTwo" @click="company" style="width: 55%">搜索公告名称</div>
          </div>
          <i class="icon iconfont icon-tripsousuo"></i><!-- @click="searchList"-->
        </div>
        <div ref="dataBox" class="dataBox">
          <div class="showData" style="background:#fff ;">
            <div class="List1" @click="watchMoreInfo">
              <span class="now" id="xianjia">{{ now }}</span>
              <div class="List1line2">
                <span class="down" style="max-width:60%;overflow: auto; -webkit-overflow-scrolling: touch;">{{ down }}</span>
                <span class="up" style="max-width:60%;overflow: auto; -webkit-overflow-scrolling: touch;">{{ up }}</span>
              </div>
            </div>
            <div class="List2" @click="watchMoreInfo">
              <div class="line">
                <span>高</span><span style="margin-left: 5px">{{ high }}</span>
              </div>
              <div class="line">
                <span style="margin-right: 5px">低</span><span>{{ low }}</span>
              </div>
              <div class="line">
                <span style="margin-right: 5px">开</span><span>{{ open }}</span>
              </div>
            </div>
            <div class="List3">
              <div class="line" @click="watchMoreInfo">
                <span style="margin-right: 5px">额</span>
                <span v-if="edu == NaN || edu == undefined">--</span>
                <span v-else>{{ edu }}</span>
              </div>
              <div class="line" @click="watchMoreInfo">
                <span style="margin-right: 5px">量</span>
                <span>{{ num }}</span>
              </div>
              <div class="line">
                <div class="huanshoulv" @click="showChange"
                     style="display: inline-block;border-radius: 4px;padding:-1px 4px 3px;padding-left: 5px;margin-left: -5px;">
                  <span style="margin-right: 5px">换</span><!--padding-left: 5px;margin-left: -5px;-->
                  <span class="spacileSpan">{{ change }}</span>
                  <!--<span class="gantanhao" style="display: none">&ensp;！</span>-->  <!--换手率感叹号-->
                </div>
              </div>
            </div>
            <div class="List4" @click="alertBshow">
              <div class="fang">
                <span>偏离值</span>
                <span>{{ deviate }}</span>
              </div>
              <div class="san"></div>
            </div><!---->
          </div>
          <div class="showMoreData" @click="watchMoreInfo">
            <img :src="$image.affiche.ORTodown" alt="" style="width:8px;transform:rotate(180deg)">
          </div>
        </div>
        <div class="content-Box-wrapper" :style="{ height: wrapperHeight + 'px' }">
          <div class="content-Box" ref="wrapper" v-show="!isShowData" :style="{height: wrapperHeight +'px'}">
            <ul class="infinite-list" v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading"
                :infinite-scroll-distance=0>
              <!--内容列表-->
              <li class="content-lists" v-for="(list,index) in contentList" :key="index">  <!--//releaseDate //title-->
                <div class="lists-item vux-1px-b">
                  <div @click="dianji(index)" style="width:100%">
                    <p class="content-text">{{ list.title }}</p>
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
                </div>
              </li>
            </ul>
            <!--9yue 25日 cai 改-->
            <p v-show="infLoading" class="infinite-loading">
              <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
            </p>
          </div>
          <!-- 新股上市暂无公告 -->
          <div id="warning" v-show="linkIsErr">
            <div class="waringImg gonggaoWaringImg"></div>
            <div class="waringText">{{gonggaoText}}</div>
            <mt-button class="waringBtn gonggaoBtn" @click="warningreLoad">{{ waringBtn }}</mt-button>
          </div>
        </div>
      </div>
      <!--是否关注按钮-->
      <div class="focAdd" @click="addFocus" v-show="this.addFocusShow">
        <span class="focAddImg" v-show="isFocus==false"></span>
        <span class="focAddText" v-if="isFocus==false">关注</span>
        <span class="focAddText endFocus" v-else-if="isFocus==true">已关注</span>
      </div>
      <!---->
      <div class="law-show" v-show="GuidePageAffs1">
        <img :src="GuideAffiche" class="GuidePage-aff" alt="" v-show="GuidePageAffs1">
        <button class="law-show-sh" @click="lawshowsh" v-show="lawshows1">知道了</button>
      </div>
      <div class="law-show" v-show="GuidePageAffs2">
        <img :src="GuideAffiche2" class="GuidePage-aff2" alt="" v-show="GuidePageAffs2">
        <button class="law-show-sh" @click="lawshowsh2" v-show="lawshows2">知道了</button>
      </div>
      <div class="showPrompt">上滑加载更多内容</div>
      <!--更多行情弹出页面-->
      <transition name="bounce">
        <div id="dialog-moreInfo" class="moreInfo" v-show="moreInfoShow">
          <div class="moreInfo-box">
            <div class="infoBox">
              <div class="selectItem">
                <div class="itemName" v-for="(list,index) in moreInfoArr" @click="itemNameShow(index)">
                  {{ list.name }}
                  <span class="itemNameSplitLine"></span>
                </div>
              </div>
              <div class="itemInfoBox">
                <!--行情数据01-->
                <div class="itemInfo">
                  <div class="itemInfoOne" v-show="moreInfoShowOne">
                    <div class="infoLists">
                      <div class="infoListOne">
                        <div class="infoItem" v-for="(list,index) in infoArrOne">
                          <div class="infoItemName">{{ list.name }}</div>
                          <div class="infoItemValue" v-if="list.value == null">--</div>
                          <div class="infoItemValue" v-else>{{ list.value }}</div>
                        </div>
                      </div>
                      <div class="infoListTwo">
                        <div class="infoItem" v-for="(list,index) in infoArrTwo">
                          <div class="infoItemName">{{ list.name }}</div>
                          <div class="infoItemValue" v-if="list.value == null">--</div>
                          <div class="infoItemValue" v-else>{{ list.value }}</div>
                        </div>
                      </div>
                      <div class="infoListThree">
                        <div class="infoItem" v-for="(list,index) in infoArrThree">
                          <div class="infoItemName">{{ list.name }}</div>
                          <div class="infoItemValue" v-if="list.value == null">--</div>
                          <div class="infoItemValue" v-else>{{ list.value }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="updateTime">
                      <div class="updateTimediv"><span>数据更新于</span><span>{{ updateTime }}</span></div>
                    </div>
                  </div>
                  <div class="alertContent" id="focus-warningM" v-show="!moreInfoShowOne"
                       style="width: 100%;height: 80%;background: #fff;">
                    <div class="focus-waringImg"></div>
                    <div class="focus-waringText">{{waringTextM}}</div>
                    <mt-button class="focus-waringBtn" @click="waringBin">{{waringBtn}}</mt-button>
                  </div>
                </div>
                <!--偏离值02-->
                <div class="itemInfo itemInfo-ratio">
                  <div class="alertContent" v-if="showERR==false">
                    <div class="thisCompany">
                      <ul class="alert-box-title">
                        <li class="alertTitle">
                          <div class="gpName">证券简称</div>
                          <div class="alertDate">
                            <div class="centertitle">涨跌幅</div>
                            <div class="centertitle"><span>{{ today }}</span><span>{{ yesterday }}</span><span>{{ qiantian }}</span>
                            </div>
                          </div>
                          <div class="shiyinglv">
                            <span class="shiyinglv-item">市盈率</span>
                            <span class="dosc">(动态)</span>
                          </div>
                        </li>
                      </ul>
                      <ul class="ratio-info">
                        <li class="alertComInfo">
                          <div class="gsName title gongsi">{{ companyName }}</div>
                          <div class="centerInfo plCenterInfotitle">
                            <span :style="{color:'#323232'}" v-if="jinri == null || jinri == ''"> -- </span>
                            <span :style="{color:'#323232'}" v-else-if="jinri == 0">{{jinri+'%'}}</span>
                            <span :style="{color:'#fb4319'}" v-else-if="jinri > 0">{{'+'+jinri+'%'}}</span>
                            <span :style="{color:'#29da89'}" v-else-if="jinri < 0">{{jinri+'%'}}</span>
                            <!---->
                            <span :style="{color:'#323232'}" v-if="zuori == null || zuori == ''"> -- </span>
                            <span :style="{color:'#323232'}" v-else-if="zuori == 0">{{zuori+'%'}}</span>
                            <span :style="{color:'#fb4319'}" v-else-if="zuori > 0">{{'+'+zuori+'%'}}</span>
                            <span :style="{color:'#29da89'}" v-else-if="zuori < 0">{{zuori+'%'}}</span>
                            <!---->
                            <span :style="{color:'#323232'}" v-if="qianri == null || qianri == ''"> -- </span>
                            <span :style="{color:'#323232'}" v-else-if="qianri == 0">{{qianri+'%'}}</span>
                            <span :style="{color:'#fb4319'}" v-else-if="qianri > 0">{{'+'+qianri+'%'}}</span>
                            <span :style="{color:'#29da89'}" v-else-if="qianri < 0">{{qianri+'%'}}</span>
                          </div>
                          <div class="comShiyinglv fcolor1 titlecomShiyinglv" v-if="shiyinglv == null">--</div>
                          <div class="comShiyinglv fcolor1 titlecomShiyinglv" v-else>{{shiyinglv}}</div>
                        </li>
                      </ul>
                    </div>
                    <div class="sameC" style="position: relative">
                      <div class="plSameTitle">
                        <div class="sameCtitle" id="plz">{{ Industry }}
                        </div>
                      </div>
                      <div class="scrollerBox">
                        <ul class="ratio-info industry">
                          <li class="alertComInfo" v-for="(list,index) in hangyeList" @click="listInfo(index)">
                            <div class="gsName gongsi" style="text-align: left;">{{list.name}}</div>
                            <div class="centerInfo plCenterInfo">
                              <span :style="{color:'#323232'}"
                                    v-if="list.jinRiZhangDie == null || list.jinRiZhangDie == ''"> -- </span>
                              <span :style="{color:'#323232'}"
                                    v-else-if="list.jinRiZhangDie == 0">{{list.jinRiZhangDie+'%'}}</span>
                              <span :style="{color:'#fb4319'}" v-else-if="list.jinRiZhangDie > 0">{{'+'+list.jinRiZhangDie+'%'}}</span>
                              <span :style="{color:'#29da89 '}"
                                    v-else-if="list.jinRiZhangDie < 0">{{list.jinRiZhangDie+'%'}}</span>

                              <span :style="{color:'#323232'}"
                                    v-if="list.zuoRiZhangDie == null || list.zuoRiZhangDie == ''"> -- </span>
                              <span :style="{color:'#323232'}"
                                    v-else-if="list.zuoRiZhangDie == 0">{{list.zuoRiZhangDie+'%'}}</span>
                              <span :style="{color:'#fb4319'}" v-else-if="list.zuoRiZhangDie > 0">{{'+'+list.zuoRiZhangDie+'%'}}</span>
                              <span :style="{color:'#29da89 '}"
                                    v-else-if="list.zuoRiZhangDie < 0">{{list.zuoRiZhangDie+'%'}}</span>

                              <span :style="{color:'#323232'}"
                                    v-if="list.qianRiZhangDie == null || list.qianRiZhangDie == ''"> -- </span>
                              <span :style="{color:'#323232'}" v-else-if="list.qianRiZhangDie == 0">{{list.qianRiZhangDie+'%'}}</span>
                              <span :style="{color:'#fb4319'}" v-else-if="list.qianRiZhangDie > 0">{{'+'+list.qianRiZhangDie+'%'}}</span>
                              <span :style="{color:'#29da89 '}" v-else-if="list.qianRiZhangDie < 0">{{list.qianRiZhangDie+'%'}}</span>
                            </div>
                            <div class="comShiyinglv plTHshiyinglv" style="text-align: right">
                              <span :style="{color:'#323232'}" v-if="list.shiYingLv == null"> -- </span>
                              <span :style="{color:'#323232'}" v-else>{{list.shiYingLv}}</span>
                            </div>
                          </li>
                        </ul>
                        <div class="seeMore" @click="watchMore">
                          <span>展开更多</span>
                          <img :src="$image.affiche.ORTodown"
                               style="margin-bottom:-1px;margin-left:10px;width:10px;transform:rotate(180deg)">
                        </div>
                        <!--split line-->
                        <div class="huiseLine"
                             style="width:110%;height:7.5px;background: #f0f1f5;margin-left: -10px;"></div>
                        <!--大盘-->
                        <div class="marketSort">
                          <div class="marketTitle vux-1px-b">沪深大盘</div>
                          <div style="padding:0 5px;box-sizing: border-box;width:100%;height:0.5px;">
                            <div style="width:100%;height:100%;background: #e3e3e3;"></div>
                          </div>
                          <ul class="ratio-info">
                            <li class="alertComInfo">
                              <div class="gsName gongsi" v-if="dapanname.length>4"
                                   style="width:24%;overflow-x:scroll;overflow-y: hidden;white-space: nowrap;padding-top: 4%; ">
                                {{ dapanname }}
                              </div>
                              <div class="gsName gongsi" v-else
                                   style="overflow-x:scroll;overflow-y: hidden;white-space: nowrap;padding-top: 4%;">
                                {{ dapanname }}
                              </div>
                              <div class="centerInfo dpcenterInfo plCenterInfo">
                                <span :style="{color:'#323232'}" v-if="dapanjr == null || dapanjr == ''"> -- </span>
                                <span :style="{color:'#323232'}" v-else-if="dapanjr == 0">{{dapanjr+'%'}}</span>
                                <span :style="{color:'#fb4319'}" v-else-if="dapanjr > 0">{{'+'+dapanjr+'%'}}</span>
                                <span :style="{color:'#29da89 '}" v-else-if="dapanjr < 0">{{dapanjr+'%'}}</span>
                                <span :style="{color:'#323232'}" v-if="dapanzr == null || dapanzr == ''"> -- </span>
                                <span :style="{color:'#323232'}" v-else-if="dapanzr == 0">{{dapanzr+'%'}}</span>
                                <span :style="{color:'#fb4319'}" v-else-if="dapanzr > 0">{{'+'+dapanzr+'%'}}</span>
                                <span :style="{color:'#29da89 '}" v-else-if="dapanzr < 0">{{dapanzr+'%'}}</span>
                                <span :style="{color:'#323232'}" v-if="dapanqr == null || dapanqr == ''"> -- </span>
                                <span :style="{color:'#323232'}" v-else-if="dapanqr == 0">{{dapanqr+'%'}}</span>
                                <span :style="{color:'#fb4319'}" v-else-if="dapanqr > 0">{{'+'+dapanqr+'%'}}</span>
                                <span :style="{color:'#29da89 '}" v-else-if="dapanqr < 0">{{dapanqr+'%'}}</span>
                              </div>
                              <div class="comShiyinglv dacomSYL"
                                   style="padding-top: 4%;box-sizing: border-box;">--
                              </div>
                            </li>
                          </ul>
                        </div>
                        <div class="updateTime" id="plzUpdateTime">
                          <div class="updateTimediv"><span>数据更新于</span><span>{{ updateTime }}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <!---->
                  <div class="alertContent" id="focus-warning" v-else="showERR==true"
                       style="width: 100%;height: 80%;background: #fff;">
                    <div class="focus-waringImg"></div>
                    <div class="focus-waringText">{{waringText}}</div>
                    <mt-button class="focus-waringBtn" @click="waringBin">{{waringBtn}}</mt-button>
                  </div>
                </div>
                <!--换手率03-->
                <div class="itemInfo itemInfo-ratio">
                  <div class="alertContent alertContentH" v-if="showERRh==false">
                    <div class="thisCompany">
                      <ul class="alert-box-title">
                        <li class="alertTitle">
                          <div class="gpName">证券简称</div>
                          <div class="alertDate">
                            <div class="centertitle title">累计换手率/（倍数）</div>
                            <div class="centertitle"><span>当日</span><span>前两日</span><span>前三日</span></div>
                          </div>
                          <div class="shiyinglv"><span class="shiyinglv-item">市盈率</span><span class="dosc">(动态)</span>
                          </div>
                        </li>
                      </ul>
                      <ul class="ratio-info">
                        <li class="alertComInfo">
                          <div class="gsName gongsi">{{companyName}}</div>
                          <div class="centerInfo">
                            <div class="centerInfo-item">
                              <span class="spanLine1 fcolor1" v-if="dangri == null || dangri == ''">--</span>
                              <span class="spanLine1 fcolor4" v-else-if="dangri >= 20">{{toDecimal2(dangri)+'%'}}</span>
                              <span class="spanLine1 fcolor1" v-else>{{toDecimal2(dangri)+'%'}}</span>
                              <span class="spanLine2 fcolor1"
                                    v-if="dangrizhanbi == null  || dangrizhanbi == ''|| dangrizhanbi == '--'">(--)</span>
                              <span class="spanLine2 fcolor4" v-else-if="dangrizhanbi >= 30">({{toDecimal2(dangrizhanbi)}})</span>
                              <span class="spanLine2 fcolor1" v-else>({{toDecimal2(dangrizhanbi)}})</span>
                            </div>
                            <div class="centerInfo-item">
                              <span class="spanLine1 fcolor1" v-if="qianliangri == null || qianliangri == ''">--</span>
                              <span class="spanLine1 fcolor4" v-else-if="qianliangri >= 20">{{toDecimal2(qianliangri)+'%'}}</span>
                              <span class="spanLine1 fcolor1" v-else>{{toDecimal2(qianliangri)+'%'}}</span>
                              <!---->
                              <span class="spanLine2 fcolor1"
                                    v-if="qianliangrizhanbi == null || qianliangrizhanbi == ''|| qianliangrizhanbi == '--'">(--)</span>
                              <span class="spanLine2 fcolor4" v-else-if="qianliangrizhanbi >= 30">({{toDecimal2(qianliangrizhanbi)}})</span>
                              <span class="spanLine2 fcolor1" v-else>({{toDecimal2(qianliangrizhanbi)}})</span>
                            </div>
                            <div class="centerInfo-item">
                              <span class="spanLine1 fcolor1" v-if="qiansanri == null || qiansanri == ''">--</span>
                              <span class="spanLine1 fcolor4"
                                    v-else-if="qiansanri >= 20">{{toDecimal2(qiansanri)+'%'}}</span>
                              <span class="spanLine1 fcolor1" v-else>{{toDecimal2(qiansanri)+'%'}}</span>
                              <span class="spanLine2 fcolor1"
                                    v-if="qiansanrizhanbi == null || qiansanrizhanbi == ''|| qiansanrizhanbi == '--'">(--)</span>
                              <span class="spanLine2 fcolor4" v-else-if="qiansanrizhanbi >= 30">({{toDecimal2(qiansanrizhanbi)}})</span>
                              <span class="spanLine2 fcolor1" v-else>({{toDecimal2(qiansanrizhanbi)}})</span>
                            </div>
                          </div>
                          <div class="comShiyinglv titlecomShiyinglv" style="padding-top:5%" v-if="shiyinglv == null">
                            --
                          </div>
                          <div class="comShiyinglv" style="padding-top:5%" v-else>{{shiyinglv}}
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div class="sameC">
                      <div class="sameC-title-box">
                        <div class="sameCtitle" id="hsl">{{ Industry }}</div>
                      </div>
                      <div class="scrollerBoxH">
                        <ul class="ratio-info industryH">
                          <li class="alertComInfo" v-for="(list,index) in hangyeListH" @click="listInfoH(index)">
                            <div class="gsName gongsi" style="text-align: left">{{list.name}}</div>
                            <div class="centerInfo">
                              <div class="centerInfo-item" v-if="list.code.indexOf('SH')">
                                <!--非沪市-->
                                <span class="spanLine1 fcolor1" v-if="list.todayThurnover == null">--</span>
                                <span class="spanLine1 fcolor4" v-else-if="list.todayThurnover >= 20">{{list.todayThurnover+'%'}}</span>
                                <span class="spanLine1 fcolor1" v-else>{{list.todayThurnover+'%'}}</span>
                                <span class="spanLine2 fcolor1" v-if="list.todayRatio == null">(--)</span>
                                <span class="spanLine2 fcolor4"
                                      v-else-if="list.todayRatio >= 30">({{list.todayRatio}})</span>
                                <span class="spanLine2 fcolor1" v-else>({{list.todayRatio}})</span>
                              </div>
                              <!--沪市-->
                              <div class="centerInfo-item" v-else>
                                <span class="spanLine1 fcolor1" v-if="list.todayThurnover == null">--</span>
                                <span class="spanLine1 fcolor1" v-else>{{list.todayThurnover+'%'}}</span>
                                <span class="spanLine2 fcolor1" v-if="list.todayRatio == null">(--)</span>
                                <span class="spanLine2 fcolor1" v-else>({{list.todayRatio}})</span>
                              </div>
                              <div class="centerInfo-item" v-if="list.code.indexOf('SH')">
                                <span class="spanLine1 fcolor1" v-if="list.twoDaysThurnover == null">--</span>
                                <span class="spanLine1 fcolor4" v-else-if="list.twoDaysThurnover >= 20">{{list.twoDaysThurnover+'%'}}</span>
                                <span class="spanLine1 fcolor1" v-else>{{list.twoDaysThurnover+'%'}}</span>
                                <span class="spanLine2 fcolor1" v-if="list.twoDaysRatio == null">(--)</span>
                                <span class="spanLine2 fcolor4" v-else-if="list.twoDaysRatio >= 30">({{list.twoDaysRatio}})</span>
                                <span class="spanLine2 fcolor1" v-else>({{list.twoDaysRatio}})</span>
                              </div>
                              <div class="centerInfo-item" v-else>           <!--沪市-->
                                <span class="spanLine1 fcolor1" v-if="list.twoDaysThurnover == null">--</span>
                                <span class="spanLine1 fcolor1" v-else>{{list.twoDaysThurnover+'%'}}</span>
                                <span class="spanLine2 fcolor1" v-if="list.twoDaysRatio == null">(--)</span>
                                <span class="spanLine2 fcolor1" v-else>({{list.twoDaysRatio}})</span>
                              </div>
                              <div class="centerInfo-item" v-if="list.code.indexOf('SH')">
                                <span class="spanLine1 fcolor1" v-if="list.threeDaysThurnover == null">--</span>
                                <span class="spanLine1 fcolor4" v-else-if="list.threeDaysThurnover >= 20">{{list.threeDaysThurnover+'%'}}</span>
                                <span class="spanLine1 fcolor1" v-else>{{list.threeDaysThurnover+'%'}}</span>
                                <span class="spanLine2 fcolor1" v-if="list.threeDayRatio == null">(--)</span>
                                <span class="spanLine2 fcolor4" v-else-if="list.threeDayRatio >= 30">({{list.threeDayRatio}})</span>
                                <span class="spanLine2 fcolor1" v-else>({{list.threeDayRatio}})</span>
                              </div>
                              <div class="centerInfo-item" v-else>
                                <span class="spanLine1 fcolor1" v-if="list.threeDaysThurnover == null">--</span>
                                <span class="spanLine1 fcolor1" v-else>{{list.threeDaysThurnover+'%'}}</span>
                                <span class="spanLine2 fcolor1" v-if="list.threeDayRatio == null">(--)</span>
                                <span class="spanLine2 fcolor1" v-else>({{list.threeDayRatio}})</span>
                              </div>
                            </div>
                            <div class="comShiyinglv" style="text-align: right">
                              <span class="fcolor1" v-if="list.shiYingLv == null"> -- </span>
                              <span class="fcolor1" v-else>{{list.shiYingLv}}</span>
                            </div>
                          </li>
                        </ul>
                        <div class="seeMoreH" @click="warchMoreHS"
                             style="display: flex;display: -webkit-flex;align-items: center;justify-content: center">
                          <span>展开更多</span>
                          <img :src="$image.affiche.ORTodown"
                               style="margin-bottom:-1px;margin-left:10px;width:10px;transform:rotate(180deg)">
                        </div>
                        <div class="updateTime">
                          <div class="updateTimediv"><span>数据更新于</span><span>{{ updateTime }}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="alertContent" id="focus-warningH" v-else-if="showERRh==true"
                       style="width: 100%;height: 80%;background: #fff;">
                    <div class="focus-waringImg"></div>
                    <div class="focus-waringText">{{waringTextH}}</div>
                    <mt-button class="focus-waringBtn" @click="waringBin">{{waringBtn}}</mt-button>
                  </div>
                </div>
              </div>
            </div>
            <div class="infoClose">
              <div class="closeButton" @click="closeMoreInfo"></div>
            </div>
          </div>
        </div>
      </transition>
      <transition name="bounce">
        <div class="infoShadow" @click="closeMoreInfo"></div>
      </transition>
      <!---->
      <div v-transfer-dom>
        <x-dialog v-model="showHideOnBlur" class="affiche-dialog" hide-on-blur>
          <div class="dialog-wrapper"></div>
        </x-dialog>
      </div>
    </div>
  </transition>
</template>

<script>
  import {TransferDomDirective as TransferDom, XDialog} from 'vux'
  export default {
    name: "afficheList",
    components: {
      XDialog,
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        showHideOnBlur: false,
        moreInfoShowOne: true, // 更多详情数据页面显示
        infoArrOne: [
          {name: "最高", value: "--"},
          {name: "今开", value: "--"},
          {name: "最低", value: "--"},
          {name: "昨收", value: "--"},
          {name: "涨停", value: "--"},
          {name: "总量", value: "--"},
          {name: "跌停", value: "--"},
          {name: "总额", value: "--"},
        ],
        infoArrTwo: [
          {name: "换手", value: "--"},
          {name: "量比", value: "--"},
          {name: "振幅", value: "--"},
          {name: "委比", value: "--"},
          {name: "市盈率(动)", value: "--"},
          {name: "市净率", value: "--"},
          {name: "市盈率(静)", value: "--"},
          {name: "每股净资产", value: "--"},
        ],
        infoArrThree: [
          {name: "总市值", value: "--"},
          {name: "总股本", value: "--"},
          {name: "流通值", value: "--"},
          {name: "流通股", value: "--"},
          {name: "52周最高", value: "--"},
          {name: "股息", value: "--"},
          {name: "52周最低", value: "--"},
          {name: "股息收益率", value: "--"},
        ],
        moreInfoArr: [
          {id: '0', name: "行情数据", show: false},
          {id: '1', name: "偏离值", show: false},
          {id: '2', name: "换手率", show: false}
        ],
        shiFouTingPai: false, // 是否停牌 通过getStockInfo api来获取该股票是否
        moreInfoShow: false, // 是否显示更多行情页面
        isShowData: false,// 是否显示更多行情数据
        huanshouShow: true,
        lawshows1: true,
        lawshows2: false,
        GuidePageAffs1: true,
        GuidePageAffs2: false,
        GuidePages: false,
        GuideAffiche: this.$image.guidePage.aff1,
        GuideAffiche2: this.$image.guidePage.aff2,
        companyName: "",
        companyCode: "",
        comCode: "",
        title: "",
        now: '--', /*3043.54*/
        up: '--',
        down: '--',
        high: "--",
        low: "--",
        open: "--",
        num: "--",
        edu: "--",
        size: "--",
        change: "--",
        deviate: "--",
        bottomStatus: '', //下拉状态
        ISloading: true,
        ISloading1: true,
        riKarr: [],
        ISloading2: true,
        ISloading3: true,
        currentTime: "", //当前时间  请求图表数据
        xiabiao: "",
        active: 0,
        localUrl: "",
        contentList: [], // 公司公告列表
        listCount: "", // 返回公告的数量
        pageSize: 20, // 每页条数
        pagesize: 5, // 同行信息
        pageHsize: 5, // 同行换手率信息
        pageNum: 1, // 当前页码
        watchmore: true, // 偏离值查看更多
        watchmoreH: true, // 换手率查看更多
        jinri: "",
        zuori: "",
        qianri: "",
        timeJinri: "",
        timeZuori: "",
        timeQianri: "",
        shiyinglv: "",
        dapanjr: "",
        dapanzr: "",
        dapanqr: "",
        dapansy: "",
        dapanname: "",
        dapancode: "",
        today: "",
        yesterday: "",
        qiantian: "",
        Industry: "", // 行业名称
        hangyeList: [], // 同行业公司信息
        listFlag: true,
        updateTime: "", // 最后更新时间
        alertShow: true, // 显示偏离值弹窗
        alertPshow: true, // 显示换手率弹窗
        dangri: "", // 关注公司日均换手率
        dangrizhanbi: "", // 关注公司日均换手率占比
        bishi: "",
        qianliangri: "",
        qianliangrizhanbi: "",
        qiansanri: "",
        qiansanrizhanbi: "",
        hangyeListH: [], // 同行业公司换手率信息
        pianlivalFlag: false, // 偏离值显示开关
        user_id: "", // 用户id
        apidate: "", // to后台传时间戳
        simCode: "", // 公司代码的6位
        showERR: false, // 偏离值获取失败
        showERRh: false, // 换手率获取失败
        gonggaoText: "暂无公告！", // 新股暂无公告
        waringText: "获取偏离值失败，请刷新重试！",// 偏离值获取失败
        waringBtn: "刷新",//偏离值获取失败
        waringTextH: "获取换手率失败，请刷新重试！",// 换手率获取失败
        waringTextM: "获取行情数据失败，请刷新重试！",// 行情数据获取失败
        isFocus: false, // 未关注该公司
        addFocusShow: true, // 判断是否登录显示关注
        listNum: 0, // 公告列表数量
        linkIsErr: false, // 公告获取是否成功
        nowTime: "", //标准时间
        infLoading: true, //
        loading: false,
        allLoaded: true,
        wrapperHeight: 0,
        firstIndex: false
      }
    },
    watch: {
      '$route'(to, from) {
        window.location.reload();
      }
    },
    created() {
      if (window.localStorage.getItem('GuidePagesAffiche')) {
        this.GuidePages = false;
        this.GuidePageAffs1 = false;
        this.GuidePageAffs2 = false;
      } else {
        this.GuidePages = true;
      }
      let code = this.$route.query.code;
      let name = this.$route.query.name;
      this.companyName = name;
      this.companyCode = code;
      if (name == 'undefined' || name == 'null') {
      } else {
        this.comCode = this.$regExp.number(code);
      }
      this.localUrl = window.location.href;

      this.user_id = this.$cookie.getCookie("userId");
      if (this.user_id) {
        this.addFocusShow = true;
      } else {
        this.addFocusShow = false;
      }
      //
      this.getStockInfo();
      this.currentTime = this.getNowFormatDateM();
      var date = new Date();
      var dateH = date.getHours();
      if (dateH > 14 || dateH < 9) {
        this.getData("true");
      } else {
        this.timeData('true')
      }
      this.isFocusM();//判断是否关注该公司
      this.getContent(); // 获取该公司公告信息
      this.getPianlivalue(); //获取偏离值

    },
    mounted() {
      this.$nextTick(() => {
        this.wrapperHeight = this.$refs.scrollDom.clientHeight - this.$refs.searchDom.clientHeight - this.$refs.dataBox.clientHeight;
        if (this.isShowData == true) {
          this.dataHeight = document.documentElement.clientHeight - this.$refs.dataH.getBoundingClientRect().top - 50;
          this.dataColor = 'white';
        }
      });
      //
      this.autoComplete();
    },
    methods: {
      //
      getNowFormatDateM() {
        var date = new Date();
        var splittip = "-";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + month + strDate + splittip + date.getHours() + date.getMinutes() + date.getSeconds() + splittip + date.getMilliseconds();
        return currentdate;
      },
      // 获取关注公司股票信息
      getStockInfo() {
        // 处理数值每隔3位加 ，
        function f(n) {
          var b = parseInt(n).toString();
          var len = b.length;
          if (len <= 3) {
            return b;
          }
          var r = len % 3;
          return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
        }
        /*this.$http ({
          method: "GET",
          url: this.$api.attention.getStockInfo,
          params: {
            obj: this.companyCode
          }
        })*/
        let params = {
          obj: this.companyCode
        }
        this.$axios.attention.getStockInfo(params).then((res) => {
          if (res.data.returnCode == 1) {
            this.nowTime = res.data.returnObject.shiJian;
            //
            var repdata = res.data.returnObject.data;
            this.shiFouTingPai = repdata.shiFouTingPai;
            //
            this.companyName = repdata.zhongWenJianCheng; // 简称
            // 4月17日 蔡 增加
            this.title = repdata.zhongWenJianCheng + " " + this.comCode; // 标题
            window.document.title = this.title; // 标题
            // 涨跌幅
            if (repdata.zhangFu != null) {
              if (repdata.zhangFu > 0) {        // 涨幅大于零 为红色
                this.up = "+" + this.toDecimal2(repdata.zhangFu) + "%";
                $(".up").css('color', '#fb4319')
                $(".now").css('color', '#fb4319')
                $(".down").css('color', '#fb4319')
              } else if (repdata.zhangFu < 0) {  // 涨幅小于零 为绿色
                this.up = this.toDecimal2(repdata.zhangFu) + "%";
                $(".up").css('color', '#29da89')
                $(".now").css('color', '#29da89')
                $(".down").css('color', '#29da89')
              } else if (repdata.zhangFu == 0) {  // 涨幅等于零 为黑色
                this.up = this.toDecimal2(repdata.zhangFu) + "%";
                $(".up").css('color', 'black')
                $(".now").css('color', 'black')
                $(".down").css('color', 'black')
              }
            }
            // 涨跌
            if (repdata.zhangDie != null) {
              if (repdata.zhangDie > 0) {
                this.down = "+" + this.toDecimal2(repdata.zhangDie);
              } else if (repdata.zhangDie < 0) {
                this.down = this.toDecimal2(repdata.zhangDie);
              } else if (repdata.zhangDie == 0) {
                this.down = this.toDecimal2(repdata.zhangDie);
              }
            }
            // 最新价
            if (repdata.zuiXinJia) {
              this.now = this.toDecimal2(repdata.zuiXinJia);
            } else {
              this.now = "--";
              this.pianlivalFlag = true;
            }
            // 是否停牌
            if (this.shiFouTingPai == true) {
              this.now = '--';  // “停牌”
              this.up = "--";
              this.down = "--";
              $(".up").css('color', 'black')
              $(".now").css('color', 'black')
              $(".down").css('color', 'black')
              this.pianlivalFlag = true;
              // console.log('暂停上市？->', repdata.zhongWenJianCheng.indexOf('暂停上市'))
            }

            // 换手率
            if (repdata.huanShou == null || repdata.huanShou == 0 || repdata.huanShou == undefined) {
              this.change = "--";
            } else {
              this.change = this.toDecimal2(repdata.huanShou) + "%";
            }
            // 最高价
            if (repdata.zuiGaoJia == null || repdata.zuiGaoJia == 0 || repdata.zuiGaoJia == undefined) {
              this.high = "--";
            } else {
              this.high = this.toDecimal2(repdata.zuiGaoJia);
            }
            // 成交额
            if (repdata.chengJiaoE) {
              var eduStr = repdata.chengJiaoE.toString();
              if (eduStr.length >= 5 && eduStr.length < 9) {
                var edu = (repdata.chengJiaoE / 10000).toFixed(2);
                var eduarr = edu.toString().split('.')
                if (eduarr[0].length > 3) {
                  var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                  var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                  eduarr[0] = newstrs;
                }
                this.edu = eduarr.join(".") + '万';
              } else if (eduStr.length >= 9) {
                var edu = (repdata.chengJiaoE / 100000000).toFixed(2);
                var eduarr = edu.toString().split('.')
                if (eduarr[0].length > 3) {
                  var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                  var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                  eduarr[0] = newstrs;
                }
                this.edu = eduarr.join(".") + '亿';
              } else {
                this.edu = f(repdata.chengJiaoE);
              }
            }
            if (repdata.chengJiaoE == null || repdata.chengJiaoE == 0 || repdata.chengJiaoE == undefined || isNaN(repdata.chengJiaoE)) {
              this.edu = "--";
            }
            // 最低价
            if (repdata.zuiDiJia) {
              this.low = this.toDecimal2(repdata.zuiDiJia);
              // console.log('最低价======>', this.low);
            }
            if (repdata.zuiDiJia == null || repdata.zuiDiJia == 0) {
              this.low = "--";
            }
            // 成交量
            if (repdata.chengJiaoLiang) {
              var numStr = (repdata.chengJiaoLiang / 100).toString().split('.')[0];
              if (numStr.length >= 5 && numStr.length < 9) {
                var edu = (repdata.chengJiaoLiang / 1000000).toFixed(2);
                var eduarr = edu.toString().split('.')
                if (eduarr[0].length > 3) {
                  var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                  var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                  eduarr[0] = newstrs;
                }
                this.num = eduarr.join(".") + '万手';

              } else if (numStr.length >= 9) {
                var edu = (repdata.chengJiaoLiang / 10000000000).toFixed(2);
                var eduarr = edu.toString().split('.')
                if (eduarr[0].length > 3) {
                  var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                  var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                  eduarr[0] = newstrs;
                }
                this.num = eduarr.join(".") + '亿手';
              } else {
                this.num = f(repdata.chengJiaoLiang / 100) + '手';
              }
            }
            //
            if (repdata.chengJiaoLiang == null || repdata.chengJiaoLiang == 0) {
              this.num = "--";
            }
            // 开盘价
            if (repdata.kaiPanJia) {
              this.open = this.toDecimal2(repdata.kaiPanJia);
            }
            if (repdata.kaiPanJia == null || repdata.kaiPanJia == 0) {
              this.open = "--";
            }
          }
          //
        }).catch((err) => {
          // console.log(err)
          clearInterval(window.timeK);
          clearInterval(window.timePianli)
        })
      },
      // 单位 万 亿处理 逗号相隔
      unitWan(str) {
        if (str.length < 11 && str.length >= 7) {
          var x = (str / 10000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '万';
        } else if (str.length >= 11) {
          var x = (str / 100000000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '亿';
        } else if (str.length < 7) {
          return str
        }

      },
      // 默认单位为万元处理 逗号相隔
      unitYi(str) {
        if (str.length >= 7) {
          var x = (str / 10000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '亿';
        } else if (str.length < 7 && str.length >= 5) {
          var x = (str / 1000000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '百万';
        } else if (str.length < 7 && str.length >= 6) {
          var x = (str / 10000000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '千万';
        } else if (str.length < 5) {
          return str + "万"
        }
      },
      // 更多行情数据 颜色判断 alex 比对昨收值 > red < green
      isColor(i) {
        if (this.infoArrOne[i].value !== null && this.infoArrOne[3].value !== null) {
          if (parseFloat(this.infoArrOne[i].value) > parseFloat(this.infoArrOne[3].value)) {
            $(".infoListOne").find('.infoItemValue').eq(i).css("color", "#fb4319")
          } else if (parseFloat(this.infoArrOne[i].value) < parseFloat(this.infoArrOne[3].value)) {
            $(".infoListOne").find('.infoItemValue').eq(i).css("color", "#29da89")
          }
        }
      },
      // 获取股票更多行情数据
      getMoreInfo() {
        /*this.$http ({
          methods: "GET",
          url: this.$api.stock.getMore,
          params: {
            code: this.companyCode
          }
        })*/
        let params = {code: this.companyCode}
        this.$axios.stock.getMore(params).then((res) => {
          if (res.data.returnCode == 1 && res.data.returnObject !== null) {
            this.infoArrOne[0].value = res.data.returnObject.zuiGaoJia;
            this.infoArrOne[1].value = res.data.returnObject.kaiPanJia;
            this.infoArrOne[2].value = res.data.returnObject.zuiDiJia;
            this.infoArrOne[3].value = res.data.returnObject.zuoShou;
            this.infoArrOne[4].value = res.data.returnObject.zhangTing;
            this.infoArrOne[5].value = res.data.returnObject.chengJiaoLiang;
            this.infoArrOne[6].value = res.data.returnObject.dieTing;
            this.infoArrOne[7].value = res.data.returnObject.chengJiaoE;
            // 如果是停牌并且是0 就显示 -- 否则是0 就显示 0
            if (this.shiFouTingPai) {
              // 是停牌
              this.infoArrOne.forEach((item) => {
                if (item.value == null || item.value == 0) {
                  item.value = '--';
                } else {
                  item.value = this.toDecimal2(item.value);
                }
              })
            } else {
              // 非停牌
              this.infoArrOne.forEach((item) => {
                if (item.value == null) {
                  item.value = '--';
                } else {
                  item.value = this.toDecimal2(item.value);
                }
              })
            }
            //
            // console.log('this.infoArrOne', this.infoArrOne);
            if (this.infoArrOne[5].value !== '--') {
              this.infoArrOne[5].value = this.unitWan(this.infoArrOne[5].value)
            }
            if (this.infoArrOne[7].value !== '--') {
              this.infoArrOne[7].value = this.unitWan(this.infoArrOne[7].value)
            }
            // 更多行情数据 颜色判断 alex 比对昨收值 > red < green
            this.isColor(0);
            this.isColor(1);
            this.isColor(2);
            this.isColor(4);
            this.isColor(6);
            //
            this.infoArrTwo[0].value = res.data.returnObject.huanShou;
            this.infoArrTwo[1].value = res.data.returnObject.liangBi;
            this.infoArrTwo[2].value = res.data.returnObject.zhenFu;
            this.infoArrTwo[3].value = res.data.returnObject.weiBi;
            this.infoArrTwo[4].value = res.data.returnObject.shiYingLv;
            this.infoArrTwo[5].value = res.data.returnObject.shiJingLv;
            this.infoArrTwo[6].value = res.data.returnObject.jingTaiShiYingLv;
            this.infoArrTwo[7].value = res.data.returnObject.meiGuJingZiChan;
            // 5.25 for Evans  // 如果是停牌并且是0 就显示 -- 否则是0 就显示 0
            if (this.shiFouTingPai) {
              // 是停牌
              this.infoArrTwo.forEach((item) => {
                if (item.value == null || item.value == 0) {
                  item.value = '--'
                } else {
                  item.value = this.toDecimal2(item.value);
                }
              })
            } else {
              // 非停牌
              this.infoArrTwo.forEach((item) => {
                if (item.value == null) {
                  item.value = '--'
                } else {
                  item.value = this.toDecimal2(item.value);
                }
              })
            }
            //
            this.infoArrTwo[0].value !== '--' ? this.infoArrTwo[0].value = this.infoArrTwo[0].value + "%" : this.infoArrTwo[0].value = "--";
            this.infoArrTwo[2].value !== '--' ? this.infoArrTwo[2].value = this.infoArrTwo[2].value + "%" : this.infoArrTwo[2].value = "--";
            this.infoArrTwo[3].value !== '--' ? this.infoArrTwo[3].value = this.infoArrTwo[3].value + "%" : this.infoArrTwo[3].value = "--";
            //
            this.infoArrThree[0].value = res.data.returnObject.zongShiZhi
            this.infoArrThree[1].value = res.data.returnObject.zongGuBen;
            this.infoArrThree[2].value = res.data.returnObject.liuTongShiZhi;
            this.infoArrThree[3].value = res.data.returnObject.wuXianShouGuHeJi;
            this.infoArrThree[4].value = res.data.returnObject.zhouZuiGao;
            this.infoArrThree[5].value = res.data.returnObject.mgfh;
            this.infoArrThree[6].value = res.data.returnObject.zhouZuiDi;
            this.infoArrThree[7].value = res.data.returnObject.gxsyl;
            // 5.25 for Evans  // 如果是停牌并且是0 就显示 -- 否则是0 就显示 0
            if (this.shiFouTingPai) {
              // 是停牌
              this.infoArrThree.forEach((item) => {
                if (item.value == null || item.value == 0) {
                  item.value = '--'
                } else {
                  item.value = this.toDecimal2(item.value);
                }
              });
            } else {
              // 非停牌
              this.infoArrThree.forEach((item) => {
                if (item.value == null) {
                  item.value = '--'
                } else {
                  item.value = this.toDecimal2(item.value);
                }
              });
            }
            //
            if (this.infoArrThree[0].value !== '--') {
              this.infoArrThree[0].value = this.unitYi(this.infoArrThree[0].value)
            }
            if (this.infoArrThree[1].value !== '--') {
              this.infoArrThree[1].value = this.unitYi(this.infoArrThree[1].value)
            }
            if (this.infoArrThree[2].value !== '--') {
              this.infoArrThree[2].value = this.unitYi(this.infoArrThree[2].value)
            }
            if (this.infoArrThree[3].value !== '--') {
              this.infoArrThree[3].value = this.unitYi(this.infoArrThree[3].value)
            }
            if (this.infoArrThree[7].value !== '--') {
              this.infoArrThree[7].value = this.infoArrThree[7].value + "%"
            }
          } else {
            // console.log('没有年报数据');
          }
        }).catch((err) => {
          // console.log(err)
          this.moreInfoShowOne = false;//更多详情数据页面 （第一页） 不显示
        })
      },
      // 显示第index个行情信息内容
      itemNameShow(index) {
        $(".itemInfo").eq(index).show().siblings().hide();
        $(".itemName").eq(index).css({"color": "#ffb148", "background": "#fff"}).siblings().css({
          "color": "#8d8d8d",
          "background": "#ffefda"
        })
        $(".content-Box").css('overflow', 'hidden');
        if (index == "1") {
          clearInterval(window.timeHuanShou);
          this.tonghangxinxi();//获取同行业偏离值
          window.timePianli = setInterval(() => {
            this.getPianlivalue();
            this.tonghangxinxi();
          }, 10000)
          $(".itemNameSplitLine").hide();
        } else if (index == "0") {
          clearInterval(window.timePianli)
          clearInterval(window.timeHuanShou);
          $(".itemNameSplitLine").eq('1').show();
          $(".itemNameSplitLine").eq('0').hide();
          this.getMoreInfo();//获取代码更多详情数据
        } else if (index == "2") {
          clearInterval(window.timePianli)
          this.tonghangHuanshou();//获取同行换手率值
          this.getHuanshoulv();
          window.timeHuanShou = setInterval(() => {
            this.tonghangHuanshou();
            this.getHuanshoulv();
          }, 10000)
          $(".itemNameSplitLine").eq('1').hide();
          $(".itemNameSplitLine").eq('0').show();
        }
      },
      // 查看更多行情数据
      watchMoreInfo() {
        this.moreInfoShow = true;
        this.itemNameShow("0")//默认显示行情数据 “0”
        $(".infoShadow").css('z-index', "3022").show();
      },
      // 关闭更多行情数据页面
      closeMoreInfo() {
        this.moreInfoShow = false;
        $(".infoShadow").css('z-index', "-22").hide();
        clearInterval(window.timePianli);
        clearInterval(window.timeHuanShou);
        $(".content-Box").css('overflow', 'scroll');
      },
      // 接口出错后点击刷新页面
      warningreLoad() {
        location.reload();
      },
      //
      lawshowsh() {
        this.lawshows1 = false;
        this.lawshows2 = true;
        this.GuidePageAffs1 = false;
        this.GuidePageAffs2 = true;
        // console.log('lawshowsh1-GuidePageAffs1:' + this.GuidePageAffs1 + '; GuidePageAffs2:' + this.GuidePageAffs2 + '; GuidePages:' + this.GuidePages)
      },
      //
      lawshowsh2() {
        window.localStorage.setItem("GuidePagesAffiche", false);
        this.GuidePages = false;
        this.GuidePageAffs1 = false;
        this.GuidePageAffs2 = false;
        // console.log('lawshowsh2-GuidePageAffs1:' + this.GuidePageAffs1 + '; GuidePageAffs2:' + this.GuidePageAffs2 + '; GuidePages:' + this.GuidePages)
      },
      // 判断是否关注该公司
      isFocusM() {
        let params = {
          searchStr: this.comCode
        }
        /*this.$http ({
          methods: "GET",
          url: this.$api.attention.searchStock,
          params: {
            searchStr: this.comCode
          }
        })*/
        this.$axios.attention.searchStock(params).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              var data = res.data.returnObject;
              data.forEach((item) => {
                if (this.companyCode == item.fullCode) {
                  if (item.status == 1) {
                    this.isFocus = true;
                  }
                }
              })
              console.log(data)
            }
          }
        }).catch((err) => {
          // console.log(err)
        })
      },
      // 添加关注
      addFocus() {
        // console.log(this.isFocus)
        if (this.isFocus == false) {
          let params = {
            companyId: this.comCode,
            companyFullCode: this.companyCode
          }
          /*this.$http ({
            methods: "GET",
            url: this.$api.attention.addAttention,
            params: {
              companyId: this.comCode,
              companyFullCode: this.companyCode
            }
          })*/
          this.$axios.attention.addAttention(params).then((res) => {
            // console.log(res)
            if (res.data.returnCode == 1) {
              this.isFocus = true;
              this.$vux.toast.show({text: '已添加我的关注', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          }).catch((err) => {
            // console.log(err)
          })
        } else if (this.isFocus == true) {
          let params = {
            companyFullCode: this.companyCode
          }
          /*this.$http ({
            methods: "GET",
            url: this.$api.attention.deleteAttention,
            params: {
              companyFullCode: this.companyCode
            }
          })*/
          this.$axios.attention.deleteAttention(params).then((res) => {
            // console.log(res)
            if (res.data.returnCode == 1) {
              this.isFocus = false;
              this.$vux.toast.show({text: '已取消关注', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          }).catch((err) => {
            // console.log(err)
          })
        }
      },
      // 偏离值获取失败，刷新页面
      waringBin() {
        window.location.reload();
      },
      // 换手率点击
      showChange() {
        var pialival = parseInt(this.change)
        this.alertHshow();
      },
      // 打开换手率页面
      alertHshow() {
        this.moreInfoShow = true;
        this.itemNameShow("2")//显示换手率数据 “2”
        $(".infoShadow").css('z-index', "1023").show();
      },
      // 获取换手率数据
      getHuanshoulv() {
        let params = {
          code: this.companyCode
        }
        /*this.$http ({
          methods: "GET",
          url: this.$api.stock.getThrunoverInfo,
          params: {
            code: this.companyCode
          }
        })*/
        this.$axios.stock.getThrunoverInfo(params).then((res) => {
          //是否闭市
          if (res.data.returnCode == 1) {
            this.bishi = res.data.returnObject.biShi;
            //关注公司当日日均换手率 当日换手率占比
            this.dangri = res.data.returnObject.todayThurnover;
            //
            if (res.data.returnObject.todayRatio == null || res.data.returnObject.todayRatio == undefined) {
              this.dangrizhanbi = "--"
              // console.log('dangrizhanbi', this.dangrizhanbi)
            } else {
              this.dangrizhanbi = res.data.returnObject.todayRatio;
              // console.log('dangrizhanbi1', this.dangrizhanbi)
            }
            //关注公司前两日日均换手率 前两日换手率占比
            this.qianliangri = res.data.returnObject.twoDaysThurnover;
            if (res.data.returnObject.twoDaysRatio == null || res.data.returnObject.twoDaysRatio == undefined) {
              this.qianliangrizhanbi = '--'
            } else {
              this.qianliangrizhanbi = res.data.returnObject.twoDaysRatio;
            }
            //关注公司前三日日均换手率 前三日换手率占比
            this.qiansanri = res.data.returnObject.threeDaysThurnover;
            if (res.data.returnObject.threeDayRatio == null || res.data.returnObject.threeDayRatio == undefined) {
              this.qiansanrizhanbi = '--'
            } else {
              this.qiansanrizhanbi = res.data.returnObject.threeDayRatio;
            }
          }
        }).catch((err) => {
          // console.log(err)
        })
      },
      // 获取同行换手率信息
      tonghangHuanshou() {
        if (this.bishi == '' || this.bishi == null) {
          this.bishi = true
        }
        let params = {
          industry: this.Industry,
          code: this.comCode,
          biShi: this.bishi,
          pageNum: 1,
          pageSize: this.pageHsize,
        }
        /*this.$http ({
          methods: "GET",
          url: this.$api.stock.getSameIndustryThrunoverInfo,
          params: {
            industry: this.Industry,
            code: this.comCode,
            biShi: this.bishi,
            pageNum: 1,
            pageSize: this.pageHsize,
          }
        })*/
        this.$axios.stock.getSameIndustryThrunoverInfo(params).then((res) => {
          if (res.data.returnCode == 1) {
            let hangyeListH = res.data.returnObject;
            hangyeListH.forEach((item) => {
              if (item.shiFouTingPai == true) {
                item.todayThurnover = null;
                item.todayRatio = null;
                item.twoDaysRatio = null;
                item.twoDaysThurnover = null;
                item.threeDayRatio = null;
                item.threeDaysThurnover = null;
              } else {
                item.todayThurnover = this.toDecimal2(item.todayThurnover);
                item.todayRatio = this.toDecimal2(item.todayRatio);
                item.twoDaysRatio = this.toDecimal2(item.twoDaysRatio);
                item.twoDaysThurnover = this.toDecimal2(item.twoDaysThurnover);
                item.threeDayRatio = this.toDecimal2(item.threeDayRatio);
                item.threeDaysThurnover = this.toDecimal2(item.threeDaysThurnover);
              }
              item.shiYingLv = this.toDecimal2(item.shiYingLv);
            })
            //
            this.hangyeListH = hangyeListH
            if (res.data.rows >= res.data.total) {
              this.watchmoreH = false;
              $(".seeMoreH").find('span').text('收起查看')
              $(".seeMoreH").find('img').css('transform', 'rotate(360deg)');
            }
            //
            if (this.hangyeListH) {
              if (this.hangyeListH.length <= 3) {
                $(".seeMoreH").hide();
                $(".industryH").css('height', '74%')
                $(".scrollerBoxH").css('height', 'auto')
              }
            } else {
              $(".seeMoreH").css('opacity', '0');
              $("#hsl").text('暂无同行换手率信息')
            }
          }
        }).catch((err) => {
          // console.log(err)
          //this.showERRh = true;
          $(".seeMoreH").css('opacity', '0');
          $("#hsl").text('暂无同行换手率信息')
        })
      },
      // 换手率查看更多
      warchMoreHS() {
        if (this.watchmoreH == true) {
          $(".industryH").css('height', 'auto')
          $(".scrollerBoxH").css({'overflow-y': 'scroll', 'overflow-x': 'hidden'})
          this.pageHsize = this.pageHsize + 10;
          this.tonghangHuanshou();
        } else if (this.watchmoreH == false) {
          $(".industryH").css({'height': '74%', 'overflow': 'hidden'})
          $(".scrollerBoxH").css({'overflow-y': 'hidden', 'overflow-x': 'hidden'})
          $(".seeMoreH").find('span').text('展开更多')
          $(".seeMoreH").find('img').css('transform', 'rotate(180deg)')
          this.pageHsize = 0;
          this.watchmoreH = true;
        }
      },
      // 小数点后保留两位小数 没有添加0
      toDecimal2(x) {
        var fX = parseFloat(x);
        if (isNaN(fX)) {
          return;
        }
        var f = Math.round(x * 100) / 100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      //
      listInfoH(index) {
        this.$router.push({
          path: '/afficheList',
          query: {code: this.hangyeListH[index]['code'], name: this.hangyeListH[index]['name']}
        });
        $("title").text(this.hangyeListH[index]['name'])
      },
      //
      listInfo(index) {
        this.$router.push({
          path: '/afficheList',
          query: {code: this.hangyeList[index]['code'], name: this.hangyeList[index]['name']}
        });
        $("title").text(this.hangyeList[index]['name'])
      },
      // 获取偏离值
      getPianlivalue() {
        var curTime = '';
        var curTimeArr = [];
        let params = {
          code: this.companyCode,
        }
        /*this.$http ({
          methods: "GET",
          url: this.$api.stock.getDeviationValue,
          params: {
            code: this.companyCode,
          }
        })*/
        this.$axios.stock.getDeviationValue(params).then((res) => {
          if (res.data.returnCode == 1) {
            let deviationData = res.data.returnObject;
            var currentTime = this.formatS(deviationData.dateTime);
            if (deviationData.data[0].jinRiShiFouTingPai == true) {
              deviationData.bTotal = null
            }
            curTime = currentTime;
            if (deviationData.turnoverIsChange == false) {
              // // console.log("不异动")
            } else {
              // // console.log('异动')
              $(".huanshoulv").css({
                'background': 'linear-gradient(#fe533d,#fe533d)', "padding-right": "6px"
              }).find('span').css({'color': '#fff', "margin-top": "0"});
              $(".gantanhao").show();
            }
            //
            var currentTimeArr = currentTime.split(',');
            curTimeArr = currentTimeArr;
            // 判断时间凌晨到9点30之前停止时间函数获取股票信息
            if (currentTimeArr[3] < 10 && currentTimeArr[3] >= 0) {
              if (currentTimeArr[3] == 9 && currentTimeArr[4] <= 30) {
                clearInterval(window.timeK);
                clearInterval(window.timePianli)
              } else if (currentTimeArr[3] >= 9 && currentTimeArr[4] > 30) {
                // // console.log('不用清除')
              } else {
                clearInterval(window.timeK);
                clearInterval(window.timePianli)
              }
            } else if (currentTimeArr[3] > 15) {
              clearInterval(window.timeK);
              clearInterval(window.timePianli)
            }
            if (this.pianlivalFlag == true) {
              this.deviate = "--"
            } else {
              this.deviate = this.toDecimal2(deviationData.bTotal) + '%'; // 偏离值
            }
            var comName = deviationData.data[0].name;
            var comCode = deviationData.data[0].code;

            var pianlizhi = parseFloat(deviationData.bTotal); //parseInt()
            var jueduizhi = Math.abs(pianlizhi)
            //
            if (comName.indexOf('ST') !== 0 && comName.indexOf('*ST') !== 0) {
              // // console.log('没有ST和*ST', jueduizhi, 'ST', comName.indexOf('ST'), '*ST', comName.indexOf('*ST'))
              // // console.log(jueduizhi, 0 <= jueduizhi < 10)
              // // console.log('bosdjldsjlsdds', deviationData.bTotal, (jueduizhi == 10 && deviationData.bTotal < 20))
              if (0 < jueduizhi && jueduizhi < 10 || (deviationData.bTotal < 0 && jueduizhi <= 0) || (0 < deviationData.bTotal && deviationData.bTotal < 10)) {
                // console.log("配色1")
                $(".san").css('border-top', '12.5px solid #ffb148')
                $('.fang').css('background', 'linear-gradient(#ffb148,#ffb148)')
              } else if (10 < jueduizhi && jueduizhi < 20 || (jueduizhi == 10 && res.data.returnObject.bTotal < 20)) {
                // console.log("配色2");
                // console.log(jueduizhi)
                $(".san").css('border-top', '12.5px solid #ff9348')
                $('.fang').css('background', 'linear-gradient(#ff8948,#ff9048)')
              } else if (jueduizhi >= 20) {
                // console.log("配色3")
                $(".san").css('border-top', '12.5px solid #ff6f43')
                $('.fang').css('background', 'linear-gradient(#fe533d,#fe6b42)')
              }
              if (deviationData.bTotal == null || this.pianlivalFlag == true || deviationData.bTotal == 0) {
                // console.log("灰色", deviationData.bTotal, this.pianlivalFlag,)
                $(".san").css('border-top', '12.5px solid #a9a9a9')
                $('.fang').css('background', 'linear-gradient(#a9a9a9,#a9a9a9)')
                this.deviate = '--'
                if (deviationData.bTotal == 0) {
                  this.deviate = '0.00%';
                }
              }
            } else {
              if (this.companyCode.indexOf('SH') == 0) {  // 沪市
                // console.log(Math.abs(-7.5))
                // console.log('只有ST', jueduizhi, 'ST', comName.indexOf('ST'), '*ST', comName.indexOf('*ST'))
                // // console.log(jueduizhi, "", 0 < jueduizhi && jueduizhi < 7.5, (deviationData.bTotal < 0 && jueduizhi <= 0));
                if (0 < jueduizhi && jueduizhi < 7.5 || (deviationData.bTotal < 0 && jueduizhi <= 0) || (0 < deviationData.bTotal && deviationData.bTotal < 7.5)) {
                  //// console.log('jueduizhi', jueduizhi)
                  // console.log("配色1")
                  $(".san").css('border-top', '12.5px solid #ffb148')
                  $('.fang').css('background', 'linear-gradient(#ffb148,#ffb148)')
                } else if (7.5 < jueduizhi && jueduizhi < 15 || (jueduizhi == 7.5 && deviationData.bTotal < 15)) {
                  // console.log("配色2 沪市 ", this.comCode);
                  // console.log('jueduizhi', jueduizhi)
                  $(".san").css('border-top', '12.5px solid #ff9348')
                  $('.fang').css('background', 'linear-gradient(#ff8948,#ff9048)')
                } else if (jueduizhi >= 15) {
                  // console.log("配色3")
                  $(".san").css('border-top', '12.5px solid #ff6f43')
                  $('.fang').css('background', 'linear-gradient(#fe533d,#fe6b42)')
                }
                if (deviationData.bTotal == null || this.pianlivalFlag == true || deviationData.bTotal == 0) {
                  // console.log("灰色", deviationData.bTotal, this.pianlivalFlag,)
                  $(".san").css('border-top', '12.5px solid #a9a9a9')
                  $('.fang').css('background', 'linear-gradient(#a9a9a9,#a9a9a9)')
                  this.deviate = '--'
                  if (deviationData.bTotal == 0) {
                    this.deviate = '0.00%';
                  }
                }
              } else { //   if(comCode.indexOf('SH') == -1 && comCode.indexOf('SZ') == 0)
                // console.log('-------------------------')
                if (0 < jueduizhi && jueduizhi < 6 || (deviationData.bTotal < 0 && jueduizhi <= 0) || (0 < deviationData.bTotal && deviationData.bTotal < 6)) {
                  // console.log("配色1")
                  $(".san").css('border-top', '12.5px solid #ffb148')
                  $('.fang').css('background', 'linear-gradient(#ffb148,#ffb148)')
                } else if (6 <= jueduizhi && jueduizhi < 12) {
                  // console.log("配色2 深市", this.comCode);
                  // console.log('jueduizhi', jueduizhi)
                  $(".san").css('border-top', '12.5px solid #ff9348')
                  $('.fang').css('background', 'linear-gradient(#ff8948,#ff9048)')
                } else if (jueduizhi >= 12) {
                  // console.log("配色3")
                  $(".san").css('border-top', '12.5px solid #ff6f43')
                  $('.fang').css('background', 'linear-gradient(#fe533d,#fe6b42)')
                }
                if (deviationData.bTotal == null || this.pianlivalFlag == true || deviationData.bTotal == 0) {
                  // console.log('配灰色', deviationData.bTotal)
                  $(".san").css('border-top', '12.5px solid #a9a9a9')
                  $('.fang').css('background', 'linear-gradient(#a9a9a9,#a9a9a9)')
                  this.deviate = '--';
                  if (deviationData.bTotal == 0) {
                    this.deviate = '0.00%';
                  }
                }
              }
            }
            //
            this.today = this.format1(deviationData.data[1].jinRi);
            this.yesterday = this.format1(deviationData.data[1].zuoRi);
            this.qiantian = this.format1(deviationData.data[1].qianRi);
            // 今日
            if (deviationData.data[0].jinRiShiFouTingPai == true) {
              this.jinri = null;
            } else {
              this.jinri = this.toDecimal2(deviationData.data[0].jinRiZhangDie);
            }
            // 昨日
            if (deviationData.data[0].zuoRiShiFouTingPai == true) {
              this.zuori = null;
            } else {
              this.zuori = this.toDecimal2(deviationData.data[0].zuoRiZhangDie);
            }
            // 前日
            if (deviationData.data[0].qianRiShiFouTingPai == true) {
              this.qianri = null;
            } else {
              this.qianri = this.toDecimal2(deviationData.data[0].qianRiZhangDie);
            }
            // 行业信息
            this.Industry = deviationData.industry; // 行业信息
            this.Industry = this.Industry == null ? '' : this.Industry;
            // 市盈率
            this.shiyinglv = this.toDecimal2(deviationData.data[0].shiYingLv);
            /*上证指数*/
            // 今日涨跌
            this.dapanjr = this.toDecimal2(deviationData.data[1].jinRiZhangDie);
            // 昨日涨跌
            this.dapanzr = this.toDecimal2(deviationData.data[1].zuoRiZhangDie);
            // 前日涨跌
            this.dapanqr = this.toDecimal2(deviationData.data[1].qianRiZhangDie);
            //
            this.dapansy = deviationData.data[1].shiYingLv;
            //
            this.dapanname = deviationData.data[1].name ? deviationData.data[1].name : '';
            //
            this.apidate = deviationData.apiDate;
            this.simCode = this.companyCode.substring(2, 8);
            var code = deviationData.data[1].code;
            this.dapancode = code.substring(2, 8);
            // 不再区分时间是否是下午3 点 还是上午9 点 统一由后台时间判断
            this.updateTime = this.getNowFormatDate(deviationData.apiDate);
            // console.log('this.updateTime', deviationData.apiDate, this.updateTime);
            //
            if (curTimeArr[3] >= 15 || curTimeArr[3] <= 9) {
              // 大于等于下午3点 或者 小于等于 上午9点
              if (curTimeArr[3] == 9 && currentTimeArr[4] <= 30 || curTimeArr[3] < 9) {
                // 等于9点 并且 小于等于9点30 或者  小于9点
                // this.updateTime = "昨日下午三点半";
                // this.updateTime = this.getNowFormatDate_Zuo() + "15:00"
              } else if (curTimeArr[3] >= 15) {
                // 大于 等于 下午3点
                // this.updateTime = "今天下午三点半";
                // this.updateTime = this.getNowFormatDate_Jin() + "15:00"
                clearInterval(window.timeK);
                clearInterval(window.timePianli)
              }
            }
            //
            if (curTimeArr[3] >= 9 && curTimeArr[3] < 15) {
              if ((curTimeArr[3] >= 9 && currentTimeArr[4] > 30) || curTimeArr[3] >= 10) {
                // 大于等于 9点 并且 大于30分 或者是大于等于10点
                // this.updateTime = this.getNowFormatDate(deviationData.apiDate);
              }
            }
          }
        }).catch((err) => {
          // console.log(err)
          // this.showERR = true;
          $(".san").css('border-top', '12.5px solid #a9a9a9')  //灰色
          $('.fang').css('background', 'linear-gradient(#a9a9a9,#a9a9a9)')
          this.deviate = '--';
          clearInterval(window.timeK);
          clearInterval(window.timePianli)
        })
      },
      // 获取今天日期
      getNowFormatDate_Jin() {
        var date = new Date();
        var splittip = "-";
        var splittip2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + splittip + month + splittip + strDate + ' ';
        return currentdate;
      },
      // 获取昨日日期
      getNowFormatDate_Zuo() {
        var date = new Date();
        var splittip = "-";
        var splittip2 = ":";
        var month = date.getMonth() + 1;
        date.setTime(date.getTime() - 24 * 60 * 60 * 1000);
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + splittip + month + splittip + strDate + ' ';
        return currentdate;
      },
      // 获取更新日期 处理 时间戳
      getNowFormatDate(date) {
        var date = new Date(parseInt(date));
        var splittip = "-";
        var splittip2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        var getMinutes;
        if (date.getMinutes() < 10) {
          getMinutes = '0' + date.getMinutes();
        } else {
          getMinutes = date.getMinutes();
        }
        var currentdate = date.getFullYear() + splittip + month + splittip + strDate + ' ' + date.getHours() + splittip2 + getMinutes;
        // console.log(date, currentdate);
        return currentdate;
      },
      // 偏离值查看更多
      watchMore() {
        if (this.watchmore == true) {
          $(".industry").css('height', 'auto')
          $(".scrollerBox").css({'overflow-y': 'scroll', 'overflow-x': 'hidden'})
          this.pagesize = this.pagesize + 10;
          this.tonghangxinxi();
        } else if (this.watchmore == false) {
          /*// console.log('-------------------------------/////////////////////////////////////')*/
          $(".industry").css({'height': '135px', 'overflow': 'hidden'})
          $(".scrollerBox").css({'overflow-y': 'hidden', 'overflow-x': 'hidden'})
          $(".seeMore").find('span').text('展开更多')
          $(".seeMore").find('img').css('transform', 'rotate(180deg)')
          this.pagesize = 0;
          this.watchmore = true;
        }
      },
      //
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      //
      formatS(shijianchuo) {
        // shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + ',' + this.add0(m) + ',' + this.add0(d) + ',' + this.add0(h) + ',' + this.add0(mm) + ',' + this.add0(s);
      },
      //
      format(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(parseInt(shijianchuo));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y + '年' + this.add0(m) + '月' + this.add0(d) + '日';
      },
      //
      format1(shijianchuo) {
        // shijianchuo是整数，否则要parseInt转换
        var time = new Date(parseInt(shijianchuo));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return this.add0(m) + '月' + this.add0(d) + '日';
      },
      //
      getContent() {
        var companyCodes = this.$regExp.number(this.companyCode);
        this.comCode = companyCodes;
        let params = {
          sort: 'releaseDate',
          companyCode: companyCodes,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
        }
        /*this.$http ({
          method: "GET",
          url: this.$api.disclosure.search,
          params: {
            sort: 'releaseDate',
            companyCode: companyCodes,
            pageSize: this.pageSize,
            pageNum: this.pageNum,
          }
        })*/
        this.$axios.disclosure.search(params).then((res) => {
          // console.log('**************', res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.list == null) {
              this.linkIsErr = true;
              this.gonggaoText = "暂无公告！";
              $(".gonggaoWaringImg").css({"background-image": "https://oss.in-hope.cn/xiaoan/h5_static/warning/warningCode.png"})
              $(".gonggaoBtn").hide();
            } else {
              if (this.contentList.length > 0) {
                for (var i in res.data.returnObject.list) {
                  this.contentList.push(res.data.returnObject.list[i]);
                }
              } else if (this.contentList.length == 0) {
                this.contentList = res.data.returnObject.list;
              }
              this.listCount = res.data.returnObject.count;
              if (this.listCount >= 30) {
                $('.showPrompt').css('display', "block")
                setTimeout(() => {
                  $('.showPrompt').animate({bottom: "0px", display: "none"});
                }, 2500);
              }
              this.listNum = this.contentList.length;
            }
          }
        }).catch((err) => {
          this.linkIsErr = true;
          this.gonggaoText = "获取公告数据失败，请刷新重试！";
          $(".gonggaoWaringImg").css({"background-image": "https://oss.in-hope.cn/xiaoan/h5_static/warning/warnin.png"})
          //background-image: url("/static/img/warning/warnin.png");
          // console.log(err)
        });
      },
      //
      autoComplete() {
        var companyCodes = this.$regExp.number(this.companyCode);
        this.comCode = companyCodes;
        let params = {
          key: this.comCode,
        }
        this.$axios.common.autoComplete(params).then(res => {
          if (res.data.returnCode == 1) {
            let codeData = res.data.returnObject;
            //公告获取完成后分享功能配置
            var shareTitle1 = codeData[0].name + "" + this.comCode;
            var selink = window.location.href;
            this.$weixin.wxshare(shareTitle1, '', selink, this.$api.share.defaultImg, true);
          }
        }).catch((err) => {
          // console.log(err);
        })
      },
      //
      timeData() {
        window.timeK = setInterval(() => {
          this.getData("true");
        }, 10000);
      },
      //
      searchCode() {
        let code = 1;
        this.$router.push({path: '/afficheSearch', query: {inputCode: code}});
        clearInterval(window.timeK);
        clearInterval(window.timePianli)
      },
      //
      company() {
        var code = 2;
        this.$router.push({path: '/afficheSearch', query: {inputCode: code}});
        clearInterval(window.timeK);
        clearInterval(window.timePianli)
      },
      // 获取同行偏离值信息
      tonghangxinxi() {
        let params = {
          industry: this.Industry,
          pageNum: 1,
          apiDate: this.apidate,
          code: this.simCode,
          pageSize: this.pagesize,
        }
        /*this.$http ({
          methods: "GET",
          url: this.$api.stock.getSameIndustryStockInfo,
          params: {
            industry: this.Industry,
            pageNum: 1,
            apiDate: this.apidate,
            code: this.simCode,
            pageSize: this.pagesize,
          }
        })*/
        this.$axios.stock.getSameIndustryStockInfo(params).then((res) => {
          if (res.data.returnCode == 1) {
            //
            let industryData = res.data.returnObject;
            //
            if (res.data.rows >= res.data.total) {
              this.watchmore = false;
              $(".seeMore").find('span').text('收起查看')
              $(".seeMore").find('img').css('transform', 'rotate(360deg)')
            }
            //
            industryData.forEach((item) => {
              if (item.jinRiShiFouTingPai == true) {
                item.jinRiZhangDie = null;
              } else {
                item.jinRiZhangDie = this.toDecimal2(item.jinRiZhangDie);
              }
              if (item.zuoRiShiFouTingPai == true) {
                item.zuoRiZhangDie = null;
              } else {
                item.zuoRiZhangDie = this.toDecimal2(item.zuoRiZhangDie);
              }
              if (item.qianRiShiFouTingPai == true) {
                item.qianRiZhangDie = null;
              } else {
                item.qianRiZhangDie = this.toDecimal2(item.qianRiZhangDie);
              }
              item.shiYingLv = this.toDecimal2(item.shiYingLv);
            })
            //
            this.hangyeList = industryData;
            if (this.hangyeList.length <= 3) {
              $(".seeMore").hide();
              $(".industry").css('height', 'auto')
              $(".scrollerBox").css('height', 'auto')
            }
            //
          } else {
            $('#plz').text('暂无同行偏离值信息')
            $("#plzUpdateTime").addClass('updateStyle');
            // this.$vux.toast.show({text: '获取同行业数据失败！', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          // console.log(err)
          $('#plz').text('暂无同行偏离值信息')
          $("#plzUpdateTime").addClass('updateStyle')
          $(".seeMore").hide();
          $(".industry").css('height', 'auto')
          $(".scrollerBox").css('height', '85%')
        })
      },
      //
      alertBshow() {
        this.moreInfoShow = true;
        this.itemNameShow("1")//显示偏离值数据 “1”
        $(".infoShadow").css('z-index', "1023").show();
      },
      //
      dianji(index) {
        clearInterval(window.timeK);
        clearInterval(window.timePianli)
        this.$router.push({path: '/afficheContent', query: {id: this.contentList[index].mainId}});
        //HTML5本地存储
        if (window.localStorage) {
          localStorage.setItem("name", this.companyName);
          localStorage.setItem("code", this.companyCode);
        } else {
          Cookie.write("name", this.companyName);
          Cookie.write("code", this.companyCode);
        }
      },
      //
      loadMore() {
        let lastValue = this.listNum;
        if (lastValue < this.listCount) {
          this.loading = true;
          this.allLoaded = true;
        } else {
          this.loading = false;
          this.allLoaded = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.listCount) {
            this.pageNum += 1;
            this.getContent();
          }
          setTimeout(() => {
            this.loading = false;
            this.allLoaded = false;
          }, 5000)
        }, 300);
      },
      //
      getData(index) {
        // 方法
        function f(n) {
          var b = parseInt(n).toString();
          var len = b.length;
          if (len <= 3) {
            return b;
          }
          var r = len % 3;
          return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") : b.slice(r, len).match(/\d{3}/g).join(",");
        }
        if (index == 'true') {
          let params = {
            obj: this.companyCode
          }
          /*this.$http ({
            method: "GET",
            url: this.$api.attention.getStockInfo,
            params: {
              obj: this.companyCode
            }
          })*/
          this.$axios.attention.getStockInfo(params).then((res) => {
            if (res.data.returnCode == 1) {
              this.nowTime = res.data.returnObject.timestamp;
              //
              var currentTime = this.formatS(res.data.returnObject.timestamp);
              var curTime = currentTime;
              var currentTimeArr = currentTime.split(',');
              var curTimeArr = currentTimeArr;
              // 判断时间凌晨到9点30之前停止时间函数获取股票信息
              if (currentTimeArr[3] < 10 && currentTimeArr[3] >= 0) {
                if (currentTimeArr[3] == 9 && currentTimeArr[4] <= 30) {
                  clearInterval(window.timeK);
                } else if (currentTimeArr[3] >= 9 && currentTimeArr[4] > 30) {
                  // // console.log('不用清除')
                } else {
                  clearInterval(window.timeK);
                }
              } else if (currentTimeArr[3] >= 15) {
                clearInterval(window.timeK);
              }
              //
              var repdata = res.data.returnObject.data;
              this.shiFouTingPai = repdata.shiFouTingPai;
              this.title = repdata.zhongWenJianCheng + "【" + repdata.obj + "】";
              // 涨跌幅
              if (repdata.zhangFu != null) {
                if (repdata.zhangFu > 0) {
                  this.up = "+" + this.toDecimal2(repdata.zhangFu) + "%";
                  $(".down").css('color', '#fb4319')
                  $(".now").css('color', '#fb4319')
                  $(".up").css('color', '#fb4319')
                } else if (repdata.zhangFu < 0) {
                  this.up = this.toDecimal2(repdata.zhangFu) + "%";
                  $(".down").css('color', '#29da89')
                  $(".now").css('color', '#29da89')
                  $(".up").css('color', '#29da89')
                } else if (repdata.zhangFu == 0) {
                  this.up = this.toDecimal2(repdata.zhangFu) + "%";
                  $(".down").css('color', 'black')
                  $(".now").css('color', 'black')
                  $(".up").css('color', 'black')
                }
              } else {
                this.up = "--";
                $(".down").css('color', 'black')
                $(".now").css('color', 'black')
                $(".up").css('color', 'black')
              }
              // 涨跌
              if (repdata.zhangDie != null) {
                if (repdata.zhangDie > 0) {
                  this.down = "+" + this.toDecimal2(repdata.zhangDie);
                } else if (repdata.zhangDie < 0) {
                  this.down = this.toDecimal2(repdata.zhangDie);
                } else if (repdata.zhangDie == 0) {
                  this.down = this.toDecimal2(repdata.zhangDie);
                }
              } else {
                this.down = '--';
              }
              // 开盘价
              if (repdata.zuiXinJia) {
                this.now = this.toDecimal2(repdata.zuiXinJia);
              } else {
                this.now = "--";
                this.pianlivalFlag = true;
              }
              // // // // // // // // // //
              // 是否开盘
              if (this.shiFouTingPai == true) {
                this.now = '--'; // “停牌”
                this.up = "--";
                this.down = "--";
                $(".up").css('color', 'black')
                $(".now").css('color', 'black')
                $(".down").css('color', 'black')
              }
              // 成交额
              if (repdata.chengJiaoE) {
                var eduStr = repdata.chengJiaoE.toString();
                if (eduStr.length >= 5 && eduStr.length < 9) {
                  var edu = (repdata.chengJiaoE / 10000).toFixed(2);
                  var eduarr = edu.toString().split('.')
                  if (eduarr[0].length > 3) {
                    var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                    var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                    eduarr[0] = newstrs;
                  }
                  this.edu = eduarr.join(".") + '万';
                } else if (eduStr.length >= 9) {
                  var edu = (repdata.chengJiaoE / 100000000).toFixed(2);
                  var eduarr = edu.toString().split('.')
                  if (eduarr[0].length > 3) {
                    var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                    var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                    eduarr[0] = newstrs;
                  }
                  this.edu = eduarr.join(".") + '亿';
                } else {
                  this.edu = f(repdata.chengJiaoE);
                }
              }
              // 成交量
              if (repdata.chengJiaoLiang) {
                var numStr = (repdata.chengJiaoLiang / 100).toString().split('.')[0];
                if (numStr.length >= 5 && numStr.length < 9) {
                  /*// console.log('万',repdata.chengJiaoLiang/100)*/
                  var edu = (repdata.chengJiaoLiang / 1000000).toFixed(2);
                  var eduarr = edu.toString().split('.')
                  if (eduarr[0].length > 3) {
                    var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                    var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                    eduarr[0] = newstrs;
                  }
                  this.num = eduarr.join(".") + '万手';
                } else if (numStr.length >= 9) {
                  var edu = (repdata.chengJiaoLiang / 10000000000).toFixed(2);
                  var eduarr = edu.toString().split('.')
                  if (eduarr[0].length > 3) {
                    var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                    var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                    eduarr[0] = newstrs;
                  }
                  this.num = eduarr.join(".") + '亿手';
                } else {
                  this.num = f(repdata.chengJiaoLiang / 100) + '手';
                }
              }
              if (repdata.chengJiaoLiang == null || repdata.chengJiaoLiang == 0) {
                this.num = "--";
              }
              // 换手率
              if (repdata.huanShou == null || repdata.huanShou == 0 || repdata.huanShou == undefined) {
                this.change = "--";
              } else {
                this.change = this.toDecimal2(repdata.huanShou) + "%";
              }
              // 最高价
              if (repdata.zuiGaoJia == null || repdata.zuiGaoJia == 0 || repdata.zuiGaoJia == undefined) {
                this.high = "--";
              } else {
                this.high = this.toDecimal2(repdata.zuiGaoJia);
              }
              // 成交额
              if (repdata.chengJiaoE) {
                var eduStr = repdata.chengJiaoE.toString();
                if (eduStr.length >= 5 && eduStr.length < 9) {
                  var edu = (repdata.chengJiaoE / 10000).toFixed(2);
                  var eduarr = edu.toString().split('.')
                  if (eduarr[0].length > 3) {
                    var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                    var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                    eduarr[0] = newstrs;
                  }
                  this.edu = eduarr.join(".") + '万';
                } else if (eduStr.length >= 9) {
                  /*// console.log('亿',repdata.chengJiaoE)*/
                  var edu = (repdata.chengJiaoE / 100000000).toFixed(2);
                  var eduarr = edu.toString().split('.')
                  if (eduarr[0].length > 3) {
                    var tmp = eduarr[0].substring(0, eduarr[0].length - 3);
                    var newstrs = tmp + ',' + eduarr[0].substring(eduarr[0].length - 3, eduarr[0].length);
                    eduarr[0] = newstrs;
                  }
                  this.edu = eduarr.join(".") + '亿';
                } else {
                  this.edu = f(repdata.chengJiaoE);
                }
              }
              if (repdata.chengJiaoE == null || repdata.chengJiaoE == 0 || repdata.chengJiaoE == undefined) {
                this.edu = "--";
              }
              // 最低价
              if (repdata.zuiDiJia) {
                this.low = this.toDecimal2(repdata.zuiDiJia);
              }
              if (repdata.zuiDiJia == null || repdata.zuiDiJia == 0) {
                this.low = "--";
              }
              // 开盘家
              if (repdata.kaiPanJia) {
                this.open = this.toDecimal2(repdata.kaiPanJia);
              }
              if (repdata.kaiPanJia == null || repdata.kaiPanJia == 0) {
                this.open = "--";
              }
            }
          }).catch((err) => {
            // console.log(err)
            clearInterval(window.timeK);
            clearInterval(window.timePianli)
          })
        } else if (index == "false") {
        }
      }
    },
    beforeDestroy: function () {
      clearInterval(window.timeK);
      clearInterval(window.timePianli)
    },
    destroyed: function () {
      clearInterval(window.timeK);
      clearInterval(window.timePianli)
    }
  }
</script>

<style lang="scss">
  .affiche-dialog {
    .weui-dialog {
      height: 90%;
      width: 90%;
      max-width: 100%;
      background-color: transparent;
      .dialog-wrapper {
        height: 100%;
        width: 100%;
        .moreInfo {
          height: 100%;
          width: 100%;
          position: static;
        }
      }
    }

  }
  .xiaoan-box.affiche-list {
    padding-bottom: 50px;
    position: relative;
    .affiche-list-scroll {
      height: 100%;
      width: 100%;
      background-color: #FFFFFF;
      overflow: hidden;
    }
    .focAdd {
      margin: 0;
      padding: 0;
      height: 50px;
      width: 50px;
      background-color: white;
      opacity: 0.9;
      box-shadow: 0px 0px 12px #e3e3e3;
      position: absolute;
      bottom: 70px;
      border-radius: 50%;
      right: 12px;
      font-style: normal;
      text-align: center;
      line-height: 50px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      .focAddImg {
        width: 100%;
        height: 52%;
        display: inline-block;
        background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/add.png");
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: 40%;
      }
      .focAddText {
        width: 100%;
        height: 48%;
        display: inline-block;
        font-size: 10px;
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        color: #ffb148;
        line-height: 20px;
        text-align: center;
      }
      .focAddText.endFocus {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 50px;
        font-size: 11px;
        color: #9b9b9b !important;
      }
    }
    // 更多行情数据页面
    #dialog-moreInfo {
      width: 93%;
      height: 88%;
      position: absolute;
      left: 0;
      right: 0;
      bottom: -4%;
      top: 0;
      margin: auto;
      z-index: 3055;
      .moreInfo-box {
        width: 100%;
        height: 100%;
        overflow: hidden;
        .infoBox {
          width: 100%;
          height: 91%;
          background: #fff;
          border-radius: 3px;
          overflow: hidden;
          .selectItem {
            width: 100%;
            height: 9%;
            background: #ffefda;
            .itemName {
              position: relative;
              font-size: 15px;
              float: left;
              font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
              width: 33.33%;
              height: 100%;
              text-align: center;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
          .itemInfoBox {
            width: 100%;
            height: 91%;
            position: relative;
            .itemInfo {
              width: 100%;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              text-align: center;
              display: none;
            }
            // 换手率的
            .itemInfo.itemInfo-ratio {
              .alertContent {
                .thisCompany {
                  .alertTitle {
                    padding: 0 5px;
                    .alertDate {
                      .centertitle {
                        display: inline-block;
                        height: 50%;
                        width: 100%;
                        text-align: center;
                        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                        font-size: 14px;
                        padding-top: 1%;
                        color: #323232;
                      }
                      .centertitle.title {
                        padding-left: 20%;
                        box-sizing: border-box;
                        padding-top: 2%;
                      }
                    }
                    .shiyinglv {
                      width: 20%;
                      height: 100%;
                      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                      font-size: 14px;
                      color: #323232;
                      float: left;
                      text-align: right;
                      box-sizing: border-box;
                      display: inline-block;
                      .shiyinglv-item {
                        width: 100%;
                        height: 50%;
                        display: block;
                        padding-top: 5%;
                        box-sizing: border-box;
                      }
                      .dosc {
                        display: block;
                        height: 50%;
                        font-size: 10px;
                      }
                    }
                  }
                }
                .sameC {
                  .sameC-title-box {
                    padding: 0 5px;
                    width: 100%;
                    box-sizing: border-box;
                    height: 12%;
                  }
                  .scrollerBoxH {
                  }
                }
              }
            }
            .ratio-info {
              background-color: white;
              .alertComInfo {
                padding: 0 5px;
                .gsName {
                }
                .gsName.title {
                  padding: 3% 0 !important;
                }
                .centerInfo {
                  display: inline-block;
                  .centerInfo-item {
                    font-size: 10px;
                    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                    color: #323232;
                    display: inline-block;
                    width: 33%;
                    height: 100%;
                    float: left;
                    text-align: right;
                    .spanLine1 {
                    }
                    .spanLine1.fcolor1 {
                      color: #323232;
                    }
                    .spanLine1.fcolor4 {
                      color: #fb4319;
                    }
                    .spanLine2 {
                    }
                    .spanLine2.fcolor1 {
                      color: #323232;
                    }
                    .spanLine2.fcolor4 {
                      color: #fb4319;
                    }
                  }
                }
                .comShiyinglv {
                  text-align: right;
                  width: 20%;
                  height: 100%;
                  font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                  font-size: 14px;
                  color: #323232;
                  float: left;
                  .fcolor1 {
                    color: #323232;
                  }
                  span {
                    width: 100%;
                    height: 100%;
                    display: inline-block;
                    padding-top: 24%;
                    box-sizing: border-box;
                  }
                }
              }
            }
          }
        }
        .infoClose {
          width: 100%;
          height: 9%;
          position: relative;
          .closeButton {
            width: 39px;
            height: 39px; /*34px*/
            border-radius: 50%;
            text-align: center;
            background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close2.png");
            background-size: cover;
            position: absolute;
            left: 0;
            right: 0;
            margin: 0 auto;
            bottom: 0;
          }
        }
      }

    }
  }
  #afficheList .infinite-loading {
    text-align: center;
    height: 45px;
    line-height: 45px;
  }
  #afficheList {
    .law-show {
      box-sizing: border-box;
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background-color: rgba(0, 0, 0, 0.75);
      z-index: 3200;
    }
    .law-show-sh {
      height: 32.5px;
      width: 100px;
      background-color: rgba(0, 0, 0, 0.01);
      color: #ffb148;
      border-radius: 2px;
      font-size: 15px;
      position: absolute;
      bottom: 17%;
      left: 50%;
      z-index: 2000;
      margin-left: -50px;
      text-align: center;
      line-height: 32.5px;
      border: 1.5px dashed #ffb148;
    }
    .GuidePage-aff {
      width: 182px;
      position: absolute;
      right: 24%;
      top: 60px;
    }
    .GuidePage-aff2 {
      width: 190px;
      position: absolute;
      right: 1px;
      top: 45px;
      z-index: 2000;
    }
  }
</style>

<style scoped lang="scss">
  .updateStyle {
    position: absolute;
    bottom: 7.5px;
    left: 0;
  }
  #xianjia {
    margin-bottom: 11%;
    margin-top: -7%;
  }
  //
  #afficheList {
    width: 100%;
    height: 100%;
    padding-bottom: 51px;
    box-sizing: border-box;
  }
  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .header img {
    position: absolute;
    top: 0;
    right: 12px;
    bottom: 0;
    margin: auto;
    width: 20px;
    height: 20px;
  }
  .content-Box-wrapper {
    height: auto;
    width: 100%;
    position: relative;
  }
  .content-Box {
    width: 100%;
    height: 78%;
    overflow: scroll;
    /*padding-bottom: 51px;*/
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  .showData {
    width: 100%;
    height: 82.5px; /*height:75px; 80px */
    padding: 12px;
    font-size: 0;
    box-sizing: border-box;
    display: inline-block;
  }
  .showMoreData {
    position: absolute;
    left: 5px;
    right: 0;
    bottom: 10px;
    margin: 0 auto;
    text-align: center;
    width: 100%;
    height: 15%;
    line-height: 90%;
  }
  .List1 {
    min-width: 90px;
    height: 100%;
    text-align: center;
    float: left;
    margin-top: 0px !important;
  }
  @media screen and (max-width: 360px) {
    .List1 {
      margin-top: 2.5px !important;
    }
  }
  .List1 span {
    font-family: PingFangSC-Semibold, sans-serif;
    font-size: 25px;
    color: #323232;
    display: block;
  }
  .List1 .List1line2 {
    /*display: flex;
    justify-content: space-between;
    margin-top: 5px;
    */
    display: inline-block;
    width: 100%; /*padding-top: 5px;box-sizing: border-box;*/
  }
  .List1line2 span:first-child {
    float: left;
  }
  .List1line2 span:last-child {
    float: right;
  }
  .List1 .List1line2 span {
    font-family: PingFangSC-Medium, sans-serif;
    font-size: 13px;
  }
  .List2, .List3 {
    /*margin-left: -10px;*/
    height: 100%; /*margin-top: -4px!important;*//*两行高度位置调整*/
    padding-left: 2%;
    box-sizing: border-box;
  }
  .List3 {
    padding-left: 3%;
    width: 26% !important;
  }
  .List2 {
    padding-left: 6%;
    box-sizing: border-box;
  }
  .List2 span, .List3 span {
    font-family: PingFangSC-Medium, sans-serif;
    font-size: 12px;
    color: #323232;
    /*margin-top: 5px;*/
  }
  .List2 .line:nth-child(1) span, .List3 .line:nth-child(1) span {
    margin: 0;
  }
  .List4 {
    margin-right: -30px;
    overflow: hidden;
    font-family: PingFangSC-Medium, sans-serif;
    font-size: 13px;
    color: #fff;
    float: right;
    margin-top: 0;
  }
  .fang {
    width: 56px;
    height: 46px; /*background: #ffb148;*/
    /*display: flex;
    flex-direction: column;
    align-items: center;*/
  }
  .List4 span {
    float: left;
    width: 100%;
    height: 50%;
    margin-top: 6px;
    text-align: center;
  }
  .List4 span:nth-child(2) {
    margin-top: -2px;
  }
  .san {
    width: 0;
    height: 0;
    border-left: 28px solid transparent;
    border-right: 28px solid transparent;
    border-top: 12.5px solid #fff;
  }
  .tabox {
    width: 100%;
    height: 30px;
    margin: 12px 0;
    padding: 0 12px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    justify-content: space-between;
  }
  .tabox div {
    width: 25%;
    height: 100%;
    text-align: center;
    line-height: 30px;
    background: #f0f1f5;
    font-size: 14px;
    color: #535353;
    font-family: PingFangSC-Medium, sans-serif;
  }
  .tabox .active {
    background: #e8e9ed;
    color: #f6900c;
  }
  .List1, .List2, .List3, .List4 {
    width: 25%;
    float: left;
    margin-top: -2px;
  }
  .List1 {
    width: 28%;
  }
  .showData .List4 {
    float: right;
  }
  .List2 .line, .List3 .line {
    width: 100%;
    height: 36%;
    display: inline-block;
  }
  .content-lists {
    width: 100%;
    height: auto;
    padding: 0 12px;
    box-sizing: border-box;
    /*position: relative;
    top:80px;*/
  }
  #afficheList .content-lists:active {
    background-color: #f0f1f5;
  }
  .lists-item {
    width: 100%;
    padding: 10px 0;
    box-sizing: border-box;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
    letter-spacing: 0.2px;
    /*display: flex;*/
    /*align-items: center;*/
    line-height: 19px;
    .releaseDate {
      margin-top: 5px;
      padding: 0;
      /*float: right;*/
      /*margin-right: 0.5px;*/
      /*display: inline-block;*/
      font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
      font-size: 12px;
      color: #aeaeae;
      .firstItem {
        background-color: #F1F0F5;
        border-radius:2px;
        padding: 0 3px;
        color: #8D8D8D;
      }
    }
  }
  .industry, .industryH {
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
    overflow: hidden;
    height: 135px;
  }
  .industry li, .industryH li {
    width: 100%;
    height: 45px;
    border-bottom: 0.5px solid #e3e3e3;
  }
  .sameC .industry li, .sameC .industryH li {
    padding: 0 !important;
  }
  .marketSort, .marketSortH {
    width: 100%;
    height: 85px;
    background: #fff;
    padding: 0 !important;
  }
  .marketSortH {
    padding: 20px 0 !important;
    display: flex;
    display: -webkit-flex;
    justify-content: center;
  }
  .shadowxx, .Huanshoulv {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -22;
    display: none;
  }
  .alertBox, .HuanshoulvB {
    width: 90%;
    max-height: 82%; /*455 --> 910 74*/
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
    z-index: -33;
    display: none;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
  }
  .HuanshoulvB {
    max-height: 75%;
  }
  .alertContent {
    width: 100%;
    height: 100%; /*405px*/
    background: #f0f1f5;
    overflow: hidden;
    border-radius: 2px;
    margin-bottom: 14px; /*14*/
  }
  .scrollerBox, .scrollerBoxH {
    overflow: scroll;
    height: 85%; /* 300px 268.5px  59% 280*/
    width: 100%;
    box-sizing: border-box; /*padding:0 10px;*/
    overflow-x: hidden;
    font-size: 0;
    -webkit-overflow-scrolling: touch;
  }
  .scrollerBoxH {
    height: 88%; /* 换手率弹窗242px */
    -webkit-overflow-scrolling: touch;
  }
  .closeBox, .closeHbox {
    width: 40px;
    height: 40px; /*34px*/
    border-radius: 50%;
    text-align: center;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close2.png");
    background-size: cover;
  }
  /* 偏离值关注公司证券简称一栏 */
  .thisCompany {
    width: 100%;
    height: 20%;
    margin-bottom: 7.5px;
  }
  .alertContentH .thisCompany {
    height: 24%;
    background-color: white;
  }
  /*偏离值弹出框 同行公司 样式*/
  .alertTitle, .alertComInfo {
    width: 100%;
    height: 50%;
    background: #fff;
    border-bottom: 0.5px solid #e3e3e3;
    display: flex;
    display: -webkit-flex;
    font-size: 0;
  }
  .alertComInfo {
    background: #fff;
    border-bottom: 0;
  }
  .centerInfo {
    display: inline-block;
  }
  .alertTitle .gpName, .alertComInfo .gsName {
    width: 20%;
    height: 100%;
    box-sizing: border-box;
    text-align: left;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #323232;
    float: left;
    padding: 4% 0;
  }
  .gsName {
    overflow: hidden;
  }
  .alertContentH .alertComInfo .gsName {
    padding-top: 5%;
  }
  .alertTitle .alertDate, .alertComInfo .centerInfo {
    width: 65%;
    height: 100%;
    float: left;
    margin-left: -2%;
    margin-right: 1%;
    font-size: 0;
  }
  .plCenterInfo {
    padding-top: 4.5%;
    box-sizing: border-box;
  }
  .plCenterInfotitle {
    padding: 3% 0;
    box-sizing: border-box;
  }
  .centertitle {
    display: inline-block;
    height: 50%;
    width: 100%;
    text-align: center;
    font-family: "PingFangSC-Regular, sans-serif", Microsoft Yahei, Helvetica;
    font-size: 14px;
    padding-top: 1%;
    color: #323232;
  }
  .centertitle span, .centerInfo span {
    font-size: 10px;
    font-family: "PingFangSC-Regular, sans-serif", Microsoft Yahei, Helvetica;
    display: inline-block;
    width: 33%;
    height: 100%;
    float: left;
    text-align: right;
  }
  .centerInfo span {
    font-size: 14px;
  }
  .alertTitle .shiyinglv {
    width: 20%;
    height: 100%;
    /*line-height: 47px;*/
    text-align: center;
    font-family: "PingFangSC-Regular, sans-serif", Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #323232;
    float: left;
  }
  .industry, .industryH {
    padding: 0px 5px;
    font-size: 0;
    box-sizing: border-box;
  }
  .alertComInfo > .dacomSYL {
    text-align: right;
    padding-right: 5px;
    box-sizing: border-box;
  }
  .aCinfo, .marketData, .industry li, .industryH li { /*所有横排显示公司信息样式*/
    width: 100%;
    height: 45px;
    padding: 0 10px;
    box-sizing: border-box;
    /*display: inline-block;
    justify-content: space-between;
    align-items: center;*/
    background: #fff;
    font-family: "PingFangSC-Regular, sans-serif", Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #323232;
  }
  .titlecomShiyinglv {
    padding: 3% 0;
  }
  .industryH {
    height: 74%; /*165px*/
  }
  .marketData {
    padding: 0;
  }
  .aCtitle span, .aCinfo span, .marketData span {
    width: 20%;
    display: inline-block;
    text-align: right;
  }
  .aCtitle span:first-child, .aCtitle span:last-child, .aCinfo span:first-child, .aCinfo span:last-child, .marketData span:first-child, .marketData span:last-child {
    width: 20%;
    text-align: center;
  }
  /*.aCtitle span:last-child,*/
  .aCinfo span:last-child, .marketData span:last-child {
    text-align: right;
    width: 20%
  }
  .gongsi {
    /*display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;*/
  }
  .gongsi p {
    margin: 0;
    padding: 0;
    height: 50%;
    display: flex;
    display: -webkit-flex;
    align-items: center;
  }
  /*.gongsi p:last-child{
      text-align: center;
  }*/
  .sameC, .marketSort, .sameC .marketSortH { /*同行信息*/
    width: 100%;
    height: auto; /*padding:0 10px;*/
    box-sizing: border-box;
    background: white;
    font-size: 0;
  }
  .sameC {
    height: 80%; /* 偏离值同行信息内容框高度 */
  }
  .alertContentH .sameC {
    height: 75%; /* 换手率同行信息内容框高度 */
  }
  /* 偏离值 同行信息标题 栏 */
  .plSameTitle {
    padding: 0 5px;
    width: 100%;
    box-sizing: border-box;
    height: 12.5%;
  }
  .sameCtitle, .seeMore, .marketTitle {
    width: 100%;
    height: 40px;
    border-bottom: 0.5px solid #e3e3e3;
    box-sizing: border-box;
    font-family: "PingFangSC-Regular, sans-serif", Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #323232;
  }
  /*偏离值同行业标题*/
  .sameCtitle, .marketTitle {
    width: 100%;
    height: 100%;
    /*display: -webkit-box;*/
    display: -moz-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  /* 市场主板大盘样式 */
  .marketSort {
    height: 30%;
  }
  .marketTitle {
    width: 100%;
    height: 49%; /*40px*/
    /*text-align: center;
    line-height: 40px;*/
    font-family: "PingFangSC-Regular, sans-serif", Microsoft Yahei, Helvetica;
    font-size: 14px;
    padding: 0 5px;
    box-sizing: border-box;
    color: #323232;
    border: 0;
  }
  .industry {
    height: 45%;
  }
  .industry li { /*偏离值同行列表高度*/
    height: 33%;
    font-size: 0;
  }
  .industryH li {
    height: 25%;
    font-size: 0; /*换手率同行列表高度*/
  }
  .seeMoreH {
    width: 100%;
    height: 40px;
    border-bottom: 0.5px solid #e3e3e3;
    font-family: "PingFangSC-Regular, sans-serif", Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #323232;
    text-align: center;
    line-height: 40px;
  }
  .seeMore, .seeMoreH {
    border: 0;
    color: #ffb148;
  }
  .seeMore, .seeMoreH {
    /*display: -webkit-box;
    display: -moz-box;*/
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 13%;
  }
  .updateTime {
    width: 100%;
    padding: 0 5px;
    box-sizing: border-box;
  }
  .alertContentH .updateTime {
    margin-bottom: 5px;
  }
  .updateTimediv {
    border-top: 0.5px solid #e3e3e3;
    width: 100%;
    font-size: 10px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #323232;
    line-height: 25px;
    text-align: right;
  }
  .alertContentH .updateTimediv {
    padding-top: 5px;
  }
  .searchs {
    width: 100%;
    height: 50px;
    background: #f0f1f5;
    padding: 7.5px 12px;
    box-sizing: border-box;
    display: flex;
    display: -webkit-flex;
    align-items: center;
    justify-content: space-between;
  }
  .seabox {
    width: 91%;
    height: 100%;
    border-radius: 2px;
    position: relative;
    background: #fff;
    display: flex; /*justify-content: space-between;*/
    display: -webkit-flex;
    align-items: center;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #858484;
    padding: 8px 5px;
    box-sizing: border-box;
  }
  .inputLine {
    width: 1px;
    height: 14px;
    background: #858484;
    margin: 0 12.5px 0 10px;
  }
  .icon {
    font-size: 25px;
    color: #8d8d8d;
    /*width: 23px;
    height: 23px;
    display: inline-block;
    background-image: url("/static/img/personal/search@3x.png");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;*/
  }
  /*偏离值获取失败*/
  #focus-warning, #focus-warningH, #focus-warningM {
    /*position: absolute;
    top: 0;
    left: 0;*/
    width: 100%;
    height: 80%;
    background-color: rgba(255, 255, 255, 1);
    z-index: 3000;
    overflow: hidden;
    text-align: center;
  }
  #focus-warning > .focus-waringImg, #focus-warningH > .focus-waringImg, #focus-warningM > .focus-waringImg {
    height: 110px;
    width: 118.25px;
    margin: 35% auto 0 auto;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/warning/warnin.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  #focus-warningH > .focus-waringImg, #focus-warningM > .focus-waringImg {
    margin: 29.2% auto 0 auto;
  }
  #focus-warning .focus-waringText, #focus-warningH .focus-waringText, #focus-warningM .focus-waringText {
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #ffb148;
    padding: 20px 0 0 0;
    text-align: center;
  }
  #focus-warning .focus-waringBtn, #focus-warningH .focus-waringBtn, #focus-warningM .focus-waringBtn {
    box-shadow: none;
    color: white;
    border: 0;
    width: 90px;
    margin-top: 20px;
    font-family: PingFangSC-Regular, sans-serif, "Microsoft Yahei", "Helvetica";
    height: 30px;
    background: #ffb148;
  }
  /*是否关注*/
  .focAdd {
  }
  .focAddImg {
  }
  .focAddText {
  }
  .centerInfo .spanLine1 {
    width: 100%;
    height: 50%;
    float: right;
    /*line-height: 200%;*/
    padding-top: 6%;
    padding-bottom: 5%;
    box-sizing: border-box;
  }
  .centerInfo .spanLine2 {
    width: 100%;
    height: 50%;
    float: right;
    padding-top: 3%;
    box-sizing: border-box;
    /*line-height: 20px;*/
  }
  #afficheList .dataBox {
    width: 100%;
    height: 90px; /*height:82.5px; 87.5 */
    padding-bottom: 8px;
    box-sizing: border-box;
    background: #f0f1f5;
    position: relative;
    left: 0;
  }
  /*.linkErr{
      width: 100%;height:100%;background: #fff;position: absolute;left:0;top:0;z-index: 1000;
  }*/
  /*warning页面*/
  #warning {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    z-index: 984;
    overflow: hidden;
    text-align: center;
    /*display: none;*/
    /* display: block;*/
  }
  #warning > .waringImg {
    height: 110px;
    width: 118.25px;
    margin: 22.2% auto 0 auto;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/warning/warnin.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  /*#warning > .gonggaoWaringImg{
    background-image: url("/static/img/warning/warningCode.png");
  }*/
  #warning .waringText {
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #ffb148;
    padding: 20px 0 0 0;
    text-align: center;
  }
  #warning .waringBtn {
    box-shadow: none;
    color: white;
    border: 0;
    width: 90px;
    margin-top: 20px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    height: 30px;
    background: #ffb148;
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
  /*更多行情数据页面*/

  .infoShadow {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -22;
    display: none;
  }
  .selectItem {
  }
  .itemName {
  }
  .itemNameSplitLine {
    width: 1px;
    height: 35%;
    background: #cbc2b6;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto 0;
    display: none;
  }
  /*行情数据内容框*/
  .itemInfoOne {
    width: 100%;
    height: 100%;
  }
  .infoLists {
    width: 100%;
    height: 90%;
    padding: 0 5%;
    box-sizing: border-box;
  }
  .infoListOne, .infoListTwo, .infoListThree {
    width: 100%;
    height: 33.33%;
    border-bottom: 0.5px solid #e3e3e3;
    box-sizing: border-box;
    padding: 5% 0;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 14px;
    color: #323232;
  }
  .infoItem {
    width: 50%;
    height: 25%;
    display: inline-block;
  }
  .infoItem:nth-child(2n) {
    padding-left: 6%;
    box-sizing: border-box;
  }
  .infoItem:nth-child(2n-1) {
    padding-right: 6%;
    box-sizing: border-box;
  }
  .infoItemName, .infoItemValue {
    width: auto;
    height: 100%;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  .infoItemName {
    float: left;
  }
  .infoItemValue {
    float: right;
    max-width: 60%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .itemInfoOne .updateTime {
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 5px 5px;
  }
  .itemInfoOne .updateTimediv {
    border: 0;
  }

</style>
