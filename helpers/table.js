var hbs = require('handlebars')
var yaml = require('js-yaml')
var listToTable = require('./_list-to-table')

function autoGuessColumns(list) {
  try {
    return Object.keys(list[0])
  } catch (err) {
    // it's okay for keyval mode
    return []
  }
}

var apiHeaderLookup = function(name) {
  var map = {
    arg: 'argument',
    typ: 'type',
    opt: 'optional',
    def: 'default',
    des: 'description',
    desc: 'description'
  }
  return map[name] || name
}

module.exports = function(options) {
  var innerText = options.fn(this)
  var object = yaml.safeLoad(innerText)
  var params = options.hash
  if (object.list == null) {
    object.list = object
  }
  if (object.meta == null) {
    object.meta = {}
  }
  var columns = object.columns || autoGuessColumns(object.list)
  var list = object.list
  if (params.mode === 'api') {
    if (object.meta.options == null) {
      object.meta.options = {}
    }
    object.meta.options.header = columns.map(function(headerName) {
      return apiHeaderLookup(headerName)
    })
  } else if (params.mode === 'keyval') {
    list = listToTable.transformKeyVal(object.list)
    columns = ['key', 'value']
  } else if (params.mode === 'pipe' ) {
    list = listToTable.transformPipeLines(object.list, columns)
  }
  var html = listToTable(object.meta.title, list, columns, object.meta.options).trim() + '\n'
  return new hbs.SafeString(html)
}
