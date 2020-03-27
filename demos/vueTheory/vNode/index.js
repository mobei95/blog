function createElement(tag, props, children) {
  let key
  if (props.key) {
      key = props.key
      delete props.key
  }
  return new Element(tag, props, key, children)
}

function createTextVnode(str) {
  return new Element(undefined, undefined, undefined, undefined, str)
}

class Element {
  constructor(tag, props, key, children, text) {
      this.tag = tag
      this.props = props
      this.key = key
      this.children = children
      this.text = text
  }
}



function render(vNode, container) {
        let ele = createElementDom(vNode)
        container.appendChild(ele)
     }
     
     // 使用vNode创建真实DOM，并返回这个DOM
     function createElementDom(vNode) {
        let { tag, props, key, children, text } = vNode
        if (tag) {
            vNode.domElement = document.createElement(tag)
            updateProps(vNode)
            children.forEach(child => {
                render(child, vNode.domElement)
            })
        } else {
            vNode.domElement = document.createTextNode(text)
        }
        return vNode.domElement
     }
     
     // 更新DOM属性
     function updateProps(vNode) {
        let { props, domElement } = vNode
        for (let key in props) {
            setDomAttribute(domElement, key, props[key])
        }
     }
     
     // 设置DOM属性
     function setDomAttribute(element, key, value) {
        switch(key) {
            case 'style':
                for (let style in value) {
                    element.style[style] = value[style]
                }
                break;
            default:
                element.setAttribute(key, value)
        }
     }