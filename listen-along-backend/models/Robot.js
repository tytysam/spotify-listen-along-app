// REF: https://developer.spotify.com/use-cases/mobile-apps/content-recommendations/
// REF: https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
// REF: https://stackoverflow.com/questions/17874851/can-i-use-the-spotify-recommendation-intelligence-in-an-app

// ======================= //
//    RECOMMENDER ROBOT    //
// ======================= //

class Robot {
  constructor(options) {
    this.image = options.image || "/images/robot-icon.png";
    this.id = options.id || "Robot";
    this.recommendations = {};
  }

  async generateRecommendations(items, getToken, spotifyApi) {
    const trackIds = items
      .filter((item) => item.user.type === "user")
      .map((item) => item.track.id);

    if (trackIds.length) {
      const key = trackIds.join("-");
      if (!(key in this.recommendations)) {
        await getToken();
        const res = await spotifyApi.generateRecommendations({
          seed_tracks: trackIds,
        });
        this.recommendations[key] = res.body.tracks;
      }
      if (this.recommendations[key].length) {
        return this.recommendations[key].shift();
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  toJSON() {
    return {
      id: this.id,
      images: [{ url: this.image }],
      type: "robot",
      socketIdArray: [],
      // *** to-do: add ??? attributes in order to be compatible with other true users...
    };
  }
}

module.exports = Robot;
