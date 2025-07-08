Ext.define("LoanFront.view.loan.EditLoanWindow", {
  extend: "Ext.window.Window",
  xtype: "edit-loan-window",
  title: "სესხის ჩასწორება",
  controller: "loan",
  modal: true,
  width: 400,
  layout: "fit",

  items: [
    {
      xtype: "loan-form",
      reference: "editForm",
      buttons: [
        {
          text: "გაუქმება",
          handler: function (btn) {
            btn.up("window").close();
          },
        },
        {
          xtype: "component",
          flex: 1,
        },
        {
          text: "შენახვა",
          formBind: true,
          handler: "onUpdateLoan",
        },
      ],
    },
  ],
});
