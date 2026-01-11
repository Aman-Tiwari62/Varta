import mongoose from "mongoose";

const emailRecordSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index:true,
    },
    attempts: {
      type: Number,
      required:true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    docExpiresAt: {
        type: Date,
        required: true,
        expires: 0,
    },
    otpExpiresAt: {
        type: Date,
        required: true,
    },
    resendAvailableAt: {
        type: Date,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmailRecord = mongoose.model("EmailRecord", emailRecordSchema);
export default EmailRecord;
