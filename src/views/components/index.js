import React, { useState, useCallback } from 'react';
// import classNames from 'classnames/bind';

import Container from '../../components/container';
import Select from '../../components/select';
import Button from '../../components/button';
import Tag from '../../components/tag';
import Pagination from '../../components/pagination';
import {
  MapMarkerAltIcon,
  LocationIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '../../components/icons';

import cityOption from '../../data/city.json';

// import styles from './components.module.scss';

// const cx = classNames.bind(styles);

const Components = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const atSelectCity = useCallback((val) => {
    console.log(val);
  }, []);

  return (
    <Container>
      <div>Components</div>
      <Select
        icon={<MapMarkerAltIcon />}
        name="city"
        placeholder="目的地"
        options={cityOption}
        onSelect={atSelectCity}
      />
      <br />
      <Button type="primary" size="large" icon={<LocationIcon />} shape="circle">我想去</Button>
      <Button type="primary" icon={<LocationIcon />} shape="circle">我想去</Button>
      <Button type="primary" size="small" icon={<LocationIcon />} shape="circle">我想去</Button>
      <Button type="secondary" size="small" icon={<ArrowLeftIcon />} shape="circle">想看其他結果</Button>
      <Button type="secondary" size="small" icon={<ArrowRightIcon />} shape="circle" iconRight>想看其他結果</Button>
      <div>
        <Tag type="class">遊憩類</Tag>
        <Tag type="level">非古蹟</Tag>
      </div>
      <Pagination
        total={25}
        perPageShow={10}
        current={currentPage}
        onChange={(page, perPageShow) => {
          setCurrentPage(() => page);
        }}
      />
    </Container>
  );
};

export default Components;