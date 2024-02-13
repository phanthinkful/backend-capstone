const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const methodNotAllowed = require("../errors/methodNotAllowed");
const mapProps = require("../utils/map-properties");

const reviewCriticMap = mapProps({
  'c_critic_id': 'critic.critic_id',
  'c_preferred_name': 'critic.preferred_name',
  'c_surname': 'critic.surname',
  'c_organization_name': 'critic.organization_name',
  'c_created_at': 'critic.created_at',
  'c_updated_at': 'critic.updated_at',
});

async function reviewExists(request, response, next) {
  const { reviewId } = request.params;
  const reviewData = await service.read(reviewId);
  if (reviewData.length > 0) {
    response.locals.reviewData = reviewData[0];
    next();
  }
  else next({ status: 404, message: 'Review cannot be found.'});
}

async function destroy(request, response) {
  const { reviewId } = request.params;
  await service.destroy(reviewId);
  response.sendStatus(204);
}

async function list(request, response) {
  const movieId = request.params.movieId;
  const reviewsData = await service.list(movieId);
  response.json({ data: reviewsData.map((review) => reviewCriticMap(review))});
}

function hasMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return next();
  }
  methodNotAllowed(request, response, next);
}

function noMovieIdInPath(request, response, next) {
  if (request.params.movieId) {
    return methodNotAllowed(request, response, next);
  }
  next();
}

async function update(request, response) {
  const { reviewId } = request.params;
  const updatedReview = {
    ...response.locals.reviewData,
    ...request.body.data,
    review_id: reviewId
  };
  const reviewData = await service.update(updatedReview);
  response.json({ data: reviewData });
}

module.exports = {
  destroy: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(destroy),
  ],
  list: [hasMovieIdInPath, asyncErrorBoundary(list)],
  update: [
    noMovieIdInPath,
    asyncErrorBoundary(reviewExists),
    asyncErrorBoundary(update),
  ],
};
