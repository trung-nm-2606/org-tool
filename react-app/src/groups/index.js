import React from 'react';
import { Route, Routes } from 'react-router-dom';

const ViewGroups = React.lazy(() => import('./ViewGroups'));
const NewGroupForm = React.lazy(() => import('./NewGroupForm'));
const EditGroupForm = React.lazy(() => import('./EditGroupForm'));

const Groups = () => (
  <Routes>
    <Route exact path="new" element={<NewGroupForm />}/>
    <Route exact path="edit" element={<EditGroupForm />}/>
    <Route exact path="/" element={<ViewGroups />}/>
  </Routes>
);

export default Groups;
