import { useEffect, useState } from "react";
import {
  Form,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  Row,
  Button,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import PageHeader from "./core/PageHeader";

const Staff = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [loading, setLoading] = useState(false);
  const [orderBy, setOrderBy] = useState(false);
  const [field, setField] = useState("createdAt");
  const [activePage, setActivePage] = useState(1);
  const [perPage] = useState(10);

  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [role, setRole] = useState("");

  const [statuses] = useState([
    {
      value: "",
      text: "All",
    },
    {
      value: "active",
      text: "Active",
    },
    {
      value: "inactive",
      text: "Inactive",
    },
  ]);

  const [roles] = useState([
    {
      value: "",
      text: "All",
    },
    {
      value: "stylist",
      text: "Stylist",
    },
    {
      value: "admin",
      text: "Admin",
    },
  ]);

  const [buttons] = useState([
    {
      title: "Add Staff",
      url: "Staff/addnew",
    },
  ]);

  const UI = useSelector((state: any) => state.UI);
  const allStaff = useSelector((state: any) => state.user.allStaff);

  useEffect(() => {
    getAllStaff();
    if (UI.errors) {
      setErrors(UI.errors);
    }
    setLoading(UI.loading);
  }, []);

  const getAllStaff = () => {
    const params = {
      businessId: localStorage.businessId,
      roles: "staff",
    };
    props.allStaff(params);
  };

  const handleReset = (e: any) => {
    setText("");
    setStatus("");
    setRole("");
    const params: any = {
      businessId: localStorage.businessId,
      roles: "staff",
      text: "",
    };
    props.searchClients(params);
  };

  const handleSearch = (e: any) => {
    const params: any = {
      businessId: localStorage.businessId,
      roles: "client",
      text: text,
    };
    console.log(params, "+++++");
    props.searchClients(params);
  };

  const handleSortChange = (key: any) => {
    if (field === key) {
      setOrderBy(!orderBy);
    } else {
      setOrderBy(true);
      setField(key);
    }
    allStaff.sort(function (a: any, b: any) {
      const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
      const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];
      let comparison = 0;
      if (varA > varB) {
        comparison = 1;
      } else if (varA < varB) {
        comparison = -1;
      }
      return orderBy === true ? comparison * -1 : comparison;
    });
  };

  return (
    <div>
      <PageHeader title="Staff" buttons={buttons} />
      <div className="row">
        <div className="col-lg-12">
          <div className="wrapper wrapper-content animated fadeInRight">
            <div className="ibox float-e-margins">
              <div className="ibox-content">
                <Form role="form">
                  <Row>
                    <Col md="3" sm="4">
                      <FormGroup>
                        <FormLabel>Search</FormLabel>
                        <FormControl type="text" placeholder="Search by name" />
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="4">
                      <FormGroup>
                        <FormLabel>Role</FormLabel>
                        <FormControl as="select">
                          {roles && roles.length ? (
                            roles.map((statusObj: any) => {
                              return (
                                <option
                                  key={statusObj.text}
                                  value={statusObj.value}
                                >
                                  {statusObj.text}
                                </option>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </FormControl>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="4">
                      <FormGroup>
                        <FormLabel>Status</FormLabel>
                        <FormControl as="select">
                          {statuses && statuses.length ? (
                            statuses.map((statusObj: any) => {
                              return (
                                <option
                                  key={statusObj.text}
                                  value={statusObj.value}
                                >
                                  {statusObj.text}
                                </option>
                              );
                            })
                          ) : (
                            <></>
                          )}
                        </FormControl>
                      </FormGroup>
                    </Col>
                    <Col md="3" sm="4">
                      <FormGroup>
                        <FormLabel>&nbsp;</FormLabel>
                        <div>
                          <Button type="button" variant="info m-1">
                            Reset
                          </Button>
                          &nbsp;
                          <Button type="submit" variant="primary m-1">
                            Search
                          </Button>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>
            <div className="ibox float-e-margins">
              <div className="ibox-content">
                <table className="table table-striped table-hover dataTables-example">
                  <thead>
                    <tr>
                      <th
                        className={
                          field !== "name"
                            ? "sorting"
                            : orderBy
                            ? "sorting_asc"
                            : "sorting_desc"
                        }
                        onClick={(e) => handleSortChange("name")}
                      >
                        Staff
                      </th>
                      <th
                        className={
                          field !== "phoneNumber"
                            ? "sorting"
                            : orderBy
                            ? "sorting_asc"
                            : "sorting_desc"
                        }
                        onClick={(e) => handleSortChange("phoneNumber")}
                      >
                        Email
                      </th>
                      <th
                        className={
                          field !== "email"
                            ? "sorting"
                            : orderBy
                            ? "sorting_asc"
                            : "sorting_desc"
                        }
                        onClick={(e) => handleSortChange("email")}
                      >
                        Role
                      </th>
                      <th
                        className={
                          field !== "dob"
                            ? "sorting"
                            : orderBy
                            ? "sorting_asc"
                            : "sorting_desc"
                        }
                        onClick={(e) => handleSortChange("dob")}
                      >
                        Date Added
                      </th>
                      <th
                        className={
                          field !== "createdAt"
                            ? "sorting"
                            : orderBy
                            ? "sorting_asc"
                            : "sorting_desc"
                        }
                        onClick={(e) => handleSortChange("createdAt")}
                      >
                        Status
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      className="gradeX"
                      ng-repeat="staff in vm.staff.slice(((currentPage-1)*vm.itemsPerPage), ((currentPage)*vm.itemsPerPage))"
                    >
                      <td>
                        {"{"}
                        {"{"}staff.firstName{"}"}
                        {"}"} {"{"}
                        {"{"}staff.lastName{"}"}
                        {"}"}
                      </td>
                      <td>
                        {"{"}
                        {"{"}staff.email{"}"}
                        {"}"}
                      </td>
                      <td
                        className="center"
                        style={{ textTransform: "capitalize" }}
                      >
                        {"{"}
                        {"{"}staff.roleName{"}"}
                        {"}"}
                      </td>
                      <td>
                        {"{"}
                        {"{"}staff.createdAt | date: 'MMM d, y'{"}"}
                        {"}"}
                      </td>
                      <td
                        className="center"
                        style={{ textTransform: "capitalize" }}
                      >
                        {"{"}
                        {"{"}staff.status{"}"}
                        {"}"}
                      </td>
                      <td className="center">
                        <div style={{ position: "relative" }}>
                          <button
                            data-toggle="dropdown"
                            className="btn btn-xs btn-gray dropdown-toggle"
                            type="button"
                          >
                            Action
                            <span className="caret" />
                          </button>
                          <ul className="dropdown-menu">
                            <li>
                              <a ui-sref="index.staff.view({staffId: staff.id})">
                                View/Edit
                              </a>
                            </li>
                            <li ng-if="staff.roleName !== 'admin'">
                              <a
                                delete-item-button
                                item="staff"
                                items="vm.staff"
                                item-type="staff"
                                item-name="(staff.firstName+' '+staff.lastName)"
                                item-callback="vm.delete"
                                item-msg="'Before deleting make sure there is no appointment assigned for this user'"
                              >
                                Delete
                              </a>
                            </li>
                            <li ng-if="staff.roleName === 'admin'">
                              <a
                                delete-item-button
                                item="staff"
                                items="vm.staff"
                                item-type="staff"
                                item-name="(staff.firstName+' '+staff.lastName)"
                                item-callback="vm.delete"
                              >
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                    <tr ng-if="vm.staff.length <= 0">
                      <td colSpan={5} style={{ textAlign: "center" }}>
                        {"{"}
                        {"{"} 'No Staffs/Admin' {"}"}
                        {"}"}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div
                  data-ng-show="vm.total > vm.itemsPerPage"
                  className="text-right"
                >
                  <ul
                    uib-pagination
                    total-items="vm.total"
                    ng-model="currentPage"
                    ng-change="vm.pageChanged()"
                    items-per-page="vm.itemsPerPage"
                    className="pagination-sm"
                    boundary-links="true"
                    force-ellipses="true"
                    previous-text="‹"
                    next-text="›"
                    first-text="«"
                    last-text="»"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Staff;
