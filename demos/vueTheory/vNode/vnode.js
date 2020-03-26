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
