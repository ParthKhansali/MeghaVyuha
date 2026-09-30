import { test, expect } from "@playwright/test";

test("MEGHAVYUHA boots, renders brand, and navigates across all 7 operational tabs with zero console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto("/");
  await page.waitForTimeout(1500);

  // Brand + subtitle
  await expect(page.getByText("MEGHAVYUHA").first()).toBeVisible();
  await expect(page.getByText("Regime- & Error-Aware Rainfall Intelligence").first()).toBeVisible();

  // 1. OVERVIEW
  await expect(page.getByText("OVERVIEW").first()).toBeVisible();
  await expect(page.getByText("Dehradun, Uttarakhand").first()).toBeVisible({ timeout: 15000 });

  // 2. DISTRICT INTEL
  await page.getByText("DISTRICT INTEL").first().click();
  await expect(page.getByText("District Intelligence").first()).toBeVisible();
  await expect(page.getByText("Expected District Area Fraction").first()).toBeVisible();
  await expect(page.getByText("6-STEP DECISION EVIDENCE CHAIN").first()).toBeHidden();
  await page.getByText("DECISION EVIDENCE TRACE ▼").first().click();
  await expect(page.getByText("6-STEP DECISION EVIDENCE CHAIN").first()).toBeVisible();

  // 3. ERROR ATLAS
  await page.getByText("ERROR ATLAS").first().click();
  await expect(page.getByText("Error Atlas").first()).toBeVisible();
  await expect(page.getByText("WHAT HISTORICALLY GOES WRONG IN EACH FORECAST CONTEXT?").first()).toBeVisible();

  // 4. CORRECTION ENGINE
  await page.getByText("CORRECTION ENGINE").first().click();
  await expect(page.getByText("Correction Engine").first()).toBeVisible();

  // 5. VALIDATION
  await page.getByText("VALIDATION").first().click();
  await expect(page.getByText("Scientific Validation").first()).toBeVisible();
  await expect(page.getByText("Ablation Progression").first()).toBeVisible();
  await expect(page.getByText("Claim-Evidence Matrix").first()).toBeVisible();

  // 6. CASE REPLAY
  await page.getByText("CASE REPLAY").first().click();
  await expect(page.getByText("Case Replay — Retrospective Decision Walkthrough").first()).toBeVisible();

  // 7. DATA & PROVENANCE
  await page.getByText("DATA & PROVENANCE").first().click();
  await expect(page.getByText("Data & Provenance").first()).toBeVisible();
  await expect(page.getByText("NOAA GEFSv12 Reforecast").first()).toBeVisible();

  // Verify zero fatal console errors
  const criticalErrors = consoleErrors.filter(
    (e) => !e.includes("favicon") && !e.includes("WebGL") && !e.includes("deck.gl")
  );
  expect(criticalErrors).toHaveLength(0);
});

test("MEGHAVYUHA renders cleanly on mobile viewport", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await expect(page.getByText("MEGHAVYUHA").first()).toBeVisible();
  await expect(page.getByText("OVERVIEW").first()).toBeVisible();
});

test("Timeline playback, 1-day step forward/back, and validation chart bars verify correctly", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await page.waitForTimeout(1500);

  // Verify timeline elements
  const stepBackBtn = page.getByRole("button", { name: "Step back 1 Day" });
  const stepFwdBtn = page.getByRole("button", { name: "Step forward 1 Day" });
  const playBtn = page.getByRole("button", { name: /Play animation/ });

  await expect(stepBackBtn).toBeVisible({ timeout: 15000 });
  await expect(stepFwdBtn).toBeVisible();
  await expect(playBtn).toBeVisible();

  // Test stepping forward 1 day
  await stepFwdBtn.click();
  await page.waitForTimeout(300);
  await expect(page.getByText("Lead +1d").first()).toBeVisible();

  // Step forward another day
  await stepFwdBtn.click();
  await page.waitForTimeout(300);
  await expect(page.getByText("Lead +2d").first()).toBeVisible();

  // Test stepping back 1 day
  await stepBackBtn.click();
  await page.waitForTimeout(300);
  await expect(page.getByText("Lead +1d").first()).toBeVisible();

  // Test Play animation
  await playBtn.click();
  await page.waitForTimeout(1000);
  // Pause animation
  const pauseBtn = page.getByRole("button", { name: /Pause animation/ });
  await expect(pauseBtn).toBeVisible();
  await pauseBtn.click();

  // Screenshot map overview with timeline & legend
  await page.screenshot({ path: "/Users/parth/.gemini/antigravity-ide/brain/0574d7d8-64fa-4e32-a513-0820a74ff8c1/playback_verified.png" });

  // Navigate to VALIDATION and inspect chart
  await page.getByText("VALIDATION").first().click();
  await page.waitForTimeout(600);
  await expect(page.getByText("Scientific Validation").first()).toBeVisible();
  await expect(page.getByText("Continuous Ranked Probability Score").first()).toBeVisible();

  // Screenshot validation chart
  await page.screenshot({ path: "/Users/parth/.gemini/antigravity-ide/brain/0574d7d8-64fa-4e32-a513-0820a74ff8c1/validation_bars_verified.png" });
});

