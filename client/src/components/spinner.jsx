import React from 'react';
import { CircularProgress } from '@material-ui/core';

export default function Spinner () {
  return (
    <div className="spinner">
      <CircularProgress color="inherit" thickness={4} size={50} />
    </div>
  )
}
