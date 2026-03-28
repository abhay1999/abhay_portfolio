const puppeteer = require('puppeteer-core')
const path = require('path')

;(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  })
  const page = await browser.newPage()

  const htmlPath = path.resolve(__dirname, '../resume.html')
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' })

  await page.pdf({
    path: path.resolve(__dirname, '../public/resume.pdf'),
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  })

  await browser.close()
  console.log('✓ public/resume.pdf generated')
})()
