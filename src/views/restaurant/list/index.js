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
import Button from '../../../components/button';
import Pagination from '../../../components/pagination';
import {
  LocationArrowIcon,
  LongArrowRightIcon,
  MapMarkerAltIcon,
  ClockIcon,
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
  getRestaurantState,
  fetchRestaurantCnt,
  fetchRestaurant,
  setRestaurantTotalRows,
  setRestaurantList,
} from '../../../store/slice/restaurant';
import { setFilter } from '../../../store/slice/filter';

// style
import styles from './list.module.scss';

const cx = classNames.bind(styles);
const pageShow = 12;

const List = () => {
  const dispatch = useDispatch();
  const { setLayout } = useLayout();
  const { activityInfo } = useSelector(getActivityState);
  const { attractionInfo } = useSelector(getAttractionState);
  const { totalRows, restaurantList } = useSelector(getRestaurantState);
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
      dispatch(fetchRestaurantCnt({}))
        .then(() => {
          dispatch(fetchRestaurant({
            fields: 'ID,Name,Description,Address,OpenTime,Picture',
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
            offset: pageShow * (currentPage - 1),
            limit: pageShow,
          }))
        });
    }

    return () => {
      dispatch(setRestaurantTotalRows(0));
      dispatch(setRestaurantList([]));
    }
  }, [dispatch, Position, currentPage]);

  const atRestaurantClick = useCallback((id) => {
    history.push(`/restaurant/${id}`);
  }, [history]);

  return (
    <Container>
      <div className={cx('restaurant_container')}>
        <Block type="primary" theme="restaurant">
          <Box
            type="title"
            icon={<LocationArrowIcon />}
            title="搜尋結果"
            content={totalRows}
            className={cx('restaurant_title_box')}
          />
          <div className={cx('card_container')}>
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