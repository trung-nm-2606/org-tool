import React from 'react';
import { useLocation } from 'react-router-dom';
import GroupForm from './GroupForm';

const UpdateGroupForm = () => {
  const { state } = useLocation();
  console.log(JSON.stringify(state));
  return (
    <GroupForm group={state} />
  );
};

export default UpdateGroupForm;
