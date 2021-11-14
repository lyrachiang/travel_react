// package
import React, { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import classNames from 'classnames/bind';

// providers
import { useLayout } from '../../../providers/layout_provider';

// components
import Container from '../../../components/container';
import Slider from '../../../components/slider';
import Block from '../../../components/block';
import Box from '../../../components/box';
import {
  PhoneIcon,
  MapMarkerAltIcon,
  ClockIcon,
} from '../../../components/icons';

//slice
import {
  getRestaurantState,
  fetchRestaurantById,
  setRestaurantInfo,
} from '../../../store/slice/restaurant';
import { setFilter } from '../../../store/slice/filter';

// style
import styles from './page.module.scss';

const cx = classNames.bind(styles);

const ProfileBlock = (props) => {
  const { dataSource } = props;
  const { Phone, Address, OpenTime } = dataSource;

  return (
    <div className={cx('profile_block')}>
      <Box
        type="info"
        icon={<PhoneIcon />}
        title="聯絡電話："
        content={Phone ? (
          <a href={`tel:${Phone}`}>{Phone}</a>
        ) : '沒錢裝電話啦！求贊助～～'}
      />
      <Box
        type="info"
        icon={<MapMarkerAltIcon />}
        title="店家地址："
        content={Address || '太好吃了才不告訴你'}
      />
      <Box
        type="info"
        icon={<ClockIcon />}
        title="開放時間："
        content={OpenTime !== '無' ? OpenTime : '只有天選之人才吃得到'}
      />
    </div>
  );
};

const Page = () => {
  const dispatch = useDispatch();
  const { setLayout } = useLayout();
  const { restaurantInfo } = useSelector(getRestaurantState);
  let { params: { id } } = useRouteMatch();
  let history = useHistory();

  const { Name, Description, Picture } = restaurantInfo;

  useEffect(() => {
    setLayout({ showHeaderBtn: true });
    dispatch(setFilter({back: '', filter: ''}));

    return () => {
      setLayout({ showHeaderBtn: false });
    }
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchRestaurantById({
        id: id,
        fields: 'ID,Name,Description,Phone,Address,OpenTime,Picture',
      }));
    }

    return () => {
      dispatch(setRestaurantInfo({}));
    }
  }, [dispatch, id]);

  const restaurantImg = useMemo(() => {
    let imgs = [];

    for(let i = 1; i <= 3; i++) {
      if (Picture && Picture[`PictureUrl${i}`]) {
        imgs.push(Picture[`PictureUrl${i}`]);
      }
    }

    if (imgs.length < 3) {
      switch(imgs.length) {
        case 1:
          imgs.unshift(`${require('../imgs/img_default_restaurant.png').default}`);
          imgs.push(`${require('../imgs/img_default_restaurant.png').default}`);
        break;

        case 2:
          imgs.unshift(`${require('../imgs/img_default_restaurant.png').default}`);
        break;

        default:
          imgs.push(`${require('../imgs/img_default_restaurant.png').default}`);
          imgs.push(`${require('../imgs/img_default_restaurant.png').default}`);
          imgs.push(`${require('../imgs/img_default_restaurant.png').default}`);
        break;
      }
    }

    return imgs;
  }, [Picture]);
  
  return (
    <Container>
      <Slider dataSource={restaurantImg} />
      <Block
        type="secondary"
        theme="restaurant"
        className={cx('page_block')}
      >
        <div className={cx('profile_container')}>
          <h2>{Name}</h2>
          <div>
            <div>
              <div className={cx('gap')}>
                <div>
                  <p>{Description && Description !== '無' ? Description : '直接來不就知道了? 先訂位再說阿!'}</p>
                </div>
              </div>
            </div>
            <div>
              <div className={cx('gap')}>
                <ProfileBlock dataSource={restaurantInfo} />
              </div>
            </div>
          </div>
        </div>
        <div className={cx('choose_container')}>
          <div>
            <h3>換個地方看看？</h3>
          </div>
          <div>
            <div className={cx('choose_block')}>
              <div>
                <div className={cx('gap')}>
                  <div
                    className={cx('choose_box')}
                    onClick={() => {
                      history.push('/attraction');
                    }}
                  >
                    <div
                      className={cx('choose_img')}
                      style={{backgroundImage: `url(${require('../imgs/img_scenic_spot.png').default})`}}
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
                    className={cx('choose_box')}
                    onClick={() => {
                      history.push('/activity');
                    }}
                  >
                    <div
                      className={cx('choose_img')}
                      style={{backgroundImage: `url(${require('../imgs/img_activity.png').default})`}}
                    />
                    <div>
                      <p>活動</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Block>
    </Container>
  );
};

export default Page;