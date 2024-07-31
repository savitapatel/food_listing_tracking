import { Header } from 'antd/es/layout/layout';
import './App.css';
import FoodList from './FoodList';
import Receipes from './Receipes';
import { Layout } from 'antd';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Receipes />,
    },
    {
      path: '/foods',
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
        Let's manage your <a href="/foods"> Food Items</a> &{' '}
        <a href="/"> Receipes</a> :)
      </Header>
      <RouterProvider router={router}></RouterProvider>
    </Layout>
  );
}

export default App;
