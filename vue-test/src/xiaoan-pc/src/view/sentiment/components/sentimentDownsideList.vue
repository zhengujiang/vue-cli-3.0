<template>
  <div id="sentimentDownsideList">
    <div class="el-card company-card-nopadding">
      <div class="company-card-header">
        <div class="company-card-title">负面舆情</div>
        <!--<div class="company-card-link"><a>更多 <i class="el-icon-arrow-right"></i></a></div>-->
      </div>
      <div class="company-card-body">
        <div class="card-aside-ranking">
          <ul>
            <li v-for="(item,index) in sentimentDownside">
              <a :href="item.url">
                <span v-if="index + 1 == '1'" class="list-num list-num-first">{{index + 1}}</span>
                <span v-else-if="index + 1 == '2'" class="list-num list-num-second">{{index + 1}}</span>
                <span v-else-if="index + 1 == '3'" class="list-num list-num-third">{{index + 1}}</span>
                <span v-else="index + 1" class="list-num">{{index + 1}}</span>

                <span class="list-title">{{item.title}}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "sentimentDownsideList",
    components: {},
    data() {
      return {
        sentimentDownside: []
      }
    },
    created() {
      this.getListInfo()
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

  .company-card-nopadding {
    margin: 10px;
    padding: 10px 0 20px;
    border-radius: 8px;
    border: none;
    &:hover {
      -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
    }
    .company-card-header {
      border-bottom: 1px solid #E3E3E3;
      padding: 0 5px 10px;
      margin: 0 10px;
      overflow: hidden;
    }
    .company-card-body {
      overflow: hidden;
      padding-top: 0;
    }
  }
  .list-num {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 6px;
    border-radius: 50%;
    padding: 8px 7px;
  }
  .list-num-first {
    background-color: #FFB148;
    color: #fff;
  }
  .list-num-second {
    background-color: #9292A0;
    color: #fff;
  }
  .list-num-third {
    background-color: #E8A77C;
    color: #fff;
  }
  .list-title {
    margin-left: 5px;
    text-align: left;
  }
  .card-aside-ranking {
    height: 340px;
    li {
      padding: 0 15px;
      font-size: 12px;
      height: 34px;
      line-height: 34px;
      color: #323232;
      overflow: hidden;
      &:hover {
        background-color: #F8F8F8;
      }
    }
  }
  .company-card-body .card-aside-ranking li.active {
    background-color: #F8F8F8;
  }
</style>
