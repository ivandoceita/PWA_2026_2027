// =====================================================================
// Dados do back-office do Animalec (protótipo)
// Os dados ficam guardados no localStorage do browser. O botão
// "Repor dados de exemplo" do Painel volta a estes valores iniciais.
// =====================================================================

const CHAVE_LOCALSTORAGE = 'animalec-backoffice-v1'

const DADOS_INICIAIS = {
  animais: [
    { id: 1, nome: 'Lince-ibérico', cientifico: 'Lynx pardinus', familia: 'Felidae', habitat: 'Matos mediterrânicos', estado: 'Vulnerável', cor: '#c9a66b' },
    { id: 2, nome: 'Lobo-ibérico', cientifico: 'Canis lupus signatus', familia: 'Canidae', habitat: 'Montanhas e florestas', estado: 'Em perigo', cor: '#7d8c8f' },
    { id: 3, nome: 'Águia-real', cientifico: 'Aquila chrysaetos', familia: 'Accipitridae', habitat: 'Zonas montanhosas', estado: 'Em perigo', cor: '#8d6e4f' },
    { id: 4, nome: 'Golfinho-roaz', cientifico: 'Tursiops truncatus', familia: 'Delphinidae', habitat: 'Estuários e costa', estado: 'Pouco preocupante', cor: '#5b8fb9' },
    { id: 5, nome: 'Tartaruga-comum', cientifico: 'Caretta caretta', familia: 'Cheloniidae', habitat: 'Oceanos tropicais', estado: 'Vulnerável', cor: '#6a994e' },
    { id: 6, nome: 'Elefante-africano', cientifico: 'Loxodonta africana', familia: 'Elephantidae', habitat: 'Savanas africanas', estado: 'Em perigo', cor: '#9e9e9e' }
  ],
  utilizadores: [
    { id: 1, nome: 'Administrador', email: 'admin@animalec.pt', tipo: 'Administrador', pontos: 0 },
    { id: 2, nome: 'Rita Matos', email: 'rita.matos@mail.pt', tipo: 'Utilizador', pontos: 340 },
    { id: 3, nome: 'Carlos Afonso', email: 'carlos.afonso@mail.pt', tipo: 'Utilizador', pontos: 275 },
    { id: 4, nome: 'Inês Bragança', email: 'ines.b@mail.pt', tipo: 'Utilizador', pontos: 190 },
    { id: 5, nome: 'Edson Neto', email: 'edson.neto@mail.st', tipo: 'Utilizador', pontos: 120 }
  ],
  quizzes: [
    {
      id: 1, titulo: 'Conhece o lince-ibérico?', animalId: 1, nivel: 'Fácil',
      questoes: [
        { texto: 'Em que península vive o lince-ibérico?', opcoes: ['Ibérica', 'Itálica', 'Balcânica'], correta: 0 },
        { texto: 'Qual é a principal presa do lince?', opcoes: ['Coelho-bravo', 'Javali', 'Peixe'], correta: 0 }
      ]
    },
    {
      id: 2, titulo: 'Tartarugas marinhas de São Tomé', animalId: 5, nivel: 'Médio',
      questoes: [
        { texto: 'Onde põe os ovos a tartaruga-comum?', opcoes: ['Na areia das praias', 'No fundo do mar', 'Em rochas'], correta: 0 }
      ]
    },
    {
      id: 3, titulo: 'Golfinhos do Sado', animalId: 4, nivel: 'Fácil',
      questoes: [
        { texto: 'O golfinho-roaz é um…', opcoes: ['Mamífero', 'Peixe', 'Réptil'], correta: 0 },
        { texto: 'Como comunicam os golfinhos?', opcoes: ['Por sons e assobios', 'Por cores', 'Não comunicam'], correta: 0 }
      ]
    }
  ],
  // ---------- NOVA ENTIDADE: patrocinadores ----------
  sponsors: [
    { id: 1, nome: 'EcoVerde, Lda.', tipo: 'Empresa', email: 'geral@ecoverde.pt', website: 'https://ecoverde.pt', logotipo: '', animais: [1, 3], inicio: '2026-01-15', ativo: true, mensagem: 'Apoiamos a conservação do lince e da águia-real desde 2026.' },
    { id: 2, nome: 'Fundação Oceano Azul', tipo: 'ONG', email: 'info@oceanoazul.org', website: 'https://oceanoazul.org', logotipo: '', animais: [4, 5], inicio: '2025-09-01', ativo: true, mensagem: 'Pela proteção dos oceanos e das espécies marinhas.' },
    { id: 3, nome: 'Associação Natureza Viva', tipo: 'ONG', email: 'contacto@naturezaviva.pt', website: 'https://naturezaviva.pt', logotipo: '', animais: [2], inicio: '2026-03-10', ativo: true, mensagem: '' },
    { id: 4, nome: 'TechSTP', tipo: 'Empresa', email: 'ola@techstp.st', website: 'https://techstp.st', logotipo: '', animais: [5], inicio: '2026-05-02', ativo: true, mensagem: 'Tecnologia ao serviço das tartarugas de São Tomé e Príncipe.' },
    { id: 5, nome: 'Maria Santos', tipo: 'Particular', email: 'maria.santos@mail.pt', website: '', logotipo: '', animais: [1], inicio: '2024-11-20', ativo: false, mensagem: '' }
  ],
  // ---------- NOVA ENTIDADE: especialistas científicos ----------
  experts: [
    { id: 1, nome: 'Ana Ribeiro', grau: 'Doutoramento', familia: 'Felidae', instituicao: 'Universidade de Évora', email: 'ana.ribeiro@uevora.pt', orcid: '0000-0002-1825-0097', fotografia: '', animais: [1], biografia: 'Investigadora em ecologia de felídeos. Coordena o censo do lince-ibérico no Alentejo.' },
    { id: 2, nome: 'João Costa', grau: 'Doutoramento', familia: 'Delphinidae', instituicao: 'Universidade dos Açores', email: 'joao.costa@uac.pt', orcid: '0000-0001-5109-3700', fotografia: '', animais: [4], biografia: 'Biólogo marinho, estuda populações de cetáceos no Atlântico.' },
    { id: 3, nome: 'Sofia Neves', grau: 'Mestrado', familia: 'Canidae', instituicao: 'UTAD', email: 'sneves@utad.pt', orcid: '', fotografia: '', animais: [2], biografia: 'Acompanha alcateias de lobo-ibérico em Trás-os-Montes.' },
    { id: 4, nome: 'Hugo Lima', grau: 'Doutoramento', familia: 'Cheloniidae', instituicao: 'Universidade de São Tomé e Príncipe', email: 'hugo.lima@ustp.st', orcid: '0000-0003-1415-9269', fotografia: '', animais: [5], biografia: 'Monitoriza as praias de desova de tartarugas marinhas em São Tomé.' },
    { id: 5, nome: 'Marta Pires', grau: 'Doutoramento', familia: 'Accipitridae', instituicao: 'Universidade de Lisboa', email: 'mpires@ulisboa.pt', orcid: '', fotografia: '', animais: [3], biografia: 'Especialista em aves de rapina de montanha.' }
  ]
}

// Listas fixas usadas nos formulários
const TIPOS_SPONSOR = ['Empresa', 'ONG', 'Particular', 'Instituição pública']
const GRAUS_ACADEMICOS = ['Licenciatura', 'Mestrado', 'Doutoramento', 'Pós-doutoramento']

// ---------- "Base de dados" reativa ----------
function carregarDados () {
  try {
    const guardado = localStorage.getItem(CHAVE_LOCALSTORAGE)
    if (guardado) return JSON.parse(guardado)
  } catch (e) { /* localStorage indisponível: usa os dados iniciais */ }
  return JSON.parse(JSON.stringify(DADOS_INICIAIS))
}

const bd = Vue.reactive(carregarDados())

Vue.watch(bd, () => {
  try { localStorage.setItem(CHAVE_LOCALSTORAGE, JSON.stringify(bd)) } catch (e) { /* ignora */ }
}, { deep: true })

function reporDados () {
  const iniciais = JSON.parse(JSON.stringify(DADOS_INICIAIS))
  Object.keys(iniciais).forEach(k => { bd[k] = iniciais[k] })
}

// Operações genéricas (CRUD) para qualquer entidade
const crud = {
  obter (entidade, id) { return bd[entidade].find(r => r.id === Number(id)) },
  inserir (entidade, registo) {
    const id = bd[entidade].reduce((m, r) => Math.max(m, r.id), 0) + 1
    bd[entidade].push({ ...registo, id })
    return id
  },
  atualizar (entidade, registo) {
    const i = bd[entidade].findIndex(r => r.id === registo.id)
    if (i >= 0) bd[entidade][i] = { ...registo }
  },
  remover (entidade, id) {
    bd[entidade] = bd[entidade].filter(r => r.id !== id)
  }
}

// ---------- Funções auxiliares ----------
const util = {
  nomesAnimais (ids) {
    return bd.animais.filter(a => ids.includes(a.id)).map(a => a.nome).join(', ') || '—'
  },
  dataPT (iso) {
    if (!iso) return '—'
    const [a, m, d] = iso.split('-')
    return `${d}/${m}/${a}`
  },
  iniciais (nome) {
    const p = nome.replace(',', '').split(' ').filter(w => w && w[0] === w[0].toUpperCase() && /[A-ZÀ-Ý]/.test(w[0]))
    return ((p[0] || '?')[0] + (p[1] ? p[1][0] : '')).toUpperCase()
  },
  cor (id) {
    const cores = ['#A3742C', '#7A1F2B', '#3E5C76', '#5B5B57', '#8C4A3C', '#2F4A4A']
    return cores[(id - 1) % cores.length]
  },
  titulo (expert) {
    return expert.nome
  }
}

// Mensagens curtas ("toast") depois de guardar ou remover
const aviso = Vue.reactive({ texto: '', tipo: 'sucesso' })
let temporizadorAviso = null
function mostrarAviso (texto, tipo = 'sucesso') {
  aviso.texto = texto
  aviso.tipo = tipo
  clearTimeout(temporizadorAviso)
  temporizadorAviso = setTimeout(() => { aviso.texto = '' }, 3500)
}
