const { writeFileSync } = require('fs');
const { resolve, join } = require('path');
const puppeteer = require('puppeteer');

// запуск: node run.js ./solutions/v1.js ./dist/v1
const solutionPath = resolve(process.argv[2]);
const rootPath = resolve(process.argv[3] || '.');
const testCase = require(join(rootPath, 'input.json'));

(async () => {
    const browser = await puppeteer.launch({ headless: false, devtools: true });
    // const browser = await puppeteer.launch({
    //   executablePath: '/.local-chromium/chrome-linux/chrome',
    //   args: ['--no-sandbox']
    // });

    const pages = await browser.pages();
    const page = pages[0];

    page.on('dialog', dialog => dialog.dismiss());
    page.on('pageerror', err => console.error(err));

    try {
        await page.goto(`file://${join(rootPath, 'test.html')}`);

        await page.addScriptTag({ url: `file://${solutionPath}` });
        await page.waitFor(() => typeof MyClock === 'function');

        const result = await page.evaluate(
            testCase => runTest(testCase),
            testCase
        );
        writeFileSync('./output.json', JSON.stringify(result));
    } catch (err) {
        console.log('ERROR', err);
    }

    // await new Promise(r => setTimeout(r, 60000));
    await browser.close();
})();
