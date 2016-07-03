// # Asset helper
// Usage: `{{asset "css/screen.css"}}`, `{{asset "css/screen.css"}}`
//
// Returns the path to the specified asset.

function asset(path, options) {
    return  '/assets/' + path;
}

module.exports = asset;
