import React from 'react';

const CopyLinkButton = ({ link, onCopyLink, className }) => {
  const copyLink = () => {
    onCopyLink(link);
  };

  return (
    <button onClick={copyLink} className={`share-button copy-link-button ${className}`}>
      Copy Link
    </button>
  );
};
export default CopyLinkButton;
