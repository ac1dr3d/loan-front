Ext.define("LoanFront.view.user.Main", {
  extend: "Ext.tab.Panel",
  xtype: "app-user-main",

  requires: [
    "Ext.plugin.Viewport",
    "Ext.window.MessageBox",

    "LoanFront.view.main.MainController",
    "LoanFront.view.main.MainModel",
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
        text: "სესხები",
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
          xtype: "grid",
          title: "სესხები",
          store: {
            type: "loans",
          },

          columns: [
            {
              text: "თარიღი",
              dataIndex: "createdAt",
              xtype: "datecolumn",
              format: "d/m/Y H:i:s",
              flex: 1,
            },
            {
              text: "თანხა",
              dataIndex: "amount",
              xtype: "numbercolumn",
              flex: 1,
            },
            {
              text: "ვალუტა",
              renderer: function (value, meta, record) {
                return record.getCurrency()?.get("name") || "";
              },
              flex: 1,
            },
            {
              text: "სესხის ტიპი",
              renderer: function (value, meta, record) {
                return record.getLoanType()?.get("name") || "";
              },
              flex: 1,
            },
            {
              text: "სტატუსი",
              renderer: function (value, meta, record) {
                return record.getLoanStatus()?.get("name") || "";
              },
              flex: 1,
            },
            {
              text: "ვადა (თვე)",
              dataIndex: "monthsTerm",
              flex: 1,
            },
            {
              xtype: "widgetcolumn",
              text: "მოქმედებები",
              width: 270,
              widget: {
                xtype: "container",
                layout: {
                  type: "hbox",
                  align: "middle",
                  pack: "center",
                },
                defaults: {
                  margin: "0 4",
                },
                items: [
                  {
                    xtype: "button",
                    text: "გაგზავნა", // Confirm
                    handler: function (btn) {
                      const rec = btn.up("widgetcolumn").getWidgetRecord();
                      // Handle confirm logic here
                      Ext.Msg.alert(
                        "დამტკიცება",
                        `სესხი ID ${rec.get("id")} დადასტურდა.`,
                      );
                    },
                  },
                  {
                    xtype: "button",
                    text: "ჩასწორება",
                    handler: (btn) => {
                      var rowIndex = btn
                        .up("gridview")
                        .indexOf(btn.el.up("table"));

                      const tabPanel = btn.up("tabpanel");
                      const grid = tabPanel.down("grid");
                      var record = grid.getStore().getAt(rowIndex);

                      var win = Ext.create(
                        "LoanFront.view.loan.EditLoanWindow",
                        {
                          title: `${record.get("id")} - სესხის ჩასწორება`,
                          modal: true,
                        },
                      );

                      win.down("form").loadRecord(record);
                      win.show();
                    },
                  },
                  {
                    xtype: "button",
                    text: "წაშლა", // Delete
                    handler: function (btn) {
                      const rec = btn.up("widgetcolumn").getWidgetRecord();
                      // Handle delete logic
                      Ext.Msg.confirm(
                        "დასტური",
                        "დარწმუნებული ხართ რომ გსურთ წაშლა?",
                        function (choice) {
                          if (choice === "yes") {
                            // perform delete
                            Ext.Msg.alert(
                              "წაშლა",
                              `წაიშალა სესხი ID ${rec.get("id")}`,
                            );
                          }
                        },
                      );
                    },
                  },
                ],
              },
            },
          ],
          height: 500,
          width: 1200,
          scrollable: true,
        },
      ],
    },
    {
      title: "ახლის მოთხოვნა",
      iconCls: "fa-plus",
      items: [
        {
          xtype: "loan-form",
          maxWidth: 400,
          buttons: [
            {
              text: "მოთხოვნის შექმნა",
              handler: function (btn) {
                const formPanel = btn.up("loan-form");
                const form = formPanel.getForm();

                if (form.isValid()) {
                  const values = form.getValues();
                  Ext.Ajax.request({
                    url: "http://localhost:5021/api/loan/create",
                    method: "POST",
                    jsonData: values,
                    success: function () {
                      Ext.Msg.alert("წარმატება", "სესხი დამატებულია.");
                      form.reset();

                      const tabPanel = btn.up("tabpanel");
                      const grid = tabPanel.down("grid");
                      grid.getStore().reload();
                      tabPanel.setActiveTab(0);
                    },
                    failure: (response) => {
                      const res = Ext.decode(response.responseText, true);
                      if (res?.errors) {
                        const errorMap = {};
                        const allMessages = [];

                        for (let field in res.errors) {
                          const lower =
                            field.charAt(0).toLowerCase() + field.slice(1);
                          const message = res.errors[field][0];

                          errorMap[lower] = message;
                          allMessages.push(message);
                        }

                        form.markInvalid(errorMap);
                        Ext.Msg.alert("შეცდომა", allMessages.join("<br>"));
                      }
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
});
