const jwt = require('jsonwebtoken');

exports.requiresLogin = function (req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) { // eslint-disable-line
      if (err) {
        res.json({ success: false, message: 'Failed to authenticate token.' });
      } else {
        // if everything is good, save to request for use in other routes
        req.user = decoded; // eslint-disable-line
        req.token = token;
        next();
      }
    });
  }
  else {
    res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }
}
