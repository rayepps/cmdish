import { spawn } from 'child_process'


export const create = (cmd: string, {
  cwd,
  env
}: {
  cwd?: string
  env?: Record<string, string>
}) => {
  const parts = cmd.split(' ') // [ 'yarn', 'install', '--silent', '--prod' ]
  const args = parts.slice(1) // [ install', '--silent', '--prod' ]
  const program = parts[0] // 'yarn'
  return spawn(program, args, {
    cwd,
    shell: true,
    env: {
      ...process.env,
      ...env
    }
  })
}

command.create = create

export function command(cmd: string, {
  cwd = null,
  quiet = false,
  buffer = false,
  env = {},
  onErr = null,
  onOut = null
}: {
  cwd?: string
  quiet?: boolean
  buffer?: boolean
  env?: Record<string, string>
  onErr?: (str: string) => void
  onOut?: (str: string) => void
} = {}): Promise<[number, string]> {
  return new Promise((res) => {
    const child = create(cmd, { cwd, env })
    const outBuffer = []
    const onStd = (type: 'err' | 'out') => (buf: Buffer | string) => {
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
}

export default command