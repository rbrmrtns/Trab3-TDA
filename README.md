# 👨‍💻 Simple Social Media (3º trabalho da disciplina Tópicos em Desenvolvimento de Aplicativos)

## 📋 Como Executar o Projeto
Siga os passos abaixo para baixar, configurar e rodar a aplicação em sua máquina local.


## 🛠 Pré-requisitos
Antes de começar, certifique-se de ter instalado em sua máquina:

* **[Node.js](https://nodejs.org/)** (versão LTS recomendada)
* **[Git](https://git-scm.com/)**
* Dispositivo móvel com o app **Expo Go** instalado (Android ou iOS) **OU** um emulador configurado (**Android Studio** ou **Xcode**).

## 🚀 1. Clonar o Repositório
Abra o seu terminal (CMD, PowerShell, Terminal do VS Code) e execute o comando para baixar os arquivos do projeto:
```bash
git clone https://github.com/rbrmrtns/Trab3-TDA.git
```

Em seguida, entre na pasta do projeto que acabou de ser criada:
```bash
cd Trab3-TDA
```

## 📦 2. Instalar as Dependências
Agora é necessário baixar as bibliotecas (node_modules) que o projeto utiliza.
```bash
npm install
```
 
## 📱 3. Executar a Aplicação
Com tudo instalado, inicie o servidor de desenvolvimento do Expo:
```bash
npx expo start
```

Você verá um **QR Code** no terminal. A partir disso, você tem duas opções:

## 📱 Opção A: Rodar no celular físico

1. Baixe o aplicativo **Expo Go**:
   - Google Play Store (Android)
   - Apple App Store (iOS)

2. Certifique-se de que o **celular e o computador** estejam conectados à **mesma rede Wi-Fi**.

3. **Android**  
   - Abra o **Expo Go** e escaneie o QR Code exibido no terminal.

4. **iOS (iPhone)**  
   - Abra o app **Câmera** padrão do iOS.  
   - Aponte para o QR Code e toque na notificação para abrir no **Expo Go**.

## 💻 Opção B: Rodar no emulador (computador)

1. Garanta que o emulador esteja aberto e em execução:
   - **Android Studio** (Android)
   - **Xcode Simulator** (iOS)

2. No terminal onde você executou `npx expo start`, pressione:
   - **`a`** → abrir no Android  
   - **`i`** → abrir no iOS *(apenas no macOS)*
