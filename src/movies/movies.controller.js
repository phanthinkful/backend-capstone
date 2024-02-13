const service = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function movieExists(request, response, next) {
  const movieId = request.params.movieId;
  const movieData = await service.read(movieId);
  if (movieData.length > 0) {
    response.locals.movieData = movieData[0];
    next();
  }
  else next({status: 404, message: 'Movie cannot be found.'});
}

async function read(request, response) {
  response.json({ data: response.locals.movieData });
}

async function list(request, response) {
  const isShowing = request.query.is_showing;
  const data = await service.list(isShowing);
  response.json({ data: data });
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  read: [asyncErrorBoundary(movieExists), read],
};
