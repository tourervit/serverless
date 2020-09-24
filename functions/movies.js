const fetch = require("node-fetch");
const { URL } = require("url");
const movies = require("../data/movies.json");
const { query } = require("./utils/hasura");

exports.handler = async () => {
  const { movies } = await query({
    query: `
		query {
			movies {
				id
				poster
				tagline
				title
			}
		}
		`,
  });
  const api = new URL("https://www.omdbapi.com");
  api.searchParams.set("apikey", process.env.API_KEY);

  const moviesPromises = movies.map((movie) => {
    api.searchParams.set("i", movie.id);
    return fetch(api)
      .then((response) => response.json())
      .then((data) => {
        return {
          ...movie,
          scores: data.Ratings,
        };
      });
  });

  const moviesWithRatings = await Promise.all(moviesPromises);
  return {
    statusCode: 200,
    body: JSON.stringify(moviesWithRatings),
  };
};
