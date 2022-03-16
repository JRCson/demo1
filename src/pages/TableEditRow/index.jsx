import styles from './index.less';
import React, { useState } from 'react';
import { Table, Input, InputNumber, Popconfirm, Form } from 'antd';


const originData = [];

for (let i = 0; i < 10; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}

/**
 * modal
 */

import { Modal, Button } from 'antd';

const ModalApp = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const index = originData.length.toString();
    originData.push({
      key: index,
      name: document.getElementById('name').value,
      age: document.getElementById('age').value,
      address: document.getElementById('address').value,
    });
    console.log(originData);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        添加
      </Button>
      <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form
          name="basic"
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
        >
          <Form.Item
            label="name"
            name="name"
          >
            <Input id="name"/>
          </Form.Item>
          <Form.Item
            label="age"
            name="age"
          >
            <Input id="age"/>
          </Form.Item>
          <Form.Item
            label="address"
            name="address"
          >
            <Input id="address"/>
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
};


const EditableCell = ({
                        editing,
                        dataIndex,
                        title,
                        inputType,
                        record,
                        index,
                        children,
                        ...restProps
                      }) => {
  const inputNode = inputType === 'number' ? <InputNumber/> : <Input/>;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  /**
   * delete
   * @param record
   */
  const delet = (record) => {
    console.log(record);
    const newData = [...data];
    const index = newData.findIndex((item) => record.key === item.key);

    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1);
      setData(newData);
      setEditingKey('');
    }
  };

  /**
   * modal
   */
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    const newData = [...data];
    const index = Number(newData[newData.length - 1].key) + 1;
    console.log(index);
    newData.push({
      key: index.toString(),
      name: document.getElementById('name').value,
      age: document.getElementById('age').value,
      address: document.getElementById('address').value,
    });
    setData(newData);
    setEditingKey('');
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="javascript:;"
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div>
            <a disabled={editingKey !== ''} onClick={() => edit(record)}>
              Edit
            </a>
            <a onClick={() => delet(record)} style={{ margin: 20 }}>delete</a>
          </div>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div>
      <>
        <Button type="primary" onClick={showModal} style={{marginBottom:10}}>
          添加
        </Button>
        <Modal title="Basic Modal" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
          <Form
            name="basic"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item
              label="name"
              name="name"
            >
              <Input id="name"/>
            </Form.Item>
            <Form.Item
              label="age"
              name="age"
            >
              <Input id="age"/>
            </Form.Item>
            <Form.Item
              label="address"
              name="address"
            >
              <Input id="address"/>
            </Form.Item>

          </Form>
        </Modal>
      </>

      <Form form={form} component={false}>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
    </div>
  );
};

export default () => (
  <div className={styles.container}>

    <div id="components-table-demo-edit-row">
      <EditableTable/>
    </div>
  </div>
);
