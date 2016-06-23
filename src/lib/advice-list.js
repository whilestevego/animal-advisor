export default [
  // TODO: The following is the beginning of a custom meme builder. Finish it!
  /*
  {
    // Match custom 'x|y|z' advice first or it may matched by another pattern.
    pattern: /^(?:(https?:\/\/[^|\s]+\.(?:jpe?g|gif|png)[^|\s]*)|([^|]+))\s*\|\s*([^|]*)\s*\|\s*([^|]*)/i,
    help: '{image url or search} | {top text} | {bottom text}',
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
    name: '"Y U NO" Guy',
    pattern: /^(y u no) (.*)/i,
    help: 'y u no {text}',
    url: 'NryNmg'
  }, {
    name: 'Ancient Aliens',
    pattern: /^aliens? guy (.+)/i,
    help: 'aliens guy {text}',
    url: 'sO-Hng',
    caption (matches) { return {top: '', bottom: matches[1]} }
  }, {
    name: 'Imminent Ned',
    pattern: /^((?:prepare|brace) (?:yourself|yourselves)) (.+)/i,
    help: 'brace yourself {text}',
    url: '_I74XA'
  }, {
    name: 'X all the Y',
    pattern: /^(.*) (all the .*)/i,
    help: '{text} all the {things}',
    url: 'Dv99KQ'
  }, {
    name: 'The Most Interesting Man in the World',
    pattern: /^(i don'?t (?:always|normally) .*) (but when i do,? .*)/i,
    help: 'I don\'t always {something} but when I do {text}',
    url: 'V8QnRQ'
  }, {
    name: 'The Rent is Too Damn High / Jimmy MacMillan',
    pattern: /^(.*) (\w+\stoo damn .*)/i,
    help: '{text} too damn {something}',
    url: 'RCkv6Q'
  }, {
    name: 'Futurama Fry / Not Sure If',
    pattern: /^(not sure if .*) (or .*)/i,
    help: 'not sure if {something} or {something else}',
    url: 'CsNF8w'
  }, {
    name: 'Xzibit Yo Dawg',
    pattern: /^(yo dawg,? .*) (so .*)/i,
    help: 'yo dawg {text} so {text}',
    url: 'Yqk_kg'
  }, {
    name: 'All your Base Are Belong to Us',
    pattern: /^(all your .*) (are belong to .*)/i,
    help: 'all your {text} are belong to {text}',
    url: '76CAvA'
  }, {
    name: 'One Does Not Simply Walk into Mordor',
    pattern: /^(one does not simply) (.*)/i,
    help: 'One does not simply {text}',
    url: 'da2i4A'
  }, {
    name: 'Super Cool Ski Instructor',
    pattern: /^(if you .*\s)(.* gonna have a bad time)/i,
    help: 'if you {text} gonna have a bad time',
    url: 'lfSVJw'
  }, {
    name: 'Philosoraptor',
    pattern: /^(if .*), ((?:are|can|do|does|how|is|may|might|should|then|what|when|where|which|who|why|will|won't|would) .*)/i,
    help: 'if {text}, {word that can start a question} {text}?',
    url: '-kFVmQ'
  }, {
    name: 'Annoyed Picard',
    pattern: /^((?:how|what|when|where|who|why) the (?:hell|heck|fuck|shit|crap|damn)) (.*)/i,
    help: '{word that can start a question} the {expletive} {text}',
    url: 'z8IPtw'
  }, {
    name: 'Success Kid / I Hate Sandcastles',
    pattern: /^(?:success|nailed it) when (.*) then (.*)/i,
    help: 'success when {text} then {text}',
    url: 'AbNPRQ'
  }, {
    name: 'First World Problems',
    pattern: /^(?:fwp|cry) when (.*) then (.*)/i,
    help: 'cry when {text} then {text}',
    url: 'QZZvlg'
  }, {
    name: 'Bad Luck Brian',
    pattern: /^bad luck when (.*) then (.*)/i,
    help: 'bad luck when {text} then {text}',
    url: 'zl3tgg'
  }, {
    name: 'Scumbag Steve',
    pattern: /^scumbag(?: steve)? (.*) then (.*)/i,
    help: 'scumbag {text} then {text}',
    url: 'RieD4g'
  }, {
    name: 'Matrix Morpheus',
    pattern: /^(what if i told you) (.+)/i,
    help: 'what if I told you {text}',
    url: 'fWle1w'
  }, {
    name: 'Grumpy Cat',
    pattern: /^grumpy cat (.*) then (.*)/i,
    help: 'I hate {text}',
    url: '_k6JVg'
  }, {
    name: 'Limes Guy / Why Can\'t I Hold All These Limes?',
    pattern: /^(why can'?t (?:i|we|you|he|she|it|they)) (.+)/i,
    help: 'why can\'t {personal pronoun} {text}',
    url: 'gdNXmQ'
  }, {
    name: 'So I Got That Goin\' For Me, Which is Nice',
    pattern: /^(.+),? (so i(?:(?:(?:'?ve)? got)|(?: have)) that going for me(?:,? which is nice)?)/i,
    help: '{text} so I got that going for me',
    url: 'h9ct5g',
    caption (matches) {
      let bottomText = matches[2]
      if (!/\bwhich is nice$/.test(bottomText)) {
        bottomText += ', which is nice'
      }
      return {top: matches[1], bottom: bottomText}
    }
  }, {
    name: 'Fucking Magnets, How Do They Work?',
    pattern: /^(.+),? (how (?:do (?:they|I)|does (?:he|she|it)) work\??)/i,
    help: '{things}, how do they work?',
    url: '3V6rYA'
  }, {
    name: 'KHAN!',
    pattern: /^(.+?(?:a{3,}|e{3,}|i{3,}|o{3,}|u{3,}|y{3,}).*)/i,
    help: '{text}{3 x a|e|i|o|u|y}{text}',
    url: 'L50mqA'
  }, {
    name: 'Do You Want Ants?',
    pattern: /^(do you want .*) (because that'?s how .*)/i,
    help: 'do you want {text} because that\'s how {text}',
    url: 'bxgxOg'
  }, {
    name: 'I Should Buy a Boat Cat',
    pattern: /^(i should .*)/i,
    help: 'i should {text}',
    url: 'LPTw8A',
    caption (matches) { return {top: '', bottom: matches[1]} }
  }
]
