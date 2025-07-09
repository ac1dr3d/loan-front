Ext.define("LoanFront.store.PendingLoansStore", {
  extend: "Ext.data.Store",
  storeId: "pending_loans",
  alias: "store.pending_loans",
  model: "LoanFront.model.Loan",
  autoLoad: false,

  proxy: {
    type: "ajax",
    url: "",
    reader: {
      type: "json",
      rootProperty: "", // if the API returns a plain array
    },
  },
});
