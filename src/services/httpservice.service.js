import https from "./http";

export const httpService = {
  get(path, callback, errCallback) {
    return https
      .get(path)
      .then((response) => {
        if (response?.status === 200) {
          callback !== undefined &&
            callback !== null &&
            callback(response?.data);
        } else {
          errCallback !== undefined &&
            errCallback !== null &&
            errCallback(response?.data);
          return response;
        }
      })
      .catch((error) => {
        errCallback !== undefined && errCallback !== null && errCallback(error);
        return error;
      });
  },

  post(path, payload, callback, errCallback, config = {}) {
    return https
      .post(path, payload, config)
      .then((response) => {
        if (response?.status === 200) {
          callback !== undefined &&
            callback !== null &&
            callback(response?.data);
        } else {
          errCallback !== undefined &&
            errCallback !== null &&
            errCallback(response?.data);
          return response;
        }
      })
      .catch((error) => {
        if (error?.response?.status === 403) {
          errCallback !== undefined &&
            errCallback({ message: "You don't have permission for this" });
        } else {
          errCallback !== undefined && callback !== null && errCallback(error);
        }
      });
  },

  put(path, payload, callback, errCallback, config = {}) {
    return https
      .put(path, payload, config)
      .then((response) => {
        if (response?.status === 200) {
          callback(response.data);
        } else {
          errCallback !== undefined && errCallback(response.data);
        }
      })
      .catch((error) => {
        if (error?.response?.status === 403) {
          errCallback !== undefined &&
            errCallback({ message: "You don't have permission for this" });
        } else {
          errCallback !== undefined && errCallback(error);
        }
      });
  },

  delete(path, payload, callback, errCallback) {
    return https
      .delete(path, { data: payload })
      .then((response) => {
        if (response?.status === 200) {
          callback !== undefined &&
            callback !== null &&
            callback(response.data);
        } else {
          errCallback !== undefined &&
            errCallback !== null &&
            errCallback(response.data);
          return response;
        }
      })
      .catch((error) => {
        if (error?.response?.status === 403) {
          errCallback !== undefined &&
            errCallback({ message: "You don't have permission for this" });
        } else {
          errCallback !== undefined && errCallback(error);
        }
      });
  },
};
