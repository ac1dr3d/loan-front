/*
 * This file launches the application by asking Ext JS to create
 * and launch() the Application class.
 */

Ext.application({
  extend: "LoanFront.Application",

  name: "LoanFront",

  requires: [
    // This will automatically load all classes in the LoanFront namespace
    // so that application classes do not need to require each other.
    "LoanFront.*",
    "LoanFront.view.login.Login",
    "LoanFront.view.user.Main",
  ],

  launch: function () {
    Ext.Ajax.request({
      url: "http://localhost:5021/api/auth/check-auth",
      success: function (response) {
        const { role } = Ext.decode(response.responseText);
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
      failure: function () {
        Ext.create("LoanFront.view.login.Login");
      },
    });
  },
});

Ext.Ajax.on(
  "beforerequest",
  function (conn, options) {
    if (!options.headers) {
      options.headers = {};
    }
    const token = localStorage.getItem("authToken");

    if (token) options.headers["Authorization"] = "Bearer " + token;
  },
  this,
);

Ext.apply(Ext.form.field.VTypes, {
  numeric: function (val) {
    return /^-?\d+(\.\d+)?$/.test(val); // supports integers and decimals
  },
  numericText: "Only numeric values are allowed.",
});

Ext.define("LoanFront.ux.AutoSlashDateField", {
  extend: "Ext.form.field.Date",
  alias: "widget.autoslashdatefield",

  format: "d/m/Y",
  submitFormat: "Y-m-d",

  listeners: {
    render: function (field) {
      field.inputEl.on("keypress", function (e) {
        const value = field.getRawValue().replace(/\D/g, ""); // digits only
        const len = value.length;

        // Only add slash if user is typing
        if (!Ext.isIE && !Ext.isIE11) {
          setTimeout(() => {
            let raw = field.getRawValue().replace(/\D/g, "");
            if (raw.length === 2) {
              field.setRawValue(raw.replace(/(\d{2})(\d{0,2})/, "$1/$2"));
            }
            if (raw.length === 4) {
              field.setRawValue(raw.replace(/(\d{2})(\d{0,2})/, "$1/$2/"));
            }
            if (raw.length === 6) {
              field.setRawValue(
                raw.replace(/(\d{2})(\d{2})(\d{0,4})/, "$1/$2/$3"),
              );
            }
          }, 0);
        }
      });
    },
  },
});
