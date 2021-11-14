import React from 'react';
import classNames from 'classnames/bind';

import styles from './block.module.scss';

const cx = classNames.bind(styles);

// type: primary, secondary
// theme: restaurant, hotel
const Block = (props) => {
  const {
    type,
    theme,
    children,
    className,
  } = props;

  const customClass = {
    [`block_${type}`]: type,
    [`block_${theme}`]: theme,
    [className]: className,
  };

  return (
    <div className={cx('block', customClass)}>
      {children}
    </div>
  );
};

export default Block;
