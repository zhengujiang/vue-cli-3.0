<template>
  <div id="busniess-training">
    <business-header title="培训信息"></business-header>
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="24" v-for="(item,index) in trainData" :key="index" style="margin-bottom: 20px">
          <business-card-item :item="item">
            <template slot="tag" v-if="!item.mask">
              <span class="tag">报名中</span>
            </template>
            <template slot="sub">
              <p class="sub-text">培训时间：{{item.businessTime}}</p>
              <p class="sub-text">培训地点：{{item.location}}</p>
            </template>
          </business-card-item>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import businessCardItem from "./components/businessCardItem";
import businessHeader from "./components/businessHeader";
// import trainData from "./components/train.json";
export default {
  name: "businessTraining",
  components: { businessCardItem, businessHeader },
  data() {
    return {
      // trainData: trainData
      trainData: []
    };
  },
  created () {
    this.getShowList();
  },
  mounted() {
    // this.trainData.forEach((item, index) => {
    //   let fileName = `精选${parseInt(Math.random() * 18 + 1)}.jpg`
    //   this.$set(this.trainData[index], 'imgUrl', `/static/image/business/training/${fileName}`)
    //   // this.trainData.imgUrl = `/static/image/business/training/${fileName}`
    // });
  },
  methods: {
    getShowList () {
      this.$http({
        method: 'GET',
        url: this.$api.business.getShowList,
        params: {
          tabNo: 3
        }
      }).then((res) => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.trainData = res.data.returnObject[0].businessCollect.businessDetailList;
          // this.trainData.forEach((item, index) => {
          //   let fileName = `精选${parseInt(Math.random() * 18 + 1)}.jpg`
          //   this.$set(this.trainData[index], 'imgUrl', `/static/image/business/training/${fileName}`)
          //   // this.trainData.imgUrl = `/static/image/business/training/${fileName}`
          // });
        }
      }).catch(() => {
      })
    }
  }
};
</script>
<style lang="scss">
#busniess-training {
  background-color: #f6f6f6;
  .content {
    .tag {
      display: inline-block;
      font-size: 10px;
      text-align: center;
      color: #f7f7f7;
      margin-right: 4px;
      padding: 0 2px;
      background-color: #ffb148;
    }
  }
}
.sub-text {
  font-size: 12px;
  color: #c0c4cc;
  padding-left: 15px;
}
</style>
