const { test, expect } = require('@playwright/test');

test('verify blocknote article viewer', async ({ page }) => {
  // 1. Mock API Responses
  await page.route('**/api/articles', async route => {
    // Mock the initial fetch of all articles (used in DataContext)
    const articles = [{
        id: 1,
        title: 'Test BlockNote Article',
        slug: 'test-blocknote-article',
        excerpt: 'This is a test article created with BlockNote.',
        category: 'Technology',
        published_at: new Date().toISOString(),
        cover_image: 'https://via.placeholder.com/800x400',
        content: JSON.stringify([
            {
                id: "1",
                type: "heading",
                props: { level: 2, textColor: "default", backgroundColor: "default", textAlignment: "left" },
                content: [{ type: "text", text: "Introduction", styles: {} }],
                children: []
            },
            {
                id: "2",
                type: "paragraph",
                props: { textColor: "default", backgroundColor: "default", textAlignment: "left" },
                content: [{ type: "text", text: "This is a paragraph.", styles: {} }],
                children: []
            },
            {
                id: "3",
                type: "bulletListItem",
                props: { textColor: "default", backgroundColor: "default", textAlignment: "left" },
                content: [{ type: "text", text: "Bullet point 1", styles: {} }],
                children: []
            }
        ])
    }];

    await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(articles)
    });
  });

  // Mock other data
  await page.route('**/api/settings', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({}) });
  });

  await page.route('**/api/banners', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
  });

  await page.route('**/api/views', async route => {
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ views: 100 }) });
  });


  // 2. Navigate to Article Viewer
  // Note: We use the SLUG in the URL, which matches the mocked data
  await page.goto('http://localhost:3000/article/test-blocknote-article');

  // 3. Verify Content Visibility
  // Wait for the main title
  await expect(page.locator('h1', { hasText: 'Test BlockNote Article' })).toBeVisible({ timeout: 10000 });

  // Verify BlockNote rendered content
  // BlockNote heading (level 2)
  await expect(page.getByRole('heading', { name: 'Introduction', level: 2 })).toBeVisible();

  // Paragraph
  await expect(page.getByText('This is a paragraph.')).toBeVisible();

  // Bullet Point
  await expect(page.getByText('Bullet point 1')).toBeVisible();

  // 4. Take Screenshot
  await page.screenshot({ path: 'blocknote_verification.png', fullPage: true });
});
