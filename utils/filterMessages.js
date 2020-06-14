exports.filter = {
  sortMessages: (data, param) => {
    let sortBy = param === "true" ? "createdAt" : param;
    return data.sort((a, b) => {
      if (a[sortBy] < b[sortBy]) return -1;
      if (a[sortBy] > b[sortBy]) return 1;
      return 0;
    });
  },

  limitMessages: (data, param) => {
    const defaultLimit = 10;
    let limit = param === "true" ? defaultLimit : param;
    if (limit <= 0) limit = 1;
    if (limit > 50) limit = 50;

    return data.slice(0, limit);
  },

  skipMessages: (data, param) => {
    let skip = param === "true" ? 0 : param;

    return data.slice(skip, data.length);
  }
};
