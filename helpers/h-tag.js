var hbs = require('handlebars')

function renderTagElement(text) {
  return `<span class="tag-item">${text}</span>`
}

function wrapper(inner) {
  return `<div class="tag-container">${inner}</div>`
}

module.exports = function(tagObject, options) {
  try {
    if (tagObject instanceof Array) {
      var tags = tagObject.map(tag => tag.name).map(renderTagElement).join('\n')
      return new hbs.SafeString(wrapper(tags))
    } else {
      return new hbs.SafeString(wrapper(renderTagElement(tagObject.name)))
    }
  } catch (error) {
    if (process.__WEBPACK__ || process.browser) {
      return new hbs.SafeString('<div style="color: orange;"><em>{{tag}} n/a in live preview</em></div>')
    }
    throw error
  }

}
