import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { PlusSquare } from 'react-bootstrap-icons';
import {
  Button, Dropdown, ButtonGroup,
} from 'react-bootstrap';
import { actions as dataActions } from '../slices/dataSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';
import routes from '../routes.js';
import ChatBox from './ChatBox.jsx';
import { useAuth } from '../hooks/index.js';
import NewChannel from './Modal.jsx';

const ChannelsBox = () => {
  const [dataLoaded, setDataLoaded] = useState(false);
  const { isShow } = useSelector((state) => state.modal);
  const auth = useAuth();
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);

  useEffect(() => {
    const getAxiosData = async () => {
      const headers = auth.getAuthHeader();
      const response = await axios.get(routes.dataPath(), { headers });
      dispatch(dataActions.addData(response.data));
      setDataLoaded(true);
    };

    getAxiosData();
  }, [auth, dispatch]);

  if (!dataLoaded) {
    return null;
  }

  const { channels, currentChannelId } = data;
  const currentChannel = channels.find((channel) => channel.id === currentChannelId);

  const handleChannel = (id) => () => {
    dispatch(dataActions.setChannel(id));
  };

  const handleModal = () => {
    dispatch(modalActions.modalControl(!isShow));
  };

  return (
    <>
      {isShow ? <NewChannel handles={handleChannel} /> : null}
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
              <b>Каналы</b>
              <Button
                type="button"
                variant="group-vertical"
                className="p-0 text-primary"
                onClick={handleModal}
              >
                <PlusSquare size={20} />
                <span className="visually-hidden">+</span>
              </Button>
            </div>
            <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
              {channels.map(({ id, name }) => (
                <li key={id} className="nav-item w-100">
                  <Dropdown as={ButtonGroup} className="d-flex">
                    <Button
                      className="w-100 rounded-0 text-start text-truncate"
                      variant={id === currentChannelId ? 'secondary' : ''}
                      onClick={handleChannel(id)}
                    >
                      <span className="me-1">#</span>
                      {name}
                    </Button>
                    <Dropdown.Toggle
                      split
                      className="flex-grow-0"
                      variant={id === currentChannelId ? 'secondary' : ''}
                      id="dropdown-split-basic"
                    />
                    <Dropdown.Menu>
                      <Dropdown.Item href="#/action-1">Удалить</Dropdown.Item>
                      <Dropdown.Item href="#/action-2">Переименовать</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </li>
              ))}
            </ul>
          </div>
          <ChatBox channel={currentChannel} />
        </div>
      </div>
    </>
  );
};

export default ChannelsBox;
