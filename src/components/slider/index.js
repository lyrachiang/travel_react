// package
import React, { useState, useCallback, useEffect } from 'react';
import classNames from 'classnames/bind';

// components
import useWindowSize from '../../components/window_size';

// style
import styles from './slider.module.scss';

const cx = classNames.bind(styles);

const Slider = (props) => {
  const {
    dataSource,
    className,
  } = props;

  const customClass = {
    [className]: className,
  };

  const [width] = useWindowSize();
  const [activeImg, seActiveImg] = useState(1);

  useEffect(() => {
    let timeId = -1;

    if (width <= 768) {
      timeId = setInterval(() => {
        seActiveImg((prev) => {
          if (prev + 1 > 2) {
            return 0;
          }

          return prev + 1;
        });
      }, 5000);
    }

    return () => {
      clearInterval(timeId);
    };
  }, [width]);

  const atClickImg = useCallback((index) => {
    seActiveImg(() => index);
  }, []);

  return (
    <div className={cx('slider_container', customClass)}>
      {dataSource.map((img, idx) => {
        return (
          <div
            key={idx}
            className={cx({active: activeImg === idx})}
            onClick={() => atClickImg(idx)}
          >
            <div className={cx('gap')}>
              <div
                className={cx('img_box')} 
                style={{backgroundImage: `url(${img})`}}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Slider;