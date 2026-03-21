import { prisma } from "config/client";
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

export { handleViewOrderDetail };