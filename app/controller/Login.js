Ext.define("LoanFront.controller.Login", {
  extend: "Ext.app.ViewController",
  alias: "controller.login",

  onLoginClick: function () {
    var form = this.lookupReference("form");

    if (form.isValid()) {
      Ext.Ajax.request({
        url: "/api/login",
        method: "POST",
        params: form.getValues(),
        success: function (response) {
          localStorage.setItem(
            "authToken",
            Ext.decode(response.responseText).token,
          );
          this.getView().destroy();
          Ext.create("LoanForm.view.main.Main");
        },
        failure: function () {
          Ext.Msg.alert("Error", "Invalid credentials");
        },
        scope: this,
      });
    }
  },

  onRegisterClick: function () {
    // Open registration window or redirect
    // window.location.href = '/register.html';

    // Alternative: Open registration window
    // Ext.create('LoanFront.view.register.Register').show();

    // Close current login window
    this.getView().close();

    // Open the registration window
    Ext.create("LoanFront.view.register.Register");
  },
});
