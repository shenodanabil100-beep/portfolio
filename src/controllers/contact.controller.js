const { addContactMessage } = require("../data/store");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* POST /api/contact
   Body: { name, email, subject, message }
*/
function submitContactForm(req, res) {
  const { name, email, subject, message } = req.body || {};
  const errors = {};

  if (!name || !String(name).trim()) errors.name = "Please enter your name.";
  if (!email || !EMAIL_RE.test(String(email).trim())) errors.email = "Please enter a valid email address.";
  if (!subject || !String(subject).trim()) errors.subject = "Please enter a subject.";
  if (!message || !String(message).trim()) errors.message = "Please enter your message.";

  if (Object.keys(errors).length) {
    return res.status(400).json({ error: "validation_failed", fields: errors });
  }

  const entry = addContactMessage({
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  });

  res.status(201).json({
    data: { id: entry.id, createdAt: entry.createdAt },
    message: "Thank you! Your message has been sent. We will respond within 24 hours.",
  });
}

module.exports = { submitContactForm };
