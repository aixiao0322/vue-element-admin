<template>
  <div
    v-loading="loading"
    class="dashboard-container"
  >
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <tree-tools
          :tree-node="company"
          :is-root="true"
        />
        <el-tree
          :data="departs"
          :props="defaultProps"
          default-expand-all
        >
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="getDepartments"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹层组件  -->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tools.vue'
import { getDepartments } from '@/api/departments.js'
import { tranListToTreeData } from '@/utils'
import AddDept from './components/add-dept'
export default {
  components: {
    TreeTools,
    AddDept
  },
  data () {
    return {
      loading: false,
      company: {},
      departs: [],
      defaultProps: {
        label: 'name'
      },
      showDialog: false,
      node: null
    }
  },
  created () {
    // 调用自身的方法
    this.getDepartments()
  },
  methods: {
    async getDepartments () {
      this.loading = true
      const result = await getDepartments()
      this.departs = tranListToTreeData(result.depts, '')
      this.company = { name: result.companyName, manager: '负责人', id: '' }
      this.loading = false
    },
    addDepts (node) {
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    },
    text (value) {
      this.showDialog = value
    },
    editDepts (node) {
      // 首先打开弹层
      this.showDialog = true
      this.node = node // 赋值操作的节点
      // 传入一个id
      this.$refs.addDept.getDepartDetail(node.id)
    }

  }
}
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
