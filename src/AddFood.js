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
import TextArea from 'antd/es/input/TextArea';

const stores = [
  {
    label: 'Indian',
    value: 'Indian',
  },
  {
    label: 'Costco',
    value: 'Costco',
  },
  {
    label: 'Walmart',
    value: 'Walmart',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

function AddFood({ open, record, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [locations, setLocations] = useState([]);

  const fetchCat = async () => {
    try {
      let res = await axios.get(API_URL + '/foodCategories');
      setCategory(res.data.data);
      if (record) form.setFieldValue('categoryId', record.categoryId?._id);
    } catch (e) {
      message.error(e.message);
    }
  };
  const fetchLoc = async () => {
    try {
      let res = await axios.get(API_URL + '/foodLocations');
      setLocations(res.data.data);
      if (record) form.setFieldValue('locationId', record.locationId?._id);
    } catch (e) {
      message.error(e.message);
    }
  };

  const addFoodItem = async (values) => {
    try {
      if (!values.isEmpty) values.storeId = '';
      if (!values.locationId)
        values.locationId = locations.find((x) => x.name === 'Other')?._id;
      if (!values.categoryId)
        values.categoryId = category.find((x) => x.name === 'Other')?._id;
      const callApi = record
        ? axios.put(API_URL + '/foodItems/' + record._id, values)
        : axios.post(API_URL + '/foodItems', values);
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
    else form.setFieldsValue({ quantity: 1 });
  }, [record]);

  const isEmpty = Form.useWatch('isEmpty', {
    form,
    preserve: true,
  });

  return (
    <Modal
      open={open}
      title={'Add Food'}
      onCancel={() => onCancel()}
      onOk={() => form.submit()}
      okText="Submit"
      cancelText="Cancel"
      okButtonProps={{ loading: loading }}
      width={380}
    >
      <Form
        labelWrap
        form={form}
        onFinish={addFoodItem}
        labelCol={{ span: 6 }}
        labelAlign="left"
        size="small"
      >
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>
          </Col>
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
        </Row>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item label="Buy new" name="isEmpty" valuePropName="checked">
              <Checkbox
                style={{ width: '100%' }}
                onChange={() => form.setFieldValue('storeId', 'Indian')}
              />
            </Form.Item>
          </Col>
          {isEmpty ? (
            <Col xs={24}>
              <Form.Item label="Where to buy" name="storeId">
                <Select placeholder="Select store" options={stores} />
              </Form.Item>
            </Col>
          ) : null}
        </Row>
        <Row gutter={16}>
          <Col xs={24}>
            <Form.Item
              label="Category"
              name="categoryId"
              rules={[{ required: false, message: 'Please select category' }]}
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
        <Row>
          <Col xs={24}>
            <Form.Item label="Notes" name="notes">
              <TextArea rows={1} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddFood;
