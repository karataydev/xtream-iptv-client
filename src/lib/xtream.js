import pickBy from "lodash.pickby";
import querystring from "querystring";
import { AccountDisabledError, AuthenticatinError, FetchError } from "./errors";

export const XTREAM_CONFIG_KEY = "xtream-config";

export const XTREAM_PRELOADED = "xtream-preloaded";

export const Categories = {
  Movies: "Movies",
  Series: "Series",
  LiveStreams: "LiveStreams",
};

export class Xtream {
  /**
   * @param {{ baseUrl: string, auth: { username: string, password: string } }} [config]
   */
  constructor(config = {}) {
    this.config = config;
  }

  setConfig(config = {}) {
    this.config = config;
  }

  getConfig() {
    return this.config;
  }

  execute(action, filter) {
    const query = pickBy({ ...this.config.auth, action, ...filter });

    const encodedUrl = encodeURIComponent(
      `${this.config.baseUrl}/player_api.php?${querystring.stringify(query)}`,
    );
    const proxyUrl = `/api/proxy/${encodedUrl}`;

    return Promise.resolve()
      .then(() =>
        fetch(proxyUrl).then((response) => {
          if (!response.ok) {
            throw new FetchError(`HTTP error! status: ${response.status}`);
          }
          return response;
        }),
      )
      .catch(() => Promise.reject(new FetchError()))
      .then((T) => T.json())
      .then((data) => {
        if (
          action &&
          data.hasOwnProperty("user") &&
          data.user.hasOwnProperty("status") &&
          data.user_info.status === "Disabled"
        ) {
          return Promise.reject(new AccountDisabledError());
        }

        return data;
      });
  }

  getAccountInfo() {
    return this.execute().then((response) => {
      if (response.user_info.auth === 0) {
        return Promise.reject(
          new AuthenticatinError("invalid username or password."),
        );
      }

      return response.user_info;
    });
  }

  getLiveCategories() {
    return this.execute("get_live_categories");
  }

  getVodCategories() {
    return this.execute("get_vod_categories");
  }

  getSeriesCategories() {
    return this.execute("get_series_categories");
  }

  /**
   * @param {string} [category]
   */
  getLiveStreams(category) {
    return this.execute("get_live_streams", { category_id: category });
  }

  /**
   * @param {string} [category]
   */
  getSeriesStreams(category) {
    return this.execute("get_series", { category_id: category });
  }

  /**
   * @param {string} [category]
   */
  getVODStreams(category) {
    return this.execute("get_vod_streams", { category_id: category });
  }

  /**
   * GET VOD Info
   *
   * @param {number} id This will get info such as video codecs, duration, description, directors for 1 VOD
   */
  getVODInfo(id) {
    if (!id) {
      return Promise.reject(new Error("Vod Id not defined"));
    }

    return this.execute("get_vod_info", { vod_id: id }).then((T) => {
      if (T.hasOwnProperty("info") && T.info.length === 0) {
        return Promise.reject(new Error(`vod with id: ${id} not found`));
      }

      return T;
    });
  }

  /**
   * GET Series Info
   *
   * @param {number} id This will get info such as video codecs, duration, description, directors for 1 VOD
   */
  getSeriesInfo(id) {
    if (!id) {
      return Promise.reject(new Error("Series Id not defined"));
    }

    return this.execute("get_series_info", { series_id: id }).then((T) => {
      if (T.hasOwnProperty("info") && T.info.length === 0) {
        return Promise.reject(new Error(`Series with id: ${id} not found`));
      }

      return T;
    });
  }

  /**
   * GET short_epg for LIVE Streams (same as stalker portal, prints the next X EPG that will play soon)
   *
   * @param {number} id
   * @param {number} limit You can specify a limit too, without limit the default is 4 epg listings
   */
  getEPGLivetreams(id, limit) {
    return this.execute("get_short_epg", { stream_id: id, limit });
  }

  /**
   * GET ALL EPG for LIVE Streams (same as stalker portal, but it will print all epg listings regardless of the day)
   *
   * @param {number} id
   */
  getAllEPGLiveStreams(id) {
    return this.execute("get_simple_data_table", { stream_id: id });
  }

  getVODStreamUrl(streamId, ext) {
    return `${this.config.baseUrl}/movie/${this.config.auth.username}/${this.config.auth.password}/${streamId}.${ext}`;
  }

  getSeriesStreamUrl(streamId, ext) {
    return `${this.config.baseUrl}/series/${this.config.auth.username}/${this.config.auth.password}/${streamId}.${ext}`;
  }

  getLiveStreamUrl(streamId, ext) {
    return `${this.config.baseUrl}/live/${this.config.auth.username}/${this.config.auth.password}/${streamId}.${ext}`;
  }

  getStreamUrl(streamId, ext, mainCategory) {
    switch (mainCategory) {
      case Categories.Movies:
        return this.getVODStreamUrl(streamId, ext);
      case Categories.LiveStreams:
        return this.getLiveStreamUrl(streamId, ext);
      case Categories.Series:
        return this.getSeriesStreamUrl(streamId, ext);
      default:
        return null;
    }
  }
}
