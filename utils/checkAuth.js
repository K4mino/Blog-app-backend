import jwt  from "jsonwebtoken"

export default async(req,res,next) => {
    try {
        const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')

        if(!token){
            return res.status(403).json()
        }else {
            const decoded = jwt.verify(token,'secretKey')

            req.userId = decoded._id
            next()
        }
    } catch (error) {
        
    }
}