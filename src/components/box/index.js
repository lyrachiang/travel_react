import React from 'react';
import classNames from 'classnames/bind';

import styles from './box.module.scss';

const cx = classNames.bind(styles);

// type: title, info
const Box = (props) => {
  const {
    type,
    icon,
    title,
    content,
    className,
  } = props;

  const customClass = {
    [`box_${type}`]: type,
    [className]: className,
  };

  return (
    <div className={cx('box', customClass)}>
      {type === 'title' && (
        <>
          <div>
            {icon && (
              <div className={cx('ico_wrapper')}>
                <i>{icon}</i>
              </div>
            )}
            <h2>{title}</h2>
          </div>
          <div>
            <p>共搜尋到<span>{content}</span>筆結果</p>
          </div>
        </>
      )}
      {type === 'info' && (
        <>
          <div>
            <div className={cx('ico_wrapper')}>
              <i>{icon}</i>
            </div>
            <p>{title}</p>
          </div>
          <div>
            <p>{content}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default Box;
