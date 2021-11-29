import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
// 全局注册
export default {
  install (Vue) {
    Vue.component('PageTools', PageTools)
    // 注册excel组件
    Vue.component('UploadExcel', UploadExcel)
  }
}
