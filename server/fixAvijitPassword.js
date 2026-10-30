import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import Admin from "./models/Admin.js";

dotenv.config();

const fix = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const email = "admin@panchayat.gov.in";
    const newPlainPassword = "Avijit@2004";

    // Check current state first
    const before = await Admin.findOne({ email });
    if (!before) {
      console.log(`❌ No admin found with email: ${email}`);
      process.exit(1);
    }

    console.log("🔍 BEFORE:");
    console.log({
      email: before.email,
      name: before.name,
      role: before.role,
      isActive: before.isActive,
      storedPasswordPreview: before.password
        ? before.password.slice(0, 30) + "..."
        : "none",
      looksLikeHash: before.password?.startsWith("$2"),
    });

    // Hash the new password properly
    const hashed = await bcrypt.hash(newPlainPassword, 10);

    // Update DB
    await Admin.updateOne(
      { email },
      { $set: { password: hashed, isActive: true } }
    );

    // Verify by comparing
    const after = await Admin.findOne({ email });
    const verify = await bcrypt.compare(newPlainPassword, after.password);

    console.log("\n🔍 AFTER:");
    console.log({
      email: after.email,
      isActive: after.isActive,
      storedPasswordPreview: after.password.slice(0, 30) + "...",
      looksLikeHash: after.password.startsWith("$2"),
    });

    console.log(
      `\n🔐 bcrypt.compare("${newPlainPassword}", storedHash) = ${verify}`
    );

    if (verify) {
      console.log(`\n✅ SUCCESS — you can now log in with:`);
      console.log(`   Email:    ${email}`);
      console.log(`   Password: ${newPlainPassword}`);
    } else {
      console.log(`\n❌ Verification failed — something is off.`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

fix();