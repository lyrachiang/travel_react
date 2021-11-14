// package
import React from 'react';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames/bind';

// components
import Container from '../../components/container';

// style
import styles from './home.module.scss';

const cx = classNames.bind(styles);

const Home = () => {
  let history = useHistory();

  return (
    <Container>
      <div className={cx('index_container')}>
        <h2>想去哪逛逛？</h2>
        <div className={cx('content_container')}>
          <div>
            <div className={cx('gap')}>
              <div
                className={cx('index_box')}
                onClick={() => {
                  history.push('/attraction');
                }}
              >
                <div
                  className={cx('index_img')}
                  style={{backgroundImage: `url(${require('./imgs/img_main_1.png').default})`}}
                />
                <div>
                  <p>景點</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className={cx('gap')}>
              <div
                className={cx('index_box')}
                onClick={() => {
                  history.push('/activity');
                }}
              >
                <div
                  className={cx('index_img')}
                  style={{backgroundImage: `url(${require('./imgs/img_main_2.png').default})`}}
                />
                <div>
                  <p>活動</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Home;