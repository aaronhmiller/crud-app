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
