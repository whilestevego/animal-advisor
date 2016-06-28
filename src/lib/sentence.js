import {uniqueId, inRange, isString, isEmpty, isArray} from 'lodash'

export default class Sentence {
  constructor (metaText, delimiters = ['{', '}']) {
    if (!isArray(metaText)) {
      throw new TypeError(`expected Array instead got ${typeof templateText}`)
    }

    // TODO: Find better name than _data
    this._data = metaText
    this._delimiters = delimiters
  }

  static fromTemplate (templateText = '', options = {delimiters: ['{', '}']}) {
    const {delimiters} = options

    if (!isString(templateText)) {
      throw new TypeError(`expected string instead got ${typeof templateText}`)
    }

    if(isEmpty(templateText)) {
      return Sentence.fromTemplate(
        `${delimiters[0]}${delimiters[1]}`,
        options
      )
    }

    let metaText = ''
    if (!isEmpty(templateText)) {
      metaText = splitByDelimeters(templateText, delimiters)
    }

    return new Sentence(metaText, delimiters)
  }

  static ofOne (isDelimited = true, delimiters = undefined) {
    return new Sentence([{_id: uniqueId(), isDelimited, value: ''}], delimiters)
  }

  forEach (...args) {
    this._data.forEach(...args)
  }

  map (...args) {
    return this._data.map(...args)
  }

  reduce (...args) {
    return this._data.reduce(...args)
  }

  get length () {
    return this._data.length
  }

  get opening () {
    return this._delimiters[0]
  }

  get closing () {
    return this._delimiters[1]
  }

  getAt (pos) {
    return this._data[pos].value
  }

  setAt (pos, value) {
    this._data[pos].value = value
  }

  hasUneditables ()  {
    for (let {isDelimited} of this._data) {
      if (!isDelimited) return true
    }
    return false
  }

  assocAt (pos, value) {
    const newSentence = new Sentence(this._data, this._delimiters)
    newSentence.setAt(pos, value)
    return newSentence
  }

  joinLeft (pos) {
    return this.joinRange(pos - 1, pos)
  }

  joinRight (pos) {
    return this.joinRange(pos, pos + 1)
  }

  joinRange (start, end) {
    const [left, right] = [0, this.length - 1]

    if (!inRange(start, right)) {
      throw new RangeError(`Start position must be between ${left} & ${right}`)
    } else if (!inRange(end, right)) {
      throw new RangeError(`End position must be between ${left} & ${right}`)
    }

    const metaText = this.reduce((newMetaText, particle, pos) => {
      const {length} = newMetaText

      if (pos <= start || pos > end) {
        newMetaText.push(particle)
      } else {
        newMetaText[length - 1].value += particle.value
        newMetaText[length - 1].isDelimited = true
      }

      return newMetaText
    },[])

    return new Sentence(metaText)
  }

  toTemplateText () {
    return this.reduce((templateText, {isDelimited, value}) => {
      if (isDelimited) {
        return templateText + `${this.opening}${value}${this.closing}`
      } else {
        return templateText + value
      }
    }, '')
  }

  toPlainText () {
    return this.reduce((plainText, {value}) => {
      return plainText + value
    }, '')
  }

  toString() {
    return `[object ${this.constructor.name}]`
  }
}

function splitByDelimeters (
  templateText, delimiters = ['{', '}']
) {
  const [open, close] = delimiters.map(delim => RegExp(delim))
  const fields = []
  let reg = ''

  for (let i in templateText) {
    const c = templateText[i]

    if (open.test(c) && i > 0) {
      fields.push({_id: uniqueId(), isDelimited: false, value: reg})
      reg = ''
    } else if (close.test(c)) {
      fields.push({_id: uniqueId(), isDelimited: true, value: reg})
      reg = ''
    } else {
      if (!open.test(c) && !close.test(c)) reg += c
    }
  }

  if (!isEmpty(reg)) {
    fields.push({_id: uniqueId(), isDelimited: false, value: reg})
  }

  return fields
}

window.Sentence = Sentence
