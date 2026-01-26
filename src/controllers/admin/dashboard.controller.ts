import { Request, Response } from "express";
import { getAllRoles, getAllUsers } from "services/user.service";
const getDashboardPage = async (req: Request,res: Response) => {
    
    return res.render("admin/dashboard/show");
}
const getAdminUserPage = async (req: Request,res: Response) => {
    const users = await getAllUsers();

    
    return res.render("admin/user/show",{users:users});
}
const getCreateUserPage = async (req: Request,res: Response) => {
    const roles = await getAllRoles();
    return res.render("admin/user/create",{roles:roles});
}


const getAdminOrderPage = async (req: Request,res: Response) => {
    
    return res.render("admin/order/show");
}
const getAdminProductPage = async (req: Request,res: Response) => {
    
    return res.render("admin/product/show");
}



export { getDashboardPage,getAdminUserPage,getAdminOrderPage,getCreateUserPage,getAdminProductPage };