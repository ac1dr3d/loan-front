Ext.define("LoanFront.view.register.RegisterController", {
  extend: "Ext.app.ViewController",
  alias: "controller.register",

  onBackToLogin: function () {
    this.getView().close();
    Ext.create("LoanFront.view.login.Login"); // or your login view class
  },

  onRegisterSubmit: function () {
    const formCmp = this.lookupReference("form"); // form panel
    const form = formCmp.getForm(); // BasicForm
    if (!form.isValid()) return;

    const values = form.getValues();
    const email = values.email;
    const formId = Ext.id();
    form.owner.formId = formId;

    Ext.Ajax.request({
      url: "http://localhost:5021/api/auth/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      jsonData: values,
      formId: formId,
      success: (response, opts) => {
        Ext.Msg.alert(
          "წარმატება",
          "რეგისტრაცია წარმატებით შესრულდა",
          function () {
            // Close the registration window
            this.getView().close();

            // Open the login window
            Ext.create("LoanFront.view.login.Login", {
              emailPrefill: email, // Pass email as config
            });
          },
          this, // keep controller scope
        );
      },
    });
  },
});
