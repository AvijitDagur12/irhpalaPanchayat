import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
    },
    subject: {
      type: String,
      default: "আয় সংক্রান্ত সনদপত্র",
    },
    applicantName: {
      type: String,
      required: [true, "Applicant name is required"],
      trim: true,
    },
    fatherName: {
      type: String,
      required: [true, "Father/Guardian name is required"],
      trim: true,
    },
    village: {
      type: String,
      required: [true, "Village is required"],
      trim: true,
    },
    postOffice: {
      type: String,
      required: [true, "Post office is required"],
      trim: true,
    },
    policeStation: {
      type: String,
      default: "ঘাটাল",
    },
    district: {
      type: String,
      default: "পশ্চিম মেদিনীপুর",
    },
    monthlyIncome: {
      type: String,
      required: [true, "Monthly income is required"],
    },
    incomeInWords: {
      type: String,
      default: "",
    },
    gramPanchayat: {
      type: String,
      default: "ইরপালা গ্রাম পঞ্চায়েত",
    },
    block: {
      type: String,
      default: "ঘাটাল",
    },
    certificateType: {
      type: String,
      default: "আয় সংক্রান্ত সনদপত্র",
    },
    status: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected"],
      index: true,
    },
    remarks: {
      type: String,
      default: "",
    },
    approvedBy: {
      type: String,
      default: "",
    },
    approvedDate: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.pre("save", function (next) {
  if (!this.ticketId) {
    const idSuffix = this._id ? this._id.toString().slice(-8).toUpperCase() : Math.random().toString(36).substring(2, 10).toUpperCase();
    this.ticketId = `TKT-${idSuffix}`;
  }
  next();
});

const Certificate = mongoose.model("Certificate", certificateSchema);
export default Certificate;
