import { test, expect } from "@playwright/test";

test("MEGHAVYUHA boots, renders brand, and navigates across all 7 operational tabs with zero console errors", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto("/");

  // Brand + subtitle
  await expect(page.getByText("MEGHAVYUHA").first()).toBeVisible();
  await expect(page.getByText("Regime- & Error-Aware Rainfall Intelligence").first()).toBeVisible();

  // 1. OVERVIEW
  await expect(page.getByText("OVERVIEW").first()).toBeVisible();
  await expect(page.getByText("Dehradun, Uttarakhand").first()).toBeVisible();

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

