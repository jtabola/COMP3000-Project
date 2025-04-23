import React from 'react';
import  './Contact.css';

function Contact() {
  return (
    <div>
        <h1 className="main-title">Contact Us</h1>
        <div className="contact-container">
            {/* Left Section */}
            <div className="contact-info">
              <h2>Get in Touch with Us</h2>
              <p>We'd love to hear from you! Whether you have a question, feedback, or need assistance, feel free to reach out to us.</p>
              <p>Email: support@example.com</p>
            </div>

            {/* Right Section (Form) */}
            <div className="contact-form">
                <h2>Contact Form</h2>
                <form>
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" id="name" className="form-control" required />

                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" className="form-control" required />

                    <label htmlFor="reason" className="form-label">Reason for Inquiry</label>
                    <textarea id="reason" className="form-control" required />
                    <button type="submit">Submit</button>
                </form>
                
            </div>
        </div>
    </div>
  );
}
export default Contact;