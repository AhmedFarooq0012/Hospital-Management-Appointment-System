const Prescription = require("../models/Prescription.model");
const Appointment = require("../models/Appointment.model");
const Hospital = require("../models/Hospital.model");
const generatePrescriptionPDF = require("../utils/generatePdf");
const sendEmail = require("../utils/sendEmail");

// @desc    Save or Update Prescription Draft (Without sending email)
// @route   POST /api/prescriptions/save
// @access  Private (Doctor only)
const saveOrUpdatePrescription = async (req, res) => {
  try {
    const { appointmentId, medicines, diagnosis, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Doctor authorization check
    if (appointment.doctor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized for this appointment" });
    }

    // Check if prescription already exists (Upsert Logic)
    let prescription = await Prescription.findOne({
      appointment: appointmentId,
    });

    if (prescription) {
      // Update existing prescription
      prescription.medicines = medicines || prescription.medicines;
      prescription.diagnosis =
        diagnosis !== undefined ? diagnosis : prescription.diagnosis;
      prescription.notes = notes !== undefined ? notes : prescription.notes;
      await prescription.save();
    } else {
      // Create new prescription entry
      prescription = await Prescription.create({
        appointment: appointmentId,
        doctor: req.user._id,
        patient: appointment.patient,
        medicines,
        diagnosis,
        notes,
      });
    }

    res.status(200).json({
      success: true,
      message: "Prescription saved/updated successfully.",
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Finalize Prescription & Send PDF Email to Patient
// @route   POST /api/prescriptions/send-email/:appointmentId
// @access  Private (Doctor only)
const sendPrescriptionEmail = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // Fetch prescription with populated patient and doctor details
    const prescription = await Prescription.findOne({
      appointment: appointmentId,
    })
      .populate("patient", "name email")
      .populate("doctor", "name");

    if (!prescription) {
      return res
        .status(404)
        .json({
          message: "No saved prescription found. Please save medicines first.",
        });
    }

    const appointment = await Appointment.findById(appointmentId);

    // Fetch dynamic Hospital Branding
    let hospital = await Hospital.findOne();
    if (!hospital) {
      hospital = {
        name: "CITY HOSPITAL",
        address: "123 Healthcare Ave, Medical District",
        phone: "+123-456-7890",
        emergencyPhone: "+123-999-9111",
        email: "info@hospital.com",
        timings: "Mon - Sat: 08:00 AM - 10:00 PM",
      };
    }

    // 1. Generate Final PDF Buffer
    const pdfBuffer = await generatePrescriptionPDF({
      doctorName: prescription.doctor.name,
      patientName: prescription.patient.name,
      medicines: prescription.medicines,
      diagnosis: prescription.diagnosis,
      notes: prescription.notes,
    });

    // 2. Email Body Design
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="text-align: center; border-bottom: 2px solid #0056b3; padding-bottom: 10px; margin-bottom: 15px;">
          <h2 style="color: #0056b3; margin: 0;">${hospital.name.toUpperCase()}</h2>
          <p style="font-size: 12px; color: #555; margin: 3px 0;">${hospital.address}</p>
          <p style="font-size: 12px; color: #555; margin: 3px 0;">Phone: ${hospital.phone} | Emergency: ${hospital.emergencyPhone}</p>
        </div>
        <p>Dear <strong>${prescription.patient.name}</strong>,</p>
        <p>Your consultation with <strong>Dr. ${prescription.doctor.name}</strong> has been completed.</p>
        <p>Please find your official medical prescription attached as a PDF file.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #777; text-align: center;">Timings: ${hospital.timings}</p>
      </div>
    `;

    // 3. Send Email with Attached PDF
    await sendEmail({
      email: prescription.patient.email,
      subject: `Official Prescription - ${hospital.name} (Dr. ${prescription.doctor.name})`,
      html: emailHtml,
      attachments: [
        {
          filename: `Prescription_${appointmentId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    // 4. Update Appointment Status to Completed
    appointment.status = "completed";
    await appointment.save();

    res.status(200).json({
      success: true,
      message: "Final prescription sent to patient via email successfully!",
      data: prescription,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  saveOrUpdatePrescription,
  sendPrescriptionEmail,
};
