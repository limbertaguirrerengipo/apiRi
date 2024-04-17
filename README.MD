

# Ruta del swagger
 - http://localhost:4004/api-docs/

# Ejemplo de una ruta 
 - http://localhost:4004/v1/login 

# Ruta BD
    Server Name: sql.bsite.net\MSSQL2016
    userName:   limbertaguirre_SampleDB
    pass:       admin

# ruta imagenes
http://localhost:4004
                     /static/
                           sorteo/2024/03-000004/512012.jpg_juanPeres.jpeg
http://localhost:4004/static/sorteo/2024/03-000004/512012.jpg_juanPeres.jpeg
 
 -----------------------------------------------------------------
 #servicio Sorteo-------------------------------------------------
 - registrar Sorteo  ok
 - actualizar Sorteo ok
 - Eliminar Sorteo   ok
 - listado de sorteo por fecha  ok
  
 --cliente link
   --obtener sorteo ID  verificar informacion. ok
   -registrar ticket + Cliente ok.. 90%

   -listar detalle ticket por ID sorteo   ok 95%
   - aplicar pago manual
    
   pendiente  semafoto en el tickets
-------------------------------------------------------------------
-------------------------------------------------------------------

# cliente SOMME.COM 30mb
workstation id=bdRifas.mssql.somee.com;
packet size=4096;
user id= limbert_SQLLogin_1 
pwd=on1eikg1fp;
data source= bdRifas.mssql.somee.com ;
persist security info=False;
initial catalog= bdRifas ;
TrustServerCertificate=True

on1eikg1fp

--------------------------------


const jwt = require('jsonwebtoken');

// Token a verificar
const token = 'tu_token_jwt';

// Clave secreta utilizada para firmar el token
const secretKey = 'tu_clave_secreta';

// Verificar el token
jwt.verify(token, secretKey, (err, decoded) => {
  if (err) {
    // El token no es válido o ha expirado
    console.error('El token no es válido o ha expirado');
  } else {
    // El token es válido y no ha expirado
    console.log('El token es válido y no ha expirado');
    console.log('Datos del usuario:', decoded);
  }
});

- azure limbertaguirre@outlook.es
- server : servidornapoles   - servidornapoles.database.windows.net
- bd: bdRifa
- user: adminnapoles
- pss: napoles$123

------
instancia: sqlServer
- user: adminnapoles
- pss: napoles$123
- grupo seguridad: bdsecurity
- 

-AWS , AMAZON EC2
instancia: instarifa
clave: claveRifa
-----------------------------
paso 1:
sudo chmod 400 claveRifa.pem

paso:2 example
ssh -i claveRifa.pem ubuntu@3.138.86.226 
---------------------------------------------
sql server 
- server name : sqlserver.cv0so264uvci.us-east-2.rds.amazonaws.com
- user: adminnapoles
- pss: napoles$123
----------------------------------------------
--linux n server actual ---------------
--------------------------------------------
-paso 1 ubicas el archivo o sudo
-  chmod 400 apirifa.pem
-  ssh ubuntu@18.221.17.185 -i apirifa.pem
---------------------------------------------------
---actualizar ubuntu defecto----------------------------
-    sudo apt update && sudo apt upgrade
-  instalar en ubuntu
-    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
-  rreinicia el bsh
-    source ~/.bashrc
-    source ~/.zshrc
-    . ~/.profile

-- nvm --version
- --instalar node ultima versio
-   nvm install --lts
-   
-correr el proyecto
-- npm start $
--ddetener este procesi
- ps -a
- killall node

-ver proceso
- ps -ef


 <!-- audivip.consultores@gmail.com 
 Gallera2024 -->



