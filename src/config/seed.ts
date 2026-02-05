import { prisma } from "config/client";
import { hashPassword } from "services/user.service";
import { ACCOUNT_TYPE } from "config/constant";

const initDatabase = async () => {
    const countUser = await prisma.user.count();
    const countRole = await prisma.role.count();
    
     if(countRole === 0) {
        await prisma.role.createMany({
        data: [
            {
                name: "ADMIN",
                description: "Admin role with full permissions"
            },
            {
                name: "USER",
                description: "User role with limited permissions"
            }
                
           
            ]
}    );
    }
    if(countUser === 0) {
        const defaultPassword = await hashPassword('123456');
        const adminRole = await prisma.role.findFirst({
            where: { name: "ADMIN" },
        });
        if(adminRole){
        await prisma.user.createMany({
        data: [
            {
                fullName: "Tiep",
                password: defaultPassword,
                username: "tiep@gmail.com",
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: adminRole.id
                },
            {
                fullName: "Admin",
                password: defaultPassword,
                username: "admin@gmail.com",
                accountType: ACCOUNT_TYPE.SYSTEM,
                roleId: adminRole.id
                }
            ]
        }    );
        }
    }
    if(countUser !== 0 && countRole !== 0) {
        console.log(">>> Already init");
        
    }
    
}

export default initDatabase;