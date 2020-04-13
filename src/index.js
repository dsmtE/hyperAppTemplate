import { app } from 'hyperapp'
import { withLogger } from '@hyperapp/logger'

import state from './state/index'
import view from './views/MainView.js'
import actions from './actions'

import './css/main.scss' // load scss but you can use also classic css file

withLogger(app)( // start hyperapp
    state,
    actions,
    view,
    document.body
)
console.log('hyperApp started')
