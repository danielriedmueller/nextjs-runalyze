import IUser from "../interfaces/IUser";
import IDateFilter from "../interfaces/IDateFilter";
import {ArithmeticModes} from "../pages";

const USER_ID_COOKIE = 'user_id';
const DATE_FILTER_COOKIE = 'date_filter';
const DATE_FILTER_COOKIE_SEPERATOR = '+';
const ARITHMETIC_MODE_COOKIE = 'mode';

export const setDateFilterCookie = (filter: IDateFilter): void => {
    document.cookie = DATE_FILTER_COOKIE + "=" + dateFilterToCookieString(filter) + ";SameSite=Strict";
}

export const setUserIdCookie = (user: IUser): void => {
    document.cookie = USER_ID_COOKIE + "=" + user.id + ";SameSite=Strict";
}

export const setArithmeticModeCookie = (mode: Number): void => {
    document.cookie = ARITHMETIC_MODE_COOKIE + "=" + mode + ";SameSite=Strict";
}

export const getDateFilterFromCookie = (cookies: string[]): IDateFilter => cookieStringToDateFilter(cookies[DATE_FILTER_COOKIE]);
export const getUserIdFromCookie = (cookies: string[]): string => cookies[USER_ID_COOKIE];
export const getArithmeticModeFromCookie = (cookies: string[]): number => parseInt(cookies[ARITHMETIC_MODE_COOKIE]);

/**
 * year;month;week
 * e.g.
 * 2022;12;44 or 2022;12 or 2022
 */
const dateFilterToCookieString = (filter: IDateFilter): string => {
    if (!filter) return '';

    const {year, month, week} = filter;
    let filterArr = [];

    if (year) {
        filterArr.push(year);
    }

    if (month) {
        filterArr.push(month);
    }

    if (week) {
        filterArr.push(week);
    }

    return filterArr.join(DATE_FILTER_COOKIE_SEPERATOR);
}

const cookieStringToDateFilter = (filterString: string): IDateFilter => {
    let dateFilter = {
        year: null,
        month: null,
        week: null
    };

    if (!filterString) {
        return dateFilter;
    }

    filterString.split(DATE_FILTER_COOKIE_SEPERATOR).forEach((value, index) => {
        if (index === 0) {
            dateFilter.year = parseInt(value);
        }

        if (index === 1) {
            dateFilter.month = parseInt(value);
        }

        if (index === 2) {
            dateFilter.week = parseInt(value);
        }
    })

    return dateFilter;
}
