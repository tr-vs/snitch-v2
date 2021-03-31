const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { stringify } = require('querystring');

/* async function bruh() {
    const searches = await Client.songs.search('tryna get down carti');

    // Pick first one
    const firstSong = searches[0];

    // Ok lets get the lyrics
    const lyrics = await firstSong.lyrics();
    console.log('Lyrics of the Song:\n', lyrics, '\n');
}*/

async function scrape() {
    const query = stringify({
        q: 'canary diamonds carti',
    });
    const path = `search?${query}`;
    const url = `https://api.genius.com/${path}`;
    const headers = {
      Authorization: 'Bearer U-vEPhlRQ960Mq9VD8WKAm_4QINvrRC_b6Z7_zNr35bBMnWM8O01aMbv5XC1_C2e',
    };

    // Fetch result and parse it as JSON
    const body = await fetch(url, { headers });
    const result = await body.json();

    const response = await fetch(result.response.hits[0].result.url);
    const text = await response.text();
    const $ = cheerio.load(text);
    console.log($('.lyrics').text().trim());
}
scrape();