// Get the client
import mysql from 'mysql2/promise';

// Create the connection to database


const getConnection = async () => {
  const connection = await mysql.createConnection({
    port: 3306,
    host: 'localhost',
    password: '12345678',
    user: 'root',
    database: 'nodejspro',
  });
  return connection;

}

export default getConnection;