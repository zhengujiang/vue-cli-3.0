/**
 * @params scrollToTop
 * @params 回到顶部
 * */
const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 5);
  }
};
/**
 * @params handleFullScreen
 * @params 窗口全屏
 * */
const handleFullScreen = (value) => {
  let main = document.body
  console.log('handleFullScreenhandleFullScreenhandleFullScreen', value);
  if (value) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
    document.body.classList.remove('overflowAuto')
  } else {
    if (main.requestFullscreen) {
      main.requestFullscreen()
    } else if (main.mozRequestFullScreen) {
      main.mozRequestFullScreen()
    } else if (main.webkitRequestFullScreen) {
      main.webkitRequestFullScreen()
    } else if (main.msRequestFullscreen) {
      main.msRequestFullscreen()
    }
    document.body.classList.add('overflowAuto')
  }
};
/**
 * 树状的算法
 * @params list     代转化数组
 * @params parentId 起始节点
 */
const getTrees = (list, parentId) => {
  let items = {};
  // 获取每个节点的直属子节点，*记住是直属，不是所有子节点
  for (let i = 0; i < list.length; i++) {
    let key = list[i].id;
    if (items[key]) {
      items[key].push(list[i]);
    } else {
      items[key] = [];
      items[key].push(list[i]);
    }
  }
  return formatTree(items, parentId);
}
/**
 * 利用递归格式化每个节点
 */
const formatTree = (items, parentId) => {
  let result = [];
  if (!items[parentId]) {
    return result;
  }
  for (let t of items[parentId]) {
    t.children = formatTree(items, t.id)
    result.push(t);
  }
  return result;
}
/****/
export {
  handleFullScreen,
  scrollToTop,
  getTrees
}
