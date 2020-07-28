<template>
  <div class="kechuangban">
    <div class="banner">
      <el-carousel height="300px" :interval="4000">
        <el-carousel-item>
          <a href="https://mp.weixin.qq.com/s/EbemsdaMMcosdy6q7XcXMw" target="_blank"><span class="first-banner"></span></a>
        </el-carousel-item>
        <el-carousel-item>
          <a href="https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzY2MmUyMmFlYTllXzh0c0pPRWp2IiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0" target="_blank">
          <span class="second-banner"></span></a>
        </el-carousel-item>
        <!--<a :href="item.url" target="_blank">-->
          <!--<img :src="item.img" alt="">-->
        <!--</a>-->
      </el-carousel>
    </div>
    <div class="main">
      <el-row :gutter="15">
        <el-col :span="18" style="padding-right: 6px">
          <el-card class="expert" shadow="hover">
            <div class="title vux-1px-b" style="font-weight: 600">科创板专家权威解读</div>
            <el-card class="person" v-for="(item, index) in expertList" :key="index" :class="{'expert01': index === 0, 'expert02' : index === 1, 'expert03': index === 2}">
              <img @click="jump(item.id)" class="photo" :src="item.img" alt="">
              <div @click="jump(item.id)" class="info">
                <p><span class="name">{{item.title}}</span>&nbsp;&nbsp;<span>{{item.status}}</span></p>
                <p class="desc" :title="item.desc">{{split(item.describe)}}</p>
              </div>
            </el-card>
          </el-card>
          <el-card class="search" shadow="hover">
            <div class="tab">
              <span @click="changeTab(item)" class="tabTitle" :class="{'active': tabTitle.flag == item.id}" v-for="(item, index) in tabTitle.list" :key="index">{{item.name}}</span>
            </div>
            <div class="line"></div>
            <div>
              <el-popover v-if="tabTitle.flag == 1" ref="popoverauto" placement="bottom" width="880" trigger="focus" popper-class="ele-popover"
                          v-on:click="selectText">
                <ul class="popul">
                  <li v-for="(list,index) in prestrain" :key="index" @click="selectText(index)"
                      v-if="prestrain.length !== 0">
                    <span v-html="$common.highlight(inputText,list.title)"></span>
                  </li>
                </ul>

              <el-input slot="reference" @change="inputFocus" @input="inputFocus" @focus="inputFocus" @keyup.13.native="getMore" placeholder="搜索筛选条件" v-model="inputText" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getMore"></el-button>
              </el-input>
              </el-popover>
              <el-input v-if="tabTitle.flag == 2" slot="reference" @change="inputFocus" @input="inputFocus" @focus="inputFocus" @keyup.13.native="getMore" placeholder="搜索筛选条件" v-model="inputText" class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="getMore"></el-button>
              </el-input>
              <v-list v-if="tabTitle.flag == 1" :urlType="'rule'" :data="this.info"></v-list>
              <v-list v-if="tabTitle.flag == 2" :urlType="'kechuangban'" :data="this.info"></v-list>
              <el-table v-if="tabTitle.flag == 3" :data="stibData" stripe style="width: 100%">
                <el-table-column align="center" label="序号" width="50">
                  <template slot-scope="scope">
                    {{scope.$index + 1}}
                  </template>
                </el-table-column>
                <!-- encodeURIComponent -->
                <el-table-column prop="companyName" label="发行人全称" width="180">
                  <template slot-scope="scope">
                    <router-link class="vxa-a-hover underline" :to="`/kechuangban/info?name=${encodeURIComponent(scope.row.companyName)}`" target="_blank">
                      <div :title="scope.row.companyName">{{ scope.row.companyName}}</div>
                    </router-link>
                  </template>
                </el-table-column>
                <el-table-column prop="checkType" label="审核状态" width="80">
                  <template slot-scope="scope">
                    {{checkType[scope.row.checkType]}}
                  </template>
                </el-table-column>
                <el-table-column prop="industryLevelTwo" label="证监会行业" width="150"></el-table-column>
                <el-table-column prop="sponsorInstitutionName" label="保荐机构"></el-table-column>
                <el-table-column align="center" prop="turnoverDate" label="更新日期">
                  <template slot-scope="scope">
                    {{$common.transTime(scope.row.turnoverDate)[1]}}
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="acceptDate" label="受理日期">
                  <template slot-scope="scope">
                    {{$common.transTime(scope.row.acceptDate)[1]}}
                  </template>
                </el-table-column>
              </el-table>
              <!-- <el-pagination  v-if="tabTitle.flag == 2 || tabTitle.flag == 3" style="margin-top:16px;text-align:center" class="vxa-footer-page-pagination" @current-change="selectPage" 
                layout="prev, pager, next, jumper" :current-page="page.pageNo" :page-count="page.total">
              </el-pagination> -->
              <p v-if="tabTitle.flag !== 4" class="showMore"><span @click="getMore('more')">查看更多</span></p>
              <ul v-if="tabTitle.flag == 4" style="margin-bottom: -8px">
                <li @click="jumpFoodDetail(item.url)" class="foodList clearFix" v-for="(item, index) in foodList" :key="index">
                  <span class="foodTitle fl">{{item.title}}</span>
                  <span class="foodDate fr">{{item.date}}</span>
                </li>
              </ul>
            </div>
          </el-card>
          <el-card class="study" shadow="hover">
            <div class="title vux-1px-b">科创板学习课程</div>
            <el-card shadow="hover" class="study_tab" v-for="(item, index) in studyList" :key="index">
              <a  :href="item.url" target="_blank">
                <img :src="item.img" alt="">
                <p class="study_title">{{item.title}}</p>
                <p class="study_desc">{{item.desc}}</p>
              </a>
            </el-card>
          </el-card>
          <img class="contact" :src="bottomImg" alt="">
        </el-col>
        <el-col :span="6" style="padding-left: 10px">
          <el-card shadow="hover">
            <div class="vux-1px-b clearFix">
              <div class="title fl">监管动态</div>
              <div class="more fr">
                <!-- <router-link to="/ipo/will/overview" target="_blank">更多<i class="el-icon-arrow-right"></i>
                </router-link> -->
                <span @click="getActivities" style="cursor:pointer">更多<i class="el-icon-arrow-right"></i></span>
              </div>
            </div>
            <div class="activeList">
              <ul>
                <li v-for="(item, index) in superviseList" :key="index" :class="{'vux-1px-b': index != superviseList.length-1}">
                  <p><a :href="item.href" target="_blank">{{item.title}}</a></p>
                  <p class="time">{{$common.transTime(item.releaseDate)[1]}}</p>
                </li>
              </ul>
            </div>
          </el-card>
          <el-card class="news" shadow="hover">
            <div class="vux-1px-b clearFix">
              <div class="title fl">科创板新闻</div>
            </div>
            <div class="activeList">
              <ul>
                <li v-for="(item, index) in newList" :key="index" :class="{'vux-1px-b': index != newList.length-1}">
                  <p><a :href="item.href" target="_blank">{{item.title}}</a></p>
                  <p class="time">{{$common.transTime(item.releaseDate)[1]}}</p>
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import list from './components/list.vue'
  export default {
    name: "kechuangban",
    data() {
      return {
        tabTitle: {
          flag: 1,
          list: [
            {id: 1, name: '法规'},
            {id: 2, name: '科创板披露文件'},
            {id: 3, name: '科创板审核动态'},
            {id: 4, name: '科创板干货解读'}
          ]
        },
        newList: [],
        superviseList: [],
        expertList: [
          // {title: '王骥跃', id: '1', status: '资深保荐代表人', img: 'https://oss.in-hope.cn/xiaoan/web_static/wangtitle.png', describe: '任职于券商一线业务部门，保荐过多家A股上市公司，对中国资本市场有独到、深刻的理解。'},
          // {title: '黄智', id: '2', status: '信公咨询创始合伙人', img: 'https://oss.in-hope.cn/xiaoan/web_static/huangtitle.png', describe: '曾任职于上海证券交易所，参与过《企业会计准则》、《股票上市规则》及资本市场其他相关法规的论证、制定和修订。'},
          // {title: '吴非', id: '3', status: '信公咨询合伙人', img: 'https://oss.in-hope.cn/xiaoan/web_static/wutitle.png', describe: '曾任职于上海证券交易所，参与了股票发行注册制、战新板等重要规则制定和修改等工作。'}
        ],
        bannerImg: [
          // {img: 'https://oss.in-hope.cn/xiaoan/web_static/%E7%A7%91%E5%88%9B%E6%9D%BF%E9%A1%BE%E9%97%AEFA-1.jpg', url: 'https://mp.weixin.qq.com/s/EbemsdaMMcosdy6q7XcXMw'},
          // {img: 'https://oss.in-hope.cn/xiaoan/web_static/%E7%A7%91%E5%88%9B%E6%9D%BFbanner-2.jpg', url: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzY2MmUyMmFlYTllXzh0c0pPRWp2IiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'}
        ],
        info: [],
        stibData: [], // 审核动态列表
        studyList: [
          // {title: '《科创板股票交易特别规定》解读', img: 'https://oss.in-hope.cn/xiaoan/web_static/study2.jpg', desc: '带你走进《科创板股票交易特别规定》', url: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzY2MmU3ODNjYmU2X2JlNG8xd0ZsIiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'},
          // {title: '《科创板股票上市规则》独家解读', img: 'https://oss.in-hope.cn/xiaoan/web_static/study3.jpg', desc: '深入浅出解读科创板股票上市规则亮点', url: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzZiYzA5NzgxMWVmXzdpeWoxR0laIiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'},
          // {title: '四要点读懂科创板发行与承销', img: 'https://oss.in-hope.cn/xiaoan/web_static/study5.jpg', desc: '科创板发行与承销改革，你get了吗？', url: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzZiYmZkNTQ1NjhhXzgzd01FbkV3IiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'},
          // {title: '科创板发行制度创新深度解读', img: 'https://oss.in-hope.cn/xiaoan/web_static/study1.jpg', desc: '探索规则变化对资本市场参与者的影响', url: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzZhNjZlMjkxZmNhX2c4SlhuQnBMIiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'},
          // {title: '科创板股权激励重大变化解析', img: 'https://oss.in-hope.cn/xiaoan/web_static/study4.jpg', desc: '科创板中股权激励有哪些不同？', url: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzZiYzYwYTdhMjE2XzY0ek8zR2FrIiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'},
          // {title: '科创板企业社会责任趋势解读', img: 'https://oss.in-hope.cn/xiaoan/web_static/study6.jpg', desc: '你看这份社会责任报告它多有趣', url: 'https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/content_page/eyJ0eXBlIjozLCJyZXNvdXJjZV90eXBlIjoiIiwicmVzb3VyY2VfaWQiOiIiLCJwcm9kdWN0X2lkIjoicF81YzZiYzU3ODg3ZjlkX3pXVWZGdEJDIiwiYXBwX2lkIjoiYXBwZThPM3BsSU0yNjY1In0'}
        ],
        foodList: [
          // {title: '交易机制大变革，一文带你读懂《科创板股票交易特别规定》', date: '2019年2月11日', url: 'https://mp.weixin.qq.com/s/_auI4E_ZQnNZpVHwSJoX8w'},
          // {title: '科创板专题 | 打破定价机制，一文读懂科创板发行新规关键点', date: '2019年2月13日', url: 'https://mp.weixin.qq.com/s/n-_3hN2YqmCP6xPFkT9GWg'},
          // {title: '科创板IPO打新股稳赢？想说爱你不容易', date: '2019年2月14日', url: 'https://mp.weixin.qq.com/s/01tZlVQUySFv6oCqSunDeQ'},
          // {title: '一文GET科创板股权激励新玩法', date: '2019年2月15日', url: 'https://mp.weixin.qq.com/s/24y5gZCrWc2UjYTEw0_UEQ'},
          // {title: '科创板，你看这份社会责任报告它多有趣', date: '2019年2月18日', url: 'https://mp.weixin.qq.com/s/B-T_6vY3CVOZJnQUcXCJUQ'},
          // {title: '从《股票上市规则》看科创板的新变革', date: '2019年2月19日', url: 'https://mp.weixin.qq.com/s/zLra085hHHH2QwvAYMgyMA'},
          // {title: 'A股市场重磅利好，科创板配套细则火速出台', date: '2019年3月4日', url: 'https://mp.weixin.qq.com/s/JHrXNobYJh4F2GRvnELKwg'},
          // {title: '上交所科创板规则PPT（3月5日更新版）', date: '2019年3月5日', url: 'https://mp.weixin.qq.com/s/OJSBHJZP0yDIsWCOHn3GcQ'},
          // {title: '科创板配套规则：上市审核系统办理指南发布', date: '2019年3月18日', url: 'https://mp.weixin.qq.com/s/E6mA5-1ehS31OcMfn0RzbQ'}
        ],
        checkType: {
          '1': '已受理',
          '2': '已问询',
          '3': '通过',
          '4': '未通过',
          '5': '提交注册',
          '6': '注册生效',
          '7': '不予注册',
          '8': '已发行',
          '9': '中止',
          '10': '终止'
        }, // 科创板审核动态列表 状态枚举
        inputText: '',
        page: {
          pageNo: 1,
          total: 0
        },
        prestrain: [], // autoComplete的数据
        bottomImg: ''
      }
    },
    created() {
      this.getStibNews();
      this.getStibSupervise();
      this.lawSearch();
      this.getAdvertInfo();
    },
    components: {
      'v-list': list
    },
    methods: {
      getAdvertInfo() {
        this.$http({
          method: 'GET',
          url: this.$api.kechuangban.getAdvertInfo,
          params: {}
        }).then((res) => {
          if (res.data.returnCode == 200) {
            let data = res.data.returnObject;
            // this.bannerImg = data.BANNER;
            this.bottomImg = data.BOTTOM_POSTER[0].img;
            this.expertList = data.EXPERTS_READ;
            this.foodList = data.PRACTICAL_READ;
            this.studyList = data.LEARN_COURSE;
          }
        }).catch((err) => {

        })
      },
      selectText(i) {
        this.inputText = this.prestrain[i].title
        var tit = document.getElementsByClassName('ele-popover')[0]
        tit.style.display = 'none'
        this.getMore();
        // this.submitAll()
      },
      /* autoComplete */
      autoComplete(value) {
        this.inputText = this.inputText ? this.inputText : ''
        this.$http({
          method: 'GET',
          url: this.$api.rule.autoComplete,
          params: {
            title: this.inputText,
            type: 'kechuangban'
          }
        }).then((res) => {
          if (res.data.returnObject.length == 0) {
            this.prestrain = []
          } else {
            this.prestrain = res.data.returnObject
          }
        }).catch((err) => {

        })
      },
      inputFocus() {
        this.autoComplete()
      },
      changeTab(item) {
        this.tabTitle.flag = item.id;
        this.inputText = '';
        this.page.pageNo = 1;
        this.page.total = 0;
        switch (item.id) {
          case 1:
            this.lawSearch();
            break;
          case 2:
            this.listStibPublish();
            break;
          case 3: 
            this.getStibDataSource();
            break;
          case 4: 
            break;
        }
      },
      selectPage(num) {
        this.scrollToTop()
        this.page.pageNo = num;
        this.tabTitle.flag == 2 ? this.listStibPublish() : this.getStibDataSource();
      },
      scrollToTop() {
        // 使用document.documentElement.scrollTop或document.body.scrollTop从顶部获取距离。
        // 从顶部的距离的一小部分滚动。使用window.requestAnimationFrame()对滚动进行动画处理。
        const scrollToTop = () => {
          const c = document.documentElement.scrollTop || document.body.scrollTop;
          if (c > 400) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, c - c / 5);
          }
        };
        scrollToTop()
      },
      split(strs) {
        let word = '';
        strs.length > 45 ? word = strs.substring(0, 45) + '...' : word = strs
        return word
      },
      // 获取科创板新闻
      getStibNews() {
        let params = {
          pageNo: 1,
          pageSize: 10
        }
        this.$axios.kechuangban.getStibNews(params).then(res => {
          if (res.data.returnCode == '200') {
            this.newList = res.data.returnObject.newsList;
          }
        }).catch(err => {

        })
      },
      // 获取科创板监管动态
      getStibSupervise() {
        let params = {
          pageNo: 1,
          pageSize: 5
        }
        this.$axios.kechuangban.getStibSupervise(params).then(res => {
          if (res.data.returnCode == '200') {
            this.superviseList = res.data.returnObject.superviseList;
          }
        }).catch(err => {

        })
      },
      jump(index) {
        let url = window.location.href
        // this.$router.push({path: `/kechuangban/expertRead#jump${index}`});
        window.open(`${url}/expertRead?num=${index}`)
      },
      jumpFoodDetail(url) {
        window.open(url);
      },
      getActivities() {
        window.open(`${window.location.origin}/activities?index=4`)
      },
      // 搜索 查看更多
      getMore(type) {
        let params = '';
        if (this.tabTitle.flag == 1) {
          let query = {
            havenote: 0,
            keys: '',
            market: '1015',
            unitIds: '',
            cateIds: '',
            timelinessIds: '',
            titleIncludes: '', 
            titleExcludes: '',
            titleMaybeIncludes: '',
            contentIncludes: '', 
            contentExcludes: '',
            contentMaybeIncludes: '',
            // fullTextIncludes: encodeURIComponent(this.inputText),
            fullTextIncludes: type == 'more' ? '' : encodeURIComponent(this.inputText),
            flip: 1,
            sortType: '',
            releaseStart: '',
            releaseEnd: ''
          };
          for (let key in query) {
            params += `${key}=${query[key]}&`
          }
          params = params.substring(0, params.length - 1)
          window.open(`${window.location.origin}/rule?${params}`)
        } else if (this.tabTitle.flag == 2) {
          let query = {
            keyword: type == 'more' ? '' : encodeURIComponent(this.inputText)
          }
          for (let key in query) {
            params += `${key}=${query[key]}&`
          }
          params = params.substring(0, params.length - 1)
          window.open(`${window.location.origin}/kechuangban/kechuangbanIpo?${params}`)
        } else if (this.tabTitle.flag == 3) {
          window.open(`${window.location.origin}/kechuangban/kechuangbanTrend?${params}`)
        }
      },
      lawSearch() {        // 点击确定发送请求数据
        this.loading = true
        let userId = this.$cookie.get('userId')
        if (!userId) {
          userId = ''
        }
        let params = {
          pageNo: 1, // 页码
          pageSize: 10, // 每页行数
          unitIds: '', // 发文单位
          scopeId: '1015',
          timelinessIds: '', // 时效性
          cateIds: '', // 规则类别
          sortType: '发布日期', // 搜索排序，时间排序time
          releaseStart: '', // 发布日期（起）
          releaseEnd: '', // 发布日期（止）
          titleIncludes: '', // this.$common.transStr(this.inputText), // 标题包含
          titleExcludes: '', // 标题不包含
          titleMaybeIncludes: '', // 标题可能包含
          contentIncludes: '', // 正文包含
          contentExcludes: '', // 正文不包含
          contentMaybeIncludes: '', // 正文可能包含
          fullTextIncludes: '', // this.$common.transStr(this.fullTextIncludes) 全文包含
          fullTextExcludes: '', // 全文不包含
          fullTextMaybeIncludes: '', // 全文可能包含
          type: 'law', // 类型, law, case, qa, 默认是law
          key: '',
          userId: userId
        }
        this.$http({
          method: 'GET',
          url: this.$api.rule.lawSearch,
          params: params
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1) {
            let content = res.data.returnObject
            this.total = this.$common.totalPage(content.count, this.pageSize) // 获取总的页数
            this.totalNum = content.count;
            this.info = []
            if (content.list) {
              this.isInfo = false
              for (var i = 0; i < content.list.length; i++) {
                var plate = content.list[i].markets ? content.list[i].markets : []
                if (plate !== []) {
                  plate.sort((a, b) => {
                    return a.marketId > b.marketId
                  })
                }
                let isNew = false
                if (content.list[i].PublishDate) {
                  if (content.list[i].PublishDate <= new Date().getTime()) {
                    if (content.list[i].PublishDate >= Date.parse(new Date(this.$common.getBeforeDate(14)))) {
                      isNew = true
                    }
                  }
                }
                var obj = {}
                var highColorContent = this.contentIncludes + ' ' + this.contentMaybeIncludes + ' ' + this.inputText
                var highColorTitle = this.titleIncludes + ' ' + this.titleMaybeIncludes + ' ' + this.fullTextIncludes + ' ' + this.inputText + ' ' + this.fullTextMaybeIncludes

                // 发文号为空是，显示发文单位
                let issued = ''
                if (content.list[i].referenceNumber && content.list[i].referenceNumber !== '无') {
                  issued = content.list[i].referenceNumber
                } else {
                  let organizations = content.list[i].organizations
                  if (organizations) {
                    for (let k in organizations) {
                      if (k <= 2) {
                        issued += organizations[k].value + ','
                      }
                    }
                  }
                  issued = issued.substring(0, issued.length - 1)
                }

                if (this.$common.browserSort() == 'Chrome') {

                  obj = {
                    id: content.list[i].id,
                    title: this.$common.key(highColorTitle, content.list[i].title),
                    describe: this.isTitle ? content.list[i].content : this.$common.key(highColorContent, content.list[i].content), // this.inputText
                    listTitle: content.list[i].title,
                    issued: issued,
                    timeliness: content.list[i].timeliness,
                    date: this.$common.transTime(content.list[i].PublishDate)[0],
                    plate: plate,
                    isDescribe: false,
                    newLogo: isNew,
                    show: false
                  }
                } else {
                  var strs = this.isTitle ? content.list[i].content : this.$common.key(highColorContent, content.list[i].content) // this.inputText
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                  obj = {
                    id: content.list[i].id,
                    title: this.$common.key(highColorTitle, content.list[i].title),
                    describe: strs,
                    listTitle: content.list[i].title,
                    // issued: content.list[i].referenceNumber,
                    issued: issued,
                    timeliness: content.list[i].timeliness,
                    date: this.$common.transTime(content.list[i].PublishDate)[0],
                    plate: plate,
                    isDescribe: false,
                    newLogo: isNew,
                    show: false
                  }
                }
                this.info.push(obj);
              }
              this.info[0].isDescribe = true;
            } else {
              // 搜索内容为空
              this.isInfo = true
              this.info = []
            }
          }
        }).catch((err) => {
          this.loading = false
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      // 科创板披露文件 ipo检索
      listStibPublish() {
        this.loading = true
        let userId = this.$cookie.get('userId')
        if (!userId) {
          userId = ''
        }
        this.$http({
          method: 'GET',
          url: this.$api.kechuangban.listStibPublish,
          params: {
            pageNum: this.page.pageNo, // 页码
            pageSize: 10, // 每页行数
            industryCodeLevelOne: '', // 一级行业代码
            industryCodeLevelTwo: '', // 二级行业代码
            releaseStartTime: '', // 开始更新日期
            releaseEndTime: '', // 结束更新日期
            mustTitle: '', // 标题（必须包含）
            possibleTitle: '', // 标题（可能包含）
            exceptTitle: '', // 标题（必须不包含）
            mustContent: '', // 正文（必须包含）
            possibleContent: '', // 正文（可能包含）
            exceptContent: '', // 正文（必须不包含）
            keyword: '', // 搜索关键词 逗号隔开
            subTypeEnum: 'ZHAO_GU_SHUO_MING_SHU', // 文件类型
            userId: userId
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 200) {
            let content = res.data.returnObject
            this.page.total = Math.ceil(res.data.returnObject.count / 10);
            this.info = []
            if (content.list) {
              for (var i = 0; i < content.list.length; i++) {
                var plate = content.list[i].markets ? content.list[i].markets : []
                if (plate !== []) {
                  plate.sort((a, b) => {
                    return a.marketId > b.marketId
                  })
                }
                var obj = {}
                var highColorContent = this.contentIncludes + ' ' + this.contentMaybeIncludes + ' ' + this.inputText
                var highColorTitle = this.titleIncludes + ' ' + this.titleMaybeIncludes + ' ' + this.fullTextIncludes + ' ' + this.inputText + ' ' + this.fullTextMaybeIncludes

                // 发文号为空是，显示发文单位
                let issued = ''
                if (content.list[i].referenceNumber && content.list[i].referenceNumber !== '无') {
                  issued = content.list[i].referenceNumber
                } else {
                  let organizations = content.list[i].organizations
                  if (organizations) {
                    for (let k in organizations) {
                      if (k <= 2) {
                        issued += organizations[k].value + ','
                      }
                    }
                  }
                  issued = issued.substring(0, issued.length - 1)
                }
                if (this.$common.browserSort() == 'Chrome') {

                  obj = {
                    id: content.list[i].id,
                    title: this.$common.key(highColorTitle, content.list[i].title),
                    describe: content.list[i].content, // this.inputText
                    listTitle: content.list[i].title,
                    issued: issued,
                    timeliness: content.list[i].timeliness,
                    date: this.$common.transTime(content.list[i].releaseDate)[0],
                    plate: plate,
                    show: false,
                    disclosureTypeName: content.list[i].disclosureTypeName,
                    industryLevelTwo: content.list[i].industryLevelTwo,
                    url: content.list[i].fileUrl
                  }
                } else {
                  var strs = content.list[i].content // this.inputText
                  if (strs && strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                  obj = {
                    id: content.list[i].id,
                    title: this.$common.key(highColorTitle, content.list[i].title),
                    describe: strs,
                    listTitle: content.list[i].title,
                    // issued: content.list[i].referenceNumber,
                    issued: issued,
                    timeliness: content.list[i].timeliness,
                    date: this.$common.transTime(content.list[i].releaseDate)[0],
                    plate: plate,
                    show: false,
                    disclosureTypeName: content.list[i].disclosureTypeName,
                    industryLevelTwo: content.list[i].industryLevelTwo,
                    url: content.list[i].fileUrl
                  }
                }
                this.info.push(obj);
              }
              this.info[0].isDescribe = true;
            } else {
              // 搜索内容为空
              this.isInfo = true
              this.info = []
            }
            console.log(this.info);
          }
        }).catch((err) => {
          this.loading = false
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      },
      getStibDataSource() {
        this.loading = true
        let userId = this.$cookie.get('userId')
        if (!userId) {
          userId = ''
        }
        this.$http({
          method: 'POST',
          url: this.$api.kechuangban.getStibDataSource,
          params: {
            pageNo: this.page.pageNo, // 页码
            pageSize: 10 // 每页行数
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 200) {
            this.stibData = []
            let content = res.data.returnObject
            this.stibData = res.data.returnObject.auditList;
            this.page.total = Math.ceil(res.data.returnObject.total / 10);
          }
        }).catch((err) => {
          this.loading = false
          this.$message({showClose: true, type: 'error', duration: 3000, message: err.message})
        })
      }
    }
  }
</script>

<style lang="scss">
  .ele-popover {
    padding: 12px 0;
    .popul {
      max-height: 210px;
      padding: 0 0 !important;
      overflow-y: auto;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      li {
        padding: 10px 12px;
        box-sizing: border-box;
        border-radius: 0;
        // margin: 0 0 10px 0;
        // font-size: 20px;
      }
      li:hover {
        background: rgba(240, 241, 245, .6);
        /*span {*/
        /*color: white !important;*/
        /*}*/
      }
      li:last-child {
        margin: 0 0 0 0;
      }
    }
  }
  .kechuangban {
    .person {
      .el-card__body {
        padding: 13px 10px;
      }
    }
    .el-card__body {
      padding: 16px;
    }
    .study_tab {
      .el-card__body {
        padding: 0;
        padding-bottom: 10px;
      }
    }
    .el-table {
      th {
        background:#FAFAFA;
        padding: 8px 0;
        .cell {
          color: #8D8D8D;
          font-weight: 400;
        }
      }
    }
    .search {
      .input-with-select {
        height: 28px; 
        margin-bottom: 5px;
        input {
          height: 28px;
          line-height: 28px;
          border-color: #FFE0B6;
        }
        .el-input-group__append {
          border-color: #FFE0B6;
          background-color: #FFB148;
          .el-icon-search {
            color: #fff
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  .kechuangban {
    background-color: #f6f6f6;
    .banner {
      width: 100%;
      height: 100%;
      margin-top: -2px;
      .first-banner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(https://oss.in-hope.cn/xiaoan/web_static/%E7%A7%91%E5%88%9B%E6%9D%BF%E9%A1%BE%E9%97%AEFA-1-03.png);
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: cover;
      }
      .second-banner {
        display: inline-block;
        width: 100%;
        height: 100%;
        background-image: url(https://oss.in-hope.cn/xiaoan/web_static/%E7%A7%91%E5%88%9B%E6%9D%BFbanner-2.jpg);
        background-repeat: no-repeat;
        background-position: center bottom;
        background-size: cover;
      }
      img {
        width: 100%;
        height: 100%;
      }
    }
    .main {
      margin: 0 auto;
      width: 1230px;
      padding: 0 15px;
      margin-top: 16px;
      .news {
        margin-top: 16px;
        margin-bottom: 23px;
      }
      .left {
        width: 892px;
        // min-height: 100px;
        // background-color: yellow;
        display: inline-block;
        margin-right: 10px;
      }
      .right {
        width: 292px;
        min-height: 100px;
        background-color: blue;
        display: inline-block;
      }
      .search {
        margin-top: 16px;
      }
      .title {
        font-size: 14px;
        color: #323232;
        font-weight: 600;
      }
      .line {
        width: 100%;
        height: 1px;
        background:rgba(0,0,0,1);
        opacity: 0.08;
        margin-bottom: 12px;
      }
      .expert {
        .person {
          width: 276px;
          height: 126px;
          display: inline-block;
          margin-right: 16px;
          margin-top: 16px;
          cursor: pointer;
          &:last-child {
            margin-right: 0;
          }
          .photo {
            display: inline-block;
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin-top: 7px;
          }
          .info {
            display: inline-block;
            overflow: hidden;
            width: 155px;
            margin-left: 10px;
            // margin-top: 10px;
            vertical-align: top;
            p {
              font-size: 12px;
              color:rgba(255,255,255,0.8);
              font-weight: 200;
              font-family:PingFangSC-Regular;
              .name {
                font-size: 14px;
                color:rgba(255,255,255,1);
                font-weight: 600;
              }
            }
            .desc {
              height: 67px;
              margin-top: 8px;
              // display: -webkit-box;
              // -webkit-box-orient: vertical;
              // -webkit-line-clamp: 4;
              overflow: hidden;
              text-align: justify;
            }
          }
        }
        .expert01 {
          background: url('https://oss.in-hope.cn/xiaoan/web_static/huang.png') no-repeat;
        }
        .expert02 {
          background: url('https://oss.in-hope.cn/xiaoan/web_static/wu.png') no-repeat;
        }
        .expert03 {
          background: url('https://oss.in-hope.cn/xiaoan/web_static/wang.png') no-repeat;
        }
      }
      .fl {
        float: left;
      }
      .fr {
        float: right;
      }
      .vux-1px-b {
        padding-bottom: 8px;
      }
      .more {
        color: #AEAEAE;
        font-size: 12px;
      }
      .activeList {
        li {
          padding-top: 9px;
          p {
            color: #323232;
            font-size: 14px;
          }
          .time {
            color: #8D8D8D;
            font-size: 12px;
            margin-top: 2px;
          }
          &:hover {
            background-color: #f8f8f8;
          }
        }
        .vux-1px-b {
          padding-bottom: 9px;
        }
        a:hover {
          color: #FFB148;
        }
      }
      .search {
        .showMore {
          text-align: center;
          margin-top: 12px;
          span {
            color: #FFB148;
            font-size: 14px;
            cursor: pointer;
          }
        }
        .tab {
          .tabTitle {
            display: inline-block;
            height: 30px;
            font-size: 14px;
            color: #545454;
            cursor: pointer;
            margin-right: 20px;
          }
          .active {
            color: #323232;
            font-weight: 600;
            border-bottom: 2px solid #FFB148;
          }
        }
        .foodList {
          height: 46px;
          line-height: 46px;
          border-bottom: 1px solid #e3e3e3;
          /*&.hover {*/
            /*transition: all .3s;*/
            /*&:hover {*/
              /*transition: all .3s;*/
              /*background-color: #f8f8f8;*/
            /*}*/
          /*}*/
          &:hover {
            transition: .3s all;
            background-color: #f8f8f8;
          }
          &:last-child {
            border-bottom: none;
          }
          .foodTitle {
            color: #323232;
            &:hover {
              transition: .3s all;
              color: #FFB148;
            }
          }
          .foodDate {
            color: #AEAEAE;
            font-size: 12px;
          }
        }
      }
      .study {
        margin-top: 16px;
        img {
          width: 276px;
        }
        .study_tab {
          width: 276px;
          margin-right: 16px;
          display: inline-block;
          margin-top: 16px;
          border: none;
          cursor: pointer;
          &:nth-child(3n+1) {
            margin-right: 0
          }
          .study_title {
            font-size: 16px;
            color: #323232;
            margin-top: 10px;
            padding-left: 12px;
          }
          .study_desc {
            font-size: 14px;
            color: #8D8D8D;
            margin-top: 4px;
            padding-left: 12px;
          }
        }
      }
      .contact {
        width: 100%;
        height: 200px;
        margin: 16px 0 23px 0;
      }
    }
  }
</style>

