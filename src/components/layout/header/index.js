// package
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import classNames from 'classnames/bind';

// components
import Container from '../../../components/container';
import Button from '../../../components/button';
import { ArrowLeftIcon } from '../../../components/icons';

// slice
import { getFilter } from '../../../store/slice/filter';

// style
import styles from './header.module.scss';

const cx = classNames.bind(styles);

const Header = (props) => {
  const { isShowBtn } = props;

  const { back, filter } = useSelector(getFilter);
  let history = useHistory();

  return (
    <header className={cx('header_container')}>
      <Container>
        {isShowBtn && (
          <Button
            type="secondary"
            size="small"
            icon={<ArrowLeftIcon />}
            shape="circle"
            onClick={() => {
              if (back && filter) {
                history.push(`/${back}?${filter}`);
              }
              else {
                history.goBack();
              }
            }}
          >
            想看其他結果
          </Button>
        )}
      </Container>
    </header>
  );
};

export default Header;