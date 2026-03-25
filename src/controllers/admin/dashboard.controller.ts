import { Request, Response } from "express";
import { getDashBoardInfo } from "services/admin/dashboard.service";
import { countTotalOrder } from "services/admin/order.service";
import { countTotalProducts, getProductList } from "services/admin/product.service";
import {  getOrderAdmin } from "services/client/item.service";
import { countTotalUsers, getAllRoles, getAllUsers } from "services/user.service";
const getDashboardPage = async (req: Request,res: Response) => {
    const info = await getDashBoardInfo();
    
    return res.render("admin/dashboard/show", {info});
}
const getAdminUserPage = async (req: Request,res: Response) => {

    const {page} = req.query;
    let currentPage = page ? +page : 1;
    if(currentPage <= 0){
        currentPage = 1;
    }

    const users = await getAllUsers(+currentPage);
    const totalPages = await countTotalUsers();
    
    return res.render("admin/user/show",{users:users,totalPages: +totalPages,currentPage: +currentPage});
}
const getCreateUserPage = async (req: Request,res: Response) => {
    const roles = await getAllRoles();
    return res.render("admin/user/create",{roles:roles});
}


const getAdminOrderPage = async (req: Request,res: Response) => {
    const {page} = req.query;
    let currentPage = page ? +page : 1;
    if(currentPage <= 0){
        currentPage = 1;
    }

    const orders = await getOrderAdmin(currentPage);
    const totalPages = await countTotalOrder();
    
    return res.render("admin/order/show", {orders:orders,totalPages: +totalPages,currentPage: +currentPage});
}
const getAdminProductPage = async (req: Request,res: Response) => {
    const {page} = req.query;
    let currentPage = page ? +page : 1;
    if(currentPage <= 0){
        currentPage = 1;
    }
    const products = await getProductList(+currentPage);
    const totalPages = await countTotalProducts();


    return res.render("admin/product/show",{products,totalPages: +totalPages,currentPage: +currentPage});
}



export { getDashboardPage,getAdminUserPage,getAdminOrderPage,getCreateUserPage,getAdminProductPage };