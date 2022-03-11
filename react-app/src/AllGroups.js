import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const AllGroups = () => {
  const authUser = useSelector(state => state.app.authUser);
  const [message, setMessage] = useState('');
  const [groups, setGroups] = useState([]);
  const [gettingGroups, setGettingGroups] = useState(true);

  const loadGroups = useCallback(() => {
    setMessage('');
    setGettingGroups(true);
    axios
      .get('/api/groups/get-all')
      .then(({ data }) => {
        const { payload } = data;
        setGroups(payload);
      })
      .catch(({ data }) => {
        const { oper } = data;
        setMessage(oper?.message);
      })
      .finally(() => setGettingGroups(false))
    ;
  }, []);

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
                      <h4 className={`card-title mb-0 ${authUser?.activeGroup?.pk === pk ? ' text-success' : ''}`}>{name}</h4>
                      <span className="d-inline-block text-muted"><small>{`(${role})`}</small></span>
                    </div>
                    <p className="card-text">
                      <small>{`${members_count} thành viên`}</small>
                    </p>
                    <a href="/group/dashboard" className="btn btn-outline-primary" style={{ 'font-size': '.875rem' }}>Xem chi tiết</a>
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
