import axios from 'axios';

export class ProvinciaService {    

    getProvincias (){
        return axios.get('http://localhost:8080/api/v1.0/provincia').then(res => res.data.result);
    }
    postProvincias (provin){
        return axios.post('http://localhost:8080/api/v1.0/provincia',provin);
    }
    putProvincias (prov){
        return axios.put('http://localhost:8080/api/v1.0/provincia',prov);
    }
    deleteProvincias (id){
        return axios.delete('http://localhost:8080/api/v1.0/provincia/'+id);
    }
}