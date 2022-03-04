import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

const GroupsSelect = ({ initGroupPk, onChange }) => {
  const [hasError, setHasError] = useState(false);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [gettingGroups, setGettingGroups] = useState(true);

  const loadGroups = useCallback(() => {
    axios
      .get('/api/groups/get-all')
      .then(({ data }) => {
        const { payload: groups } = data;
        setGroups(groups);
        const initGroup = groups.find(({ pk }) => initGroupPk === pk);
        const group = initGroup || groups[0];
        onChange(group?.pk);
        setSelectedGroup(group?.name);
      })
      .catch(() => setHasError(true))
      .finally(() => setGettingGroups(false))
    ;
  }, [initGroupPk, onChange]);

  useEffect(() => {
    loadGroups();
  }, [/* componentDidMount */]);

  if (gettingGroups) {
    return (<div>Getting groups...</div>);
  }

  return (
    <div class="dropdown">
      <button class="btn btn-outline-primary btn-sm dropdown-toggle" type="button" id="groups-selector" data-bs-toggle="dropdown" aria-expanded="false">
        {selectedGroup || 'Select a group'}
      </button>
      <ul class="dropdown-menu" aria-labelledby="groups-selector">
        {groups.map(({ pk, name }, index) => (
          <li
            key={`${pk}-${name}-${index}`}
            onClick={() => {
              setSelectedGroup(name);
              onChange(pk);
            }}
          >
            <span className={`dropdown-item${name === selectedGroup ? ' text-primary' : ''}`}>{name}</span>
          </li>
        ))}
        {hasError && (
          <li onClick={loadGroups}>
            <span className="dropdown-item">Retry loading groups</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default GroupsSelect;
