<template>
  <div id="business-swift">
    <business-header title="信公精选"></business-header>
    <section class="content">
      <business-section :title="section.advertType" v-for="(section,index) in advert" :key="index" class="jump">
        <template slot="pagination">
          <el-pagination class="pagination vxa-pagination-small"
                         :current-page.sync="section.pageNum"
                         @current-change="handleCurrenChange(index)"
                         :page-size="6"
                         :total="section.count"
                         layout="prev,next">
          </el-pagination>
        </template>
        <template slot="content">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(item,index) in section.lists" :key="index" style="margin-bottom: 20px">
              <business-card-item :item="item"></business-card-item>
            </el-col>
          </el-row>
        </template>
      </business-section>
    </section>
  </div>
</template>
<script>
  import businessCardItem from "./components/businessCardItem";
  import businessHeader from "./components/businessHeader";
  import businessSection from "./components/businessSection";
  // import newsletter from "./components/newsletter";

  export default {
    name: "businessSwift",

    components: {
      businessCardItem,
      businessHeader,
      businessSection
    },
    data() {
      return {
        advert: [
          {advertType: "信公干货", lists: [], count: 0, pageNum: 1},
          {advertType: "高能问答", lists: [], count: 0, pageNum: 1},
          {advertType: "行业研究", lists: [], count: 0, pageNum: 1},
          {advertType: "信公新知", lists: [], count: 0, pageNum: 1}
        ],
        xinzhiArr: [],
        firstUpdate: true
      };
    },
    created() {
      this.advert.forEach(item => {
        this.getAdvertList(1, item.advertType);
      });
      // newsletter.forEach((item, index) => {
      //   const title = item.title;
      //   item.imgUrl = `http://oss.in-hope.cn/newsLetter/${
      //     item.year
      //   }/${title}.png`;
      //   item.link = `http://oss.in-hope.cn/newsLetter/${item.year}/${title}.pdf`;
      //   item.title = title;
      //   this.xinzhiArr.push(item);
      //   if (index < 6) {
      //     this.advert[3].lists.push(item);
      //   }
      // });
      // this.advert[3].count = newsletter.length;
      // this.advert[3].lists.forEach((item) => {
      //   item.imgUrl = item.imgUrl.replace('//an-announcement.oss-cn-shanghai.aliyuncs.com', '//oss.in-hope.cn')
      // })
    },
    mounted() {
      // this.$common.jump(this.$route.hash.split('#')[1])
    },
    updated() {
      if (this.firstUpdate) {
        setTimeout(() => {
          this.$common.jump(this.$route.hash.split("#")[1]);
          this.firstUpdate = false;
        }, 500);
      }
    },
    methods: {
      getAdvertList(pageNum, type) {
        console.log(type, pageNum);
        // if (type == "信公新知") {
        //   this.advert[3].lists = [];
        //   this.xinzhiArr.forEach((item, index) => {
        //     if (index >= (pageNum - 1) * 6 && index < pageNum * 6) {
        //       this.advert[3].lists.push(item);
        //     }
        //   });
        // } else {
        this.$http({
          url: this.$api.advert.getAdvertList,
          method: "GET",
          params: {
            pageNum: pageNum,
            pageSize: "6",
            type: type
          }
        })
          .then(res => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              const data = res.data.returnObject;
              let index = this.advert.findIndex(e => e.advertType == type);
              this.advert[index].count = res.data.total;
              this.$set(this.advert[index], "lists", []);
              data.forEach(item => {
                this.advert[index].lists.push({
                  imgUrl: item.advertImgUrl.replace('//an-announcement.oss-cn-shanghai.aliyuncs.com', '//oss.in-hope.cn'),
                  advertType: item.advertType,
                  title: item.advertTitle,
                  desc: item.advertAbstract,
                  link: item.advertUrl
                });
              });
            }
          })
          .catch(err => {
            console.log(err);
          });
        // }
      },
      handleCurrenChange(index) {
        // console.log(index)
        this.getAdvertList(
          this.advert[index].pageNum,
          this.advert[index].advertType
        );
      }
      // getAdvertType() {
      //   this.$http({
      //     url: this.$api.advert.getAdvertType,
      //     method: "GET"
      //   })
      //     .then(res => {
      //       if (res.data.returnCode == 200 || res.data.returnCode == 1) {
      //         const data = res.data.returnObject;
      //         data.forEach(item => {
      //           item.pageNum = 1;
      //           this.advert.push(item);
      //           this.getAdvertList(1, item.advertType);
      //         });
      //       }
      //     })
      //     .catch(err => {
      //       console.log(err);
      //     });
      // }
    },
    watch: {
      $route(to, from) {
        console.log("to", to.name);
        if (to.name === "businessSwift") {
          this.$common.jump(this.$route.hash.split("#")[1]); // 在此调用函数
        }
      }
    }
  };
</script>
<style lang="scss">
  #business-swift {
    background: #f6f6f6;
    .content {
      .pagination.vxa-pagination-small {
      }
    }
  }
</style>
