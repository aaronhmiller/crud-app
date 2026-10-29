/* eslint-env browser */

const show = (out, text) => {
  out.textContent = text
}

const send = async (out, method, path, body) => {
  const options = { method }
  if (body !== undefined) {
    options.headers = { 'Content-Type': 'application/json' }
    options.body = JSON.stringify(body)
  }
  try {
    const res = await fetch(path, options)
    const text = await res.text()
    let shown = text
    try {
      shown = JSON.stringify(JSON.parse(text), null, 2)
    } catch (e) {
      // not JSON: show the text as returned
    }
    show(out, `${method} ${path}\nStatus: ${res.status}\n\n${shown}`)
  } catch (e) {
    show(out, 'Request failed: could not reach the API.')
  }
}

const wire = (name, handler) => {
  document.getElementById(name + '-form').addEventListener('submit', (event) => {
    event.preventDefault()
    handler(document.getElementById(name + '-out'))
  })
}

const value = (id) => document.getElementById(id).value

const userPath = (id) => '/users/' + encodeURIComponent(value(id))

const nameAndEmail = (prefix) => {
  const body = {}
  if (value(prefix + '-name')) body.name = value(prefix + '-name')
  if (value(prefix + '-email')) body.email = value(prefix + '-email')
  return body
}

wire('list', (out) => send(out, 'GET', '/users'))
wire('get', (out) => send(out, 'GET', userPath('get-id')))
wire('create', (out) => send(out, 'POST', '/users', {
  name: value('create-name'),
  email: value('create-email')
}))
wire('update', (out) => send(out, 'PUT', userPath('update-id'), nameAndEmail('update')))
wire('delete', (out) => send(out, 'DELETE', userPath('delete-id')))
wire('delete-all', (out) => {
  if (!confirm('Delete every user? This cannot be undone.')) {
    show(out, 'Cancelled: no request sent.')
    return
  }
  return send(out, 'DELETE', '/users')
})
wire('reset', (out) => {
  if (!confirm('Replace every user with the 3 seed users? This discards all changes.')) {
    show(out, 'Cancelled: no request sent.')
    return
  }
  return send(out, 'POST', '/users/reset')
})
