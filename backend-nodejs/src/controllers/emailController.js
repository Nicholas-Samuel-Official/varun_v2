const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create reusable transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'your-app-password',
  },
});

// Send appointment notification to expert
const sendAppointmentNotification = async (req, res) => {
  try {
    const { name, phone, location, preferredDate, preferredTime, notes } = req.body;

    // Validate required fields
    if (!name || !phone || !preferredDate || !preferredTime) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    const expertEmail = 'fayasmf2007@gmail.com';

    // Create email content
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@varun.app',
      to: expertEmail,
      subject: `New Appointment Request from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: #1e88e5; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">New Appointment Request</h1>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px;">
            <h2 style="color: #333; border-bottom: 2px solid #1e88e5; padding-bottom: 10px;">Customer Details</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 12px; background-color: #f8f9fa; font-weight: bold; width: 40%;">Name:</td>
                <td style="padding: 12px; background-color: white;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background-color: #f8f9fa; font-weight: bold;">Phone:</td>
                <td style="padding: 12px; background-color: white;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background-color: #f8f9fa; font-weight: bold;">Location:</td>
                <td style="padding: 12px; background-color: white;">${location || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background-color: #f8f9fa; font-weight: bold;">Preferred Date:</td>
                <td style="padding: 12px; background-color: white;">${preferredDate}</td>
              </tr>
              <tr>
                <td style="padding: 12px; background-color: #f8f9fa; font-weight: bold;">Preferred Time:</td>
                <td style="padding: 12px; background-color: white;">${preferredTime}</td>
              </tr>
            </table>

            ${notes ? `
              <div style="margin-top: 25px;">
                <h3 style="color: #333; border-bottom: 2px solid #1e88e5; padding-bottom: 10px;">Additional Notes</h3>
                <p style="padding: 15px; background-color: #f8f9fa; border-left: 4px solid #1e88e5; margin-top: 10px;">
                  ${notes}
                </p>
              </div>
            ` : ''}

            <div style="margin-top: 30px; padding: 20px; background-color: #e3f2fd; border-radius: 8px; text-align: center;">
              <p style="margin: 0; color: #1976d2; font-weight: bold;">Please contact the customer to confirm the appointment</p>
            </div>
          </div>

          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This is an automated notification from Varun - Rainwater Harvesting App</p>
            <p>Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          </div>
        </div>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    logger.info(`Appointment notification sent: ${info.messageId}`);
    
    return res.status(200).json({
      success: true,
      message: 'Appointment notification sent to expert',
      messageId: info.messageId,
    });

  } catch (error) {
    logger.error(`Email sending error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to send appointment notification',
      error: error.message,
    });
  }
};

module.exports = {
  sendAppointmentNotification,
};
