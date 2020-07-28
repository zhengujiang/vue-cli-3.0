<template>
  <div id="business-library">
    <business-header title="信公图书馆"></business-header>
    <div class="content">
      <business-section :title="section.section" v-for="(section,index) in book" :key="index" class="jump">
        <template slot="content">
          <el-row :gutter="20">
            <el-col :span="12" v-for="(item,index) in section.books" :key="index" style="margin-bottom: 20px">
              <business-card-item :item="item">
                <template slot="sub">
                  <!--<img style="width: 100px;position: absolute;right: 10px;top: 20px;" v-if="!item.link" src="/static/image/business/book/即将上线@3x.png">-->
                </template>
              </business-card-item>
            </el-col>
          </el-row>
        </template>
      </business-section>
    </div>
  </div>
</template>
<script>
import businessCardItem from './components/businessCardItem'
import businessHeader from './components/businessHeader'
import businessSection from './components/businessSection'
// import data from './components/book'

export default {

  name: 'business-library',
  components: {
    businessCardItem,
    businessHeader,
    businessSection
  },
  data() {
    return {
      // book: data
      book: []
    }
  },
  created() {
    this.getShowList()
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.$common.jump(this.$route.hash.split('#')[1])
    // })
  },
  methods: {
    getShowList () {
      this.$http({
        method: 'GET',
        url: this.$api.business.getShowList,
        params: {
          tabNo: 2
        }
      }).then((res) => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          let bookArray = res.data.returnObject;
          bookArray.forEach((item, index) => {
            let info = {'books': [], 'section':''};
            info.books = item.businessCollect.businessDetailList;
            info.section = item.businessCollect.section;
            this.book.push(info);
          });
          this.$nextTick(() => {
            this.$common.jump(this.$route.hash.split('#')[1])
          })
        }
      }).catch(() => {
      })
    }
  },
  watch: {
    $route(to, from) {
      console.log('to', to.name)
      if (to.name === "businessLibrary") {
    this.$common.jump(this.$route.hash.split("#")[1]);// 在此调用函数
      }
    }
  }
}
</script>
<style lang="scss">
#business-library {
  background-color: #f6f6f6;
  .icon{
      // border:1px solid #e3e3e3
  }
}
</style>
