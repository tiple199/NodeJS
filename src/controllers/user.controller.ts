import { Request, Response } from "express";
import {getAllUsers, getUserById, handleDeleteUser,updateUserById,handleCreateUser, getAllRoles } from "services/user.service";
const getHomePage = async (req: Request,res: Response) => {
    
    res.render("client/home/show");
}
// const getCreateUserPage = async (req: Request,res: Response) => {
//     const roles = await getAllRoles();
//     res.render("create-user",{roles:roles});
// }
const postCreateUser = async (req: Request,res: Response) => {
    const {fullName,email ,address,phone,role} = req.body;
    const file = req.file;
    const avatar = file?.filename ?? null;

    await handleCreateUser(fullName,email,address,phone,avatar,role)
    res.redirect("/admin/user");
}
const postDeleteUser = async (req: Request,res: Response) => {
    const {id} = req.params;
    await handleDeleteUser(id as string);
    
    res.redirect("/admin/user");
}
const getViewUser = async (req: Request,res: Response) => {
    const {id} = req.params;
    const roles = await getAllRoles();

    const user = await getUserById(id as string);
    return res.render("admin/user/detail",{id:id,user:user,roles});    
}
const postUpdateUser = async (req: Request,res: Response) => {
    const {fullName ,address,phone,role,id} = req.body;
    const file = req.file;
    const avatar = file?.filename ?? undefined;
    await updateUserById(id, fullName,phone,address,role,avatar);
    return res.redirect("/admin/user");
}




export { getHomePage,postCreateUser,postDeleteUser,getViewUser,postUpdateUser };