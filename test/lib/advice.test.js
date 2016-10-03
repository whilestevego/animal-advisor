/* global describe it */
import {expect} from 'chai'
import Advice from '../../src/lib/advice'

const advices = [
  ['"Y U NO" Guy', 'y u no get a+', 'Y U NO', 'GET A+'],
  ['Ancient Aliens', 'aliens guy aliens', '', 'ALIENS'],
  ['Imminent Ned', 'brace yourself winter is coming', 'BRACE YOURSELF', 'WINTER IS COMING'],
  ['Success Kid', 'success when this thing then that thing', 'THIS THING', 'THAT THING']
]

describe('Advice', () => {
  describe('.find', () => {
    describe('when searching without a string', () => {
      it('should throw a TypeError', () => {
        const fn = () => {
          Advice.find(1)
        }
        expect(fn).to.throw(TypeError)
      })
    })

    describe('when searching for an empty string', () => {
      //TODO: Should it throw an error instead or return null/undefined?
      it('should return empty advice', () => {
        const advice = Advice.find('')
        expect(advice.topCaption).to.equal('')
        expect(advice.bottomCaption).to.equal('')
        expect(advice.imageUrl).to.equal('')
      })
    })

    describe('when searching filled query', () => {
      //TODO: Should it throw an error instead or return null/undefined?
      for (let advice of advices) {
        generateFindTest(...advice)
      }
    })
  })
})

function generateFindTest (name, query, topCaption, bottomCaption) {
  it(`should return ${name} advice`, () => {
    const advice = Advice.find(query)
    expect(advice.topCaption).to.equal(topCaption)
    expect(advice.bottomCaption).to.equal(bottomCaption)
  })
}
