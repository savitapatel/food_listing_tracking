// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './constants';
import {
  Modal,
  Form,
  Input,
  Button,
  Select,
  Row,
  Col,
  message,
  InputNumber,
  Checkbox,
} from 'antd';

function AddFood({ open, record, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchCat = async () => {
    try {
      let res = await axios.get(API_URL + '/api/foodCategories');
      setCategory(res.data.data);
      if (record) form.setFieldValue('categoryId', record.categoryId?._id);
    } catch (e) {
      message.error(e.message);
    }
  };
  const fetchLoc = async () => {
    try {
      let res = await axios.get(API_URL + '/api/foodLocations');
      setLocations(res.data.data);
      if (record) form.setFieldValue('locationId', record.locationId?._id);
    } catch (e) {
      message.error(e.message);
    }
  };

  const addFoodItem = async (values) => {
    try {
      if (!values.locationId)
        values.locationId = locations.find((x) => x.name === 'Other')?._id;
      if (!values.categoryId)
        values.categoryId = category.find((x) => x.name === 'Other')?._id;
      const callApi = record
        ? axios.put(API_URL + '/api/foodItems/' + record._id, values)
        : axios.post(API_URL + '/api/foodItems', values);
      let res = await callApi;
      message.success(res.data.message);
      onCancel(res);
    } catch (e) {
      message.error(e.message);
    }
  };

  useEffect(() => {
    fetchCat();
    fetchLoc();
    if (record) form.setFieldsValue(record);
  }, [record]);

  return (
    <Modal
      open={open}
      title={'Add Food'}
      onCancel={() => onCancel()}
      onOk={() => form.submit()}
      okText="Submit"
      cancelText="Cancel"
      okButtonProps={{ loading: loading }}
    >
      <Form
        labelWrap
        form={form}
        onFinish={addFoodItem}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: true, message: 'Please select category' }]}
            >
              <Select
                placeholder="Select category"
                options={category}
                fieldNames={{
                  label: 'name',
                  value: '_id',
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true, message: 'Please enter quantity' }]}
            >
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="Enter quantity"
              />
            </Form.Item>
          </Col>
          <Col xs={24}>
            <Form.Item label="Location" name="locationId">
              <Select
                placeholder="Select location"
                options={locations}
                fieldNames={{
                  label: 'name',
                  value: '_id',
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label="Buy new" name="isEmpty" valuePropName="checked">
              <Checkbox style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddFood;
