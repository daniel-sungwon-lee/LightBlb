import React, { useState } from 'react';

export default function Auth(props) {
  const [page, setPage] = useState("login")

  if(page === "login") {
    return (
      <div className="container">
        <div className="m-5">
          <img src="/images/lightblb.svg" alt="LightBlb logo" width="200" />
        </div>
        <div>
          <h1>LightBlb</h1>
        </div>
      </div>
    )

  } else {
    return (
      <div className="container">

      </div>
    )
  }
}
