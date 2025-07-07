Ext.define("LoanFront.model.Currency", {
  extend: "Ext.data.Model",
  fields: [
    { name: "id", type: "int" },
    { name: "code", type: "string" },
    { name: "name", type: "string" },
  ],
});
