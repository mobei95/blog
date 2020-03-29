let Vue
const install = function(_Vue) {
	Vue = _Vue
	Vue.mixin({
		beforeCreate() {
			let options = this.$options
			// console.log('this', this)
		  if (options.store) {
		  	this.$store = options.store
		  } else {
		  	this.$store = options.parent && options.parent.$store
		  }
		}
	})
}

class Store {
	constructor(options) {
		this.s = new Vue({
			data () {
				return {
					state: options.state
				}
			}
		})

		let mutations = options.mutations
		this.mutations = {}
		// 遍历options中的每一个mutation，将其第一个参数绑定为当前实例的state
		Object.keys(mutations).forEach(mutationName => {
			this.mutations[mutationName] = (payload) => {
				mutations[mutationName](this.state, payload)
			}
		})

		let actions = options.actions
		this.actions = {}
		Object.keys(actions).forEach(actionName => {
			this.actions[actionName] = (payload) => {
				actions[actionName](this, payload)
			}
		})
	}

	get state() {
		return this.s.state
	}

	commit = (mutationName, payload) => {
		this.mutations[mutationName](payload)

	}

	dispatch = (actionName, payload) => {
		this.actions[actionName](payload)
	}
}

const vuexInit = function(vm) {
	
}

export default {
	install,
	Store
}