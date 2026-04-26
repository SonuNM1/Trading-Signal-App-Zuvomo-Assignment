import axios from "axios"

const BINANCE_BASE_URL = process.env.BINANCE_BASE_URL;

// fetching live price of a trading pair from Binance 

const getLivePrice = async (symbol) => {
    try{
        const response = await axios.get(`${BINANCE_BASE_URL}/ticker/price`, {
            params: { symbol: symbol.toUpperCase()}, 
            timeout: 5000
        })

        const price = parseFloat(response.data.price) ; 

        if(isNaN(price)) {
            throw new Error(`Invalid price received for symbol: ${symbol}`) ; 
        }

        return price ; 
    }catch(error){
        if(error.response?.status === 400) {
            throw new Error(`Invalid symbol: ${symbol} doesn't exist on Binance`)
        }

        // if req timed out 

        if(error.code === 'ECONNABORTED') {
             throw new Error(`Binance API timed out for symbol: ${symbol}`);
        }

        throw new Error(`Failed to fetch price for ${symbol}: ${error.message}`);
    }
}

// fetch live price for multiple symbols at once - used by cron job to check all open signals in one go 

const getLivePrices = async (symbols) => {
    const uniqueSymbols = [...new Set(symbols)] ; 

    const results = await Promise.allSettled(
        uniqueSymbols.map((symbol) => getLivePrice(symbol))
    ) ; 

    const priceMap = {}

    results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      priceMap[uniqueSymbols[index]] = result.value;
    } else {
      console.warn(`Could not fetch price for ${uniqueSymbols[index]}: ${result.reason.message}`);
    }
  });

  return priceMap ; 
}

export {
    getLivePrice, 
    getLivePrices 
}

// We have two functions. getLivePrice fetches a single symbol. getLivePrices is the smart one — it takes an array of symbols, removes duplicates, then fetches them all in parallel using Promise.allSettled. The difference between Promise.all and Promise.allSettled is important — Promise.all fails everything if one fails, but Promise.allSettled lets the successful ones complete even if one symbol fails.