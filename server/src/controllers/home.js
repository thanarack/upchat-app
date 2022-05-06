const handlerHome = (req, res) => {
  res.status(200).json({
    message: 'home',
    timestamp: +new Date(),
  });
};

module.exports = handlerHome;
