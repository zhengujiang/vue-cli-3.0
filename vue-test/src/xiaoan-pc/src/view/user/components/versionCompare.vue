<template>
  <div class="versionCompare">
    <table class="purchase-table">
      <thead>
      <tr>
        <th class="group-cell" colspan="9">特权对比</th>
        <th class="center" v-for="item in tableData.packages">{{item}}</th>
      </tr>
      </thead>
      <tbody>
      <!-- <tr>
        <td colspan="9" class="center bg-light text-dark">价格</td>
        <td class="center colorful-cell" v-for="(item,index) in tableData.prices" :class="colStyle(index)">
          <div class="price">
            <template v-if="item.price =='免费'">
              <span style="line-height: 44px;">免费</span>
            </template>
            <template v-else>
              <span class="price-line">推广价：<span v-if="!isNaN(item.price)">¥</span><span class="num is-discount">{{item.promotionPrice}}</span>/年</span>
              <span class="price-line small">原价：<span v-if="!isNaN(item.price)">¥</span><span
                class="num">{{item.price}}</span>/年</span>
            </template>
          </div>
          <div class="purchase-btn click-btn" v-if="item.buttonTxt=='免费试用'" @click="gotoApply()">
            {{item.buttonTxt}}
          </div>
          <div class="purchase-btn" v-else>{{item.buttonTxt}}</div>
        </td>
      </tr>
      <tr>
        <td colspan="9" class="center bg-light text-dark">账号数</td>
        <td class="center colorful-cell" v-for="(item,index) in tableData.accounts" :class="colStyle(index)">
          <span class="num">{{item}}</span>
          <span>个账号</span><span v-if="item>1">共享</span>
        </td>
      </tr> -->
      <tr v-for="(privilege, index) in tableData.privileges">
        <td class="center bg-light text-dark" colspan="3"
            v-if="index===0 ||privilege.group!=tableData.privileges[index-1].group"
            :rowspan="calcRowSpan( tableData.privileges,privilege.group)" v-html="privilege.group">
        </td>
        <td colspan="6" class="bg-light">
          {{privilege.name}}
          <span v-if="privilege.isHot" class="hot"></span>
          <img v-if="privilege.isNew" class="newImg" :src="$image.header.new" alt=""/>
        </td>
        <td v-for="(item,index) in privilege.hasRight" class="center" :class="colStyle(index)">
          <span v-if="typeof item ==='boolean' && !item" class="vxa-image-user-bg-cross no-right"></span>
          <span v-if="typeof item ==='boolean' && item" class="has-right"></span>
          <span v-if="typeof item ==='string'">{{item}}</span>
        </td>
      </tr>
      </tbody>
    </table>
    <p class="tips">需要帮助请联系：021-20740322</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tableData: {
          // packages: ["个人版", "企业标准版", "企业升级版"],
          packages: ["个人免费版", "企业标准版"],
          prices: [
            {
              price: "免费",
              buttonTxt: "正在使用"
            },
            {
              price: 29999,
              promotionPrice: 9999,
              buttonTxt: "免费试用"
            },
            {
              price: 59999,
              promotionPrice: 29999,
              buttonTxt: "敬请期待"
            }
          ],
          accounts: [1, 5, 5],
          privileges: [
            {
              group: "数据",
              name: "法规、公告、案例、研报、监管动态查阅",
              hasRight: [true, true]
            },
            {
              group: "数据",
              name: "公司股价行情、偏离值异动提醒",
              hasRight: [true, true]
            },
            {
              group: "数据",
              name: "IPO",
              isNew: false,
              hasRight: [false, true]
            },
            {
              group: "信披工具箱",
              name: "权限速查表",
              hasRight: [false, true]
            },
            {
              group: "信披工具箱",
              name: "小安日历基础版",
              hasRight: [true, true]
            },
            {
              group: "信披工具箱",
              name: "小安日历及团队日历",
              hasRight: [false, true]
            },
            {
              group: "信披工具箱",
              name: "财务分析",
              hasRight: [false, true],
              isHot: false
            },
            {
              group: "信披工具箱",
              name: "信息披露清单",
              hasRight: [false, true],
              isHot: false
            },
            {
              group: "信披工具箱",
              name: "公司治理制度清单",
              hasRight: [false, true],
              isHot: false
            },
            {
              group: "投资者关系",
              name: "舆情监控",
              hasRight: [false, true],
              isNew: true
            },
            {
              group: "投资者关系",
              name: "互动易/e互动",
              hasRight: [true, true]
            },
            {
              group: "投资者关系",
              name: "股东行为分析",
              hasRight: [false, false],
              isNew: true
            },
            // {
            //   group: "投资者关系",
            //   name: "研报",
            //   hasRight: [true, true],
            //   isNew: false
            // },
            {
              group: "信公商学院",
              name: "在线课堂",
              hasRight: [false, false]
            },
            {
              group: "信公商学院",
              name: "信公精选",
              hasRight: [true, true]
            },
            {
              group: "信公商学院",
              name: "培训信息",
              hasRight: [true, true]
            },
            {
              group: "信公商学院",
              name: "董秘测试",
              hasRight: [false, true]
            },
            {
              group: "信乎社区",
              name: "",
              hasRight: [true, true]
            },
            // {
            //   group: "团队功能",
            //   name: "公司定制工作页面",
            //   hasRight: [false, true],
            //   isHot: true
            // },
            {
              group: "团队功能",
              name: "团队共享文件",
              hasRight: [false, true]
            },
            {
              group: "团队功能",
              name: "团队协作功能",
              hasRight: [false, true]
            },
            {
              group: "团队功能",
              name: "定制信息提醒",
              hasRight: [false, true]
            }
          ]
        }
      }
    },
    props: {
      version: {
        type: String,
        default: 'person'
      }
    },
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      if (this.version != 'person') {
        this.tableData.prices = [
          {
            price: "免费",
            buttonTxt: "免费使用"
          },
          {
            price: 29999,
            promotionPrice: 9999,
            buttonTxt: "正在使用"
          },
          {
            price: 59999,
            promotionPrice: 29999,
            buttonTxt: "敬请期待"
          }
        ]
      }
    },
    // 方法
    methods: {
      calcRowSpan(privileges, groupName) {
        return privileges.filter(e => e.group === groupName).length;
      },
      colStyle(index) {
        if (index == 0 || index == 2) {
          return {"bg-gray": true};
        } else {
          return {"bg-gold": true};
        }
      },
      gotoApply() {
        if (this.userInfo.applyEnterprise) {
          this.$message({
            type: "warning",
            message: "已申请，请等待审核"
          });
        } else {
          this.$router.push("/manage/purchaseApplication");
        }
      }
    }
  }
</script>

<style lang="scss">
  .versionCompare {
    .purchase-table {
      margin: 10px 0;
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
      th,
      td {
        padding: 10px 15px;
        border: solid 1px #e3e3e3;
      }
      td {
        color: #8d8d8d;
        font-size: 14px;
      }
      .group-cell {
        width: 368px;
      }
      .center {
        text-align: center;
      }
      .bg-light {
        background-color: #f8f8f8;
      }
      .bg-gray {
        background-color: #f2f2f2;
      }
      .bg-gold {
        background-color: #f7f3ed;
      }
      .text-dark {
        color: #545454;
      }
      .price {
        height: 44px;
        .price-line {
          line-height: 22px;
          display: block;
          &.small {
            font-size: 12px;
            color: #8d8d8d;
            .num {
              font-size: 14px;
              font-weight: 400;
            }
          }
        }
      }
      .has-right, .no-right {
        margin: 0 auto;
        display: block;
        width: 12px;
        height: 12px;
        background-size: cover;
      }
      .has-right {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAAMCAYAAAC5tzfZAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEJDOUI2QUM3NDYwMTFFOEJDQTE5RDI0Q0VEQUU2MzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEJDOUI2QUQ3NDYwMTFFOEJDQTE5RDI0Q0VEQUU2MzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QkM5QjZBQTc0NjAxMUU4QkNBMTlEMjRDRURBRTYzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QkM5QjZBQjc0NjAxMUU4QkNBMTlEMjRDRURBRTYzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Ph4NzogAAADdSURBVHjaYvj//z8DKTgqMtKBiYEEEB0VVQuk9jOCdBOhmBFI7QRiVyD2YiFCgxKQ2gPEikAcsHTZsu14bQJqUAFSV4GYDYjLgBq6QeKMQI9pAul5QHwPKBiNpEEHSJ0GYg4g3gGU84TJgQJCDIgtgDgKqPA4VAM7kDoP1fAGiL2RXQB2HlCRHJB9HYi5gPg+EDMDsRxUjRHQlvMYmqCm60JNZ0aSXwPUEIruV3g8ASUvAyk9IIaFzDcgTsYWQCiRC9R4DeQcKHcukP+JoCaoxgtAygCIu3BFBUCAAQB4Hmm2+AdiAgAAAABJRU5ErkJggg==);
      }
      .hot {
        display: inline-block;
        width: 12px;
        height: 14px;
        background-size: cover;
        margin-left: 4px;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAOCAYAAAAbvf3sAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEJDOUI2QjA3NDYwMTFFOEJDQTE5RDI0Q0VEQUU2MzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEJDOUI2QjE3NDYwMTFFOEJDQTE5RDI0Q0VEQUU2MzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QkM5QjZBRTc0NjAxMUU4QkNBMTlEMjRDRURBRTYzMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QkM5QjZBRjc0NjAxMUU4QkNBMTlEMjRDRURBRTYzMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PlvwtUkAAAEDSURBVHjaYvz//z8DCgjX5wWSFUDcz7Dy4hsGNMCIoQGiCST4AohVgJq+IksxYVGsA2VJAPEqwjaE6y8GkjFIIgZArATEl4G23WGCKlJEcn8MmqHJUD9tQ9gQrt8OZIPcqgXEkUD8F4iZMT3HYAXT8ADIkcdicjoQmyGJbWH8H6YHcsJiDLNWXmQEGiQAZL1HEv3MBHUCMgBprgUqZgVq+gBkr0WS42UBEvpIAj+AuBSo8CWS2FwgDoayv4NsuIskWYKmGASuIbE3gDQ0I7l7KpaQ+YTELmICKtoDZFRB40EfiwaYH52Aal8wQU0GxUM0ECuixTpI/hcQ2wPV7AcJAQQYAHXGUCmMqA7KAAAAAElFTkSuQmCC);
      }
      .newImg {
        display: inline-block;
        height: 14px;
        margin-left: 2px;
      }
      .colorful-cell {
        .num {
          font-size: 20px;
          font-weight: 600;
        }
        .purchase-btn {
          display: block;
          margin: 10px 20px 6px 20px;
          font-size: 12px;
          padding: 6px 20px;
          border-width: 0;
          border-radius: 4px;
        }
        &:nth-child(2) {
          color: #7d7d7d;
          .price .num {
            font-size: 14px;
          }
          .purchase-btn {
            color: #fff;
            background: #ababab;
            background: -moz-linear-gradient(122deg, #ababab 0%, #7d7c7c 100%);
            background: -webkit-linear-gradient(122deg, #ababab 0%, #7d7c7c 100%);
            background: linear-gradient(122deg, #ababab 0%, #7d7c7c 100%);
          }
        }
        &:nth-child(3) {
          color: #c89f57;
          .price .num {
            text-decoration: line-through;
            &.is-discount {
              text-decoration: none;
            }
          }
          .click-btn {
            cursor: pointer;
            &:hover {
              transform: scale(1.05);
            }
          }
          .purchase-btn {
            transition: all 0.3s;
            /* &:hover {
              transform: scale(1.05);
            } */
            color: #fff;
            background: #f0ca82;
            background: -moz-linear-gradient(122deg, #f0ca82 0%, #c89f58 100%);
            background: -webkit-linear-gradient(122deg, #f0ca82 0%, #c89f58 100%);
            background: linear-gradient(122deg, #f0ca82 0%, #c89f58 100%);
          }
        }
        &:nth-child(4) {
          color: #232323;
          .price .num {
            text-decoration: line-through;
            &.is-discount {
              text-decoration: none;
            }
          }
          .purchase-btn {
            color: #fff;
            background: #5a5959;
            background: -moz-linear-gradient(122deg, #5a5959 0%, #232323 100%);
            background: -webkit-linear-gradient(122deg, #5a5959 0%, #232323 100%);
            background: linear-gradient(122deg, #5a5959 0%, #232323 100%);
          }
        }
      }
      thead > tr > th {
        padding: 20px 0;
        &:first-child {
          background-color: #dfdfdf;
        }
        &:nth-child(2) {
          color: #fff;
          background: #ababab;
          background: -moz-linear-gradient(122deg, #ababab 0%, #7d7c7c 100%);
          background: -webkit-linear-gradient(122deg, #ababab 0%, #7d7c7c 100%);
          background: linear-gradient(122deg, #ababab 0%, #7d7c7c 100%);
        }
        &:nth-child(3) {
          color: #fff;
          background: #f0ca82;
          background: -moz-linear-gradient(122deg, #f0ca82 0%, #c89f58 100%);
          background: -webkit-linear-gradient(122deg, #f0ca82 0%, #c89f58 100%);
          background: linear-gradient(122deg, #f0ca82 0%, #c89f58 100%);
        }
        &:nth-child(4) {
          color: #fff;
          background: #5a5959;
          background: -moz-linear-gradient(122deg, #5a5959 0%, #232323 100%);
          background: -webkit-linear-gradient(122deg, #5a5959 0%, #232323 100%);
          background: linear-gradient(122deg, #5a5959 0%, #232323 100%);
        }
      }
    }
    .tips {
      color: #8d8d8d;
      font-size: 14px;
    }
  }
</style>
