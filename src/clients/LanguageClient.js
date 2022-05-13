import { API_ENDPOINT } from "../constants/api.js";

async function httpGetRequest(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("오류가 발생했습니다");
  }

  return await response.json();
}

class LanguageClient {
  async getRelatedLanguages(keyword) {
    return await httpGetRequest(`${API_ENDPOINT}/languages?keyword=${keyword}`);
  }
}

const languageClient = new LanguageClient();
export default languageClient;
