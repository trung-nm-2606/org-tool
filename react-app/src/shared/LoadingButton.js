import React from 'react';

const LoadingButton = ({ loading = false, loadingLabel = 'Loading...', label, className, disabled }) => {
  return (
    <button type="submit" className={className} tooltip={label} disabled={disabled}>
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          {loadingLabel}
        </>
      ) : (
        <>{label}</>
      )}
    </button>
  );
};

export default LoadingButton;
