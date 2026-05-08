const CLIENT_ID = "269603322713-gp2fcbgpbi0ls37gj07lia99odn3l457.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/calendar.events";
const DRIVE_DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest";
const CALENDAR_DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

let tokenClient;
let gapiInited = false;
let gisInited = false;
let accessToken = null;

// Decodifica o token JWT retornado pelo Google Sign-In para extrair informações do perfil do usuário
function decodeJwtResponse(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

/**
 * Callback after the API client is loaded. Loads the discovery doc to initialize the API.
 */
async function initializeGapiClient() {
    await gapi.client.init({
        discoveryDocs: [DRIVE_DISCOVERY_DOC, CALENDAR_DISCOVERY_DOC],
    });
    gapiInited = true;
    checkBeforeStart();
}

/**
 * Inicializa o cliente Google Identity Services (GIS) para autenticação OAuth2.
 */
function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            accessToken = resp.access_token;
            // IMPORTANTE: Seta o token no gapi.client para que as chamadas de API funcionem
            gapi.client.setToken({ access_token: accessToken });
            
            sessionStorage.setItem('sincDriveToken', accessToken);
            await listDriveFiles();
        },
    });
    gisInited = true;
    checkBeforeStart();
}

function checkBeforeStart() {
    if (gapiInited && gisInited) {
        const storedToken = sessionStorage.getItem('sincDriveToken');
        if (storedToken) {
            accessToken = storedToken;
            gapi.client.setToken({ access_token: accessToken });
            listDriveFiles();
        } else {
             document.getElementById('drive-auth-container').style.display = 'block';
             document.getElementById('drive-list').innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">Clique em "Autorizar" para ver seus arquivos.</div>';
        }
    }
}

/**
 * Busca os arquivos mais recentes do Google Drive do usuário autenticado.
 */
async function listDriveFiles() {
    const driveList = document.getElementById('drive-list');
    const driveLoader = document.getElementById('drive-loader');
    const driveError = document.getElementById('drive-error');
    const authBtn = document.getElementById('drive-auth-container');

    // UI: Mostra o loader e esconde erros/listas anteriores
    driveList.style.display = 'none';
    driveLoader.style.display = 'flex';
    driveError.style.display = 'none';
    authBtn.style.display = 'none';

    try {
        // Chamada à API do Google Drive
        const response = await gapi.client.drive.files.list({
            'pageSize': 10,
            'fields': 'files(id, name, mimeType, webViewLink, iconLink, modifiedTime)',
            'orderBy': 'modifiedTime desc'
        });

        const files = response.result.files;
        driveLoader.style.display = 'none';
        driveList.style.display = 'block';

        if (!files || files.length === 0) {
            driveList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">Nenhum arquivo encontrado.</div>';
            return;
        }

        renderDriveFiles(files);
    } catch (err) {
        console.error('Erro ao listar arquivos do Drive:', err);
        driveLoader.style.display = 'none';
        
        if (err.status === 401) {
            sessionStorage.removeItem('sincDriveToken');
            authBtn.style.display = 'block';
            driveList.style.display = 'block';
            driveList.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--color-text-muted);">Sessão expirada. Autorize novamente.</div>';
        } else if (err.status === 403) {
            driveError.style.display = 'block';
            driveError.innerHTML = 'Erro 403: Verifique se a "Google Drive API" está ativada no Google Cloud Console e se as origens JavaScript estão corretas.';
        } else {
            driveError.style.display = 'block';
            driveError.innerHTML = 'Erro ao carregar arquivos do Drive. Verifique o console para mais detalhes.';
        }
    }
}

/**
 * Renderiza dinamicamente a lista de arquivos no HTML.
 */
function renderDriveFiles(files) {
    const driveList = document.getElementById('drive-list');
    driveList.innerHTML = '';

    files.forEach(file => {
        const item = document.createElement('a');
        item.href = file.webViewLink;
        item.target = '_blank';
        item.className = 'drive-item fade-in';

        // Mapeia ícones baseados no tipo de arquivo
        let icon = '📄'; // Padrão
        if (file.mimeType === 'application/vnd.google-apps.folder') icon = '📁';
        else if (file.mimeType.includes('pdf')) icon = '📕';
        else if (file.mimeType.includes('spreadsheet')) icon = '📊';
        else if (file.mimeType.includes('document')) icon = '📝';
        else if (file.mimeType.includes('presentation')) icon = '📽️';
        else if (file.mimeType.includes('image')) icon = '🖼️';

        const date = new Date(file.modifiedTime).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });

        item.innerHTML = `
            <div class="file-icon">${icon}</div>
            <div class="file-info">
                <span class="file-name">${file.name}</span>
                <span class="file-meta">Modificado em ${date}</span>
            </div>
        `;
        driveList.appendChild(item);
    });
}

/**
 * Lida com a resposta do Google Sign-In após o login bem-sucedido.
 */
function handleCredentialResponse(response) {
    const loginError = document.getElementById('login-error');
    const responsePayload = decodeJwtResponse(response.credential);
    
    // Validação de domínio: Apenas e-mails da SINC (@sincjr.com.br) podem entrar
    if (responsePayload.hd === 'sincjr.com.br' || responsePayload.email.endsWith('@sincjr.com.br')) {
        loginError.style.display = 'none';
        
        // Armazena dados do usuário para persistência na sessão
        sessionStorage.setItem('sincUser', JSON.stringify({
            name: responsePayload.name,
            email: responsePayload.email
        }));
        
        showDashboard(responsePayload.name);
    } else {
        // Exibe erro e revoga acesso para contas não autorizadas
        loginError.style.display = 'block';
        loginError.textContent = "Acesso negado. Utilize seu e-mail @sincjr.com.br";
        
        google.accounts.id.revoke(responsePayload.email, done => {
            console.log('Acesso revogado para conta não autorizada');
        });
    }
}

function showDashboard(userName) {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const userNameSpan = document.getElementById('user-name');
    
    userNameSpan.textContent = userName;
    
    loginOverlay.classList.add('hidden');
    setTimeout(() => {
        loginOverlay.style.display = 'none';
        dashboardContent.style.display = 'block';

        const widgets = document.querySelectorAll('.slide-up');
        widgets.forEach(widget => {
            widget.classList.add('visible');
        });

        // Inicializa APIs do Google se o usuário já estiver logado
        gapi.load('client', initializeGapiClient);
        gisLoaded();
    }, 500);
}

// Função para inicializar o Google Sign-In de forma segura
function initGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
            client_id: CLIENT_ID,
            callback: handleCredentialResponse
        });
        
        const btnContainer = document.getElementById("google-login-btn");
        if (btnContainer) {
            google.accounts.id.renderButton(
                btnContainer,
                { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", text: "continue_with" } 
            );
        }
    } else {
        // Se o script do Google ainda não carregou, tenta novamente em 100ms
        setTimeout(initGoogleSignIn, 100);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('login-overlay');
    const dashboardContent = document.getElementById('dashboard-content');
    const logoutBtn = document.getElementById('logout-btn');
    const authorizeDriveBtn = document.getElementById('authorize-drive-btn');

    // Verifica se já existe um usuário na sessão (Logado)
    const storedUser = sessionStorage.getItem('sincUser');
    if (storedUser) {
        const user = JSON.parse(storedUser);
        showDashboard(user.name);
    } else {
        // Inicia o processo de inicialização do Google Sign-In
        initGoogleSignIn();
    }

    // Botão de Autorizar Drive
    if (authorizeDriveBtn) {
        authorizeDriveBtn.addEventListener('click', () => {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        });
    }

    // Botão de Sair (Logout)
    logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem('sincUser');
        sessionStorage.removeItem('sincDriveToken');
        google.accounts.id.disableAutoSelect();

        dashboardContent.style.display = 'none';
        loginOverlay.style.display = 'flex';
        
        setTimeout(() => {
            loginOverlay.classList.remove('hidden');
        }, 10);

        const widgets = document.querySelectorAll('.slide-up');
        widgets.forEach(widget => {
            widget.classList.remove('visible');
        });
        
        if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
             google.accounts.id.renderButton(
                document.getElementById("google-login-btn"),
                { theme: "filled_black", size: "large", type: "standard", shape: "rectangular", text: "continue_with" }
            );
        }
    });
});
