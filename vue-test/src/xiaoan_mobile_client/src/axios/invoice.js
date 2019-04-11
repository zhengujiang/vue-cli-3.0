import Axios from '../service/http'
import api from '../service/api'
export default {
    addInvoice(params = {}) {
        return Axios({method: 'POST', url: api.invoice.addInvoice, params: params,emulateJSON:true})
      },
    getInvoiceList(params = {}) {
        return Axios({method: 'GET', url: api.invoice.getInvoiceList, params: params})
      },
}
