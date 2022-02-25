import React from 'react';
import { Link } from 'react-router-dom';
import { PencilSquare, TrashFill } from 'react-bootstrap-icons'

const GroupsTable = ({ data = [] }) => {
  return (
    <table class="table table-striped table-hover">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Description</th>
          <th scope="col">Status</th>
          <th scope="col">Role</th>
          <th scope="col" colSpan={2}>N0 of Members</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ pk, name, desc, status, role, members_count }, index) => (
          <tr>
            <th scope="row">{index}</th>
            <td>{name}</td>
            <td>{desc}</td>
            <td>{status}</td>
            <td>{role}</td>
            <td>
              <Link to={`/members/${pk}`}>
                {`${members_count} members`}
              </Link>
            </td>
            <td>
              <PencilSquare className="me-2 text-primary" />
              <TrashFill className="text-danger" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GroupsTable;