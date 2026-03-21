import { chromium } from "playwright";

const baseUrl = "http://127.0.0.1:4173";
const stamp = new Date().toISOString();

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

try {
  await page.goto(baseUrl, { waitUntil: "networkidle", timeout: 60000 });

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

  const statusLocator = page.locator('div[role="status"], div[role="alert"]');
  await statusLocator.first().waitFor({ timeout: 30000 });
  const statusText = (await statusLocator.first().innerText()).trim();

  if (/Message sent successfully/i.test(statusText)) {
    console.log("UI_CONTACT_OK");
    console.log(statusText);
  } else {
    console.log("UI_CONTACT_FAIL");
    console.log(statusText);
    process.exitCode = 2;
  }
} catch (error) {
  console.log("UI_CONTACT_ERROR");
  console.log(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
} finally {
  await browser.close();
}
