const https = require('https');

var host = 'www.gsuplementos.com.br';
var path = '/creatina-monohidratada-250gr-growth-supplements-p985931';
path = '/creatina-250g-creapure-growth-supplements-p985824';
path = '/beta-alanina-em-po-growth-supplements';

var options = {
    host: host,
    port: 443,
    path: path,
    method: 'POST',
    headers: { 'User-Agent': 'Mozilla/5.0' }
};

var temCreatina = false;

async function verificarPagina()
{
  https.get(options, (resp) => {
    let data = '';
  
    console.log('teste');
  

    // Um bloco de dados foi recebido.
    resp.on('data', (chunk) => {
      data += chunk;
    });
  
    // Toda a resposta foi recebida. Exibir o resultado.
    resp.on('end', () => {
      //console.log(data);
  
      temCreatina = data.search("COMPRAR") > -1;
      console.log(temCreatina);
  
      //console.log(JSON.parse(data).explanation);
      //console.log(data);
    });
  
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  });
  
  if(!temCreatina)
    setTimeout(await verificarPagina, 1000);
  else
    abrirBrowserPraComprar();
}

function abrirBrowserPraComprar()
{
  const open = require('open');
  open(host + path);  
}

async function main(){
  await verificarPagina();

//  abrirBrowserPraComprar();  
}

main();