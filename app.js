const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const errorHandler = require('./helpers/error-handle')

require('dotenv/config')

app.use(cors());
app.options('*', cors());
//Middlewares
app.use(express.json())
app.use(morgan('tiny')) //log das request no terminal
app.use('/public/upload', express.static(__dirname + '/public/upload'))
app.use(errorHandler)

//Routes
const productsRoutes = require('./routes/products')
const categoriesRoutes = require('./routes/categories')

const api = process.env.API_URL;
const port = process.env.PORT || 3000

app.use(`${api}/products`, productsRoutes)
app.use(`${api}/categories`, categoriesRoutes)

//Connect Database
mongoose.connect(process.env.CONNECTION_STRING).then(() => {
    console.log('Conexão com o banco: Completa!')
}).catch(err => {
    console.log(err)
})
//Servidor local
app.listen(port, () => {
    console.log('Server rodando na porta http://localhost:3000')
})