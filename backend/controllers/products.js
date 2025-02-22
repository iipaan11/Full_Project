const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

// insert a new product
const createProduct = async (req, res) => {
    const {product_id, name, description, price, category, image_url} = req.body;
    try {
        const cust = await prisma.products.create({
            data: {
                product_id, 
                name, 
                description, 
                price, 
                category, 
                image_url
            }
        });
        res.status(200).json({
            status: "ok",
            message: `User with id ${cust.product_id} created successfully`
        });
    } catch (err) {
        res.status(500).json({
            status: "error",
            message: "Error while creating the user",
            error: err.message
        });
    }
};

//get products
const getProducts = async (req, res) => {
    const custs = await prisma.products.findMany();
    res.json(custs);
}

//get only one product by id
const getProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const cust = await prisma.products.findUnique({
            where: {
                product_id: Number(id)
            },
        });
    if (!cust) {
        res.status(404).json({ 'message': 'Product not found' });
    } else {
        res.status(200).json(cust);
      }
    } catch (err) {
      res.status(500).json(err);
 }
}

//delete a product
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const existingProduct = await prisma.products.findUnique({
            where: {
                product_id: Number(id)
            }
        });
        if (!existingProduct) {
            return res.status(404).json({
                status: "error",
                message: "Customer not found"
            });
        }
        await prisma.products.delete({
            where: {
                product_id: Number(id)
            }
        });
        res.status(200).json({
            status: "ok",
            message: `Product with id ${id} deleted successfully`,
        });
    } catch (err) {
        console.error('Delete Product error', err);
        res.status(500).json({ error: err.message })
    }
}

//update a product
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    const data = {};
    if (name) data.name = name;
    if (description) data.description = description;
    if (price) data.price = price;
    if (category) data.category = category;
    if (image_url) data.image_url = image_url;

    if (Object.keys(data).length === 0) {
        return res.status(400).json({
            status: "error",
            message: "Please provide data to update"
        });
    }
    try {
        const cust = await prisma.products.update({
            where: {
                product_id: Number(id)
            },
            data
        });
        res.status(200).json({
            status: "ok",
            message: `Product with id = ${id} is updated successfully`,
            user: cust
        });
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(400).json({
                status: "error",
                message: "Email already exists"
            });
        } else if (err.code === 'P2025') {
            return res.status(404).json({
                status: "error",
                message: `User with id  = ${id} not found`
            });
        } else {
            console.error('Update Product error', err
            );
            res.status(500).json({
                status: "error",
                message: "Error updating customer",
                error: err.message
            });
        }
    }
}

module.exports = {
    createProduct, getProducts, getProduct, deleteProduct, updateProduct
}