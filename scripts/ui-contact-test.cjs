const { chromium } = require("playwright");

(async () => {
  const pageUrl = "http://127.0.0.1:4173";
  const stamp = new Date().toISOString();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 60000 });
    await page.evaluate(() => {
      const section = document.getElementById("contact");
      if (section) section.scrollIntoView({ behavior: "instant", block: "start" });
    });

    await page.waitForSelector("#contact-name", { timeout: 30000 });
    await page.fill("#contact-name", "Portfolio UI Test Bot");
    await page.fill("#contact-email", "qa-bot@deveshdev.live");
    await page.fill("#contact-subject", "UI E2E Contact Test");
    await page.fill("#contact-message", `UI browser-side test submission at ${stamp}`);
    await page.click('button:has-text("Send Message")');

    const status = page.locator('div[role="status"], div[role="alert"]').first();
    await status.waitFor({ timeout: 30000 });

    await page.waitForFunction(() => {
      const statusEl = document.querySelector('div[role="status"], div[role="alert"]');
      if (!statusEl) return false;
      const text = (statusEl.textContent || "").trim();
      return /Message sent successfully|Failed to send message/i.test(text);
    }, { timeout: 60000 });

    const text = (await status.innerText()).trim();

    if (/Message sent successfully/i.test(text)) {
      console.log("UI_CONTACT_OK");
      console.log(text);
    } else {
      console.log("UI_CONTACT_FAIL");
      console.log(text);
      process.exitCode = 2;
    }
  } catch (e) {
    console.log("UI_CONTACT_ERROR");
    console.log(e && e.message ? e.message : String(e));
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
