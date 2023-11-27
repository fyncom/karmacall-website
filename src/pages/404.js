import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Link } from "gatsby"

const NotFoundPage = () => (
  <Layout>
    <Seo title="404 FynCom" description="This page doesn't exist yet" />
    <h1>404: Not Found</h1>
    <p>You just hit a route that doesn&#39;t exist.</p>
    <p>
      Try going back home <Link to="/"> by clicking here </Link>{" "}
    </p>
  </Layout>
)

export const Head = () => <Seo title="404: Not Found" />

export default NotFoundPage
