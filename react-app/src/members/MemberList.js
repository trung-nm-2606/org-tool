import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MemberList = ({ groupPk }) => {
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [gettingMembers, setGettingMembers] = useState(true);

  useEffect(() => {
    if (!groupPk || groupPk <= 0) {
      return;
    }

    setMessage('');
    setGettingMembers(true);
    axios
      .get(`/api/members/${groupPk}/all`)
      .then(({ data }) => {
        const { payload } = data;
        setMembers(payload);
      })
      .catch((resp) => {
        const { data = {} } = resp;
        const { oper } = data;
        setMessage(oper?.message || 'Cannot load members of selected group');
      })
      .finally(() => setGettingMembers(false))
    ;
  }, [groupPk]);

  if (!groupPk || groupPk <= 0) {
    return null;
  }

  if (gettingMembers) {
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
      {`Number of members: ${members?.length} members`}
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Status</th>
            <th scope="col">Role</th>
          </tr>
        </thead>
        <tbody>
          {members.map(({ pk, name, full_name, email, status, role }, index) => (
            <tr key={`${pk}-${name}-${index}`}>
              <th scope="row">{index}</th>
              <td>
                <span className="d-block">{`${name}${role === 'owner' ? ' (you)' : ''}`}</span>
                <span className="d-block text-muted">{full_name}</span>
              </td>
              <td>{email}</td>
              <td>{status}</td>
              <td>{role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default MemberList;
