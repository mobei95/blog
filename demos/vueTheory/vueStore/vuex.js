const Vuex = {
	Vue: null,
	install: function (_Vue, options) {
		console.log('vue', _Vue, options)
		this.Vue = _Vue
		Vue.mixin({
			beforeCreate() {
				console.log('0000', this)
				vuexInit(this)
			}
		})
	},
	Store: class {
		constructor(options) {
			console.log('options', options)
		}
	}
}

function vuexInit(vm) {
	let options = vm.$options
  if (options.store) {
  	this.$store = options.store
  } else {
  	this.$store = options.parent.store
  }
}