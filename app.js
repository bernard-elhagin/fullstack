const express = require('express');

const server = express();

server.use(express.static('./public/'));

server.set('views', './views');
server.set('view engine', 'ejs');

server.get('/store', (request, response) => {
   response.render('store');
});

server.listen(3000, () => {
   console.log('Server listening on port 3000');
});
