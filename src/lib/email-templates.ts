export const emailTemplates = {
  patientWelcome: (firstName: string, lastName: string) => ({
    subject: "Welcome to Medynx - Registration Successful",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Medynx</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Your patient account has been successfully created. You can now:</p>
          <ul style="padding-left: 20px; color: #333;">
            <li style="margin-bottom: 8px;">Browse and book appointments with verified doctors</li>
            <li style="margin-bottom: 8px;">Manage your medical appointments</li>
            <li style="margin-bottom: 8px;">Access your consultation history</li>
          </ul>
          <div style="margin: 30px 0; text-align: center;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Get Started</a>
          </div>
          <p style="font-size: 16px; color: #333;">Thank you for choosing Medynx for your healthcare needs.</p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  doctorRegistration: (firstName: string, lastName: string, specialization: string, licenseNumber: string, experience: number) => ({
    subject: "Medynx - Doctor Registration Pending Approval",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Doctor Registration Received</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Thank you for registering as a doctor on Medynx. Your account is currently under review.</p>
          
          <div style="background: #f8fafc; border-left: 4px solid #2563eb; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Registration Details:</h3>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Specialization:</strong> ${specialization}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">License Number:</strong> ${licenseNumber}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Experience:</strong> ${experience} years</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">You will receive an email notification once your account is activated by our admin team.</p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  doctorApproval: (firstName: string, lastName: string) => ({
    subject: "Medynx - Doctor Account Approved",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #10b981; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Account Approved!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Congratulations! Your doctor account has been approved and activated.</p>
          <p style="font-size: 16px; color: #333;">You can now:</p>
          <ul style="padding-left: 20px; color: #333;">
            <li style="margin-bottom: 8px;">Access your doctor dashboard</li>
            <li style="margin-bottom: 8px;">Manage your appointment schedule</li>
            <li style="margin-bottom: 8px;">Set your availability</li>
            <li style="margin-bottom: 8px;">Conduct patient consultations</li>
          </ul>
          
          <div style="margin: 30px 0; text-align: center;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
          </div>
          
          <p style="font-size: 16px; color: #333;">Welcome to the Medynx medical team!</p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentConfirmation: (patientName: string, doctorName: string, date: string, time: string) => ({
    subject: "Appointment Confirmed - Medynx",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Appointment Confirmed</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${patientName},</p>
          <p style="font-size: 16px; color: #333;">Your appointment has been confirmed with the following details:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="background: #2563eb; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16 3V7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8 3V7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3 11H21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div>
                <p style="margin: 0; font-weight: bold; color: #2563eb;">Appointment Details</p>
              </div>
            </div>
            <div style="border-top: 1px dashed #e2e8f0; padding-top: 15px;">
              <p style="margin: 8px 0;"><strong style="color: #334155;">Doctor:</strong> ${doctorName}</p>
              <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${date}</p>
              <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${time}</p>
            </div>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #2563eb; font-size: 14px;">Please arrive 10 minutes early for your appointment.</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentReminder: (patientName: string, doctorName: string, date: string, time: string) => ({
    subject: "Appointment Reminder - Tomorrow",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #f59e0b; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Appointment Reminder</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${patientName},</p>
          <p style="font-size: 16px; color: #333;">This is a reminder that you have an appointment tomorrow:</p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong style="color: #334155;">Doctor:</strong> ${doctorName}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${time}</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Please arrive 10 minutes early for your appointment.</p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  passwordReset: (firstName: string, resetLink: string) => ({
    subject: "Password Reset - Medynx",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Password Reset Request</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${firstName},</p>
          <p style="font-size: 16px; color: #333;">You requested to reset your password. Click the button below to create a new password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          
          <div style="background: #f8fafc; border-left: 4px solid #94a3b8; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #64748b; font-size: 14px;">This link will expire in 1 hour. If you didn't request this, please ignore this email.</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  doctorDeactivation: (firstName: string, lastName: string) => ({
    subject: "Medynx - Account Deactivated",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #dc2626; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Account Deactivated</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Your doctor account has been deactivated by our admin team.</p>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626;">If you believe this is an error, please contact our support team immediately.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Contact Support</a>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  doctorVerification: (firstName: string, lastName: string) => ({
    subject: "Medynx - Account Verified",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #16a34a; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Account Verified!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Your doctor account has been verified by our admin team.</p>
          <p style="font-size: 16px; color: #333;">This verification confirms your credentials and qualifications.</p>
          
          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #166534;">Your verified status will be visible to patients on your profile.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View Profile</a>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  doctorUnverification: (firstName: string, lastName: string) => ({
    subject: "Medynx - Account Unverified",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #dc2626; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Account Unverified</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Your doctor account verification has been removed by our admin team.</p>
          
          <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #dc2626;">Please contact support if you have any questions about this decision.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Contact Support</a>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentCancellation: (patientName: string, doctorName: string, date: string, timeSlot: string, amount: number) => ({
    subject: "Medynx - Appointment Cancelled & Refund Processed",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #dc2626; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Appointment Cancelled</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${patientName},</p>
          <p style="font-size: 16px; color: #333;">Your appointment has been cancelled by our admin team.</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Appointment Details:</h3>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Doctor:</strong> Dr. ${doctorName}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${timeSlot}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Amount:</strong> ₦${amount}</p>
          </div>
          
          <div style="background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #166534;"><strong>Refund Status:</strong> Your payment of ₦${amount} has been refunded and will appear in your account within 3-5 business days.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Book New Appointment</a>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentConfirmedPatient: (patientName: string, doctorName: string, date: string, timeSlot: string, type: string) => ({
    subject: "Medynx - Appointment Confirmed",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Appointment Confirmed!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${patientName},</p>
          <p style="font-size: 16px; color: #333;">Your appointment has been confirmed and payment received.</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Appointment Details:</h3>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Doctor:</strong> Dr. ${doctorName}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${timeSlot}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Type:</strong> ${type}</p>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #2563eb; font-size: 14px;">You will receive a reminder 24 hours before your appointment.</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentBookedDoctor: (doctorName: string, patientName: string, date: string, timeSlot: string, type: string) => ({
    subject: "Medynx - New Appointment Booked",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Appointment Booked</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${doctorName},</p>
          <p style="font-size: 16px; color: #333;">A new appointment has been booked and confirmed.</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Appointment Details:</h3>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Patient:</strong> ${patientName}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${timeSlot}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Type:</strong> ${type}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">View in Dashboard</a>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  meetingLinkPatient: (patientName: string, meetingLink: string, password: string, date: string, timeSlot: string) => ({
    subject: "Medynx - Meeting Link for Your Appointment",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Your Meeting Link is Ready!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${patientName},</p>
          <p style="font-size: 16px; color: #333;">Here are your online meeting details:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Meeting Details:</h3>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Meeting Link:</strong> <a href="${meetingLink}" style="color: #2563eb; word-break: break-all;">${meetingLink}</a></p>
            ${password ? `<p style="margin: 8px 0;"><strong style="color: #334155;">Password:</strong> ${password}</p>` : ''}
            <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${timeSlot}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join Meeting</a>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #2563eb; font-size: 14px;">Please test your audio and video before the meeting starts.</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  meetingLinkDoctor: (doctorName: string, patientName: string, meetingLink: string, password: string, date: string, timeSlot: string) => ({
    subject: "Medynx - Meeting Link for Your Appointment",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #2563eb; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Meeting Link Ready!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${doctorName},</p>
          <p style="font-size: 16px; color: #333;">Here are the online meeting details for your appointment:</p>
          
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2563eb;">Meeting Details:</h3>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Meeting Link:</strong> <a href="${meetingLink}" style="color: #2563eb; word-break: break-all;">${meetingLink}</a></p>
            ${password ? `<p style="margin: 8px 0;"><strong style="color: #334155;">Password:</strong> ${password}</p>` : ''}
            <p style="margin: 8px 0;"><strong style="color: #334155;">Patient:</strong> ${patientName}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${timeSlot}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Join Meeting</a>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #2563eb; font-size: 14px;">The meeting will start automatically at the scheduled time.</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  doctorReactivation: (firstName: string, lastName: string) => ({
    subject: "Medynx - Account Reactivated",
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #10b981; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Account Reactivated!</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear Dr. ${firstName} ${lastName},</p>
          <p style="font-size: 16px; color: #333;">Great news! Your doctor account has been reactivated by our admin team.</p>
          <p style="font-size: 16px; color: #333;">You can now:</p>
          <ul style="padding-left: 20px; color: #333;">
            <li style="margin-bottom: 8px;">Access your doctor dashboard</li>
            <li style="margin-bottom: 8px;">Manage your appointment schedule</li>
            <li style="margin-bottom: 8px;">Accept new patient bookings</li>
            <li style="margin-bottom: 8px;">Conduct patient consultations</li>
          </ul>
          
          <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #166534;">Welcome back! Your account is now fully active and ready to use.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="#" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Go to Dashboard</a>
          </div>
          
          <p style="font-size: 16px; color: #333;">Thank you for your patience during the review process.</p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  }),

  appointmentReminderCustom: (recipientName: string, otherPartyName: string, appointmentDate: string, appointmentTime: string, meetingLink: string, reminderTime: string) => ({
    subject: `Appointment Reminder - ${reminderTime} to go`,
    html: `
      <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        <div style="background: #f59e0b; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">⏰ Appointment Reminder</h1>
        </div>
        <div style="padding: 30px; background: white;">
          <p style="font-size: 16px; color: #333;">Dear ${recipientName},</p>
          <p style="font-size: 16px; color: #333;">This is a friendly reminder that you have an upcoming video consultation in <strong>${reminderTime}</strong>:</p>
          
          <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="background: #f59e0b; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px;">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 10L11 14L9 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" stroke-width="2"/>
                </svg>
              </div>
              <div>
                <p style="margin: 0; font-weight: bold; color: #92400e;">Appointment Details</p>
              </div>
            </div>
            <div style="border-top: 1px dashed #f59e0b; padding-top: 15px;">
              <p style="margin: 8px 0;"><strong style="color: #334155;">With:</strong> ${otherPartyName}</p>
              <p style="margin: 8px 0;"><strong style="color: #334155;">Date:</strong> ${appointmentDate}</p>
              <p style="margin: 8px 0;"><strong style="color: #334155;">Time:</strong> ${appointmentTime}</p>
              <p style="margin: 8px 0;"><strong style="color: #334155;">Meeting Link:</strong> <a href="${meetingLink}" style="color: #2563eb; word-break: break-all;">Join Meeting</a></p>
            </div>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${meetingLink}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">🎥 Join Video Call</a>
          </div>
          
          <div style="background: #f0f9ff; border-left: 4px solid #2563eb; padding: 12px; margin: 20px 0;">
            <p style="margin: 0; color: #2563eb; font-size: 14px;">💡 <strong>Tip:</strong> Please test your audio and video before the meeting starts. Make sure you're in a quiet environment.</p>
          </div>
          
          <p style="font-size: 16px; color: #333;">We look forward to your consultation!</p>
          <p style="font-size: 16px; color: #333;">Best regards,<br><strong>Medynx Team</strong></p>
        </div>
        <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 14px; color: #64748b;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Medynx. All rights reserved.</p>
        </div>
      </div>
    `
  })
}