// package
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouteMatch, useHistory } from 'react-router-dom';
import classNames from 'classnames/bind';

// providers
import { useLayout } from '../../../providers/layout_provider';

// components
import Container from '../../../components/container';
import Block from '../../../components/block';
import Box from '../../../components/box';
import Card from '../../../components/card';
import Tag from '../../../components/tag';
import Button from '../../../components/button';
import Pagination from '../../../components/pagination';
import {
  LocationArrowIcon,
  LongArrowRightIcon,
  CarIcon,
} from '../../../components/icons';

//slice
import {
  getAttractionState,
  fetchAttractionById,
  setAttractionInfo,
} from '../../../store/slice/attraction';
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
import { setFilter } from '../../../store/slice/filter';

// style
import styles from './list.module.scss';

const cx = classNames.bind(styles);
const pageShow = 12;

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

const List = () => {
  const dispatch = useDispatch();
  const { setLayout } = useLayout();
  const { activityInfo } = useSelector(getActivityState);
  const { attractionInfo } = useSelector(getAttractionState);
  const { totalRows, hotelList } = useSelector(getHotelState);
  let { params: { id: paramId }, path } = useRouteMatch();
  let history = useHistory();

  const urlPath = path.split('/');
  const travelType = urlPath[2];
  
  const { Position } = travelType === 'activity' ? activityInfo : (
    travelType === 'attraction' ? attractionInfo : {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  
  useEffect(() => {
    setLayout({ showHeaderBtn: true });
    dispatch(setFilter({back: '', filter: ''}));

    return () => {
      setLayout({ showHeaderBtn: false });
    }
    // eslint-disable-next-line
  }, []);
  
  useEffect(() => {
    if (paramId) {
      if (travelType === 'attraction') {
        dispatch(fetchAttractionById({
          id: paramId,
          fields: 'ID,Name,Position',
        }));
      }
      else if (travelType === 'activity') {
        dispatch(fetchActivityById({
          id: paramId,
          fields: 'ID,Name,Position',
        }));
      }
    }
    else {
      dispatch(fetchHotelCnt({}))
        .then(() => {
          dispatch(fetchHotel({
            fields: 'ID,Name,Description,Grade,Picture,Class,Spec,ServiceInfo,ParkingInfo',
            sort: 'UpdateTime desc',
            offset: pageShow * (currentPage - 1),
            limit: pageShow,
          }))
        });
    }

    return () => {
      dispatch(setAttractionInfo({}));
      dispatch(setActivityInfo({}));
    }
  }, [dispatch, paramId, travelType, currentPage]);

  useEffect(() => {
    if (Position) {
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
            offset: pageShow * (currentPage - 1),
            limit: pageShow,
          }))
        });
    }

    return () => {
      dispatch(setHotelTotalRows(0));
      dispatch(setHotelList([]));
    }
  }, [dispatch, Position, currentPage]);

  const atHotelClick = useCallback((id) => {
    history.push(`/hotel/${id}`);
  }, [history]);

  return (
    <Container>
      <div className={cx('hotel_container')}>
        <Block type="primary" theme="hotel">
          <Box
            type="title"
            icon={<LocationArrowIcon />}
            title="搜尋結果"
            content={totalRows}
            className={cx('hotel_title_box')}
          />
          <div className={cx('card_container')}>
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
                          <ExtraInfoBlock service={ServiceInfo} parking={ParkingInfo} />
                        )}
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
          {totalRows > 0 && (
            <Pagination
              total={totalRows}
              perPageShow={pageShow}
              current={currentPage}
              onChange={(page, perPageShow) => {
                setCurrentPage(() => page);
              }}
            />
          )}
        </Block>
      </div>
    </Container>
  );
};

export default List;