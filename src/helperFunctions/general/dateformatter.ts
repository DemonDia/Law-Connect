export function formatDate(date: any) {
    const d: Date = new Date(date.seconds*1000)
    var month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear()

    if (month.length < 2) month = "0" + month
    if (day.length < 2) day = "0" + day
    return [day, month, year].join("-")
}
