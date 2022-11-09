import Product from '../../models/Products.model'

const { isDuplicate } = require('../../utils/validators')

// /GET /
export const getAllProducts = async (req: any, res: any) => {
    try {

        const products = await Product.find()
        res.send(products)

    } catch (e) {
        res.status(500).send(e)
    }
}

// /GET /:id
export const getProductById = async (req: any, res: any) => {

    const pId = req.params.id

    try {
        const product = await Product.findById(pId)
        res.send(product) // for now!

    } catch (e) {
        res.status(500).send(e)
    }
}

// /POST /
export const createNewProduct = async (req: any, res: any) => {

    const newProduct = {
        ...req.body,
        owner: req.user.username,
    }

    try {
        // const isDuplicate = await Product.find({ name: newProduct.name})
        const _isDuplicate = await isDuplicate({ name: newProduct.name }, Product)
        if (_isDuplicate) return res.status(400).send({ name: 'this name is taken' })

        const product = new Product(newProduct)
        await product.save()

        res.status(201).send(product)

    } catch (e) {
        res.status(500).send(e)
    }
}

// /PUT /:id
// TODO: fix this
export const updateProduct = async (req: any, res: any) => {
    const { username } = req.user // this is the current user

    const updates = Object.keys(req.body)
    const id = req.params.id
    console.log(id)

    try {

        const product: any = await Product.findById(id)

        if (product) {
            return res.status(404).send({ general: 'not found!' })
        }

        // to check ownership
        if (product.owner !== username) {
            return res.status(403).send({
                message: 'you are not allowed to update a product that is not yours'
            })
        }

        const allowedUpdates = [
            'name',
            'desc',
            'categories',
            'price',
            'showcase',
            'rating',
        ] // this is for later


        if (updates.length < 1) {
            return res.send({ general: 'there is nothing to update here!' })
        }

        updates.forEach((update: any) => (product[update] = req.body[update]))
        await product.save()


        res.send({ general: 'updated' }) // for now!

    } catch (e) {

        return res.status(500).send({ general: 'not found!' })

    }
}

// /DELETE /:id
export const deleteProductById = async (req: any, res: any) => {
    try {
        await Product.findOneAndDelete({ id: req.params.id, owner: req.user.username })
        res.send({ message: 'user deleted' })

    } catch (e) {
        res.status(500).send(e)

    }

}


export default {
    getAllProducts,
    getProductById,
    createNewProduct,
    updateProduct,
    deleteProductById,
}