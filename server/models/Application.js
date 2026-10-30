import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applicationNumber: {
      type: String,
      unique: true,
      index: true,
    },
    // Location Details
    district: { type: String, default: "Paschim Medinipur" },
    block: { type: String, default: "Ghatal" },
    gramPanchayet: { type: String, default: "Irhpala" },
    sansad: { type: String, default: "" },

    // Personal Details
    salutation: { type: String, default: "Mr." },
    applicantName: { type: String, required: [true, "Applicant name is required"], trim: true },
    guardianName: { type: String, required: [true, "Guardian name is required"], trim: true },
    relation: { type: String, default: "Father" },
    address: { type: String, default: "" },
    // NOT UNIQUE - a citizen can apply for multiple certificates
    email: { type: String, lowercase: true, trim: true, default: "" },
    post: { type: String, default: "" },
    policeStation: { type: String, default: "Ghatal" },
    village: { type: String, required: true },
    pin: { type: String, default: "721212" },
    dob: { type: String, default: "" },
    aadhar: { type: String, default: "" },

    // Application & Certificate Details
    certificateType: {
      type: String,
      required: [true, "Certificate type is required"],
      default: "Residential Certificate",
    },
    annualIncome: { type: String, default: "96000" },
    mobile: { type: String, required: true },
    whatsapp: { type: String, default: "" },

    // Document attachments
    doc1Type: { type: String, default: "" },
    doc1Number: { type: String, default: "" },
    doc1File: { type: String, default: null },
    doc2Type: { type: String, default: "" },
    doc2Number: { type: String, default: "" },
    doc2File: { type: String, default: null },
    gsCertificate: { type: String, default: null },
    photo: { type: String, default: null },

    // Review & Workflow
    status: {
      type: String,
      enum: ["Pending", "Under Review", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    remarks: { type: String, default: "" },
    approvedBy: { type: String, default: "" },
    approvedDate: { type: Date, default: null },
    appliedDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate human-readable applicationNumber if not present
applicationSchema.pre("save", function (next) {
  if (!this.applicationNumber) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().getFullYear();
    const idSuffix = this._id ? this._id.toString().slice(-4).toUpperCase() : randomSuffix;
    this.applicationNumber = `IRH-${datePrefix}-${idSuffix}`;
  }
  next();
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
