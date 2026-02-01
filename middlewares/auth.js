const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

dotenv.config()

const verifyToken = (req, res, next) => {
  try{
    const token = req.headers['authorization'].split(' ')[1]

    if (!token) return res.status(401).json({ 
      status: false,
      message: 'Unauthorized' 
    })

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(401).json({ message: 'Invalid Token' })
      req.userId = decoded.id
      next()
    })
  }catch(error){
    return res.status(500).send({
      status: false,
      message: "Internal Server Error",
      error: error.message
    })
  }
}

module.exports = verifyToken
