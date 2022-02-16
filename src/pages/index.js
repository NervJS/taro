import React from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

function Home() {
  const url = useBaseUrl('/docs')
  return <Redirect to={url} />;
}

export default Home
