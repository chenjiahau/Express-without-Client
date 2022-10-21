const { catchAsync } = require('../../utils/util');

const deleteFactory = Model => catchAsync(async (req, res) => {
  await Model.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: 'success',
    data: null
  });
});

module.exports = deleteFactory;