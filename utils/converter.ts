export const currencyConverterToPLN = async (currencyCode: string, date: string): Promise<number> => {

    try {
        const url = `https://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/${date}`
        const res = await fetch(url)
        const {rates} = await res.json();
        const exchangeRate = rates[0].mid
        return exchangeRate.toFixed(2)
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
