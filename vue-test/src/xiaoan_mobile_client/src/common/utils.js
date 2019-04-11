const rsAstralRange = '\\ud800-\\udfff',
  rsZWJ = '\\u200d',
  rsVarRange = '\\ufe0e\\ufe0f',
  rsComboMarksRange = '\\u0300-\\u036f',
  reComboHalfMarksRange = '\\ufe20-\\ufe2f',
  rsComboSymbolsRange = '\\u20d0-\\u20ff',
  rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
const reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + ']');

const rsFitz = '\\ud83c[\\udffb-\\udfff]',
  rsOptVar = '[' + rsVarRange + ']?',
  rsCombo = '[' + rsComboRange + ']',
  rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
  reOptMod = rsModifier + '?',
  rsAstral = '[' + rsAstralRange + ']',
  rsNonAstral = '[^' + rsAstralRange + ']',
  rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
  rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
  rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
  rsSeq = rsOptVar + reOptMod + rsOptJoin,
  rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';
const reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

export function toArray(val) { // 字符串转成数组
  return hasUnicode(val)
    ? unicodeToArray(val)
    : asciiToArray(val);
}

export function hasUnicode(val) {
  return reHasUnicode.test(val);
}

export function unicodeToArray(val) {
  return val.match(reUnicode) || [];
}

export function asciiToArray(val) {
  return val.split('');
}
//
/**
 * 时间秒数格式化
 * @param s 时间戳（单位：秒）
 * @returns {*} 格式化后的时分秒
 */
export function secToTime(s) {
  let t;
  if (s > -1) {
    let hour = Math.floor(s / 3600);
    let min = Math.floor(s / 60) % 60;
    let sec = s % 60;
    if (hour < 10) {
      t = '0' + hour + ":";
    } else {
      t = hour + ":";
    }
    if (hour === 0) {
      t = '';
    }
    if (min < 10) {
      t += "0";
    }
    t += min + ":";
    if (sec < 10) {
      t += "0";
    }
    t += sec.toFixed(0);
  }
  return t;
}

//   是的，一大堆正则。看着就头疼。这个方法可以满足，把表情转成数组中的一份子。这样的话，我们只用判断数组就好了。
// 然后根据得到的数组，去挨个判断每一个的长度；代码如下：
export function cutstr(val, len) {
  let strArr = toArray(val);
  if (strArr.length > 5) {
    return `${strArr.slice(0, len).join('')}...`;
  }
  return strArr.slice(0, len).join('');
}
