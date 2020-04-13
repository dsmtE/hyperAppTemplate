import { h } from 'hyperapp'
import TodoItem from './TodoItem'

export default (props) =>
  h('div', { class: 'todo-list__root' }, [
    h('ul', {},
      // eslint-disable-next-line fp/no-mutating-methods
      props.items
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(item => h('li', {}, [
          TodoItem({
            done: item.done,
            text: item.text,
            createdAt: item.createdAt,
            onToggleDone: props.onToggleDone(item.id)
          })
        ]))
    )
  ])
