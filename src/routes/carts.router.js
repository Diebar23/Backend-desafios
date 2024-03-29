import express from "express"; 
const router = express.Router(); 
import CartManager from "../controllers/cart-manager-db.js"; 
const cartManager = new CartManager();
import CartModel from "../models/cart.model.js";


//Crear carrito nuevo

router.post("/", async (req, res) => {
    try {
        const newCart = await cartManager.createCart(); 
        res.json(newCart)
    } catch (error) {
        console.error("Error al crear un nuevo carrito", error); 
        res.status(500).json({error: "Error del servidor"});
    }
});

//Lista de los productos que pertenecen a los carritos

router.get("/:cid", async (req, res) => {
    const cartId = req.params.cid;

    try {
        const cart = await CartModel.findById(cartId)
        
        if (!cart) {
            console.log("No existe carrito con el id");
            return res.status(404).json({ error: "Carrito no encontrado" });
        }

        return res.json(cart.products);
    } catch (error) {
        console.error("Error al obtener carrito", error);
        res.status(500).json({ error: "Error interno de servidor" });
    }
});


//Agregar productos a carritos

router.post("/:cid/product/:pid", async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    try {
        const updateCart = await cartManager.addProductToCart(cartId, productId, quantity);
        res.json(updateCart.products);
    } catch (error) {
        console.error("Error al agregar producto al carrito", error);
        res.status(500).json({ error: "Error interno del servidor" });   
    }
});

//Eliminamos un producto del carrito

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;

        const updatedCart = await cartManager.deleteProductInCart(cartId, productId);

        res.json({
            status: 'success',
            message: 'Producto eliminado correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al eliminar producto del carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//Actualizar productos del carrito 

router.put('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const updatedProducts = req.body;


    try {
        const updatedCart = await cartManager.updateCart(cartId, updatedProducts);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al actualizar el carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});


//Actualizar las cantidades

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const newQuantity = req.body.quantity;

        const updatedCart = await cartManager.updateProductQuantity(cartId, productId, newQuantity);

        res.json({
            status: 'success',
            message: 'Cantidad actualizada correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al actualizar cantidades', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});

//Vaciar el carrito 

router.delete('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        
        const updatedCart = await cartManager.emptyCart(cartId);

        res.json({
            status: 'success',
            message: 'Productos eliminados correctamente',
            updatedCart,
        });
    } catch (error) {
        console.error('Error al vaciar carrito', error);
        res.status(500).json({
            status: 'error',
            error: 'Error interno del servidor',
        });
    }
});



export default router; 