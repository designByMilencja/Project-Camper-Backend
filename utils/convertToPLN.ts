export const convertToPLN = async (currencyCode: string, date: string): Promise<number> => {
    try {
        const url = `https://api.nbp.pl/api/exchangerates/rates/A/${currencyCode}/${date}`
        const res = await fetch(url);
        const {rates} = await res.json();
        const exchangeRate = rates[0].mid;
        return exchangeRate.toFixed(2)
    } catch (err) {
        throw new Error(`Unable to fetch exchange rate for ${currencyCode} on ${date}`);
    }
}
