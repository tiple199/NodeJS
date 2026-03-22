import { Request, Response } from "express";
import { getDashBoardInfo } from "services/admin/dashboard.service";
import { getProductList } from "services/admin/product.service";
import {  getOrderAdmin } from "services/client/item.service";
import { getAllRoles, getAllUsers } from "services/user.service";
const getDashboardPage = async (req: Request,res: Response) => {
    const info = await getDashBoardInfo();
    
    return res.render("admin/dashboard/show", {info});
}
const getAdminUserPage = async (req: Request,res: Response) => {

    const {page} = req.query;
    let currentPage = page ? +page : 1;
    if(currentPage < 0){
        currentPage = 1;
    }

    const users = await getAllUsers(+currentPage);

    
    return res.render("admin/user/show",{users:users});
}
const getCreateUserPage = async (req: Request,res: Response) => {
    const roles = await getAllRoles();
    return res.render("admin/user/create",{roles:roles});
}


const getAdminOrderPage = async (req: Request,res: Response) => {
    const orders = await getOrderAdmin();
    
    return res.render("admin/order/show", {orders:orders});
}
const getAdminProductPage = async (req: Request,res: Response) => {
    const products = await getProductList();
    return res.render("admin/product/show",{products});
}



export { getDashboardPage,getAdminUserPage,getAdminOrderPage,getCreateUserPage,getAdminProductPage };