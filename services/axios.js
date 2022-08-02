import axios from "axios";

const callApi = async (url, data = null, method = "GET") => {
  try {
    const response = await axios({
      url,
      data: data,
      method,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    });
    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};
const Api = {
  getMatchesDetails: async (data) =>
    await callApi(`https://api.cricapi.com/v1/matches?apikey=068d710a-32bf-4b1d-a4c1-d74bf53fbc07&offset=0`),
};

export default Api;
