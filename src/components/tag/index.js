import React from 'react';
import classNames from 'classnames/bind';

import styles from './tag.module.scss';

const cx = classNames.bind(styles);

// type: class, level
const Tag = (props) => {
  const {
    type,
    children,
    className,
  } = props;

  const customClass = {
    [`tag_${type}`]: type,
    [className]: className,
  };

  return (
    <div className={cx('tag', customClass)}>
      {children}
    </div>
  );
};

export default Tag;
