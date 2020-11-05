const config = () => {};
const upload = () => {
  return {
    public_id: "publicid",
    url: "url",
  };
};

module.exports = {
  v2: {
    config,
    uploader: {
      upload,
    },
  },
};
