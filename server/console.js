const { isFunction } = require('util')

// override console.*
for (const key in console) {
  const value = console[key]
  if (isFunction(value)) {
    console[key] = value.bind(console) // bind
  }
}
