import Application from "../models/Application.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

// Helper function to convert number to words
function convertToWords(num) {
  if (!num) return "Zero";
  const n = parseInt(num, 10);
  if (isNaN(n)) return num.toString();

  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

  if (n === 0) return "Zero";
  if (n < 10) return ones[n];
  if (n >= 10 && n < 20) return teens[n - 10];
  if (n >= 20 && n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
  if (n >= 100 && n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertToWords(n % 100) : "");
  if (n >= 1000 && n < 100000) return convertToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + convertToWords(n % 1000) : "");
  if (n >= 100000 && n < 10000000) return convertToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + convertToWords(n % 100000) : "");
  return `${n}`;
}

/**
 * Submit a new certificate application
 * POST /api/apply
 */
export const apply = async (req, res, next) => {
  try {
    const files = req.files || {};
    const userId = req.user?._id || req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: "User authentication or userId is required." });
    }

    const { applicantName, village, mobile, certificateType } = req.body;
    if (!applicantName || !village || !mobile) {
      return res.status(400).json({ error: "Applicant name, village, and mobile are required." });
    }

    const applicationData = {
      ...req.body,
      userId,
      certificateType: certificateType || "Residential Certificate",
      doc1File: files.doc1File ? files.doc1File[0].filename : null,
      doc2File: files.doc2File ? files.doc2File[0].filename : null,
      gsCertificate: files.gsCertificate ? files.gsCertificate[0].filename : null,
      photo: files.photo ? files.photo[0].filename : null,
      status: "Pending",
      appliedDate: new Date(),
    };

    const application = new Application(applicationData);
    await application.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      applicationId: application._id,
      applicationNumber: application.applicationNumber,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all applications for a specific user
 * GET /api/my-applications/:userId
 */
export const getUserApplications = async (req, res, next) => {
  try {
    const userId = req.user?._id || req.params.userId;
    const applications = await Application.find({ userId }).sort({ appliedDate: -1, createdAt: -1 });
    res.json(applications);
  } catch (err) {
    next(err);
  }
};

/**
 * Get single application by ID
 * GET /api/application/:id
 */
export const getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id).populate("userId", "name email phone");
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    next(err);
  }
};

/**
 * Download Approved Certificate PDF
 * GET /api/download-certificate/:applicationId
 */
export const downloadCertificate = async (req, res, next) => {
  try {
    const { applicationId } = req.params;
    const application = await Application.findById(applicationId);

    if (!application) {
      return res.status(404).json({ error: "Application record not found." });
    }

    if (application.status !== "Approved") {
      return res.status(400).json({
        error: `Certificate is not yet available. Current status: ${application.status}`,
      });
    }

    // Set PDF response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Certificate_${application.applicationNumber || application._id}.pdf`
    );

    // Create A4 PDF document
    const doc = new PDFDocument({
      size: "A4",
      margin: 40,
      info: {
        Title: `${application.certificateType} - Irhpala Gram Panchayat`,
        Author: "Government of West Bengal - Irhpala Gram Panchayat",
        Subject: "Official Digital Certificate",
      },
    });

    doc.pipe(res);

    // Decorative Borders
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Outer Navy Border
    doc.lineWidth(2).rect(30, 30, pageWidth - 60, pageHeight - 60).stroke("#1e3a8a");
    // Inner Saffron/Gold Border
    doc.lineWidth(1).rect(35, 35, pageWidth - 70, pageHeight - 70).stroke("#b45309");

    // Header Band
    doc.rect(36, 36, pageWidth - 72, 78).fill("#0f3b6c");

    doc
      .fillColor("#ffffff")
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("IRHPALA GRAM PANCHAYAT", 0, 52, { align: "center", width: pageWidth });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        "PANCHAYAT & RURAL DEVELOPMENT DEPARTMENT • GOVERNMENT OF WEST BENGAL",
        0,
        78,
        { align: "center", width: pageWidth }
      );

    doc
      .fontSize(9)
      .text("Block: Ghatal • Sub-Division: Ghatal • District: Paschim Medinipur • PIN: 721212", 0, 94, {
        align: "center",
        width: pageWidth,
      });

    // Reference and Date Row
    const issueDate = application.approvedDate
      ? new Date(application.approvedDate).toLocaleDateString("en-IN")
      : new Date().toLocaleDateString("en-IN");

    doc
      .fillColor("#334155")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(`Certificate Ref: ${application.applicationNumber || application._id}`, 50, 132);

    doc.text(`Date of Issue: ${issueDate}`, pageWidth - 200, 132, { align: "right", width: 150 });

    doc.moveTo(50, 148).lineTo(pageWidth - 50, 148).stroke("#cbd5e1");

    // Applicant Photo (if available)
    if (application.photo) {
      const photoPath = path.join(process.cwd(), "uploads", application.photo);
      if (fs.existsSync(photoPath)) {
        try {
          doc.image(photoPath, pageWidth - 140, 160, { width: 85, height: 100 });
          doc.rect(pageWidth - 140, 160, 85, 100).stroke("#94a3b8");
        } catch (e) {
          console.warn("Could not render photo in PDF:", e.message);
        }
      }
    }

    // Title of Certificate
    const certTitle = (application.certificateType || "RESIDENTIAL").toUpperCase();
    doc
      .fontSize(15)
      .font("Helvetica-Bold")
      .fillColor("#0f3b6c")
      .text(`${certTitle} CERTIFICATE`, 50, 175, { width: pageWidth - 200, align: "center" });

    doc.moveDown(0.5);
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#b45309")
      .text("TO WHOM IT MAY CONCERN", 50, 205, { width: pageWidth - 200, align: "center" });

    // Certificate Body
    const startY = 245;
    doc
      .fontSize(11)
      .font("Helvetica")
      .fillColor("#1e293b")
      .text("This is to certify that ", 55, startY, { continued: true })
      .font("Helvetica-Bold")
      .text(`${application.applicantName || "N/A"}`, { continued: true })
      .font("Helvetica")
      .text(`, ${application.relation || "Son/Daughter"} of `, { continued: true })
      .font("Helvetica-Bold")
      .text(`${application.guardianName || "N/A"}`, { continued: true })
      .font("Helvetica")
      .text(", is a permanent bona fide resident of:")
      .moveDown(0.8);

    doc
      .font("Helvetica-Bold")
      .text(
        `Village: ${application.village || "N/A"}, Post Office: ${application.post || "Irhpala"}, Police Station: ${
          application.policeStation || "Ghatal"
        }, District: ${application.district || "Paschim Medinipur"}, PIN: ${application.pin || "721212"}.`,
        { indent: 20 }
      )
      .moveDown(1);

    doc
      .font("Helvetica")
      .text(
        `He / She is well known to this Gram Panchayat authority and holds a reputable standing in the village community.`,
        55,
        doc.y,
        { width: pageWidth - 110 }
      )
      .moveDown(0.8);

    if (certTitle.includes("INCOME")) {
      const incomeWords = convertToWords(application.annualIncome || "96000");
      doc
        .font("Helvetica")
        .text(
          `According to verification records and local inquiry, the gross annual family income from all sources does not exceed `,
          55,
          doc.y,
          { continued: true, width: pageWidth - 110 }
        )
        .font("Helvetica-Bold")
        .text(`Rs. ${application.annualIncome || "96,000"}/- (Rupees ${incomeWords} Only).`)
        .moveDown(0.8);
    }

    doc
      .font("Helvetica")
      .text(
        `This digital certificate is officially issued upon citizen application for ${application.certificateType.toLowerCase()} purposes and is valid across government institutions and legal proceedings.`,
        55,
        doc.y,
        { width: pageWidth - 110 }
      );

    // Official Verification Note
    const verifY = pageHeight - 200;
    doc
      .fontSize(9)
      .font("Helvetica-Oblique")
      .fillColor("#64748b")
      .text("Validity: 6 (Six) Months from date of issuance.", 55, verifY)
      .text("Official Portal Verification: https://panchayat.wb.gov.in", 55, verifY + 15)
      .text(`Unique Certificate ID: ${application.applicationNumber || application._id}`, 55, verifY + 30);

    // Signature Box
    const sigX = pageWidth - 240;
    const sigY = pageHeight - 160;

    doc.moveTo(sigX, sigY).lineTo(sigX + 180, sigY).stroke("#0f3b6c");

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#0f3b6c")
      .text("Executive Pradhan / Authority", sigX, sigY + 8, { width: 180, align: "center" })
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#334155")
      .text("Irhpala Gram Panchayat", sigX, sigY + 22, { width: 180, align: "center" })
      .text("Ghatal, Paschim Medinipur", sigX, sigY + 35, { width: 180, align: "center" });

    doc.end();
  } catch (err) {
    next(err);
  }
};
