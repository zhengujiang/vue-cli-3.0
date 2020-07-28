import cookie from '../service/cookie'
// import common from './common'

export default {
  printStyle: `<style>
                  body {background-color: #f6f6f6;max-width: 900px;height: auto;margin: 0 auto;margin-bottom: 20px;text-align: justify;word-spacing: 0;color: #323232;font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif !important;}
                  .details{ background-color: #fff; padding: 10px;border-radius: 10px}
                  * {font-size: 17px;font-weight: 300;line-height: 26px;font-family: Helvetica, Tahoma, Arial, "Hiragino Sans GB", "Microsoft YaHei", 微软雅黑, "Micro Hei", SimSun, 宋体, Heiti, 黑体, sans-serif !important; }
                  pre {white-space: pre-wrap;word-wrap: break-word;margin: 5px 0;line-height: 20px;font-weight: normal; }
                  p { margin: 0 0 16px 0;text-align: justify;box-sizing: border-box;text-indent: 2em;word-break: break-all;text-justify: distribute; }
                  h1,  h1 * {font-weight: 600;padding: 0;margin: 0;line-height: 25px;text-align: center; }
                  h1 {padding: 20px 0 20px 0; }
                  h1 + p {margin: 0; }
                  div {color: #323232; }
                  h2,  h2 * {margin: 0 0 16px 0;font-weight: bolder;text-indent: 2em; }
                  h3,  h3 * { box-sizing: border-box;margin: 0 0 20px 0; color: #323232;font-weight: 700;text-indent: 2em; }
                  h4,  h4 * {border-radius: 2px !important;margin: 0 0 5px 0 !important;text-indent: 2em !important;text-decoration: line-through !important;font-weight: 500; }
                  h5,  h5 * {margin: 0;text-align: right !important;color: #323232;font-weight: normal; }
                  h6,  h6 * {font-size: 14px !important;font-style: oblique !important;margin: 15px 0; }
                  a {text-decoration: none; word-wrap: break-word; }
                  a:hover,  a:visited,  a:link,  a:active {color: #3D3DF2;text-decoration: none !important; }
                  p cite,  p cite * {color: #3D3DF2;font-style: italic !important; }
                  table {padding: 0 !important;width: 100% !important;border-spacing: 0;border: 0;border-collapse: collapse; }
                  table td {width: 0 !important;text-shadow: none !important;word-break: break-all !important;word-wrap: break-word !important;margin: 0 !important;vertical-align: middle;border-collapse: collapse;padding: 0 10px;/*3423*/ }
                  table td p {text-indent: 0;margin: 5px 0; }
                  table > tbody > tr > td {border-color: #aeaeae !important; }
                  img {width: 90%;}
                  .timeliness {display:none} 
                  .hide-print {display:none}
               </style>`,
  message: {
    '1': '成功',
    '-1': '服务器错误，请重试',
    '100': '请先登录',
    '501': '用户名或密码错误',
    '502': '验证码错误',
    '511': '请先绑定用户',
    '512': 'code失效，请重新扫码绑定',
    '521': '手机验证码错误',
    '522': ''
  },
  gxfType: {
    '1': '公募基金',
    '2': '私募基金',
    '3': '证券公司资管产品',
    '4': '社保基金',
    '5': 'QFII',
    '6': 'RQFII',
    '7': '汇金公司',
    '8': '中证金',
    '9': '香港结算公司',
    '10': '一般机构或产品',
    '11': '自然人'
  },
  // T: 会议日期
  // R: 股权登记日
  // B: 定期报告：年度报告/一季报/半年报/三季报
  // P: 披露日期 = 会议日期
  // Y: 业绩报告：业绩预告/业绩快报
  // C: 差异化分红送转：是/否  (非必填)
  // SE: 日常事件开始时间，结束时间
  eventTemplateConfig: [
    // sh
    {id: 0, name: '召开临时股东大会', valueList: 'T,R', nameSample: '20XX年第一次临时股东大会'},
    {id: 1, name: '召开年度股东大会', valueList: 'T,R', nameSample: '20XX年年度股东大会'},
    {id: 2, name: '定期报告窗口期', valueList: 'B,P', nameSample: '年度报告/半年度报告/一季报/三季报窗口期'},
    {id: 3, name: '业绩预告、业绩快报窗口期', valueList: 'Y,P', nameSample: '业绩预告/业绩快报窗口期'},
    // {id: 4, name: '定期报告内幕信息知情人报备', valueList: 'T,R,', nameSample: ''},
    {id: 5, name: '权益分派实施(无上市可转债或有上市可转债但尚未进入转股期)', valueList: 'P,R,C', nameSample: '实施利润分配方案'},
    {id: 6, name: '权益分派实施(有上市可转债且已进入转股期)', valueList: 'P,R,C', nameSample: '实施利润分配方案'},
    {id: 7, name: '召开年度董事会', valueList: 'T', nameSample: '第一届董事会第一次会议'},
    {id: 8, name: '召开年度监事会', valueList: 'T', nameSample: '第一届监事会第一次会议'},
    // sz
    {id: 10, name: '召开临时股东大会', valueList: 'T,R', nameSample: '20XX年第一次临时股东大会'},
    {id: 11, name: '召开年度股东大会', valueList: 'T,R', nameSample: '20XX年年度股东大会'},
    {id: 12, name: '定期报告窗口期', valueList: 'B,P', nameSample: '年度报告/半年度报告/一季报/三季报窗口期'},
    {id: 13, name: '业绩预告、业绩快报窗口期', valueList: 'Y,P', nameSample: '业绩预告/业绩快报窗口期'},
    {id: 15, name: '权益分派实施', valueList: 'P,R', nameSample: '实施利润分配方案'},
    // {id: 16, name: '权益分派实施(有上市可转债且已进入转股期)', valueList: 'T,R,C', nameSample: ''},
    {id: 17, name: '召开年度董事会', valueList: 'T', nameSample: '第一届董事会第一次会议'},
    {id: 18, name: '召开年度监事会', valueList: 'T', nameSample: '第一届监事会第一次会议'},
    {id: 19, name: '日常事件', valueList: 'SE', nameSample: ''},
    // HG T日：董事会召开日 S日：股东大会召开日 R日：回购股份届满日
    {id: 20, name: '回购股份（集中竞价方式）', valueList: 'HG', nameSample: '回购股份（集中竞价方式）'},
    {id: 21, name: '回购股份（集中竞价方式）', valueList: 'HG', nameSample: '回购股份（集中竞价方式）'}
  ],
  // e互动名称
  eName(enterpriseCompanyCode) {
    let value = 'e互动'
    let code = ''
    if (cookie.get('userId')) {
      let userInfo = JSON.parse(cookie.get('userInfo'))
      if (enterpriseCompanyCode) {
        code = enterpriseCompanyCode
      } else {
        if (userInfo.enterpriseCompanyCode) {
          code = userInfo.enterpriseCompanyFullCode
        }
      }
      if (code) {
        if (code.toString().substring(0, 2) == 'SZ') {
          value = '互动易'
        }
      }
    }
    return value
  },
  // 用户组对应类型
  authorityRole: {
    'ENTERPRISE': 'ENTERPRISE', // 企业版权限
    'OUTER': 'OUTER', // 外部权限
    'OTHER': 'OTHER', // 其他权限
    'ADMIN': 'ADMIN', // 超级管理员权限
    'SYSTEM': 'SYSTEM', // 系统权限
    'XIAOAN': 'XIAOAN', // 小安权限
    'INNER': 'INNER', // 内部权限
    'SUPERVISE': 'SUPERVISE' // 监管权限
  }
}
