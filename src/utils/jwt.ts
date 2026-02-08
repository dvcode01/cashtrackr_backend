import { sign} from 'jsonwebtoken';

export const generateJWT = (id: string) => {
    const token = sign({id}, process.env.SECRET_JWT, {
        expiresIn: '3 days'
    });
    
    return token;
}
