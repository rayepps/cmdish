import { spawn } from 'child_process'


export const command = async (cmd, { 
  cwd = null, 
  quiet = false, 
  buffer = false,
  onErr = null, 
  onOut = null
} = {}) => new Promise((res, rej) => {

  const parts = cmd.split(' ') // [ 'yarn', 'install', '--silent', '--prod' ]
  const args = parts.slice(1) // [ install', '--silent', '--prod' ]
  const program = parts[0] // 'yarn'
  const child = spawn(program, args, { cwd, shell: true })
  
  const outBuffer = []

  const onStd = (type) => (buf) => {
    const str = buf.toString()
    if (buffer) outBuffer.push(str)
    if (!quiet) console.log(str)
    if (type === 'err' && onErr) onErr(str)
    if (type === 'out' && onOut) onOut(str)
  }

  child.stdout.on('data', onStd('out'))
  child.stderr.on('data', onStd('err'))
  child.on('close', (code) => {
    if (code > 0) res([code, outBuffer.join('')])
    else res([null, outBuffer.join('')])
  })
})

export default command