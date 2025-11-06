const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/shop',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const hasPlaceholder = data.includes('placehold.co');
    const hasImg = data.includes('<img');
    const hasImage = data.includes('image');

    console.log('Has placeholder images:', hasPlaceholder);
    console.log('Has <img> tags:', hasImg);
    console.log('Has "image" text:', hasImage);

    if (hasPlaceholder) {
      const matches = data.match(/placehold\.co[^"']*/g);
      console.log('Placeholder URLs found:', matches ? matches.length : 0);
      if (matches) {
        console.log('First match:', matches[0]);
      }
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
