export const avgDayInWeekData = (runs) => {
    const days = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
    }
    runs.map((run) => days[run.date.day()]++);

    return [
        { title: 'Montag', value: days[1], color: '#f94144' },
        { title: 'Dienstag', value: days[2], color: '#f3722c' },
        { title: 'Mittwoch', value: days[3], color: '#f8961e' },
        { title: 'Donnerstag', value: days[4], color: '#f9c74f' },
        { title: 'Freitag', value: days[5], color: '#90be6d' },
        { title: 'Samstag', value: days[6], color: '#43aa8b' },
        { title: 'Sonntag', value: days[0], color: '#577590' },
    ]
}

export const avgHourData = (runs) => {
    const hours = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
        12: 0,
        13: 0,
        14: 0,
        15: 0,
        16: 0,
        17: 0,
        18: 0,
        19: 0,
        20: 0,
        21: 0,
        22: 0,
        23: 0,
    }

    runs.map((run) => hours[run.date.hour()]++);

    return [
        { title: '00:00', value: hours[0], color: '#f94144' },
        { title: '01:00', value: hours[1], color: '#f3722c' },
        { title: '02:00', value: hours[2], color: '#f8961e' },
        { title: '03:00', value: hours[3], color: '#f9c74f' },
        { title: '04:00', value: hours[4], color: '#90be6d' },
        { title: '05:00', value: hours[5], color: '#43aa8b' },
        { title: '06:00', value: hours[6], color: '#577590' },
        { title: '07:00', value: hours[7], color: '#f94144' },
        { title: '08:00', value: hours[8], color: '#f3722c' },
        { title: '09:00', value: hours[9], color: '#f8961e' },
        { title: '10:00', value: hours[10], color: '#f9c74f' },
        { title: '11:00', value: hours[11], color: '#90be6d' },
        { title: '12:00', value: hours[12], color: '#43aa8b' },
        { title: '13:00', value: hours[13], color: '#577590' },
        { title: '14:00', value: hours[14], color: '#f94144' },
        { title: '15:00', value: hours[15], color: '#f3722c' },
        { title: '16:00', value: hours[16], color: '#f8961e' },
        { title: '17:00', value: hours[17], color: '#f9c74f' },
        { title: '18:00', value: hours[18], color: '#90be6d' },
        { title: '19:00', value: hours[19], color: '#43aa8b' },
        { title: '20:00', value: hours[20], color: '#577590' },
        { title: '21:00', value: hours[21], color: '#f94144' },
        { title: '22:00', value: hours[22], color: '#f3722c' },
        { title: '23:00', value: hours[23], color: '#f8961e' },
    ]
}