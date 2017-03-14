const jwt = require('jsonwebtoken');

exports.requiresLogin = function (req, res, next) {
  const token = req.headers['authorization'].split(' ')[1];
  if (token) {
    try {
      // verifies secret and checks exp
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // if everything is good, save to request for use in other routes
      req.user = decoded; // eslint-disable-line
      req.token = token;
      next();
    } catch(err) {
      return res.json({ success: false, message: 'Failed to authenticate token.' });
    }
  }
  else {
    return res.status(403).send({
      success: false,
      message: 'No token provided.',
    });
  }
}
