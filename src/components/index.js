import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
// 全局注册
export default {
  install (Vue) {
    Vue.component('PageTools', PageTools)
    // 注册excel组件
    Vue.component('UploadExcel', UploadExcel)
    // 注册导入上传组件
    Vue.component('ImageUpload', ImageUpload)
  }
}
