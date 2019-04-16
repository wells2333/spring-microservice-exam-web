<template>
  <div>
    <el-row class="exam-msg">
      <el-col :span="24" style="color: black;">
        <h1>所有考试</h1>
      </el-col>
    </el-row>
    <el-row :gutter="100" v-loading="listLoading">
      <el-col :span="6" v-for="(exam, index) in examList" :key="exam.id" :offset="(index === 0 || index % 3 === 0) ? 2 : 0">
        <el-card :body-style="{ padding: '12px' }">
          <img :src="getAvatar(exam.avatar)" v-if="exam.avatar" class="exam-image">
          <img src="../../../static/images/home/icon_function3.jpg" v-else class="exam-image">
          <div style="padding: 14px;">
            <span>{{ exam.examinationName }}</span>
            <div class="exam-bottom">
              <time class="exam-time">开始时间：{{ exam.startTime }}</time>
              <el-button type="text" class="exam-button" @click="startExam(exam)">开始考试</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col v-if="!listLoading && examList.length === 0" :span="24">
        <p class="exam-empty">暂无更多数据</p>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { fetchList } from '@/api/exam/exam'
import { isNotEmpty, getAttachmentPreviewUrl } from '@/utils/util'
import store from '@/store'
import moment from 'moment'

export default {
  data () {
    return {
      listLoading: true,
      examList: [],
      query: {
        courseId: '',
        status: '0'
      },
      tempExamRecord: {
        id: '',
        userId: '',
        examinationId: ''
      }
    }
  },
  computed: {
    // 获取用户信息
    ...mapState({
      userInfo: state => state.user.userInfo,
      course: state => state.course.course,
      sysConfig: state => state.sysConfig.sysConfig
    })
  },
  created () {
    if (isNotEmpty(this.course)) {
      this.query.courseId = this.course.id
    }
    // 加载考试列表
    this.getExamList()
  },
  methods: {
    // 加载考试列表
    getExamList () {
      this.listLoading = true
      fetchList(this.query).then(response => {
        this.examList = response.data.list
        this.listLoading = false
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '查看考试失败',
          type: 'error',
          duration: 2000
        })
        this.listLoading = false
      })
    },
    // 开始考试
    startExam (exam) {
      this.tempExamRecord.examinationId = exam.id
      this.tempExamRecord.userId = this.userInfo.id
      // 校验考试时间
      const currentTime = moment(exam.currentTime)
      // 校验结束时间
      if (currentTime.isAfter(exam.endTime)) {
        this.$notify({
          title: '提示',
          message: '考试已结束',
          type: 'warn',
          duration: 2000
        })
      } else if (currentTime.isBefore(exam.startTime)) {
        // 考试未开始
        this.$notify({
          title: '提示',
          message: '考试未开始',
          type: 'warn',
          duration: 2000
        })
      } else {
        this.$confirm('确定要开始吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 暂存考试信息
          store.dispatch('SetExamInfo', exam).then(res => {
            // 创建考试记录
            store.dispatch('AddExamRecordInfo', this.tempExamRecord).then(res => {
              this.$router.push({name: 'start'})
            }).catch((err) => {
              this.$notify({
                title: '提示',
                message: '开始考试失败',
                type: 'warn',
                duration: 2000
              })
            })
          })
        })
      }
    },
    getAvatar (avatar) {
      return getAttachmentPreviewUrl(this.sysConfig, avatar)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/common.scss";
  .exam-msg {
    @extend %message-common;
  }
  .exam-image {
    width: 100%;
    display: block;
    cursor: pointer;
  }
  .el-col {
    margin-bottom: 40px;
  }
  .exam-bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .exam-button {
    padding: 0;
    float: right;
  }
  .exam-time {
    font-size: 13px;
    color: #999;
  }
  .exam-empty {
    font-size: 13px;
    color: #999;
    text-align: center;
  }
</style>
