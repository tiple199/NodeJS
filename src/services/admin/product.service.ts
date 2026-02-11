import { prisma } from "config/client";

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

const getProductList = async () => {
    return await prisma.product.findMany();
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

export { handleCreateProduct,getProductList,handleDeleteProduct,handleViewProduct,handleUpdateProduct };