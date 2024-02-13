const db = require("../db/connection");

const tableName = "reviews";

async function destroy(reviewId) {
  return db('reviews')
      .where({'review_id': reviewId})
      .del();
}

async function list(movie_id) {
  return db('reviews')
      .select('reviews.*',
          'critics.critic_id as c_critic_id',
          'critics.preferred_name as c_preferred_name',
          'critics.surname as c_surname',
          'critics.organization_name as c_organization_name',
          'critics.created_at as c_created_at',
          'critics.updated_at as c_updated_at'
          )
      .join('critics', 'reviews.critic_id', 'critics.critic_id')
      .where({'reviews.movie_id': movie_id});
}

async function read(reviewId) {
  return db('reviews')
      .select('*')
      .where({'review_id': reviewId});
}

async function readCritic(critic_id) {
  return db("critics").where({ critic_id }).first();
}

async function setCritic(review) {
  review.critic = await readCritic(review.critic_id);
  return review;
}

async function update(review) {
  return db(tableName)
    .where({ review_id: review.review_id })
    .update(review, "*")
    .then(() => read(review.review_id))
    .then((data) => setCritic(data[0]));
}

module.exports = {
  destroy,
  list,
  read,
  update,
};
