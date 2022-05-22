import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		tabListId: [],
		nextId: ''
	},
	mutations: {
		INIT_TABLISTIDS(state, payload) {
			state.tabListId = payload
		},
		INIT_NEXTID(state, payload) {
			for(let i=0; i<state.tabListId.length; i++) {
				if(state.tabListId[i].id == payload) {
					state.nextId = state.tabListId[i+1].id
				}
			}
		}
	}
})