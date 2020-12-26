import chai from 'chai'

import { command } from '../index.js'

const { assert } = chai


export const test_command_returnsStdOut = async () => {
  const [err, out] = await command('pwd', { buffer: true })
  assert.isNull(err)
  assert.include(out, 'radcli')
}

export const test_command_returnsErrorFirst = async () => {
  const [err, out] = await command('pwd -not-allowed-flag')
  assert.isNotNull(err)
  assert.isEmpty(out)
}

export const test_command_doesNotCollectBuffer = async () => {
  const [err, out] = await command('ls /')
  assert.isNull(err)
  assert.isEmpty(out)
}

export const test_command_callsStdErrCallback = async () => {
  let errStr = ''
  const [err, out] = await command('pwd -X', {
    onErr: (str) => errStr = str
  })
  assert.isNotNull(err)
  assert.isNotEmpty(errStr)
}
