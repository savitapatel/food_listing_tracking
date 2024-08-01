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
  Image,
  Popconfirm,
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
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoader(true);
      const res = await axios.get(API_URL + '/receipes');
      setRecipes(res.data.data);
    } catch (e) {
    } finally {
      setLoader(false);
    }
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
        {loader ? (
          <p>Loading...</p>
        ) : (
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
                        onClick={(e) => {
                          setRecord(item);
                          setIsAddModal(true);
                          e.stopPropagation();
                        }}
                      />

                      <Popconfirm
                        title="Delete Receipe"
                        description="Are you sure, you want to delete this receipe ?"
                        onConfirm={(e) => {
                          deleteFoodItem(item._id);
                          e.stopPropagation();
                        }}
                        onCancel={(e) => e.stopPropagation()}
                        okText="Yes"
                        cancelText="No"
                      >
                        <DeleteOutlined
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          style={{ marginLeft: '10px' }}
                        />
                      </Popconfirm>
                    </div>
                    {item.image ? (
                      <Image
                        style={{ width: 50, height: 50 }}
                        src={API_URL + item.image}
                        alt="food"
                        loading="lazy"
                      />
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
        )}
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
