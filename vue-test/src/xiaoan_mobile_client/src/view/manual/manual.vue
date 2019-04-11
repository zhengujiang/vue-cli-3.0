<template>
  <transition name="bounce">
    <div class="xiaoan-box" id="manual">
      <group gutter="0" class="xiaoan-cell">
        <template v-for="(list,index) of boxData">
          <cell :class="list.show ?'vux-1px-b':''" :key="'list'+index" :title="list.name" is-link :border-intent="false"
                :arrow-direction="list.show ? 'up' : 'down'" @click.native="boxDataClick(index)">
            <template slot="title">
              {{list.name}}
              <img v-if="list.new" :src="list.badge" alt="">
            </template>
          </cell>
          <group :key="index" class="slide" :class="list.show ? 'animate' : '' " gutter="0">
            <cell v-for="(item,index) of list.data" :key="'item'+index" is-link
                  :title="item.name" @click.native="itemClick(list.data,index)">
            </cell>
          </group>
        </template>
      </group>
    </div>
  </transition>
</template>

<script>
  import {Cell, CellBox, Group} from 'vux'
  export default {
    name: "manual",
    components: {
      Cell, CellBox, Group
    },
    data() {
      return {
        boxData: [
          {
            name: '最新上线功能',
            show: false,
            new: true,
            badge: this.$image.footer.new,
            data: [
              {type: 'xh', name: '信乎', link: ''},
              {type: 'ipo', name: 'IPO', link: ''},
              {type: 'opinion', name: '舆情', link: ''},
            ]
          },
          {
            name: '信乎社区',
            show: false,
            new: false,
            badge: this.$image.footer.new,
            data: [
              {type: 'xh', name: '信乎', link: ''},
            ]
          },
          {
            name: '数据信息查询',
            show: false,
            new: false,
            badge: this.$image.footer.new,
            data: [
              {type: 'law', name: '法规', link: ''},
              {type: 'affiche', name: '公告', link: ''},
              {type: 'report', name: '研报', link: ''},
              {type: 'ipo', name: 'IPO', link: ''}
            ]
          },
          {
            name: '信披工具箱',
            show: false,
            new: false,
            badge: this.$image.footer.new,
            data: [
              {type: 'reference', name: '权限速查', link: ''},
              {type: 'opinion', name: '舆情', link: ''},
              {type: 'calendar', name: '日历', link: ''},
              {type: 'choice', name: '精选', link: ''}
            ]
          },
          {
            name: '信公商学院',
            show: false,
            new: false,
            badge: this.$image.footer.new,
            data: [
              {type: 'xiaoetong', name: '信公商学院', link: ''},
              {type: 'testing', name: '董秘测评', link: ''},
            ]
          },
        ]
      }
    },
    created() {
      document.title = '小安指南2.0'
    },
    mounted() {
      let adverttitle = "小安指南";
      let sharelink2 = decodeURI(window.location.href); // 分享链接
      let shareDesc = "信息披露、资本市场精选资讯，点击了解更多"; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      boxDataClick(index) {
        // console.log(this.boxData[index]);
        if (this.boxData[index].data == [] || this.boxData[index].data.length == 0) {
          this.$vux.toast.show({text: '暂无相关', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return false
        }
        if (this.boxData[index].show) {
          // true
          this.boxData[index].show = false;
        } else {
          // false
          this.boxData.forEach((item) => {
            item.show = false
          });
          this.boxData[index].show = true;
        }
      },
      itemClick(Data, index) {
        this.$router.push({path: '/manual/details', query: {type: Data[index].type}});
        // console.log(Data[index]);
      }
    }

  }
</script>

<style lang="scss">
  #manual {
    background-color: #fff;
    .slide {
      background-color: #f0f1f5;
      //background-color: #fff;
      overflow: hidden;
      max-height: 0;
      transition: max-height .4s cubic-bezier(0, 1, 0, 1) -.1s;
      padding-left: 2em;
      * {
        background-color: #f0f1f5;
        //background-color: #fff;
      }
      .vux-no-group-title {
        &:after {
          border: 0;
        }
      }
    }
    .xiaoan-cell {
      .vux-label {
        font-size: 15px;
        img {
          width: 22px;
          margin-left: 3px;
          position: absolute;
          top: 10px;
          left: 28%;
        }
      }
    }
    .animate {
      max-height: 9999px;
      transition-timing-function: cubic-bezier(0.5, 0, 1, 0);
      transition-delay: 0s;
    }
  }
</style>
