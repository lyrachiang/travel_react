import React, { useState, useCallback } from 'react';
import classNames from 'classnames/bind';

import { CaretDownIcon } from '../../components/icons';

import styles from './select.module.scss';

const cx = classNames.bind(styles);

const Select = (props) => {
  const {
    icon,
    name,
    placeholder,
    value,
    options,
    className,
    onSelect,
  } = props;

  const customClass = {
    [className]: className,
  };

  const textFilter = options.filter((option) => option.value === value);
  const defaultText = textFilter.length ? textFilter[0].label : placeholder;
  
  const [selectValue, setSelectValue] = useState(value || "-1");
  const [selectText, setSelectText] = useState(defaultText);
  const [active, setActive] = useState(false);

  const atChange = useCallback((e) => {
    setSelectValue(() => e.target.value);

    if (onSelect) {
      onSelect(e.target.value);
    }
  }, [onSelect]);

  const atClickCustomSelect = useCallback((e) => {
    setActive((prev) => !prev);
  }, []);

  const atClickSelectList = useCallback((label, value) => {
    setSelectValue(() => value);
    setSelectText(() => label);
    setActive(() => false);

    if (onSelect) {
      onSelect(value);
    }
  }, [onSelect]);

  return (
    <div className={cx('select_container', customClass)}>
      {icon && (
        <div className={cx('ico_wrapper')}>
          <i>{icon}</i>
        </div>
      )}
      <select name={name} value={selectValue} onChange={atChange}>
        <option value="-1">{placeholder}</option>
        {options.map((option, idx) => {
          const { label, value } = option;

          return (
            <option key={idx} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      <div
        className={cx('custom_select')}
        onClick={atClickCustomSelect}
      >
        {selectText}
      </div>
      <ul className={cx('custom_select_list', {active: active})}>
        {options.map((option, idx) => {
          const { label, value } = option;

          return (
            <li key={idx} value={value}>
              <button onClick={() => atClickSelectList(label, value)}>
                {label}
              </button>
            </li>
          );
        })}
      </ul>
      <div className={cx('ico_arrow')}>
        <i><CaretDownIcon /></i>
      </div>
    </div>
  );
};

export default Select;
