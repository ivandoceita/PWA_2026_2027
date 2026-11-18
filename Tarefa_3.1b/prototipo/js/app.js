// =====================================================================
// Rotas (Vue Router) e arranque da aplicação
// O modo hash (#/...) funciona ao abrir o index.html diretamente no browser.
// =====================================================================

const routes = [
  { path: '/', redirect: '/painel' },
  { path: '/login', component: Login, meta: { publica: true, titulo: 'Entrar' } },
  { path: '/painel', component: Painel, meta: { titulo: 'Painel' } },
  { path: '/animais', component: AnimaisLista, meta: { titulo: 'Animais', menu: 'animais' } },
  { path: '/animais/:id', component: AnimalFicha, meta: { titulo: 'Ficha do animal', menu: 'animais' } },
  { path: '/utilizadores', component: UtilizadoresLista, meta: { titulo: 'Utilizadores' } },
  { path: '/quizzes', component: QuizzesLista, meta: { titulo: 'Quizzes e questões' } },
  // Novas entidades
  { path: '/sponsors', component: SponsorsLista, meta: { titulo: 'Sponsors', menu: 'sponsors' } },
  { path: '/sponsors/novo', component: SponsorForm, meta: { titulo: 'Novo sponsor', menu: 'sponsors' } },
  { path: '/sponsors/:id/editar', component: SponsorForm, meta: { titulo: 'Editar sponsor', menu: 'sponsors' } },
  { path: '/experts', component: ExpertsLista, meta: { titulo: 'Experts', menu: 'experts' } },
  { path: '/experts/novo', component: ExpertForm, meta: { titulo: 'Novo expert', menu: 'experts' } },
  { path: '/experts/:id/editar', component: ExpertForm, meta: { titulo: 'Editar expert', menu: 'experts' } },
  { path: '/:pathMatch(.*)*', component: NaoEncontrado, meta: { titulo: 'Página não encontrada' } }
]

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes,
  scrollBehavior () { return { top: 0 } }
})

// Acesso protegido por password: sem sessão, qualquer página leva ao login
router.beforeEach(to => {
  const sessao = sessionStorage.getItem('animalec-sessao')
  if (!to.meta.publica && !sessao) return { path: '/login', query: { voltar: to.fullPath } }
  if (to.path === '/login' && sessao) return '/painel'
})

router.afterEach(to => {
  document.title = `${to.meta.titulo || 'Back-office'} · Animalec`
})

const app = Vue.createApp({
  data () {
    return {
      bd,
      aviso,
      menuAberto: false,
      menu: [
        { para: '/painel', nome: 'Painel' },
        { para: '/animais', nome: 'Animais' },
        { para: '/utilizadores', nome: 'Utilizadores' },
        { para: '/quizzes', nome: 'Quizzes e questões' },
        { para: '/sponsors', nome: 'Sponsors', novo: 'sponsor' },
        { para: '/experts', nome: 'Experts', novo: 'expert' }
      ]
    }
  },
  computed: {
    publica () { return this.$route.meta.publica },
    utilizador () { return this.$route.fullPath && sessionStorage.getItem('animalec-sessao') }
  },
  watch: {
    $route () { this.menuAberto = false }
  },
  methods: {
    ativo (item) { return this.$route.path.startsWith(item.para) },
    sair () {
      sessionStorage.removeItem('animalec-sessao')
      this.$router.push('/login')
    }
  }
})

app.use(router)
app.mount('#app')
