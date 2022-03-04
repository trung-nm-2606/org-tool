import React from 'react';
import axios from 'axios';
import { TrashFill } from 'react-bootstrap-icons';

const RemoveMemberBtn = ({
  groupPk,
  memberPk,
  memberName,
  isOwner,
  onError,
  onSuccess
}) => {
  const removeMember = () => {
    axios
      .delete(`/api/members/${groupPk}/${memberPk}/remove`)
      .then(onSuccess)
      .catch(({ data = {} }) => {
        const { oper } = data;
        onError(oper?.message);
      })
    ;
  };

  return (
    <>
      <TrashFill
        role="button"
        className="me-2 text-danger"
        data-bs-toggle="modal"
        data-bs-target={`#remove-member-modal-${groupPk}`}
      />
      <div className="modal fade" id={`remove-member-modal-${groupPk}`} tabindex="-1" aria-labelledby="delete-group-modal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Warning</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {isOwner ? (
                <p>Are you sure you want to remove member <strong>{memberName}</strong> from the group?</p>
              ) : (
                <p>Are you sure you want to leave the group?</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-outline-primary"
                data-bs-dismiss="modal"
                onClick={removeMember}
              >
                {isOwner ? 'Remove Member' : 'Leave Group'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveMemberBtn;
