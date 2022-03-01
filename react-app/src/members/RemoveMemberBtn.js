import React from 'react';
import axios from 'axios';
import { TrashFill } from 'react-bootstrap-icons';

const RemoveMemberBtn = ({
  groupPk,
  memberPk,
  memberName,
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
      <div class="modal fade" id={`remove-member-modal-${groupPk}`} tabindex="-1" aria-labelledby="delete-group-modal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Warning</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to remove member <strong>{memberName}</strong> from the group?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                class="btn btn-outline-primary"
                data-bs-dismiss="modal"
                onClick={removeMember}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RemoveMemberBtn;
