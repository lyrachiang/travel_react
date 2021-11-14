// package
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import classNames from 'classnames/bind';
import moment from 'moment';

// providers
import { useLayout } from '../../../providers/layout_provider';

// components
import Container from '../../../components/container';
import Slider from '../../../components/slider';
import Block from '../../../components/block';
import Box from '../../../components/box';
import Card from '../../../components/card';
import Tag from '../../../components/tag';
import Button from '../../../components/button';
import useWindowSize from '../../../components/window_size';
import {
  ClockIcon,
  MapMarkerAltIcon,
  BuildingIcon,
  GlobeAsiaIcon,
  LocationArrowIcon,
  ArrowRightIcon,
  LongArrowRightIcon,
  CarIcon,
} from '../../../components/icons';

//slice
import {
  getActivityState,
  fetchActivityById,
  setActivityInfo,
} from '../../../store/slice/activity';
import {
  getHotelState,
  fetchHotelCnt,
  fetchHotel,
  setHotelTotalRows,
  setHotelList,
} from '../../../store/slice/hotel';
import {
  getRestaurantState,
  fetchRestaurantCnt,
  fetchRestaurant,
  setRestaurantTotalRows,
  setRestaurantList,
} from '../../../store/slice/restaurant';

// style
import styles from './page.module.scss';

const cx = classNames.bind(styles);

const ProfileBlock = (props) => {
  const { dataSource } = props;
  const {
    Location,
    Address,
    Organizer,
    StartTime,
    EndTime,
    WebsiteUrl,
    Class1,
    Class2,
  } = dataSource;

  return (
    <div className={cx('profile_block')}>
      <Box
        type="info"
        icon={<ClockIcon />}
        title="活動時間："
        content={StartTime && EndTime ? (
          `${moment(StartTime).format('YYYY/MM/DD')} ~ ${moment(EndTime).format('YYYY/MM/DD')}`
        ) : '還在規劃耶，不如你也來幫忙?'}
      />
      <Box
        type="info"
        icon={<MapMarkerAltIcon />}
        title="景點地址："
        content={Location || Address ? (
          Location !== Address ? `${Location || ''} ${Address || ''}` : Address
        ) : '只有天選之人才看得到'}
      />
      <Box
        type="info"
        icon={<BuildingIcon />}
        title="主辦單位："
        content={Organizer || '只有天選之人才看得到'}
      />
      <Box
        type="info"
        icon={<GlobeAsiaIcon />}
        title="相關連結："
        content={WebsiteUrl ? (
          <a href={WebsiteUrl} target="_blank" rel="noreferrer">{WebsiteUrl}</a>
        ) : '沒錢做網頁啦！求贊助～～'}
      />
      {(Class1 || Class2 ) && (
        <div className={cx('tag_container')}>
          {Class1 && (
            <div>
              <div className={cx('gap')}>
                <Tag type="class">{Class1}</Tag>
              </div>
            </div>
          )}
          {Class2 && (
            <div>
              <div className={cx('gap')}>
                <Tag type="class">{Class2}</Tag>
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
  const { activityInfo } = useSelector(getActivityState);
  const { totalRows: hotelTotalRows, hotelList } = useSelector(getHotelState);
  const { totalRows: restaurantTotalRows, restaurantList } = useSelector(getRestaurantState);
  let { params: { id } } = useRouteMatch();
  let history = useHistory();

  const { Name, Description, Picture, Position } = activityInfo;
  const [window] = useWindowSize();
  const [pageShow, setPageShow] = useState(3);

  useEffect(() => {
    setLayout({ showHeaderBtn: true });

    return () => {
      setLayout({ showHeaderBtn: false });
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setPageShow(() => {
      return window <= 768 ? 2 : 3;
    });
  }, [window]);

  useEffect(() => {
    if (id) {
      dispatch(fetchActivityById({
        id: id,
        fields: 'ID,Name,Description,Location,Address,Organizer,StartTime,EndTime,WebsiteUrl,Picture,Position,Class1,Class2',
      }));
    }

    return () => {
      dispatch(setActivityInfo({}));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (Position) {
      // Hotel
      dispatch(fetchHotelCnt({
        position: {
          lat: Position.PositionLat,
          lon: Position.PositionLon,
        }
      }))
        .then(() => {
          dispatch(fetchHotel({
            position: {
              lat: Position.PositionLat,
              lon: Position.PositionLon,
            },
            fields: 'ID,Name,Description,Grade,Picture,Class,Spec,ServiceInfo,ParkingInfo',
            sort: 'UpdateTime desc',
            offset: 0,
            limit: 3,
          }))
        });
      
      // Restaurant
      dispatch(fetchRestaurantCnt({
        position: {
          lat: Position.PositionLat,
          lon: Position.PositionLon,
        }
      }))
        .then(() => {
          dispatch(fetchRestaurant({
            position: {
              lat: Position.PositionLat,
              lon: Position.PositionLon,
            },
            fields: 'ID,Name,Description,Address,OpenTime,Picture',
            sort: 'UpdateTime desc',
            offset: 0,
            limit: 3,
          }))
        });
    }

    return () => {
      dispatch(setHotelTotalRows(0));
      dispatch(setHotelList([]));
      dispatch(setRestaurantTotalRows(0));
      dispatch(setRestaurantList([]));
    }
  }, [dispatch, Position]);

  const activityImg = useMemo(() => {
    let imgs = [];

    for(let i = 1; i <= 3; i++) {
      if (Picture && Picture[`PictureUrl${i}`]) {
        imgs.push(Picture[`PictureUrl${i}`]);
      }
    }

    if (imgs.length < 3) {
      switch(imgs.length) {
        case 1:
          imgs.unshift(`${require('../imgs/img_default_activity_2.png').default}`);
          imgs.push(`${require('../imgs/img_default_activity_2.png').default}`);
        break;

        case 2:
          imgs.unshift(`${require('../imgs/img_default_activity_2.png').default}`);
        break;

        default:
          imgs.push(`${require('../imgs/img_default_activity_2.png').default}`);
          imgs.push(`${require('../imgs/img_default_activity_2.png').default}`);
          imgs.push(`${require('../imgs/img_default_activity_2.png').default}`);
        break;
      }
    }

    return imgs;
  }, [Picture]);

  const atHotelClick = useCallback((id) => {
    history.push(`/hotel/${id}`);
  }, [history]);

  const atHotelResultClick = useCallback((id) => {
    history.push(`/hotel/activity/${id}`);
  }, [history]);

  const atRestaurantClick = useCallback((id) => {
    history.push(`/restaurant/${id}`);
  }, [history]);

  const atRestaurantResultClick = useCallback((id) => {
    history.push(`/restaurant/activity/${id}`);
  }, [history]);

  return (
    <Container>
      <Slider dataSource={activityImg} />
      <Block
        type="secondary"
        className={cx('page_block')}
      >
        <div className={cx('profile_container')}>
          <h2>{Name}</h2>
          <div>
            <div>
              <div className={cx('gap')}>
                <div>
                  <p>{Description && Description !== '無' ? Description : '還在規劃耶，不如你也來幫忙?'}</p>
                </div>
              </div>
            </div>
            <div>
              <div className={cx('gap')}>
                <ProfileBlock dataSource={activityInfo} />
              </div>
            </div>
          </div>
        </div>
        <div className={cx('hotel_container')}>
          <div className={cx('hotel_title_box')}>
            <Box
              type="title"
              icon={<LocationArrowIcon />}
              title="我可以住哪裡？"
              content={hotelTotalRows}
            />
            {hotelTotalRows > pageShow && (
              <Button
                type="secondary"
                size="small"
                icon={<ArrowRightIcon />}
                shape="circle"
                iconRight
                onClick={() => atHotelResultClick(id)}
              >
                想看其他結果
              </Button>
            )}
          </div>
          <div className={cx('hotel_card_container')}>
            {hotelList.map((hotel) => {
              const { ID, Name, Description, Grade, Picture, Class, Spec, ServiceInfo, ParkingInfo } = hotel;
              const { PictureUrl1 } = Picture;

              return (
                <div key={ID}>
                  <div className={cx('gap')}>
                    <Card
                      direction="column"
                      img={PictureUrl1 ? PictureUrl1 : require('../imgs/img_default_hotel.png').default}
                      className={cx('hotel_card_box')}
                    >
                      <div className={cx('hotel_info_box')}>
                        <h3>{Name}</h3>
                        <p className={cx('desc')}>
                          {Description && Description !== '無' ? Description : '直接來不就知道了? 趕快打電話訂阿!'}
                        </p>
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
                      <div className={cx('btn_container')}>
                        <Button
                          type="primary"
                          icon={<LongArrowRightIcon />}
                          shape="round"
                          block
                          iconRight
                          onClick={() => atHotelClick(ID)}
                        >
                          我想入住
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={cx('restaurant_container')}>
          <div className={cx('restaurant_title_box')}>
            <Box
              type="title"
              icon={<LocationArrowIcon />}
              title="我可以吃什麼？"
              content={restaurantTotalRows}
            />
            {restaurantTotalRows > pageShow && (
              <Button
                type="secondary"
                size="small"
                icon={<ArrowRightIcon />}
                shape="circle"
                iconRight
                onClick={() => atRestaurantResultClick(id)}
              >
                想看其他結果
              </Button>
            )}
          </div>
          <div className={cx('restaurant_card_container')}>
            {restaurantList.map((restaurant) => {
              const { ID, Name, Description, Address, OpenTime, Picture } = restaurant;
              const { PictureUrl1 } = Picture;

              return (
                <div key={ID}>
                  <div className={cx('gap')}>
                    <Card
                      direction="column"
                      img={PictureUrl1 ? PictureUrl1 : require('../imgs/img_default_restaurant.png').default}
                      className={cx('restaurant_card_box')}
                    >
                      <div className={cx('restaurant_info_box')}>
                        <h3>{Name}</h3>
                        <p className={cx('desc')}>
                          {Description && Description !== '無' ? Description : '直接來不就知道了? 先訂位再說阿!'}
                        </p>
                        <div className={cx('restaurant_extra_info_box')}>
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
                      </div>
                      <div className={cx('btn_container')}>
                        <Button
                          type="primary"
                          icon={<LongArrowRightIcon />}
                          shape="round"
                          block
                          iconRight
                          onClick={() => atRestaurantClick(ID)}
                        >
                          這個好吃嗎
                        </Button>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Block>
    </Container>
  );
};

export default Page;