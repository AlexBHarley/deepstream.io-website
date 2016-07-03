var fs = require('fs')
var path = require('path')
var yaml = require('js-yaml')
var hbs = require('handlebars')
var marked = require('marked')
var highlight = require('highlight.js')
var listToTable = require('./_list-to-table')

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value
  },
  langPrefix: 'hljs '
})

function loadFile(name) {
  var fileContent = null
  // NOTE: do NOT use this expression, otherwise webpack cannot resolve the path
  //var filePath = '../docs/' + name

  var extension = path.extname('../docs/' + name)
  switch (extension) {
    case '.js':
      return require('../docs/' + name)
    case '.json':
      if (process.__WEBPACK__ || process.browser) {
        fileContent = require('../docs/' + name)
        return JSON.parse(fileContent)
      } else {
        return require('../docs/' + name)
      }
    case '.yaml':
    case '.yml':
      if (process.__WEBPACK__ || process.browser) {
        fileContent = require('../docs/' + name)
      } else {
        fileContent = fs.readFileSync(path.join(__dirname, '../docs/' + name), 'utf8')
      }
      return yaml.safeLoad(fileContent)
    case '.md':
      if (process.__WEBPACK__ || process.browser) {
        fileContent = require('../docs/' + name)
      } else {
        fileContent = fs.readFileSync(path.join(__dirname, '../docs/' + name), 'utf8')
      }
      return '<div class="apidoc-md-container">' + marked(fileContent) + '</div>'
    default:
      throw new Error('could not load docoumantion file: ' + name)
  }
}

module.exports = function(options) {
  var html = null
  var params = options.hash
  var data = loadFile(params.file)
  data = params.prop != null ? data[params.prop] : data
  if (params.format === 'keyval') {
    html = listToTable(data.meta.title, listToTable.transformKeyVal(data.list), ['key', 'value'])
    return new hbs.SafeString(html)
  } else if (params.format === 'table') {
    html = listToTable(data.meta.title, data.list, data.meta.columns, params)
    return new hbs.SafeString(html)
  } else if (params.format === 'raw') {
    html = `<div class="api-doc-raw-container ${params.className || ''}">
      ${data}
    </div>`
    return new hbs.SafeString(html)
  } else {
    throw new Error('apidoc-format: "' + params.format + '" is not supported')
  }
}
