import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as nodemailer from 'nodemailer';

export class Controlador {

  keys: any;
  host: string = 'https://www.gsuplementos.com.br';
  //path: string = '/creatina-monohidratada-250gr-growth-supplements-p985931';
  path: string = '/creatina-250g-creapure-growth-supplements-p985824';
  //path = '/beta-alanina-em-po-growth-supplements';

  async setup(){
    this.keys = await Controlador.LerArquivo("appsettings.json");
  }

  page!: puppeteer.Page;
  TempoEntreAcoes = async (tempoEspera = 0) => {
    if (tempoEspera == 0)
      tempoEspera = 10;

    Controlador.PrintAcao("Esperando: " + tempoEspera + "s");

    // Converte para MS
    tempoEspera *= 1000;

    await this.page.waitForTimeout(tempoEspera);
  };
  //tempoTimeout = 1000;

  async Start() {
    //var interacaoLigada = await Util.LerArquivo("src//configs//app.config");
    let browser;

    //if (interacaoLigada.DeveAutenticar) {
    //browser = await puppeteer.launch({ headless: false });
    //this.page = await browser.newPage();

    //await this.FazerLogin();
    //}
    //else {
    browser = await puppeteer.launch({
      headless: false,
      args: ["--user-data-dir=./Google/Chrome/User Data/"],
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    });
    this.page = await browser.newPage();


    await this.setup();
    await this.FazerLogin();
    await this.RodarFluxo(browser);
  }



  private async RodarFluxo(browser: any) {

    try {

      // teste
      await this.page.goto(this.host + this.path, { waitUntil: 'networkidle0' });

      const [btnComprar] = await this.page.$x("//button[contains(., 'Comprar')]");
      if (btnComprar) {
        Controlador.PrintAcao("TEM CREATINA");
        //await browser.close();

        this.sendMail();
      }
      else
      {
        Controlador.PrintAcao("kkk não tem");
        await this.TempoEntreAcoes(10);
        await this.RodarFluxo(browser);
      }


      //await this.interador.Interagir();
      //
      //if (interacaoLigada.DeixarSeguirPorDiferenca)
      //  await this.deixarSeguir.DeixarDeSeguirPorDiferenca("instagran_do");
      //
      //if (interacaoLigada.DeixarSeguir)
      //  await this.deixarSeguir.DeixarDeSeguir("tojoaopaulo");
      //
      //if (interacaoLigada.GuardarAmigos)
      //  await this.guardador.Executar();
      //
      //if (interacaoLigada.LigarSeguidor)
      //  await this.referencias.BuscarReferencias();
      //
      //await this.page.screenshot({ path: 'out/example.png' });


    } catch (error) {
      console.log(error);

      await this.RodarFluxo(browser);
    }
  }

  static PrintAcao(acao: string) {
    console.log(acao);
  }

  static LerArquivo = async function (nome: string) {
    return JSON.parse(fs.readFileSync(nome, 'utf8'));
  }

  async FazerLogin() {

    await this.page.goto('https://www.gsuplementos.com.br/checkout/acesso', { waitUntil: 'networkidle0' });

    await this.TempoEntreAcoes(1);

    Controlador.PrintAcao("Logando...");


    const [btnLogin] = await this.page.$x("//button[contains(., 'Continuar')]");
    if (btnLogin) {

      //await this.page.focus('[name="usuario"]');
      //await this.page.keyboard.type(keys.growthUser, { delay: 20 });

      await this.page.focus('[name="senha"]');
      await this.page.keyboard.type(this.keys.growthPass, { delay: 20 });

      await this.page.keyboard.press('Enter');

      await this.page.waitForNavigation();

      const [button] = await this.page.$x("//button[contains(., 'Not Now')]");

      // Adicionando espera entre acoes p/ n ficar mt claro objetivo
      await this.TempoEntreAcoes(1);

      if (button) {
        await button.click;
      }
    }
  }

  sendMail()
  {

    let mailOptions = {
      from: this.keys.emailFrom,
      to: this.keys.emailTo,
      subject: "Tem Creatina",
      html: "Tem creatina! CORRE!"
    }

    const transporter = nodemailer.createTransport(
      {
        service: 'gmail',
        auth: {
          user: this.keys.emailUser,
          pass: this.keys.emailPass
        },
        tls: { rejectUnauthorized: false }
      }
    );

    transporter.sendMail(mailOptions, function(error, info) {
      if(error)
        Controlador.PrintAcao(String(error));
      else
        Controlador.PrintAcao("E-mail enviado");
    })

  }
}

(async () => {

  try {
    await new Controlador().Start();

  } catch (error: any) {
    Controlador.PrintAcao("opa ..." + error.message);
  }
})();
