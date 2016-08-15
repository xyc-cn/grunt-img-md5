/**
 * Created by Administrator on 2016/8/12.
 */

function handleStr(prefix,value){

}

function filterHttp(v){
    if (v.substr(0, 7) == "http://" || v.substr(0, 7) == "https:/") {
        return false;
    }
    return true;
}




module.exports = {

};