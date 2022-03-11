import React from 'react';
import axios from 'axios';
import { TrashFill } from 'react-bootstrap-icons';

const DeleteGroupBtn = ({ groupPk, groupName, isActive = false, onError, onSuccess }) => {
  const deleteGroup = () => {
    axios
      .delete(`/api/groups/${groupPk}/delete?isActive=${isActive ? '1' : '0'}`)
      .then(onSuccess)
      .catch(() => onError(groupName))
    ;
  };

  return (
    <>
      <TrashFill role="button" className="text-danger" data-bs-toggle="modal" data-bs-target={`#delete-group-modal-${groupPk}`} />
      <div className="modal fade" id={`delete-group-modal-${groupPk}`} tabindex="-1" aria-labelledby="delete-group-modal" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Warning</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete the group <strong>{groupName}</strong>?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn" data-bs-dismiss="modal">Cancel</button>
              <button
                type="button"
                className="btn btn-outline-primary"
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
