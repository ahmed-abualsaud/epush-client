import moment from "moment"
import { empty } from "./utils"

export const readableTimestamp = (timestamp) => 
{
  let date = new Date(timestamp)
  return ("0" + date.getDate()).slice(-2) + "/" + ("0" + (date.getMonth() + 1)).slice(-2) + "/" + date.getFullYear() + " - " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2)
}


export const readableTimestamp2 = (timestamp) =>
{
  let date = new Date(timestamp);

  let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let month = months[date.getMonth()];
  
  let day = date.getDate();
  let year = date.getFullYear();
  
  return month + " " + day + ", " + year;
}

export const readableToTimestamp = (readableTimestamp) => 
{
  let [date, time] = readableTimestamp.split("-")
  date = empty(date) ? date : date.trim()
  time = empty(time) ? time : time.trim()
  if (empty(date) && empty(time)) return ""
  if (empty(date) && ! empty(time)) return time
  if (! empty(date) && empty(time)) return date.replaceAll("/", "-").split("-").reverse().join("-")
  return date.replaceAll("/", "-").split("-").reverse().join("-") + " " + time
}

export const isReadabelTimestamp = (str) => 
{
  var formats = [
    "MM/DD/YYYY",
    "MM/YYYY",
    "MM/DD",
    "HH:mm:ss",
    "HH:mm",
    "MM/DD/YYYY - HH:mm:ss"
  ];

  for (var i = 0; i < formats.length; i++) {
    var result = moment(str, formats[i], true);

    if (result.isValid()) {
      return true;
    }
  }

  return false;
}

export const getCurrentTimestamp= () => 
{
  return (new Date()).toISOString().slice(0, 19).replace('T', ' ')
}

export const sinceOneYearTimestamp= () => 
{
  const currentDate = new Date()
  currentDate.setFullYear(currentDate.getFullYear() - 1)
  return currentDate.toISOString().slice(0, 19).replace('T', ' ')
}

export const getDatetimeString = (timestamp = null) => {
  const userDate = timestamp === null ? new Date() : new Date(timestamp)
  const timezoneOffset = userDate.getTimezoneOffset() * 60000
  const localDate = new Date(userDate.getTime() - timezoneOffset)
  return localDate.toISOString().replace("T", " ").slice(0, 19)
}