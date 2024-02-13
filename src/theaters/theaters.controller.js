const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(request, response) {
  const { movieId } = request.params;
  const movieData = await service.list(movieId);
  response.json({ data: movieData });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
