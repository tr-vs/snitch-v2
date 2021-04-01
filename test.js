const fetch = require('node-fetch');
const cheerio = require('cheerio');
//const { stringify } = require('querystring');

/* async function bruh() {
    const searches = await Client.songs.search('tryna get down carti');

    // Pick first one
    const firstSong = searches[0];

    // Ok lets get the lyrics
    const lyrics = await firstSong.lyrics();
    console.log('Lyrics of the Song:\n', lyrics, '\n');
}*/

async function scrape() {
    
    const url = `https://www.google.com/search?tbs=sbi:AMhZZitjL5_1ObAwSwkgDPpLzadVkV4yZsWpQ9ujudrQz3iGqfDgZOiCX88_16q4iOSDjl1yHVRfjhWrqZTXpBu6e9wpw308Hxcuc5zuePQIwo3dCSMgYF_1yWWxfU474iAiw-bHbDjc2uV1HPtvn2NkrPopLMsrs_1GBnnINLG6jSWXeuH336Ig-t6IP24-GPP2CgOMupdGmEzpGI5uZuCRah3XlUOfQwZcxUWz1Bq4k45dRj5MQv2ajLSibbimeD1P35EhG_1ZFWsd2pivlrNyJd7CVkJzFU-CVAxDQ1ydeSQE_1phB_18PD7LnTDF3celnIOxysnDFh7RE1z&hl=en`;
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36',
    };

    // Fetch result and parse it as JSON
    const body = await fetch(url, { headers });
    const result = await body.text();
    const $ = cheerio.load(result);
    const urlList = [];
    const titleList = [];
    const descriptionList = [];
    const arrowList = [];

    let i = 0;
    $('.yuRUbf a').each((i, url) => {

        const urls = $(url).attr('href');
        const titles = $(url).find('h3').text().trim().replace(/\s\s+/g, '');

        titleList.push(titles);
        urlList.push(urls);
    });

    $('.aCOpRe').each((x, url) => {
        const description = $(url).text();
        if (isNaN(description.charAt(0))) {
            i++;
        } else {
        descriptionList.push(description);
        }
    });
    $('.NJjxre').each((x, url) => {
        const arrow = $(url).text();
        arrowList.push(arrow);
    });
    console.log(i);
    const finalURL = urlList.slice(i);
    const finalTitle = titleList.slice(i);
    const finalArrow = arrowList.slice(i);

    console.log(finalURL.length);
    console.log(finalTitle.length);
    console.log(descriptionList.length);
    console.log(finalArrow.length);

}
scrape();