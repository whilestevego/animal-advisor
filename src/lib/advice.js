import _ from 'lodash'
import fuzzysearch from 'fuzzysearch'

import adviceList from './advice-list'

export default class Advice {
  constructor (options) {
    const defaultOptions = adviceList[adviceList.length - 1]

    Object.assign(
      this,
      {sentence: ''},
      defaultOptions,
      options
    )

    if (!_.isFunction(this.caption)) {
      this.caption = defaultCaption.bind(this)
    }
  }

  static find (sentence) {
    // TODO: Create ArgumentError class for this case
    //
    const argType = typeof sentence
    if (argType != 'string') {
      throw new TypeError(`Expected string but received ${argType}`)
    }

    const trimmedSentence = sentence.trim()
    const adviceParams = _.find(
      adviceList,
      advice => advice.pattern.test(trimmedSentence)
    )

    return new Advice({
      sentence: trimmedSentence,
      ...adviceParams
    })
  }

  static search (sentence = '', options = {limit: Infinity, allowBlank: true}) {
    const {limit, allowBlank} = options
    sentence = sentence.trim()

    if (_.isEmpty(sentence) && !allowBlank) return [];

    return _(adviceList)
      .filter(
        advice => fuzzysearch(
          sentence.toLowerCase(),
          (advice.help + advice.name).toLowerCase()
        )
      )
      .take(limit)
      .value()
  }

  get matches () {
    if (this._matches) return this._matches

    const {sentence, pattern} = this
    this._matches = pattern.exec(sentence)

    return this._matches
  }

  get topCaption () {
    return this.caption(this.matches).top.toUpperCase()
  }

  get bottomCaption () {
    return this.caption(this.matches).bottom.toUpperCase()
  }

  //TODO: Put all the meme images in assets
  get imageUrl () {
    return this.url ? `http://memecaptain.com/src_images/${this.url}.jpg` : ''
  }
}

function defaultCaption (matches) {
  return {top: matches[1], bottom: matches[2]}
}
