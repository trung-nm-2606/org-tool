import React from 'react';
import { Link } from 'react-router-dom';

const BackToViewGroups = () => {
  return (
    <Link className="btn btn-sm btn-outline-primary" to="/management/groups">
      Cancel
    </Link>
  );
};

export default BackToViewGroups;
