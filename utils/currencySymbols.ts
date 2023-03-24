export const currencySymbols = async (): Promise<string[]> => {

    try {
        const url = `https://api.nbp.pl/api/exchangerates/tables/A/?format=json`
        const res = await fetch(url)
        const obj = await res.json();
        const array =obj[0].rates;
        const arrayCode = array.map((a: any)=> a.code)
        return arrayCode
    } catch (err) {
        console.error(err)
    }
}
// {
//     "table":"A",
//     "currency":"funt szterling",
//     "code":"GBP",
//     "rates":
//     [{"no": "1/A/NBP/2012", "effectiveDate": "2012-01-02", "mid": 5.3480}]
// }
