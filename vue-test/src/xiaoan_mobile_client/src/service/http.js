/**todo
 * @type "http请求"
 *
 * */
import Axios from 'axios'
import $cookie from '../common/cookie'

Axios.defaults.timeout = 50000
Axios.defaults.withCredentials = true
// 请求拦截器
Axios.interceptors.request.use(config => {
  config.headers['origin-type'] = 'H5'
  let userId = $cookie.get("userId")
  if (config.params) {
    if (config.params.token) {
      userId = config.params.userId
    }
  }
  let opt = {userId: userId}
  config.params = Object.assign({}, opt, config.params)
  return config
}, error => {
  return Promise.reject(error)
})
// 响应拦截器
Axios.interceptors.response.use(response => {
  // console.log('响应正确:' + response)
  return response;
}, error => {
  console.log('响应错误:' + error)
  return Promise.reject(error)
})

export default Axios
