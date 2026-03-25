import { Request, Response } from "express";
import { countTotalProductClientPage, getProducts } from "services/client/item.service";
import { getProductWithFilter } from "services/client/product.filter";
import {getUserById, handleDeleteUser,updateUserById,handleCreateUser, getAllRoles } from "services/user.service";
const getHomePage = async (req: Request,res: Response) => {
    const {page} = req.query;
    let currentPage = page ? +page : 1;
        if(currentPage <= 0){
            currentPage = 1;
        }
    const totalPages = await countTotalProductClientPage(8);
    const products = await getProducts(currentPage,8);
    const user = req.user;
    console.log("current user", user);
    
    res.render("client/home/show", {products:products,totalPages: +totalPages,currentPage: +currentPage});
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

const getProductFilterPage = async (req: Request,res: Response) => {
    const {page,factory = "",target= "",price="",sort=""} = req.query as {page?: string,factory: string,target: string,price: string,sort: string};
    let currentPage = page ? +page : 1;
        if(currentPage <= 0){
            currentPage = 1;
        }
    // const totalPages = await countTotalProductClientPage(6);
    // const products = await getProducts(currentPage,6);

    const data =  await getProductWithFilter(currentPage,6, factory, target, price, sort);

    return res.render("client/product/filter",{products:data.products,totalPages: +data.totalPages,page: +currentPage});
    }


   






export { getHomePage,postCreateUser,postDeleteUser,getViewUser,postUpdateUser,getProductFilterPage };