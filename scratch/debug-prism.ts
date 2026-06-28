// Quick browser test: check if Prism languages are loading
// Run this in the browser console to debug
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'

console.log('Prism languages available:', Object.keys(Prism.languages))

const test = `function hello() {
  console.log("world")
}`

const result = Prism.highlight(test, Prism.languages.javascript, 'javascript')
console.log('Highlighted HTML:', result)
