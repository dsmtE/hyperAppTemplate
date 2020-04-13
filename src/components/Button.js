import { h } from 'hyperapp'

// basic componant with props
export default (props) =>
    h('button', { onclick: props.onClick }, props.text)
