// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from './constants';
import {
  Modal,
  Form,
  Input,
  Select,
  Row,
  Col,
  message,
  Upload,
  Button,
} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { UploadOutlined } from '@ant-design/icons';
import heic2any from 'heic2any';

function AddReceipes({ open, record, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileLoading, setFileLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const AddReceipesItem = async (values) => {
    try {
      setLoading(true);
      const ingredientsList = values.ingredients
        ?.split(',')
        .map((item) => item.trim());

      const req = { ...values, ingredientsList, image: imageUrl };
      const callApi = record
        ? axios.put(API_URL + '/receipes/' + record._id, req)
        : axios.post(API_URL + '/receipes', req);
      let res = await callApi;
      message.success(res.data.message);
      onCancel(res);
      setLoading(false);
    } catch (e) {
      message.error(e.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (record) {
      form.setFieldsValue(record);
      form.setFieldValue('ingredients', record.ingredients?.join(', '));
      setImageUrl(record.image);
    }
  }, [record]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setFileLoading(true);
      const response = await axios.post(API_URL + '/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': '*',
        },
      });

      setImageUrl(response.data.imageUrl);
      message.success('Image uploaded successfully');
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Error uploading image');
      return '';
    } finally {
      setFileLoading(false);
    }
  };
  const handleBeforeUpload = async (file) => {
    if (file.type === 'image/heic' || file.type === 'image/HEIC') {
      try {
        setFileLoading(true);
        const convertedBlob = await heic2any({
          blob: file,
          toType: 'image/jpeg',
        });
        const convertedFile = new File(
          [convertedBlob],
          file.name.replace(/\.[^/.]+$/, '.jpg'),
          { type: 'image/jpeg' }
        );
        return convertedFile;
      } catch (error) {
        console.log('Error converting HEIC to JPEG');
        message.error('Error converting HEIC to JPEG');
        return false;
      } finally {
        setFileLoading(false);
      }
    }
    return file;
  };

  return (
    <Modal
      open={open}
      title={'Add Receipe'}
      onCancel={() => onCancel()}
      onOk={() => form.submit()}
      okText="Submit"
      cancelText="Cancel"
      okButtonProps={{ loading: loading }}
      width={400}
    >
      <Form
        labelWrap
        form={form}
        onFinish={AddReceipesItem}
        labelCol={{ span: 6 }}
        labelAlign="left"
        size="small"
      >
        <Row gutter={12}>
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
              label="Ingredients (comma separated)"
              name="ingredients"
              rules={[{ required: false, message: 'Please enter ingredients' }]}
            >
              <TextArea rows={2} placeholder="Enter ingredients" />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item
              label="Meal Time"
              name="mealTime"
              rules={[{ required: false, message: 'Please select mealTime' }]}
            >
              <Select
                placeholder="Select meal time"
                options={[
                  {
                    name: 'Lunch',
                    _id: 'lunch',
                  },
                  {
                    name: 'Dinner',
                    _id: 'dinner',
                  },
                  {
                    name: 'Any',
                    _id: 'any',
                  },
                ]}
                fieldNames={{
                  label: 'name',
                  value: '_id',
                }}
              />
            </Form.Item>
          </Col>

          <Col xs={24}>
            <Form.Item label="Instruction" name="instructions">
              <TextArea rows={2} placeholder="Enter instruction" />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Form.Item label="Image">
              <Upload
                {...{
                  // accept: "image/*",
                  name: 'image',
                  customRequest: ({ file, onSuccess }) => {
                    handleUpload(file).then(() => onSuccess('ok'));
                  },
                  beforeUpload: handleBeforeUpload,
                }}
              >
                <Button loading={fileLoading} icon={<UploadOutlined />}>
                  Click to Upload
                </Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}

export default AddReceipes;
