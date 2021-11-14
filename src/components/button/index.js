import React from 'react';
import classNames from 'classnames/bind';

import styles from './button.module.scss';

const cx = classNames.bind(styles);

// type: primary / secondary
// size: default / small / large
// shape: circle / round
const Button = (props) => {
  const {
    type,
    size,
    icon,
    shape,
    block,
    iconRight,
    children,
    className,
    ...restProps
  } = props;

  const customClass = {
    [`btn_${type}`]: type,
    [`btn_${size}`]: size,
    [shape]: shape,
    block: block,
    icon_right: iconRight,
    [className]: className,
  };

  return (
    <button className={cx('btn', customClass)} {...restProps}>
      {icon && (
        <div className={cx('ico_wrapper')}>
          <i>{icon}</i>
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;
