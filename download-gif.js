const https = require('https');
const fs = require('fs');

https.get('https://media.giphy.com/media/hp21Vyd7kwa52/giphy.gif', (res) => {
  if (res.statusCode === 200) {
    const file = fs.createWriteStream('./public/cowboy.gif');
    res.pipe(file);
    file.on('finish', () => console.log('Downloaded cowboy.gif from giphy'));
  } else if (res.statusCode === 301 || res.statusCode === 302) {
    https.get(res.headers.location, (res2) => {
      const file = fs.createWriteStream('./public/cowboy.gif');
      res2.pipe(file);
      file.on('finish', () => console.log('Downloaded cowboy.gif from redirect'));
    });
  } else {
    console.log('Failed:', res.statusCode);
  }
});
