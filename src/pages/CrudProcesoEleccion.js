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
import { ProcesoEleccionService } from "../service/ProcesoEleccionService";

const CrudProcesoEleccion = () => {
    let emptyProcesoEleccion = {
            id: "",
            nombreproceso: "",
            fechainicio:"",
            fechafinal:"",
            activo:"",
            institucion: {
              nombre:""
            }
    };

    const [procesoseleccion, setProcesosEleccion] = useState([]);
    const [procesoeleccionDialog, setProcesoeleccionDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [procesoeleccion, setProcesoeleccion] = useState(emptyProcesoEleccion);
    const [selectedProcesoseleccion, setSelectedProcesoseleccion] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const tipocaService = new ProcesoEleccionService();
        tipocaService.getProcesoEleccion().then((data) => setProcesosEleccion(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
      setProcesoeleccion(emptyProcesoEleccion);
        setSubmitted(false);
        setProcesoeleccionDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProcesoeleccionDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (procesoeleccion.nombreproceso.trim()) {
            let _products = [...procesoseleccion];
            let _product = { ...procesoeleccion };
            if (procesoeleccion.id) {
                const index = findIndexById(procesoeleccion.id);

                _products[index] = _product;

                const tipocaService = new ProcesoEleccionService();
                tipocaService.putProcesoEleccion(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Proceso de Elección actualizado",
                    life: 3000,
                });
            } else {
                const tipocaService = new ProcesoEleccionService();
                tipocaService.postProcesoEleccion(_product)
                // _product.id = createId();
                // _product.image = "product-placeholder.svg";
                // _products.push(_product);
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "Tipo Candidato creada",
                    life: 3000,
                });
            }

            setProcesosEleccion(_products);
            setProcesoeleccionDialog(false);
            setProcesoeleccion(emptyProcesoEleccion);
        }
    };

    const editProduct = (product) => {
      setProcesoeleccion({ ...product });
      setProcesoeleccionDialog(true);
    };

    const confirmDeleteProduct = (product) => {
      setProcesoeleccion(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = procesoseleccion.filter((val) => val.id !== procesoeleccion.id);
        setProcesosEleccion(_products);
        setDeleteProductDialog(false);
        setProcesoeleccion(emptyProcesoEleccion);
        const tipocaService = new ProcesoEleccionService();
        tipocaService.deleteProcesoEleccion(procesoeleccion.id);

        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Proceso de Elección eliminado",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < procesoseleccion.length; i++) {
            if (procesoseleccion[i].id === id) {
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
        let _products = procesoseleccion.filter((val) => !selectedProcesoseleccion.includes(val));
        setProcesosEleccion(_products);
        setDeleteProductsDialog(false);
        setSelectedProcesoseleccion(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Procesos de Elección eliminados",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...procesoeleccion };
        _product["category"] = e.value;
        setProcesoeleccion(_product);
    };

    const onInputChange = (e, nombreproceso) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...procesoeleccion };
        _product[`${nombreproceso}`] = val;

        setProcesoeleccion(_product);
    };

    const onInputNumberChange = (e, nombreproceso) => {
        const val = e.value || 0;
        let _product = { ...procesoeleccion};
        _product[`${nombreproceso}`] = val;

        setProcesoeleccion(_product);
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
    const fechainicioBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">FechaInicio</span>
               {rowData.fechainicio} 
            </>
        );
      };
      const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">NombreProceso</span>
                {rowData.nombreproceso}
            </>
        );
      };

      const fechafinalBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">FechaFinal</span>
               {rowData.fechafinal} 
            </>
        );
      };

      /*const claveBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Clave</span>
               {rowData.clave} 
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
      };*/

      const activoBodyTemplate = (rowData) => {
        return(
            <>
            <span className="p-column-title">Activo</span>
            {rowData.activo}
            </>
        );
      };

      const institucionBodyTemplate = (rowData) => {
        return (
            <>
            <span className="p-column-title">Institucion</span>
            {rowData.institucion.nombre}
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

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Proceso Elección</h5>
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
                        value={procesoseleccion}
                        selection={selectedProcesoseleccion}
                        onSelectionChange={(e) => setSelectedProcesoseleccion(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen procesos de elección."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombreproceso" header="NombreProceso" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="fechainicio" header="FechaInicio" body={fechainicioBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="fechafinal" header="FechaFinal" body={fechafinalBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="institucion" header="Institución" body={institucionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="activo" header="Activo" body={activoBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    
                    </DataTable>

                    <Dialog visible={procesoeleccionDialog} style={{ width: "450px" }} header="ProcesoElección" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                            <label htmlFor="name">Id: {procesoeleccion.id} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="name">NombreProceso: {procesoeleccion.nombreproceso} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Institucion: {procesoeleccion.institucion.nombre} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="name">FechaInicio: {procesoeleccion.fechainicio} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="name">FechaFinal: {procesoeleccion.fechafinal} </label>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {procesoeleccion && (
                                <span>
                                    Está seguro de borrar el Tipo de Candidato <b>{procesoeleccion.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>*/

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {procesoeleccion && <span>Está seguro de borrar estas instituciones?</span>}
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

export default React.memo(CrudProcesoEleccion, comparisonFn);
