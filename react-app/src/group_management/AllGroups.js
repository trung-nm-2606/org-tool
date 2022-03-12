import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import appRedux from '../redux/app';
import { useNavigate } from 'react-router-dom';
import DeleteGroupBtn from './groups/DeleteGroupBtn';
import { PencilSquare } from 'react-bootstrap-icons';

const AllGroups = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authUser = useSelector(state => state.app.authUser);
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [gettingGroups, setGettingGroups] = useState(true);

  const loadGroups = useCallback((isActive) => {
    setMessage('');
    setGettingGroups(true);
    axios
      .get('/api/groups/get-all')
      .then(({ data }) => {
        const { payload } = data;
        setGroups(payload);

        let activeGroup;
        if (isActive) {
          activeGroup = payload[0];
        } else {
          activeGroup = payload.find(group => group.active);
        }
        const { pk, name } = activeGroup || {};
        dispatch(appRedux.actions.setActiveGroup({ pk, name }));

        if (activeGroup && activeGroup.pk) {
          axios.post(`/api/groups/${pk}/set-active`);
        }
      })
      .catch(({ data }) => {
        const { oper } = data;
        setMessage(oper?.message);
      })
      .finally(() => setGettingGroups(false))
    ;
  }, []);

  const onErrorDeleting = useCallback((groupName) => setMessage(`Cannot delete the group ${groupName}`), []);

  const updateGroup = (group) => navigate('/group-management/update', { state: group });

  useEffect(() => {
    loadGroups();
  }, [/* componentDidMount */]);

  return (
    <div className="m-3">
      <div className="container">
        <h3>AllGroups</h3>
        {message && (
          <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            {message}
            <button type="button" className="btn-sm btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}
        {!gettingGroups && (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
            {groups.map(({ pk, name, description, status, role, members_count }, index) => (
              <div className="col mb-2" key={`${pk}-${name}-${index}`}>
                <div className="card">
                  <div className="card-body">
                    <div className="mb-2">
                      <h4
                        className={`card-title mb-0 ${authUser?.activeGroup?.pk === pk ? ' text-success' : ''}`}
                        style={{ 'white-space': 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis' }}
                      >
                        {name}
                      </h4>
                      <span className="d-inline-block text-muted me-2"><small>{`(${role})`}</small></span>
                      <span className="me-2">
                        <DeleteGroupBtn
                          groupPk={pk}
                          groupName={name}
                          onSuccess={() => loadGroups(authUser?.activeGroup?.pk === pk)}
                          onError={onErrorDeleting}
                        />
                      </span>
                      <span>
                        <PencilSquare
                          role="button"
                          className="text-primary"
                          onClick={() => updateGroup({ pk, name, description })}
                        />
                      </span>
                    </div>
                    <p className="card-text">
                      <small>{`${members_count} thành viên`}</small>
                    </p>
                    <a
                      href="/group/dashboard"
                      className="btn btn-outline-primary"
                      style={{ 'font-size': '.875rem' }}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/group/dashboard');
                        dispatch(appRedux.actions.setActiveGroup({ pk, name }));
                        axios.post(`/api/groups/${pk}/set-active`);
                      }}
                    >
                      Xem chi tiết
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
;};

export default AllGroups;
