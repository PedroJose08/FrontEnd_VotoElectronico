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
import { TipoCandidatoService } from "../service/TipoCandidatoService";

const CrudTipoCandidato = () => {
    let emptyTipoCandidato = {
            id: "",
            nombre: "",
            institucion: {
              id:"",
              nombre: ""
            }
    };

    const [tiposcandidatos, setTiposcandidatos] = useState([]);
    const [tipocandidatoDialog, setTipocandidatoDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [tipocandidato, setTipocandidato] = useState(emptyTipoCandidato);
    const [selectedTiposcandidatos, setSelectedTiposcandidatos] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const tipocaService = new TipoCandidatoService();
        tipocaService.getTipoCandidato().then((data) => setTiposcandidatos(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    };

    const openNew = () => {
        setTipocandidato(emptyTipoCandidato);
        setSubmitted(false);
        setTipocandidatoDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setTipocandidatoDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (tipocandidato.nombre.trim()) {
            let _products = [...tiposcandidatos];
            let _product = { ...tipocandidato };
            if (tipocandidato.id) {
                const index = findIndexById(tipocandidato.id);

                _products[index] = _product;

                const tipocaService = new TipoCandidatoService();
                tipocaService.putTipoCandidato(_product)
                toast.current.show({
                    severity: "success",
                    summary: "Successful",
                    detail: "TipoCandidato actualizada",
                    life: 3000,
                });
            } else {
                const tipocaService = new TipoCandidatoService();
                tipocaService.postTipoCandidato(_product)
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

            setTiposcandidatos(_products);
            setTipocandidatoDialog(false);
            setTipocandidato(emptyTipoCandidato);
        }
    };

    const editProduct = (product) => {
        setTipocandidato({ ...product });
        setTipocandidatoDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setTipocandidato(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _products = tiposcandidatos.filter((val) => val.id !== tipocandidato.id);
        setTiposcandidatos(_products);
        setDeleteProductDialog(false);
        setTipocandidato(emptyTipoCandidato);
        const tipocaService = new TipoCandidatoService();
        tipocaService.deleteTipoCandidato(tipocandidato.id);

        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "TipoCandidato eliminado",
            life: 3000,
        });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < tiposcandidatos.length; i++) {
            if (tiposcandidatos[i].id === id) {
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
        let _products = tiposcandidatos.filter((val) => !selectedTiposcandidatos.includes(val));
        setTiposcandidatos(_products);
        setDeleteProductsDialog(false);
        setSelectedTiposcandidatos(null);
        toast.current.show({
            severity: "success",
            summary: "Successful",
            detail: "Tipos Candidatos eliminados",
            life: 3000,
        });
    };

    const onCategoryChange = (e) => {
        let _product = { ...tipocandidato };
        _product["category"] = e.value;
        setTipocandidato(_product);
    };

    const onInputChange = (e, nombre) => {
        const val = (e.target && e.target.value) || "";
        let _product = { ...tipocandidato };
        _product[`${nombre}`] = val;

        setTipocandidato(_product);
    };

    const onInputNumberChange = (e, nombre) => {
        const val = e.value || 0;
        let _product = { ...tipocandidato};
        _product[`${nombre}`] = val;

        setTipocandidato(_product);
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
    /*const rucBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Ruc</span>
               {rowData.ruc} 
            </>
        );
      };*/
      const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
      };

      /*const correoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Correo</span>
               {rowData.correo} 
            </>
        );
      };

      const claveBodyTemplate = (rowData) => {
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
      };

      const activoBodyTemplate = (rowData) => {
        return(
            <>
            <span className="p-column-title">Activo</span>
            {rowData.esActivo}
            </>
        );
      };*/

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
            <h5 className="m-0">Tipos de Candidatos</h5>
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
                        value={tiposcandidatos}
                        selection={selectedTiposcandidatos}
                        onSelectionChange={(e) => setSelectedTiposcandidatos(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
                        globalFilter={globalFilter}
                        emptyMessage="No existen tipos de candidatos registrados."
                        header={header}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}></Column>
                        <Column field="code" header="Id" body={codeBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="nombre" header="Nombre" body={nameBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column field="institucion" header="Institución" body={institucionBodyTemplate} headerStyle={{ width: "14%", minWidth: "10rem" }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    
                    </DataTable>

                    <Dialog visible={tipocandidatoDialog} style={{ width: "450px" }} header="TipoCandidato" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    <div className="field">
                            <label htmlFor="name">Id: {tipocandidato.id} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Nombre: {tipocandidato.nombre} </label>
                        </div>
                        <div className="field">
                            <label htmlFor="name">Institucion: {tipocandidato.institucion.nombre} </label>
                        </div>
                    </Dialog>
                    <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirmación" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipocandidato && (
                                <span>
                                    Está seguro de borrar el Tipo de Candidato <b>{tipocandidato.nombre}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                            {tipocandidato && <span>Está seguro de borrar estas instituciones?</span>}
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

export default React.memo(CrudTipoCandidato, comparisonFn);
