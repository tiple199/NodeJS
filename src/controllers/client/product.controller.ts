import { Request, Response } from "express";
import { addProductToCart, getProductById, getProductInCart, handleDeleteInCart, updateCartDetailBeforeCheckOut,  } from "services/client/item.service";
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

const getCartPage = async (req: Request,res: Response) => {
    const user = req.user;
    if(!user){
        return res.redirect("/login");
    }

    const cartDetails = await getProductInCart(+user.id);
    const totalPrice = cartDetails.reduce((total, item) => total + item.price * item.quantity, 0);

    return res.render("client/product/cart", {cartDetails,totalPrice});
}

const postDeleteProductInCart = async (req: Request,res: Response) => {
    const { id } = req.params;
    const user = req.user;
    if(!user){
        return res.redirect("/login");
    }
    await handleDeleteInCart(+id);
    return res.redirect("/cart");
}

const getCheckOutPage = async (req: Request,res: Response) => {
    const user = req.user;
    if(!user){
        return res.redirect("/login");
    }

    const cartDetails = await getProductInCart(+user.id);
    const totalPrice = cartDetails.reduce((total, item) => total + item.price * item.quantity, 0);

    return res.render("client/product/checkout", {cartDetails,totalPrice});
}

const postHandleCartToCheckOut = async (req: Request,res: Response) => {
        const user = req.user;
        if(!user){
            return res.redirect("/login");
        }
        const currentCartDetails : {id: string, quantity: string}[] = req.body?.cartDetails ?? [];

        await updateCartDetailBeforeCheckOut(currentCartDetails);

        return res.redirect("/checkout");
}




export { getProductPage,postAddProductToCart,getCartPage,postHandleCartToCheckOut,postDeleteProductInCart,getCheckOutPage};