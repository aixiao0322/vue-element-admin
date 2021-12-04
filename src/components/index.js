import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import Print from 'vue-print-nb'
import ScreenFull from './ScreenFull/index.vue'
import ThemePicker from './ThemePicker/index.vue'
import lang from './lang/index.vue'
import tagsView from './TagsView/index.vue'
// 全局注册
export default {
  install (Vue) {
    Vue.component('PageTools', PageTools)
    // 注册excel组件
    Vue.component('UploadExcel', UploadExcel)
    // 注册导入上传组件
    Vue.component('ImageUpload', ImageUpload)
    // 注册打印组件
    Vue.use(Print)
    // 全屏组件
    Vue.component('ScreenFull', ScreenFull)
    // 动态颜色
    Vue.component('ThemePicker', ThemePicker)
    // 语言包
    Vue.component('lang', lang)
    // tab页视图
    Vue.component('tagsView', tagsView)
  }
}
