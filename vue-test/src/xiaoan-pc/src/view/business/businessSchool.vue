<template>
  <div id="business-school">
    <business-header title="在线课程"></business-header>
    <div class="content">
      <business-section :title="section.section" v-for="(section,index) in schoolData" :key="index" :class="`jump`">
        <template slot="content">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(item,index) in section.lessons" :key="index" style="margin-bottom: 20px">
              <business-card-item :item="item"></business-card-item>
            </el-col>
          </el-row>
        </template>
      </business-section>
    </div>
  </div>
</template>
<script>
  import businessCardItem from "./components/businessCardItem";
  import businessHeader from "./components/businessHeader";
  import businessSection from "./components/businessSection";
  // import data from "./components/school";

  export default {
    name: "business-school",
    components: {
      businessCardItem,
      businessHeader,
      businessSection
    },
    data() {
      return {
        // schoolData: data
        schoolData: []
      };
    },
    created() {
      this.getShowList()
    },
    mounted() {
      // console.log(this.$route.hash.split('#')[1])
      // this.$nextTick(() => {
      //   this.$common.jump(this.$route.hash.split('#')[1])
      // })

    },
    methods: {
      getShowList() {
        this.$http({
          method: 'GET',
          url: this.$api.business.getShowList,
          params: {
            tabNo: 1
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let schoolArray = res.data.returnObject;
            schoolArray.forEach((item, index) => {
              let info = {'lessons': [], 'section': ''};
              info.lessons = item.businessCollect.businessDetailList;
              info.section = item.businessCollect.section;
              this.schoolData.push(info);
            });
            this.$nextTick(() => {
              this.$common.jump(this.$route.hash.split('#')[1])
            })
          }
        }).catch(() => {
        })
      }
      // jump(index) {
      //   // 用 class="d_jump" 添加锚点
      //   let jump = document.querySelectorAll(".jump");
      //   let total = jump[index].offsetTop;
      //   let distance =
      //     document.documentElement.scrollTop || document.body.scrollTop;
      //   // 平滑滚动，时长500ms，每10ms一跳，共50跳
      //   let step = total / 50;
      //   if (total > distance) {
      //     smoothDown();
      //   } else {
      //     let newTotal = distance - total;
      //     step = newTotal / 50;
      //     smoothUp();
      //   }
      //   function smoothDown() {
      //     if (distance < total) {
      //       distance += step;
      //       document.body.scrollTop = distance;
      //       document.documentElement.scrollTop = distance;
      //       setTimeout(smoothDown, 5);
      //     } else {
      //       document.body.scrollTop = total;
      //       document.documentElement.scrollTop = total;
      //     }
      //   }
      //   function smoothUp() {
      //     if (distance > total) {
      //       distance -= step;
      //       document.body.scrollTop = distance;
      //       document.documentElement.scrollTop = distance;
      //       setTimeout(smoothUp, 5);
      //     } else {
      //       document.body.scrollTop = total;
      //       document.documentElement.scrollTop = total;
      //     }
      //   }
      // }
    },
    watch: {
      $route(to, from) {
        console.log('to', to.name)
        if (to.name === "businessSchool") {
          this.$common.jump(this.$route.hash.split("#")[1]);// 在此调用函数
          console.log(this.$route.hash.split("#")[1]);
          console.log(555);
        }
      }
    }
  };
</script>
<style lang="scss">
  #business-school {
    background-color: #f6f6f6;
  }
</style>
