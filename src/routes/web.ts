import express,{Express} from "express";
import { getHomePage, postCreateUser,postDeleteUser,getViewUser,postUpdateUser } from "controllers/user.controller";
import { getDashboardPage,getAdminUserPage,getAdminOrderPage,getCreateUserPage,getAdminProductPage } from "controllers/admin/dashboard.controller";
import fileUploadMiddleware from "src/middleware/multer";
import { getProductPage } from "controllers/client/product.controller";
import { getAdminCreateProductPage,postAdminCreateProduct } from "controllers/admin/product.controller";


const router = express.Router();


const webRoutes = (app: Express) => {
    // client
    router.get("/", getHomePage)
    router.get("/product/:id", getProductPage);

    // router.get("/create-user",getCreateUserPage);

    // admin route
    router.get("/admin", getDashboardPage);
    router.get("/admin/dashboard", getDashboardPage);
    router.get("/admin/user", getAdminUserPage);
    router.get("/admin/create-user", getCreateUserPage);
    router.post("/admin/handle-create-user",fileUploadMiddleware("avatar"),postCreateUser);
    router.post("/admin/delete-user/:id",postDeleteUser);
    router.get("/admin/view-user/:id",getViewUser);
    router.post("/admin/update-user",fileUploadMiddleware("avatar"),postUpdateUser);


    



    router.get("/admin/product", getAdminProductPage);
    router.get("/admin/create-product",getAdminCreateProductPage);
    router.post("/admin/create-product",fileUploadMiddleware("image","images/product"),postAdminCreateProduct);

    // router.get("/admin/order", getAdminOrderPage);

    app.use("/", router);
}

export default webRoutes;