import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import GuestRoute from "./utils/GuestRoute";
import PrivateRoute from "./utils/PrivateRoute";
import Clients from "./components/clients/Clients";
import Client from "./components/clients/Client";
import Upload from "./components/clients/Upload";
import Messages from "./components/messages";
import Terminals from "./components/terminals";
/* Product */
import ProductCategories from "./components/products/Categories/Categories";
import AddCategories from "./components/products/Categories/AddCategories";
import AddProduct from "./components/products/product/AddProduct";
import Product from "./components/products/product/Product";
import Orders from "./components/products/orders/Orders";
import AddOrder from "./components/products/orders/AddOrder";
import Settings from "./components/products/settings/Settings";
/* Report */
import TotalSales from "./components/reports/TotalSales";
import EstimatedPayroll from "./components/reports/EstimatedPayroll";
import ServicesCompleted from "./components/reports/ServicesCompleted";
import ProductSales from "./components/reports/ProductSales";
import ClientReport from "./components/reports/ClientReport";
import NewClientsRebooking from "./components/reports/NewClientsRebooking";
import StaffBookingAnalysis from "./components/reports/StaffBookingAnalysis";
import ThirtyDaySanpshot from "./components/reports/30DaySnapshot";
/* Staff */
import Staffs from "./components/staff/Staffs";
import Staff from "./components/staff/Staff";
/* Service */
import Categories from "./components/services/categories/Categories";
import AddCategory from "./components/services/categories/AddCategory";
import Service from "./components/services/service/Service";
import AddService from "./components/services/service/AddService";
import Order from "./components/services/order/Order";
import ServiceOrder from "./components/services/order/AddOrder";
/* Insrtuction */
import Insrtuctions from "./components/Insrtuctions";
/* Schedule */
import Schedule from "./components/schedule/index";
import AddSchedule from "./components/schedule/AddSchedule/AddSchedule";
/* Staff Schedule */
import StaffSchedule from "./components/staff-schedule/StaffSchedule";
import ScheduleStaff from "./components/staff-schedule/add-staff-schedule/index";

const Routes = () => {
  return (
    <Router>
      
      <Switch>
        <GuestRoute exact path="/" component={Login} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/clients" component={Clients} />
        <PrivateRoute exact path="/clients/addnew" component={Client} />
        <PrivateRoute exact path="/clients/view/:id" component={Client} />
        <PrivateRoute exact path="/clients/upload" component={Upload} />
        <PrivateRoute exact path="/messages" component={Messages} />
        <PrivateRoute exact path="/terminals" component={Terminals} />
        {/* products */}
        <PrivateRoute
          exact
          path="/products/categories"
          component={ProductCategories}
        />
        <PrivateRoute
          exact
          path="/products/categories/add-new"
          component={AddCategories}
        />
        <PrivateRoute
          exact
          path="/products/categories/view/:id"
          component={AddCategories}
        />
        <PrivateRoute exact path="/products" component={Product} />
        <PrivateRoute exact path="/products/add-new" component={AddProduct} />
        <PrivateRoute exact path="/products/view/:id" component={AddProduct} />
        <PrivateRoute exact path="/products/orders" component={Orders} />
        <PrivateRoute
          exact
          path="/products/orders/add-new"
          component={AddOrder}
        />
        <PrivateRoute
          exact
          path="/products/orders/view/:id"
          component={AddOrder}
        />
        <PrivateRoute exact path="/products/settings" component={Settings} />
        {/* reports */}
        <PrivateRoute
          exact
          path="/reports/total_sales"
          component={TotalSales}
        />
        <PrivateRoute
          exact
          path="/reports/estimated_payroll"
          component={EstimatedPayroll}
        />
        <PrivateRoute
          exact
          path="/reports/services_completed"
          component={ServicesCompleted}
        />
        <PrivateRoute
          exact
          path="/reports/product_sales"
          component={ProductSales}
        />
        <PrivateRoute
          exact
          path="/reports/client_report"
          component={ClientReport}
        />
        <PrivateRoute
          exact
          path="/reports/new_client_report"
          component={NewClientsRebooking}
        />
        <PrivateRoute
          exact
          path="/reports/staff_booking_analysis"
          component={StaffBookingAnalysis}
        />
        <PrivateRoute
          exact
          path="/reports/30_day_snapshot"
          component={ThirtyDaySanpshot}
        />
        {/* staff */}
        <PrivateRoute exact path="/staff" component={Staffs} />
        <PrivateRoute exact path="/staff/add-new" component={Staff} />
        <PrivateRoute exact path="/staff/view/:id" component={Staff} />
        {/* services */}
        <PrivateRoute
          exact
          path="/services/categories"
          component={Categories}
        />
        <PrivateRoute
          exact
          path="/services/categories/add-new"
          component={AddCategory}
        />
        <PrivateRoute
          exact
          path="/services/categories/view/:id"
          component={AddCategory}
        />
        <PrivateRoute exact path="/services" component={Service} />
        <PrivateRoute exact path="/services/add-new" component={AddService} />
        <PrivateRoute exact path="/services/view/:id" component={AddService} />
        <PrivateRoute exact path="/services/orders" component={Order} />
        <PrivateRoute
          exact
          path="/services/payments/view/:id"
          component={ServiceOrder}
        />
        {/* instructions */}
        <PrivateRoute exact path="/insrtuctions" component={Insrtuctions} />
        {/* Schedule */}
        <PrivateRoute exact path="/schedule" component={Schedule} />
        <PrivateRoute
          exact
          path="/schedule/add-appointment"
          component={AddSchedule}
        />
        <PrivateRoute
          exact
          path="/schedule/edit-appointment/view/:id"
          component={AddSchedule}
        />
        {/* Staff Schedule */}
        <PrivateRoute
          exact
          path="/staff-schedule/add-staff-schedule"
          component={StaffSchedule}
        />
        <PrivateRoute exact path="/staff-schedule" component={ScheduleStaff} />
      </Switch>
    </Router>
  );
};

export default Routes;
