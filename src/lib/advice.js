import _ from 'lodash'
import adviceList from './advice-list'
import fuzzysearch from 'fuzzysearch'
import {generate} from './generator'

export default class Advice {
  constructor (options) {
    _.merge(this, options)

    if (!_.isFunction(this.caption)) {
      this.caption = defaultCaption.bind(this)
    }
  }

  static find (sentence) {
    // TODO: Create ArgumentError class for this case
    if (!sentence) {
      return Promise.reject(new Error('Missing argument sentence'))
    }

    sentence = sentence.trim()
    const advice = _.find(
      // TODO: Maybe, adviceList should be a constructor parameter.
      // It will make this easier to test.
      adviceList,
      advice => advice.pattern.test(sentence)
    )

    if (_.isUndefined(advice)) {
      return Promise.reject(new Error('Meme could not be found'))
    }

    return Promise.resolve(new Advice({sentence, ...advice}))
  }

  static search (sentence = '') {
    sentence = sentence.trim()
    return Promise.resolve(_.filter(
      // TODO: Maybe, adviceList should be a constructor parameter.
      // It will make this easier to test.
      adviceList,
      advice => fuzzysearch(sentence, advice.pattern.toString())
    ))
  }

  generate (destinationDir) {
    return generate(this.toMemeCaptainParams(), destinationDir)
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
