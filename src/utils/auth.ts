import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    const saltPass = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltPass);
}

export const checkPassword = async (password: string, hash: string) => {
    return await bcrypt.compare(password, hash);
};