import type { Outlet } from "./merchant";
import type { MenuItem } from "./service";
import type { Staff } from "./staff";

export interface AllOutlet {
    outlet: Outlet,
    staffList: Staff[],
    serviceList: MenuItem[]
}