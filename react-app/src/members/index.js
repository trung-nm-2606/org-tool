import React, { useState } from 'react';
import GroupsSelect from './GroupsSelect';
import MemberList from './MemberList';

const Members = () => {
  const [groupPk, setGroupPk] = useState(0);

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-start">
        <h1 className="me-2">Members of </h1>
        <GroupsSelect onChange={setGroupPk} />
      </div>
      <MemberList groupPk={groupPk}/>
    </div>
  );
};

export default Members;
