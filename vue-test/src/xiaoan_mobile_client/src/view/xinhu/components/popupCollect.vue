<template>
  <div id="popupCollect">
    <h3 class="popup-title fb">收藏</h3>
    <div class="collect_global">
      <div class="collect_shg">
        <div class="inputgle">
          <input v-model="inputVal" type='text' maxlength="40" :placeholder='placeholders' class="createVal"  @focus="editFocus($event)" @keyup.13="addFavourite()"/>
          <i class="icon iconfont icon-X closeInputVal" v-show="inputVal !=''" @click="closeVal()"></i>
        </div>
        <div class="inputbtn">
          <button class='createDom' @click="addFavourite()">创建</button>
        </div>
      </div>
      <div class="am-collect-sns am-collect-padding">
        <div class="collectMaxHeight">
          <ul class="default">
            <li class="collect-list" @click="addCollect('default')">
              <div class="collect-item">
                <span class="defaultText">默认收藏夹</span>
              </div>
            </li>
            <li class="collect-list create" v-for="(list,index) in collcell"
                @click="addCollect(index)">
              <div class="collect-item">
                <span class="defaultText">{{list.favouriteName}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'popupCollect',
    data() {
      return {
        inputVal: '',
        placeholders: '请输入新建收藏夹名称(最多40个字)',
        collcell: [],
        bottom: 15,
        pageTop: 1,
        user_id: ''
      }
    },
    props: {
      iType: {
        type: String,
        default: 'qa'
      },
      refId: String
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.user_id = this.$cookie.getCookie("userId")
      this.getFavourite()
      this.getDefault()
    },
    mounted() {
    },
    // 方法
    methods: {
      closeVal() {
        this.inputVal = ''
        document.querySelector('.createVal').focus()
      },
      editFocus(event) {
        let el = event.currentTarget;
        console.log(".offset().top", $(el).offset().top);
        this.$const.androidTop(el);
      },
      addFavourite() {
        $('.createVal').blur();
        if (this.inputVal.trim().length != 0) {
          let params = {
              favouriteName: this.inputVal,
              isDefault: 0
            }
          this.$axios.favourite.addFavourite(params).then(res => {
            if (res.data.returnCode == 1) {
              this.inputVal = '';
              document.querySelector('.closeInputVal').style.display = 'none';
              this.getFavourite();
              this.$toast({message: '创建收藏夹成功', position: 'middle', duration: 1000});
            } else if (res.data.returnCode == 3) {
              this.$toast({message: '收藏夹不能相同', position: 'middle', duration: 1000});
            } else if (res.data.returnCode == 2) {
              this.$toast({message: '最多只能创建十个收藏夹', position: 'middle', duration: 1000});
            }
          }).catch((err) => {
            console.log(err)
          });
        }
      },
      // 根据用户id获取收藏夹
      getFavourite() {
        let params = {
            userId: this.user_id,
            pageSize: this.bottom,
            pageIndex: this.pageTop
          }
        this.$axios.favourite.getFavourite(params).then(res => {
          console.log(res);
          console.log(res.data.returnObject);
          if (res.data.returnCode == 1) {
            this.collcell = res.data.returnObject.list;
            this.num = res.data.returnObject.list.length;
          }
        }).catch((err) => {
          // this.$toast({message: '网络请求异常', position: 'middle', duration: 1500});
        });
      },
      // 获取默认收藏夹
      getDefault() {
        let params = {}
        this.$axios.favourite.getDefault(params).then(res => {
          this.getDefS = res.data.returnObject;
          console.log(this.getDefS.id, this.getDefS);
        }).catch((err) => {
          console.log(err);
        })
      },
      // 根据收藏夹添加
      addCollect(index) {
        let addcollect = {};
        if (index === 'default') {
          addcollect = {
            refId: this.refId, // 文章id
            favourableId: this.getDefS.id, // 文件夹id
            title: this.titleName, // 标题名
            faWenZiHao: this.referenceNumber, // 发文字号
            publishTime: this.relDate, // 发布时间
            type: this.iType, // 类型
            timeLiness: this.inOperation
          }
        } else {
          addcollect = {
            refId: this.refId, // 文章id
            favourableId: this.collcell[index].id, // 文件夹id
            title: this.titleName, // 标题名
            faWenZiHao: this.referenceNumber, // 发文字号
            publishTime: this.relDate, // 发布时间
            type: this.iType, // 类型
            timeLiness: this.inOperation
          }
        }

        this.$axios.collect.addCollect(addcollect).then(res => {
          console.log(res);
          if (res.data.returnCode == 2) {
            this.$toast({message: '你已添加进此收藏夹', position: 'middle', duration: 1500});
          } else if (res.data.returnCode == 1) {
            this.$toast({message: '收藏成功', position: 'middle', duration: 1500});
            this.getDefault();
            this.getFavourite();
          } else {
            this.$toast({message: '收藏失败', position: 'middle', duration: 1500});
          }
        }).catch((err) => {
          console.error(err);
        })

      }
    }
  }
</script>

<style lang="scss">
  #popupCollect {
    .collect_global {
      .collect_shg {
        overflow: hidden;
        width: 100%;
        height: 50px;
        background-color: #f0f1f5;
        padding: 7.5px 12px;
        vertical-align: middle;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        .inputgle {
          height: 35px;
          width: 84%;
          background-color: #8d8d8d;
          border-radius: 2px;
          display: inline-block;
          float: left;
          border: 0;
          vertical-align: middle;
          position: relative;
          .createVal {
            border: 0;
            float: left;
            height: 35px;
            margin: 0;
            width: 100%;
            padding: 0 0 0 12px;
            border-radius: 2px;
            outline: none;
            box-sizing: border-box;
            font-size: 15px;
          }
          .closeInputVal {
            line-height: 1;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: 3%;
            height: 16px;
          }
        }
        .inputbtn {
          height: 35px;
          width: 13%;
          border-radius: 2px;
          display: inline-block;
          float: right;
          vertical-align: middle;
          .createDom {
            float: right;
            border: 0;
            background-color: white;
            height: 35px;
            border-radius: 2px;
            font-size: 15px;
            width: 100%;
            padding: 0;
            color: #ffb148;
          }
        }
      }
      .am-collect-sns {
        background-color: #fff;
        width: 100%;
        max-height: 300px;
        margin: 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        list-style: none;
        overflow-y: scroll;
        -webkit-overflow-scrolling: touch;
        font-size: 15px;
        color: #323232;
        .collectMaxHeight {
          width: 100%;
          max-height: 250px;
          box-sizing: border-box;
          .default {
            width: 100%;
            box-sizing: border-box;
            .collect-list {
              width: 100%;
              height: auto;
              box-sizing: border-box;
              padding: 0 12px;
              font-size: 15px;
              position: relative;
              overflow: hidden;
              text-align: left;
              .collect-item {
                padding: 10px 0;
                height: 100%;
                box-sizing: border-box;
                border-bottom: 0.5px solid #e3e3e3;
                .defaultText {
                  text-align: left;
                  color: #323232;
                }
              }

            }
            .collect-list:last-child {
              .collect-item {
                border-bottom: 0;
              }
            }
            .collect-list:active {
              background-color: #f0f1f5;
            }
          }
        }
      }
    }
  }
</style>
