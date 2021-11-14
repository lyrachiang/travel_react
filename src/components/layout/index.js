// package
import React from 'react';
import classNames from 'classnames/bind';

// providers
import { useLayoutSetting } from '../../providers/layout_provider';

// components
import Header from './header';
import Footer from './footer';

// style
import styles from './layout.module.scss';

const cx = classNames.bind(styles);

const Layout = (props) => {
  const { children } = props;

  const { showHeaderBtn } = useLayoutSetting();

  return (
    <div className={cx('wrapper')}>
      <Header isShowBtn={showHeaderBtn} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;