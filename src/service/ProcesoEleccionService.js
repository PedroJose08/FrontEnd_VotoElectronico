import axios from 'axios';

export class ProcesoEleccionService {   
     
    getProcesoEleccion (){
        return axios.get('http://localhost:9090/api/v1.0/procesoeleccion').then(res => res.data.result);
    }
    postProcesoEleccion (procesoele){
        return axios.post('http://localhost:9090/api/v1.0/procesoeleccion',procesoele)
    }
    putProcesoEleccion (proceso){
        return axios.put('http://localhost:9090/api/v1.0/procesoeleccion',proceso)
    }
    deleteProcesoEleccion (id){
        return axios.delete('http://localhost:9090/api/v1.0/procesoeleccion/' +id)
    }
}