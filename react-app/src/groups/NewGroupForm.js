import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingButton from '../shared/LoadingButton';

const NewGroupForm = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  const createNewGroup = (e) => {
    e.preventDefault();
    setSubmitting(true);
    axios
      .post('/api/groups/new', { name, desc })
      .then(({ data }) => {
        const { oper } = data;
        if (oper?.status === 'failed') {
          setMessage(oper?.message);
        } else {
          navigate('/groups');
        }
      })
      .catch(() => setMessage('Cannot create a new group'))
      .finally(() => setSubmitting(false))
    ;
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h1>New Group Form</h1>
      </div>
      <form onSubmit={createNewGroup}>
        {message && (
          <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
            {message}
            <button type="button" className="btn-sm btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        )}
        <div className="mb-3">
          <label for="group-name" className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            id="group-name"
            placeholder="Enter group name"
            disabled={submitting}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label for="group-desc" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="group-desc"
            placeholder="Describe your group"
            disabled={submitting}
            value={desc}
            onChange={e => setDesc(e.target.value)}
          />
        </div>
        <div>
          <LoadingButton
            label="Create"
            loadingLabel="Submitting..."
            loading={submitting}
            disabled={submitting || !name}
            className="btn btn-outline-primary me-2"
          />
          <Link className="btn" to="/groups">Cancel</Link>
        </div>
      </form>
    </>
  );
};

export default NewGroupForm;
