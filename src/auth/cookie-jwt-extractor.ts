import { Request } from "express";

export const cookieExtractor = (req: Request) : string => {
    /**
     * Function to extract the JWT Token from the Cookie
     */
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['id_token'];
    } 
    if (!token) console.error("Auth cookie not found")
    return token;
};