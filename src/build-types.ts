import dts from 'bun-plugin-dts'

async function build() {
  console.log('Building types...')

  await Bun.build({
    entrypoints: ['index.ts'],
    outdir: 'dist',
    plugins: [dts()]
  })

  console.log('Types built!')
}

build()