const https = require('https');
const fs = require('fs');

https.get('https://g.tenor.com/v1/search?q=cowboy+duel&key=LIVDSRZULECB&limit=1', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const url = json.results[0].media[0].gif.url;
      
      https.get(url, (gifRes) => {
        const file = fs.createWriteStream('./public/cowboy.gif');
        gifRes.pipe(file);
        file.on('finish', () => console.log('Downloaded cowboy.gif from tenor'));
      });
    } catch(e) {
      console.log('Error', e);
    }
  });
});
