import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import GroupsSelect from './GroupsSelect';
import MemberList from './MemberList';

const Members = () => {
  const { state } = useLocation();
  const [groupPk, setGroupPk] = useState(state);

  return (
    <div className="">
      <div className="d-flex align-items-center justify-content-start">
        <h3 className="me-2 mb-0">Members of </h3>
        <GroupsSelect initGroupPk={state} onChange={setGroupPk} />
      </div>
      <MemberList groupPk={groupPk}/>
    </div>
  );
};

export default Members;
