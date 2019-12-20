<template>
  <el-popover v-model="visible" placement="top" width="200">
    <p>确定恢复此条任务吗？</p>
    <div style="text-align: right; margin: 0">
      <el-button size="mini" type="text" @click="visible = false">取消</el-button>
      <el-button type="primary" size="mini" @click="handleClick">确定</el-button>
    </div>
    <el-button size="mini" type="primary" slot="reference" icon="el-icon-d-arrow-right" style="margin-left: 10px;margin-top: 2px;" plain>{{ $t('table.resume') }}</el-button>
  </el-popover>
</template>
<script>
export default {
  name: 'ResBtn',
  data() {
    return {
      visible: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('ok');
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped></style>
