// app/view/loan/LoanForm.js
Ext.define("LoanFront.view.loan.LoanForm", {
  extend: "Ext.form.Panel",
  xtype: "loan-form",

  bodyPadding: 15,
  reference: "loanForm",
  defaults: {
    xtype: "textfield",
    anchor: "100%",
    allowBlank: false,
    labelAlign: "top",
  },

  items: [
    { name: "id", xtype: "hiddenfield" },
    {
      fieldLabel: "სესხის ტიპი",
      name: "loanTypeId",
      xtype: "combobox",
      store: { type: "loantypes" },
      valueField: "id",
      displayField: "name",
      queryMode: "local",
      forceSelection: true,
      editable: false,
    },
    {
      fieldLabel: "თანხა",
      name: "amount",
      xtype: "numberfield",
      minValue: 1,
    },
    {
      fieldLabel: "ვალუტა",
      name: "currencyId",
      xtype: "combobox",
      store: { type: "currencies" },
      valueField: "id",
      displayField: "name",
      queryMode: "local",
      forceSelection: true,
      editable: false,
    },
    {
      fieldLabel: "ვადა (თვე)",
      name: "monthsTerm",
      xtype: "numberfield",
      minValue: 1,
    },
  ],
});
