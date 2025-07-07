Ext.define("LoanFront.view.user.Main", {
  extend: "Ext.tab.Panel",
  xtype: "app-main",

  requires: [
    "Ext.plugin.Viewport",
    "Ext.window.MessageBox",

    "LoanFront.view.main.MainController",
    "LoanFront.view.main.MainModel",
    "LoanFront.view.main.List",
  ],

  controller: "main",
  viewModel: "main",

  ui: "navigation",

  tabBarHeaderPosition: 1,
  titleRotation: 0,
  tabRotation: 0,

  header: {
    layout: {
      align: "stretchmax",
    },
    title: {
      bind: {
        text: "ჩემი სესხები",
      },
      flex: 0,
    },
    iconCls: "fa-th-list",
  },
  tabBar: {
    flex: 1,
    layout: {
      align: "stretch",
      overflowHandler: "none",
    },
    items: [
      {
        xtype: "tbfill", // pushes the next item to the bottom
      },
      {
        xtype: "button",
        text: "გასვლა",
        iconCls: "fa fa-sign-out",
        margin: 5,
        handler: function () {
          localStorage.removeItem("authToken");
          location.reload(); // or redirect to login
        },
      },
    ],
  },
  responsiveConfig: {
    tall: {
      headerPosition: "top",
    },
    wide: {
      headerPosition: "left",
    },
  },

  defaults: {
    bodyPadding: 20,
    tabConfig: {
      responsiveConfig: {
        wide: {
          iconAlign: "left",
          textAlign: "left",
        },
        tall: {
          iconAlign: "top",
          textAlign: "center",
          width: 120,
        },
      },
    },
  },

  items: [
    {
      title: "მოთხოვნილი სესხები",
      iconCls: "fa-clipboard-list",
      items: [
        {
          xtype: "mainlist", // your existing loan list grid
        },
      ],
    },
    {
      title: "ახლის მოთხოვნა",
      iconCls: "fa-plus",

      items: [
        {
          xtype: "form",
          bodyPadding: 15,
          maxWidth: 400,
          defaults: {
            xtype: "textfield",
            anchor: "100%",
            allowBlank: false,
          },
          items: [
            {
              fieldLabel: "სესხის ტიპი",
              name: "loanTypeId",
              xtype: "combobox",
              store: {
                type: "loantypes",
              },
              valueField: "id",
              displayField: "name",
              queryMode: "local",
              forceSelection: true,
              editable: false,
              allowBlank: false,
            },
            {
              fieldLabel: "თანხა",
              name: "amount",
              vtype: "numeric",
              minValue: 1,
            },
            {
              xtype: "combobox",
              fieldLabel: "ვალუტა", // "Currency" in Georgian
              name: "currencyId",
              displayField: "name", // visible text (e.g. ლარი, დოლარი)
              valueField: "id", // submitted value (e.g. 1, 2, 3)
              queryMode: "local",
              forceSelection: true,
              editable: false,
              allowBlank: false,
              store: {
                type: "currencies",
              },
            },
            {
              fieldLabel: "პერიოდი (თვეები)",
              name: "term",
              vtype: "numeric",
              minValue: 1,
            },
            {
              xtype: "container",
              layout: {
                type: "hbox",
                align: "middle",
              },
              defaults: {
                flex: 0,
              },
              margin: "20 0 0 0",
              items: [
                {
                  text: "მოთხოვნის შექმნა",
                  xtype: "button",
                  formBind: true,

                  handler: function (btn) {
                    const form = btn.up("form");
                    if (form.isValid()) {
                      const values = form.getValues();

                      Ext.Ajax.request({
                        url: "http://localhost:3000/api/loans/request",
                        method: "POST",
                        jsonData: values,
                        success: function () {
                          Ext.Msg.alert("Success", "Loan request submitted.");
                          form.reset();

                          const tabPanel = btn.up("tabpanel");
                          tabPanel.setActiveTab(0);
                        },
                        failure: function () {
                          const tabPanel = btn.up("tabpanel");
                          tabPanel.setActiveTab(0);
                          // Ext.Msg.alert("Error", "Failed to submit loan request.");
                        },
                      });
                    }
                  },
                },
                {
                  xtype: "component",
                  flex: 1,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
});
