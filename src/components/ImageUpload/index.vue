<template>
  <div>
    <el-upload
      :on-preview="preview"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :file-list="fileList"
      list-type="picture-card"
      action="#"
      :limit="1"
      :class="{disabled: fileComputed }"
      :before-upload="beforeUpload"
      :http-request="upload"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- .............. -->
    <el-dialog
      title="图片预览"
      :visible.sync="showDialog"
    >
      <img
        :src="imgUrl"
        style="width:100%"
        alt=""
      >
      <el-progress
        v-if="showPercent"
        style="width: 180px"
        :percentage="percent"
      />
    </el-dialog>
  </div>
</template>
<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDve7JFuIQHrAJCo8BxSfbGelbbLoztXty',
  SecretKey: 'plW1HH2XmlVzC8oDLCm69vQfokQs52jA'
})
export default {
  data () {
    return {
      showPercent: false,
      fileList: [],
      currentFileUid: '',
      percent: 0,
      showDialog: false,
      imgUrl: ''
    }
  },
  computed: {
    fileComputed () {
      return this.fileList.length === 1
    }
  },
  methods: {
    preview (file) {
      this.imgUrl = file.url
      this.showDialog = true
    },
    handleRemove (file) {
      // console.log(file)
      this.fileList = this.fileList.filter(item => item.uid !== file.uid)
    },
    changeFile (file, fileList) {
      console.log(file)
      console.log(fileList)
      this.fileList = fileList.map(item => item)
    },
    beforeUpload (file) {
      // console.log(file)

      // 文件类型 文件大小
      const types = ['image/jpeg', 'image/gif', 'image/bmp', 'image/png']
      if (!types.includes(file.type)) {
        this.$message.error('上传图片只能是 JPG、GIF、BMP、PNG 格式!')
        return false
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024
      if (maxSize < file.size) {
        this.$message.error('图片大小最大不能超过5M')
        return false
      }
      this.currentFileUid = file.uid
      return true
    },
    upload (params) {
      // console.log(params.file)
      if (params.file) {
        cos.putObject({
          Bucket: 'images-1308574571',
          Region: 'ap-beijing',
          Key: params.file.name,
          Body: params.file,
          StorageClass: 'STANDARD',
          onProgress: (params) => {
            this.percent = params.percent * 100
          }
        }, (err, data) => {
          console.log(err || data)
          if (!err && data.statusCode === 200) {
            this.fileList = this.fileList.map(item => {
              if (item.uid === this.currentFileUid) {
                return { url: 'http://' + data.Location, upload: true }
              }
              return item
            })
          }
        })
      }
    }
  }
}
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
