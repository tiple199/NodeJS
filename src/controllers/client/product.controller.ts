import { Request, Response } from "express";
import { addProductToCart, getProductById, getProductInCart,  } from "services/client/item.service";
const getProductPage = async (req: Request,res: Response) => {
    const { id } = req.params;
    const product = await getProductById(+id);
    res.render("client/product/detail",{product});
}

const postAddProductToCart = async (req: Request,res: Response) => {
    const { id } = req.params;
    const user = req.user;
    if(user){
        await addProductToCart(1, +id, user);
    }else{
        return res.redirect("/login");
    }

    return res.redirect("/");
}

const getCardPage = async (req: Request,res: Response) => {
    const user = req.user;
    if(!user){
        return res.redirect("/login");
    }

    const cartDetails = await getProductInCart(+user.id);
    const totalPrice = cartDetails.reduce((total, item) => total + item.price * item.quantity, 0);

    return res.render("client/product/cart", {cartDetails,totalPrice});
}


export { getProductPage,postAddProductToCart,getCardPage};