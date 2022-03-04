import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import InviteMemberBtn from './InviteMemberBtn';
import RemoveMemberBtn from './RemoveMemberBtn';
import { useSelector } from 'react-redux';

const MemberList = ({ groupPk }) => {
  const authUser = useSelector(state => state.app.authUser);
  const [message, setMessage] = useState('');
  const [members, setMembers] = useState([]);
  const [gettingMembers, setGettingMembers] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const reloadMembers = useCallback((groupPk) => {
    if (!groupPk || groupPk <= 0) {
      return;
    }

    setMessage('');
    setGettingMembers(true);
    axios
      .get(`/api/members/${groupPk}/all`)
      .then(({ data }) => {
        const { payload: members } = data;
        setMembers(members);
        const owner = members.find(({ user_pk: memberPk, role }) => memberPk === authUser?.pk && role === 'owner')
        setIsOwner(!!owner);
      })
      .catch((resp) => {
        const { data = {} } = resp;
        const { oper } = data;
        setMessage(oper?.message || 'Cannot load members of selected group');
      })
      .finally(() => setGettingMembers(false))
    ;
  }, []);

  useEffect(() => {
    reloadMembers(groupPk);
  }, [groupPk, reloadMembers]);

  if (!groupPk || groupPk <= 0) {
    return null;
  }

  if (gettingMembers) {
    return (<div>Getting members...</div>);
  }

  return (
    <>
      {message && (
        <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
          {message}
          <button type="button" className="btn-sm btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}
      <div className="mb-2">{`Number of members: ${members?.length} members`}</div>
      {isOwner && (
        <div>
          <InviteMemberBtn groupPk={groupPk} onSuccess={() => reloadMembers(groupPk)} />
        </div>
      )}
      <div className="table-responsive">
        <table class="table table-striped table-hover fw-light">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col" colSpan={2}>Role</th>
            </tr>
          </thead>
          <tbody>
            {members.map(({ pk, name, full_name, email, status, role }, index) => (
              <tr key={`${pk}-${name}-${index}`}>
                <th className="align-middle" scope="row">{index + 1}</th>
                <td className={authUser?.pk === pk ? 'text-primary align-top' : 'align-top'}>
                  <span className="d-block">{`${name}${authUser?.pk === pk ? ' (you)' : ''}`}</span>
                  <span className="d-block text-muted">{full_name}</span>
                </td>
                <td className="align-middle">{email}</td>
                <td className="align-middle">{status}</td>
                <td className="align-middle">{role}</td>
                <td className="align-middle">
                  {role !== 'owner' && (
                    <RemoveMemberBtn
                      groupPk={groupPk}
                      memberPk={pk}
                      memberName={`${name} (${full_name})`}
                      onError={message => setMessage(message)}
                      onSuccess={() => reloadMembers(groupPk)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MemberList;
