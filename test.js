const { stringify } = require('querystring');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
async function bruh() {
	const params = stringify({
		q: 'dark queen',
	});
	const final = await fetch(`https://api.genius.com/search?${params}`, {
		method: 'get',
		headers: {
			'Authorization': 'Bearer zwfJKJKBiWToD_rsY94BqAAqatTeapx5_dPZlN9ogbfnqyaHuWtaaeztSAmzidrL',
		},
	}).then(r=> r.json());
	scrapeLyrics(final.response.hits[0].result.url);

}

async function scrapeLyrics(path) {
	return await fetch(path)
	.then(response => {
		const $ = cheerio.load(response.text());
		return [$('.header_with_cover_art-primary_info-title').text().trim(), $('.lyrics').text().trim()];
	});
}
bruh();
