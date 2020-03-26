/**
 * type: 元素类型
 */
function createElement(type, props = {}, ...children) {
	console.log(type)
	let key
	if (props.key) {
		key = props.key
		delete props.key
	}
	children = children.map(child => {
		if (typeof child === 'string') {
			return vnode(undefined, undefined, undefined, undefined, child)
		} else {
			return child
		}
	})
	return vnode(type, props, key, children)
}

function vnode(type, props, key, children, text) {
	return {
		type,
		props,
		key,
		children,
		text
	}
}



/**
 * 渲染函数
 * vnode: 
 */
function render(vnode, continer) {
	let ele = createDomElement(vnode)
	continer.appendChild(ele)
}

function createDomElement(vnode) {
	let {type, props, key, children, text} = vnode
	if (type) { // type存在，表示这个vnode是一个元素节点
		vnode.domElement = document.createElement(type)
		updateProps(vnode)
		children.forEach(child => {
			render(child, vnode.domElement)
		})
	} else { // type不存在，表示这个vnode是一个文本节点
		vnode.domElement = document.createTextNode(text)
		// console.log('text', type, document.createTextNode(text))
	}
	return vnode.domElement
}


function updateProps(vnode, oldProps={}) {
	let domElement = vnode.domElement
	let newProps = vnode.props
	// 旧的vnode中存在属性，但是新的vnode里不存在，说明该属性被删除
	for (let prop in oldProps) {
		if (!newProps[prop]) {
			domElement.removeArrribute(prop)
		}
	}

	let oldStyle = oldProps['style'] || {}
	let newStyle = newProps['style'] || {}
	for (let style in oldStyle) {
		if (!newStyle[style]) {
			domElement.style[style] = ''
		}
	}


	// 新的vnode中存在属性，但是旧的vnode里不存在，说明该属性是新增的
	for (let prop in newProps) {
		if (!oldProps[prop]) {
			if (prop === 'style') { // 当前属性是style
				let styleObj = newProps[prop]
				for (let style in styleObj) {
					domElement.style[style] = styleObj[style]
				}
				console.log('styleObj', styleObj)
			} else {
				domElement.setAttribute(prop, newProps[prop])
			}
		}
	}
}