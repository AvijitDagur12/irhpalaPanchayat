import Certificate from "../models/Certificate.js";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

/**
 * Apply for a direct Gram Panchayat certificate
 * POST /api/certificate
 */
export const createCertificate = async (req, res, next) => {
  try {
    const { applicantName, fatherName, village, postOffice, monthlyIncome } = req.body;

    if (!applicantName || !fatherName || !village || !postOffice || !monthlyIncome) {
      return res.status(400).json({
        success: false,
        error: "All required fields (Applicant Name, Father Name, Village, Post Office, Income) must be provided.",
      });
    }

    const certificate = new Certificate(req.body);
    await certificate.save();

    res.status(201).json({
      success: true,
      message: "Certificate application submitted successfully.",
      data: certificate,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Retrieve certificate by Ticket ID
 * GET /api/certificate/ticket/:ticketId
 */
export const getCertificateByTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const certificate = await Certificate.findOne({
      ticketId: new RegExp(`^${ticketId.trim()}$`, "i"),
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: "No certificate application found with this Ticket ID.",
      });
    }

    res.json({ success: true, data: certificate });
  } catch (err) {
    next(err);
  }
};

/**
 * Administrative list of all direct certificates
 * GET /api/certificates
 */
export const getAllCertificates = async (req, res, next) => {
  try {
    const certificates = await Certificate.find().sort({ submittedAt: -1, createdAt: -1 });
    res.json({ success: true, data: certificates });
  } catch (err) {
    next(err);
  }
};

/**
 * Update certificate status
 * PUT /api/certificate/:id
 */
export const updateCertificateStatus = async (req, res, next) => {
  try {
    const { status, remarks } = req.body;
    const approverName = req.admin?.name || "Elected Panchayat Member";

    const certificate = await Certificate.findByIdAndUpdate(
      req.params.id,
      {
        status,
        remarks: remarks || "",
        approvedBy: approverName,
        approvedDate: new Date(),
      },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ success: false, message: "Certificate not found" });
    }

    res.json({
      success: true,
      message: `Certificate has been ${status.toLowerCase()} successfully`,
      data: certificate,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Download Bengali / Official Certificate PDF
 * GET /api/download-certificate-pdf/:id
 */
export const downloadCertificatePdf = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (!certificate) {
      return res.status(404).json({ error: "Certificate record not found" });
    }

    if (certificate.status !== "Approved") {
      return res.status(400).json({
        error: "This certificate is currently pending review and has not yet been approved.",
      });
    }

    const doc = new PDFDocument({
      margin: 40,
      size: "A4",
      layout: "portrait",
    });

    const bengaliFontPath = path.join(process.cwd(), "fonts", "NotoSansBengali-Regular.ttf");
    const hasBengali = fs.existsSync(bengaliFontPath);

    if (hasBengali) {
      doc.registerFont("Bengali", bengaliFontPath);
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Certificate_${certificate.ticketId}.pdf`
    );

    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    // Document Borders
    doc.lineWidth(2).rect(30, 30, pageWidth - 60, pageHeight - 60).stroke("#0f3b6c");
    doc.lineWidth(1).rect(35, 35, pageWidth - 70, pageHeight - 70).stroke("#b45309");

    // Header Background
    doc.rect(36, 36, pageWidth - 72, 85).fill("#0f3b6c");

    // Header Text
    doc
      .fillColor("#ffffff")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("IRHPALA GRAM PANCHAYAT", 0, 52, { align: "center", width: pageWidth });

    doc
      .fontSize(10)
      .font("Helvetica")
      .text(
        "PANCHAYAT & RURAL DEVELOPMENT DEPARTMENT • GOVT. OF WEST BENGAL",
        0,
        78,
        { align: "center", width: pageWidth }
      );

    doc
      .fontSize(9)
      .text("Ghatal Sub-Division • Paschim Medinipur District • PIN: 721212", 0, 94, {
        align: "center",
        width: pageWidth,
      });

    // Sub-header Banner
    doc
      .fontSize(16)
      .font(hasBengali ? "Bengali" : "Helvetica-Bold")
      .fillColor("#0f3b6c")
      .text("আয় সংক্রান্ত প্রশংসাপত্র / INCOME CERTIFICATE", 0, 140, {
        align: "center",
        width: pageWidth,
      });

    // Reference Row
    const dateFormatted = certificate.approvedDate
      ? new Date(certificate.approvedDate).toLocaleDateString("en-IN")
      : new Date().toLocaleDateString("en-IN");

    doc
      .fillColor("#475569")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text(`Certificate No: ${certificate.ticketId}`, 55, 175);

    doc.text(`Issue Date: ${dateFormatted}`, pageWidth - 200, 175, { align: "right", width: 145 });

    doc.moveTo(55, 192).lineTo(pageWidth - 55, 192).stroke("#e2e8f0");

    // Subject
    doc
      .fontSize(11)
      .font(hasBengali ? "Bengali" : "Helvetica-Bold")
      .fillColor("#0f3b6c")
      .text("বিষয়: আয় সংক্রান্ত সনদপত্র প্রদান প্রসঙ্গে", 55, 210);

    // Body content
    const bodyContent =
      `এই মর্মে প্রত্যয়ন করা যাচ্ছে যে, ${certificate.applicantName}, পিতা/স্বামী: ${certificate.fatherName}, ` +
      `গ্রাম: ${certificate.village}, পোস্ট অফিস: ${certificate.postOffice}, থানা: ${certificate.policeStation || "ঘাটাল"}, ` +
      `জেলা: ${certificate.district || "পশ্চিম মেদিনীপুর"} -এর একজন স্থায়ী বাসিন্দা।\n\n` +
      `তিনি এই পঞ্চায়েত এলাকার একজন পরিচিত নাগরিক। তথ্য যাচাই অনুযায়ী তাঁহার পরিবারের সমস্ত উৎস হইতে মোট মাসিক আয় আনুমানিক ` +
      `${certificate.monthlyIncome}/- টাকা (${certificate.incomeInWords || certificate.monthlyIncome}) মাত্র।\n\n` +
      `ইনি এলাকার একজন শান্তিপ্রিয় অধিবাসী। তাহার সর্বাঙ্গীন মঙ্গল কামনা করিয়া এই সনদপত্র প্রদান করা হইল।`;

    if (hasBengali) {
      doc
        .font("Bengali")
        .fontSize(12)
        .fillColor("#1e293b")
        .text(bodyContent, 55, 245, {
          width: pageWidth - 110,
          align: "left",
          lineGap: 8,
        });
    } else {
      doc
        .font("Helvetica")
        .fontSize(11)
        .fillColor("#1e293b")
        .text(
          `This is to certify that ${certificate.applicantName}, Son/Daughter/Spouse of ${certificate.fatherName}, resident of Village: ${certificate.village}, Post Office: ${certificate.postOffice}, P.S: ${certificate.policeStation}, District: ${certificate.district}, is a permanent resident. Total verified monthly family income is Rs. ${certificate.monthlyIncome}/-.`,
          55,
          245,
          { width: pageWidth - 110, lineGap: 6 }
        );
    }

    // Validity & Seal
    const footerY = pageHeight - 160;
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#64748b")
      .text("• Valid for 6 Months from issuance.", 55, footerY)
      .text("• Digital Panchayat System • Irhpala Gram Panchayat", 55, footerY + 16)
      .text("• Verify at: https://panchayat.wb.gov.in", 55, footerY + 32);

    // Signature
    const sigX = pageWidth - 230;
    doc.moveTo(sigX, footerY).lineTo(sigX + 175, footerY).stroke("#0f3b6c");

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#0f3b6c")
      .text(certificate.approvedBy || "Executive Authority", sigX, footerY + 8, {
        width: 175,
        align: "center",
      })
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#475569")
      .text("Irhpala Gram Panchayat", sigX, footerY + 22, { width: 175, align: "center" })
      .text("Ghatal, Paschim Medinipur", sigX, footerY + 35, { width: 175, align: "center" });

    doc.end();
  } catch (err) {
    next(err);
  }
};
