import { useState } from 'react';
import "antd/dist/antd.css";
import { Row, Col, Input, Select, Button, Layout, Menu, Form, notification } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import { find, map } from 'lodash';

const { Option } = Select;
const { Header } = Layout;
let index = 1;

function App() {
  const [userList, setUserList] = useState([]);
  const [showRegister, setShowRegister] = useState(true);
  const [selectedUser, setSelectedUser] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState([]);
  const [tempPositionArr, setTempPositionArr] = useState([[],[], [], [], []]);
  const [team, setTeam] = useState([]);
  const [playerError, setPlayerError] = useState([{}, {}, {}, {}, {}]);
  const [positionError, setPositionError] = useState([{}, {}, {}, {}, {}]);

  const [form] = Form.useForm();
  const [teamForm] = Form.useForm();
  const positionList = [
    { position_id: 1, position_name: "Point Guard", position_code: "PG" },
    { position_id: 2, position_name: "Shooting Guard", position_code: "SG" },
    { position_id: 3, position_name: "Small Forward", position_code: "SF" },
    { position_id: 4, position_name: "Power Forward", position_code: "PF" },
    { position_id: 5, position_name: "Center", position_code: "C" },
  ];

  const createPlayer = (values) => {
    const userDetails = [...userList];
    const filteredData = positionList.filter((position) => {
      return values.position.find(pos => position.position_id === Number(pos))
    });
    values.position = filteredData;
    values.user_id = index;
    userDetails.push(values);
    setUserList(userDetails);
    index++;
    form.resetFields();
  };

  const renderComposeTeam = () => {
    return (
      <Row style={{ backgroundColor: "#eeeeee", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Col span={3} />
        <Col span={18}>
          <Form
            form={form}
            layout="Horizontal"
            name={"register"}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            size="large"
            initialValues={{ first_name: "", last_name: "", height: null }}
            onFinish={createPlayer}
          >
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: 'Please Enter First Name' }]}
            >
              <Input placeholder="First Name" />
            </Form.Item>
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: 'Please Enter Last Name' }]}
            >
              <Input placeholder="Last Name" />
            </Form.Item>
            <Form.Item
              name="height"
              rules={[
                {
                  required: true,
                  message: 'Please Enter Height',
                },
                {
                  pattern: new RegExp(`^[1-9]{1}[0-9]{2}$`),
                  message: "The Input Is Not Valid Height!",
                }
              ]}
            >
              <Input placeholder="Height" />
            </Form.Item>
            <Form.Item
              name="position"
              rules={[{ required: true, message: 'Please Select Atleast One Position' }]}
            >
              <Select mode="multiple" placeholder="Position">
                {positionList.map((position) => (
                  <Option key={position.position_id} value={position.position_id}>
                    {`${position.position_name} ( ${position.position_code} )`}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={3} />
      </Row>
    );
  };

  const createTeam = () => {
    notification["success"]({
      message: "Team Assigned",
      description: "Players successfully assigned for first quarter",
    });
  };

  const handleUserChange = (value, idx) => {
    if (find(selectedUser, (id) => id === value)) {
      const errors = [...playerError];
      errors[idx] = { validateStatus: "error", help: "A Player can be selected only once" };
      setPlayerError(errors);
    } else {
      setSelectedUser((list) => [...list, value])
      const temp = find(userList, (user) => user.user_id === value).position;
      const clone = [...tempPositionArr];
      clone[idx].push(temp);
      setTempPositionArr(clone);
      const errors = [...playerError];
      errors[idx] = { };
      setPlayerError(errors);
    }
  };

  const handlePositionChange = (value, idx) => {
    if (find(selectedPosition, (id) => id === value)) {
      const errors = [...positionError];
      errors[idx] = { validateStatus: "error", help: "A Position can be selected only once" };
      setPositionError(errors);
    } else {
      setSelectedPosition((list) => [...list, value])
      const temp = find(userList, (user) => user.user_id === value).position;
      const clone = [...tempPositionArr];
      clone[idx].push(temp);
      setTempPositionArr(clone);
      const errors = [...positionError];
      errors[idx] = { };
      setPositionError(errors);
    }
  };

  const renderFirstQuarter = () => { 
    return (
      <Row style={{ backgroundColor: "#eeeeee", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Col span={3} />
        <Col span={18}>
          <Form
            form={teamForm}
            layout="Horizontal"
            name={"team-create"}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            size="large"
            onFinish={createTeam}
          >
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
              <div style={{width: "50%"}}>
                {map(positionList, (val, idx) => {
                return (
                <Form.Item
                  name={`player${idx}`}
                  validateStatus={playerError[idx]?.validateStatus}
                  help={playerError[idx]?.help}
                  rules={[{ required: true, message: 'Please Select a Player' }]}
                >
                  <Select placeholder="Player" onChange={(value) => handleUserChange(value, idx)}>
                    {userList.map((user) => (
                      <Option key={user.user_id} value={user.user_id}>
                        {`${user.first_name} ${user.last_name}`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            })}
              </div>
              <div style={{width: "50%"}}>
                {map(positionList, (val, idx) => {
              return (
                <Form.Item
                  name={`position${idx}`}
                  validateStatus={positionError[idx]?.validateStatus}
                  help={positionError[idx]?.help}
                  rules={[{ required: true, message: 'Please Select a Position' }]}
                >
                  <Select placeholder="Position" onChange={(value) => {handlePositionChange(value, idx)}}>
                    {tempPositionArr[idx][0]?.map((position) => (
                      <Option key={position.position_id} value={position.position_id}>
                        {`${position.position_name} ( ${position.position_code} )`}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              )
            })}
              </div>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={3} />
      </Row>
    );
  };
  

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['1']}
          onClick={(selected) => {
            if (userList.length < 5 && Number(selected.key) === 2) {
              notification["warning"]({
                message: "Not Enough Players",
                description: "Minimum of 5 players are needed",
              });
            }
            setShowRegister(Number(selected.key) === 1)
          }}
        >
        <Menu.Item key="1">Compose Team</Menu.Item>
        <Menu.Item key="2">First Quarter</Menu.Item>
      </Menu>
      </Header>
      <Content style={{height: "100vh"}}>
        {showRegister ? (renderComposeTeam()) : (renderFirstQuarter())}
      </Content>
    </Layout>
     
  );
}

export default App;
