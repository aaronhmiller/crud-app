const { test, afterEach, mock } = require('node:test')
const assert = require('node:assert')
const fs = require('fs')
const path = require('path')
const Pool = require('pg').Pool
const api = require('../apis')

const stubQuery = (error, results) => {
  const calls = []
  mock.method(Pool.prototype, 'query', (sql, callback) => {
    calls.push(sql)
    callback(error, results)
  })
  return calls
}

const stubRes = () => {
  const res = {
    code: null,
    body: null,
    status (code) {
      res.code = code
      return res
    },
    send (body) {
      res.body = body
      return res
    }
  }
  return res
}

afterEach(() => {
  mock.restoreAll()
})

test('deleteAllUsers answers 200 with the count', () => {
  stubQuery(null, { rowCount: 3 })
  const res = stubRes()
  api.deleteAllUsers({}, res)
  assert.strictEqual(res.code, 200)
  assert.strictEqual(res.body, 'Deleted 3 users.')
})

test('deleteAllUsers answers 404 when no users exist', () => {
  stubQuery(null, { rowCount: 0 })
  const res = stubRes()
  api.deleteAllUsers({}, res)
  assert.strictEqual(res.code, 404)
  assert.strictEqual(res.body, 'No users exist.')
})

test('deleteAllUsers answers 500 on a query error without throwing', () => {
  stubQuery(new Error('secret detail'), undefined)
  const res = stubRes()
  assert.doesNotThrow(() => api.deleteAllUsers({}, res))
  assert.strictEqual(res.code, 500)
  assert.strictEqual(res.body, 'Users could not be deleted.')
})

test('deleteAllUsers runs exactly DELETE FROM users', () => {
  const calls = stubQuery(null, { rowCount: 1 })
  api.deleteAllUsers({}, stubRes())
  assert.deepStrictEqual(calls, ['DELETE FROM users'])
})

test('app.js registers DELETE /users', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8')
  assert.ok(src.includes("app.delete('/users', api.deleteAllUsers)"))
})

test('resetUsers answers 200 with the seed message', () => {
  stubQuery(null, [])
  const res = stubRes()
  api.resetUsers({}, res)
  assert.strictEqual(res.code, 200)
  assert.strictEqual(res.body, 'Users reset to 3 seed users.')
})

test('resetUsers answers 500 on a query error without throwing', () => {
  stubQuery(new Error('secret detail'), undefined)
  const res = stubRes()
  assert.doesNotThrow(() => api.resetUsers({}, res))
  assert.strictEqual(res.code, 500)
  assert.strictEqual(res.body, 'Users could not be reset.')
})

test('resetUsers runs one query with RESTART IDENTITY and every init.sql seed row', () => {
  const init = fs.readFileSync(path.join(__dirname, '..', 'init.sql'), 'utf8')
  const pairs = init.match(/\('[^']*', '[^']*'\)/g)
  assert.strictEqual(pairs.length, 3)
  const calls = stubQuery(null, [])
  api.resetUsers({}, stubRes())
  assert.strictEqual(calls.length, 1)
  assert.ok(calls[0].includes('RESTART IDENTITY'))
  for (const pair of pairs) {
    assert.ok(calls[0].includes(pair), pair)
  }
})

test('app.js registers POST /users/reset', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8')
  assert.ok(src.includes("app.post('/users/reset', api.resetUsers)"))
})
