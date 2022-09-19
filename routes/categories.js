const {Category} = require('../models/category')
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
    const categoryList = await Category.find()

    if(!categoryList) {
        res.status(500).json({success: false, message: 'erro no servidor'})
    }
    res.status(200).send(categoryList)
})

router.get('/:id', async (req, res) => {
    const category = await Category.findById(req.params.id)

    if(!category) return res.status(500).json({message: 'Categoria não encontrada'})
    res.status(200).send(category)
})
router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon
    })

    category = await category.save() //mongoose saved
    if(!category){
        return res.status(404).send('Erro ao criar categoria')
    } 
    res.send(category)
})
router.put('/:id', async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon
    }, {new: true})

    
    if(!category) return res.status(400).send('Erro ao encontrar categoria')
    res.send(category)
})
router.delete('/:id', async (req, res) => {
    await Category.findByIdAndRemove(req.params.id).then(category => {
        if(category){
            return res.status(200)
            .json({success: true, message: "Categoria deletada com sucesso", category})
        } else {
            return res.status(404)
            .json({success: false, message: 'Erro ao deletar Categoria!'})
        }
    }).catch(err => {
        return res.status(400).json({success: false, error: err})
    })
})

module.exports = router;