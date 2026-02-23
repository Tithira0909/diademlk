from playwright.sync_api import sync_playwright
import json
import time

def audit_mobile():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # iPhone 12/13/14 Pro viewport
        page = browser.new_page(viewport={'width': 390, 'height': 844}, user_agent='Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1')

        # --- MOCKS ---

        # Mock article data
        articles = [{
            "id": 1,
            "title": "Mobile Optimization Test Article Title is Long to Check Wrapping",
            "category": "Audit",
            "date": "2024-05-22",
            "image": "https://placehold.co/800x600",
            "excerpt": "<p>This is the excerpt. It should be readable on mobile.</p>",
            "content": """
                <p>This is the main content.</p>
                <p>Let's check a table:</p>
                <table style="width: 100%;">
                    <thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead>
                    <tbody><tr><td>Data 1</td><td>Data 2 with long text</td><td>Data 3</td></tr></tbody>
                </table>
                <p>And a list:</p>
                <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                </ul>
                <p>And an image:</p>
                <img src="https://placehold.co/1000x500" alt="Large Image" />
            """,
            "pdfUrl": ""
        }, {
             "id": 2, "title": "Another Article", "category": "Audit", "date": "2024-05-22", "image": "https://placehold.co/800x600", "excerpt": "Short excerpt.", "content": "Content."
        }]

        page.route("**/api/articles", lambda route: route.fulfill(status=200, body=json.dumps(articles)))
        page.route("**/api/articles/1", lambda route: route.fulfill(status=200, body=json.dumps(articles[0])))
        page.route("**/api/banners", lambda route: route.fulfill(status=200, body="[]"))
        page.route("**/api/views", lambda route: route.fulfill(status=200, body='{"views": 100}'))

        try:
            # 1. Home Page (Insights Section)
            print("Navigating to Home...")
            page.goto("http://localhost:3000/")

            # Scroll to Insights (BlogSection)
            # Assuming there is a section with id 'insights' or we find by text
            # The prompt mentions "Insights section". Let's assume it's there.
            # We can find "Latest Insights" or similar.

            # Wait a bit for render
            time.sleep(2)
            page.screenshot(path='mobile_home.png', full_page=True)
            print("Captured mobile_home.png")

            # 2. Article Viewer
            print("Navigating to Article...")
            page.click('text=Mobile Optimization Test Article')

            page.wait_for_url('**/article/1')
            time.sleep(2)
            page.screenshot(path='mobile_article.png', full_page=True)
            print("Captured mobile_article.png")

            # Check scroll position (it should be 0 ideally, but user says it starts at bottom)
            scroll_y = page.evaluate("window.scrollY")
            print(f"Scroll Y position on load: {scroll_y}")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    audit_mobile()
