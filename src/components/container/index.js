import React from 'react';
import classNames from 'classnames/bind';

import styles from './container.module.scss';

const cx = classNames.bind(styles);

const Container = (props) => {
  const { children, className } = props;

  const customClass = {
    [className]: className,
  };

  return (
    <div className={cx('container', customClass)}>
      {children}
    </div>
  );
};

export default Container;
