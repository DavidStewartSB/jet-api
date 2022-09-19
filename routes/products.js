const {Product} = require('../models/product')
const express = require('express')
const router = express.Router()
const multer = require('multer')
const mongoose = require('mongoose')
const { Category } = require('../models/category')

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
  'image/webp': 'webp'
}

//Upload das imagens
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      const isValid = FILE_TYPE_MAP[file.mimetype]
      let uploadError = new Error('formato de imagem invalido')
      if(isValid){
          uploadError = null
      }
    cb(uploadError, 'public/upload')
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-')
    const extension = FILE_TYPE_MAP[file.mimetype]
    cb(null, `${Date.now()}-${fileName}`)
  }
})

const uploadOptions = multer({ storage: storage })

//GET
router.get('/', async (req, res) =>{
  let filter = {}
  if(req.query.categories){
    filter = {category: req.query.categories.split(',')}
  }
  const productList = await Product.find(filter).populate('category')

  if (!productList) return res.status(400).json({success: false})
  res.send(productList)
})

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id)
  if(!product) return res.status(500).json({success: false, message: 'Produto não encontrado'})
  res.send(product)
})

router.get('get/count', async (req, res) => {
  Product.countDocuments().then(count => {
    if(count){
      return res.status(200).json({productCount: count})
    } else {
      return res.status(500).json({success: false, message: 'Erro ao efetuar contagem'})
    }
  }).catch(err => {
    return res.status(400).json({succes: false, error: err})
  })
})

router.get('get/promo/:count', async(req, res) => {
  const count = req.params.count ? req.params.count : 0
  const products = await Product.find({promo: true}).limit(+count)
  if(!products) return res.status(500).json({success: false, message: 'Erro ao efetuar leitura'})
  res.send(products)
})

router.post('/', uploadOptions.single('image'), async (req,res) => {
  //Vinculo de categoria por ID
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send('Categoria invalida')

  //Post das imagens via backend com Multer
  const file = req.file
    if(!file) return res.status(400).send('Arquivo de imagem não encontrada')
    const fileName = req.file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`

  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    promo: req.body.promo,
    IsPromo: req.body.IsPromo,
    countInStock: req.body.countInStock,
    description: req.body.description,
    status: req.body.status,
    image : `${basePath}${fileName}`, //http://localhost:3000/public/upload/img
  })
  this.product = await product.save()
  if(!product) return res.status(500).json({success: false, message: 'Erro ao criar produto'})
  res.send({success: true, message: 'Produto postado com sucesso', product})
})

router.put('/:id',uploadOptions.single('image'), async (req, res ) => {
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400).send('Id do produto invalido')
  const category = await Category.findById(req.body.category)
  if(!category) return res.status(400).send(`Produto com id: ${id} inválido`)

  const product = await Product.findById(req.params.id)
  if(!product) return res.status(400).send({success: false, message: "Producto Inválido"})

  const file = req.file
  let imagepath

  if(file) {
    const fileName = file.filename
    const basePath = `${req.protocol}://${req.get('host')}/public/upload`
    imagepath = `${basePath}${fileName}`
  } else {
    imagepath = product.image
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    price: req.body.price,
    promo: req.body.promo,
    IsPromo: req.body.IsPromo,
    countInStock: req.body.countInStock,
    description: req.body.description,
    status: req.body.status,
    image: imagepath
  }, {new: true})

  if(!updatedProduct) return res.status(500).send('Erro ao criar produto')
  res.send(updatedProduct)
})

router.put(`/gallery-images/:id`, uploadOptions.array('images', 10), async(req, res) =>{
  if(!mongoose.isValidObjectId(req.params.id)) return res.status(400)
  .send({success: false, message: 'Id do Produto inválido'})

  const files = req.files
  let imagesPath = []
  const basePath = `${req.protcol}://${req.get('host')}/public/upload`
  if(files){
    files.map(file => {
      imagesPath.push(`${basePath}${file.fileName}`)
    })
  }
  const product = await Product.findByIdAndUpdate(req.params.id, {images: imagesPath}, {new: true})

  if(!product) return res.status(500).send('Erro ao editar produto')
  res.status(200).json({success: true, message: 'Imagens atualizadas com sucesso', product})
})

router.delete('/:id', async (req, res) =>{
  Product.findByIdAndDelete(req.params.id).then(product => {
    if(product){
      return res.status(200).json({success: true, message: 'Produco removido com sucesso', product})
    } else {
      return res.status(404).json({success: false, message: 'Produto não encontrado'})
    }
  }).catch(err => {
    return res.status(500).json({success: false, error: err})
  })
})

module.exports = router;