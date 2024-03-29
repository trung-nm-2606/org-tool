import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquare } from 'react-bootstrap-icons';
import DeleteGroupBtn from './DeleteGroupBtn';

const GroupsTable = ({ data = [] }) => {
  const navigate = useNavigate();
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

  const onErrorDeleting = useCallback((groupName) => setMessage(`Cannot delete the group ${groupName}`), []);

  const updateGroup = (group) => navigate('/management/groups/update', { state: group });

  const viewMembers = (groupPk) => navigate('/management/members', { state: groupPk });

  if (gettingGroups) {
    return (<div>Getting groups...</div>);
  }

  return (
    <>
      {message && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {message}
          <button type="button" className="btn-sm btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <div className="table-responsive">
        <table className="table table-striped table-hover fw-light">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Status</th>
              <th scope="col">Role</th>
              <th scope="col" colSpan={2}>N0 of Members</th>
            </tr>
          </thead>
          <tbody>
            {groups.map(({ pk, name, description, status, role, members_count }, index) => (
              <tr key={`${pk}-${name}-${index}`}>
                <th className="align-middle" scope="row">{index + 1}</th>
                <td className="align-middle">{name}</td>
                <td className="align-middle">{description}</td>
                <td className="align-middle">{status}</td>
                <td className="align-middle">{role}</td>
                <td className="align-middle">
                  <button type="button" className="btn btn-link" onClick={() => viewMembers(pk)}>
                    {`${members_count} members`}
                  </button>
                </td>
                <td className="align-middle">
                  <PencilSquare role="button" className="me-2 text-primary" onClick={() => updateGroup({ pk, name, description })} />
                  <DeleteGroupBtn
                    groupPk={pk}
                    groupName={name}
                    onSuccess={loadGroups}
                    onError={onErrorDeleting}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default GroupsTable;
