import jwt from 'jsonwebtoken';
import dotenv from"dotenv";
dotenv.config();

const secret = process.env.JWT_SECRET;
const node_mode = process.env.NODE_ENV;

export const generateToken = (userId, res) => {
    const token = jwt.sign({userId}, secret, {expiresIn: '1d'});
    res.cookie("jwt", token, {
        maxAge: 24*60*60*1000, //ms
        httpOnly: true, //xxs Attacks
        sameSite: "strict", //CSRF Attacks
        secure: node_mode !== "development",
    })
    console.log("Toke generated ans cookie set");
    
    return token;
};