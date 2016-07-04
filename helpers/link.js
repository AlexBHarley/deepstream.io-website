// # Link helper
// Usage: `{{list "css/screen.css"}}`
//
// Returns the relative path to an asset

function link(path, options) {
  return '/' + path;
}

module.exports = link;
