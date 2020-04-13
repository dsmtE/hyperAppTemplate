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
                    }
                })
                // si une fonction de callback est passé en parametre de mes props alors je l'exécute
                if(props.callBack !== undefined) { props.callBack(c) }
            },
            onChange: (element) => {console.log(element)},

            width: props.width,
            height: props.height,
            style: 'background-color: #fff;'
        })
    ])
