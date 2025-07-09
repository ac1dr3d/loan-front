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
          const claims = parseJwt(result.token);
          const role =
            claims["role"] ||
            claims["roles"] ||
            claims[
              "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            ];

          this.getView().destroy();
          switch (role?.toLowerCase()) {
            case "admin":
              Ext.create("LoanFront.view.admin.Main", {
                plugins: "viewport",
              });
              break;
            case "user":
              Ext.create("LoanFront.view.user.Main", {
                plugins: "viewport",
              });
              break;
            default:
              Ext.create("LoanFront.view.user.Main", {
                plugins: "viewport",
              });
              break;
          }
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

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join(""),
  );
  return JSON.parse(jsonPayload);
}
