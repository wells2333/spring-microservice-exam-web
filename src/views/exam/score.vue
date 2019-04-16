<template>
  <div>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-card class="score-gray-box" shadow="hover">
          <div slot="header" class="score-gray-box-title">
            <span>考试成绩</span>
          </div>
          <div class="score">
            <h4>成绩: <span type="success">{{score.score}}</span></h4>
            <h4>正确题数: <span type="success">{{score.correctNumber}}</span></h4>
            <h4>错误题数: <span type="success">{{score.inCorrectNumber}}</span></h4>
            <el-button type="success" size="medium" @click="incorrectAnswer" icon="el-icon-view">查看错题</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { getObj } from '@/api/exam/examRecord'

export default {
  data () {
    return {
      score: {
        score: '',
        correctNumber: '',
        inCorrectNumber: ''
      },
      query: {
        id: ''
      }
    }
  },
  computed: {
    // 获取用户信息
    ...mapState({
      userInfo: state => state.user.userInfo,
      exam: state => state.exam.exam,
      examRecord: state => state.exam.examRecord,
      practice: state => state.practice.practice,
      practiceRecord: state => state.practice.practiceRecord
    })
  },
  created () {
    // 练习或考试
    this.type = this.$route.query.type
    if (this.type === 'practice') {
      this.query.id = this.practiceRecord.id
    } else {
      this.query.id = this.examRecord.id
    }
    this.query.userId = this.userInfo.id
    this.getScoreList()
  },
  methods: {
    getScoreList () {
      getObj(this.query.id).then(response => {
        if (response.data.data.id === null) {
          this.resetScore()
        } else {
          this.score = response.data.data
        }
      }).catch(() => {
        this.$notify({
          title: '失败',
          message: '加载成绩失败',
          type: 'error',
          duration: 2000
        })
      })
    },
    incorrectAnswer () {
      if (this.score.id === undefined) {
        this.$notify({
          title: '提示',
          message: '无考试成绩',
          type: 'warn',
          duration: 2000
        })
        return
      }
      this.$router.push({name: 'incorrect-answer', query: {type: this.type}})
    },
    resetScore () {
      this.score = {
        score: '0',
        correctNumber: '0',
        inCorrectNumber: '0'
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/css/common.scss";
  .score-gray-box {
    @extend .gray-box;
    margin-top: 50px;
  }
  .score-gray-box-title {
    text-align: center;
  }
  .score {
    margin: 20px;
  }
</style>
