/* eslint-disable arrow-body-style */
// will return another function which is then gonna be assigned to createTour for ex..
module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
