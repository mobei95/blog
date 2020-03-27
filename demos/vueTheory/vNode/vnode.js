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
