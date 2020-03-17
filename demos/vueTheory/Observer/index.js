/**
 * 基类，负责调度
 */
class Vue {
	constructor(options){
		console.log('options', options)
		this.$el = options.el
		this.$data = options.data 

		// 判断根元素是否存在
		if (this.$el) {
			// 响应式化
			new ObserverTwo(this.$data, this)
			// this为当前vue的实例
			new Compiler(this.$el, this)
      this.$data.test = 'test'
      console.log('新增后', this.$data) // 查看新增属性之后的数据
		}
	}
}

/**
 * 观察者
 */
class Observer {
	constructor (data) {
		this.data = data
		this.observer(this.data)
	}

	observer (data) {
		if (data && typeof data === 'object') {
			for (let key in data) {
				this.defineReactive(data, key, data[key])
			}
		}
	}

	defineReactive (obj, key, value) {
		this.observer(value)
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			get() {
				return value
			},
			set: (newVal) => {
				if (newVal != value) {
					this.observer(newVal)
					value = newVal
				}
			}
		})
	}
}

/**
 * Proxy版ObserverTwo
 */
class ObserverTwo {
	constructor (data, vm) {
		vm.$data = this.observer(data)
		
	}

	observer(data) {
		if (data && typeof data === 'object') {
			for (let key in data) {
				// console.log('key', key)
				data[key] = this.observer(data[key])
			}
			return this.defineReactive(data)
		} else {
			return data
		}
	}

	defineReactive(obj) {
		return new Proxy(obj, {
      get(target, key) {
      	// console.log('get', key)
          return target[key]
      },
      set: (target, key, value) => {
      	if (target[key] != value) {
      		console.log('set', key)
          target[key] = this.observer(value) 
          return true
      	}
      }
    })
	}
}

/**
 * 核心编译类
 */
class Compiler {
	constructor(el, vm) {
		this.el = this.isElement(el) ? el : document.querySelector(el)
		this.vm = vm

		//将节点放入文档碎片中
		let fragment = this.nodeToFragment(this.el)

		// 替换节点中的内容

		// 用数据进行数据编译
		this.compile(fragment)

		// 把内容塞回到页面中
		this.el.appendChild(fragment)
	}

	// 判断el是否是元素
	isElement(node) {
		return node.nodeType === 1
	}

	// 创建文档碎片
	nodeToFragment(node) {
		let fragment = document.createDocumentFragment()
		let firstChild

		while (firstChild = node.firstChild) {
			fragment.appendChild(firstChild)
		}

		return fragment
	}

	// 模板编译（fragment中的节点）
	compile(node) {
		let childNodes = [...node.childNodes]
		childNodes.forEach(child => {
			if (this.isElement(child)) {
				this.compileElement(child)
				this.compile(child)
			} else {
				this.compileText(child)
			}
		})
	}

	// 编译元素
	compileElement(node) {
		let attributes = [...node.attributes]
		attributes.forEach(attr => {
			let {name, value:expr} = attr
			if (this.isDirective(name)) {
				let [,directive] = name.split('-')
				directiveUtil[directive](node, expr, this.vm)
			}
		})
	}

	// 编译文本
	compileText(node) {
		let content = node.textContent
		if (/\{\{(.+?)\}\}/.test(content)) {
			directiveUtil.text(node, content, this.vm)
		}
	}

	// 判断是否是指令
	isDirective(attrName) {
		return attrName.startsWith('v-')
	}
}

/**
 * 指令集
 */
const directiveUtil = {
	getVal(expr, vm) {
		let exprs = expr.split('.')
		// console.log('exprs', exprs, vm.$data)
		return exprs.reduce((current, item) => {
			return current[item]
		}, vm.$data)
	},
	model(node, expr, vm) {
		let fn = this.uploadVlue.uploadModel
		fn(node, this.getVal(expr,vm))
	},
	html(node, expr, vm) {
		let fn = this.uploadVlue.uploadHtml
		fn(node, this.getVal(expr,vm))
	},
	text(node, expr, vm) {
		let fn = this.uploadVlue.uploadText
		let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
			return this.getVal(args[1], vm)
		})
		fn(node, content)
	},
	uploadVlue: {
		uploadModel(node, val) {
			node.value = val
		},
		uploadHtml(node, val) {
			node.innerHTML = val
		},
		uploadText(node, val) {
			node.textContent = val
		}
	}
}