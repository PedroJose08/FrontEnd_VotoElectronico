import axios from 'axios';

export class InstitucionService {    
    getInstitucion (){
        return axios.get('http://localhost:9090/api/v1.0/institucion').then(res => res.data.result);
    }
    postInstitucion (insti){
        return axios.post('http://localhost:9090/api/v1.0/institucion',insti)
    }
    putInstitucion (inst){
        return axios.put('http://localhost:9090/api/v1.0/institucion',inst)
    }
    deleteInstitucion (id){
        return axios.delete('http://localhost:9090/api/v1.0/institucion/' +id)
    }
}