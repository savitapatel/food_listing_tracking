// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './constants';
import {
  Button,
  Col,
  Layout,
  List,
  Row,
  Tag,
  message,
  Collapse,
  Badge,
} from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import AddReceipes from './AddReceipes';

const headerStyle = {
  padding: '0px 10px',
  backgroundColor: 'white' || '#f5f5f5',
  position: 'sticky',
  top: 63,
  zIndex: 1,
};

const { Panel } = Collapse;
function Receipes() {
  const [isAddModal, setIsAddModal] = useState(false);
  const [record, setRecord] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const res = await axios.get(API_URL + '/receipes');
      setRecipes(res.data.data);
    } catch (e) {}
  };

  const deleteFoodItem = async (id) => {
    try {
      const res = await axios.delete(API_URL + `/receipes/${id}`);
      message.success(res.data.message);
      fetchFoodItems();
    } catch (e) {}
  };

  const totalCount = recipes?.length;

  return (
    <>
      <Layout.Header style={headerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 'bold',
            }}
          >
            Receipes
            <Badge
              count={totalCount}
              style={{
                backgroundColor: '#52c41a',
                marginLeft: '5px',
              }}
            />
          </div>
          <div>
            <Button
              size="large"
              icon={<PlusOutlined />}
              type="primary"
              shape="circle"
              onClick={() => setIsAddModal(true)}
            ></Button>
          </div>
        </div>
      </Layout.Header>
      <Layout.Content>
        <Collapse accordion size="small">
          {recipes.map((item) => (
            <Panel
              header={
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <div>
                    <b> {item?.name} </b>
                    <Tag color="success">{item.mealTime || 'any'}</Tag>
                    <EditOutlined
                      title="Edit"
                      onClick={() => {
                        setRecord(item);
                        setIsAddModal(true);
                      }}
                    />

                    <DeleteOutlined
                      title="Delete"
                      onClick={() => deleteFoodItem(item._id)}
                      style={{ marginLeft: '10px' }}
                    />
                  </div>
                  {item.image ? (
                    <div>
                      <img
                        style={{ width: 70, height: 70 }}
                        src={API_URL + item.image}
                        alt="food"
                      />
                    </div>
                  ) : null}
                </div>
              }
              key={item?._id}
            >
              <List.Item>
                <List.Item.Meta
                  description={
                    <>
                      <Row className="m-0 p-0">
                        <Col span={6}>
                          <h4>Ingredients</h4>
                        </Col>
                        <Col span={18}>
                          {item.ingredients.map((ingredient, index) => (
                            <span key={index}>
                              {ingredient}
                              {', '}
                            </span>
                          ))}
                        </Col>
                      </Row>

                      {item.instructions ? (
                        <>
                          <hr></hr>
                          <Row>
                            <Col span={6}>
                              <h4>Instructions</h4>
                            </Col>
                            <Col
                              span={18}
                              style={{
                                wordWrap: 'break-word',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {item.instructions || '-'}
                            </Col>
                          </Row>
                        </>
                      ) : null}
                    </>
                  }
                />
              </List.Item>
            </Panel>
          ))}
        </Collapse>
      </Layout.Content>

      {isAddModal ? (
        <AddReceipes
          open={isAddModal}
          record={record}
          onCancel={(data) => {
            if (data) fetchFoodItems();
            setIsAddModal(false);
            setRecord(null);
          }}
        />
      ) : null}
    </>
  );
}

export default Receipes;
