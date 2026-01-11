import bcrypt from "bcryptjs";

const salt = 10;

export async function generateOtp(){
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, salt);
    return {otp, hashedOtp}
}

export async function compareOtp(otp, hashedOtp){
    return bcrypt.compare(otp, hashedOtp);
}