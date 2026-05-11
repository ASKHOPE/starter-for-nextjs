
import { chromium } from 'playwright';

async function main() {
  console.log('🚀 Starting test...');
  const browser = await chromium.launch({ headless: true });
  console.log('✅ Browser launched!');
  const page = await browser.newPage();
  console.log('✅ Page created!');
  await page.goto('https://example.com');
  console.log('✅ Navigated!');
  await browser.close();
  console.log('✅ Closed!');
}

main();
