import React from 'react';
import { Link } from 'react-router-dom';
import GroupsTable from './GroupsTable';

const ViewGroups = () => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-start">
        <h3 className="me-2 mb-0">Groups</h3>
        <Link className="btn btn-sm btn-outline-primary" to="/groups/new">New Group</Link>
      </div>
      <div>
        <GroupsTable />
      </div>
    </>
  );
};

export default ViewGroups;
