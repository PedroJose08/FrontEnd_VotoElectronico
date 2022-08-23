import React, { useEffect, useRef, useState } from "react";
import { ToggleButton } from 'primereact/togglebutton';
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from 'primereact/inputswitch';
import { InstitucionService } from "../service/InstitucionService";



const CrudInstitucion = () => {
    let emptyInstitucion = {
        id: null,
        correo: "",
        nombre: "",
        ciudad: "",
        direccion:"",
        telefono: "",
        ruc: "", 
        esActivo: "",
        tipoInstitucion: ""
    };

    const [instituciones, setInstituciones] = useState([]);
    const [institucionDialog, setInstitucionDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [institucion, setInstitucion] = useState(emptyInstitucion);
    const [selectedInstituciones, setSelectedInstituciones] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [switchValue, setSwitchValue] = useState(false);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const instiService = new InstitucionService();
        instiService.getInstitucion().then((data) => setInstituciones(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setInstitucion(emptyInstitucion);
        setSubmitted(false);
        setInstitucionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setInstitucionDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (institucion.nombre.trim()) {
            let _products = [...instituciones];
            let _product = { ...institucion };
            if (institucion.id) {
                const index = findIndexById(institucion.id);

                _products[index] = _product;

                const instiServ = new InstitucionService();
                instiServ.putInstitucion(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Institucion actualizada",
                    life: 3000,
                });
            } else {
                const instiServ = new InstitucionService();
                instiServ.postInstitucion(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Institucion creada",
                    life: 3000,
                });
            }

            setInstituciones(_products);
            setInstitucionDialog(false);
            setInstitucion(emptyInstitucion);
        }
    };

    const editProduct = (product) => {
        setInstitucion({ ...product });
        setInstitucionDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setInstitucion(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = instituciones.filter((val) => val.id !== institucion.id);
        setInstituciones(_products);
        setDeleteProductDialog(false);
        setInstitucion(emptyInstitucion);
        const instiServ = new InstitucionService();
        instiServ.deleteInstitucion(institucion.id);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Institucion eliminada",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < instituciones.length; i++) {
            if (instituciones[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = instituciones.filter((val) => !selectedInstituciones.includes(val));
        setInstituciones(_products);
        setDeleteProductsDialog(false);
        setSelectedInstituciones(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Instituciones eliminadas",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...institucion };
        _product["category"] = e.value;
        setInstitucion(_product);
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...institucion };
        _product[`${nombre}`] = val;

        setInstitucion(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...institucion};
        _product[`${nombre}`] = val;

        setInstitucion(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Id</span>
                {rowData.id}
            </>
        );
    };
    const rucBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ruc</span>
               {rowData.ruc} 
            </>
        );
      };
      const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
      };

      const correoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Correo</span>
               {rowData.correo} 
            </>
        );
      };

      const cityBodyTemplate = (rowData) => {
        return (
            <>
            <span className="p-column-title">Ciudad</span>
            {rowData.ciudad.nombre}
            </>
        );
      };

      const directionBodyTemplate = (rowData) => {
        return (
            <>
            <span className="p-column-title">Direccion</span>
            {rowData.direccion}
            </>
        );
      };

      const celphoneBodyTemplate = (rowData) => {
        return (
            <>
            <span className="p-column-title">Telefono</span>
            {rowData.telefono}
            </>
        );
      };

      const activoBodyTemplate = (rowData) => {
        return(
            <>
            <span className="p-column-title">Activo</span>
            {rowData.esActivo}
            </>
        );
      };

      const institucionBodyTemplate = (rowData) => {
        return (
            <>
            <span className="p-column-title">Institucion</span>
            {rowData.tipoInstitucion.nombre}
            </>
        );
      };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-check" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
            </div>
        );
    };
    /*const ToggleButtonDemo = () => {
        const [checked2, setChecked2] = useState(false);
        return (
            <div>
                <div className="checked">
                    <h5>Customized</h5>
                    <ToggleButton checked={checked2} onChange={(esActivo) => setChecked2(esActivo.value)} onLabel="Activo" offLabel="Inactivo" onIcon="pi pi-check" offIcon="pi pi-times" style={{width: '10em'}} aria-label="Confirmation" />
                </div>
            </div>
        );
    }*/

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Instituciones</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Si" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );
 
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={instituciones}
                        selection={selectedInstituciones}
                        onSelectionChange={(e) => setSelectedInstituciones(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen instituciones registradas."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="ruc" header="Ruc" body={rucBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="correo" header="Correo" body={correoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="ciudad" header="Ciudad" body={cityBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="direccion" header="Direccion" body={directionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="telefono" header="Telefono" body={celphoneBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="esActivo" header="Activo" body={activoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="institucion" header="TipoInstitución" body={institucionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    
                    </DataTable>
                    <Dialog visible={institucionDialog} style={{ width: "450px" }} header="Institucion" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                            <label htmlFor="name">Ruc: {institucion.ruc} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nombre: {institucion.nombre} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="nombre">Activo</label>
                            <InputText
                                id="nombre"
                                value={institucion.esActivo}
                                onChange={(e) => onInputChange(e, "activo")}
                                required
                                className={classNames({
                                    "p-invalid": submitted && !institucion.esActivo
                                })}
                            />
                            {submitted && !institucion.esActivo && <small className="p-invalid"> El estado de la institución</small>}
                        </div>
                    </Dialog>
                    {console.log(institucion)}
     
                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {institucion && (
                                <span>
                                    Está seguro de borrar la institucion <b>{institucion.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {institucion && <span>Está seguro de borrar estas instituciones?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(CrudInstitucion, comparisonFn);