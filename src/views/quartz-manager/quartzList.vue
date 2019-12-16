<template>
  <cus-wraper>
  <cus-filter-wraper>
    <el-input v-model="listQuery.name" placeholder="请输入名称" style="width:200px" clearable></el-input>
    <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
  </cus-filter-wraper>
  <div class="table-container">
    <el-table v-loading="listLoading" :data="list" size="mini" fit element-loading-text="Loading" border
              highlight-current-row align="center">
      <el-table-column label="任务名称" prop="name" align="center"></el-table-column>
      <el-table-column label="触发器名称" prop="triggerName" align="center"></el-table-column>
      <el-table-column label="定时任务组" prop="jobGroupName" align="center"></el-table-column>
      <el-table-column label="触发器组" prop="triggerGroupName" align="center"></el-table-column>
      <el-table-column label="定时任务描述" prop="description" align="center"></el-table-column>
      <el-table-column label="下次触发时间" prop="nextFireTime" :formatter="dateForma" align="center"></el-table-column>
      <el-table-column label="上次触发时间" prop="prevFireTime" :formatter="dateForma" align="center"></el-table-column>
      <el-table-column label="触发器状态" prop="triggerState" align="center"></el-table-column>
      <el-table-column label="触发器类型" prop="triggerType" align="center"></el-table-column>
      <el-table-column label="定时任务时间表达式" prop="cronExpression" align="center"></el-table-column>
      <el-table-column label="定时任务开始时间" prop="startTime" :formatter="dateForma" align="center"></el-table-column>
      <el-table-column label="定时任务结束时间" prop="endTime" :formatter="dateForma" align="center"></el-table-column>
      <el-table-column align="center" v-if="this.global_checkBtnPermission(['sys:quartz:edit','sys:quartz:delete'])" :label="$t('table.actions')">
        <template slot-scope="scope">
          <el-button v-has="'sys:quartz:edit'" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" plain>
            {{ $t('table.edit') }}
          </el-button>
          <cus-del-btn v-has="'sys:quartz:delete'" @ok="handleDelete(scope.row)"/>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
  </div>
  </cus-wraper>
</template>

<script>
  import {fetchQuartzPage} from '@/api/quartz-manager/quartzList'
  import moment from 'moment'

  export default {
    name: "quartzList",
    data() {
      return {
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true;
        fetchQuartzPage(this.listQuery).then(response => {
          this.list = response.data.records
          this.total = response.data.total
          this.listLoading = false
        })
      },
      dateForma:function(row,column){
        var date = row[column.property];
        if(date == undefined || date == 0){return ''};
        return moment(date).format("YYYY-MM-DD HH:mm:ss")

      },
      handleUpdate(row) {
        this.form = Object.assign({}, row)
       /* this.dialogStatus = 'update'
        this.dialogVisible = true*/
      },
      handleDelete(row) {
    /*    let id = row.id
        deleteSysUser(id).then(response => {
          if (response.code == 200) {
            this.getList()
            this.submitOk(response.message)
          } else {
            this.submitFail(response.message)
          }
        })*/
      }
    }
  }
</script>

