import React from 'react';
import {Redirect} from '@docusaurus/router';

function Home() {
  return <Redirect to={ process.env.BASE === 'taro' ? "/taro/docs/README" : "/docs/README"  } />;
}

export default Home
