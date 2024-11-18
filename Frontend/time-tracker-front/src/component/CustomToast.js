import React from 'react';

const CustomToast = ({ taskName, message }) => (
    <div>
        <strong>{taskName}</strong>
        <br />
        <span>{message}</span>
    </div>
);

export default CustomToast;
