import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const rootDir = process.cwd()
const indexPath = path.join(rootDir, 'out', 'index.html')

async function readHomepage() {
  return readFile(indexPath, 'utf8')
}

test('homepage static export exists', async () => {
  const html = await readHomepage()
  assert.ok(html.length > 0)
})

test('hero content is present in SSR output', async () => {
  const html = await readHomepage()
  assert.match(html, /id="home"/)
  assert.match(html, /Abhay/)
  assert.match(html, /CNCF Open Source Contributor/)
})

test('critical sections render into the exported page', async () => {
  const html = await readHomepage()

  for (const sectionId of ['about', 'experience', 'opensource', 'projects', 'devops-live', 'contact']) {
    assert.match(html, new RegExp(`id="${sectionId}"`))
  }
})

test('live-data sections expose resilient status copy in SSR output', async () => {
  const html = await readHomepage()
  assert.match(html, /STATIC SNAPSHOT/)
  assert.match(html, /STATIC DATA/)
})
