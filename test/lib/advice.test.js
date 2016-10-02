/* global describe it */
import assert from 'assert'
import Advice from '../../src/lib/advice'

describe('Advice', () => {
  describe('.find', () => {
    describe('when searching for empty string', () => {
      //TODO: Should it throw an error instead or return null/undefined?
      it('should return empty advice', () => {
        const advice = Advice.find('')
        assert.equal(advice.topCaption, '')
        assert.equal(advice.bottomCaption, '')
        assert.equal(advice.imageUrl, '')
      })
    })
  })
})
