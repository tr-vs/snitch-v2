const Scraper = require('images-scraper');
const first = Date.now();

const google = new Scraper({
  puppeteer: {
    headless: false,
  },
});


(async () => {
  const results = await google.scrape('travis scott', 10);
  console.log(results);
  console.log(Date.now() - first);
})();
