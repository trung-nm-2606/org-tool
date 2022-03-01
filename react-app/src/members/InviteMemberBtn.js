import React, { useRef, useState } from 'react';
import axios from 'axios';

const InviteMemberBtn = ({ groupPk, onReLoadMembers }) => {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const ref = useRef();

  const inviteMember = () => {
    setMessage('');
    setSubmitting(true);
    axios
      .post(`/api/members/${groupPk}/invite`, { email })
      .then(({ data }) => {
        const { oper } = data;
        if (oper?.status === 'success') {
          ref.current.click();
          onReLoadMembers();
        } else {
          setMessage(oper?.message || 'Cannot invite member');
        }
      })
      .catch(({ data = {} }) => {
        const { oper } = data;
        setMessage(oper?.message || 'Cannot invite member');
      })
      .finally(() => {
        setSubmitting(false);
      })
    ;
  };

  const clearForm = () => {
    setMessage('');
    setSubmitting(false);
    setEmail('');
  };

  return (
    <>
      <button
        type="button"
        class="btn btn-outline-primary btn-sm"
        data-bs-toggle="modal"
        data-bs-target="#invite-member-modal"
        onClick={clearForm}
      >
        Invite Member
      </button>
      <div class="modal fade" id="invite-member-modal" tabindex="-1" aria-labelledby="invite-member-modal">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Invite Member</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={ref}
              />
            </div>
            <div class="modal-body">
              {message && (
                <div className="alert alert-danger alert-dismissible fade show mb-3" role="alert">
                  {message}
                  <button type="button" className="btn-sm btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
              )}
              <div className="mb-3">
                <label for="member-email" className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  id="member-email"
                  placeholder="Enter member email address"
                  disabled={submitting}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={inviteMember}
                disabled={submitting}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InviteMemberBtn;
