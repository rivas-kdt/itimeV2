"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { RowData, MonthKey, toNumberHours } from "./sheet";
import { UserInfo } from "@/app/user-management/[id]/page";

type Props = {
  rows: RowData[];
  month: number;
  year: number;
  user: UserInfo;
};

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 8 },
  table: { borderWidth: 1, borderColor: "#d1d5db" },
  row: { flexDirection: "row", borderBottomWidth: 1, borderColor: "#9ca3af" },
  headerRow: {
    flexDirection: "row",
    backgroundColor: "#ffe8d8",
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderColor: "#9ca3af",
  },
  cell: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#9ca3af",
    textAlign: "center",
  },
  leftCell: {
    padding: 4,
    borderRightWidth: 1,
    borderColor: "#9ca3af",
    textAlign: "left",
  },
  footerRow: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    fontWeight: "bold",
    borderTopWidth: 1,
    borderColor: "#9ca3af",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 4,
    marginBottom: 8,
  },
  titleDiv: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
    gap: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 24,
  },
  yearMonth: {
    fontSize: 12,
  },
  userInfoDiv: {
    display: "flex",
    paddingVertical: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
  },
  userInfo: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
  },
});

const getDaysInMonth = (m: number, y: number): Date[] => {
  const d = new Date(y, m, 1);
  const days: Date[] = [];
  while (d.getMonth() === m) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
};

const formatValue2Decimal = (val: number) => {
  const decimal = Number((val % 1).toFixed(2));
  const intPart = Math.floor(val);
  return intPart + decimal;
};

export const SheetDaysPdf = ({ rows, month, year, user }: Props) => {
  // const monthKey = `${year}-${String(month + 1).padStart(2, "0")}`;
  const monthKey: MonthKey =
    `${year}-${String(month + 1).padStart(2, "0")}` as MonthKey;
  const daysInMonth = getDaysInMonth(month, year);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const visibleRows = rows.filter(
    (row) =>
      row.monthlyData[monthKey] &&
      Object.keys(row.monthlyData[monthKey]).length > 0,
  );

  const dailyTotals: Record<string, number> = {};
  let grandTotal = 0;
  visibleRows.forEach((row) => {
    const data = row.monthlyData[monthKey];
    // Object.entries(data).forEach(([day, value]) => {
    //   dailyTotals[day] = (dailyTotals[day] || 0) + value;
    //   grandTotal += value;
    // });
    Object.entries(data).forEach(([day, value]) => {
      const num = typeof value === "number" ? value : Number(value) || 0;

      dailyTotals[day] = (dailyTotals[day] || 0) + num;
      grandTotal += num;
    });
  });

  const fixedWidths = {
    workOrder: 50,
    construction: 50,
    workCode: 40,
    others: 30,
    total: 30,
  };
  const dynamicWidth =
    (842 -
      40 -
      (fixedWidths.workOrder +
        fixedWidths.construction +
        fixedWidths.workCode +
        fixedWidths.others +
        fixedWidths.total)) /
    daysInMonth.length;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.titleDiv}>
            <Text style={styles.title}>Man Hour Performance Table</Text>
            <Text style={styles.yearMonth}>
              ( {year}
              {"0" + month} )
            </Text>
          </View>
          <View style={styles.userInfoDiv}>
            <Text>Full Name</Text>
            <View style={styles.userInfo}>
              <Text>{user.empID}</Text>
              <Text>{user.name}</Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.cell, { width: fixedWidths.workOrder }]}>
              Work Order
            </Text>
            <Text style={[styles.cell, { width: fixedWidths.construction }]}>
              Construction Item
            </Text>
            <Text style={[styles.cell, { width: fixedWidths.workCode }]}>
              Work Code
            </Text>
            <Text style={[styles.cell, { width: fixedWidths.others }]}>
              Others
            </Text>
            <Text style={[styles.cell, { width: fixedWidths.total }]}>
              Total
            </Text>
            {daysInMonth.map((date) => (
              <View
                key={date.getDate()}
                style={[styles.cell, { width: dynamicWidth }]}
              >
                <Text>{String(date.getDate()).padStart(2, "0")}</Text>
                <Text style={{ fontSize: 6 }}>{dayNames[date.getDay()]}</Text>
              </View>
            ))}
          </View>

          {/* Rows */}
          {visibleRows.map((row, rIdx) => {
            const data = row.monthlyData[monthKey];
            // const total = Object.values(data).reduce((a, b) => a + b, 0);
            const total = Object.values(data).reduce<number>(
              (sum, value) => sum + toNumberHours(value),
              0,
            );
            return (
              <View
                key={`row-${monthKey}-${row.id ?? rIdx}-${row.workOrder}`}
                style={styles.row}
              >
                <Text
                  style={[styles.leftCell, { width: fixedWidths.workOrder }]}
                >
                  {row.workOrder}
                </Text>
                <Text
                  style={[styles.leftCell, { width: fixedWidths.construction }]}
                >
                  {row.construction}
                </Text>
                <Text style={[styles.cell, { width: fixedWidths.workCode }]}>
                  {row.workCode}
                </Text>
                <Text style={[styles.cell, { width: fixedWidths.others }]}>
                  {row.others}
                </Text>
                <Text style={[styles.cell, { width: fixedWidths.total }]}>
                  {formatValue2Decimal(total)}
                </Text>
                {daysInMonth.map((date) => (
                  <Text
                    key={`${row.id}-${date.getDate()}`}
                    style={[
                      styles.cell,
                      { width: dynamicWidth },
                      { fontSize: 6 },
                    ]}
                  >
                    {toNumberHours(data[date.getDate()]) > 0
                      ? formatValue2Decimal(toNumberHours(data[date.getDate()]))
                      : ""}
                  </Text>
                ))}
              </View>
            );
          })}

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text
              style={[
                styles.leftCell,
                {
                  width:
                    fixedWidths.workOrder +
                    fixedWidths.construction +
                    fixedWidths.workCode +
                    fixedWidths.others,
                },
              ]}
            >
              Actual Man-Hour
            </Text>
            <Text style={[styles.cell, { width: fixedWidths.total }]}>
              {formatValue2Decimal(grandTotal)}
            </Text>
            {daysInMonth.map((date) => (
              <Text
                key={`footer-${date.getDate()}`}
                style={[styles.cell, { width: dynamicWidth }, { fontSize: 6 }]}
              >
                {formatValue2Decimal(dailyTotals[date.getDate()] ?? 0)}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};
