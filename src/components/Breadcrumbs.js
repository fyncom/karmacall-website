import React from "react"
import { Link } from "gatsby"

const Breadcrumbs = ({ link, title }) => {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item">
          <Link to={link}>Help Center</Link>
        </li>
        <li className="breadcrumb-item active" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>
  )
}

export default Breadcrumbs
