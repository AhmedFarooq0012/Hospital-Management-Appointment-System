const PDFDocument = require("pdfkit");
const Hospital = require("../models/Hospital.model");

const generatePrescriptionPDF = async (data) => {
  // Database se Hospital Profile query karein
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

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    // Dynamic Hospital Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text(hospital.name.toUpperCase(), { align: "center" });

    doc
      .fontSize(9)
      .font("Helvetica")
      .text(hospital.address, { align: "center" })
      .text(
        `Phone: ${hospital.phone} | Emergency: ${hospital.emergencyPhone}`,
        {
          align: "center",
        },
      )
      .text(`Email: ${hospital.email} | Timings: ${hospital.timings}`, {
        align: "center",
      });

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Prescription Body
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("MEDICAL PRESCRIPTION", { align: "center" });

    doc.moveDown(1);

    doc.fontSize(11).font("Helvetica-Bold").text("Doctor Details:");
    doc.font("Helvetica").text(`Dr. ${data.doctorName}`);

    doc.moveDown(0.5);

    doc.font("Helvetica-Bold").text("Patient Details:");
    doc.font("Helvetica").text(`Name: ${data.patientName}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);

    doc.moveDown(0.5);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);

    // Medicines List
    doc.fontSize(13).font("Helvetica-Bold").text("Prescribed Medicines (Rx):");
    doc.moveDown(0.5);

    data.medicines.forEach((med, i) => {
      doc
        .fontSize(11)
        .font("Helvetica-Bold")
        .text(`${i + 1}. ${med.name}`);

      doc
        .fontSize(10)
        .font("Helvetica")
        .text(`   Dosage: ${med.dosage} | Duration: ${med.duration}`);

      if (med.instructions) {
        doc.text(`   Instructions: ${med.instructions}`);
      }
      doc.moveDown(0.5);
    });

    if (data.notes) {
      doc.moveDown(0.5);
      doc.fontSize(11).font("Helvetica-Bold").text("Advice / Notes:");
      doc.fontSize(10).font("Helvetica").text(data.notes);
    }

    doc.moveDown(2);
    doc
      .fontSize(8)
      .font("Helvetica-Oblique")
      .text("This is an electronically generated prescription.", {
        align: "center",
      });

    doc.end();
  });
};

module.exports = generatePrescriptionPDF;
