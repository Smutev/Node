exports.paramsById = (req, res, next) => {
  const { id } = req.params;
  const id_number = +id;

  if (isNaN(id_number)) {
    next("id' is not a number");
  }

  req.params.id = id_number;
  next();
};
