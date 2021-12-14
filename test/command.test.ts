import * as chai from 'chai'

import { command } from '../index'

const { assert } = chai

describe('command', () => {

  test('returns std out', async () => {
    const [err, out] = await command('pwd', { buffer: true })
    assert.isNull(err)
    assert.isNotNull(out)
    assert.notEqual(out, '')
  })

  test('returns error first', async () => {
    const [err, out] = await command('pwd -not-allowed-flag')
    assert.isNotNull(err)
    assert.isEmpty(out)
  })

  test('does not collect buffer', async () => {
    const [err, out] = await command('ls /')
    assert.isNull(err)
    assert.isEmpty(out)
  })

  test('calls std err callback', async () => {
    let errStr = ''
    const [err, out] = await command('pwd -X', {
      onErr: (str) => errStr = str
    })
    assert.isNotNull(err)
    assert.isNotEmpty(errStr)
  })

  test('calls std out callback', async () => {
    let outStr = ''
    const [err] = await command('pwd', {
      onOut: (str) => outStr = str
    })
    assert.isNull(err)
    assert.isNotEmpty(outStr)
  })

})