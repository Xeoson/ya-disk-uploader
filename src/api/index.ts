import axios from "axios";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export const api = axios.create();

export const redirectAuthorize = () => {
  const params = new URLSearchParams();
  params.set("response_type", "code");
  params.set("client_id", CLIENT_ID);
  window.location.href = `https://oauth.yandex.ru/authorize?${params.toString()}`;
};

export const getToken = async (code: string) =>
  (
    await axios.post<{ access_token: string }>(
      "https://oauth.yandex.ru/token",
      { grant_type: "authorization_code", code },
      {
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
      }
    )
  ).data.access_token;

export const getDownloadUrl = async (token: string, path: string) => {
  try {
    const {
      data: { href },
    } = await axios.get<{ href: string }>(
      "https://cloud-api.yandex.net/v1/disk/resources/upload",
      {
        headers: { Authorization: `OAuth ${token}` },
        params: { path },
      }
    );
    return href;
  } catch (error) {
    return "";
  }
};
