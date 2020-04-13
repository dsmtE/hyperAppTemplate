import { h } from 'hyperapp'
// import Plotly from 'plotly.js-dist'
import Chart from 'chart.js'

// basic componant with props
export default (props) =>
    h('div', {}, [
        h('canvas', {
            oncreate: (element) => {
                const ctx = element.getContext('2d')
                const c = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: props.labels,
                        datasets: [{
                            label: props.title || 'default title',
                            data: props.data
                        }]
                    },
                    responsive: true
                })
                c.canvas.style.height = props.height + 'px'
                c.canvas.style.width = props.width + 'px'
                // si une fonction de callback est passé en parametre de mes props alors je l'exécute
                if(props.callBack !== undefined) { props.callBack(c) }
            },
            style: 'background-color: #fff;'
        })
    ])
