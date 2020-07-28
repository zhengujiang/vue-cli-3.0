<template>
  <el-collapse-transition>
    <div class="advertisement" v-if="advert.length>0">
      <div class="advImg" v-for="(item,index) in advert" :key="index">
        <a :href="item.advertUrl" target="_blank">
          <img :src="item.advertPic"/>
        </a>
      </div>
    </div>
  </el-collapse-transition>
</template>

<script>
  export default {
    name: 'adv',
    data() {
      return {
        advert: []
      }
    },
    props: {
      pageName: String
    },
    watch: {},
    // 生命周期函数
    created() {
      this.getAdvertTypeList()
    },
    mounted() {
    },
    // 方法
    methods: {
      getAdvertTypeList() {
        this.$http({
          method: "GET",
          url: this.$api.common.getAdvertTypeList,
          params: {},
          message: 'none'
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject
            data.forEach((item) => {
              if (item.type == this.pageName) {
                this.getAdvertByType(item.id)
              }
            })
          }
        })
      },
      getAdvertByType(typeId) {
        this.advert = []
        this.$http({
          method: "GET",
          url: this.$api.common.getAdvertByType,
          params: {
            typeId: typeId
          },
          message: 'none'
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.advert = res.data.returnObject
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .advertisement {
    width: 100%;
    .advImg {
      margin-bottom: 15px;
      font-size: 0;
      display: inherit;
      img {
        width: 100%;
        border: 1px solid #e3e3e3;
        border-radius: 3px;
      }
      /*&:last-child {*/
      /*margin-bottom: 0;*/
      /*}*/
    }
  }
</style>
