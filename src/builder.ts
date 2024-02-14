import dts from 'bun-plugin-dts'

async function build() {
  console.log('Building...')

  await Bun.build({
    entrypoints: ['index.ts'],
    outdir: 'dist',
    plugins: [dts()],
    target: 'bun',
    minify: true
  })

  console.log('Build done!')
}

build()