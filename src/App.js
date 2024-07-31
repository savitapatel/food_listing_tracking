import { Header } from 'antd/es/layout/layout';
import './App.css';
import FoodList from './FoodList';
import Receipes from './Receipes';
import { Layout } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/food_listing_tracking/',
      element: <Receipes />,
    },
    {
      path: '/food_listing_tracking/foods',
      element: <FoodList />,
    },
  ]);
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
        Let's manage your{' '}
        <a href={process.env.PUBLIC_URL + '/foods'}> Food Items</a> &{' '}
        <a href={process.env.PUBLIC_URL + '/'}> Receipes</a> :)
      </Header>
      <RouterProvider router={router}></RouterProvider>
    </Layout>
  );
}

export default App;
