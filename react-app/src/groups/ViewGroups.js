import React from 'react';
import { Link } from 'react-router-dom';

const ViewGroups = () => {
  return (
    <>
      <div className="d-flex align-items-center justify-content-start">
        <h1 className="me-2">Groups</h1>
        <Link className="btn btn-sm btn-outline-primary" to="/groups/new">New Group</Link>
      </div>
    </>
  );
};

export default ViewGroups;