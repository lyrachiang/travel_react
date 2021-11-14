import React, { useState, useCallback } from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import classNames from 'classnames/bind';
import moment from 'moment';

import { CaretDownIcon } from '../../components/icons';

import styles from './datepicker.scss';
// import styles from './datepicker.module.scss';

const cx = classNames.bind(styles);

const Datepicker = (props) => {
  const {
    icon,
    placeholder,
    showPlaceholder: showPlaceholderFromProps,
    value,
    className,
    onSelect,
  } = props;

  const customClass = {
    [className]: className,
  };

  const [date, setDate] = useState(value || '');
  const [showPlaceholder, setShowPlaceholder] = useState(showPlaceholderFromProps);

  const atChange = useCallback((date) => {
    setDate(() => date);
    setShowPlaceholder((prev) => {
      if (date && date.length > 0) {
        return false;
      }
      return prev;
    });

    if (onSelect) {
      let startDate = '';
      let endDate   = '';

      if (date && date.length > 0) {
        startDate = moment(date[0]).format('YYYY-MM-DD');
        endDate = moment(date[1]).format('YYYY-MM-DD');
      }

      onSelect(startDate, endDate);
    }
  }, [onSelect]);

  return (
    <div className={cx('datepicker_container', customClass)}>
      {icon && (
        <div className={cx('ico_wrapper')}>
          <i>{icon}</i>
        </div>
      )}
      {placeholder && (
        <div className={cx('placeholder', {active: showPlaceholder})}>
          <span>{placeholder}</span>
        </div>
      )}
      <DateRangePicker
        value={date}
        format="yyyy-MM-dd"
        calendarIcon={<CaretDownIcon />}
        className={cx('datepicker_input')}
        onChange={atChange}
      />
    </div>
  );
};

export default Datepicker;
