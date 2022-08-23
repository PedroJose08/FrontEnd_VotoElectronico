import axios from "axios";

const url = "http://localhost:8080/api/v1.0/tipoInstitucion";
export class TipoInstitucionService {
    getProductsSmall (){
    return axios.get("http://localhost:8080/api/v1.0/tipoInstitucion").then((res)=> console.log(res));
    }
    getProducts (){
        return axios.get(url).then((res) => res.data.succes && res.data.result);
    }
}