import React from 'react';
import { TokenExplore } from '../../components';

import styles from './index.module.scss';

function HomePage() {
  return (
    <div className={styles.wrapper}>
      <div className="container mx-auto">
        <div className="content">
          <TokenExplore isSmall={true} />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
