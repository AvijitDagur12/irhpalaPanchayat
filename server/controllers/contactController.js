import Contact from "../models/Contact.js";

/**
 * Submit citizen grievance / contact query
 * POST /api/contact
 */
export const submitContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: "Name, phone number, subject, and message are required.",
      });
    }

    const contactData = {
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : "",
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      image: req.file ? `/uploads/${req.file.filename}` : null,
      status: "pending",
      submittedAt: new Date(),
    };

    const contact = new Contact(contactData);
    await contact.save();

    res.status(201).json({
      success: true,
      message: "Your grievance / inquiry has been submitted successfully.",
      data: contact,
      ticketNumber: contact.ticketNumber,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get all contact messages / grievances (admin / support)
 * GET /api/contacts
 */
export const getAllContacts = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status.toLowerCase();
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { ticketNumber: { $regex: search, $options: "i" } },
        { subject: { $regex: search, $options: "i" } },
      ];
    }

    const messages = await Contact.find(query).sort({ submittedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get single contact by ID
 * GET /api/contact/:id
 */
export const getContactById = async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, message: "Grievance record not found." });
    }
    res.json({ success: true, data: contact });
  } catch (err) {
    next(err);
  }
};

/**
 * Update contact / grievance status & reply
 * PUT /api/contact/:id
 */
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status, adminReply } = req.body;
    const update = {};

    if (status) update.status = status.toLowerCase();
    if (adminReply !== undefined) update.adminReply = adminReply;

    const contact = await Contact.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!contact) {
      return res.status(404).json({ success: false, message: "Grievance record not found." });
    }

    res.json({
      success: true,
      message: "Grievance status updated successfully.",
      data: contact,
    });
  } catch (err) {
    next(err);
  }
};
