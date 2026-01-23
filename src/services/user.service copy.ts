import getConnection from "config/database";

const handleCreateUser =  async (fullName: string, email: string, address: string) => {
  const connection = await getConnection();
  

    try {
    const sql = 'INSERT INTO `users`(`name`, `email`, `address`) VALUES (?, ?, ?)';
    const values = [fullName, email, address];

    const [result, fields] = await connection.execute(sql, values);
    return result;
  }   catch (err) {
    console.log(err);
  } 
}

const getAllUsers = async () => {
    const connection = await getConnection();
     try {
      const [results, fields] = await connection.query(
        'SELECT * FROM `users`'
      );
      return results;

  
    }
     catch (err) {
      console.log(err);
      return [];
    }
}

const handleDeleteUser = async (id: string) => {
  try {
  const connection = await getConnection();
  const sql = 'DELETE FROM `users` WHERE `id` = ? LIMIT 1';
  const values = [id];

  const [result, fields] = await connection.execute(sql, values);


  return result;
} catch (err) {
  console.log(err);
  return null;
}
}

const getUserById = async (id: string) => {
  try {
  const connection = await getConnection();
  const sql = 'SELECT * FROM `users` WHERE `id` = ? LIMIT 1';
  const values = [id];

  const [rows, fields] = await connection.execute(sql, values);


  return rows[0];
} catch (err) {
  console.log(err);
  return [];
}
}
const updateUserById = async (id: string,email: string, address: string, fullName: string) => {
  try {
  const connection = await getConnection();
  const sql = 'UPDATE `users` SET `name` = ?,`email` = ?,`address` = ?  WHERE `id` = ? ';
  const values = [fullName, email, address, id];

  const [rows, fields] = await connection.execute(sql, values);


  return rows;
} catch (err) {
  console.log(err);
  return [];
}
}

export { handleCreateUser,getAllUsers,handleDeleteUser,getUserById,updateUserById };