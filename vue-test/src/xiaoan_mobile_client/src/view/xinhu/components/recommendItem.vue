<template>
  <transition name="bounce">
    <div class="recommend-item-content">
      <div class="recommend-item-scroll">
        <div class="title">
          <span class="cell"><img :src="$image.userother.userOther" alt="">&ensp;大V推荐</span>
          <span class="cell xa-right" @click="getAttentionRandomV">换一批&ensp;<i
            class="icon iconfont icon-huanyipi2"></i></span>
        </div>
        <div class="recommend-item">
          <x-scroller lock-y :scrollbar-x=false ref="scrollerEvent">
            <div class="" :style="{width: allWidth+'px'}">
              <ul class="recommend-box">
                <li class="box-item" v-for="(list, index) of data" ref="itemDom" @click="link(index)">
                  <div class="box-item-cont" :style="{backgroundColor:list.bgColor}">
                    <div class="item-cont">
                      <img :src="list.weixinAvatar" alt="" :style="{boxShadow:list.boxShadow}">
                      <div class="name">{{list.userName}}</div>
                      <div class="border"><span :style="{backgroundColor:list.color}"></span></div>
                      <p v-if="list.synopsis">{{list.synopsis}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </x-scroller>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import {Scroller} from 'vux'
  export default {
    name: "recommend-item",
    data() {
      return {
        allWidth: 450,
        dataLen: 0,
        data: [],
        colorData: [
          {
            color: '#8d8d8d',
            bgColor: '#f0f1f5',
            boxShadow: '0px 0px 5px rgba(103,107,149,0.4)'
          },
          {
            color: '#8d8d8d',
            bgColor: '#f6eee1',
            boxShadow: '0px 0px 5px rgba(178,153,114,0.4)'
          },
        ],
      }
    },
    components: {
      XScroller: Scroller
    },
    created() {
      this.getAttentionRandomV();
    },
    mounted() {
    },
    methods: {
      link(index) {
        this.$router.push({path: '/userOther', query: {selectUserId: this.data[index].id}});
      },
      getAttentionRandomV() {
        /*this.$http({
          method: "GET",
          url: this.$api.xinhu.getAttentionRandomV,
          params: {
            vNumber: 5,
          }
        })*/
        let params = {
          vNumber: 5
        }
        this.$axios.xinhu.getAttentionRandomV(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject;
            data.forEach((key1, i1) => {
              if (key1.synopsis == null || key1.synopsis == '') {
                key1.synopsis = '乎主很神秘'
              }
              this.colorData.forEach((key2, i2) => {
                if (i1 == i2) {
                  key1 = Object.assign(key1, key2)
                }
                if (i1 > i2) {
                  let b = i1 % this.colorData.length;
                  key1 = Object.assign(key1, this.colorData[b]);
                }
              })
            });
            console.log('data', data);
            this.data = [];
            this.data = data;
            this.$nextTick(() => {
              this.dataLen = this.data.length;
              this.$nextTick(() => {
                if (this.$refs.itemDom) {
                  let width = this.$refs.itemDom[0].clientWidth;
                  this.allWidth = this.dataLen * width + 12;
                }
              })
            })
          } else if (res.data.returnCode == -1) {
            // this.customerData = [];
          }
        }).catch((err) => {

        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  .recommend-item-content {
    padding: 10px 0;
    background-color: #f0f1f5;
    .recommend-item-scroll {
      background-color: #fff;
      .title {
        background-color: #FFFFFF;
        font-size: 13px;
        color: #aeaeae;
        display: flex;
        align-items: center;
        .cell {
          padding: 10px 12px;
          flex: 1;
        }
        .cell.xa-right {
          flex: 0 0 24%;
          text-align: right;
          i {
            font-size: 14px;
            color: #aeaeae;
          }
          &:active {
            background-color: #f0f1f5;
          }
        }
        img {
          height: 15px;
          font-size: 0;
          vertical-align: middle;
        }
      }
      .recommend-item {
        height: auto;
        width: 100%;
        overflow-x: scroll;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        .recommend-box {
          white-space: nowrap;
          width: 100%;
          display: inline;
          &::-webkit-scrollbar {
            display: none;
            opacity: 0;
          }
          .box-item {
            width: 105px;
            height: 150px;
            display: inline-block;
            float: left;
            text-align: center;
            padding: 0 0 10px 10px;
            font-size: 15px;
            border: 0;
            .box-item-cont {
              background-color: #FFFFFF;
              height: 100%;
              width: 100%;
              position: relative;
              border-radius: 2px;
              .item-cont {
                img {
                  height: 55px;width: 55px;
                  margin-top: 10px;
                  border-radius: 50%;
                  border: 0;
                  -moz-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
                  -webkit-box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
                  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
                }
                p {
                  margin-top: 5px;
                  line-height: 1.1;
                  padding: 0 10px;
                  font-size: 11px;
                  color: #8d8d8d;
                  white-space: normal;
                }
                .name {
                  margin-top: 5px;
                  height: 21px;
                  color: #545454;
                  padding: 0 5px;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                .border {
                  height: 2px;
                  position: relative;
                  margin-top: 5px;
                  span {
                    display: inline-block;
                    width: 15px;
                    height: 1px;
                    position: absolute;
                    top: 0;
                    margin-left: -7.5px;
                    background-color: #e3e3e3;
                  }
                }
              }

              button.item-cont-foot {
                border: 0;
                border-top: 0.5px solid #e3e3e3;
                position: absolute;
                bottom: 0.5px;
                left: 0;
                width: 100%;
                height: 30px;
                text-align: center;
                font-size: 14px;
                color: #ffb148;
              }
            }
          }
          .box-wrap {
            height: 300px;
            overflow: hidden;
          }
        }

      }
    }
  }

</style>
