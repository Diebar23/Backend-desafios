const ProductModel = require("../models/product.model.js");
const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

class ViewsController {
    async renderProducts(req, res) {
        try {
            const { page = 1, limit = 2 } = req.query;

            const skip = (page - 1) * limit;

            const products = await ProductModel
                .find()
                .skip(skip)
                .limit(limit);

            const totalProducts = await ProductModel.countDocuments();

            const totalPages = Math.ceil(totalProducts / limit);

            const hasPrevPage = page > 1;
            const hasNextPage = page < totalPages;


            const newArray = products.map(product => {
                const { _id, ...rest } = product.toObject();
                return { id: _id, ...rest }; 
                
                // Agregar el ID al objeto
            });

            
            const cartId = req.user.cart.toString();
            console.log(cartId);

            res.render("products", {
                products: newArray,
                hasPrevPage,
                hasNextPage,
                prevPage: page > 1 ? parseInt(page) - 1 : null,
                nextPage: page < totalPages ? parseInt(page) + 1 : null,
                currentPage: parseInt(page),
                totalPages,
                cartId
            });

        } catch (error) {
            console.error("Error al obtener productos", error);
            res.status(500).json({
                status: 'error',
                error: "Error interno del servidor"
            });
        }
    }

    async renderCart(req, res) {
        const cartId = req.params.cid;
        try {
            const cart = await cartRepository.getProductFromCart(cartId);

            if (!cart) {
                console.log("No existe carrito con ese id");
                return res.status(404).json({ error: "Carrito no encontrado" });
            }

            let totalPurchase = 0;

            const productsInCart = cart.products.map(item => {
                const product = item.product.toObject();
                const quantity = item.quantity;
                const totalPrice = product.price * quantity;
                
                totalPurchase += totalPrice;

                return {
                    product: { ...product, totalPrice },
                    quantity,
                    cartId
            };

        });


            res.render("carts", { products: productsInCart });
        } catch (error) {
            console.error("Error al obtener carrito", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderLogin(req, res) {
        res.render("login");
    }

    async renderRegister(req, res) {
        res.render("register");
    }

    async renderRealTimeProducts(req, res) {
        try {
            res.render("realtimeproducts", {role: usuario.role, email: user.email});
        } catch (error) {
            console.log("error en la vista real time", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }

    async renderChat(req, res) {
        res.render("chat");
    }

    async renderHome(req, res) {
        res.render("home");
    }

    //Tercer integradora: 
    async renderPasswordReset(req, res) {
        res.render("passwordreset");
    }

    async renderPasswordChange(req, res) {
        res.render("passwordchange");
    }

    async renderConfirmation(req, res) {
        res.render("confirmation-send");
    }

    async renderPremium(req, res) {
        res.render("panel-premium");
    }
}

module.exports = ViewsController;