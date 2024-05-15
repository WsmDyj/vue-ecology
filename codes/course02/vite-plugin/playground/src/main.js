import './assets/normalize.css'

import { get } from 'lodash-es'

const a = get({a: '1'}, 'a')

console.log(a)