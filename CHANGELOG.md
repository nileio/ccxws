## "0.47.0"

initial fork from https://github.com/altangent/ccxws

## "0.48.0"

### What's Changed

`BasicClient` change

- `candlePeriod` can now be passed in as a property of `Market`. The solution can be considered a workaround to the existing limitation of the library. https://github.com/altangent/ccxws/issues/75 , https://github.com/altangent/ccxws/discussions/263

this change makes it possible to subscribe to multiple timeframes with the same client. The way it is done is by adding a new optional property `candlePeriod` to the `Market` type. When calling `subscribeCandles` with a market which has got the `candlePeriod` set, the candle period specified will be used for the subscription instead of the `candlePeriod` value set on the client. This feature can then be adopted by any BasicClient client implementation. This means that it is NOT needed to set `client.candlerPeriod` if a client is using this feature.

To use this feature, a client must be able to firstly use the property to construct the stream url by using the `market` parameter which is always sent as the second parameter to the subscribeCandles & unsubscribeCandles functions of the client. Secondly, the client must be able to identify the correct candle period from inspecting the exchange `msg`. Identification of the correct candle period for the `msg` varies from an exchange to another, the value might be in `subject`, `topic` or sent along with `msg.data`. It is up to each client to either implement this feature or not when the exchange provide sufficient details to identify the candle period for the message dispatched.

- changed `BinanceClient` to use the new `Market` property `candlePeriod`. A new client option `useMarketCandlePeriod` is added that should be set at client instantiation for whether to use this feature or not in order to enable backward compatability - no checks are done if `candlePeriod` property is set on `Market` and the option was not provided when client is instantiated. so do not use the property on the `Market` object unless you set the option to `true`
  ```
  const binance=new BinanceClient({useMarketCandlePeriod:true})
  ```
  after that you can set the property as follows

```
// handle candle events
binance.on("candle", (candle,market) => console.log(market.candlePeriod, candle));

let market = {
  id: "BTCUSDT", // remote_id used by the exchange
  base: "BTC", // standardized base symbol for Bitcoin
  quote: "USDT", // standardized quote symbol for Tether
  candlePriod: CandlePeriod._1m
};
// subscribe to 1m candles
binance.subscribeCandles(market);
#later subscribe to 30m candles with same client
market = {
  id: "BTCUSDT", // remote_id used by the exchange
  base: "BTC", // standardized base symbol for Bitcoin
  quote: "USDT", // standardized quote symbol for Tether
  candlePriod: CandlePeriod._30m
};
binance.subscribeCandles(market);
#later subscribe to as many as allowed by the exchange! without the need to create a new client for every period
```

### Limitations

This property should ONLY be set in the market object used to for `subscribeCandles`. If you using multiple types of subscriptions, that is, `subscribeTrades`,etc. you need to delete this property before subscribing!!This is because the existence of the property will modify the Map identifer used to map the market to a market id and will possibly not work (untested) with other subscriptions. No time for me to test it across all other types of APIs.

## "0.49.0"

### Add optinal properties to Candle

- the following props added to Candle class

```
count?: number, -- the number of trades of this candle
closed?: boolean, -- whether the candle is closed or not
period?: string -- the candle period
```

- changed `BinanceBase` to make use of the new candle props

## "0.50.0" FIX

fix `unsubscribe` by adding the new property `candlePeriod` to \_unsubscribe in BasicClient
