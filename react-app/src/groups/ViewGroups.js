import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import GroupsTable from './GroupsTable';
import axios from 'axios';

const ViewGroups = () => {
  const [groups, setGroups] = useState([]);
  const [message, setMessage] = useState('');
  const [gettingGroups, setGettingGroups] = useState(true);

  useEffect(() => {
    axios
      .get('/api/groups/all')
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
  }, [/* componentDidMount */]);

  return (
    <>
      <div className="d-flex align-items-center justify-content-start">
        <h1 className="me-2">Groups</h1>
        <Link className="btn btn-sm btn-outline-primary" to="/groups/new">New Group</Link>
      </div>
      {message && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {message}
          <button type="button" className="btn-sm btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <div>
        {gettingGroups ? (
          <div>Getting groups...</div>
        ) : (
          <GroupsTable data={groups} />
        )}
      </div>
    </>
  );
};

export default ViewGroups;
