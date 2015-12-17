var fs = require('fs')
var dedupe = require('dedupe')

module.exports = function (vorpal, options) {
  var HOME = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME']
  var filepath = typeof options == 'string' ? options : HOME + '/.vorpal_history'

  vorpal.on('client_prompt_submit', function (data) {
    var line = data.trim()
    if (line && history.indexOf(line) == -1) {
      fs.appendFile(filepath, data + '\n')
      history.unshift(data.trim())
    }
  })

  vorpal.on('keypress', function (data) {
    if (data.key == 'up') {
      levels[navlevel] = data.value
      var prompt = history[navlevel]
      navlevel += 1
      vorpal.ui.input(prompt)
    } else if (data.key == 'down' && navlevel > 0) {
      navlevel -= 1
      var prompt = levels[navlevel]
      setImmediate(function () { vorpal.ui.input(prompt) })
    } else {
      navlevel = 0
    }
  })

  fs.readFile(filepath, 'utf-8', function (err, data) {
    if (!err && data.trim()) {
      data.split('\n').forEach(function (line) {
        if (line) {
          history.push(line.trim())
        }
      })
      history = dedupe(history).reverse()
    }
  })
}

var navlevel = 0
var levels = {}
var history = []
