import React, { useState } from 'react';
import { Header, WalletModal } from '../components/index';

import styles from './index.module.scss';

export const MainLayout: React.FC = ({ children }) => {

  const [visibleWalletModal, setVisibleWalletModal] = useState(false);

  const onOpenWalletModal = () => setVisibleWalletModal(true)
  const onCloseWalletModal = () => setVisibleWalletModal(false)

  return (
    <div className={styles.wrapper}>
      <Header onOpenWalletModal={onOpenWalletModal} />
      <main>
        { children }
      </main>
      <WalletModal
        visible={visibleWalletModal}
        onClose={onCloseWalletModal}
      />
    </div>
  )
}

export default MainLayout;