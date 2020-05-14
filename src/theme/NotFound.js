/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '@theme/Layout';
import { useLocation, Redirect } from "@docusaurus/router";
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';

function pathJoin(parts, sep){
  let separator = sep || '/';
  let replace   = new RegExp(separator+'{1,}', 'g');
  return parts.join(separator).replace(replace, separator);
}

function NotFound() {
  const { pathname = '' } = useLocation()

  const {
    siteConfig: {
      baseUrl = ''
    },
  } = useDocusaurusContext();

  const url = useBaseUrl(pathname)

  if (url.endsWith('.html')) {
    const twoBaseUrl = pathJoin([baseUrl, baseUrl])
    return <Redirect to={url.slice(url.startsWith(twoBaseUrl) ? baseUrl.length - 1 : 0, -5)} />
  }

  return (
    <Layout title="Page Not Found">
      <div className="container margin-vert--xl">
        <div className="row">
          <div className="col col--6 col--offset-3">
            <h1 className="hero__title">404</h1>
            <p>We could not find what you were looking for.</p>
            <p>
              Please contact the owner of the site that linked you to the
              original URL and let them know their link is broken.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;