Ext.define("LoanFront.model.Loan", {
  extend: "Ext.data.Model",

  requires: [
    "LoanFront.model.Currency",
    "LoanFront.model.LoanType",
    "LoanFront.model.LoanStatus",
  ],

  fields: [
    { name: "id", type: "int" },
    { name: "userId", type: "int" },
    { name: "loanTypeId", type: "int" },
    { name: "statusId", type: "int" },
    { name: "amount", type: "float" },
    { name: "currencyId", type: "int" },
    { name: "monthsTerm", type: "int" },
    { name: "createdAt", type: "date", dateFormat: "c" },
  ],

  hasOne: [
    {
      name: "currency",
      model: "LoanFront.model.Currency",
      associationKey: "currency", // matches nested JSON property name
    },
    {
      name: "loanType",
      model: "LoanFront.model.LoanType",
      associationKey: "loanType",
    },
    {
      name: "loanStatus",
      model: "LoanFront.model.LoanStatus",
      associationKey: "loanStatus",
    },
  ],
});
