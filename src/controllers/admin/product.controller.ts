import { Request, Response } from "express";

const getAdminCreateProductPage = async (req: Request,res: Response) => {
    res.render("admin/product/create");
}
const postAdminCreateProduct = async (req: Request,res: Response) => {
    return res.redirect("/admin/product/show");
}

export { getAdminCreateProductPage,postAdminCreateProduct };