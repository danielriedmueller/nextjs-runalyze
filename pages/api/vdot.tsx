// Initialize the cors middleware
import * as dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import {durationToString} from "../../helper/functions";

dayjs.extend(duration);
const FormData = require('form-data');


export const fetchVdot = async (
    distance: number,
    startTime: number,
    endTime: number
): Promise<number> => {
    let formData = new FormData();
    formData.append('distance', distance);
    formData.append('unit', 'm');
    formData.append('time', modifyDuration(endTime - startTime));

    const result = await fetch(process.env.VDOT_API, {
        method: 'POST',
        body: formData
    });

    const vdot = await result.json();

    return vdot.vdot;
}

const modifyDuration = (time: number): string => {
    const duration = durationToString(dayjs.duration(time));

    let splitted = duration.split(':').map((part) => {
        if (part.length === 1) {
            return "0" + part;
        }

        return part;
    });

    if (splitted.length === 3) {
        return splitted.join(":");
    }

    if (splitted.length === 2) {
        splitted.unshift("00");
    }

    if (splitted.length === 1) {
        splitted.unshift("00");
        splitted.unshift("00");
    }

    return splitted.join(":");
}
