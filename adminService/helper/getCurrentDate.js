
module.exports = function getCurrentDate(){
    const currentDate = new Date();
    const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
    timeZone: 'Europe/Istanbul',
    };

    return currentDate.toLocaleString('tr-TR', options);;
}
