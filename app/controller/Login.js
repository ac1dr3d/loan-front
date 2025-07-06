Ext.define("LoanFront.controller.Login", {
  extend: "Ext.app.ViewController",
  alias: "controller.login",

  onLoginClick: function () {
    var formCmp = this.lookupReference("form");
    var form = formCmp.getForm();

    if (form.isValid()) {
      var values = form.getValues();

      Ext.Ajax.request({
        url: "http://localhost:5021/api/auth/login",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        jsonData: values,
        success: function (response) {
          var result = Ext.decode(response.responseText);
          localStorage.setItem("authToken", result.token);

          this.getView().destroy();

          Ext.create("LoanFront.view.user.Main", {
            plugins: "viewport",
          });
        },
        failure: function (response) {
          var res = Ext.decode(response.responseText, true);
          var msg = res?.error || "Invalid credentials";
          Ext.Msg.alert("შეცდომა", msg);
        },
        scope: this,
      });
    }
  },

  onRegisterClick: function () {
    this.getView().close();

    Ext.create("LoanFront.view.register.Register");
  },
});
