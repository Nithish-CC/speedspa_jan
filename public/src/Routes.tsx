import { BrowserRouter as Router, Switch } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Schedule from "./components/Schedule";
import GuestRoute from "./utils/GuestRoute";
import PrivateRoute from "./utils/PrivateRoute";
import Clients from "./components/clients/Clients";
import Client from "./components/clients/Client";
import ProductCategories from "./components/products/Categories/Categories";
import AddCategories from "./components/products/Categories/AddCategories";
import CategoryProducts from "./components/products/Products/Products";
import AddProductCategories from "./components/products/Products/AddProducts";
import ThirtyDaySanpshot from "./components/reports/30DaySnapshot";
import TotalSales from "./components/reports/TotalSales";
import EstimatedPayroll from "./components/reports/EstimatedPayroll";
import ServicesCompleted from "./components/reports/ServicesCompleted";
import ClientReport from "./components/reports/ClientReport";
import StaffBookingAnalysis from "./components/reports/StaffBookingAnalysis";
import ProductSales from "./components/reports/ProductSales";
const Routes = () => {
  return (
    <Router>
      <Switch>
        <GuestRoute exact path="/login" component={Login} />
        <PrivateRoute exact path="/" component={Schedule} />
        <PrivateRoute exact path="/dashboard" component={Dashboard} />
        <PrivateRoute exact path="/clients" component={Clients} />
        <PrivateRoute exact path="/clients/addnew" component={Client} />
        <PrivateRoute exact path="/clients/view/:id" component={Client} />
        <PrivateRoute exact path="/products/categories" component={ProductCategories} />
        <PrivateRoute exact path="/products/categories/add-new" component={AddCategories} />
        <PrivateRoute exact path="/products/categories/view/:id"  component={AddCategories} />
        <PrivateRoute exact path="/categoryproducts" component={CategoryProducts} />
        <PrivateRoute exact path="/categoryproducts/categoryaddproduct" component={AddProductCategories} />
        <PrivateRoute exact path="/reports/30_day_snapshot" component={ThirtyDaySanpshot} />
        <PrivateRoute exact path="/reports/total_sales" component={TotalSales} />
        <PrivateRoute exact path="/reports/estimated_payroll" component={EstimatedPayroll} />
        <PrivateRoute exact path="/reports/services_completed" component={ServicesCompleted} />
        <PrivateRoute exact path="/reports/client_report" component={ClientReport} />
        <PrivateRoute exact path="/reports/staff_booking_analysis" component={StaffBookingAnalysis} />
        <PrivateRoute exact path="/reports/product_sales" component={ProductSales} />
      </Switch>
    </Router>
  );
};

export default Routes;
