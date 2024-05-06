import React from 'react';

const Dropdown = ({ label, options, selectedValue, onChange }) => {
  return (
    <div>
      <label>
        {label}
        <select value={selectedValue} onChange={onChange}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Dropdown;
