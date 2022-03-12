import React from 'react';
import { Routes, Route } from 'react-router-dom';

const AllGroups = React.lazy(() => import('./AllGroups'));
const NewGroup = React.lazy(() => import('./NewGroup'));
const UpdateGroup = React.lazy(() => import('./UpdateGroup'));

const GroupManagement = () => (
  <Routes>
    <Route exact path="/" element={(<AllGroups />)} />
    <Route exact path="/new" element={(<NewGroup />)} />
    <Route exact path="/update" element={(<UpdateGroup />)} />
  </Routes>
);

export default GroupManagement;
