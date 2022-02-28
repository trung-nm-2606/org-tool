import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PencilSquare } from 'react-bootstrap-icons';
import DeleteGroupBtn from './DeleteGroupBtn';

const GroupsTable = ({ data = [] }) => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const onSuccessDeleting = useCallback(() => {/* Empty */}, []);

  const onErrorDeleting = useCallback((groupName) => setMessage(`Cannot delete the group ${groupName}`), []);

  const updateGroup = (group) => navigate('/groups/update', { state: group });

  return (
    <>
      {message && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {message}
          <button type="button" className="btn-sm btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <table class="table table-striped table-hover">
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
          {data.map(({ pk, name, description, status, role, members_count }, index) => (
            <tr key={`${pk}-${name}-${index}`}>
              <th scope="row">{index}</th>
              <td>{name}</td>
              <td>{description}</td>
              <td>{status}</td>
              <td>{role}</td>
              <td>
                <Link to={`/members/${pk}`}>
                  {`${members_count} members`}
                </Link>
              </td>
              <td>
                <PencilSquare className="me-2 text-primary" onClick={() => updateGroup({ pk, name, description })} />
                <DeleteGroupBtn
                  groupPk={pk}
                  groupName={name}
                  onSuccess={onSuccessDeleting}
                  onError={onErrorDeleting}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default GroupsTable;
