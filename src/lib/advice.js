'use strict'

const _ = require('lodash')

class Advice {
  constructor (options) {
    _.merge(this, options)

    if (!_.isFunction(this.caption)) {
      this.caption = defaultCaption.bind(this)
    }
  }

  static find (sentence) {
    // TODO: Create ArgumentError class for this case
    if (!sentence) throw new Error('Missing argument sentence')

    sentence = sentence.trim()
    const advice = _.find(
      definitionList,
      advice => advice.pattern.test(sentence)
    )

    if (_.isUndefined(advice)) {
      throw new Error('Meme could not be found')
    }

    return new Advice(_.merge({sentence}, advice))
  }

  get matches () {
    if (this._matches) return this._matches

    const {sentence, pattern} = this
    this._matches = pattern.exec(sentence)

    return this._matches
  }

  get topCaption () {
    return this.caption(this.matches).top
  }

  get bottomCaption () {
    return this.caption(this.matches).bottom
  }

  toMemeCaptainParams () {
    return [this.url, this.topCaption, this.bottomCaption]
  }
}

function defaultCaption (matches) {
  return {top: matches[1], bottom: matches[2]}
}

const definitionList = [
  // TODO: The following is the beginning of a custom meme builder. Finish it!
  /*
  {
    // Match custom 'x|y|z' advice first or it may matched by another pattern.
    pattern: /^(?:(https?:\/\/[^|\s]+\.(?:jpe?g|gif|png)[^|\s]*)|([^|]+))\s*\|\s*([^|]*)\s*\|\s*([^|]*)/i,
    help: '<b>{image url or search}</b> | <b>{top text}</b> | <b>{bottom text}</b>',
    run (callback) {
      if (this.topText) {
        return callback(matches[1], this.$3, this.$4)
      } else {
        let image = images.search({
          query: matches[2],
          first: true
        })
        if (image) {
          return callback(image.unescapedUrl, this.$3, this.$4)
        } else {
          return 'Sorry, your search didn\'t yield any usable images'
        }
      }
    }
  },
  */
  {
    pattern: /^(y u no) (.*)/i,
    help: 'y u no <b>{text}</b>',
    url: 'NryNmg'
  }, {
    pattern: /^aliens? guy (.+)/i,
    help: 'aliens guy <b>{text}</b>',
    url: 'sO-Hng',
    caption (matches) { return {top: '', bottom: matches[1]} }
  }, {
    pattern: /^((?:prepare|brace) (?:yourself|yourselves)) (.+)/i,
    help: 'brace yourself <b>{text}</b>',
    url: '_I74XA'
  }, {
    pattern: /^(.*) (all the .*)/i,
    help: '<b>{text}</b> all the <b>{things}</b>',
    url: 'Dv99KQ'
  }, {
    pattern: /^(i don'?t (?:always|normally) .*) (but when i do,? .*)/i,
    help: 'I don\'t always <b>{something}</b> but when I do <b>{text}</b>',
    url: 'V8QnRQ'
  }, {
    pattern: /^(.*) (\w+\stoo damn .*)/i,
    help: '<b>{text}</b> too damn <b>{something}</b>',
    url: 'RCkv6Q'
  }, {
    pattern: /^(not sure if .*) (or .*)/i,
    help: 'not sure if <b>{something}</b> or <b>{something else}</b>',
    url: 'CsNF8w'
  }, {
    pattern: /^(yo dawg,? .*) (so .*)/i,
    help: 'yo dawg <b>{text}</b> so <b>{text}</b>',
    url: 'Yqk_kg'
  }, {
    pattern: /^(all your .*) (are belong to .*)/i,
    help: 'all your <b>{text}</b> are belong to <b>{text}</b>',
    url: '76CAvA'
  }, {
    pattern: /^(one does not simply) (.*)/i,
    help: 'one does not simply <b>{text}</b>',
    url: 'da2i4A'
  }, {
    pattern: /^(if you .*\s)(.* gonna have a bad time)/i,
    help: 'if you <b>{text}</b> gonna have a bad time',
    url: 'lfSVJw'
  }, {
    pattern: /^(if .*), ((?:are|can|do|does|how|is|may|might|should|then|what|when|where|which|who|why|will|won't|would) .*)/i,
    help: 'if <b>{text}</b>, <b>{word that can start a question}</b> <b>{text}</b>?',
    url: '-kFVmQ'
  }, {
    pattern: /^((?:how|what|when|where|who|why) the (?:hell|heck|fuck|shit|crap|damn)) (.*)/i,
    help: '<b>{word that can start a question}</b> the <b>{expletive}</b> <b>{text}</b>',
    url: 'z8IPtw'
  }, {
    pattern: /^(?:success|nailed it) when (.*) then (.*)/i,
    help: 'success when <b>{text}</b> then <b>{text}</b>',
    url: 'AbNPRQ'
  }, {
    pattern: /^(?:fwp|cry) when (.*) then (.*)/i,
    help: 'cry when <b>{text}</b> then <b>{text}</b>',
    url: 'QZZvlg'
  }, {
    pattern: /^bad luck when (.*) then (.*)/i,
    help: 'bad luck when <b>{text}</b> then <b>{text}</b>',
    url: 'zl3tgg'
  }, {
    pattern: /^scumbag(?: steve)? (.*) then (.*)/i,
    help: 'scumbag <b>{text}</b> then <b>{text}</b>',
    url: 'RieD4g'
  }, {
    pattern: /^(what if i told you) (.+)/i,
    help: 'what if I told you <b>{text}</b>',
    url: 'fWle1w'
  }, {
    pattern: /^(i hate) (.+)/i,
    help: 'I hate <b>{text}</b>',
    url: '_k6JVg'
  }, {
    pattern: /^(why can'?t (?:i|we|you|he|she|it|they)) (.+)/i,
    help: 'why can\'t <b>{personal pronoun}</b> <b>{text}</b>',
    url: 'gdNXmQ'
  }, {
    pattern: /^(.+),? (so i(?:(?:(?:'?ve)? got)|(?: have)) that going for me(?:,? which is nice)?)/i,
    help: '<b>{text}</b> so I got that going for me',
    url: 'h9ct5g',
    caption (matches) {
      let bottomText = matches[2]
      if (!/\bwhich is nice$/.test(bottomText)) {
        bottomText += ', which is nice'
      }
      return {top: matches[1], bottom: bottomText}
    }
  }, {
    pattern: /^(.+),? (how (?:do (?:they|I)|does (?:he|she|it)) work\??)/i,
    help: '<b>{things}</b>, how do they work?',
    url: '3V6rYA'
  }, {
    pattern: /^(.+?(?:a{3,}|e{3,}|i{3,}|o{3,}|u{3,}|y{3,}).*)/i,
    help: '{text}<b>{3 x a|e|i|o|u|y}</b>{text}',
    url: 'L50mqA'
  }, {
    pattern: /^(do you want .*) (because that'?s how .*)/i,
    help: 'do you want <b>{text}</b> because that\'?s how <b>{text}</b>',
    url: 'bxgxOg'
  }, {
    pattern: /^(i should .*)/i,
    help: 'i should <b>{text}</b>',
    url: 'LPTw8A',
    caption (matches) { return {top: '', bottom: matches[1]} }
  }
]

module.exports = Advice
