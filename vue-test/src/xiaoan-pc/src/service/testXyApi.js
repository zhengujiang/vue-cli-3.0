const protocol = document.location.protocol == 'https:' ? 'https:' : 'https:'
const HOSTS = {
  dev: {
    xyApi: protocol + '//xiyu.in-hope.cn/xicha-web/'
  },
  development: {
    xyApi: protocol + '//xiyu.in-hope.cn/xicha-web/'
  },
  testing: {
    xyApi: protocol + '//xiyu.in-hope.cn/xicha-web/'
  },
  production: {
    xyApi: protocol + '//xiyu.in-hope.cn/xicha-web/'
  }
}
const HOST = HOSTS[process.env.XA_ENV]
const api = {
  userToken: '',
  userId: '',
  defaultUrl: HOST.xyApi,
  createUser: () => { return api.defaultUrl + 'xg/createUser' },
  login: () => { return api.defaultUrl + 'login' },
  projectList: () => { return api.defaultUrl + 'ProjectManager/ProjectList' },
  uploadFile: () => { return api.defaultUrl + 'ProjectManager/addProject' },
  getQueueSize: () => { return api.defaultUrl + 'xg/getQueueSize' },
  startChecking: () => { return api.defaultUrl + 'ProjectManager/checkSingleFile' },
  checkProgress: () => { return api.defaultUrl + 'ProjectManager/checkJinDu' },
  findResults: () => { return api.defaultUrl + 'quota/findResults' },
  findTableValues: () => { return api.defaultUrl + 'quota/findTableValues' },
  findFilesByProjectId: () => { return api.defaultUrl + 'findFilesByProjectId' },
  findImagesByPidAndFId: () => { return api.defaultUrl + 'findImagesByPidAndFId' }
}

export default { api }
