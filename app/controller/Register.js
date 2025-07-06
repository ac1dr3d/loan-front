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

    Ext.Ajax.request({
      url: "http://localhost:5021/api/auth/register",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      jsonData: values,
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

      failure: function (response) {
        const res = Ext.decode(response.responseText, true);

        if (res?.errors) {
          const errorMap = {};
          for (let field in res.errors) {
            const lower = field.charAt(0).toLowerCase() + field.slice(1);
            errorMap[lower] = res.errors[field][0];
          }
          const form = this.lookupReference("form").getForm();
          form.markInvalid(errorMap);
        }

        if (res?.error) {
          Ext.Msg.alert("შეცდომა", res.error);
        }
      },
    });
  },
});
