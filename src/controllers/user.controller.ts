import { log } from "console";
import { Request, Response } from "express";
import { getAllUsers, getUserById, handleCreateUser, handleDeleteUser,updateUserById } from "services/user.service";
const getHomePage = async (req: Request,res: Response) => {
    const users = await getAllUsers();
    
    res.render("home",{
        users : users
    });
}
const getCreateUserPage = (req: Request,res: Response) => {
    res.render("create-user");
}
const postCreateUser = async (req: Request,res: Response) => {
    const {fullName, email, address} = req.body;

    const a = await handleCreateUser(fullName, email, address);
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



export { getHomePage,getCreateUserPage,postCreateUser,postDeleteUser,getViewUser,postUpdateUser };