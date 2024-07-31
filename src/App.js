import { Header } from 'antd/es/layout/layout';
import './App.css';
import FoodList from './FoodList';
import Receipes from './Receipes';
import { Layout } from 'antd';
import { useState } from 'react';

function App() {
  const [routes, setRoutes] = useState('receipes');

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
        Let's manage your <a onClick={() => setRoutes('foods')}> Food Items</a>{' '}
        & <a onClick={() => setRoutes('receipes')}> Receipes</a> :)
      </Header>
      {routes === 'foods' ? <FoodList /> : <Receipes />}
    </Layout>
  );
}

export default App;
