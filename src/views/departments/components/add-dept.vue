<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="showTitle"
    :visible="showDialog"
    @close="btnCancel"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item
        label="部门名称"
        prop="name"
      >
        <el-input
          v-model="formData.name"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门编码"
        prop="code"
      >
        <el-input
          v-model="formData.code"
          style="width:80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item
        label="部门负责人"
        prop="manager"
      >
        <el-select
          v-model="formData.manager"
          style="width:80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="部门介绍"
        prop="introduce"
      >
        <el-input
          v-model="formData.introduce"
          style="width:80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row
      slot="footer"
      type="flex"
      justify="center"
    >
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="btnOK"
        >确定</el-button>
        <el-button
          size="small"
          @click="btnCancel"
        >取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, getDepartDetail, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  // 组件名称
  name: '',
  // 局部注册的组件
  components: {
  },
  // 组件参数 接收来自父组件的数据
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  // 组件状态值
  data () {
    const checkNameRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      let isRepeat = false
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        // 没id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }

      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async (rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑模式  因为编辑模式下 不能算自己
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }

      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      peoples: [],
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [{ required: true, message: '部门名称不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur' }, { trigger: 'blur', validator: checkNameRepeat }],
        code: [{ required: true, message: '部门编码不能为空', trigger: 'blur' }, { min: 1, max: 50, message: '部门编码要求1-50个字符', trigger: 'blur' }, {
          trigger: 'blur',
          validator: checkCodeRepeat
        }],
        manager: [{ required: true, message: '部门负责人不能为空', trigger: 'blur' }],
        introduce: [{ required: true, message: '部门介绍不能为空', trigger: 'blur' }, { trigger: 'blur', min: 1, max: 300, message: '部门介绍要求1-50个字符' }]
      }
    }
  },
  // 计算属性
  computed: {
    showTitle () {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  // 侦听器
  watch: {},
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
* 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
*/
  created () { },
  /**
* el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
* 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
*/
  mounted () { },
  // 组件方法
  methods: {
    // 获取员工简单列表数据
    async getEmployeeSimple () {
      this.peoples = await getEmployeeSimple()
    },
    async getDepartDetail (id) {
      this.formData = await getDepartDetail(id)
    },
    btnOK () {
      this.$refs.deptForm.validate(async isOK => {
        if (isOK) {
          if (this.formData.id) {
            // 编辑模式  调用编辑接口
            await updateDepartments(this.formData)
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
          // 表示可以提交了

          this.$emit('addDepts')
          this.$emit('update:showDialog', false)
        }
      })
    },
    btnCancel () {
      this.formData = {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      }
      this.$refs.deptForm.resetFields() // 重置校验字段
      this.$emit('update:showDialog', false) // 关闭
    }
  }
}
</script>

<style scoped lang="less">
</style>
