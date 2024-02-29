// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './constants';
import {
  Button,
  Card,
  Col,
  Layout,
  List,
  Row,
  Select,
  Tag,
  message,
  Collapse,
  Badge,
  Checkbox,
  Popconfirm,
} from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  ShoppingCartOutlined,
  CheckOutlined,
  AlertOutlined,
  ShopOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import AddFood from './AddFood';
import groupBy from 'lodash.groupby';

const headerStyle = {
  padding: '0px 10px',
  backgroundColor: 'white' || '#f5f5f5',
  position: 'sticky',
  top: 63,
  zIndex: 1,
};
const iconStyle = {
  fontSize: 18,
  // marginLeft: 10,
};
const { Panel } = Collapse;
function FoodList() {
  const foodItemRef = React.useRef(null);
  const [foodItems, setFoodItems] = useState([]);
  const [isAddModal, setIsAddModal] = useState(false);
  const [isShoppingList, setIsShoppingList] = useState(false);
  const [record, setRecord] = useState(null);
  const [groupKey, setGroupKey] = useState();

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const res = await axios.get(API_URL + '/foodItems');
      setFoodItems(res.data.data);
      foodItemRef.current = res.data.data;
    } catch (e) {}
  };

  const deleteFoodItem = async (id) => {
    try {
      const res = await axios.delete(API_URL + `/foodItems/${id}`);
      message.success(res.data.message);
      fetchFoodItems();
    } catch (e) {}
  };

  const handlePurchased = async () => {
    try {
      const res = await axios.post(API_URL + `/foodItems/bulkPurchased`, {});
      message.success(res.data.message);
      fetchFoodItems();
      setIsShoppingList(!isShoppingList);
    } catch (e) {}
  };

  const groupedFoods = groupKey ? groupBy(foodItems, groupKey) : [];
  const totalCount = foodItems?.length;

  const ItemList = ({ dataSource = foodItems }) => (
    <List
      itemLayout="horizontal"
      size="small"
      // grid={{
      //   gutter: 12,
      //   xs: 1,
      //   sm: 2,
      //   md: 4,
      //   lg: 4,
      //   xl: 6,
      //   xxl: 3,
      // }}
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item
          actions={[
            <EditOutlined
              style={iconStyle}
              size="large"
              title="Delete"
              onClick={() => {
                setRecord(item);
                setIsAddModal(true);
              }}
            />,
            <DeleteOutlined
              style={iconStyle}
              title="Delete"
              onClick={() => deleteFoodItem(item._id)}
            />,
          ]}
        >
          <List.Item.Meta
            title={
              <>
                <span style={{ marginRight: 5 }}>{item.name}</span>
                {item.storeId ? (
                  <Tag color="success">
                    <ShopOutlined /> {item.storeId}
                  </Tag>
                ) : null}
                {item.isEmpty ? (
                  <Tag color="warning">
                    <AlertOutlined /> Buy
                  </Tag>
                ) : null}
              </>
            }
            description={
              <Row gutter={8}>
                {item.notes && <Col>{item.notes} </Col>}
                {item.locationId?.name && item.locationId.name !== 'Other' && (
                  <Col>
                    <EnvironmentOutlined style={{ color: 'red' }} />{' '}
                    {item.locationId.name}
                  </Col>
                )}
                {item.categoryId?.name && item.categoryId.name !== 'Other' && (
                  <Col>
                    <Tag bordered={false} color="processing">
                      {item.categoryId?.name}
                    </Tag>
                  </Col>
                )}
              </Row>
            }
          />
          <div>
            <b>{item.quantity || '0'} </b>Reg.
          </div>
          {/* <Card
            type="inner"
            size="small"
            title={
              <>
                {item.name}
                {item.isEmpty ? (
                  <Tag color="warning" style={{ marginLeft: 10 }}>
                    Buy Soon
                  </Tag>
                ) : null}
              </>
            }
            extra={
              <>
                <EditOutlined
                  style={iconStyle}
                  size="large"
                  title="Delete"
                  onClick={() => {
                    setRecord(item);
                    setIsAddModal(true);
                  }}
                />
                <DeleteOutlined
                  style={iconStyle}
                  title="Delete"
                  onClick={() => deleteFoodItem(item._id)}
                />
              </>
            }
          >
            <Row gutter={16}>
              <Col md={12} sm={24}>
                Qty: <b>{item.quantity || '0'} </b>
              </Col>
              {item.locationId?.name && item.locationId.name !== 'Other' && (
                <Col md={12} sm={24}>
                  <EnvironmentOutlined style={{ color: 'red' }} />{' '}
                  {item.locationId.name}
                </Col>
              )}
              {item.categoryId?.name && item.categoryId.name !== 'Other' && (
                <Col md={12} sm={24}>
                  <Tag color="processing">{item.categoryId?.name}</Tag>
                </Col>
              )}
            </Row>
          </Card> */}
        </List.Item>
      )}
    />
  );

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
            {isShoppingList ? 'Grocery List' : 'Food Items'}{' '}
            <Badge
              count={totalCount}
              style={{
                backgroundColor: '#52c41a',
              }}
            />
          </div>
          <div>
            {isShoppingList && totalCount > 0 ? (
              <Popconfirm
                title="Purchased Food Items"
                description="Are you sure, all items are purchased ?"
                onConfirm={handlePurchased}
                // onCancel={cancel}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  style={{ marginRight: 10 }}
                  icon={<CheckOutlined style={{ color: 'green' }} />}
                ></Button>
              </Popconfirm>
            ) : null}
            <Button
              style={{ marginRight: 10 }}
              icon={
                isShoppingList ? (
                  <UnorderedListOutlined />
                ) : (
                  <ShoppingCartOutlined />
                )
              }
              onClick={() => {
                if (!isShoppingList)
                  setFoodItems(foodItemRef?.current.filter((x) => x.isEmpty));
                else setFoodItems(foodItemRef?.current);
                setIsShoppingList(!isShoppingList);
              }}
            ></Button>
            <Select
              style={{ marginRight: 10 }}
              value={groupKey}
              onChange={(val) => setGroupKey(val)}
              allowClear
              placeholder="GroupBy"
              options={[
                { label: 'Store', value: 'storeId' },
                {
                  label: 'Category',
                  value: 'categoryId.name',
                },
                {
                  label: 'Location',
                  value: 'locationId.name',
                },
              ]}
            ></Select>
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
        {groupKey ? (
          <Collapse accordion size="small">
            {Object.keys(groupedFoods).map((item) => (
              <Panel
                header={item === 'undefined' ? 'Uncategorized' : item}
                key={item}
              >
                <ItemList dataSource={groupedFoods[item]} />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <ItemList />
        )}
      </Layout.Content>

      {isAddModal ? (
        <AddFood
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

export default FoodList;
