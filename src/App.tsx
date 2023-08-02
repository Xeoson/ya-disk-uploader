import { UploadOutlined } from "@ant-design/icons";
import { Button, Upload, notification } from "antd";
import { RcFile } from "antd/es/upload";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { getDownloadUrl, getToken, redirectAuthorize } from "./api";

const getSearchParam = (key: string) =>
  new URLSearchParams(window.location.search).get(key);
const clearSearchParams = () =>
  window.history.replaceState(null, "", location.pathname);

const App = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [notify, content] = notification.useNotification();

  const code = getSearchParam("code");

  useEffect(() => {
    const fetchToken = async () => {
      if (!code || token) return;
      try {
        setLoading(true);
        const token = await getToken(code);
        setToken(token);
        clearSearchParams();
      } catch (error) {
        if (error instanceof AxiosError) {
          notify.error({ message: error.message });
        }
        notify.error({ message: "Что-то пошло не так" });
      } finally {
        setLoading(false);
      }
    };
    fetchToken();
  }, [code]);

  const onSetFile = async (fileData: RcFile) =>
    getDownloadUrl(token, fileData.name);

  return (
    <>
      <main className="max-w-2xl h-full max-md:h-2/4">
        {token ? (
          <div className=" bg-neutral-50 rounded-md p-4">
            <Upload action={onSetFile} method="put" multiple>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </div>
        ) : (
          <Button
            disabled={loading}
            onClick={redirectAuthorize}
            type="primary"
            block
          >
            Войти
          </Button>
        )}
      </main>
      {content}
    </>
  );
};

export default App;
