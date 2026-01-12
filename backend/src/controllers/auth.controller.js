import EmailRecord from '../models/emailRecord.model.js'
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { compareOtp, generateOtp } from '../utils/otp.js';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';

const emailRegex = /^\S+@\S+\.\S+$/;

export const registerEmail = async (req,res) => {
    try{

        const email = req.body?.email?.toLowerCase();

        if(!email){
            return res.status(400).json({
                success:false,
                message:"Email missing in body"
            })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success:false,
                message:"Invalid email format"
            })
        }

        const record = await EmailRecord.findOne({email});

        if(record){
            if(record.attempts >= 5){
                return res.status(400).json({
                    success:false,
                    message:"Too many requests. Try after some time."
                })
            }
            if(Date.now() < record.resendAvailableAt){
                return res.status(400).json({
                    success:false,
                    message:"Wait for one minute before requesting another otp"
                })
            }
            record.attempts+=1;
            const {otp,hashedOtp} = await generateOtp();
            record.otpHash = hashedOtp;
            record.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
            record.resendAvailableAt = new Date(Date.now() + 1 * 60 * 1000);

            // await emailTo(email,otp);
            sendEmail({
                to: email,
                subject: "Your OTP Code",
                html: `<h2>Your OTP</h2><p><b>${otp}</b></p>`,
                text: `Your OTP is ${otp}`
              })
              .then(() => {
                console.log("OTP email sent to:", email);
              })
              .catch(err => {
                console.error("OTP email failed:", err.message);
              });
              

            await record.save();

            return res.status(200).json({
                success:true,
                message:"OTP resent successfully !",
                resendAvailableAt: record.resendAvailableAt.getTime(),
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                success:false,
                message:"Email already registered. Login to your account!"
            })
        }

        const {otp, hashedOtp} = await generateOtp();

        // await emailTo(email,otp);
        sendEmail({
            to: email,
            subject: "Your OTP Code",
            html: `<h2>Your OTP</h2><p><b>${otp}</b></p>`,
            text: `Your OTP is ${otp}`
          })
          .then(() => {
            console.log("OTP email sent to:", email);
          })
          .catch(err => {
            console.error("OTP email failed:", err.message);
          });
                   

        const newRecord = await EmailRecord.create({
            email,
            attempts: 0,
            otpHash: hashedOtp,
            docExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 mins
            otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 mins
            resendAvailableAt: new Date(Date.now() + 1 * 60 * 1000), // 1 min
        });


        return res.status(200).json({
            success:true,
            message:`OTP sent to ${email}`,
            resendAvailableAt: newRecord.resendAvailableAt.getTime(),
        })

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const verifyOtp = async (req, res) => {
    try{
        console.log("verify otp route");
        const {email, otp} = req.body;

        // basic presence check:
        if(!email || !otp){
            return res.status(400).json({
                success:false,
                message:"Missing fields!"
            })
        }

        // email format check:
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success:false,
                message:"Invalid email format"
            })
        }

        const otpRegex = /^\d{6}$/;

        if (!otpRegex.test(otp)) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP format"
            });
        }

        const record = await EmailRecord.findOne({email});

        if(!record){
            return res.status(400).json({
                success:false,
                message: "Record not found (may be session expired). Start fresh registration."
            })
        }

        if(Date.now() > record.otpExpiresAt){
            return res.status(400).json({
                success:false,
                message:"OTP expired."
            })
        }
        
        const otpValid = await compareOtp(otp, record.otpHash);

        if(!otpValid){
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }

        const registrationToken = jwt.sign(
            {
              email: record.email,
              purpose: "registration",
            },
            process.env.JWT_REGISTRATION_SECRET,
            { expiresIn: "10m" }
        );

        res.cookie("registrationToken", registrationToken, {
            httpOnly: true, // true for developmet and production.
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 10 * 60 * 1000, // 10 minutes
        });

        await record.deleteOne();

        return res.status(200).json({
            success: true,
            message: "OTP verified. Proceed to complete registration.",
        });

    } catch{
        return res.status(500).json({
            success:false,
            message:"server error"
        })
    }
}

export const fillDetails = async (req, res) => {
    try{
        const token = req.cookies?.registrationToken;

        // 1. Token presence check
        if (!token) {
          return res.status(401).json({
            success: false,
            message: "Registration token missing or expired. Start fresh registration",
          });
        }

        let decoded;
        try {
          decoded = jwt.verify(token, process.env.JWT_REGISTRATION_SECRET);
        } catch (err) {
          return res.status(401).json({
            success: false,
            message: "Invalid or expired registration token. Start fresh registration",
          });
        }

        // 3. Token purpose validation
        if (decoded.purpose !== "registration") {
            return res.status(403).json({
              success: false,
              message: "Invalid token purpose. Start fresh registration",
            });
        }

        const email = decoded.email;

        // 4. Extract user data
        const { name, username, password } = req.body;

        // 5. Basic validation
        if (!name || !username || !password) {
          return res.status(400).json({
            success: false,
            message: "All fields are required",
          });
        }

        const existingEmail = await User.findOne({email});
        if(existingEmail){
            return res.status(400).json({
                success:false,
                message:"Email already exists"
            })
        }
        const existingUsername = await User.findOne({username});
        if(existingUsername){
            return res.status(400).json({
                success:false,
                message:"Username already taken."
            })
        }

        const user = await User.create({
            name,
            username,
            email,
            password, // plaintext here
        });

        // 9. Clear registration token
        res.clearCookie("registrationToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({
            success: true,
            message: "Registration completed",
            accessToken, // send access token in response
            user: {
              id: user._id,
              name: user.name,
              username: user.username,
              email: user.email,
            },
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}

export const refreshAccessToken = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
  
    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const user = await User.findById(decoded.userId);
  
    const accessToken = jwt.sign(
      {
        userId: decoded.userId,
        type: "access",
      },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );
  
    res.status(200).json({ accessToken, user });
};
  