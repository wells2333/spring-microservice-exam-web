<template>
  <div>
    <el-row :gutter="30">
      <el-col :span="18" :offset="2">
        <el-card class="subject-box-card" v-loading="loading">
          <div class="subject-exam-title" v-if="!loading && tempSubject.id !== ''">{{exam.examinationName}}（共{{exam.totalSubject}}题，合计{{exam.totalScore}}分）</div>
          <div class="subject-content" v-if="!loading && tempSubject.id !== ''">
            <div class="subject-title">
              <span class="subject-title-number">{{tempSubject.serialNumber}} .</span>
              {{tempSubject.subjectName}}（{{tempSubject.score}}分）
            </div>
            <div class="subject-option">
              <el-radio v-model="option" label="A">A. {{tempSubject.optionA}}</el-radio>
            </div>
            <div class="subject-option">
              <el-radio v-model="option" label="B">B. {{tempSubject.optionB}}</el-radio>
            </div>
            <div class="subject-option">
              <el-radio v-model="option" label="C">C. {{tempSubject.optionC}}</el-radio>
            </div>
            <div class="subject-option">
              <el-radio v-model="option" label="D">D. {{tempSubject.optionD}}</el-radio>
            </div>
          </div>
          <div class="subject-buttons" v-if="!loading && tempSubject.id !== ''">
            <el-button plain @click="last">上一题</el-button>
            <el-button v-if="tempSubject.serialNumber !== exam.totalSubject" plain @click="next">下一题</el-button>
            <el-button v-if="tempSubject.serialNumber !== 0 && tempSubject.serialNumber === exam.totalSubject" type="success" @click="submitExam" v-bind:disabled="disableSubmit">提交</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="2">
        <div class="time-remain">
          剩余时间:
          <div class="time">
            <count-down v-on:start_callback="countDownS_cb(1)" v-on:end_callback="countDownE_cb(1)" :current-time="currentTime" :start-time="startTime" :end-time="endTime" :tip-text="'距离考试开始'" :tip-text-end="'距离考试结束'" :end-text="'考试结束'" :hourTxt="':'" :minutesTxt="':'" :secondsTxt="''">
            </count-down>
          </div>
        </div>
        <div class="current-progress">
          当前进度: {{tempSubject.serialNumber}}/{{exam.totalSubject}}
        </div>
        <div class="answer-card">
          <el-button type="text" icon="el-icon-date" @click="answerCard">答题卡</el-button>
        </div>
        <el-button type="success" icon="el-icon-date" @click="submitExam" v-bind:disabled="disableSubmit">提交</el-button>
      </el-col>
    </el-row>
    <el-dialog title="答题卡" :visible.sync="dialogVisible" width="50%" top="10vh" center>
      <div class="answer-card-title" >{{exam.examinationName}}（共{{exam.totalSubject}}题，合计{{exam.totalScore}}分）</div>
      <div class="answer-card-split"></div>
      <el-row class="answer-card-content">
        <el-button circle v-for="index in exam.totalSubject" :key="index" @click="toSubject(index)">&nbsp;{{index}}&nbsp;</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import CountDown from 'vue2-countdown'
import { getSubjectAnswer } from '@/api/exam/subject'
import { saveOrUpdate } from '@/api/exam/answer'
import store from '@/store'
import moment from 'moment'
import { notifySuccess, notifyFail } from '@/utils/util'

export default {
  components: {
    CountDown
  },
  data () {
    return {
      loading: true,
      currentTime: 0,
      startTime: 0,
      endTime: 0,
      disableSubmit: true,
      tempSubject: {
        id: '',
        examinationId: '',
        subjectName: '',
        type: 0,
        content: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        optionE: '',
        optionF: '',
        answer: '',
        score: '',
        analysis: '',
        level: 2
      },
      query: {
        serialNumber: 1,
        examRecordId: '',
        userId: ''
      },
      option: '',
      dialogVisible: false,
      tempAnswer: {
        id: '',
        userId: '',
        examinationId: '',
        courseId: '',
        subjectId: '',
        answer: ''
      }
    }
  },
  computed: {
    // 获取用户信息
    ...mapState({
      userInfo: state => state.user.userInfo,
      examRecord: state => state.exam.examRecord
    }),
    ...mapGetters([
      'exam'
    ])
  },
  created () {
    // 考试ID
    this.query.examinationId = this.exam.id
    // 考试记录ID
    this.query.examRecordId = this.examRecord.id
    // 用户ID
    this.query.userId = this.userInfo.id
    // 开始考试
    this.startExam()
  },
  methods: {
    countDownS_cb: function (x) {
      this.$notify({
        title: '提示',
        message: '考试开始',
        type: 'warn',
        duration: 2000
      })
    },
    // 开始考试
    startExam () {
      // 查询考试信息
      store.dispatch('GetExamInfo', this.exam).then(res => {
        // 校验考试时间
        const currentTime = moment(this.exam.currentTime)
        if (currentTime.isAfter(this.exam.endTime)) {
          this.$notify({
            title: '提示',
            message: '考试已结束',
            type: 'warn',
            duration: 2000
          })
        } else if (currentTime.isBefore(this.exam.startTime)) {
          // 考试未开始
          this.$notify({
            title: '提示',
            message: '考试未开始',
            type: 'warn',
            duration: 2000
          })
        } else {
          // 获取服务器的当前时间
          this.currentTime = currentTime.valueOf()
          // 考试开始时间
          this.startTime = this.currentTime
          // 考试结束时间
          this.endTime = moment(this.exam.endTime).valueOf()
          // 题目数
          this.exam.totalSubject = parseInt(this.exam.totalSubject)
          this.disableSubmit = false
          // 加载题目和答题
          this.getSubjectAndAnswer(this.query)
        }
      }).catch((err) => {
        this.$notify({
          title: '提示',
          message: '获取考试信息失败',
          type: 'warn',
          duration: 2000
        })
      })
    },
    // 考试结束
    countDownE_cb: function (x) {
      this.$notify({
        title: '提示',
        message: '考试结束',
        type: 'warn',
        duration: 2000
      })
      this.disableSubmit = true
      this.loading = false
    },
    // 上一题
    last () {
      if (this.query.serialNumber === 1) {
        this.$notify({
          title: '提示',
          message: '已经是第一题了',
          type: 'warn',
          duration: 2000
        })
      } else {
        // 先回退题目序号
        this.query.serialNumber--
        // 加载题目
        this.getSubjectAndAnswer(this.query)
      }
    },
    // 下一题
    next () {
      // 提交到后台
      let answer = {
        id: this.tempAnswer.id,
        userId: this.userInfo.id,
        examinationId: this.exam.id,
        examRecordId: this.examRecord.id,
        subjectId: this.tempSubject.id,
        answer: this.option
      }
      saveOrUpdate(answer).then(response => {
        console.log('提交成功')
      }).catch(() => {
        console.log('提交失败')
      })
      this.query.serialNumber++
      this.getSubjectAndAnswer(this.query)
    },
    // 加载题目和答题
    getSubjectAndAnswer (query) {
      this.loading = true
      getSubjectAnswer(query).then(response => {
        if (response.data.data === null) {
          this.$notify({
            title: '提示',
            message: '已经是最后一题了',
            type: 'warn',
            duration: 2000
          })
          this.query.serialNumber--
          this.loading = false
        } else {
          // 题目内容
          this.tempSubject = response.data.data
          // 答题
          this.tempAnswer = this.tempSubject.answer
          // 选项
          this.option = this.tempAnswer.answer
          this.loading = false
        }
      }).catch(() => {
        notifyFail(this, '加载题目失败')
        this.loading = false
      })
    },
    // 答题卡
    answerCard () {
      this.dialogVisible = true
    },
    // 跳转题目
    toSubject (index) {
      this.query.serialNumber = index
      this.getSubjectAndAnswer(this.query)
      this.dialogVisible = false
    },
    // 提交
    submitExam () {
      this.$confirm('确定要提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 提交到后台
        store.dispatch('SubmitExam', { examinationId: this.exam.id, examRecordId: this.examRecord.id, userId: this.userInfo.id }).then(res => {
          notifySuccess(this, '提交成功')
          // 禁用提交按钮
          this.disableSubmit = true
          this.$router.push({name: 'score', query: {type: 'exam'}})
        }).catch((err) => {
          notifyFail(this, '提交失败')
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/common.scss";
  .start-exam-msg {
    @extend %message-common;
  }
  .subject-box-card {
    margin-bottom: 30px;
    min-height: 400px;
    .subject-exam-title{
      font-size: 18px;
      line-height: 25px;
      padding: 18px 20px;
      border-bottom: 1px solid #DEDEDE;
    }
    .subject {
      padding-left: 30px;
      padding-right: 75px;
    }
    .subject-content{
      padding: 30px 0;
      position: relative;
    }
    /* 题目 */
    .subject-title {
      font-size: 16px;
      line-height: 22px;
      margin-bottom: 10px;
      padding-left: 20px;
      position: relative;
      .subject-title-number {
        position: absolute;
        left: -25px;
        top: 0;
        display: inline-block;
        width: 40px;
        line-height: 22px;
        text-align: right;
      }
    }
    /* 题目选项 */
    .subject-option {
      padding: 10px 15px 10px 45px;
    }
  }
  .subject-buttons {
    text-align: center;
  }
  .time-remain .time {
    font-size: 18px;
    line-height: 22px;
    color: #FF0000;
    font-weight: 400;
  }

  /* 答题卡 */
  .answer-card-title {
    font-size: 13px;
    color: #3A3E51;
    line-height: 17px;
    padding: 10px 0;
  }
  .answer-card-split {
    width: 100%;
    border-bottom: 1px solid #E6E6E6;
  }
  .answer-card-content {
    padding-bottom: 10px;
    font-size: 0;
    margin-right: -15px;
    > button {
      margin-top: 5px;
    }
  }
</style>
