export function dateFormater(value){
    let date = new Date(value);
    let year = date.getFullYear();
    let month = date.getMonth()+1<10?`0${date.getMonth()+1}`:date.getMonth()+1;
    let day = date.getDay() < 10 ? `0${date.getDay()}`:date.getDay();
    return `${year}-${month}-${day}`
}