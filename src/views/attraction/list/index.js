// package
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames/bind';

// components
import Container from '../../../components/container';
import Select from '../../../components/select';
import Block from '../../../components/block';
import Box from '../../../components/box';
import Card from '../../../components/card';
import Tag from '../../../components/tag';
import Button from '../../../components/button';
import Pagination from '../../../components/pagination';
import {
  MapMarkerAltIcon,
  LocationArrowIcon,
  LocationIcon,
} from '../../../components/icons';

//slice
import {
  getAttractionState,
  fetchAttractionCnt,
  fetchAttraction,
  fetchAttractionByCityCnt,
  fetchAttractionByCity,
  setAttractionList,
} from '../../../store/slice/attraction';
import { setFilter } from '../../../store/slice/filter';
import cityOption from '../../../data/city.json';

// style
import styles from './list.module.scss';

const cx = classNames.bind(styles);
const pageShow = 10;

const List = () => {
  const dispatch = useDispatch();
  const { totalRows, attractionList } = useSelector(getAttractionState);
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

  const [city, setCity] = useState(filter.city || '');
  const [currentPage, setCurrentPage] = useState((filter.page / 1) || 1);

  useEffect(() => {
    if (city) {
      dispatch(fetchAttractionByCityCnt({
        city: city,
      }))
        .then(() => {
          dispatch(fetchAttractionByCity({
            city: city,
            fields: 'ID,Name,DescriptionDetail,Description,Picture,Class1,Class2,Class3,Level',
            sort: 'UpdateTime desc',
            offset: pageShow * (currentPage - 1),
            limit: pageShow,
          }));
        });
    }
    else {
      dispatch(fetchAttractionCnt({}))
        .then(() => {
          dispatch(fetchAttraction({
            fields: 'ID,Name,DescriptionDetail,Description,Picture,Class1,Class2,Class3,Level',
            sort: 'UpdateTime desc',
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
    
    if (currentPage !== 1) {
      filter.push(`page=${currentPage}`);
    }

    if (filter.length > 0) {
      dispatch(setFilter({
        back: 'attraction',
        filter: filter.join('&'),
      }));
    }

    return () => {
      dispatch(setAttractionList([]));
    }
  }, [dispatch, city, currentPage]);

  const atSelectCity = useCallback((city) => {
    setCity(() => city);
    setCurrentPage(() => 1);

    history.push('/attraction');
  }, [history]);

  const atAttractionClick = useCallback((id) => {
    history.push(`/attraction/${id}`);
  }, [history]);

  return (
    <Container>
      <div className={cx('title_container')}>
        <h2>想參觀哪個景點呢？</h2>
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
        </div>
      </div>
      <div className={cx('attraction_container')}>
        <Block type="primary">
          <Box
            type="title"
            icon={<LocationArrowIcon />}
            title="搜尋結果"
            content={totalRows}
            className={cx('attraction_title_box')}
          />
          <div className={cx('card_container')}>
            {attractionList.map((attraction) => {
              const { ID, Name, DescriptionDetail, Description, Picture, Class1, Class2, Class3, Level } = attraction;
              const { PictureUrl1 } = Picture;

              return (
                <React.Fragment key={ID}>
                  <Card
                    direction="row"
                    img={PictureUrl1 ? PictureUrl1 : require('../imgs/img_default_attraction_1.png').default}
                    className={cx('card_box')}
                  >
                    <div>
                      <h3>{Name}</h3>
                      <p className={cx('desc')}>
                        {Description && Description !== '無' ? (
                          Description 
                        ) : (
                          DescriptionDetail && DescriptionDetail !== '無' ? (
                            DescriptionDetail
                          ) : (
                            '與其讓我說，你Google比較快~'
                          )
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
                        {Class3 && (
                          <div>
                            <div className={cx('gap')}>
                               <Tag type="class">{Class3}</Tag>
                            </div>
                          </div>
                        )}
                        {Level && (
                          <div>
                            <div className={cx('gap')}>
                               <Tag type="level">{Level}</Tag>
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <Button
                          type="primary"
                          icon={<LocationIcon />}
                          shape="circle"
                          onClick={() => atAttractionClick(ID)}
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