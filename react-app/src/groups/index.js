import React from 'react';
import { Route, Routes } from 'react-router-dom';

const ViewGroups = React.lazy(() => import('./ViewGroups'));
const NewGroupForm = React.lazy(() => import('./NewGroupForm'));
const UpdateGroupForm = React.lazy(() => import('./UpdateGroupForm'));

const Groups = () => (
  <div className="container">
    <Routes>
      <Route exact path="new" element={<NewGroupForm />}/>
      <Route exact path="update" element={<UpdateGroupForm />}/>
      <Route exact path="/" element={<ViewGroups />}/>
    </Routes>
  </div>
);

export default Groups;
