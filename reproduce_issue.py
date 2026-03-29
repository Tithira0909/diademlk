import time
from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Mock API responses
        def handle_articles(route):
            route.fulfill(json=[{
                "id": 1,
                "title": "Why International Trade?",
                "category": "International Trade",
                "excerpt": """
<p>Take any country in the world — the global market is always bigger and more diverse than its local market. Every product or service requires resources to produce, but resources are not distributed equally across the world. No country has everything it needs to meet all the wants of its people.</p>
<p>Understanding history — from colonization and the Industrial Revolution to today’s technological and information eras — shows why international trade became essential. Even global leaders like Elon Musk and Jeff Bezos speak about Interplanetary Trade because resources and markets can extend far beyond borders.</p>
<p>The resources we need and the customers we can reach are wider than we imagine. That is why producing and selling to the world is both important and achievable.</p>
<p>Sri Lanka’s 2022 Economic Crisis was a strong reminder of this. It showed clearly:<br>
What Sri Lanka has?<br>
What Sri Lanka needs?<br>
What the world has that Sri Lanka lacks?<br>
And what the world needs that Sri Lanka can offer?</p>
<p>Sri Lanka has a population of about 22 million, while the world has 8 billion people. This alone proves that entering international trade is not a high-risk move — if you follow correct procedures with expert guidance.</p>
<p>At the core, business is simple:<br>
You produce something → You need a buyer → You need a market.</p>
<p>And the world itself is your market.</p>
<p>To understand why global business matters one thing is — but the next question is:<br>
“Where does Sri Lanka stand in this global market?”</p>
<p>This is why you must explore Sri Lanka’s export landscape using real data.</p>
""",
                "content": "<p>Full content would be here.</p>",
                "image": "https://via.placeholder.com/800x400",
                "date": "Feb 13, 2026"
            }])

        def handle_settings(route):
            route.fulfill(json={"default_theme": "light"})

        def handle_views(route):
            route.fulfill(json={"views": 100})

        def handle_banners(route):
            route.fulfill(json=[])

        # Intercept requests
        page.route("**/api/articles", handle_articles)
        page.route("**/api/settings", handle_settings)
        page.route("**/api/views", handle_views)
        page.route("**/api/banners", handle_banners)

        # 1. Verify Article Text Alignment
        print("Navigating to Article Page...")
        # Assuming dev server runs on 5173 (Vite default)
        try:
            page.goto("http://localhost:5173/article/1")
            page.wait_for_selector("h1", timeout=10000)
            print("Article loaded.")

            # Wait for content to render
            time.sleep(2)

            page.screenshot(path="/home/jules/reproduction_text_wrapping.png")
            print("Article screenshot taken.")
        except Exception as e:
            print(f"Error accessing article page: {e}")

        browser.close()

if __name__ == "__main__":
    verify_frontend()
