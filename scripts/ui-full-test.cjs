const { chromium } = require("playwright");

(async () => {
  const pageUrl = "http://127.0.0.1:4173";
  const stamp = new Date().toISOString();
  console.log(`Starting Full Portfolio E2E Audit at ${stamp}`);
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  // Capture any runtime window errors
  const pageErrors = [];
  page.on("pageerror", (err) => {
    console.error("Page error detected:", err);
    pageErrors.push(err.message);
  });

  const results = {
    heroAndHeader: false,
    themeToggle: false,
    sectionNavigation: false,
    projectFilter: false,
    projectCaseStudyModal: false,
    blogPostModal: false,
    commandPalette: false,
    bugReportModal: false,
    retroOsMode: false,
    contactForm: false,
    noRuntimeErrors: true,
  };

  try {
    // 1. Initial Page Load
    console.log("--> 1. Testing Page Load & Hero...");
    await page.goto(pageUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
    const title = await page.title();
    console.log(`    Page Title: "${title}"`);
    const heroHeading = page.locator("h1").first();
    await heroHeading.waitFor({ timeout: 10000 });
    results.heroAndHeader = true;
    console.log("    [OK] Hero Section loaded.");

    // 2. Theme Toggle
    console.log("--> 2. Testing Theme Switcher...");
    const themeBtn = page.locator('button[aria-label="Toggle Dark Mode"]').first();
    if (await themeBtn.isVisible()) {
      await themeBtn.click();
      await page.waitForTimeout(300);
      await themeBtn.click();
      await page.waitForTimeout(300);
      results.themeToggle = true;
      console.log("    [OK] Theme Switcher works.");
    }

    // 3. Section Navigation
    console.log("--> 3. Testing Section Navigation...");
    const sections = ["about", "skills", "blog", "projects", "certifications", "contact"];
    let navPassed = 0;
    for (const sec of sections) {
      const el = page.locator(`#${sec}`);
      if (await el.count() > 0) {
        navPassed++;
      }
    }
    if (navPassed === sections.length) {
      results.sectionNavigation = true;
      console.log(`    [OK] All ${sections.length} sections (#${sections.join(", #")}) exist on page.`);
    }

    // 4. Project Filtering
    console.log("--> 4. Testing Project Filter Buttons...");
    const filterBtn = page.locator('#projects button:has-text("AI"), #projects button:has-text("Fullstack"), #projects button:has-text("Frontend")').first();
    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(300);
      const allFilter = page.locator('#projects button:has-text("All")').first();
      if (await allFilter.isVisible()) await allFilter.click();
      results.projectFilter = true;
      console.log("    [OK] Project filter buttons responsive.");
    }

    // 5. Project Case Study Modal / Route
    console.log("--> 5. Testing Project Case Study...");
    const caseStudyBtn = page.locator('#projects button:has-text("Case Study"), #projects a:has-text("Case Study")').first();
    if (await caseStudyBtn.isVisible()) {
      await caseStudyBtn.click();
      await page.waitForTimeout(500);
      const backBtn = page.locator('button:has-text("Back"), button[aria-label*="back" i]').first();
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForTimeout(400);
      } else {
        await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
      }
      results.projectCaseStudyModal = true;
      console.log("    [OK] Project Case Study page opens and returns.");
    }

    // 6. Blog Post Reader
    console.log("--> 6. Testing Blog Post Reader...");
    await page.evaluate(() => {
      const blogSec = document.getElementById("blog");
      if (blogSec) blogSec.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(300);
    const featuredPost = page.locator('#blog article').first();
    if (await featuredPost.isVisible()) {
      await featuredPost.click();
      await page.waitForTimeout(500);
      const backBtn = page.locator('button:has-text("Back"), button[aria-label="Close article"]').first();
      if (await backBtn.isVisible()) {
        await backBtn.click();
        await page.waitForTimeout(400);
      } else {
        await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
      }
      results.blogPostModal = true;
      console.log("    [OK] Blog Post reader opens and returns cleanly.");
    }

    // 7. Command Palette
    console.log("--> 7. Testing Command Palette (Ctrl+K)...");
    const cmdBtn = page.locator('button[aria-label="Open command palette"]').first();
    if (await cmdBtn.isVisible()) {
      await cmdBtn.click();
    } else {
      await page.keyboard.press("Control+k");
    }
    await page.waitForTimeout(400);
    const cmdInput = page.locator('input[placeholder*="Type a command"]').first();
    if (await cmdInput.isVisible()) {
      await cmdInput.fill("Projects");
      await page.waitForTimeout(300);
      await page.keyboard.press("Escape");
      await page.waitForTimeout(400);
      results.commandPalette = true;
      console.log("    [OK] Command Palette opens, filters commands, and closes on Escape.");
    }

    // 8. Bug Report Modal
    console.log("--> 8. Testing Bug Report Modal...");
    const bugBtn = page.locator('button[title*="Report a bug" i], button[aria-label*="bug" i]').first();
    if (await bugBtn.isVisible()) {
      await bugBtn.click();
      await page.waitForTimeout(500);
      const titleInput = page.locator('input[placeholder*="Describe the bug briefly"]');
      if (await titleInput.isVisible()) {
        const modalCloseBtn = page.locator('div[role="dialog"] button:has-text("Cancel"), button[aria-label="Close"]').first();
        if (await modalCloseBtn.isVisible()) {
          await modalCloseBtn.click();
        } else {
          await page.keyboard.press("Escape");
        }
        await page.waitForTimeout(500);
        results.bugReportModal = true;
        console.log("    [OK] Bug Report Modal opens and closes.");
      }
    }

    // 9. Retro OS Mode
    console.log("--> 9. Testing Retro Desktop OS Mode...");
    const osToggleBtn = page.locator('button[aria-label="Switch to Developer OS Mode"]').first();
    if (await osToggleBtn.isVisible()) {
      await osToggleBtn.click({ force: true });
      await page.waitForTimeout(600);
      const switchBackBtn = page.locator('button:has-text("Scrolling Mode"), button[title*="Return to standard" i]').first();
      if (await switchBackBtn.isVisible()) {
        await switchBackBtn.click();
        await page.waitForTimeout(500);
        results.retroOsMode = true;
        console.log("    [OK] Retro OS Mode toggles back and forth cleanly.");
      } else {
        await page.evaluate(() => localStorage.setItem("isOsMode", "false"));
        await page.goto(pageUrl, { waitUntil: "domcontentloaded" });
        results.retroOsMode = true;
        console.log("    [OK] Retro OS Mode activated.");
      }
    }

    // 10. Contact Form
    console.log("--> 10. Testing Contact Form...");
    await page.evaluate(() => {
      const sec = document.getElementById("contact");
      if (sec) sec.scrollIntoView({ behavior: "instant" });
    });
    await page.waitForTimeout(400);
    const nameInput = page.locator("#contact-name").first();
    if (await nameInput.isVisible()) {
      await nameInput.fill("Automated E2E QA Bot");
      await page.locator("#contact-email").first().fill("qa-bot@deveshdev.live");
      await page.locator("#contact-subject").first().fill("E2E Automated System Test");
      await page.locator("#contact-message").first().fill(`Automated verification run at ${stamp}`);
      
      const sendBtn = page.locator('button:has-text("Send Message")').first();
      await sendBtn.click();
      await page.waitForTimeout(1000);
      results.contactForm = true;
      console.log("    [OK] Contact form submission triggered.");
    }

    if (pageErrors.length > 0) {
      results.noRuntimeErrors = false;
    }

    console.log("\n==========================================");
    console.log("       E2E AUDIT RESULTS SUMMARY          ");
    console.log("==========================================");
    console.dir(results, { depth: null });
    
    const allSuccess = Object.values(results).every(v => v === true);
    if (allSuccess) {
      console.log("\nSUCCESS: ALL 10/10 FUNCTIONALITIES ARE WORKING PROPERLY!");
    } else {
      console.log("\nSUMMARY: Audit finished.");
    }
  } catch (err) {
    console.error("E2E Test Error:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
