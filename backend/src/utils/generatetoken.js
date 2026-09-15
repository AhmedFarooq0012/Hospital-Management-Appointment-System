const jwt = require('jsonwebtoken');
const generateToken = (id,role)=>{
    const seceret=process.env.JWT_SECRET;
    const tokenexpire = jwt.sign({id,role},seceret,{
        expiresIn:'30d'
        });
    return tokenexpire;
}
module.exports=generateToken;