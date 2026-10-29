const { test } = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const read = (file) => fs.readFileSync(path.join(__dirname, '..', 'public', file), 'utf8')
const html = read('index.html')
const css = read('style.css')
const js = read('ui.js')

test('page files load nothing external', () => {
  for (const text of [html, css, js]) {
    assert.ok(!/https?:\/\//.test(text))
  }
  const refs = [...html.matchAll(/(?:src|href)="([^"]*)"/g)].map((m) => m[1])
  assert.ok(refs.length > 0)
  for (const ref of refs) {
    assert.ok(!/^([a-z]+:)?\/\//i.test(ref), ref)
  }
})

test('ui.js calls each endpoint with its method', () => {
  assert.ok(js.includes('fetch('))
  assert.ok(js.includes("'/users'"))
  assert.ok(js.includes("'/users/'"))
  for (const method of ['GET', 'POST', 'PUT', 'DELETE']) {
    assert.ok(js.includes(`'${method}'`), method)
  }
})

test('ui.js avoids HTML injection sinks', () => {
  for (const banned of ['innerHTML', 'outerHTML', 'insertAdjacentHTML', 'document.write', 'eval(', 'new Function']) {
    assert.ok(!js.includes(banned), banned)
  }
})

test('index.html references ui.js and style.css', () => {
  assert.ok(html.includes('src="ui.js"'))
  assert.ok(html.includes('href="style.css"'))
})

test('delete all users section asks for confirmation before sending', () => {
  assert.ok(html.includes('id="delete-all-form"'))
  assert.ok(html.includes('id="delete-all-out"'))
  assert.ok(js.includes("wire('delete-all'"))
  assert.ok(js.includes('confirm('))
  assert.ok(js.includes("send(out, 'DELETE', '/users')"))
})

test('reset section asks for confirmation before sending', () => {
  assert.ok(html.includes('id="reset-form"'))
  assert.ok(html.includes('id="reset-out"'))
  assert.ok(js.includes("wire('reset'"))
  assert.ok(js.includes('confirm('))
  assert.ok(js.includes("send(out, 'POST', '/users/reset')"))
})
