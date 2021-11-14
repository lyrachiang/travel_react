// package
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';
import moment from 'moment';

// components
import Container from '../../../components/container';
import Select from '../../../components/select';
import Datepicker from '../../../components/datepicker';
import Block from '../../../components/block';
import Box from '../../../components/box';
import Card from '../../../components/card';
import Tag from '../../../components/tag';
import Button from '../../../components/button';
import Pagination from '../../../components/pagination';
import {
  MapMarkerAltIcon,
  CalendarIcon,
  LocationArrowIcon,
  LocationIcon,
} from '../../../components/icons';

//slice
import {
  getActivityState,
  fetchActivityCnt,
  fetchActivity,
  fetchActivityByCityCnt,
  fetchActivityByCity,
} from '../../../store/slice/activity';
import { setFilter } from '../../../store/slice/filter';
import cityOption from '../../../data/city.json';

// style
import styles from './list.module.scss';

const cx = classNames.bind(styles);
const pageShow = 10;

const List = () => {
  const dispatch = useDispatch();
  const { totalRows, activityList } = useSelector(getActivityState);
  let history = useHistory();
  let location = useLocation();

  const searchFilter = useCallback((search) => {
    const param = search.replace('?', '').split('&');
    let req = {};
  
    param.forEach((data) => {
      const items = data.split('=');
      req[items[0]] = items[1];
    });
  
    return req;
  }, []);

  const filter = searchFilter(location.search);

  const [city, setCity] = useState(filter.city ||'');
  const [startDate, setStartDate] = useState(filter.s_date ||'');
  const [endDate, setEndDate] = useState(filter.e_date ||'');
  const [currentPage, setCurrentPage] = useState((filter.page / 1) || 1);
  const [showPlaceholder, setShowPlaceholder] = useState(startDate && endDate ? false : true);

  useEffect(() => {
    if (city) {
      dispatch(fetchActivityByCityCnt({
        city: city,
        s_date: startDate,
        e_date: endDate,
      }))
        .then(() => {
          dispatch(fetchActivityByCity({
            city: city,
            s_date: startDate,
            e_date: endDate,
            fields: 'ID,Name,Description,Picture,StartTime,EndTime,Class1,Class2',
            sort: 'EndTime desc',
            offset: pageShow * (currentPage - 1),
            limit: pageShow,
          }));
        });
    }
    else {
      dispatch(fetchActivityCnt({
        s_date: startDate,
        e_date: endDate,
      }))
        .then(() => {
          dispatch(fetchActivity({
            s_date: startDate,
            e_date: endDate,
            fields: 'ID,Name,Description,Picture,StartTime,EndTime,Class1,Class2',
            sort: 'EndTime desc',
            offset: pageShow * (currentPage - 1),
            limit: pageShow,
          }));
        });
    }

    // filter
    let filter = [];
    if (city) {
      filter.push(`city=${city}`);
    }

    if (startDate && endDate) {
      filter.push(`s_date=${startDate}`);
      filter.push(`e_date=${endDate}`);

      setShowPlaceholder(() => false);
    }
    
    if (currentPage !== 1) {
      filter.push(`page=${currentPage}`);
    }

    if (filter.length > 0) {
      dispatch(setFilter({
        back: 'activity',
        filter: filter.join('&'),
      }));
    }
  }, [dispatch, city, startDate, endDate, currentPage]);

  const atSelectCity = useCallback((city) => {
    setCity(() => city);
    setCurrentPage(() => 1);

    history.push('/activity');
  }, [history]);

  const atSelectActDate = useCallback((startDate, endDate) => {
    setStartDate(() => startDate);
    setEndDate(() => endDate);
    setCurrentPage(() => 1);
  }, []);

  const atActivityClick = useCallback((id) => {
    history.push(`/activity/${id}`);
  }, [history]);

  return (
    <Container>
      <div className={cx('title_container')}>
        <h2>想去哪參加活動呢？</h2>
        <div className={cx('filter_block')}>
          <div>
            <Select
              icon={<MapMarkerAltIcon />}
              name="city"
              placeholder="目的地"
              value={city}
              options={cityOption}
              onSelect={atSelectCity}
            />
          </div>
          <div>
            <Datepicker
              icon={<CalendarIcon />}
              placeholder="活動時間"
              showPlaceholder={showPlaceholder}
              value={startDate && endDate ? [new Date(startDate), new Date(endDate)] : ''}
              onSelect={atSelectActDate}
            />
          </div>
        </div>
      </div>
      <div className={cx('activity_container')}>
        <Block type="primary">
          <Box
            type="title"
            icon={<LocationArrowIcon />}
            title="搜尋結果"
            content={totalRows}
            className={cx('activity_title_box')}
          />
          <div className={cx('card_container')}>
            {activityList.map((activity) => {
              const { ID, Name, Description, Picture, StartTime, EndTime, Class1, Class2 } = activity;
              const { PictureUrl1 } = Picture;

              return (
                <React.Fragment key={ID}>
                  <Card
                    direction="row"
                    img={PictureUrl1 ? PictureUrl1 : require('../imgs/img_default_activity_1.png').default}
                    className={cx('card_box')}
                  >
                    <div>
                      <h3>{Name}</h3>
                      <p className={cx('desc')}>
                        {Description && Description !== '無' ? Description : '還在規劃耶，不如你也來幫忙?'}
                      </p>
                      <p className={cx('date')}>
                        活動時間：
                        {StartTime && EndTime ? (
                          `${moment(StartTime).format('YYYY/MM/DD')} ~ ${moment(EndTime).format('YYYY/MM/DD')}`
                        ) : (
                          '還在規劃耶，不如你也來幫忙?'
                        )}
                      </p>
                    </div>
                    <div className={cx('btn_container')}>
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
                      <div>
                        <Button
                          type="primary"
                          icon={<LocationIcon />}
                          shape="circle"
                          onClick={() => atActivityClick(ID)}
                        >
                          我想去
                        </Button>
                      </div>
                    </div>
                  </Card>
                </React.Fragment>
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