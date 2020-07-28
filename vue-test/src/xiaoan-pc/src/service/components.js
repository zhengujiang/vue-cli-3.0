import headerTitle from '@/components/headerTitle'
import adv from '@/components/adv'
import safeWordTip from '@/components/safeWordTip'
import regulatorCompany from '@/components/regulatorCompany'
import regulatorDialog from '@/components/regulatorDialog'
let components = [headerTitle, adv, safeWordTip, regulatorCompany, regulatorDialog]

export default (Vue) => {
  components.map((v, i) => {
    Vue.component('v-' + v.name, v)
  })
}
