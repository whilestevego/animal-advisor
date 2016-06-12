'use strict'

const MemeDefinitions = [
  // {
  //   // Match custom 'x|y|z' meme first or it may get matched by another pattern.
  //   pattern: /^(?:(https?:\/\/[^|\s]+\.(?:jpe?g|gif|png)[^|\s]*)|([^|]+))\s*\|\s*([^|]*)\s*\|\s*([^|]*)/i,
  //   help: '<b>{image url or search}</b> | <b>{top text}</b> | <b>{bottom text}</b>',
  //   run (callback) {
  //     if (this.$1) {
  //       return callback(this.$1, this.$3, this.$4)
  //     } else {
  //       let image = images.search({
  //         query: this.$2,
  //         first: true
  //       })
  //       if (image) {
  //         return callback(image.unescapedUrl, this.$3, this.$4)
  //       } else {
  //         //TODO Return as resolved promise error
  //         return 'Sorry, your search didn\'t yield any usable images'
  //       }
  //     }
  //   }
  // },
  {
    pattern: /^(y u no) (.*)/i,
    help: 'y u no <b>{text}</b>',
    url: 'NryNmg',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^aliens? guy (.+)/i,
    help: 'aliens guy <b>{text}</b>',
    url: 'sO-Hng',
    run (callback) { return callback(this.url, '', this.$1) }
  }, {
    pattern: /^((?:prepare|brace) (?:yourself|yourselves)) (.+)/i,
    help: 'brace yourself <b>{text}</b>',
    url: '_I74XA',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(.*) (all the .*)/i,
    help: '<b>{text}</b> all the <b>{things}</b>',
    url: 'Dv99KQ',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(i don'?t (?:always|normally) .*) (but when i do,? .*)/i,
    help: 'I don\'t always <b>{something}</b> but when I do <b>{text}</b>',
    url: 'V8QnRQ',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(.*) (\w+\stoo damn .*)/i,
    help: '<b>{text}</b> too damn <b>{something}</b>',
    url: 'RCkv6Q',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(not sure if .*) (or .*)/i,
    help: 'not sure if <b>{something}</b> or <b>{something else}</b>',
    url: 'CsNF8w',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(yo dawg,? .*) (so .*)/i,
    help: 'yo dawg <b>{text}</b> so <b>{text}</b>',
    url: 'Yqk_kg',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(all your .*) (are belong to .*)/i,
    help: 'all your <b>{text}</b> are belong to <b>{text}</b>',
    url: '76CAvA',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(one does not simply) (.*)/i,
    help: 'one does not simply <b>{text}</b>',
    url: 'da2i4A',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(if you .*\s)(.* gonna have a bad time)/i,
    help: 'if you <b>{text}</b> gonna have a bad time',
    url: 'lfSVJw',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(if .*), ((?:are|can|do|does|how|is|may|might|should|then|what|when|where|which|who|why|will|won't|would) .*)/i,
    help: 'if <b>{text}</b>, <b>{word that can start a question}</b> <b>{text}</b>?',
    url: '-kFVmQ',
    run (callback) {
      return callback(this.url, this.$1, this.$2)
    }
  }, {
    pattern: /^((?:how|what|when|where|who|why) the (?:hell|heck|fuck|shit|crap|damn)) (.*)/i,
    help: '<b>{word that can start a question}</b> the <b>{expletive}</b> <b>{text}</b>',
    url: 'z8IPtw',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(?:success|nailed it) when (.*) then (.*)/i,
    help: 'success when <b>{text}</b> then <b>{text}</b>',
    url: 'AbNPRQ',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(?:fwp|cry) when (.*) then (.*)/i,
    help: 'cry when <b>{text}</b> then <b>{text}</b>',
    url: 'QZZvlg',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^bad luck when (.*) then (.*)/i,
    help: 'bad luck when <b>{text}</b> then <b>{text}</b>',
    url: 'zl3tgg',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^scumbag(?: steve)? (.*) then (.*)/i,
    help: 'scumbag <b>{text}</b> then <b>{text}</b>',
    url: 'RieD4g',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(what if i told you) (.+)/i,
    help: 'what if I told you <b>{text}</b>',
    url: 'fWle1w',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(i hate) (.+)/i,
    help: 'I hate <b>{text}</b>',
    url: '_k6JVg',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(why can'?t (?:i|we|you|he|she|it|they)) (.+)/i,
    help: 'why can\'t <b>{personal pronoun}</b> <b>{text}</b>',
    url: 'gdNXmQ',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(.+),? (so i(?:(?:(?:'?ve)? got)|(?: have)) that going for me(?:,? which is nice)?)/i,
    help: '<b>{text}</b> so I got that going for me',
    url: 'h9ct5g',
    run (callback) {
      let text2 = this.$2
      if (!/\bwhich is nice$/.test(text2)) {
        text2 += ', which is nice'
      }
      return callback(this.url, this.$1, text2)
    }
  }, {
    pattern: /^(.+),? (how (?:do (?:they|I)|does (?:he|she|it)) work\??)/i,
    help: '<b>{things}</b>, how do they work?',
    url: '3V6rYA',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(.+?(?:a{3,}|e{3,}|i{3,}|o{3,}|u{3,}|y{3,}).*)/i,
    help: '{text}<b>{3 x a|e|i|o|u|y}</b>{text}',
    url: 'L50mqA',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(do you want .*) (because that'?s how .*)/i,
    help: 'do you want <b>{text}</b> because that\'?s how <b>{text}</b>',
    url: 'bxgxOg',
    run (callback) { return callback(this.url, this.$1, this.$2) }
  }, {
    pattern: /^(i should .*)/i,
    help: 'i should <b>{text}</b>',
    url: 'LPTw8A',
    run (callback) { return callback(this.url, '', this.$1) }
  }
]

module.exports = MemeDefinitions
