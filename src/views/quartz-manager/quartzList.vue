<template>
  <cus-wraper>
    <cus-filter-wraper>
      <el-input v-model="listQuery.name" placeholder="请输入名称" style="width:200px" clearable></el-input>
      <el-button type="primary" @click="getList" icon="el-icon-search">查询</el-button>
      <el-button v-waves class="filter-item" style="float: right;margin-right: 10px;" type="primary" icon="el-icon-refresh" @click="getList">刷新</el-button>
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
<!--        <el-table-column label="定时任务结束时间" prop="endTime" :formatter="dateForma" align="center" ></el-table-column>-->
        <el-table-column align="center" v-if="this.global_checkBtnPermission(['sys:quartz:edit','sys:quartz:delete'])"
                         :label="$t('table.actions')">
          <template slot-scope="scope">
            <el-button style="margin-left: 10px;margin-top: 2px;" v-has="'sys:quartz:edit'" size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit" plain>{{ $t('table.edit') }}</el-button>
            <cus-res-btn @ok="handleResume(scope.row)" v-if="scope.row.triggerState=='PAUSED'"/>
<!--            <el-button   style="margin-top: 2px;" size="mini" type="primary" icon="el-icon-d-arrow-right" v-if="scope.row.triggerState=='PAUSED'"  @ok="handleResume(scope.row)" plain>{{ $t('table.resume') }}</el-button>-->
<!--            <el-button  style="margin-top: 2px;" size="mini" type="primary"  icon="el-icon-circle-close" v-else   @ok="handlePause(scope.row)" plain>{{ $t('table.pause') }}</el-button>-->
            <cus-pau-btn @ok="handlePause(scope.row)" v-else/>
            <cus-del-btn v-has="'sys:quartz:delete'" @ok="handleDelete(scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <cus-pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                      @pagination="getList"/>
    </div>
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="40%" @close="handleDialogClose">
      <el-form ref="dataForm" :model="form" :rules="rules" label-width="80px" class="demo-ruleForm">
        <el-form-item label="任务名称:" prop="name" label-width="120px">
          <el-input v-model="form.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="触发器名称:" prop="triggerName" hidden>
          <el-input v-model="form.triggerName" ></el-input>
        </el-form-item>
        <el-form-item label="任务组:" prop="jobGroupName" hidden>
          <el-input v-model="form.jobGroupName" ></el-input>
        </el-form-item>
        <el-form-item label="时间表达式:" prop="cronExpression" label-width="120px">
          <el-input v-model="form.cronExpression"></el-input>
        </el-form-item>
        <el-form-item label="定时任务描述:" prop="description" label-width="120px" >
          <el-input v-model="form.description" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false"> {{ $t('table.cancel') }} </el-button>
          <el-button type="primary" @click="submitForm"> {{ $t('table.confirm') }} </el-button>
        </span>
    </el-dialog>
  </cus-wraper>
</template>

<script>
  import {fetchQuartzPage,saveQuartzJob,deleteQuartzJob,pauseQuartzJob,resumeQuartzJob} from '@/api/quartz-manager/quartzList'
  import moment from 'moment'

  export default {
    name: "quartzList",
    data() {
      return {
        dialogVisible: false,
        list: [],
        listLoading: true,
        total: 0,
        listQuery: {
          page: 1,
          limit: 10,
          name: undefined
        },
        form: {
          name: undefined,
          triggerName: undefined,
          cronExpression: undefined,
          description: undefined,
          jobGroupName: undefined
        },
        rules: {
          cronExpression: [
            {required: true, min: 3, message: '请输入时间表达式', trigger: 'blur'}
          ],
          description: [
            {min: 1, required: true, message: '请输入描述', trigger: 'blur'},
          ]
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
      dateForma: function (row, column) {
        var date = row[column.property];
        if (date == undefined || date == 0) {
          return ''
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss")

      },
      handleUpdate(row) {
        this.form = Object.assign({}, row)
         this.dialogVisible = true
      },
      handleDelete(row) {
            let name = row.name;
            let group = row.jobGroupName;
            deleteQuartzJob(name,group).then(response => {
              if (response.code == 200) {
                this.getList()
                this.submitOk(response.message)
              } else {
                this.submitFail(response.message)
              }
            })
      }, handleResume(row) {
            let name = row.name;
            let group = row.jobGroupName;
            resumeQuartzJob(name,group).then(response => {
              if (response.code == 200) {
                this.getList()
                this.submitOk(response.message)
              } else {
                this.submitFail(response.message)
              }
            })
      },
      handlePause(row) {
        let name = row.name;
        let group = row.jobGroupName;
        pauseQuartzJob(name,group).then(response => {
          if (response.code == 200) {
            this.getList()
            this.submitOk(response.message)
          } else {
            this.submitFail(response.message)
          }
        })
      },
      submitForm() {
        this.$refs.dataForm.validate(valid => {
          if (valid) {
            saveQuartzJob(this.form).then(response => {
              if (response.code == 200) {
                this.getList()
                this.submitOk(response.message)
                this.dialogVisible = false
              } else {
                this.submitFail(response.message)
              }
            }).catch(err => {
              console.log(err)
            })
          }
        })
      },
      // 监听dialog关闭时的处理事件
      handleDialogClose() {
        if (this.$refs['dataForm']) {
          this.$refs['dataForm'].clearValidate() // 清除整个表单的校验
        }
      }
    }
  }
</script>

