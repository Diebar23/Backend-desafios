const ProductModel = require("../models/product.model.js");


//agregar productos

class ProductRepository {
    async addProduct({ title, description, price, img, code, stock, category, thumbnails }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("Todos los campos son obligatorios");
                return;
            }

            const existingProduct = await ProductModel.findOne({ code: code });

            if (existingProduct) {
                console.log("El código debe ser único");
                return;
            }

            const newProduct = new ProductModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
                thumbnails: thumbnails || []
            });

            await newProduct.save();

            return newProduct;

        } catch (error) {
            throw new Error("Error");
        }
    }

//obtener productos: 

async getProducts(limit = 10, page = 1, sort, query) {
    try {
        const skip = (page - 1) * limit;

        let queryOptions = {};

        if (query) {
            queryOptions = { category: query };
        }

        const sortOptions = {};
        if (sort) {
            if (sort === 'asc' || sort === 'desc') {
                sortOptions.price = sort === 'asc' ? 1 : -1;
            }
        }

        const products = await ProductModel
            .find(queryOptions)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        const totalProducts = await ProductModel.countDocuments(queryOptions);
        
        const totalPages = Math.ceil(totalProducts / limit);
        
        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        

        return {
            docs: products,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
            nextLink: hasNextPage ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
        };
    } catch (error) {
        throw new Error("Error");
    }
}

//obtener producto x id: 

async getProductById(id) {
    try {
        const product = await ProductModel.findById(id);

        if (!product) {
            console.log("Producto no encontrado");
            return null;
        }

        console.log("Producto encontrado");
        return product;
    } catch (error) {
        throw new Error("Error");
    }
}
//Actualizar por ID 

async updateProduct(id, updatedProduct) {
    try {
        const updated = await ProductModel.findByIdAndUpdate(id, updatedProduct);
        if (!updated) {
            console.log("No se encuentra che el producto");
            return null;
        }

        console.log("Producto actualizado con exito");
        return updated;
    } catch (error) {
        throw new Error("Error");
    }
}

//Eliminar producto: 

async deleteProduct(id) {
    try {
        const deleted = await ProductModel.findByIdAndDelete(id);

        if (!deleted) {
            console.log("No encontrado");
            return null;
        }

        console.log("Producto eliminado exitosamente");
        return deleted;
    } catch (error) {
        throw new Error("Error");
    }
}
}

module.exports = ProductRepository;