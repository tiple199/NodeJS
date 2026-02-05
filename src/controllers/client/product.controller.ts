import { Request, Response } from "express";
const getProductPage = async (req: Request,res: Response) => {
    res.render("client/product/detail");
}

export { getProductPage };