const http = require('http');
const mariadb = require('mariadb');

const pool = mariadb.createPool({
   host: 'localhost',
   user: 'bertold',
   database: 'finkployd',
   port: 3306,
   password: 'bertold',
   connectionLimit: 5
});

async function aF() {
   let conn;
   try {
      conn = await pool.getConnection();
      const rows = await conn.query('select * from shop_items');
      console.log(rows[0].item_image);
      console.log('hello');
      //return conn.query('insert into shop_items values (DEFAULT, ?, ?)', ['album 58', 55.88]);
   } catch (error) {
      throw error;
   } finally {
      if (conn) return conn.end();
   }
}

aF();

function requestHandler(request, response) {
   console.log('Got a request!');
   response.end('Here is your response');
}

const server = http.createServer(requestHandler);
server.listen(3000, () => {
   console.log('Server is listening on port 3000');
});
