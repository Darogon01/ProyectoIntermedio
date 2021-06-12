require('dotenv').config();
const puppeteer = require('puppeteer');
/* const path = require('path');
const opinionss = require('./.json'); */

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  /* for (const opinions of opinionss) {
    const scriptPath = path.join(__dirname, 'scripts', opinions.scriptName); */
    await require(scriptPath)(page, opinions);
    console.log('Scraping done for', opinions.name);
  /* } */
  await page.close();
  await browser.close();
})();