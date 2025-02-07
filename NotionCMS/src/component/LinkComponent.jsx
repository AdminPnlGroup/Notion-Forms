import React from 'react'

import { Link, useMatch, useResolvedPath } from "react-router-dom";

function LinkComponent({to, children, ...props}) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true})
  return (
    <li className={`hover:text-blue-700 transition-all ${isActive ? "text-blue-700" : ""}`}>
        <Link to={to} {...props}>
            {children}
        </Link>
    </li>
  )
}

export default LinkComponent