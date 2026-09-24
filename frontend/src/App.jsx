import { ConfigProvider, theme, App as AntdApp } from "antd";
import Router from "./Router";

const App = () => {
  return (
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm
        }}
      >
        <AntdApp>
          <Router />
        </AntdApp>
      </ConfigProvider>
  );
};

export default App;