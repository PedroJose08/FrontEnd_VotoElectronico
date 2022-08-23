import axios from 'axios';

export class TipoCandidatoService {    
    getTipoCandidato (){
        return axios.get('http://localhost:9090/api/v1.0/tipoCandidato').then(res => res.data.result);
    }
    postTipoCandidato (tipoca){
        return axios.post('http://localhost:9090/api/v1.0/tipoCandidato',tipoca)
    }
    putTipoCandidato (tipoc){
        return axios.put('http://localhost:9090/api/v1.0/tipoCandidato',tipoc)
    }
    deleteTipoCandidato (id){
        return axios.delete('http://localhost:9090/api/v1.0/tipoCandidato/' +id)
    }
}