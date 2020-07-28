<template>
  <div id="regulation-library">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card" shadow="never" body-style="padding:0px">
          <div class="item">
            <el-autocomplete
              class="searchbox"
              style="width:100%"
              size="small"
              suffix-icon="el-icon-search"
              :fetch-suggestions="querySearchAsync"
              @select="handleSearchSelect"
              v-model="something"
              :trigger-on-focus="false"
              placeholder="搜索制度分类名称">
              <template slot-scope="{ item }">
                <span v-html="keywordHighlight(item)"></span>
              </template>
            </el-autocomplete>
          </div>
          <el-menu class="menu" :default-active="activeIndex" @select="handleSelect" unique-opened>
            <el-submenu :index="index+1+''" v-for="(catalog, index) in catalogArr" :key="index"
                        v-if="catalog.children.length">
              <template slot="title">
                <span :title="catalog.label">{{wordClamp(catalog.label)}}<span class="num"> ({{catalog.count}}项)</span></span>
              </template>
              <el-menu-item v-for="(item, subIndex) in catalog.children" :index="`${index+1}_${subIndex+1}`"
                            :key="item.key">
                <span :title="item.label">{{wordClamp(item.label)}}<span class="num"> ({{item.count}}项)</span></span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item v-for="(catalog, index) in catalogArr" :key="index" v-if="!catalog.children.length"
                          :index="index+1+''" @select="handleSelect">
              <span :title="catalog.label">{{wordClamp(catalog.label)}}<span
                class="num"> ({{catalog.count}}项)</span></span>
            </el-menu-item>
          </el-menu>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="card-header">
            <h4 style="font-size:16px">{{rootLabel}}<span v-if="rootLabel!==''&&subLabel!==''">/</span>{{subLabel}}
              <span class="badge required"
                    v-if="subIndex && catalogArr[rootIndex-1] && catalogArr[rootIndex-1].children[subIndex-1].isRequired">必备</span><span
                v-else class="badge optional">可选</span></h4>
          </div>
          <ul class="regulation-list" v-if="governance.length>0">
            <li v-for="(item, index) in governance" :key="index" @click="openPdf(item.lawTitle,item.lawUrl)">
              <div class="text">
                <h4>{{item.lawTitle}}</h4>
                <p class="desc">{{item.lawSummary || '暂无摘要'}}</p>
                <p>{{item.lawReferenceNumber}}&nbsp;&nbsp;|&nbsp;&nbsp; {{$common.transTime(item.lawReleaseDate)[1]}}&nbsp;&nbsp;|&nbsp;&nbsp;
                  {{item.lawTimeliness}}&nbsp;&nbsp;|&nbsp;&nbsp; {{item.lawScope.split(',').join('／')}}</p>
              </div>
            </li>
          </ul>
          <div class="empty vxa-image-index-bg-empty" v-else></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import iframe from "../../components/iframe.vue";
export default {
  components: { "v-iframe": iframe },
  data() {
    return {
      userInfo: {},
      catalogArr: [],
      activeIndex: "1_1",
      rootIndex: "1",
      subIndex: "1",
      governance: [],
      pageNum: 1,
      pdfName: "",
      pdfUrl: "",
      queryArr: [],
      something: "",
      companyCode: ''
    };
  },
  created() {
    this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
    if (this.userInfo.superviseUser) {
      if (this.$route.query.companyCode) {
        this.companyCode = this.$route.query.companyCode.replace('SZ', '').replace('SH', '')
      }
    }
    this.activeIndex = this.$cookie.get("regulation_index") || "1_1";
    this.rootIndex = this.activeIndex.split("_")[0];
    this.subIndex = this.activeIndex.split("_")[1];
    this.selectAllByCatalogType();
  },
  methods: {
    wordClamp(text) {
      if (text.length > 12) {
        return text.substr(0, 12) + "...";
      } else {
        return text;
      }
    },
    selectAllByCatalogType() {
      this.$http({
        url: this.$api.institution.selectAllByCatalogType,
        method: "GET",
        params: {
          catalogType: "1",
          companyId: this.userInfo.companyId,
          stockCode: this.companyCode
        }
      }).then(res => {
        if (res.data.returnCode == 200 || res.data.returnCode == 1) {
          this.catalogArr = res.data.returnObject;
          const arr = [];
          this.catalogArr.forEach((catalog, index) => {
            if (catalog.children.length) {
              catalog.children.forEach((child, subIndex) => {
                let obj = {
                  label: child.label,
                  value: child.label,
                  id: child.id,
                  rootIndex: index,
                  subIndex: subIndex
                };
                arr.push(obj);
              });
            } else {
              let obj = {
                label: catalog.label,
                value: catalog.label,
                id: catalog.id,
                rootIndex: index,
                subIndex: ""
              };
              arr.push(obj);
            }
          });
          this.queryArr = arr;
          this.pdfName = "";
          this.listAllForGovernanceCataLog(
            this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1].id
          );
        }
      });
    },
    listAllForGovernanceCataLog(catalogId) {
      this.$http({
        url: this.$api.institution.listAllForGovernanceCataLog,
        method: "GET",
        params: {
          catalogId: catalogId,
          pageNum: this.pageNum,
          pageSize: "100"
        }
      })
        .then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.governance = res.data.returnObject;
          }
        })
        .catch(err => {});
    },
    handleSelect(e) {
      this.$cookie.set("regulation_index", e);
      this.activeIndex = e;
      this.rootIndex = e.split("_")[0];
      this.subIndex = e.split("_")[1] || "";
      this.pageNum = 1;
      this.listAllForGovernanceCataLog(this.catalogId);
    },
    openPdf(name, url) {
      this.pdfName = name;
      this.pdfUrl = url;
      this.$common.openWindow(url);
    },
    querySearchAsync(string, cb) {
      if (string) {
        var results = string
          ? this.queryArr.filter(this.createStateFilter(string))
          : this.queryArr;
        cb(results);
      } else {
        const result = [];
        cb(result);
      }
    },
    createStateFilter(string) {
      return state => {
        // console.log(state.label)
        return state.value.toLowerCase().indexOf(string.toLowerCase()) != -1;
      };
    },
    handleSearchSelect(e) {
      console.log("e:", e.rootIndex, e.subIndex);
      this.rootIndex = e.rootIndex + 1;
      if (e.subIndex === "") {
        this.subIndex = "";
      } else {
        this.subIndex = e.subIndex + 1;
      }
      this.activeIndex = this.rootIndex + "_" + this.subIndex;
      this.listAllForGovernanceCataLog(this.catalogId);
    },
    keywordHighlight(item) {
      let index = item.value
        .toLowerCase()
        .indexOf(this.something.toLowerCase());
      if (index < 0) {
        return item.value;
      } else {
        let html = `${item.value.substring(
          0,
          index
        )}<span style="color:#ffb148">${item.value.substr(
          index,
          this.something.length
        )}</span>${item.value.substr(index + this.something.length)}`;
        return html;
      }
    }
  },
  computed: {
    rootLabel() {
      if (!this.catalogArr[this.rootIndex - 1]) return "";
      return this.catalogArr[this.rootIndex - 1].label
        ? this.catalogArr[this.rootIndex - 1].label
        : "";
    },
    subLabel() {
      if (
        !this.catalogArr[this.rootIndex - 1] ||
        !this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1]
      ) {
        return "";
      }
      if (this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1]) {
        return this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1]
          .label
          ? this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1]
              .label
          : "";
      } else {
        return "";
      }
    },
    catalogId() {
      if (this.catalogArr.length <= 0) return "0";
      if (this.subIndex.length <= 0) {
        return this.catalogArr[this.rootIndex - 1].id;
      }
      return this.catalogArr[this.rootIndex - 1].children[this.subIndex - 1].id;
    }
  }
};
</script>
<style lang="scss">
#regulation-library {
  min-height: 600px;
  width: 100%;
  .box-card {
    min-height: 785px;
    margin-bottom: 20px;
    .item {
      padding: 15px 10px;
      border-bottom: 1px solid #f0f1f5;
      .searchbox {
        width: 100%;
        .el-input__inner {
        }
        .el-input-group__prepend {
          background: #fff;
          i {
            color: #ffb148;
          }
        }
      }
    }
    .empty {
      width: 100%;
      height: 500px;
    }
    .menu.el-menu {
      border: none;
    }
    .el-menu-item,
    .el-submenu__title {
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      .num {
        color: #aeaeae;
        font-size: 12px;
      }
    }
  }
  .el-menu {
    .el-submenu__title {
      background-color: #fff;
      z-index: 10;
    }
    .el-submenu {
      span {
        font-size: 16px;
      }
      &::after {
        content: "";
        display: block;
        width: 100%;
        height: 1px;
        background: #e3e3e3;
      }
      .el-menu-item {
        &.is-active {
          span {
            color: #ffb148;
          }
        }
        span {
          color: #8d8d8d;
          font-size: 14px;
          .num {
            font-size: 12px;
          }
        }
      }
    }
  }
  .regulation-list li {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    border: solid 1px #ebeef5;
    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: #f9f9f9;
      .btn-group {
        visibility: visible;
      }
    }
    .text {
      flex: 1;
      h4 {
        margin: 6px 0;
      }
      p {
        color: #aeaeae;
        font-size: 12px;
        font-weight: 400;
      }
      .desc {
        padding: 10px 0;
        border-top: solid 1px #e5e5e5;
        border-bottom: solid 1px #e5e5e5;
        margin-bottom: 10px;
      }
    }
    .btn-group {
      visibility: hidden;
      color: #aeaeae;
    }
    .el-button--text {
      color: #aeaeae;
      &:hover {
        color: #a1a1a1;
      }
    }
  }
  .el-card__header {
    margin: 0 15px;
    padding: 18px 0;
  }
  .card-header {
    display: flex;
    align-items: center;
  }
  .card-header h4 {
    flex: 1;
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    .badge {
      display: inline-block;
      padding: 2px 4px;
      font-size: 10px;
      font-weight: 400;
      border-radius: 4px;
      color: #fff;
      transform: scale(0.8);
      &.required {
        background-color: #ff7b35;
      }
      &.optional {
        background-color: #6ddc6e;
      }
    }
  }
  .keyword {
    color: #ffb148;
  }
}
</style>
