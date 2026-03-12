export type RoleFilter = "ALL" | "Admin" | "User";

export type UserDTO = {
  empID: string; // employee.emp_id
  first_name: string;
  last_name: string;
  // access: "Admin" | "User"; // employee.access (added via SQL patch)
  role: "Admin" | "User";
  inspections: string; // computed count, returned as string to match your UI
  email: string;
  group: string; // group_name
  dept: string; // dept_name
};

export type CreateUserDTO = {
  empID: string; // employee.emp_id
  first_name: string;
  last_name: string;
  email: string;
  group_id: string; // uuid
  access: "Admin" | "User";
  password?: string;
};

export type UpdateUserDTO = Partial<{
  first_name: string;
  last_name: string;
  email: string;
  group_id: string; // uuid
  access: "Admin" | "User";
}>;

export type InspectionRowDTO = {
  id: string; // inspection_id
  workID: string; // work_order.work_order
  construction_item: string; // construction_item.item_name
  workCode: string; // work_code.code
  others: string; // work_order.others
  date: string; // YYYY-MM-DD
  time: string; // "X hours Y mins"
  type: "Inspection" | "Receiving";
  location: string; // location.location
};

type UserPayload = {
    empID: string;
    first_name: string;
    last_name: string;
    email: string;
    group_id: string;
    access: "Admin" | "User";
    password?: string;
}