<template>
  <div class="business-card-item">
    <el-card class="business-card" shadow="hover" body-style="padding:15px">
      <a :href="item.link?item.link:'javascript:;'" target="_blank">
        <ul class="box">
          <li class="item icon">
            <img :class="{'training':item.businessItem == '培训信息'}" v-if="item.imgUrl" :src="item.imgUrl"
                 @error="handleImgSrcError(item)">
            <img v-else src="http://placehold.it/200x150">
            <div class="mask" v-if="item.mask"><p>{{item.mask}}</p></div>
          </li>
          <li class="item text">
            <p class="title" v-line-clamp:22="2">{{item.title}}
              <slot name="tag"></slot>
            </p>
            <slot name="sub"></slot>
            <p class="desc" v-line-clamp:22="4">{{item.desc}}</p>
            <el-button type="text" class="btn" v-if="item.link">{{btnText}}</el-button>
            <slot name="footer"></slot>
          </li>
        </ul>
      </a>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "business-card-item",
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      default: function() {
        return {
          title: "关于上市公司“三会一层”规范运作",
          desc:
            "本课程由日照港金牌董秘余慧芳老师主讲，课程根据上市公司章程指引、股票上市规则等有关规定，结合多年来日常工作实践以及有关案例，介绍了“三会一层”的规范运作要点、重点关注事项以及工作建议等。",
          imgUrl: "http://placehold.it/200x150",
          link: "www.baidu.com"
        };
      }
    },
    btnText: {
      type: String,
      default: "点击查看"
    }
  },
  methods: {
    handleImgSrcError(item) {
      this.item.imgUrl = "http://placehold.it/200x150";
    }
  }
};
</script>
<style scoped lang="scss">
.business-card-item {
  .business-card {
    height: 182px;
    .box {
      display: flex;
      align-items: left;
      .item {
        position: relative;
        flex: 1;
        .mask {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 150px;
          text-align: center;
          background-color: rgba(0, 0, 0, 0.7);
          color: #fff;
          display: flex;
          align-items: center;
          border-radius: 10px;
          p {
            width: 100%;
          }
        }
        &.icon {
          flex: inherit;
          img {
            height: 150px;
            display: inherit;
            border-radius: 10px;
          }
        }
        &.text {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: left;
          .title {
            padding-left: 15px;
            font-size: 17px;
            color: #323232;
            height: 50px;
            overflow: hidden;
          }
          .desc {
            line-height: 20px;
            padding-left: 15px;
            font-size: 12px;
            color: #8d8d8d;
            word-break: break-all;
            // display: -webkit-box;
            // -webkit-box-orient: vertical;
            // -webkit-line-clamp: 5;
            // overflow: hidden;
            flex: 1;
            max-height: 80px;
            // height: 65px;
          }
          .btn {
            padding-left: 15px;
            padding-top: 7px;
            height: 26px;
            text-align: left !important;
              text-decoration:underline !important;
            .el-button {
              text-align: left !important;
              span{
              }
            }
          }
        }
      }
    }
    .training {
      width: 225px;
      height: 150px;
    }
  }
}
</style>
