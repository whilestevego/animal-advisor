import _ from 'lodash'
import fuzzysearch from 'fuzzysearch'

import adviceList from './advice-list'

export default class Advice {
  constructor (options) {
    const defaultOptions = adviceList[adviceList.length - 1]

    Object.assign(this, defaultOptions, options)

    if (!_.isFunction(this.caption)) {
      this.caption = defaultCaption.bind(this)
    }
  }

  static find (sentence) {
    // TODO: Create ArgumentError class for this case
    if (!sentence) {
      return new Error('Missing argument sentence')
    }

    sentence = sentence.trim()
    const adviceParams = _.find(
      adviceList,
      advice => advice.pattern.test(sentence)
    )


    return new Advice({sentence, ...adviceParams})
  }

  static search (sentence = '', options = {limit: Infinity, allowBlank: true}) {
    const {limit, allowBlank} = options
    sentence = sentence.trim()

    if (_.isEmpty(sentence) && !allowBlank) return Promise.resolve([]);
    // TODO: Maybe, adviceList should be a constructor parameter.
    // It will make this easier to test.
    return Promise.resolve(
      _(adviceList)
        .filter(advice => fuzzysearch(
          sentence.toLowerCase(),
          (advice.help + advice.name).toLowerCase()
        ))
        .take(limit)
        .value()
    )
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

  get imageUrl () {
    return `http://memecaptain.com/src_images/${this.url}.jpg`
  }
}

function defaultCaption (matches) {
  return {top: matches[1], bottom: matches[2]}
}
