from playwright.sync_api import sync_playwright

def verify_rte():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # 1. Go to homepage to set local storage (needs same origin)
        print("Navigating to home...")
        page.goto("http://localhost:5173")

        # 2. Mock login
        print("Setting mock user...")
        page.evaluate("""() => {
            localStorage.setItem('diadem_currentUser', JSON.stringify({
                token: 'mock-token',
                username: 'admin',
                role: 'admin'
            }));
        }""")

        # 3. Navigate to Admin Blogs
        print("Navigating to Admin Blogs...")
        page.goto("http://localhost:5173/admin/blogs")

        # 4. Wait for Add Button
        print("Waiting for Add New Article button...")
        try:
            page.wait_for_selector('button:has-text("Add New Article")', timeout=10000)
        except Exception as e:
            print("Timeout waiting for Add button. Check if redirected to login.")
            print(f"Current URL: {page.url}")
            page.screenshot(path="/home/jules/verification/error_nav.png")
            browser.close()
            return

        # 5. Click Add New Article
        print("Clicking Add New Article...")
        page.click('button:has-text("Add New Article")')

        # 6. Wait for RTE
        print("Waiting for RTE (.ql-editor)...")
        try:
            page.wait_for_selector('.ql-editor', timeout=10000)
            print("RTE found!")

            # Check if there are two editors (Excerpt and Content)
            editors = page.locator('.ql-editor')
            count = editors.count()
            print(f"Found {count} editors.")

            if count >= 2:
                print("Success: Both Excerpt and Content editors are present.")
            else:
                print("Warning: Expected 2 editors, found less.")

            # Take screenshot of the modal with editors
            page.screenshot(path="/home/jules/verification/rte_verification.png")
            print("Screenshot saved to rte_verification.png")

        except Exception as e:
            print(f"Error finding RTE: {e}")
            page.screenshot(path="/home/jules/verification/error_rte.png")

        browser.close()

if __name__ == "__main__":
    verify_rte()
