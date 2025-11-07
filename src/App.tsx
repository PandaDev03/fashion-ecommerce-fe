import { App as AntApp } from 'antd';
import AppRouter from './routing/AppRouter';

const App = () => {
  return (
    <AntApp>
      <AppRouter />
    </AntApp>
  );
};

export default App;
