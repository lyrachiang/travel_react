import React from 'react';
import classNames from 'classnames/bind';

import Container from '../../container';

import styles from './footer.module.scss';

const cx = classNames.bind(styles);

const Footer = () => {
  return (
    <footer className={cx('footer_container')}>
      <Container>
        <p>© 2021 我覺得這個才對, Inc. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;