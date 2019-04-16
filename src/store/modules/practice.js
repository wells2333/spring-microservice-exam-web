import { getObj } from '@/api/exam/exam'
import { addObj } from '@/api/exam/examRecord'
import {setStore, getStore} from '@/utils/store'
import { submit } from '@/api/exam/answer'

const practice = {
  state: {
    practice: getStore({
      name: 'practice'
    }) || {},
    practiceRecord: getStore({
      name: 'practiceRecord'
    }) || {}
  },
  actions: {
    GetPracticeInfo ({ commit, state }, practice) {
      return new Promise((resolve, reject) => {
        getObj(practice.id).then(response => {
          commit('SET_PRACTICE', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 新增练习记录
    AddPracticeRecordInfo ({ commit, state }, practiceRecord) {
      return new Promise((resolve, reject) => {
        addObj(practiceRecord).then(response => {
          commit('SET_PRACTICE_RECORD', response.data.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 提交练习
    SubmitPractice ({ commit, state }, practice) {
      return new Promise((resolve, reject) => {
        submit(practice).then(response => {
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    }
  },
  mutations: {
    SET_PRACTICE: (state, practice) => {
      state.practice = practice
      setStore({
        name: 'practice',
        content: state.practice,
        type: 'session'
      })
    },
    SET_PRACTICE_RECORD: (state, practiceRecord) => {
      state.practiceRecord = practiceRecord
      setStore({
        name: 'practiceRecord',
        content: state.practiceRecord,
        type: 'session'
      })
    }
  }
}

export default practice
