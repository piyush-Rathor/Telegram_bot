import axios from "axios";
import constants from "../configs/constants.js";

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
  getMatchesDetails: async (data) => await callApi(`https://api.cricapi.com/v1/matches?apikey=${constants.CRICKET_PUBLIC_API_KEY}&offset=0`),
  getMatchInfo:async(id)=>await callApi(`https://api.cricapi.com/v1/match_info?apikey=${constants.CRICKET_PUBLIC_API_KEY}&id=${id}`)
};

export default Api;
