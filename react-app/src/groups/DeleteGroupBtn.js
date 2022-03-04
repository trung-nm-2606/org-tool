import React from 'react';
import axios from 'axios';
import { TrashFill } from 'react-bootstrap-icons';

const DeleteGroupBtn = ({ groupPk, groupName, onError, onSuccess }) => {
  const deleteGroup = () => {
    axios
      .delete(`/api/groups/${groupPk}/delete`)
      .then(onSuccess)
      .catch(() => onError(groupName))
    ;
  };

  return (
    <>
      <TrashFill role="button" className="text-danger" data-bs-toggle="modal" data-bs-target={`#delete-group-modal-${groupPk}`} />
      <div class="modal fade" id={`delete-group-modal-${groupPk}`} tabindex="-1" aria-labelledby="delete-group-modal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Warning</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to delete the group <strong>{groupName}</strong>?</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                class="btn btn-outline-primary"
                data-bs-dismiss="modal"
                onClick={deleteGroup}
              >
                Delete it
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteGroupBtn;
