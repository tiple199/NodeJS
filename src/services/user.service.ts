import { prisma } from "config/client";
import getConnection from "config/database";

const handleCreateUser =  async (fullName: string, email: string, address: string) => {
  const user = await prisma.user.create({ 
    data: {
      fullName: fullName,
      username: email,
      address: address,
      password: "defaultpassword",
      accountType: "standard"
    }
  })
  return user;
}

const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
}
const getAllRoles = async () => {
    const roles = await prisma.role.findMany();
    return roles;
}

const handleDeleteUser = async (id: string) => {
  const result = await prisma.user.delete({
    where: { id: Number(id) },
  });
  return result;
}

const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
  });
  return user;
}

const updateUserById = async (id: string,email: string, address: string, fullName: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: {

      fullName: fullName,
      username: email,
      address: address,
      password: "defaultpassword",
      accountType: "standard"
    }
})
  return updatedUser;
};

export { handleCreateUser,getAllUsers,handleDeleteUser,getUserById,updateUserById,getAllRoles };