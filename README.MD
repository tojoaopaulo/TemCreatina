# 🎪 Tem creatina growth?

## Installation
Rodar npm install

## Build
Rodar "TSC" na pasta do projeto - Se for rodar especificamente em algum arquivo, tem que especificar o ecma script e etc - (Se não, não vai buildar o projeto do puppeteer )

## Criar appconfig.json na raiz do projeto - Ex.:
## -> A conta que for ser utilizada, precisa ser liberada para app de terceiros nas configs do google | Se houver segundo fator de autenticação, tem que gerar a senha pelo site -> https://security.google.com/settings/security/apppasswords
{
    "growthUser": "usuariogrowth@gmail.com",
    "growthPass": "senhaGrowth",
    "emailFrom": "remetente@gmail.com",
    "emailTo": "destinatario@gmail.com",
    "emailUser": "usuarioremetente@gmail.com",
    "emailPass": "senha"
}