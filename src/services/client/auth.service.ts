import { prisma } from "config/client";
import { ACCOUNT_TYPE } from "config/constant";
import { hashPassword } from "services/user.service";

const registerNewUser = async (fullName: string, email: string, password: string) => {
    
    const newPassword = await hashPassword(password); // TODO: hash password

    const userRole = await prisma.role.findUnique({
        where: {
            name: "USER"
        }
    });

    if(userRole){

        await prisma.user.create({
            data: {
                fullName,
                username: email,
                password: newPassword,
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: userRole ? userRole.id : 0
            }
        });
        
    }
    else {
        throw new Error("Role USER not found");
    }
}

const isEmailExists = async (email: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username: email
        }
    });
    if (user) {
        return true;
    }
    return false;
    
}

const getUserWithRoleById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
        role: true
    },
    omit: {
        password: true
    },
  });
  return user;
}

const getUserSumCart = async (id: string) => {
  const user = await prisma.cart.findUnique({
    where: { id: Number(id) },
    
  });
  return user?.sum ?? 0;
}


export { registerNewUser,isEmailExists ,getUserWithRoleById,getUserSumCart};