const { addNewsletterSubscriber } = require("../data/store");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* POST /api/newsletter
   Body: { email }
*/
function subscribe(req, res) {
  const { email } = req.body || {};

  if (!email || !EMAIL_RE.test(String(email).trim())) {
    return res.status(400).json({ error: "validation_failed", fields: { email: "Please enter a valid email address." } });
  }

  const { email: normalized, alreadySubscribed } = addNewsletterSubscriber(email);

  res.status(alreadySubscribed ? 200 : 201).json({
    data: { email: normalized, alreadySubscribed },
    message: alreadySubscribed ? "You're already subscribed!" : "Thanks for subscribing!",
  });
}

module.exports = { subscribe };
