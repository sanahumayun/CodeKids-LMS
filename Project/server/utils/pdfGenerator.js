const PDFDocument = require("pdfkit");
const { WritableStreamBuffer } = require("stream-buffers");

const generateFeedbackPDF = async (feedback) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const bufferStream = new WritableStreamBuffer();

    doc.pipe(bufferStream);

    // Header with logo
    doc.image("logo.png", 50, 45, { width: 75 })
       .fontSize(20)
       .text("Course Evaluation Report", 110, 57, { align: "centre"})
       .moveDown();

    // Details
    doc.fontSize(14)
       .text(`Student: ${feedback.studentId.name}`)
       .text(`Course: ${feedback.courseId.title}`)
       .text(`Tutor: ${feedback.tutorId.name}`)
       .moveDown()
       .text(`Comments: ${feedback.comments}`)
       .moveDown();

    Object.entries(feedback.ratings).forEach(([key, value]) => {
      doc.text(`${key}: ${value}/5`);
    });

    doc.end();

    bufferStream.on("finish", () => {
      const buffer = bufferStream.getContents();
      resolve(buffer);
    });

    bufferStream.on("error", reject);
  });
};

module.exports = generateFeedbackPDF;
