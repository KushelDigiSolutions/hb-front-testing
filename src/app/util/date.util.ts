import moment from 'moment';


export const getFormatedDate = (date: Date | string | number, format: string = "YYYY-MM-DD"): string => {
    return moment(date).format(format)
}

export const currentDate = (format: string = "YYYY-MM-DD"): string => {
    return moment(new Date()).format(format)
}

export const time24to12 = (time: string) => {
    // Check correct time format and split into components
    let timeArray: any = time.match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (timeArray.length > 1) { // If time format correct
        timeArray = timeArray.slice(1);  // Remove full string match value
        timeArray[5] = +timeArray[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        (timeArray[0] as any) = +timeArray[0] % 12 || 12; // Adjust hours
    }
    return timeArray.join(''); // return adjusted time or original string
}

export const calculateAge = (date: string): number | null => {
    if (!date) return null;
    var ageDifMs = Date.now() - new Date(date).getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export const getTotalDaysInMonth = (date?: string | Date) => {
    var now = date ? new Date(date) : new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

export const prependZero = (value: number): string => value < 10 ? '0' + value : '' + value;

export const getDaysDifference = (date1: string | Date, date2: string | Date) => {
    var d1 = new Date(date1);
    var d2 = new Date(date2);
    var diffTime = Math.abs(d1.getTime() - d2.getTime());
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // console.log(diffTime + " milliseconds");
    // console.log(diffDays + " days");
    return diffDays;
}

export const dayStartTimestamp = (date: Date, inSeconds: boolean = false): number => {
    let time = date.setHours(0, 0, 0, 0)
    if (inSeconds) {
        time = Math.floor(time / 1000)
    }
    return time
}

export const dateDiff = (date: string, unitOfTime: moment.unitOfTime.Diff) => {
    return moment().diff(date, unitOfTime)
}