import React from 'react';

const InputBox = ({ label, type, value, onChange, disabled }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={{ backgroundColor: disabled ? 'gray' : 'white' }}
      />
    </div>
  );
};

export default InputBox;
