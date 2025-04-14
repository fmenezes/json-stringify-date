/**
 * Jest test file for browser.js testing with Puppeteer
 */
import puppeteer, { Browser, Page } from 'puppeteer';
import path from 'path';
import fs from 'fs';

const projectRoot = path.resolve(__dirname, '..');
const browserJsPath = path.resolve(projectRoot, 'browser.js');
const browserJsPathEncoded = encodeURIComponent(`file://${browserJsPath}`);
const testPagePath = `file://${path.resolve(__dirname, 'inline-browser-test.html')}?scriptPath=${browserJsPathEncoded}`;

describe('JSONStringifyDate Browser Tests', () => {
  let browser: Browser;
  let page: Page;
  let testResults: any;

  // Set a longer timeout since browser tests can take longer
  jest.setTimeout(30000);

  beforeAll(async () => {
    // Check if the HTML test file exists
    expect(fs.existsSync(path.resolve(__dirname, 'inline-browser-test.html'))).toBe(true);
    
    // Check if browser.js exists
    expect(fs.existsSync(browserJsPath)).toBe(true);
    
    // Launch the browser
    browser = await puppeteer.launch({ 
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    page = await browser.newPage();
    
    // Enable console log from the browser (helpful for debugging)
    page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
    
    // Load the test page
    await page.goto(testPagePath, { waitUntil: 'networkidle0' });
    
    // Check if page loaded correctly
    const title = await page.title();
    expect(title).toBe('JSON Stringify Date Browser Test');
    
    // Run all tests from the runTests function
    testResults = await page.evaluate(() => {
      return window.runTests();
    });
    
    // This helps with debugging
    console.log('Browser test results:', JSON.stringify(testResults, null, 2));
  });
  
  afterAll(async () => {
    // Close the browser when tests are done
    await browser.close();
  });
  
  test('should load the page correctly', () => {
    // This test is covered by the beforeAll expect statement
    expect(true).toBe(true);
  });
  
  test('should stringify dates correctly', () => {
    expect(testResults.error).toBeUndefined();
    expect(testResults.stringifyTest).toBeDefined();
    expect(testResults.stringifyTest.success).toBe(true);
    
    // Check that the stringified value matches the expected format for a date
    expect(testResults.stringifyTest.value).toMatch(
      /^\{"date":"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}([+-]\d{2}:\d{2}|Z)"\}$/
    );
  });
  
  test('should parse date strings correctly', () => {
    expect(testResults.parseTest).toBeDefined();
    expect(testResults.parseTest.success).toBe(true);
    
    // Check that the parsed value contains the expected date
    expect(testResults.parseTest.value).toMatch('Jan 01 2023');
  });
  
  test('should handle UTC option correctly', () => {
    expect(testResults.utcTest).toBeDefined();
    expect(testResults.utcTest.success).toBe(true);
    
    // Check that the UTC formatted date ends with Z
    expect(testResults.utcTest.value).toMatch(/Z"\}$/);
  });
  
  test('should support custom reviver functions', () => {
    expect(testResults.reviverTest).toBeDefined();
    expect(testResults.reviverTest.success).toBe(true);
    
    // Check that the custom reviver added the 'Custom:' prefix
    expect(testResults.reviverTest.value).toContain('Custom:');
  });
});