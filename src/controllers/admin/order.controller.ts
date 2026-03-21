import { Request, Response } from "express";
import { handleViewOrderDetail } from "services/admin/order.service";
import { handleViewOrderByUserId } from "services/client/item.service";


const getViewOrder = async (req: Request, res: Response) => {
    const orderId = req.params.id;
    const orderDetail = await handleViewOrderDetail(orderId as string);


    res.render("admin/order/detail", {orderDetail});
}

const getOrderHistoryPage = async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const orders = await handleViewOrderByUserId(userId);
    res.render("client/product/order.history.ejs", {orders});
}

export {getViewOrder,getOrderHistoryPage}