import { Request, Response } from "express";
import { handleCreateProduct, handleDeleteProduct, handleUpdateProduct, handleViewProduct } from "services/admin/product.service";
import { ProductSchema, TProductSchema } from "src/validation/product.schema";

const getAdminCreateProductPage = async (req: Request, res: Response) => {
    const oldData = {
        name: "",
        price: "",
        detailDesc: "",
        shortDesc: "",
        quantity: "",
        factory: "",
        target: ""  
    };
    return res.render("admin/product/create", { errors: [], oldData });
}
const postAdminCreateProduct = async (req: Request, res: Response) => {
    const {name, price, detailDesc, shortDesc, quantity, factory, target} = req.body as TProductSchema;
    const validation = ProductSchema.safeParse(req.body);
    if (!validation.success) {
        // error
        const errorZod = validation.error.issues;
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);

        const oldData = {
            name, price, detailDesc, shortDesc, quantity, factory, target 
        };

        return res.render("admin/product/create", { errors,oldData });
    }
    const file = req.file;
    const image = file?.filename ?? null;

    await handleCreateProduct(name, price, detailDesc, shortDesc, quantity, factory, target,image)
    // success
    return res.redirect("/admin/product");
}
const postDeleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    await handleDeleteProduct(id as string);
    
    res.redirect("/admin/product");
}
const getViewProduct = async (req: Request, res: Response) => {
    const errors= [];
    const { id } = req.params;
    const product = await handleViewProduct(id as string);

    const factoryOptions = [
        {name: "Apple (MacBook)", value: "Apple"},
        {name: "Dell", value: "DELL"},
        {name: "Asus", value: "ASUS"},
        {name: "Acer", value: "ACER"},
        {name: "Lenovo", value: "LENOVO"},
        {name: "LG", value: "LG"},
    ];

    const targetOptions = [
        { name: "Gaming", value: "GAMING" },
        { name: "Sinh viên - Văn phòng", value: "SINHVIEN-VANPHONG" },
        { name: "Thiết kế đồ họa", value: "THIET-KE-DO-HOA" },
        { name: "Mỏng nhẹ", value: "MONG-NHE" },
        { name: "Doanh nhân", value: "DOANH-NHAN" },
    ];

    return res.render("admin/product/detail", { product: product,errors,factoryOptions,targetOptions });
}
const postUpdateProduct = async (req: Request, res: Response) => {
    const { id, name, price, detailDesc, shortDesc, quantity, factory, target } = req.body as TProductSchema;
    const validation = ProductSchema.safeParse(req.body);
    if( !validation.success ) {
        const errorZod = validation.error.issues;
        const errors = errorZod?.map(item => `${item.message} (${item.path[0]})`);
        return res.render(`/admin/view-product/${id}`,{ errors: errors });
    }

    // success
    const file = req.file;
    const image = file?.filename ?? undefined;
    await handleUpdateProduct(id, name, price, detailDesc, shortDesc, quantity, factory, target,image)
    // success
    return res.redirect("/admin/product");


}

export { getAdminCreateProductPage, postAdminCreateProduct,postDeleteProduct,getViewProduct,postUpdateProduct };