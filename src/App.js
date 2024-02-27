import { Header } from 'antd/es/layout/layout';
import './App.css';
import FoodList from './FoodList';
import { Layout } from 'antd';

function App() {
  return (
    <Layout>
      <Header
        className="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          width: '100%',
          color: 'white',
        }}
      >
        Let's manage your Food Items...
      </Header>
      <FoodList />
    </Layout>
  );
}

export default App;
