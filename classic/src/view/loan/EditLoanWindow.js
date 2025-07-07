Ext.define("LoanFront.view.loan.EditLoanWindow", {
  extend: "Ext.window.Window",
  xtype: "edit-loan-window",
  title: "სესხის ჩასწორება",
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
          handler: function (btn) {
            const win = btn.up("window");
            const form = btn.up("loan-form").getForm();
            if (form.isValid()) {
              Ext.Ajax.request({
                url: `http://localhost:5021/api/loan/update`,
                method: "PUT",
                jsonData: form.getValues(),
                success: () => {
                  Ext.Msg.alert("წარმატება", "სესხი განახლდა.");
                  win.close();
                  Ext.getStore("loans").reload();
                },
                failure: () => {
                  Ext.Msg.alert("შეცდომა", "ვერ განახლდა სესხი.");
                },
              });
            }
          },
        },
      ],
    },
  ],
});
