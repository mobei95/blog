import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  	age: 1
  },
  mutations: {
  	addAgeSync(state, payload) {
  		state.age += payload
  	}
  },
  actions: {
  },
  modules: {
  }
})
