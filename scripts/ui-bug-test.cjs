const { chromium } = require("playwright");

(async () => {
  const pageUrl = "http://127.0.0.1:4173";
  const stamp = new Date().toISOString();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 60000 });

    await page.click('button[title="Report a bug or suggest a feature"]');
    await page.waitForSelector('form button:has-text("Submit Report")', { timeout: 30000 });

    await page.fill('input[placeholder*="Describe the bug briefly"]', "UI E2E Bug Test");
    await page.fill('textarea[placeholder*="Provide details"]', `Browser-side bug report test at ${stamp}`);
    await page.fill('input[type="email"][placeholder="you@example.com"]', 'qa-bot@deveshdev.live');

    await page.click('form button:has-text("Submit Report")');

    await page.waitForSelector('h4:has-text("Thank you!")', { timeout: 60000 });

    console.log("UI_BUG_OK");
    console.log("Bug report modal reached success state.");
  } catch (e) {
    console.log("UI_BUG_FAIL");
    console.log(e && e.message ? e.message : String(e));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
