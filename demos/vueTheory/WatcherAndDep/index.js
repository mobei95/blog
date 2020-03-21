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
			new Observer(this.$data, this)
			// this为当前vue的实例
			new Compiler(this.$el, this)
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
		let dep = new Dep()
		Object.defineProperty(obj, key, {
			enumerable: true,
			configurable: true,
			get() {
				Dep.target && dep.addSub(Dep.target)
				dep.name = key
				return value
			},
			set: (newVal) => {
				if (newVal != value) {
					this.observer(newVal)
					value = newVal
					dep.notify()
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
	// 获取属性的value值，eg：data.key
	getVal(expr, vm) {
		let exprs = expr.split('.')
		// console.log('exprs', exprs, vm.$data)
		return exprs.reduce((current, item) => {
			return current[item]
		}, vm.$data)
	},
	// 设置属性的value值
	setVal(expr, vm, value) {
		let exprs = expr.split('.')
		exprs.reduce((current, item, index, arr) => {
			if (index == arr.length - 1) {
				current[item] = value
			}
			return current[item]
		}, vm.$data)
	},
	// 获取内容，eg：{{a}}{{b}}{{c}}
	getContent(expr, vm) {
		return expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
			return this.getVal(args[1], vm)
		})
	},
	model(node, expr, vm) {
		let fn = this.uploadVlue.uploadModel
		new Watcher(vm, expr, (newVal) => {
			fn(node, newVal)
		})
		// 绑定事件
		addEventListener('change', (e) => {
			this.setVal(expr, vm, e.target.value)
		}, false)
		fn(node, this.getVal(expr,vm))
	},
	html(node, expr, vm) {
		let fn = this.uploadVlue.uploadHtml
		new Watcher(vm, expr, (newVal) => {
			fn(node, newVal)
		})
		fn(node, this.getVal(expr,vm))
	},
	text(node, expr, vm) {
		let fn = this.uploadVlue.uploadText
		let content = expr.replace(/\{\{(.+?)\}\}/g, (...args) => {
			new Watcher(vm, args[1], () => {
				// 此时，在data中改属性已经更新，同时，此处的更新需要更新整个内容，不能单独更新某个属性
				fn(node, this.getContent(expr, vm))
			})
			return this.getVal(args[1], vm)
		})
		fn(node, content)
	},
	uploadVlue: {
		uploadModel(node, val) {
			console.log('node', node, val)
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

/**
 * vm: 实例
 * expr: 被观察的表达式
 * cd: 更新后的回调函数
 */
class Watcher {
	constructor(vm, expr, cb) {
		this.vm = vm
		this.expr = expr
		this.cb = cb
		// 存放一个旧的值
		this.oldValue = this.getVal()
	}
	// 获取一个旧的值
	getVal() {
		Dep.target = this
		return directiveUtil.getVal(this.expr, this.vm)
	}
	// 更新方法
	update() {
		let newVal = directiveUtil.getVal(this.expr, this.vm)
		if (newVal != this.oldValue) {
			this.cb(newVal)
		}
	}
}

class Dep {
	constructor() {
		// 存放所有的watcher
		this.subs = []
	}
	addSub(watcher) {
		this.subs.push(watcher)
	}
	notify() {
		this.subs.forEach(sub => {
			sub.update()
		})
	}
}