Ext.define("LoanFront.view.user.Main", {
  extend: "Ext.tab.Panel",
  xtype: "app-user-main",

  requires: [
    "Ext.plugin.Viewport",
    "Ext.window.MessageBox",
    "LoanFront.controller.LoanController",
  ],

  controller: "loan",
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
                  pack: "end",
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
                    itemId: "editBtn",
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
                    handler: "onDeleteLoan",
                  },
                ],
              },
              onWidgetAttach: function (col, widget, rec) {
                const editBtn = widget.down("#editBtn");
                const statusId = rec.get("statusId") || 0;
                editBtn.setVisible(statusId === 1);
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
              handler: "onCreateLoan",
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
