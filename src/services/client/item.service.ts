import { prisma } from "config/client";
import { TOTAL_ITEMS_PER_PAGE } from "config/constant";

const getProducts = async (currentPage: number,pageSize: number) => {
    const products = await prisma.product.findMany(
        {
            skip: (currentPage - 1) * pageSize,
            take: pageSize,
        }
    );
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

    const quantitySum = cartDetails.reduce((sum, item) => sum + +item.quantity, 0);
    const cartId =  await prisma.cartDetail.findFirst({
        where: {
            id: +cartDetails[0].id
        },
    }).then(res => res?.cartId);
    if(cartId){
        await prisma.cart.update({
            where: {
                id: cartId
            },
            data: {
                sum: quantitySum
            }
        });
    }
    


}

const handlerPlaceOrder = async (userId: number, receiverName: string, receiverAddress: string, receiverPhone: string,totalPrice: number) => {
    
    try {

        await prisma.$transaction(async (tx) => {
        
        
        const cart = await tx.cart.findUnique({
            where: {
                userId
            },
            include: {
                cartDetails: true
            }
        });
        if(cart){
            const dataOrderDetails = cart?.cartDetails.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.price
            })) ?? [];

            await tx.order.create({
                data: {
                    userId,
                    receiverName,
                    receiverAddress,
                    receiverPhone,
                    totalPrice: +totalPrice,
                    paymentMethod: "COD",
                    paymentStatus: "PAYMENT_UNPAID",
                    status: "UNPAID",
                    orderDetails: {
                        create: dataOrderDetails
                    }

            }});

            // remove cart after place order
            await tx.cartDetail.deleteMany({
                where: {
                    cartId: cart.id
                }
            });

            await tx.cart.delete({
                where: {
                    id: cart.id
                }
            });

            // check product
            for(const cartDetail of cart.cartDetails){
                const product = await tx.product.findUnique({
                    where: {
                        id: cartDetail.productId
                    }
                });
                if(!product || product.quantity < cartDetail.quantity){
                    throw new Error(`Sản phẩm ${product?.name ?? "unknown"} không đủ số lượng để đặt hàng`);
                }
                await tx.product.update({
                    where: {
                        id: cartDetail.productId
                    },
                    data: {
                        quantity: {
                            decrement: cartDetail.quantity
                        },
                        sold: {
                            increment: cartDetail.quantity
                        }
                    }
                });
            }
        }
        });
        return "";
    }
    catch (error) {
        return error.message;
    }
}

const getOrderAdmin = async (page: number) => {
    const pageSize = TOTAL_ITEMS_PER_PAGE;
    return await prisma.order.findMany({
        include: {
            user: true
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
   


    });
}

const handleViewOrderByUserId = async (userId: number) => {
    return await prisma.order.findMany({
        where: {
            userId
        },
        include: {
            orderDetails: {
                include: {
                    product: true
                }
            }
        }
    });
}
const countTotalProductClientPage = async (pageSize: number) => {
    const countProducts = await prisma.product.count();
    const totalPages = Math.ceil(countProducts / pageSize);
    return totalPages;
}


export { getProducts,getProductById,addProductToCart,getProductInCart
    ,handleDeleteInCart,updateCartDetailBeforeCheckOut,handlerPlaceOrder,
    getOrderAdmin,handleViewOrderByUserId,countTotalProductClientPage };