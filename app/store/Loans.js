Ext.define("LoanFront.store.Loans", {
  extend: "Ext.data.Store",
  storeId: "loans",
  alias: "store.loans",
  model: "LoanFront.model.Loan",
  autoLoad: true,

  proxy: {
    type: "ajax",
    url: "http://localhost:5021/api/loan/all",
    reader: {
      type: "json",
      rootProperty: "", // if the API returns a plain array
    },
  },
});
