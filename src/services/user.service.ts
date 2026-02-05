import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import bcrypt from 'bcrypt';
const saltRounds = 10;

const hashPassword = async (planText: string) =>{
  return await bcrypt.hash(planText, saltRounds);
}

const handleCreateUser =  async (fullName: string, username: string, address: string,phone: string, avatar: string, role: string) => {
  const defaultPassword = await hashPassword('123456');
  const user = await prisma.user.create({ 
    data: {
      fullName: fullName,
      username: username,
      address: address,
      password: defaultPassword,
      accountType: ACCOUNT_TYPE.SYSTEM,
      avatar: avatar,
      phone: phone,
      roleId: +role
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

const updateUserById = async (id: string, fullName: string, phone: string, address: string, role: string, avatar: string) => {
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data: {

      fullName: fullName,
      address: address,
      phone: phone,
      roleId: Number(role),
      ...(avatar !== undefined && { avatar: avatar })
    }
})
  return updatedUser;
};

export { handleCreateUser,getAllUsers,handleDeleteUser,getUserById,updateUserById,getAllRoles,hashPassword };