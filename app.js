const express = require('express');

const server = express();

server.set('views', 'views');
server.set('view engine', 'ejs');

server.use(express.static('./public/'));

server.get('/store', storeHandler);

function storeHandler(req, res) {
   res.render('store');
}

server.listen(3000, function listening() {
   console.log('Listening on port 3000');
});
