module.exports = async function (req, res, next) {
  try {
    console.log(req.file);
  } catch (err) {
    console.log(err);
  }

  next();
};
