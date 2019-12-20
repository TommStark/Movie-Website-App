import { API_URL, API_KEY } from "../../config";

class CastService {
  constructor() {}

  getCast(id) {
    const endpoint = `${API_URL}movie/${id}/credits?api_key=${API_KEY}`;
    fetch(
      "https://api.themoviedb.org/3/movie/419704/credits?api_key=5381c91265b0c5fb7a09098fb50d3a5d"
    )
      .then(response => response.body)
      .then(body => {
        return body.json();
      })
      .catch(function(error) {
        console.log("ERRROR:" + error.message);
      });
  }

  getStatus() {
    return true;
  }
}
export default new CastService();
