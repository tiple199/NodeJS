import { prisma } from "config/client";

const getProductWithFilter = async (page: number,pageSize: number,factory: string,
    target: string,price: string,sort: string
) => {
    let whereClause: any = {};
    if (factory) {
        const factoryInput = factory.split(",");
        whereClause.factory = {
            
                in: factoryInput,
            
        };
    }
    if (target) {
        const targetInput = target.split(",");
        whereClause.target = {
           
                in: targetInput,
            
        };
    }
    if (price) {
        const priceInput = price.split(",");
        let priceConditions = [];

        for (const priceRange of priceInput) {
            if (priceRange === "duoi-10-trieu") {
                priceConditions.push({ "price": { "lt": 10000000 } });
            }
            else if (priceRange === "10-15-trieu") {
                priceConditions.push({ "price": { "gte": 10000000, "lt": 15000000 } });
            }
            else if (priceRange === "15-20-trieu") {
                priceConditions.push({ "price": { "gte": 15000000, "lt": 20000000 } });
            }
            else if (priceRange === "tren-20-trieu") {
                priceConditions.push({ "price": { "gte": 20000000 } });
            }
        }
        whereClause.OR = priceConditions;
    }
    let orderByClause: any = {};
    if (sort) {
        if (sort === "gia-tang-dan") {
            orderByClause = {
                price: "asc",
            };
        }
        else if (sort === "gia-giam-dan") {
            orderByClause = {
                price: "desc",
            };
        }
    }

    const skip = (page - 1) * pageSize;

    const [categories, count] = await prisma.$transaction([
        prisma.product.findMany({
            skip: skip,
            take: pageSize,
            where: whereClause,
            orderBy: orderByClause,
        }),
        prisma.product.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(count / pageSize);

    return { products: categories, totalPages };

    
}

export { getProductWithFilter };