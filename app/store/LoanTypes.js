Ext.define("LoanFront.store.LoanTypes", {
  extend: "Ext.data.Store",
  alias: "store.loantypes",
  model: "LoanFront.model.LoanType",
  autoLoad: true,
  proxy: {
    type: "ajax",
    url: "http://localhost:5021/api/loan/types",
    reader: {
      type: "json",
    },
  },
});
