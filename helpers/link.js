// # Link helper
// Usage: `{{link "css/screen.css"}}`
//
// Returns the relative path to an asset

function link(path, options) {
  return '/' + path;
}

module.exports = link;
