import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingButton from '../../shared/LoadingButton';

const GroupForm = ({ group }) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [name, setName] = useState(group?.name || '');
  const [description, setDescription] = useState(group?.description || '');

  const label = !group?.pk ? 'New Group Form' : 'Edit Group Form';
  const submitLabel = !group?.pk ? 'Create' : 'Save';
  const apiErrorMessage = !group?.pk ? 'Cannot create a new group' : 'Cannot update this group';

  const createUpdateGroup = (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);

    const api = !group?.pk ? '/api/groups/new' : `/api/groups/${group?.pk}/update`;
    const payload = { name, description };
    const req = !group?.pk ? axios.post(api, payload) : axios.put(api, payload);
    req
      .then(({ data }) => {
        const { oper } = data;
        if (oper?.status === 'failed') {
          setMessage(oper?.message);
        } else {
          navigate('/management/groups');
        }
      })
      .catch(() => setMessage(apiErrorMessage))
      .finally(() => setSubmitting(false))
    ;
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between">
        <h3>{label}</h3>
      </div>
      <form onSubmit={createUpdateGroup}>
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
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <div>
          <LoadingButton
            label={submitLabel}
            loadingLabel="Submitting..."
            loading={submitting}
            disabled={submitting || !name}
            className="btn btn-outline-primary me-2"
          />
          <Link className="btn" to="/management/groups">Cancel</Link>
        </div>
      </form>
    </>
  );
};

export default GroupForm;
