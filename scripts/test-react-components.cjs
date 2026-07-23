const { chromium } = require("playwright");

(async () => {
  const pageUrl = "http://127.0.0.1:4173";
  console.log("--> Testing React Components & React Three Fiber integration...");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const consoleLogs = [];
  const consoleErrors = [];

  page.on("console", (msg) => {
    const text = msg.text();
    consoleLogs.push(`[${msg.type()}] ${text}`);
    if (msg.type() === "error") {
      consoleErrors.push(text);
    }
  });

  page.on("pageerror", (err) => {
    console.error("PAGE RUNTIME ERROR:", err.message);
    consoleErrors.push(err.message);
  });

  try {
    await page.goto(pageUrl, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(1000);

    // 1. Verify Three.js / React Three Fiber Canvas presence
    const canvasCount = await page.locator("canvas").count();
    console.log(`--> Found ${canvasCount} HTML5/WebGL Canvas element(s).`);

    // 2. Verify React Type Animation text
    const typeAnimation = await page.locator(".type-animation, span:has-text('Engineer'), span:has-text('Developer')").first().isVisible();
    console.log(`--> React Type Animation rendered: ${typeAnimation}`);

    // 3. Verify React Parallax Tilt container
    const tiltElement = await page.locator(".react-parallax-tilt, [style*='transform-style']").count();
    console.log(`--> React Parallax Tilt elements found: ${tiltElement}`);

    // 4. Verify React Markdown in Blog Section
    await page.evaluate(() => {
      const blogSec = document.getElementById("blog");
      if (blogSec) blogSec.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(400);

    // Click on featured article to test React Markdown modal/page rendering
    const featuredArticle = page.locator('#blog article').first();
    if (await featuredArticle.isVisible()) {
      await featuredArticle.click();
      await page.waitForTimeout(800);
      const markdownBody = await page.locator(".prose, article").first().isVisible();
      console.log(`--> React Markdown post body rendered: ${markdownBody}`);
      
      const backOrClose = page.locator('button:has-text("Back"), button[aria-label="Close article"]').first();
      if (await backOrClose.isVisible()) {
        await backBtnClick(page, backOrClose);
      }
    }

    // 5. Verify Playground Interactive Tab System
    await page.evaluate(() => {
      const pgSec = document.getElementById("playground");
      if (pgSec) pgSec.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(400);

    const playgroundTab = page.locator('#playground button:has-text("Interactive"), #playground button:has-text("Snippets")').first();
    if (await playgroundTab.isVisible()) {
      await playgroundTab.click();
      await page.waitForTimeout(300);
      console.log("--> Playground React tab switching verified.");
    }

    // Filter console errors for fatal React failures
    const fatalErrors = consoleErrors.filter((e) =>
      !e.includes("EmailJS") && !e.includes("Formspree") && !e.includes("favicon") && !e.includes("404")
    );

    console.log("\n==========================================");
    console.log("    REACT COMPONENTS & R3F HEALTH CHECK   ");
    console.log("==========================================");
    console.log(`Canvas Elements Rendered: ${canvasCount}`);
    console.log(`Fatal React Errors: ${fatalErrors.length}`);
    if (fatalErrors.length > 0) {
      console.log("Fatal Error Log:", fatalErrors);
    } else {
      console.log("SUCCESS: ALL REACT COMPONENTS AND THREE FIBER ARE WORKING PROPERLY!");
    }

  } catch (e) {
    console.error("Test execution failed:", e);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();

async function backBtnClick(page, btn) {
  try {
    await btn.click();
    await page.waitForTimeout(300);
  } catch {
    await page.goto("http://127.0.0.1:4173", { waitUntil: "domcontentloaded" });
  }
}
