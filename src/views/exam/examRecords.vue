<template>
  <div class="app-container">
    <el-row class="exam-recode-msg">
      <el-col :span="24" style="color: black;">
        <h1>考试记录</h1>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-table
          v-loading="listLoading"
          :key="tableKey"
          :data="examRecodeList"
          :default-sort="{ prop: 'id', order: 'descending' }"
          highlight-current-row
          style="width: 100%;">
          <el-table-column label="考试名称" sortable prop="examination_name" min-width="90" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.examinationName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="考试类型" sortable prop="type" min-width="90" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type | typeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属课程" sortable prop="type" min-width="90" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.type | typeFilter }}</span>
            </template>
          </el-table-column>
          <el-table-column label="开始时间" sortable prop="start_time" min-width="90" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.startTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束时间" sortable prop="end_time" min-width="90" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="成绩" sortable prop="score" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{ scope.row.score }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination-container">
          <el-pagination v-show="total>0" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchList } from '@/api/exam/examRecord'
export default {
  filters: {
    typeFilter (type) {
      const typeMap = {
        0: '正式考试',
        1: '模拟考试',
        2: '在线练习'
      }
      return typeMap[type]
    }
  },
  data () {
    return {
      examRecodeList: [],
      total: 0,
      listLoading: true,
      tableKey: 0,
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        courseId: '',
        sort: 'id',
        order: 'descending'
      }
    }
  },
  computed: {
    // 获取用户信息
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  created () {
    this.listQuery = {
      userId: this.userInfo.id
    }
    this.getList()
  },
  methods: {
    // 加载考试记录
    getList () {
      fetchList(this.listQuery).then(response => {
        this.examRecodeList = response.data.list
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '加载考试记录失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.pageNum = val
      this.getList()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/common.scss";
  .exam-recode-msg {
    @extend %message-common;
  }
</style>
