import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";
const handleViewOrderDetail = async (orderId: string) => {
    const orderDetail = await prisma.order_detail.findMany({
        where: {
            id: +orderId,
        },
        include: {
            product : true,
        }
    });
    return orderDetail;
}
const countTotalOrder = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const countOrders = await prisma.order.count();
    const totalOrders = Math.ceil(countOrders / pageSize);
    return totalOrders;
}

export { handleViewOrderDetail, countTotalOrder };