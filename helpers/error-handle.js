function errorHandler(err, req, res, next){
    if(err.name === 'UnauthorizedError') {
        return res.status(401).json({message: 'Usuário sem autorização'})
    }
    if(err.name === 'ValidationError') {
        return res.status(401).json({message: 'Erro de validação'})
    }

    return res.status(500).json({message: 'erro no servidor', success: false})
}
module.exports = errorHandler;