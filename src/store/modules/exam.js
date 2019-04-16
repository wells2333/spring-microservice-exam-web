import { getObj } from '@/api/exam/exam'
import { addObj } from '@/api/exam/examRecord'
import {setStore, getStore} from '@/utils/store'
import { submit } from '@/api/exam/answer'

const exam = {
  state: {
    exam: getStore({
      name: 'exam'
    }) || {},
    examRecord: getStore({
      name: 'examRecord'
    }) || {}
  },
  actions: {
    GetExamInfo ({ commit, state }, exam) {
      return new Promise((resolve, reject) => {
        getObj(exam.id).then(response => {
          commit('SET_EXAM', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 设置考试信息
    SetExamInfo ({ commit, state}, exam) {
      commit('SET_EXAM', exam)
    },
    // 新增考试记录
    AddExamRecordInfo ({ commit, state }, examRecord) {
      return new Promise((resolve, reject) => {
        addObj(examRecord).then(response => {
          commit('SET_EXAM_RECORD', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 提交考试
    SubmitExam ({ commit, state }, exam) {
      return new Promise((resolve, reject) => {
        submit(exam).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_EXAM: (state, exam) => {
      state.exam = exam
      setStore({
        name: 'exam',
        content: state.exam,
        type: 'session'
      })
    },
    SET_EXAM_RECORD: (state, examRecord) => {
      state.examRecord = examRecord
      setStore({
        name: 'examRecord',
        content: state.examRecord,
        type: 'session'
      })
    }
  }
}

export default exam
