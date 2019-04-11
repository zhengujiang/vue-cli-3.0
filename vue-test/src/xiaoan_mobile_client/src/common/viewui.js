// 项目引用的 UI控件
/** todo
 * @type 'UI'
 * @name 'dengke.liu' , Evans
 * @charset UTF-8
 * @Version 1.0.0
 * **/
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
import VueScroller from 'vue-scroller'
import {AlertPlugin, ConfirmPlugin, DatetimePlugin, LoadingPlugin, ToastPlugin} from 'vux'
import XiaoanDrop from "../components/warning/drop"
import VxaBanner from "../components/banner/banner"
import returnTop from "../components/warning/returnTop"
import xiaoanLoading from "../components/warning/loading"
import xiaoanError from "../components/warning/error"
import xiaoanWarning from "../components/warning/warning"
import checkbox from "../components/checkbox.vue"
import VxaPdf from '../components/iframe/pdfIframe'
import VxaWord from '../components/iframe/wordIframe'

const components = [VxaWord, VxaPdf, VxaBanner, XiaoanDrop, returnTop, xiaoanLoading, xiaoanError, xiaoanWarning, checkbox];
export default (Vue) => {
  components.map((v, i) => {
    Vue.component(v.name, v)
  })
  Vue.use(DatetimePlugin)
  Vue.use(ToastPlugin)
  Vue.use(ConfirmPlugin)
  Vue.use(LoadingPlugin)
  Vue.use(MintUI);
  Vue.use(VueAwesomeSwiper) // 记得不要忘记这句
  Vue.use(VueScroller)
  Vue.use(AlertPlugin)
}
