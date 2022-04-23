import {IDateFilter} from "../interfaces/IRuns";
import IUser from "../interfaces/IUser";

const USER_ID_COOKIE = 'user_id';
const DATE_FILTER_COOKIE = 'date_filter';
const DATE_FILTER_COOKIE_SEPERATOR = '+';

export const setDateFilterCookie = (filter: IDateFilter): void => {
    console.log(dateFilterToCookieString(filter))
    document.cookie = DATE_FILTER_COOKIE + "=" + dateFilterToCookieString(filter);
}

export const setUserIdCookie = (user: IUser): void => {
    document.cookie = USER_ID_COOKIE + "=" + user.id;
}

export const getDateFilterFromCookie = (cookies: string[]): IDateFilter => cookieStringToDateFilter(cookies[DATE_FILTER_COOKIE]);
export const getUserIdFromCookie = (cookies: string[]): string => cookies[USER_ID_COOKIE];

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
