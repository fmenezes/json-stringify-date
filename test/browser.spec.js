// A standalone browser test for the browser.js version
import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const browserJsPath = path.resolve(projectRoot, 'browser.js');
const browserJsPathEncoded = encodeURIComponent(`file://${browserJsPath}`);
const testPagePath = `file://${path.resolve(__dirname, 'inline-browser-test.html')}?scriptPath=${browserJsPathEncoded}`;

(async () => {
  console.log('Starting browser tests for json-stringify-date browser.js');
  console.log('Browser JS path:', browserJsPath);
  console.log('Test page path:', testPagePath);
  
  try {
    // Check if the HTML test file exists
    if (!fs.existsSync(path.resolve(__dirname, 'inline-browser-test.html'))) {
      console.error('Test HTML file not found:', path.resolve(__dirname, 'inline-browser-test.html'));
      process.exit(1);
    }
    
    // Check if browser.js exists
    if (!fs.existsSync(browserJsPath)) {
      console.error('browser.js file not found:', browserJsPath);
      process.exit(1);
    }
    
    // Launch the browser
    const browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    console.log('Browser launched successfully');
    
    // Enable console log from the browser
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    
    // Load the test page
    await page.goto(testPagePath, { waitUntil: 'networkidle0' });
    console.log('Test page loaded');
    
    // Check if page loaded correctly
    const title = await page.title();
    console.log('Page title:', title);
    
    if (title !== 'JSON Stringify Date Browser Test') {
      console.error('❌ Page title test failed. Expected "JSON Stringify Date Browser Test", got:', title);
      await browser.close();
      process.exit(1);
    } else {
      console.log('✅ Page loaded successfully');
    }
    
    // Run all tests from the runTests function
    const testResults = await page.evaluate(() => {
      return window.runTests();
    });
    
    console.log('Full test results:', JSON.stringify(testResults, null, 2));
    
    // Report overall test results
    let allTestsPassed = true;
    
    if (testResults.error) {
      console.error('❌ Tests encountered an error:', testResults.error);
      allTestsPassed = false;
    }
    
    if (testResults.stringifyTest && !testResults.stringifyTest.success) {
      console.error('❌ Stringify test failed');
      allTestsPassed = false;
    } else if (testResults.stringifyTest) {
      console.log('✅ Stringify test passed');
    }
    
    if (testResults.parseTest && !testResults.parseTest.success) {
      console.error('❌ Parse test failed');
      allTestsPassed = false;
    } else if (testResults.parseTest) {
      console.log('✅ Parse test passed');
    }
    
    if (testResults.utcTest && !testResults.utcTest.success) {
      console.error('❌ UTC option test failed');
      allTestsPassed = false;
    } else if (testResults.utcTest) {
      console.log('✅ UTC option test passed');
    }
    
    if (testResults.reviverTest && !testResults.reviverTest.success) {
      console.error('❌ Custom reviver test failed');
      allTestsPassed = false;
    } else if (testResults.reviverTest) {
      console.log('✅ Custom reviver test passed');
    }
    
    // Close the browser
    await browser.close();
    
    // Exit with appropriate code
    console.log(allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    process.exit(allTestsPassed ? 0 : 1);
    
  } catch (error) {
    console.error('Error running browser tests:', error);
    process.exit(1);
  }
})();