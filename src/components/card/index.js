import React from 'react';
import classNames from 'classnames/bind';

import styles from './card.module.scss';

const cx = classNames.bind(styles);

// direction: row, column
const Card = (props) => {
  const {
    direction,
    img,
    children,
    className,
  } = props;

  const customClass = {
    [`card_${direction}`]: direction,
    [className]: className,
  };

  return (
    <div className={cx('card', customClass)}>
      <div
        className={cx('card_img')}
        style={{backgroundImage: `url(${img})`}}
      />
      <div className={cx('card_content')}>
        {children}
      </div>
    </div>
  );
};

export default Card;
