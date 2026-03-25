import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const handleCreateProduct = async (name: string, price: number, detailDesc: string, shortDesc: string, quantity: number, factory: string, target: string, image: string | null) => {
    const product = await prisma.product.create({
        data: {
            name: name,
            price: +price,
            detailDesc: detailDesc,
            shortDesc: shortDesc,
            quantity: Number(quantity),
            factory: factory,
            target: target,
            ...(image && { image: image })
        }
    });
    return product;
}

const getProductList = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const skip = (page - 1) * pageSize;
    const products = await prisma.product.findMany({
        skip: skip,
        take: pageSize,
    });
    return products;
}

const countTotalProducts = async () => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    const countProducts = await prisma.product.count();
    const totalProducts = Math.ceil(countProducts / pageSize);
    return totalProducts;
}

const handleDeleteProduct = async (id: string) => {
    const result = await prisma.product.delete({
        where: {
            id: +id,
        }
    })
    return result;
}
const handleViewProduct = async (id: string) => {
    const product = await prisma.product.findUnique({
        where:{
            id: +id,
        }
    })
    return product;
}
const handleUpdateProduct = async (id: string,name: string, price: number, detailDesc: string, shortDesc: string, quantity: number, factory: string, target: string, image: string | undefined) => {
    const updatedProduct = await prisma.product.update({
    where: { id: Number(id) },
    data: {

        name: name,
        price: +price,
        detailDesc: detailDesc,
        shortDesc: shortDesc,
        quantity: Number(quantity),
        factory: factory,
        target: target,
      ...(image !== undefined && { image: image })
    }
})
  return updatedProduct;
}

export { handleCreateProduct,getProductList,handleDeleteProduct,handleViewProduct,handleUpdateProduct,countTotalProducts };