import { prisma } from "config/client";

const initDatabase = async () => {
    const countUser = await prisma.user.count();
    const countRole = await prisma.role.count();
    if(countUser === 0) {
        await prisma.user.createMany({
        data: [
            {
                password: "12345678",
                username: "tiep@gmail.com",
                accountType: "SYSTEM"
                },
            {
                password: "12345678",
                username: "admin@gmail.com",
                accountType: "SYSTEM"
                }
            ]
}    );
    }
    else if(countRole === 0) {
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
    else{
        console.log(">>> Already init");
        
    }
    
}

export default initDatabase;