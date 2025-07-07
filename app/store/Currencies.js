Ext.define("LoanFront.store.Currencies", {
  extend: "Ext.data.Store",
  alias: "store.currencies",

  model: "LoanFront.model.Currency",

  autoLoad: true,

  proxy: {
    type: "ajax",
    url: "http://localhost:5021/api/loan/currencies",
    reader: {
      type: "json",
      rootProperty: null, // or 'data' if your API wraps it
    },
  },
});
