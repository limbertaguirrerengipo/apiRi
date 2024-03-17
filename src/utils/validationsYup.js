const  yup =  require('yup');
const jsonValidacionLogin = {
    usuario: yup.string().min(3).required(),
    password: yup.string().min(3).required()
};

 const schemaValidarLogin = yup.object(jsonValidacionLogin);

 module.exports = {
    schemaValidarLogin
 }