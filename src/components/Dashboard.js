import React from 'react';
//import { Menu } from 'primereact/menu';
//import { Button } from 'primereact/button';
//import { Chart } from 'primereact/chart';
//import { DataTable } from 'primereact/datatable';
//import { Column } from 'primereact/column';
//import { ProductService } from '../service/ProductService';


const Dashboard = () => {
    return(
        <div className='gridid'>
            <div className="col-12">
                <div className='card'>
                    <h6>Dashboard</h6>
                    <hr/>
                    <h5>INSTITUTO SUPERIOR TECNOLÓGICO JUAN BAUTISTA VASQUEZ</h5>
                    <p>Nombre: Pedro Ordoñez</p>
                </div>
            </div>
        </div>
    )
    }
    const comparisonFn = function (prevProps, nextProps){
        return prevProps.location.pathname === nextProps.location.pathname;
    };
    
export default React.memo(Dashboard, comparisonFn);
