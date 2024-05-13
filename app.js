const express = require('express');
const mariadb = require('mariadb');

const server = express();

const pool = mariadb.createPool({
   host: 'localhost',
   database: 'finkployd',
   user: 'bertold',
   password: 'bertold',
   connectionLimit: 5
});

server.use(express.static('./public/'));

server.set('views', './views');
server.set('view engine', 'ejs');

let albums = [];
let merch = [];

async function getData() {
   let connection;
   try {
      connection = await pool.getConnection();
      albums = await connection.query("SELECT id, item_name, item_price, item_image FROM shop_items WHERE item_type = 'A'");
      merch  = await connection.query("SELECT id, item_name, item_price, item_image FROM shop_items WHERE item_type = 'M'");
   } catch (error) {
      console.log('Error: ' + error);
   }
}

getData();

server.get('/store', (request, response) => {
   console.log(merch);
   response.render('store', { albums: albums, merch: merch });
});

server.listen(3000, () => {
   console.log('Server listening on port 3000');
});
