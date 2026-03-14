import { prisma } from "config/client";

const getProducts = async () => {
    const products = await prisma.product.findMany();
    return products;
}

const getProductById = async (id: number) => {
    return await prisma.product.findUnique({
        where: { id }
    });
}

const addProductToCart = async (quantity: number, productId: number, user: Express.User) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: user.id
        }
    });

    const product = await getProductById(productId);

    if(cart){
        // kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        await prisma.cart.update({
            where: {
                id: cart.id
            },
            data: { 
                sum: {
                    increment: quantity
                }
            } },
        )

        const currentCartDetail = await prisma.cartDetail.findFirst({
            where: {
                cartId: cart.id,
                productId: productId
            }
        })

        await prisma.cartDetail.upsert({
            where: {
                id: currentCartDetail?.id ?? 0
            },
            update: {
                quantity: {
                    increment: quantity
                }
            },
            create: {
                cartId: cart.id,
                productId,
                quantity,
                price: product.price,
            }

        })

    }
    else{
        await prisma.cart.create({
            data: {
                userId: user.id,
                sum:quantity,
                cartDetails: {
                    create: {
                        productId,
                        quantity,
                        price: product.price
                    }
                }
            }
        });
    }
}

const getProductInCart = async (id: number) => {
    const cart = await prisma.cart.findUnique({
        where: {
            userId: id
        }
    });
    if(!cart) return [];
    const cartDetails = await prisma.cartDetail.findMany({
        where: {
            cartId: cart.id
        },
        include: {
            product: true
        }
    })
    return cartDetails ?? [];
}

const handleDeleteInCart = async (id: number) => {
    const cartDetail = await prisma.cartDetail.findUnique({
        where: {
            id
        }
    });
    if(cartDetail){
        await prisma.cartDetail.delete({
            where: {
                id
            }
        });
        const cart = await prisma.cart.findUnique({
            where: {
                id: cartDetail.cartId
            }
        });
        if(cart.sum - cartDetail.quantity > 0){
            await prisma.cart.update({
                where: {
                    id: cartDetail.cartId
                },
                data: {
                    sum: {
                        decrement: cartDetail.quantity
                    }
                }            });
        }
        else{
            await prisma.cart.delete({
                where: {
                    id: cartDetail.cartId
                }
            });
            
        }

    }
}

const updateCartDetailBeforeCheckOut = async (cartDetails: {id: string, quantity: string}[]) => {
    for(const cartDetail of cartDetails){
        await prisma.cartDetail.update({
            where: {
                id: +cartDetail.id
            },
            data: {
                quantity: +cartDetail.quantity
            }
        });
    }
}
export { getProducts,getProductById,addProductToCart,getProductInCart,handleDeleteInCart,updateCartDetailBeforeCheckOut };