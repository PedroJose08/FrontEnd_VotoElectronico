import axios from 'axios';

export class CiudadService {    
    getCiudades (){
        return axios.get('http://localhost:8080/api/v1.0/ciudad').then(res => res.data.result);
    }
    postCiudades (ciuda){
        return axios.post('http://localhost:8080/api/v1.0/ciudad',ciuda)
    }
    putCiudades (ciud){
        return axios.put('http://localhost:8080/api/v1.0/ciudad',ciud)
    }
    deleteCiudades (id){
        return axios.delete('http://localhost:8080/api/v1.0/ciudad/' +id)
    }
}