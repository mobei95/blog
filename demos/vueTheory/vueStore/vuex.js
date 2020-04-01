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
		mutations && this.setMutations(mutations)

		let actions = options.actions
		this.actions = {}
		actions && this.setActions(actions)
	}

	get state() {
		return this.s.state
	}

	// 设置mutations
	setMutations = (mutations) => {
		// 遍历options中的每一个mutation，将其第一个参数绑定为当前实例的state
		Object.keys(mutations).forEach(mutationName => {
			this.mutations[mutationName] = (payload) => {
				mutations[mutationName](this.state, payload)
			}
		})
	}

	commit = (mutationName, payload) => {
		this.mutations[mutationName](payload)

	}

	// 设置actions
	setActions = (actions) => {
		Object.keys(actions).forEach(actionName => {
			this.actions[actionName] = (payload) => {
				actions[actionName](this, payload)
			}
		})
	}

	dispatch = (actionName, payload) => {
		this.actions[actionName](payload)
	}
}

export default {
	install,
	Store
}