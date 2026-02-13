import re
from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 720})
        page = context.new_page()

        # 1. Login to Admin Dashboard
        print("Navigating to Admin Login...")
        page.goto("http://localhost:5000/login")
        page.fill("input[type='text']", "admin")
        page.fill("input[type='password']", "password")
        page.click("button[type='submit']")
        page.wait_for_url("**/admin/dashboard")
        print("Logged in successfully.")

        # 2. Check Default Theme Switch in Dashboard
        print("Checking Dashboard Theme Switch...")
        # Check if the switch exists. It's inside the dashboard.
        # Looking for text "Default Website Theme"
        theme_label = page.get_by_text("Default Website Theme")
        if theme_label.is_visible():
            print("Default Theme Switch is visible.")
            # Toggle it to Dark Mode
            toggle = page.locator("button.relative.inline-flex.h-6.w-11") # Tailwind switch

            # Take screenshot before toggle
            page.screenshot(path="dashboard_before_toggle.png")

            # Click toggle
            toggle.click()
            page.wait_for_timeout(1000) # Wait for API call

            # Take screenshot after toggle
            page.screenshot(path="dashboard_after_toggle.png")
            print("Toggled theme switch.")
        else:
            print("Error: Default Theme Switch not found!")

        # 3. Check Website Navbar (assuming banners exist)
        print("Checking Website Navbar on Home Page...")
        page.goto("http://localhost:5000/")
        page.wait_for_load_state("networkidle")

        # Check if navbar text is white (assuming banners force it)
        # We can check for a class like 'text-white' on a nav link
        home_link = page.get_by_role("button", name="Home")
        if home_link.is_visible():
            # Check class attribute
            classes = home_link.get_attribute("class")
            print(f"Home link classes: {classes}")
            if "text-white" in classes:
                print("Navbar text is white (correct for dark banner).")
            else:
                 # If no banners, it might be text-zinc-900 (gray/black)
                 # We can't be sure without knowing if banners exist.
                 # But in our setup, we assume banners exist or we can check.
                 print("Navbar text is NOT white. This might be correct if no banners.")

        page.screenshot(path="website_home.png")

        # 4. Check Article Responsiveness
        print("Checking Article Responsiveness...")
        # Navigate to an article page. We need an ID.
        # We can try /article/1 or navigate from home page.
        # Or create a dummy article via API first? No, let's assume article 1 exists or go to blog section.
        page.goto("http://localhost:5000/article/13") # Using ID from screenshot
        # If 404, try to find a link from home.
        if page.locator("text=Loading...").is_visible():
             print("Article 13 loading...")
             page.wait_for_selector("h1", timeout=5000)

        # Check for horizontal scroll
        scroll_width = page.evaluate("document.documentElement.scrollWidth")
        viewport_width = page.viewport_size['width']

        print(f"Scroll Width: {scroll_width}, Viewport Width: {viewport_width}")

        if scroll_width > viewport_width:
            print("FAIL: Horizontal scroll detected on Article page!")
        else:
            print("PASS: No horizontal scroll on Article page.")

        page.screenshot(path="article_page.png")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
