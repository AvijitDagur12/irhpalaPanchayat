import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "read", "replied", "resolved"],
      default: "pending",
      index: true,
    },
    adminReply: {
      type: String,
      default: "",
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

contactSchema.pre("save", function (next) {
  if (!this.ticketNumber) {
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    this.ticketNumber = `GRV-${randomSuffix}`;
  }
  next();
});

const Contact = mongoose.model("Contact", contactSchema);
export default Contact;