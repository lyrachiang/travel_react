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
import Tag from '../../../components/tag';
import {
  PhoneIcon,
  MapMarkerAltIcon,
  GlobeAsiaIcon,
  CarIcon,
} from '../../../components/icons';

//slice
import {
  getHotelState,
  fetchHotelById,
  setHotelInfo,
} from '../../../store/slice/hotel';
import { setFilter } from '../../../store/slice/filter';

// style
import styles from './page.module.scss';

const cx = classNames.bind(styles);

const ProfileBlock = (props) => {
  const { dataSource } = props;
  const {
    Phone,
    Address,
    WebsiteUrl,
    Spec,
    ServiceInfo,
    ParkingInfo,
    Class,
    Grade
  } = dataSource;

  return (
    <div className={cx('profile_block')}>
      <div className={cx('profile_info_block')}>
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
          title="旅館地址："
          content={Address || '只有天選之人才看得到'}
        />
        <Box
          type="info"
          icon={<GlobeAsiaIcon />}
          title="相關連結："
          content={WebsiteUrl ? (
            <a href={WebsiteUrl} target="_blank" rel="noreferrer">{WebsiteUrl}</a>
          ) : '沒錢做網頁啦！求贊助～～'}
        />
      </div>
      {Spec ? (
        <SpecBlock dataSource={Spec}/>
      ) : (
        <div className={cx('spec_block')}>
          <Box
            type="info"
            title="請來電洽詢房型"
            content=""
            className={cx('spec_box')}
          />
        </div>
      )}
      {(ServiceInfo || ParkingInfo) && (
        <ExtraInfoBlock
          service={ServiceInfo}
          parking={ParkingInfo}
        />
      )}
      {(Class || Grade) && (
        <div className={cx('tag_container')}>
          {Class && (
            <div>
              <div className={cx('gap')}>
                <Tag type="class">{Class}</Tag>
              </div>
            </div>
          )}
          {Grade && (
            <div>
              <div className={cx('gap')}>
                <Tag type="level">{Grade}</Tag>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const SpecBlock = (props) => {
  const { dataSource } = props;
  const specData = dataSource.split(';');

  return (
    <div className={cx('spec_block')}>
      {specData.map((spec, idx) => {
        const specFilter = spec.match(/^([\u4e00-\u9fa5_a-zA-Z]+)([0-9]+)$/);

        if (!specFilter) {
          return null;
        }

        return (
          <React.Fragment key={idx}>
            <Box
              type="info"
              title={specFilter[1] || ''}
              content={specFilter[2] ? `$${specFilter[2]}` : '--'}
              className={cx('spec_box')}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
};

const ExtraInfoBlock = (props) => {
  const { service, parking } = props;
  const parkingFilter = parking.replace('車位:', '').split('、').filter((item) => item.match(/^小客車/));
  const parkingCntFilter = parkingFilter.length > 0 ? parkingFilter[0].match(/([0-9]+)/) : [];
  
  return (
    <div className={cx('extra_info_block')}>
      <div>
        <div className={cx('gap')}>
          <div className={cx('parking_img')}>
            <i><CarIcon /></i>
            <span>
              <span>{parkingCntFilter[1] || 0}</span>
            </span>
          </div>
        </div>
      </div>
      <div>
        <div className={cx('gap')}>
          <div className={cx('service_box')}>
            <p>{service}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Page = () => {
  const dispatch = useDispatch();
  const { setLayout } = useLayout();
  const { hotelInfo } = useSelector(getHotelState);
  let { params: { id } } = useRouteMatch();
  let history = useHistory();

  const { Name, Description, Picture } = hotelInfo;

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
      dispatch(fetchHotelById({
        id: id,
        fields: 'ID,Name,Description,Grade,Address,Phone,WebsiteUrl,Picture,Class,Spec,ServiceInfo,ParkingInfo',
      }));
    }

    return () => {
      dispatch(setHotelInfo({}));
    }
  }, [dispatch, id]);

  const hotelImg = useMemo(() => {
    let imgs = [];

    for(let i = 1; i <= 3; i++) {
      if (Picture && Picture[`PictureUrl${i}`]) {
        imgs.push(Picture[`PictureUrl${i}`]);
      }
    }

    if (imgs.length < 3) {
      switch(imgs.length) {
        case 1:
          imgs.unshift(`${require('../imgs/img_default_hotel.png').default}`);
          imgs.push(`${require('../imgs/img_default_hotel.png').default}`);
        break;

        case 2:
          imgs.unshift(`${require('../imgs/img_default_hotel.png').default}`);
        break;

        default:
          imgs.push(`${require('../imgs/img_default_hotel.png').default}`);
          imgs.push(`${require('../imgs/img_default_hotel.png').default}`);
          imgs.push(`${require('../imgs/img_default_hotel.png').default}`);
        break;
      }
    }

    return imgs;
  }, [Picture]);

  return (
    <Container>
      <Slider dataSource={hotelImg} />
      <Block
        type="secondary"
        theme="hotel"
        className={cx('page_block')}
      >
        <div className={cx('profile_container')}>
          <h2>{Name}</h2>
          <div>
            <div>
              <div className={cx('gap')}>
                <div>
                  <p>
                    {Description && Description !== '無' ? Description : '直接來不就知道了? 趕快打電話訂阿!'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className={cx('gap')}>
                <ProfileBlock dataSource={hotelInfo} />
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