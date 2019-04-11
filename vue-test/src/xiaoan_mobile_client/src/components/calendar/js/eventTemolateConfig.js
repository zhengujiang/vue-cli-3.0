/**
 * @name eventTemplateConfig
 * @package 1
 * @type eventTemplateConfig
 * @T: 会议日期
 * @R: 股权登记日
 * @B: 定期报告：年度报告/一季报/半年报/三季报
 * @P: 披露日期 = 会议日期
 * @Y: 业绩报告：业绩预告/业绩快报
 * @C: 差异化分红送转：是/否
 * @SE: 日常事件开始时间，结束时间
 * **/
/*
* SH_SHARE_REPURCHASE_THROUGH_COMPETITIVE_BIDDING(20,"回购股份（集中竞价方式）"),
   SZ_SHARE_REPURCHASE_THROUGH_COMPETITIVE_BIDDING(21,"回购股份（集中竞价方式）"),
*
* */
const eventTemplateConfig = [
  // sh
  {
    id: 0, name: '召开临时股东大会', type: '', valueList: 'T,R', nameSample: 'XXXX年第一次临时股东大会',
    about: "",
    valueListMap: {
      "T": "会议日期",
      "R": "股权登记日",
    }
  },
  {
    id: 1, name: '召开年度股东大会', type: '', valueList: 'T,R', nameSample: 'XXXX年年度股东大会',
    about: "",
    valueListMap: {
      "T": "会议日期",
      "R": "股权登记日",
    },

  },
  {
    id: 2, name: '定期报告窗口期', type: '', valueList: 'B,P', nameSample: '年度报告/半年度报告/一季报/三季报窗口期',
    about: "",
    valueListMap: {
      "B": "定期报告",
      "P": "披露日期",
      "T": "披露日期"
    }
  },
  {
    id: 3, name: '业绩预告、业绩快报窗口期', type: '', valueList: 'Y,P', nameSample: '业绩预告/业绩快报窗口期',
    about: "",
    valueListMap: {
      "Y": "业绩报告",
      "P": "披露日期",
      "T": "披露日期"
    }
  },
  // {id: 4, name: '定期报告内幕信息知情人报备', valueList: 'T,R', nameSample: ''},
  {
    id: 5, name: '权益分派实施(无上市可转债或有上市可转债但尚未进入转股期)', type: '', valueList: 'P,R,C', nameSample: '实施利润分配方案',
    about: "",
    valueListMap: {
      "P": "披露日期",
      "R": "股权登记日",
      "C": "差异化分红",
      "T": "披露日期"
    }
  },
  {
    id: 6, name: '权益分派实施(有上市可转债且已进入转股期)', type: '', valueList: 'P,R,C', nameSample: '实施利润分配方案',
    about: "",
    valueListMap: {
      "P": "披露日期",
      "R": "股权登记日",
      "C": "差异化分红",
      "T": "披露日期"
    }
  },
  {
    id: 7, name: '召开年度董事会', type: '', valueList: 'T', nameSample: '第一届董事会第一次会议',
    about: "",
    valueListMap: {
      "T": "会议日期",
      "R": "股权登记日",
    }
  },
  {
    id: 8, name: '召开年度监事会', type: '', valueList: 'T', nameSample: '第一届监事会第一次会议',
    about: "",
    valueListMap: {
      "T": "会议日期"
    }
  },
  // sz
  {
    id: 10, name: '召开临时股东大会', type: '', valueList: 'T,R', nameSample: 'XXXX年第一次临时股东大会',
    about: "",
    valueListMap: {
      "T": "会议日期",
      "R": "股权登记日",
    }
  },
  {
    id: 11, name: '召开年度股东大会', type: '', valueList: 'T,R', nameSample: 'XXXX年年度股东大会',
    about: "",
    valueListMap: {
      "T": "会议日期",
      "R": "股权登记日",
    }
  },
  {
    id: 12, name: '定期报告窗口期', type: '', valueList: 'B,P', nameSample: '年度报告/半年度报告/一季报/三季报窗口期',
    about: "",
    valueListMap: {
      "T": "披露日期",
      "B": "定期报告",
      "P": "披露日期"
    }
  },
  {
    id: 13, name: '业绩预告、业绩快报窗口期', type: '', valueList: 'Y,P', nameSample: '业绩预告/业绩快报窗口期',
    about: "",
    valueListMap: {
      "T": "披露日期",
      "Y": "业绩报告",
      "P": "披露日期"
    }
  },
  {
    id: 15, name: '权益分派实施', type: '', valueList: 'P,R', nameSample: '实施利润分配方案',
    about: "",
    valueListMap: {
      "P": "披露日期",
      "T": "会议日期",
      "R": "股权登记日"
    }
  },
  // {id: 16, name: '权益分派实施(有上市可转债且已进入转股期)', valueList: 'T,R,C', nameSample: ''},
  {
    id: 17, name: '召开年度董事会', type: '', valueList: 'T', nameSample: '第一届董事会第一次会议',
    about: "",
    valueListMap: {
      "T": "会议日期"
    }
  },
  {
    id: 18, name: '召开年度监事会', type: '', valueList: 'T', nameSample: '第一届监事会第一次会议',
    about: "",
    valueListMap: {
      "T": "会议日期"
    }
  },
  {
    id: 19, name: '日常事件', type: '', valueList: 'SE', nameSample: '自动义事件',
    about: "",
    valueListMap: {
      "SE": "事件日期"
    }
  },
  //
  {
    id: 20, name: '回购股份', type: '回购股份', valueList: 'T,R,S', nameSample: '回购股份（集中竞价方式）',
    about: "按照竞价回购业务指引，在上海证券交易所上市公司，回顾股份的实施期限自股东大会审议通过回购股份方案原则上不超过六个月",
    valueListMap: {
      "T": "董事会召开日",
      "R": "回购股份届满日",
      "S": "股东大会召开日",
    },

  },
  {
    id: 21, name: '回购股份', type: '回购股份', valueList: 'T,R,S', nameSample: '回购股份（集中竞价方式）',
    about: "按照竞价回购业务指引，在深圳证券交易所上市公司，回顾股份的实施期限自股东大会审议通过回购股份方案原则上不超过十二个月",
    valueListMap: {
      "T": "董事会召开日",
      "R": "回购股份届满日",
      "S": "股东大会召开日"
    }
  }
]

export default eventTemplateConfig
