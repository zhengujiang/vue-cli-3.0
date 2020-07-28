<template>
  <div id="activityAnswer" class="content">
    <el-row :gutter="20">
      <el-col :span="16">
        <problem v-if="endInfo == 1"></problem>
        <end v-if="endInfo == 2"></end>
      </el-col>
      <el-col :span="8">
        <integral v-if="endInfo == 1"></integral>
      </el-col>
    </el-row>  
    <el-row :gutter="20" style="margin-bottom: 40px">
      <el-col :span="16">
        <!-- <answerRules v-if="endInfo == 1"></answerRules> -->
        <!-- <end-info v-if="endInfo == 2"></end-info> -->
      </el-col>
      <el-col :span="8"></el-col>
    </el-row>  
    <advertisement></advertisement>
  </div>
</template>

<script>
  import integral from './components/integral.vue'
  import problem from './components/problem.vue'
  import answerRules from './components/answerRules.vue'
  import end from './components/end.vue'
  import endInfo from './components/endInfo.vue'
  import advertisement from './components/advertisement.vue'
  export default {
    name: "activityAnswer",
    data() {
      return {
        endInfo: 1
      }
    },
    created() {
      if (this.$route.query.endInfo) {
        this.endInfo = this.$route.query.endInfo;
        this.checkUserCaseUpload();
      }
    },
    components: {
      integral,
      problem,
      answerRules,
      end,
      endInfo,
      advertisement
    },
    methods: {
      // 是否已经报名
      checkUserApply () {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.checkUserApply(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              console.log("报名");
            } 
            // else {
            //   this.$router.push('/competition/join');
            // }
          }
        })
      },
      // 是否上传名片
      checkUserCaseUpload () {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.checkUserCaseUpload(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.checkUserApply();
            } 
            // else {
            //   this.$router.push('/competition/join');
            // }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #activityAnswer {
    min-height: 840px;
  }
</style>
