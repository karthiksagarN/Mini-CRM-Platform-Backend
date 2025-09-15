const authService = require('../services/authService');

exports.handleGoogleCallback = async (req, res, next) => {
  try {
    // Passport attaches the authenticated user to req.user
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const token = authService.generateJWT(user);
    // Return the token in a JSON response
    // res.json({ token });
    // After generating token:
    res.send(`
      <!doctype html>
      <html>
        <body>
          <script>
            // send token to opener window then close popup
            window.opener.postMessage({ type: 'XENO_AUTH', token: ${JSON.stringify(token)} }, '*');
            document.write('Authentication successful. You can close this window.');
            window.close();
          </script>
        </body>
      </html>
    `);

  } catch (err) {
    next(err);
  }
};