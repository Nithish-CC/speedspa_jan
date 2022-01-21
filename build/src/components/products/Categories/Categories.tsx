import { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getAllProductCategories,
  deleteProductCategories,
} from "../../../redux/actions/productAction";
import PageHeader from "../../core/PageHeader";
import Pagination from "react-js-pagination";
import DeleteModal from "../../core/DeleteModal";

const ProductCategories = (props: any) => {
  const [errors, setErrors] = useState({} as Error);
  const [title] = useState("Product Categories");
  const [activePage, setActivePage] = useState(1);
  const [perPage] = useState(10);

  const [modalPopup, setModalPopup] = useState({
    deleteModal: false,
    id: "",
    name: "",
    index: "",
  });
  const [initialModalPopup] = useState({ ...modalPopup });

  const [buttons] = useState([
    {
      title: "Add Category",
      url: "/products/categories/add-new",
    },
  ]);

  const UI = useSelector((state: any) => state.UI);
  const user = useSelector((state: any) => state.user);
  const productCategories = useSelector(
    (state: any) => state.product.productCategories
  );
  console.log(productCategories.length);
  useEffect(() => {
    getAllProductCategories();
    if (UI.errors) {
      setErrors(UI.errors);
    }
  }, []);

  const getAllProductCategories = () => {
    const params = {
      businessId: localStorage.businessId,
    };
    props.getAllProductCategories(params);
  };

  const deletePopup = (category: any, index: any) => {
    setModalPopup({
      deleteModal: !modalPopup.deleteModal,
      id: category.id,
      name: category.name,
      index: index,
    });
    console.log(category);
  };

  const closeModal = () => {
    setModalPopup(initialModalPopup);
  };

  const handleDelete = () => {
    let params = {
      businessId: localStorage.getItem("businessId"),
    };
    props.deleteProductCategories(modalPopup.id, params);
    closeModal();
    productCategories.splice(modalPopup.index, 1);
  };

  return (
    <>
      {user.authenticated && !UI.loading ? (
        <>
          <PageHeader title={title} buttons={buttons} />
          <div className="row">
            <div className="col-lg-12">
              <div className="wrapper wrapper-content animated fadeInRight">
                <div className="ibox float-e-margins">
                  <div className="ibox-content">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover dataTables-example">
                        <thead>
                          <tr key="header">
                            <th>Category Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {productCategories && productCategories.length ? (
                            productCategories
                              .slice(
                                (activePage - 1) * perPage,
                                activePage * perPage
                              )
                              .map((category: any, index: any) => {
                                return (
                                  <tr className="gradeX" key={index}>
                                    <td>{category.name}</td>
                                    <td>
                                      <div style={{ position: "relative" }}>
                                        <button
                                          data-toggle="dropdown"
                                          className="btn btn-xs btn-gray dropdown-toggle"
                                          type="button"
                                        >
                                          Action
                                          <span className="caret"></span>
                                        </button>
                                        <ul className="dropdown-menu">
                                          <li>
                                            <Link
                                              key={index}
                                              to={`/products/categories/view/${category.id}`}
                                            >
                                              View/Edit
                                            </Link>
                                          </li>
                                          <li>
                                            <a
                                              onClick={() =>
                                                deletePopup(category, index)
                                              }
                                            >
                                              Delete
                                            </a>
                                          </li>
                                        </ul>
                                      </div>
                                    </td>
                                  </tr>
                                );
                              })
                          ) : (
                            <tr>
                              <td colSpan={2} className="text-center">
                                No Product Categories
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      {productCategories.length > 10 ? (
                        <div className="text-right">
                          <Pagination
                            activePage={activePage}
                            itemsCountPerPage={perPage}
                            totalItemsCount={productCategories.length}
                            pageRangeDisplayed={5}
                            onChange={(page: any) => setActivePage(page)}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <DeleteModal
                title="Category"
                modalPopup={modalPopup}
                closeModal={closeModal}
                handleDelete={handleDelete}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const mapActionsToProps = {
  getAllProductCategories,
  deleteProductCategories,
};

export default connect(null, mapActionsToProps)(ProductCategories);
