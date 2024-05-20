const express = require('express');
const mariadb = require('mariadb');
const dotenv = require('dotenv');

dotenv.config();

const pool = mariadb.createPool(
   {
      host: process.env.MARIADB_HOST,
      user: process.env.MARIADB_USER,
      password: process.env.MARIADB_PASSWORD,
      database: process.env.MARIADB_DATABASE,
      port: process.env.MARIADB_PORT
   }
);

const server = express();

server.use(express.static('./public/'));
server.use(express.json());

server.set('views', './views');
server.set('view engine', 'ejs');

let albums;
let merch;

async function getData() {
   let connection;

   try {
      connection = await pool.getConnection();
      albums = await connection.query('SELECT * FROM shop_items WHERE item_type="A"');
      merch = await connection.query('SELECT * FROM shop_items WHERE item_type="M"');
   } catch (error) {
   }
}

getData();

server.get('/store', (request, response) => {
   response.render('store',
      {
         bandname: 'Nazwa Kapeli',
         albums: albums,
         merch: merch
      }
   );
});

async function sendOrder(order) {
   let connection;
   try {
      connection = await pool.getConnection();
      const query = 'INSERT INTO orders (sessionID, item_id, item_amount) VALUES (?, ?, ?)';
      for(let i = 0; i < order.items.length; i++) {
         await connection.query(query, [order.sessionID, order.items[i].ID, order.items[i].amount]);
      }
   } catch (error) {
      console.log("ERROR: " + error);
   }
}

server.post('/store', async (request, response) => {
   console.log(request.body);
   await sendOrder(request.body);
});

server.listen(3000, () => {
   console.log('Server started');
});
