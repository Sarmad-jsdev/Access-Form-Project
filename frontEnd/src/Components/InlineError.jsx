// This component is used to display inline error messages in the form. It takes a message prop and displays it in a styled div. If there is no message, it returns null and does not render anything.      

import React from 'react'

const InlineError = ({ message }) => {
  if (!message) return null;

  return (
    <div className="mt-2 bg-red-600 text-white text-sm px-4 py-2 rounded-md w-fit">
      {message}
    </div>
  );
}

export default InlineError