import { Request, Response } from "express";
import {getAllUsers, getUserById, handleDeleteUser,updateUserById } from "services/user.service";
const getHomePage = async (req: Request,res: Response) => {
    const users = await getAllUsers();
    
    res.render("home",{
        users : users
    });
}
// const getCreateUserPage = async (req: Request,res: Response) => {
//     const roles = await getAllRoles();
//     res.render("create-user",{roles:roles});
// }
const postCreateUser = async (req: Request,res: Response) => {
    const {fullName, username, address,phone,role} = req.body;

    // const a = await handleCreateUser(fullName, username, address);
    res.redirect("/");
}
const postDeleteUser = async (req: Request,res: Response) => {
    const {id} = req.params;
    await handleDeleteUser(id as string);
    
    res.redirect("/");
}
const getViewUser = async (req: Request,res: Response) => {
    const {id} = req.params;
    const user = await getUserById(id as string);
    return res.render("view-user",{id:id,user:user});    
}
const postUpdateUser = async (req: Request,res: Response) => {
    const {id, fullName, email, address} = req.body;
    await updateUserById(id,email,address, fullName);
    return res.redirect("/");
}



export { getHomePage,postCreateUser,postDeleteUser,getViewUser,postUpdateUser };