import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import "./assets/styles/app.css";

import App from "./App.jsx";
import useAppStore from "./store/AppStore";

function Main() {
  const { isDarkTheme } = useAppStore();

  return (
    <BrowserRouter>
      <ConfigProvider
        theme={{
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.defaultAlgorithm,
        }}
      >
        <App />
      </ConfigProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root")).render(<Main />);
