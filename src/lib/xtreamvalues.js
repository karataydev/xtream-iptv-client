import { Categories, Xtream } from "./xtream";
export class XtreamValue {
  constructor() {
    this.movieCategories = null;
    this.seriesCategories = null;
    this.liveTvCategories = null;
    this.movieStreams = null;
    this.seriesStreams = null;
    this.liveTvStreams = null;
  }

  /**
   * @param {Xtream} [xtream]
   */
  async setValuesXtreamClient(xtream) {
    // Fetch categories and streams concurrently
    const [
      movieCategories,
      seriesCategories,
      liveTvCategories,
      movieStreams,
      seriesStreams,
      liveTvStreams,
    ] = await Promise.all([
      xtream.getVodCategories().then((list) =>
        list
          .map((data) => ({
            name: data.category_name,
            id: data.category_id,
          }))
          .filter((d) => !d.name.startsWith("FOR ADULTS")),
      ),
      xtream.getSeriesCategories().then((list) =>
        list.map((data) => ({
          name: data.category_name,
          id: data.category_id,
        })),
      ),
      xtream.getLiveCategories().then((list) =>
        list
          .map((data) => ({
            name: data.category_name,
            id: data.category_id,
          }))
          .filter((d) => !d.name.startsWith("FOR ADULTS")),
      ),
      xtream.getVODStreams().then((list) =>
        list.map((data) => ({
          name: data.name,
          type: data.stream_type,
          id: data.stream_id,
          icon: data.icon,
          rating: data.rating,
          extension: data.container_extension,
          categoryId: data.category_id,
        })),
      ),
      xtream.getSeriesStreams().then((list) =>
        list.map((data) => ({
          name: data.name,
          type: data.stream_type,
          id: data.stream_id,
          icon: data.icon,
          rating: data.rating,
          extension: data.container_extension,
          categoryId: data.category_id,
        })),
      ),
      xtream.getLiveStreams().then((list) =>
        list.map((data) => ({
          name: data.name,
          type: data.stream_type,
          id: data.stream_id,
          icon: data.icon,
          rating: data.rating,
          extension: data.container_extension,
          categoryId: data.category_id,
        })),
      ),
    ]);

    // Assign streams to class properties
    this.movieStreams = movieStreams;
    this.seriesStreams = seriesStreams;
    this.liveTvStreams = liveTvStreams;

    // Add default values at the start of each list
    this.movieCategories = [{ id: -1, name: "All Movies" }, ...movieCategories];
    this.seriesCategories = [
      { id: -1, name: "All TV Shows" },
      ...seriesCategories,
    ];
    this.liveTvCategories = [
      { id: -1, name: "All Live TV" },
      ...liveTvCategories,
    ];
  }

  getSubCategories(mainCategory) {
    switch (mainCategory) {
      case Categories.Movies:
        return this.movieCategories;
      case Categories.LiveStreams:
        return this.liveTvCategories;
      case Categories.Series:
        return this.seriesCategories;
      default:
        return null;
    }
  }

  getStreams(mainCategory) {
    switch (mainCategory) {
      case Categories.Movies:
        return this.movieStreams;
      case Categories.LiveStreams:
        return this.liveTvStreams;
      case Categories.Series:
        return this.seriesStreams;
      default:
        return null;
    }
  }

  getStream(categoryId, mainCategory) {
    if (categoryId === -1) {
      return this.getStreams(mainCategory);
    } else {
      return this.getStreams(mainCategory).filter(
        (data) => data.categoryId === categoryId,
      );
    }
  }

  dump() {
    return {
      movieCategories: this.movieCategories,
      seriesCategories: this.seriesCategories,
      liveTvCategories: this.liveTvCategories,
      movieStreams: this.movieStreams,
      seriesStreams: this.seriesStreams,
      liveTvStreams: this.liveTvStreams,
    };
  }

  loadFromJson(jsonData) {
    this.movieCategories = jsonData.movieCategories;
    this.seriesCategories = jsonData.seriesCategories;
    this.liveTvCategories = jsonData.liveTvCategories;
    this.movieStreams = jsonData.movieStreams;
    this.seriesStreams = jsonData.seriesStreams;
    this.liveTvStreams = jsonData.liveTvStreams;
  }
}
