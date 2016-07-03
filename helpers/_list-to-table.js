var marked = require('marked')

module.exports = function tableTemplate(title, rows, columns, options) {
  if (options == null) {
    options = {}
  }
  var t = (text) => text
  if (options.transform === 'md') {
    t = marked
  }
  var titleTag = options.titleTag || 'h5'
  return `<div class="apidoc-table-container">
      <${titleTag} class="api-doc-title ${options.titleClassName || ''}">${title || ''}</${titleTag}>
      <table class="api-doc-table ${options.className || ''}">
          <thead>
              ${options.header != null ?
                options.header.map(name => '<th>' + t(name) + '</th>').join('\n') : ''
              }
          </thead>
          <tbody>
              ${rows.map(row => {
                return '<tr>' +
                  columns.map(column => '<td>' + t(row[column]) + '</td>').join('\n') +
                '</tr>'
              }).join('\n')}
          </tbody>
      </table>
</div>`
}

module.exports.transformPipeLines = function(input, columns) {
  var result = []
  if (input instanceof Array) {
    for (var i = 0; i < input.length; i++) {
      var row = input[i];
      var values = row.split('|')
      var tmp = {}
      for (var j = 0; j < columns.length; j++) {
        tmp[columns[j]] = values[j].trim()
      }
      result.push(tmp)
    }
    return result
  } else {
    throw new Error('data type not supportd for keyval format: ' + input)
  }
}

module.exports.transformKeyVal = function(input) {
  var result = []
  if (input instanceof Array) {
    for (var i = 0; i < input.length; i++) {
      var object = input[i];
      var name = Object.keys(object)[0]
      result.push({
        key: name,
        value: object[name]
      })
    }
    return result
  } else if (input instanceof Object) {
    var keys = Object.keys(Object.assign({}, input))
      .filter(function(name) {
        return ['list', 'meta'].indexOf(name) === -1
      })
    return keys.map(function(name) {
      return {
        key: name,
        value: input[name]
      }
    })

  } else {
    throw new Error('data type not supportd for keyval format: ' + input)
  }
}
